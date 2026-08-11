'use client'
import { Wedding } from '@/lib/types'
import { buildGoogleCalendarUrl } from '@/lib/calendar'

/**
 * "Add to Google Calendar" for the RSVP section.
 *
 * Named after the destination on purpose: the link opens Google Calendar in
 * the browser, so a guest who taps it knows what to expect.
 *
 * The .ics path (src/lib/calendar.ts + /api/calendar) still exists for Apple
 * and Outlook, it is simply not offered here yet.
 *
 * Colours are inherited (currentColor) so the button sits well in every
 * template, light or dark, without each one needing its own rule.
 */
export default function AddToCalendar({ wedding }: { wedding: Wedding }) {
  return (
    <div className="adc-wrap">
      <style>{CSS}</style>

      <a
        className="adc-trigger"
        href={buildGoogleCalendarUrl(wedding)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="adc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        Ajouter à Google Agenda
      </a>
    </div>
  )
}

const CSS = `
.adc-wrap {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}
.adc-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 22px;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 2px;
  color: inherit;
  font: inherit;
  font-size: 12px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  text-decoration: none;
  opacity: 0.75;
  cursor: pointer;
  transition: opacity 0.25s ease;
}
.adc-trigger:hover { opacity: 1; }
.adc-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
`
