'use client'
import Link from 'next/link'
import type { TemplateMeta } from '@/lib/templates-meta'

export default function TemplateCard({ template }: { template: TemplateMeta }) {
  const ambianceColors = {
    clair: { bg: '#fefce8', label: 'Clair', color: '#854d0e' },
    sombre: { bg: '#1e293b', label: 'Sombre', color: '#cbd5e1' },
    pastel: { bg: '#fdf2f8', label: 'Pastel', color: '#9d174d' },
  }
  const amb = ambianceColors[template.ambiance]

  return (
    <Link
      href={`/admin/templates/${template.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        className="admin-card"
        style={{
          padding: 0,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.2s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--admin-text)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--admin-border)'
          e.currentTarget.style.transform = 'none'
        }}
      >
        {/* Visuel : aperçu image ou palette couleur */}
        <div style={{
          height: '220px',
          background: template.palette[0],
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--admin-border)',
          overflow: 'hidden',
        }}>
          {template.preview ? (
            /* Image d'aperçu du template */
            <img
              src={template.preview}
              alt={template.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
              }}
            />
          ) : (
            /* Fallback : nom stylé */
            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: template.palette[2] || template.palette[1],
                lineHeight: 1.2,
              }}>
                {template.name}
              </div>
              <div style={{
                width: '40px', height: '1px',
                background: template.palette[2] || template.palette[1],
                margin: '8px auto', opacity: 0.6,
              }} />
            </div>
          )}

          {/* Badge ambiance */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '3px 9px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 500,
            background: 'rgba(255,255,255,0.88)',
            color: amb.color,
            backdropFilter: 'blur(4px)',
          }}>
            {amb.label}
          </div>

          {/* Palette de couleurs */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            gap: '4px',
          }}>
            {template.palette.map((color, i) => (
              <div key={i} style={{
                width: '16px', height: '16px',
                borderRadius: '50%',
                background: color,
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }} />
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--admin-text-muted)',
            lineHeight: 1.5,
            margin: 0,
            marginBottom: '12px',
            flex: 1,
          }}>
            {template.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
            {template.tags.map(tag => (
              <span key={tag} className="admin-badge admin-badge-neutral" style={{ fontSize: '0.68rem' }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{
            paddingTop: '12px',
            borderTop: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <code style={{
              fontSize: '0.72rem',
              color: 'var(--admin-text-muted)',
              background: '#f5f5f5',
              padding: '2px 6px',
              borderRadius: '3px',
            }}>
              {template.id}
            </code>
            <span style={{
              fontSize: '0.78rem',
              color: 'var(--admin-accent)',
              fontWeight: 500,
            }}>
              Voir aperçu →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}