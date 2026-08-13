import { Wedding, Party } from '@/lib/types'
import { SOIREE_AR, SOIREE_FR } from '@/lib/soiree-strings'
import { getEventEnd } from '@/lib/event-time'

// Repli quand le marié n'a pas renseigné d'heure de fin.
const DEFAULT_DURATION_HOURS = 4

export interface CalendarEvent {
  title: string
  /** iCalendar stamp. Ends with Z when absolute, bare when floating. */
  dtStart: string
  dtEnd: string
  location: string
  description: string
}

/** 20260828T190000Z — an absolute instant. */
function absoluteStamp(d: Date, addHours = 0) {
  const shifted = new Date(d.getTime() + addHours * 3600_000)
  return shifted.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/**
 * 20260828T190000 — a floating time, meaning "this wall clock, wherever the
 * guest is". Built from the raw parts so the server's own timezone never
 * shifts it.
 */
function floatingStamp(date: string, time: string, addHours = 0) {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = (time || '00:00').split(':').map(Number)
  if ([y, m, d, hh, mm].some(Number.isNaN)) return null
  const dt = new Date(Date.UTC(y, m - 1, d, hh + addHours, mm))
  return dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '')
}

/** RFC 5545 §3.3.11: escape backslash, semicolon, comma and newline. */
function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/** RFC 5545 §3.1: fold lines at 75 octets, continuations start with a space. */
function foldIcsLine(line: string) {
  if (line.length <= 75) return line
  const parts: string[] = [line.slice(0, 75)]
  let rest = line.slice(75)
  while (rest.length > 74) {
    parts.push(' ' + rest.slice(0, 74))
    rest = rest.slice(74)
  }
  if (rest) parts.push(' ' + rest)
  return parts.join('\r\n')
}

function venueLine(name: string, address?: string) {
  return [name, address].filter(Boolean).join(', ')
}

function partyEvent(party: Party, couple: string): CalendarEvent | null {
  const dtStart = floatingStamp(party.date, party.time)
  const dtEnd = floatingStamp(party.date, party.time, DEFAULT_DURATION_HOURS)
  if (!dtStart || !dtEnd) return null

  const title = party.title || 'Célébration'
  return {
    title: `${title} — ${couple}`,
    dtStart,
    dtEnd,
    location: venueLine(party.venue_name, party.venue_address),
    description: `${title} — mariage de ${couple}.`,
  }
}

/**
 * The main reception first, then each additional celebration when the couple
 * chose to show them.
 *
 * The reception is absolute: event_date is a real timestamp and the templates
 * render it through toLocaleTimeString, so the calendar entry lands on the same
 * moment the guest reads on the invitation. A Party instead stores a bare date
 * and time that the templates print as typed, so it stays floating.
 */
export function getCalendarEvents(wedding: Wedding): CalendarEvent[] {
  const couple = `${wedding.bride_name} & ${wedding.groom_name}`
  const start = new Date(wedding.event_date)

  // Soirée nomme lui-même son événement — henné, fiançailles, réception — et
  // ce titre est ce que l'invité a lu sur l'invitation : c'est donc lui qui
  // doit apparaître dans son agenda, pas un « Mariage de » générique.
  const soireeStrings =
    wedding.template_id === 'soiree_ar' ? SOIREE_AR :
    wedding.template_id === 'soiree_fr' ? SOIREE_FR : null
  const title = soireeStrings
    ? (wedding.wedding_day_text?.trim() || soireeStrings.heroTitleDefault)
    : `Mariage de ${couple}`

  // La fin renseignée par le marié prime sur la durée forfaitaire.
  const end = getEventEnd(wedding)

  const events: CalendarEvent[] = [{
    title,
    dtStart: absoluteStamp(start),
    dtEnd: end ? absoluteStamp(end) : absoluteStamp(start, DEFAULT_DURATION_HOURS),
    location: venueLine(wedding.venue_name, wedding.venue_address),
    description: `Vous êtes cordialement invités au mariage de ${couple}.`,
  }]

  if (wedding.show_celebrations !== false && Array.isArray(wedding.parties)) {
    for (const party of wedding.parties) {
      if (!party?.date) continue
      const event = partyEvent(party, couple)
      if (event) events.push(event)
    }
  }

  return events
}

/** A complete .ics document holding every event of the wedding. */
export function buildIcs(wedding: Wedding): string {
  const stamp = absoluteStamp(new Date())

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Elegance Digitale//Invitation//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  getCalendarEvents(wedding).forEach((event, index) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${wedding.id}-${index}@elegance-digitale`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${event.dtStart}`,
      `DTEND:${event.dtEnd}`,
      `SUMMARY:${escapeIcsText(event.title)}`,
      `LOCATION:${escapeIcsText(event.location)}`,
      `DESCRIPTION:${escapeIcsText(event.description)}`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(event.title)}`,
      'END:VALARM',
      'END:VEVENT',
    )
  })

  lines.push('END:VCALENDAR')

  // RFC 5545 requires CRLF line endings.
  return lines.map(foldIcsLine).join('\r\n') + '\r\n'
}

/** Google Calendar only takes one event, so it gets the main reception. */
export function buildGoogleCalendarUrl(wedding: Wedding): string {
  const [event] = getCalendarEvents(wedding)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.dtStart}/${event.dtEnd}`,
    details: event.description,
    location: event.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function icsFileName(wedding: Wedding): string {
  return `mariage-${wedding.slug || 'invitation'}.ics`
}
