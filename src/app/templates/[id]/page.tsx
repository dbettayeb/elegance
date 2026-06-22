import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TEMPLATES } from '@/lib/templates'
import { Wedding } from '@/lib/types'
import PublicShell from '@/components/public/PublicShell'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) return { title: 'Design introuvable' }
  return {
    title: `${template.name} · Élégance Digitale`,
    description: template.description,
  }
}

export default async function PublicTemplatePreview({ params }: Props) {
  const { id } = await params
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) notFound()

  const Component = template.component

  const mockWedding: Wedding = {
    id: 'preview',
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
    template_id: template.id,
    intro_text: 'Vous êtes cordialement invités au mariage de',
    custom_message: 'Avec joie et émotion, nous vous invitons à partager ce moment unique qui scellera notre union.',
    program: [
      { time: '17:00', event: 'Cérémonie', venue: 'Dar El Jeld' },
      { time: '19:00', event: 'Cocktail de bienvenue', venue: 'Patio andalou' },
      { time: '20:30', event: 'Dîner de gala', venue: 'Salle Sultan' },
      { time: '23:00', event: 'Ouverture du bal', venue: 'Salle Sultan' },
    ],
    pack: 'prestige',
    show_rsvp: true,
    show_guestbook: true,
    show_countdown: true,
    moderation_on: true,
    status: 'active',
    created_at: new Date().toISOString(),
  }

  return (
    <PublicShell>
      <style>{CSS}</style>

      <div className="ptp-bar">
        <div className="ptp-bar-inner">
          <Link href="/templates" className="ptp-back">← Tous les designs</Link>
          <div className="ptp-info">
            <span className="ptp-info-name">{template.name}</span>
            <span className="ptp-info-tag">Aperçu démo</span>
          </div>
          <Link href={`/commander?template=${template.id}`} className="ptp-cta">
            Choisir ce design →
          </Link>
        </div>
      </div>

      <div className="ptp-content">
        <Component wedding={mockWedding} />
      </div>
    </PublicShell>
  )
}

const CSS = `
  /* On template preview pages the ptp-bar already provides navigation — hide the site header/footer */
  .pub-header { display: none !important; }
  .pub-footer { display: none !important; }

  .ptp-bar {
    position: sticky; top: 0; z-index: 100000;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--pub-border);
  }
  .ptp-bar-inner {
    max-width: 1180px; margin: 0 auto; padding: 14px 28px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .ptp-back { color: var(--pub-text-muted); text-decoration: none; font-size: 0.82rem; }
  .ptp-back:hover { color: var(--pub-text); }
  .ptp-info { display: flex; align-items: center; gap: 12px; }
  .ptp-info-name { font-family: Georgia, serif; font-size: 1rem; }
  .ptp-info-tag {
    padding: 3px 9px; background: rgba(184,152,90,0.15);
    color: var(--pub-gold-dark); font-size: 0.66rem;
    letter-spacing: 0.2em; text-transform: uppercase; border-radius: 2px;
  }
  .ptp-cta {
    padding: 9px 20px; background: var(--pub-text); color: #fff;
    text-decoration: none; font-size: 0.72rem;
    letter-spacing: 0.2em; text-transform: uppercase;
    font-weight: 500; white-space: nowrap; transition: opacity 0.2s;
  }
  .ptp-cta:hover { opacity: 0.85; }

  /* Offset so the sticky bar never covers the first pixels of the template content */
  .ptp-content { padding-top: 60px; }

  @media (max-width: 720px) {
    .ptp-info { display: none; }
    .ptp-bar-inner { padding: 12px 18px; }
    .ptp-cta { padding: 7px 14px; font-size: 0.66rem; }
    .ptp-content { padding-top: 46px; }
  }
`