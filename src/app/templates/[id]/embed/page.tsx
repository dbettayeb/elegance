import { notFound } from 'next/navigation'
import { TEMPLATES } from '@/lib/templates'
import { Wedding } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mode?: string }>
}

/**
 * Bare template render used inside iframes.
 * - Default (no params): full experience with opening screen
 * - ?mode=card: skips the opening screen, shows the invitation card directly
 *   Used by the catalog grid to display a live preview of the content.
 */
export default async function TemplateEmbed({ params, searchParams }: Props) {
  const { id } = await params
  const { mode } = await searchParams
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) notFound()

  const Component = template.component

  const mockWedding: Wedding = {
    // 'catalog' triggers opened=true in useInvitationLogic, skipping the opening screen
    id: mode === 'card' ? 'catalog' : 'preview',
    slug: 'preview',
    access_token: 'preview',
    couple_token: 'preview',
    couple_email: 'demo@example.com',
    bride_name: 'Yasmine',
    groom_name: 'Mehdi',
    bride_name_ar: 'ياسمين',
    groom_name_ar: 'مهدي',
    event_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    venue_name: 'Dar El Jeld',
    venue_address: '5 Rue Dar El Jeld, Tunis 1006, Tunisie',
    gps_google: 'https://maps.google.com',
    gps_apple: 'https://maps.apple.com',
    template_id: template.id as Wedding['template_id'],
    intro_text: 'Vous êtes cordialement invités au mariage de',
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

  return <Component wedding={mockWedding} />
}
