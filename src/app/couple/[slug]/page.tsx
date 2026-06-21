import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { RSVP, GuestMessage, GuestInvitation } from '@/lib/types'
import MessageCard from '@/components/couple-portal/MessageCard'
import GuestInvitationsPanel from '@/components/couple-portal/GuestInvitationsPanel'
import type { CoupleTheme } from '@/lib/couple-themes'
import { TEMPLATES_META } from '@/lib/templates-meta'

const NEUTRAL_THEME: CoupleTheme = {
  accent: '#2563eb', accentSoft: '#eff6ff', accentText: '#1e40af',
  headerBg: '#171717', pageBg: '#fafafa', cardBg: '#ffffff', cardShadow: '0 1px 3px rgba(0,0,0,0.06)',
  border: '#e5e5e5', borderStrong: '#d4d4d4',
  textPrimary: '#171717', textSecondary: '#404040', textMuted: '#737373',
  success: '#16a34a', danger: '#dc2626', warning: '#ca8a04',
  bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headingFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  radius: '6px',
}

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

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(`couple_${slug}`)?.value
  if (!sessionToken || sessionToken !== wedding.couple_token) {
    redirect(`/couple/${slug}/login`)
  }

  const [{ data: rsvps }, { data: messages }, { data: guestInvites }] = await Promise.all([
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
    TEMPLATES_META.find(t => t.id === wedding.template_id)?.language === 'ar' && wedding.guest_invite_enabled
      ? supabase.from('guest_invitations').select('*').eq('wedding_id', wedding.id).order('created_at', { ascending: false })
      : Promise.resolve({ data: [] }),
  ])

  const allRsvps = (rsvps ?? []) as RSVP[]
  const allMessages = (messages ?? []) as GuestMessage[]

  const present = allRsvps.filter(r => r.status === 'present')
  const absent  = allRsvps.filter(r => r.status === 'absent')
  const maybe   = allRsvps.filter(r => r.status === 'maybe')
  const pending  = allMessages.filter(m => !m.approved)
  const approved = allMessages.filter(m => m.approved)
  const totalGuests = present.reduce((acc, r) => acc + r.guests + 1, 0)

  const eventDate = new Date(wedding.event_date).toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <>
      <style>{CSS}</style>

      <div className="cp-shell">
        <header className="cp-header">
          <div className="cp-header-inner">
            <div>
              <h1 className="cp-header-title">
                {wedding.bride_name} &amp; {wedding.groom_name}
              </h1>
              <p className="cp-header-sub">{eventDate}</p>
            </div>
          </div>
        </header>

        <main className="cp-main">

          {/* Stats */}
          <div className="cp-stats">
            <StatCard value={present.length}   label="Présents"      accent="#16a34a" />
            <StatCard value={absent.length}    label="Absents"       accent="#dc2626" />
            <StatCard value={maybe.length}     label="À confirmer"   accent="#ca8a04" />
            <StatCard value={totalGuests}      label="Total invités" accent="#2563eb" />
          </div>

          {/* Invitations personnalisées */}
          {TEMPLATES_META.find(t => t.id === wedding.template_id)?.language === 'ar' && wedding.guest_invite_enabled && (
            <Section title="Invitations personnalisées" badge={(guestInvites ?? []).length || undefined}>
              <GuestInvitationsPanel
                weddingId={wedding.id}
                slug={slug}
                initialInvitations={(guestInvites ?? []) as GuestInvitation[]}
                baseUrl={process.env.NEXT_PUBLIC_BASE_URL ?? ''}
                accentColor="#171717"
              />
            </Section>
          )}

          {/* RSVPs */}
          {allRsvps.length > 0 && (
            <Section title="Réponses des invités" badge={allRsvps.length}>
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
                        <td style={{ fontWeight: 500 }}>{r.name}</td>
                        <td>
                          <span className={`cp-badge ${
                            r.status === 'present' ? 'cp-badge-success' :
                            r.status === 'absent'  ? 'cp-badge-danger'  :
                            'cp-badge-warning'
                          }`}>
                            {r.status === 'present' ? 'Présent(e)' : r.status === 'absent' ? 'Absent(e)' : 'À confirmer'}
                          </span>
                        </td>
                        <td>{r.guests}</td>
                        <td>{r.phone ?? '—'}</td>
                        <td style={{ whiteSpace: 'nowrap', color: 'var(--cp-muted)' }}>
                          {new Date(r.created_at).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {/* Messages en attente */}
          {wedding.moderation_on && pending.length > 0 && (
            <Section title="En attente d'approbation" badge={pending.length}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pending.map(msg => (
                  <MessageCard key={msg.id} message={msg} weddingId={wedding.id} coupleToken="" theme={NEUTRAL_THEME} />
                ))}
              </div>
            </Section>
          )}

          {/* Livre d'or */}
          <Section title="Livre d'or" badge={approved.length || undefined}>
            {approved.length === 0 ? (
              <p style={{ color: 'var(--cp-muted)', fontStyle: 'italic', margin: 0 }}>
                Aucun message publié pour l'instant.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {approved.map(msg => (
                  <MessageCard key={msg.id} message={msg} weddingId={wedding.id} coupleToken="" theme={NEUTRAL_THEME} />
                ))}
              </div>
            )}
          </Section>

        </main>
      </div>
    </>
  )
}

function Section({ title, badge, children }: { title: string; badge?: number; children: React.ReactNode }) {
  return (
    <section className="cp-section">
      <h2 className="cp-section-title">
        {title}
        {badge !== undefined && badge > 0 && (
          <span className="cp-section-badge">{badge}</span>
        )}
      </h2>
      {children}
    </section>
  )
}

function StatCard({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div className="cp-stat" style={{ borderTopColor: accent }}>
      <div className="cp-stat-num" style={{ color: accent }}>{value}</div>
      <div className="cp-stat-label">{label}</div>
    </div>
  )
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --cp-bg: #fafafa;
    --cp-surface: #ffffff;
    --cp-border: #e5e5e5;
    --cp-border-strong: #d4d4d4;
    --cp-text: #171717;
    --cp-muted: #737373;
    --cp-subtle: #a3a3a3;
    --cp-radius: 6px;
  }

  body { margin: 0; background: var(--cp-bg); color: var(--cp-text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }

  .cp-shell { min-height: 100vh; }

  .cp-header {
    background: var(--cp-surface);
    border-bottom: 1px solid var(--cp-border);
    padding: 0 40px;
  }
  .cp-header-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cp-header-title { margin: 0; font-size: 1.3rem; font-weight: 600; }
  .cp-header-sub { margin: 4px 0 0; font-size: 0.82rem; color: var(--cp-muted); }

  .cp-main { max-width: 960px; margin: 0 auto; padding: 32px 40px; }

  .cp-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 28px;
  }
  .cp-stat {
    background: var(--cp-surface);
    border: 1px solid var(--cp-border);
    border-top: 3px solid;
    border-radius: var(--cp-radius);
    padding: 18px 16px;
    text-align: center;
  }
  .cp-stat-num { font-size: 2rem; font-weight: 300; line-height: 1; }
  .cp-stat-label {
    font-size: 0.58rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--cp-muted); margin-top: 8px;
  }

  .cp-section { margin-bottom: 32px; }
  .cp-section-title {
    font-size: 1rem; font-weight: 600; margin: 0 0 14px;
    padding-bottom: 10px; border-bottom: 1px solid var(--cp-border);
    display: flex; align-items: center; gap: 8px;
  }
  .cp-section-badge {
    font-size: 0.7rem; font-weight: 500;
    padding: 2px 8px; border-radius: 20px;
    background: #f3f4f6; color: #374151;
  }

  .cp-table {
    width: 100%; border-collapse: collapse;
    background: var(--cp-surface);
    border: 1px solid var(--cp-border);
    border-radius: var(--cp-radius);
    overflow: hidden;
    font-size: 0.875rem;
  }
  .cp-table th {
    text-align: left; padding: 10px 14px;
    background: #fafafa; border-bottom: 1px solid var(--cp-border);
    font-size: 0.75rem; font-weight: 600; color: var(--cp-muted);
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .cp-table td { padding: 11px 14px; border-bottom: 1px solid var(--cp-border); }
  .cp-table tr:last-child td { border-bottom: none; }

  .cp-badge {
    display: inline-block; padding: 2px 9px;
    border-radius: 4px; font-size: 0.72rem; font-weight: 500;
  }
  .cp-badge-success { background: #dcfce7; color: #166534; }
  .cp-badge-danger  { background: #fee2e2; color: #991b1b; }
  .cp-badge-warning { background: #fef3c7; color: #854d0e; }

  @media (max-width: 640px) {
    .cp-header { padding: 0 20px; }
    .cp-main { padding: 20px; }
  }
`
