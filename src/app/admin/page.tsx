import { createServiceSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createServiceSupabaseClient()

  const { data: weddings } = await supabase
    .from('weddings')
    .select('id, slug, bride_name, groom_name, event_date, status, pack, template_id, access_token, created_at, couple_phone, couple_email')
    .order('created_at', { ascending: false })

  const all = weddings ?? []
  const leads = all.filter(w => w.status === 'lead')
  const nonLeads = all.filter(w => w.status !== 'lead')
  const now = new Date()
  const upcoming = nonLeads.filter(w => new Date(w.event_date) >= now && w.status === 'active')
  const past = nonLeads.filter(w => new Date(w.event_date) < now)
  const thisMonth = nonLeads.filter(w => {
    const created = new Date(w.created_at)
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  })

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tableau de bord</h1>
          <p className="admin-page-subtitle">Gestion de l'ensemble des invitations</p>
        </div>
        <Link href="/admin/new" className="admin-btn">+ Nouveau mariage</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        <StatCard label="Demandes" value={leads.length} accent={leads.length > 0 ? 'warning' : undefined} />
        <StatCard label="Total" value={nonLeads.length} />
        <StatCard label="À venir" value={upcoming.length} accent="success" />
        <StatCard label="Ce mois" value={thisMonth.length} accent="info" />
        <StatCard label="Archivés" value={past.length} accent="neutral" />
      </div>

      {leads.length > 0 && (
        <div className="admin-card" style={{
          padding: 0, overflow: 'hidden', marginBottom: '28px',
          borderLeft: '4px solid #ca8a04',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border)', background: '#fffbeb' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: '#854d0e' }}>
              🔔 Nouvelles demandes ({leads.length})
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#854d0e', margin: '2px 0 0', opacity: 0.8 }}>
              Reçues via le site public. À traiter en priorité.
            </p>
          </div>
          <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ border: 'none', borderRadius: 0, minWidth: 560 }}>
            <thead>
              <tr>
                <th>Couple</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Pack</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(w => (
                <tr key={w.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{w.bride_name} & {w.groom_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
                      <code style={{ fontSize: '0.72rem' }}>{w.template_id ?? '—'}</code>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>{w.couple_email}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                      {w.couple_phone ?? '—'}
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(w.event_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><span className="admin-badge admin-badge-neutral">{w.pack}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/admin/${w.id}`} className="admin-btn"
                      style={{ padding: '5px 12px', fontSize: '0.8rem', background: '#ca8a04', whiteSpace: 'nowrap' }}>
                      Traiter →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--admin-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Tous les mariages</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', margin: '2px 0 0' }}>
              {nonLeads.length} enregistrement{nonLeads.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {nonLeads.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <div style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Aucun mariage enregistré</div>
            <Link href="/admin/new" className="admin-btn" style={{ marginTop: '12px' }}>Créer le premier</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ border: 'none', borderRadius: 0, minWidth: 480 }}>
            <thead>
              <tr>
                <th>Couple</th>
                <th>Date</th>
                <th>Pack</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nonLeads.map(w => <WeddingRow key={w.id} wedding={w} />)}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({ label, value, accent }: {
  label: string; value: number;
  accent?: 'success' | 'info' | 'neutral' | 'warning'
}) {
  const colors: Record<string, string> = {
    success: '#16a34a', info: '#2563eb', neutral: '#737373', warning: '#ca8a04',
  }
  return (
    <div className="admin-card">
      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 600, color: accent ? colors[accent] : 'var(--admin-text)' }}>
        {value}
      </div>
    </div>
  )
}

function WeddingRow({ wedding }: { wedding: any }) {
  const date = new Date(wedding.event_date)
  const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
  const statusMap: Record<string, { label: string; cls: string }> = {
    active: { label: 'Actif', cls: 'admin-badge-success' },
    archived: { label: 'Archivé', cls: 'admin-badge-neutral' },
    suspended: { label: 'Suspendu', cls: 'admin-badge-danger' },
  }
  const status = statusMap[wedding.status] ?? statusMap.active

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 500 }}>{wedding.bride_name} & {wedding.groom_name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>/{wedding.slug}</div>
      </td>
      <td>{dateStr}</td>
      <td><span className="admin-badge admin-badge-neutral">{wedding.pack}</span></td>
      <td><span className={`admin-badge ${status.cls}`}>{status.label}</span></td>
      <td style={{ textAlign: 'right' }}>
        <Link href={`/admin/${wedding.id}`} className="admin-btn admin-btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
          Gérer
        </Link>
      </td>
    </tr>
  )
}