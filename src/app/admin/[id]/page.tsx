import { notFound } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import WeddingActions from './WeddingActions'
import LinkCard from './LinkCard'

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

  const allRsvps = rsvps ?? []
  const allMessages = messages ?? []
  const present = allRsvps.filter(r => r.status === 'present')
  const absent = allRsvps.filter(r => r.status === 'absent')
  const maybe = allRsvps.filter(r => r.status === 'maybe')
  const totalGuests = present.reduce((acc, r) => acc + r.guests + 1, 0)
  const pendingMessages = allMessages.filter(m => !m.approved).length

  const base = process.env.NEXT_PUBLIC_BASE_URL
  const inviteUrl = `${base}/i/${wedding.slug}/${wedding.access_token}`
  const coupleUrl = `${base}/couple/${wedding.slug}/login`

  const eventDate = new Date(wedding.event_date)
  const dateStr = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const statusMap: Record<string, { label: string; cls: string }> = {
    active: { label: 'Actif', cls: 'admin-badge-success' },
    archived: { label: 'Archivé', cls: 'admin-badge-neutral' },
    suspended: { label: 'Suspendu', cls: 'admin-badge-danger' },
  }
  const status = statusMap[wedding.status] ?? statusMap.active

  return (
    <>
      <div className="admin-page-header">
        <div>
          <Link href="/admin" style={{
            fontSize: '0.78rem',
            color: 'var(--admin-text-muted)',
            textDecoration: 'none',
          }}>
            ← Tableau de bord
          </Link>
          <h1 className="admin-page-title" style={{ marginTop: '6px' }}>
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <p className="admin-page-subtitle">
            {dateStr} · Pack {wedding.pack} ·{' '}
            <span className={`admin-badge ${status.cls}`}>{status.label}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href={`/admin/${id}/edit`} className="admin-btn">
            Modifier
          </Link>
          <a
            href={inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="admin-btn admin-btn-secondary"
          >
            Voir l'invitation ↗
          </a>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <StatCard label="Présents" value={present.length} accent="#16a34a" />
        <StatCard label="Absents" value={absent.length} accent="#dc2626" />
        <StatCard label="À confirmer" value={maybe.length} accent="#ca8a04" />
        <StatCard label="Total invités" value={totalGuests} accent="#2563eb" />
        <StatCard label="Messages" value={allMessages.length}
          sub={pendingMessages > 0 ? `${pendingMessages} en attente` : undefined} />
      </div>

      {/* Liens */}
      <Section title="Liens à partager">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <LinkCard label="Lien invités" sub="À envoyer via WhatsApp" value={inviteUrl} />
          <LinkCard label="Lien portail mariés" sub="Pour suivre les confirmations" value={coupleUrl} />
          <LinkCard label="Code d'accès mariés" sub="Saisi par les mariés" value={wedding.couple_token} />
        </div>
      </Section>

      {/* Actions */}
      <Section title="Actions">
        <WeddingActions
          weddingId={id}
          slug={wedding.slug}
          status={wedding.status}
          coupleNames={`${wedding.bride_name} & ${wedding.groom_name}`}
        />
      </Section>

      {/* RSVPs */}
      {allRsvps.length > 0 && (
        <Section title={`Réponses des invités (${allRsvps.length})`}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Acc.</th>
                  <th>WhatsApp</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {allRsvps.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td>
                      <span className={`admin-badge ${
                        r.status === 'present' ? 'admin-badge-success' :
                        r.status === 'absent' ? 'admin-badge-danger' :
                        'admin-badge-warning'
                      }`}>
                        {r.status === 'present' ? 'Présent' : r.status === 'absent' ? 'Absent' : 'À confirmer'}
                      </span>
                    </td>
                    <td>{r.guests}</td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{r.phone ?? '—'}</td>
                    <td style={{ color: 'var(--admin-text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.note ?? '—'}
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Messages */}
      {allMessages.length > 0 && (
        <Section title={`Livre d'or (${allMessages.length})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allMessages.map(msg => (
              <div key={msg.id} style={{
                padding: '14px 16px',
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                borderLeft: `3px solid ${msg.approved ? '#16a34a' : '#ca8a04'}`,
                borderRadius: 'var(--admin-radius)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '0.88rem' }}>{msg.author_name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  {!msg.approved && (
                    <span className="admin-badge admin-badge-warning">En attente</span>
                  )}
                </div>
                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
                  color: 'var(--admin-text-muted)',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  "{msg.message}"
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

function StatCard({ label, value, accent, sub }: {
  label: string; value: number; accent?: string; sub?: string
}) {
  return (
    <div className="admin-card">
      <div style={{
        fontSize: '0.72rem',
        color: 'var(--admin-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '1.6rem',
        fontWeight: 600,
        color: accent || 'var(--admin-text)',
        lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontSize: '0.72rem',
          color: '#ca8a04',
          marginTop: '6px',
        }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{
        fontSize: '0.95rem',
        fontWeight: 600,
        margin: '0 0 12px',
        color: 'var(--admin-text)',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}