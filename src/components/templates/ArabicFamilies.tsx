'use client'
import { useEffect, useRef } from 'react'

interface Props {
  groomPrefix?: string
  groomName?: string
  bridePrefix?: string
  brideName?: string
  /** Préfixe CSS du template hôte : "bs" (BismillahStyle/Bismillah) ou "an" (AlNour). */
  prefix: 'bs' | 'an'
}

function splitLast(s: string) {
  const t = s.trim()
  const i = t.lastIndexOf(' ')
  if (i < 0) return { main: '', last: t }
  return { main: t.slice(0, i), last: t.slice(i + 1) }
}

/**
 * Bloc familles arabes avec :
 * - grille 3×2 : préfixes alignés en ligne 1, noms + و en ligne 2
 * - taille de police identique pour les 2 noms (même classe)
 * - dernier mot encapsulé dans un span pour wrap propre
 * - wrap symétrique : si l'un des 2 noms doit passer à 2 lignes,
 *   l'autre est forcé à wrap aussi (mesure via ResizeObserver)
 */
export default function ArabicFamilies({
  groomPrefix, groomName, bridePrefix, brideName, prefix,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const hasGroom = !!groomName
  const hasBride = !!brideName
  const hasBoth  = hasGroom && hasBride

  useEffect(() => {
    if (!hasBoth) return
    const grid = ref.current
    if (!grid) return

    const update = () => {
      let multi = false
      grid.querySelectorAll<HTMLElement>(`.${prefix}-fn`).forEach(el => {
        const prev = el.style.whiteSpace
        el.style.whiteSpace = 'nowrap'
        const overflow = el.scrollWidth > el.clientWidth + 1
        el.style.whiteSpace = prev
        if (overflow) multi = true
      })
      grid.classList.toggle(`${prefix}-fgrid--wrap`, multi)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(grid)
    grid.querySelectorAll<HTMLElement>(`.${prefix}-fn`).forEach(el => ro.observe(el))
    return () => ro.disconnect()
  }, [groomName, brideName, hasBoth, prefix])

  if (!hasGroom && !hasBride) return null

  if (!hasBoth) {
    const single = (groomName || brideName) as string
    const pre    = hasGroom ? groomPrefix : bridePrefix
    return (
      <div className={`${prefix}-fsingle`}>
        <span className={`${prefix}-fp`}>{pre || 'عائلة'}</span>
        <span className={`${prefix}-fn`}>{single}</span>
      </div>
    )
  }

  const g = splitLast(groomName as string)
  const b = splitLast(brideName as string)

  return (
    <div ref={ref} className={`${prefix}-fgrid`}>
      <span className={`${prefix}-fp`}>{groomPrefix || 'عائلة'}</span>
      <span />
      <span className={`${prefix}-fp`}>{bridePrefix || 'عائلة'}</span>
      <span className={`${prefix}-fn`}>
        {g.main && <>{g.main} </>}
        <span className={`${prefix}-fn-last`}>{g.last}</span>
      </span>
      <span className={`${prefix}-fand`}>و</span>
      <span className={`${prefix}-fn`}>
        {b.main && <>{b.main} </>}
        <span className={`${prefix}-fn-last`}>{b.last}</span>
      </span>
    </div>
  )
}
