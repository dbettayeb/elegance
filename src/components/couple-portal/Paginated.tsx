'use client'

import { Children, useState, useEffect } from 'react'

/**
 * Pagination des listes du portail des mariés.
 *
 * Les éléments sont déjà rendus par le serveur et passés en `children` : ce
 * composant ne fait que les découper. Aucun aller-retour réseau au changement
 * de page, et les cartes de messages gardent leurs actions.
 *
 * `as="tbody"` rend les contrôles dans un `<tfoot>` plutôt que dans un `<div>`,
 * seul moyen de rester du HTML valide à l'intérieur d'un tableau.
 */
export default function Paginated({
  children,
  pageSize = 10,
  as = 'div',
  columns = 1,
  gap,
}: {
  children: React.ReactNode
  pageSize?: number
  as?: 'div' | 'tbody'
  /** Nombre de colonnes du tableau, pour le colSpan du pied de page. */
  columns?: number
  gap?: string
}) {
  const items = Children.toArray(children)
  const pageCount = Math.ceil(items.length / pageSize)
  const [page, setPage] = useState(0)

  // Une suppression peut vider la dernière page : on recule plutôt que
  // d'afficher un écran vide.
  useEffect(() => {
    if (page > 0 && page >= pageCount) setPage(Math.max(0, pageCount - 1))
  }, [page, pageCount])

  const slice = items.slice(page * pageSize, page * pageSize + pageSize)
  const from = items.length === 0 ? 0 : page * pageSize + 1
  const to = Math.min(items.length, (page + 1) * pageSize)

  const controls = pageCount > 1 && (
    <div style={bar}>
      <span style={counter}>{from}–{to} sur {items.length}</span>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button type="button" style={btn(page === 0)} disabled={page === 0}
          onClick={() => setPage(p => p - 1)} aria-label="Page précédente">‹</button>
        <span style={counter}>{page + 1} / {pageCount}</span>
        <button type="button" style={btn(page >= pageCount - 1)} disabled={page >= pageCount - 1}
          onClick={() => setPage(p => p + 1)} aria-label="Page suivante">›</button>
      </div>
    </div>
  )

  if (as === 'tbody') {
    return (
      <>
        <tbody>{slice}</tbody>
        {controls && (
          <tfoot>
            <tr><td colSpan={columns} style={{ padding: 0 }}>{controls}</td></tr>
          </tfoot>
        )}
      </>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: gap ?? '10px' }}>{slice}</div>
      {controls}
    </>
  )
}

const bar: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: '12px', flexWrap: 'wrap',
  padding: '12px 2px 2px', marginTop: '10px',
  borderTop: '1px solid var(--cp-border, #e5e5e5)',
}
const counter: React.CSSProperties = {
  fontSize: '0.8rem', color: 'var(--cp-muted, #737373)', whiteSpace: 'nowrap',
}
const btn = (disabled: boolean): React.CSSProperties => ({
  border: '1px solid var(--cp-border, #e5e5e5)',
  background: disabled ? '#fafafa' : '#fff',
  color: disabled ? '#bbb' : 'inherit',
  cursor: disabled ? 'default' : 'pointer',
  borderRadius: '6px', width: '30px', height: '30px',
  fontSize: '1rem', lineHeight: 1, padding: 0,
})
