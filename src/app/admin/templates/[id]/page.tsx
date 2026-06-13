import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TEMPLATES, getTemplate } from '@/lib/templates'
import { Wedding } from '@/lib/types'

export default async function TemplatePreview({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const template = TEMPLATES.find(t => t.id === id)
  if (!template) notFound()

  const Component = template.component

  // Données fictives pour la preview
  const mockWedding: Wedding = {
    id: 'preview',
    slug: 'preview',
    access_token: 'preview',
    couple_token: 'preview',
    couple_email: 'preview@example.com',
    bride_name: 'Yasmine',
    groom_name: 'Mehdi',
    event_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    venue_name: 'Dar El Jeld',
    venue_address: '5 Rue Dar El Jeld, Tunis 1006, Tunisie',
    gps_google: 'https://maps.google.com',
    gps_apple: 'https://maps.apple.com',
    template_id: template.id,
    intro_text: 'Vous êtes cordialement invités au mariage de',
    custom_message: 'Avec joie et émotion, nous vous invitons à partager ce moment unique qui scellera notre union et marquera le début de notre aventure à deux.',
    program: [
      { time: '17:00', event: 'Cérémonie religieuse', venue: 'Dar El Jeld' },
      { time: '19:00', event: 'Cocktail de bienvenue', venue: 'Patio andalou' },
      { time: '20:30', event: 'Dîner de gala', venue: 'Salle Sultan' },
      { time: '23:00', event: 'Ouverture du bal', venue: 'Salle Sultan' },
    ],
    pack: 'haute_couture',
    show_rsvp: true,
    show_guestbook: true,
    show_countdown: true,
    moderation_on: true,
    status: 'active',
    created_at: new Date().toISOString(),
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Bandeau preview en haut */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(23, 23, 23, 0.95)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        padding: '12px 20px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/admin/templates" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '0.85rem',
          }}>
            ← Catalogue
          </Link>
          <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{template.name}</div>
            <div style={{ fontSize: '0.72rem', opacity: 0.6 }}>
              Aperçu avec données fictives — ID : {template.id}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            padding: '3px 9px',
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 500,
          }}>
            APERÇU
          </span>
          <Link
            href="/admin/new"
            style={{
              padding: '6px 14px',
              background: 'white',
              color: '#171717',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            Utiliser ce template
          </Link>
        </div>
      </div>

      {/* Espace pour le bandeau */}
      <div style={{ paddingTop: '52px' }}>
        <Component wedding={mockWedding} />
      </div>
    </div>
  )
}

// Désactiver la sidebar admin sur cette page (preview plein écran)
export const dynamic = 'force-static'