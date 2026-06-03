import Link from 'next/link'
import { TEMPLATES_META } from '@/lib/templates-meta'
import TemplateCard from '@/components/admin/TemplateCard'

export default function TemplatesCatalog() {
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
      }}>
        {TEMPLATES_META.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </>
  )
}