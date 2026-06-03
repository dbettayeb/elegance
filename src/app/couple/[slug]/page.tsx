import { notFound } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { RSVP, GuestMessage } from '@/lib/types'
import MessageCard from '@/components/couple-portal/MessageCard'

export const dynamic = 'force-dynamic'

export default async function CouplePortal({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createServiceSupabaseClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id, bride_name, groom_name, event_date, moderation_on')
    .eq('slug', slug)
    .single()

  if (!wedding) notFound()

  // Fetch RSVPs + messages en parallèle
  const [{ data: rsvps }, { data: messages }] = await Promise.all([
    supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_id', wedding.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('guestbook')
      .select('*')
      .eq('wedding_id', wedding.id)
      .order('created_at', { ascending: false }),
  ])

  const allRsvps    = (rsvps    ?? []) as RSVP[]
  const allMessages = (messages ?? []) as GuestMessage[]

  const present  = allRsvps.filter(r => r.status === 'present')
  const absent   = allRsvps.filter(r => r.status === 'absent')
  const maybe    = allRsvps.filter(r => r.status === 'maybe')
  const pending  = allMessages.filter(m => !m.approved)
  const approved = allMessages.filter(m => m.approved)

  const totalGuests = present.reduce((acc, r) => acc + r.guests + 1, 0)

  const eventDate = new Date(wedding.event_date).toLocaleDateString('fr-TN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <main style={{ minHeight: '100vh', background: '#FAF7F0', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2C2416, #3d2e18)',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{ color: '#C9A84C', marginBottom: '12px' }}>✦</div>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
          fontWeight: 300,
          color: '#FAF7F0',
          marginBottom: '6px',
        }}>
          {wedding.bride_name} & {wedding.groom_name}
        </h1>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: '#9B8A6E', textTransform: 'uppercase' }}>
          {eventDate}
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Stats RSVP */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={sectionTitle}>Confirmations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '20px' }}>
            {[
              { label: 'Présents',         value: present.length,  accent: '#2d6a4f' },
              { label: 'Absents',          value: absent.length,   accent: '#c0392b' },
              { label: 'À confirmer',      value: maybe.length,    accent: '#8B6914' },
              { label: 'Total invités',    value: totalGuests,     accent: '#C9A84C' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#fff',
                border: `1px solid rgba(201,168,76,0.2)`,
                borderTop: `3px solid ${stat.accent}`,
                padding: '20px 16px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2.2rem', fontFamily: 'Georgia, serif', fontWeight: 300, color: stat.accent }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9B8A6E', marginTop: '6px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tableau RSVPs */}
        {allRsvps.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={sectionTitle}>Liste des réponses ({allRsvps.length})</h2>
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(201,168,76,0.3)' }}>
                    {['Nom', 'Statut', 'Accompagnants', 'WhatsApp', 'Date'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: '0.58rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', color: '#C9A84C',
                        fontWeight: 400,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allRsvps.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.1)', background: i % 2 === 0 ? '#fff' : '#FAF7F0' }}>
                      <td style={tdStyle}>{r.name}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '0.6rem',
                          letterSpacing: '0.1em',
                          background: r.status === 'present' ? '#d4edda' : r.status === 'absent' ? '#f8d7da' : '#fff3cd',
                          color:      r.status === 'present' ? '#155724' : r.status === 'absent' ? '#721c24' : '#856404',
                        }}>
                          {r.status === 'present' ? 'Présent(e)' : r.status === 'absent' ? 'Absent(e)' : 'À confirmer'}
                        </span>
                      </td>
                      <td style={tdStyle}>{r.guests}</td>
                      <td style={tdStyle}>{r.phone ?? '—'}</td>
                      <td style={tdStyle}>
                        {new Date(r.created_at).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Messages en attente */}
        {wedding.moderation_on && pending.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={sectionTitle}>
              En attente d'approbation
              <span style={{
                marginLeft: '12px', fontSize: '0.7rem',
                background: '#fff3cd', color: '#856404',
                padding: '3px 10px', borderRadius: '20px',
              }}>
                {pending.length}
              </span>
            </h2>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pending.map(msg => (
                <MessageCard
                  key={msg.id}
                  message={msg}
                  weddingId={wedding.id}
                  coupleToken={''} // lu depuis le cookie côté client
                />
              ))}
            </div>
          </section>
        )}

        {/* Messages approuvés */}
        <section>
          <h2 style={sectionTitle}>Livre d'or ({approved.length} messages)</h2>
          {approved.length === 0 ? (
            <p style={{ color: '#9B8A6E', fontStyle: 'italic', marginTop: '16px', fontSize: '0.9rem' }}>
              Aucun message approuvé pour l'instant.
            </p>
          ) : (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {approved.map(msg => (
                <MessageCard
                  key={msg.id}
                  message={msg}
                  weddingId={wedding.id}
                  coupleToken={''}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  )
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontSize: '1.2rem',
  fontWeight: 300,
  color: '#2C2416',
  borderBottom: '1px solid rgba(201,168,76,0.3)',
  paddingBottom: '10px',
  display: 'flex',
  alignItems: 'center',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '0.82rem',
  color: '#2C2416',
}