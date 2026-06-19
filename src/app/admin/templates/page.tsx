import Link from 'next/link'
import { TEMPLATES_META } from '@/lib/templates-meta'
import TemplateCard from '@/components/admin/TemplateCard'

export default function TemplatesCatalog() {
  const dynamiques = TEMPLATES_META.filter(t => t.type === 'dynamique')
  const statiques  = TEMPLATES_META.filter(t => t.type === 'statique')

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Catalogue de templates</h1>
          <p className="admin-page-subtitle">
            {TEMPLATES_META.length} designs disponibles. Cliquez sur un template pour voir un aperçu réel.
          </p>
        </div>
        <Link href="/admin" className="admin-btn admin-btn-secondary">
          ← Retour
        </Link>
      </div>

      {/* ── Dynamiques ── */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            ✨ Dynamiques
          </h2>
          <span style={{
            fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.05em',
            background: '#fef3c7', color: '#92400e',
            padding: '3px 10px', borderRadius: '99px',
          }}>
            Vidéo &amp; Animation
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            {dynamiques.length} template{dynamiques.length > 1 ? 's' : ''}
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {dynamiques.map(t => <TemplateCard key={t.id} template={t} />)}
        </div>
      </div>

      {/* Séparateur */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--admin-border)', margin: '0 0 36px' }} />

      {/* ── Statiques ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            🖼 Statiques
          </h2>
          <span style={{
            fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.05em',
            background: '#f0fdf4', color: '#166534',
            padding: '3px 10px', borderRadius: '99px',
          }}>
            Invitation classique
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            {statiques.length} template{statiques.length > 1 ? 's' : ''}
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {statiques.map(t => <TemplateCard key={t.id} template={t} />)}
        </div>
      </div>
    </>
  )
}
