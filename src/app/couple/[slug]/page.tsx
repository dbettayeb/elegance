import { notFound } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { RSVP, GuestMessage, Wedding } from '@/lib/types'
import { getTheme, themeToCSS } from '@/lib/couple-themes'
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
    .select('*')
    .eq('slug', slug)
    .single()

  if (!wedding) notFound()

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

  const allRsvps = (rsvps ?? []) as RSVP[]
  const allMessages = (messages ?? []) as GuestMessage[]

  const present = allRsvps.filter(r => r.status === 'present')
  const absent = allRsvps.filter(r => r.status === 'absent')
  const maybe = allRsvps.filter(r => r.status === 'maybe')
  const pending = allMessages.filter(m => !m.approved)
  const approved = allMessages.filter(m => m.approved)
  const totalGuests = present.reduce((acc, r) => acc + r.guests + 1, 0)

  const eventDate = new Date(wedding.event_date).toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const theme = getTheme(wedding.template_id as Wedding['template_id'])
  const isDark = ['nuit_etoilee', 'marbre_noir'].includes(wedding.template_id)

  return (
    <>
      <style>{`
        :root {
          ${themeToCSS(theme)}
        }
        body {
          background: var(--cp-page-bg);
          color: var(--cp-text-primary);
          font-family: var(--cp-body-font);
          margin: 0;
        }
        .cp-shell {
          min-height: 100vh;
        }
        .cp-header {
          background: ${theme.headerBg};
          padding: 48px 24px;
          text-align: center;
          color: ${isDark ? theme.textPrimary : '#FAF7F0'};
        }
        .cp-header-orn {
          color: var(--cp-accent);
          font-size: 1.3rem;
          margin-bottom: 12px;
          letter-spacing: 0.5em;
        }
        .cp-header-names {
          font-family: var(--cp-heading-font);
          font-size: clamp(1.8rem, 4.5vw, 2.4rem);
          font-weight: 300;
          margin: 0 0 6px;
        }
        .cp-header-date {
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0.8;
        }
        .cp-container {
          max-width: 920px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .cp-section {
          margin-bottom: 40px;
        }
        .cp-section-title {
          font-family: var(--cp-heading-font);
          font-size: 1.15rem;
          font-weight: 400;
          color: var(--cp-text-primary);
          border-bottom: 1px solid var(--cp-border-strong);
          padding-bottom: 10px;
          margin: 0 0 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cp-section-title-badge {
          font-family: var(--cp-body-font);
          font-size: 0.7rem;
          font-weight: 500;
          padding: 2px 9px;
          border-radius: 20px;
          background: var(--cp-accent-soft);
          color: var(--cp-accent-text);
        }
        .cp-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 14px;
        }
        .cp-stat-card {
          background: var(--cp-card-bg);
          border: 1px solid var(--cp-border);
          border-radius: var(--cp-radius);
          padding: 20px 16px;
          text-align: center;
          box-shadow: var(--cp-card-shadow);
          position: relative;
          overflow: hidden;
        }
        .cp-stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }
        .cp-stat-num {
          font-family: var(--cp-heading-font);
          font-size: 2.2rem;
          font-weight: 300;
          line-height: 1;
        }
        .cp-stat-label {
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--cp-text-muted);
          margin-top: 8px;
        }
        .cp-table-wrap {
          background: var(--cp-card-bg);
          border: 1px solid var(--cp-border);
          border-radius: var(--cp-radius);
          overflow: hidden;
          box-shadow: var(--cp-card-shadow);
        }
        .cp-table {
          width: 100%;
          border-collapse: collapse;
        }
        .cp-table th {
          text-align: left;
          padding: 12px 16px;
          background: var(--cp-accent-soft);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cp-accent-text);
          font-weight: 500;
          border-bottom: 1px solid var(--cp-border);
        }
        .cp-table td {
          padding: 12px 16px;
          font-size: 0.85rem;
          color: var(--cp-text-secondary);
          border-bottom: 1px solid var(--cp-border);
        }
        .cp-table tr:last-child td {
          border-bottom: none;
        }
        .cp-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        .cp-badge-success {
          background: rgba(45, 106, 79, 0.15);
          color: var(--cp-success);
        }
        .cp-badge-danger {
          background: rgba(192, 57, 43, 0.15);
          color: var(--cp-danger);
        }
        .cp-badge-warning {
          background: var(--cp-accent-soft);
          color: var(--cp-warning);
        }
        .cp-empty {
          padding: 32px;
          text-align: center;
          color: var(--cp-text-muted);
          font-style: italic;
          font-family: var(--cp-heading-font);
        }

        /* Couleurs des stats par accent */
        .cp-stat-success::before { background: var(--cp-success); }
        .cp-stat-danger::before { background: var(--cp-danger); }
        .cp-stat-warning::before { background: var(--cp-warning); }
        .cp-stat-accent::before { background: var(--cp-accent); }
      `}</style>

      <main className="cp-shell">
        {/* Header */}
        <div className="cp-header">
          <div className="cp-header-orn">✦</div>
          <h1 className="cp-header-names">
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <p className="cp-header-date">{eventDate}</p>
        </div>

        <div className="cp-container">

          {/* Stats */}
          <section className="cp-section">
            <h2 className="cp-section-title">Confirmations</h2>
            <div className="cp-stats">
              <StatCard value={present.length} label="Présents" variant="success" theme={theme} />
              <StatCard value={absent.length} label="Absents" variant="danger" theme={theme} />
              <StatCard value={maybe.length} label="À confirmer" variant="warning" theme={theme} />
              <StatCard value={totalGuests} label="Total invités" variant="accent" theme={theme} />
            </div>
          </section>

          {/* RSVPs */}
          {allRsvps.length > 0 && (
            <section className="cp-section">
              <h2 className="cp-section-title">
                Liste des réponses
                <span className="cp-section-title-badge">{allRsvps.length}</span>
              </h2>
              <div className="cp-table-wrap">
                <div style={{ overflowX: 'auto' }}>
                  <table className="cp-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Statut</th>
                        <th>Acc.</th>
                        <th>WhatsApp</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allRsvps.map(r => (
                        <tr key={r.id}>
                          <td style={{ color: theme.textPrimary, fontWeight: 500 }}>{r.name}</td>
                          <td>
                            <span className={`cp-badge ${
                              r.status === 'present' ? 'cp-badge-success' :
                              r.status === 'absent' ? 'cp-badge-danger' :
                              'cp-badge-warning'
                            }`}>
                              {r.status === 'present' ? 'Présent(e)' : r.status === 'absent' ? 'Absent(e)' : 'À confirmer'}
                            </span>
                          </td>
                          <td>{r.guests}</td>
                          <td>{r.phone ?? '—'}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {new Date(r.created_at).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Messages en attente */}
          {wedding.moderation_on && pending.length > 0 && (
            <section className="cp-section">
              <h2 className="cp-section-title">
                En attente d'approbation
                <span className="cp-section-title-badge" style={{
                  background: 'rgba(202, 138, 4, 0.18)',
                  color: '#854d0e',
                }}>
                  {pending.length}
                </span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pending.map(msg => (
                  <MessageCard
                    key={msg.id}
                    message={msg}
                    weddingId={wedding.id}
                    coupleToken=""
                    theme={theme}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Messages approuvés */}
          <section className="cp-section">
            <h2 className="cp-section-title">
              Livre d'or
              {approved.length > 0 && (
                <span className="cp-section-title-badge">{approved.length}</span>
              )}
            </h2>
            {approved.length === 0 ? (
              <div className="cp-empty">
                Aucun message publié pour l'instant.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {approved.map(msg => (
                  <MessageCard
                    key={msg.id}
                    message={msg}
                    weddingId={wedding.id}
                    coupleToken=""
                    theme={theme}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </>
  )
}

function StatCard({ value, label, variant, theme }: {
  value: number
  label: string
  variant: 'success' | 'danger' | 'warning' | 'accent'
  theme: ReturnType<typeof getTheme>
}) {
  const colors = {
    success: theme.success,
    danger: theme.danger,
    warning: theme.warning,
    accent: theme.accent,
  }
  return (
    <div className={`cp-stat-card cp-stat-${variant}`}>
      <div className="cp-stat-num" style={{ color: colors[variant] }}>
        {value}
      </div>
      <div className="cp-stat-label">{label}</div>
    </div>
  )
}