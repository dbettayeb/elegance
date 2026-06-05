'use client'

import { useEffect } from 'react'
import { getFontsForLanguage, FontLanguage, FontOption } from '@/lib/fonts'

interface Props {
  /** Police sélectionnée (le nom, pas l'id) */
  value?: string | null
  /** Callback de changement */
  onChange: (fontName: string | null) => void
  /** Langue du template courant (filtre les polices proposées) */
  language: FontLanguage
}

/**
 * Sélecteur visuel de police. Affiche chaque option dans son propre style
 * pour donner un aperçu réel à l'admin.
 *
 * La police choisie remplace TOUTES les polices du template (titres + body).
 */
export default function FontPicker({ value, onChange, language }: Props) {
  const fonts = getFontsForLanguage(language)

  // Précharge toutes les polices pour les aperçus
  useEffect(() => {
    const links: HTMLLinkElement[] = []
    for (const font of fonts) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`
      document.head.appendChild(link)
      links.push(link)
    }
    return () => {
      for (const link of links) link.remove()
    }
  }, [fonts])

  return (
    <div>
      <div style={{
        fontSize: '0.78rem',
        color: 'var(--admin-text-muted)',
        marginBottom: '8px',
        padding: '8px 10px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 'var(--admin-radius)',
      }}>
        ⚠ La police choisie remplace <strong>tous les textes</strong> du template (titres + corps).
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '8px',
      }}>
        {/* Option par défaut */}
        <FontCard
          font={null}
          selected={!value}
          onClick={() => onChange(null)}
        />

        {fonts.map(font => (
          <FontCard
            key={font.id}
            font={font}
            selected={value === font.name}
            onClick={() => onChange(font.name)}
          />
        ))}
      </div>
    </div>
  )
}

function FontCard({
  font,
  selected,
  onClick,
}: {
  font: FontOption | null
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '14px 10px',
        border: selected ? '2px solid var(--admin-accent)' : '1px solid var(--admin-border)',
        background: selected ? '#eff6ff' : '#fff',
        borderRadius: 'var(--admin-radius)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.15s',
        minHeight: '85px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '6px',
      }}
    >
      <div style={{
        fontFamily: font?.family ?? 'inherit',
        fontSize: font ? '1.35rem' : '0.95rem',
        lineHeight: 1.15,
        color: '#1f2937',
      }}>
        {font?.sample ?? 'Police native'}
      </div>
      <div style={{
        fontSize: '0.7rem',
        color: 'var(--admin-text-muted)',
        textTransform: font ? 'uppercase' : 'none',
        letterSpacing: font ? '0.05em' : 0,
      }}>
        {font?.name ?? '(par défaut du template)'}
      </div>
    </button>
  )
}