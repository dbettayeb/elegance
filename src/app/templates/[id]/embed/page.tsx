import { notFound } from 'next/navigation'
import { TEMPLATES } from '@/lib/templates'
import { Wedding } from '@/lib/types'
import EditModeProvider from '@/components/edit/EditModeProvider'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    mode?: string
    bride?: string; groom?: string
    bride_ar?: string; groom_ar?: string
    venue?: string; date?: string
    intro?: string
    maps_google?: string; maps_apple?: string
  }>
}

/**
 * Bare template render used inside iframes.
 * mode=card  – skips opening screen (catalog grid)
 * mode=edit  – skips opening screen + activates inline contenteditable on [data-ef] elements
 * bride/groom/bride_ar/groom_ar/venue/date – personalised preview values
 */
export default async function TemplateEmbed({ params, searchParams }: Props) {
  const { id } = await params
  const { mode, bride, groom, bride_ar, groom_ar, venue, date, intro, maps_google, maps_apple } = await searchParams
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) notFound()

  const Component = template.component

  const safeName = (v: string | undefined, fallback: string) =>
    v ? String(v).replace(/[<>"'&]/g, '').slice(0, 40).trim() || fallback : fallback
  const safeText = (v: string | undefined, fallback: string) =>
    v ? String(v).replace(/[<>"']/g, '').slice(0, 300).trim() || fallback : fallback
  const safeUrl = (v: string | undefined, fallback: string) =>
    v ? String(v).replace(/[<>"']/g, '').slice(0, 500).trim() || fallback : fallback

  const brideName   = safeName(bride,    'Yasmine')
  const groomName   = safeName(groom,    'Mehdi')
  const brideNameAr = safeName(bride_ar, 'ياسمين')
  const groomNameAr = safeName(groom_ar, 'مهدي')
  const venueName   = safeName(venue,    'Dar El Jeld')
  const introText   = safeText(intro,    'Vous êtes cordialement invités au mariage de')
  const mapsGoogle  = safeUrl(maps_google, 'https://maps.google.com')
  const mapsApple   = safeUrl(maps_apple,  'https://maps.apple.com')
  const eventDate   = date && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T19:00:00`).toISOString()
    : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()

  const mockWedding: Wedding = {
    // 'catalog' triggers opened=true in useInvitationLogic, skipping the opening screen
    id: (mode === 'card' || mode === 'edit') ? 'catalog' : 'preview',
    slug: 'preview',
    access_token: 'preview',
    couple_token: 'preview',
    couple_email: 'demo@example.com',
    bride_name: brideName,
    groom_name: groomName,
    bride_name_ar: brideNameAr,
    groom_name_ar: groomNameAr,
    event_date: eventDate,
    venue_name: venueName,
    venue_address: '5 Rue Dar El Jeld, Tunis 1006, Tunisie',
    gps_google: mapsGoogle,
    gps_apple:  mapsApple,
    template_id: template.id as Wedding['template_id'],
    intro_text: introText,
    custom_message: undefined,
    program: [
      { time: '17:00', event: 'Cérémonie', venue: 'Dar El Jeld' },
      { time: '19:00', event: 'Cocktail de bienvenue', venue: 'Patio andalou' },
      { time: '20:30', event: 'Dîner de gala', venue: 'Salle Sultan' },
      { time: '23:00', event: 'Ouverture du bal', venue: 'Salle Sultan' },
    ],
    parties: [],
    pack: 'prestige',
    show_rsvp: true,
    show_guestbook: true,
    show_countdown: true,
    moderation_on: true,
    status: 'active',
    created_at: new Date().toISOString(),
  }

  const content = <Component wedding={mockWedding} />
  return mode === 'edit' ? <EditModeProvider>{content}</EditModeProvider> : content
}
