import { notFound } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CopyButton } from './copy-button'
export const dynamic = 'force-dynamic'
export default async function AdminWeddingDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createServiceSupabaseClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', id)
    .single()

  if (!wedding) notFound()

  const [{ data: rsvps }, { data: messages }] = await Promise.all([
    supabase.from('rsvps').select('*').eq('wedding_id', id).order('created_at', { ascending: false }),
    supabase.from('guestbook').select('*').eq('wedding_id', id).order('created_at', { ascending: false }),
  ])

  const allRsvps    = rsvps    ?? []
  const allMessages = messages ?? []
  const present     = allRsvps.filter(r => r.status === 'present')
  const totalGuests = present.reduce((acc, r) => acc + r.guests + 1, 0)

  const base      = process.env.NEXT_PUBLIC_BASE_URL
  const inviteUrl = `${base}/i/${wedding.slug}?t=${wedding.access_token}`
  const coupleUrl = `${base}/couple/${wedding.slug}/login`

  return (
    <main style={{ minHeight: '100vh', background: '#FAF7F0', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1108, #2C2416)',
        padding: '28px 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <Link href="/admin" style={{ fontSize: '0.6rem', color: '#9B8A6E', letterSpacing: '0.2em', textDecoration: 'none' }}>
            ← Dashboard
          </Link>
          <h1 style={{
            fontFamily: 'Georgia, serif', fontSize: '1.5rem',
            fontWeight: 300, color: '#FAF7F0', marginTop: '6px',
          }}>
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <p style={{ fontSize: '0.6rem', color: '#9B8A6E', letterSpacing: '0.15em', marginTop: '4px' }}>
            {new Date(wedding.event_date).toLocaleDateString('fr-TN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })} · Pack {wedding.pack}
          </p>
        </div>
        <StatusBadge status={wedding.status} />
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '36px 20px' }}>

        {/* Liens */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>Liens</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {[
              { label: 'Lien invités',        url: inviteUrl },
              { label: 'Lien portail mariés', url: coupleUrl },
              { label: 'Code accès mariés',   url: wedding.couple_token },
            ].map(item => (
              <div key={item.label} style={{
                background: '#fff', border: '1px solid rgba(201,168,76,0.2)',
                padding: '14px 18px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
              }}>
                <div>
                  <p style={{ fontSize: '0.58rem', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#2C2416', wordBreak: 'break-all' }}>
                    {item.url}
                  </p>
                </div>
                <CopyButton text={item.url} />
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>Confirmations ({allRsvps.length})</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px', marginTop: '16px',
          }}>
            {[
              { label: 'Présents',      value: present.length,                                   color: '#2d6a4f' },
              { label: 'Absents',       value: allRsvps.filter(r => r.status === 'absent').length, color: '#c0392b' },
              { label: 'À confirmer',   value: allRsvps.filter(r => r.status === 'maybe').length,  color: '#8B6914' },
              { label: 'Total invités', value: totalGuests,                                        color: '#C9A84C' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#fff', borderTop: `3px solid ${s.color}`,
                border: `1px solid rgba(201,168,76,0.15)`,
                padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontFamily: 'Georgia, serif', fontWeight: 300, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9B8A6E', marginTop: '4px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tableau RSVPs */}
        {allRsvps.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={sectionTitle}>Liste des réponses</h2>
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(201,168,76,0.25)' }}>
                    {['Nom', 'Statut', 'Acc.', 'WhatsApp', 'Note', 'Date'].map(h => (
                      <th key={h} style={{
                        padding: '10px 14px', textAlign: 'left',
                        fontSize: '0.56rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', color: '#C9A84C', fontWeight: 400,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allRsvps.map((r, i) => (
                    <tr key={r.id} style={{
                      borderBottom: '1px solid rgba(201,168,76,0.08)',
                      background: i % 2 === 0 ? '#fff' : '#FAF7F0',
                    }}>
                      <td style={td}>{r.name}</td>
                      <td style={td}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '20px', fontSize: '0.58rem',
                          background: r.status === 'present' ? '#d4edda' : r.status === 'absent' ? '#f8d7da' : '#fff3cd',
                          color:      r.status === 'present' ? '#155724' : r.status === 'absent' ? '#721c24' : '#856404',
                        }}>
                          {r.status === 'present' ? 'Présent' : r.status === 'absent' ? 'Absent' : 'À confirmer'}
                        </span>
                      </td>
                      <td style={td}>{r.guests}</td>
                      <td style={td}>{r.phone ?? '—'}</td>
                      <td style={td}>{r.note ?? '—'}</td>
                      <td style={td}>
                        {new Date(r.created_at).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Messages */}
        <section>
          <h2 style={sectionTitle}>
            Messages livre d'or ({allMessages.length})
            {allMessages.filter(m => !m.approved).length > 0 && (
              <span style={{
                marginLeft: '10px', fontSize: '0.65rem',
                background: '#fff3cd', color: '#856404',
                padding: '2px 10px', borderRadius: '20px',
              }}>
                {allMessages.filter(m => !m.approved).length} en attente
              </span>
            )}
          </h2>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allMessages.length === 0 ? (
              <p style={{ color: '#9B8A6E', fontStyle: 'italic', fontSize: '0.88rem' }}>
                Aucun message pour l'instant.
              </p>
            ) : (
              allMessages.map(msg => (
                <div key={msg.id} style={{
                  borderLeft: `3px solid ${msg.approved ? '#C9A84C' : '#ddd'}`,
                  padding: '14px 18px', background: '#fff',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: '12px',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <strong style={{ fontSize: '0.8rem', color: '#2C2416' }}>{msg.author_name}</strong>
                      <span style={{ fontSize: '0.62rem', color: '#9B8A6E' }}>
                        {new Date(msg.created_at).toLocaleDateString('fr-TN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                      {!msg.approved && (
                        <span style={{
                          fontSize: '0.56rem', background: '#fff3cd',
                          color: '#856404', padding: '1px 7px', borderRadius: '10px',
                        }}>En attente</span>
                      )}
                    </div>
                    <p style={{
                      fontFamily: 'Georgia, serif', fontSize: '0.92rem',
                      fontStyle: 'italic', color: '#6B5A3E', lineHeight: 1.6,
                    }}>
                      "{msg.message}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  )
}

// ── Sous-composants ──
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    active:    { bg: '#d4edda', text: '#155724' },
    archived:  { bg: '#e2e3e5', text: '#383d41' },
    suspended: { bg: '#f8d7da', text: '#721c24' },
  }
  const c = colors[status] ?? colors.active
  return (
    <span style={{
      padding: '6px 16px', borderRadius: '20px',
      fontSize: '0.6rem', letterSpacing: '0.15em',
      textTransform: 'uppercase', background: c.bg, color: c.text,
    }}>
      {status}
    </span>
  )
}



const sectionTitle: React.CSSProperties = {
  fontFamily: 'Georgia, serif', fontSize: '1.1rem',
  fontWeight: 300, color: '#2C2416',
  borderBottom: '1px solid rgba(201,168,76,0.25)',
  paddingBottom: '8px',
  display: 'flex', alignItems: 'center',
}

const td: React.CSSProperties = {
  padding: '10px 14px', fontSize: '0.8rem', color: '#2C2416',
}