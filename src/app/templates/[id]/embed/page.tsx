import { notFound } from 'next/navigation'
import { TEMPLATES } from '@/lib/templates'
import { Wedding, ProgramItem } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    mode?: string
    bride?: string; groom?: string
    bride_ar?: string; groom_ar?: string
    venue?: string; venue_address?: string
    date?: string; time?: string
    intro?: string
    custom_message?: string
    wedding_day_text?: string
    maps_google?: string; maps_apple?: string
    program?: string
    show_program?: string
    show_countdown?: string; show_rsvp?: string
    show_guestbook?: string; moderation_on?: string
    guest_invite_enabled?: string
  }>
}

const DEFAULT_PROGRAM: ProgramItem[] = [
  { time: '17:00', event: 'Cérémonie', venue: 'Dar El Jeld' },
  { time: '19:00', event: 'Cocktail de bienvenue', venue: 'Patio andalou' },
  { time: '20:30', event: 'Dîner de gala', venue: 'Salle Sultan' },
  { time: '23:00', event: 'Ouverture du bal', venue: 'Salle Sultan' },
]

export default async function TemplateEmbed({ params, searchParams }: Props) {
  const { id } = await params
  const {
    mode, bride, groom, bride_ar, groom_ar,
    venue, venue_address, date, time,
    intro, custom_message, wedding_day_text,
    maps_google, maps_apple,
    program: programParam, show_program,
    show_countdown, show_rsvp, show_guestbook, moderation_on,
    guest_invite_enabled,
  } = await searchParams

  const template = TEMPLATES.find(t => t.id === id)
  if (!template) notFound()

  const Component = template.component

  const safeName = (v: string | undefined, fallback: string) =>
    v ? String(v).replace(/[<>"'&]/g, '').slice(0, 40).trim() || fallback : fallback
  const safeText = (v: string | undefined, fallback: string) =>
    v ? String(v).replace(/[<>"']/g, '').slice(0, 600).trim() || fallback : fallback
  const safeUrl = (v: string | undefined, fallback: string) =>
    v ? String(v).replace(/[<>"']/g, '').slice(0, 500).trim() || fallback : fallback
  const bool = (v: string | undefined, fallback: boolean) =>
    v === undefined ? fallback : v !== '0'

  // ── Date + heure ─────────────────────────────────────────────
  // On NE convertit PAS via toISOString() pour préserver le fuseau
  // local de l'utilisateur : "2026-06-23T18:00:00" reste 18 h
  // partout (côté navigateur, c'est interprété comme heure locale).
  const timeStr = time && /^\d{2}:\d{2}$/.test(time) ? time : '19:00'
  const eventDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? `${date}T${timeStr}:00`
    : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19)

  // ── Programme ────────────────────────────────────────────────
  // Si show_program === '0' → tableau vide (pas de fallback)
  // Sinon → ce que l'utilisateur a saisi (même vide), ou défaut s'il
  // n'a jamais touché au champ (paramètre absent).
  let program: ProgramItem[] = DEFAULT_PROGRAM
  if (show_program === '0') {
    program = []
  } else if (programParam !== undefined) {
    try {
      const parsed = JSON.parse(decodeURIComponent(programParam))
      if (Array.isArray(parsed)) {
        program = parsed.slice(0, 20).map((item: Record<string, string>) => ({
          time:  String(item.time  ?? '').slice(0, 10),
          event: String(item.event ?? '').slice(0, 100),
          venue: item.venue ? String(item.venue).slice(0, 100) : undefined,
        }))
      }
    } catch { /* keep default */ }
  }

  const mockWedding: Wedding = {
    id: mode === 'card' ? 'catalog' : 'preview',
    slug: 'preview',
    access_token: 'preview',
    couple_token: 'preview',
    couple_email: 'demo@example.com',
    bride_name:    safeName(bride,    'Yasmine'),
    groom_name:    safeName(groom,    'Mehdi'),
    bride_name_ar: safeName(bride_ar, 'ياسمين'),
    groom_name_ar: safeName(groom_ar, 'مهدي'),
    event_date:    eventDate,
    venue_name:    safeName(venue,         'Dar El Jeld'),
    venue_address: safeText(venue_address, '5 Rue Dar El Jeld, Tunis 1006, Tunisie'),
    gps_google:    safeUrl(maps_google,    'https://maps.google.com'),
    gps_apple:     safeUrl(maps_apple,     'https://maps.apple.com'),
    template_id:   template.id as Wedding['template_id'],
    intro_text:        intro            !== undefined ? safeText(intro, '')            : 'Vous êtes cordialement invités au mariage de',
    custom_message:    custom_message   !== undefined ? safeText(custom_message, '')   : undefined,
    wedding_day_text:  wedding_day_text !== undefined ? safeText(wedding_day_text, '') : undefined,
    program,
    parties: [],
    pack: 'prestige',
    show_countdown: bool(show_countdown, true),
    show_rsvp:      bool(show_rsvp,      true),
    show_guestbook: bool(show_guestbook,  true),
    moderation_on:  bool(moderation_on,   true),
    guest_invite_enabled: bool(guest_invite_enabled, false),
    status: 'active',
    created_at: new Date().toISOString(),
  }

  return <Component wedding={mockWedding} />
}
