'use client'
import { useEffect } from 'react'

// Injects the guest dedication directly into the opening-stage DOM element
// so the text moves with the envelope animation (polygons, scale, etc.)
export default function GuestDedicationOverlay({ dedication }: { dedication: string }) {
  useEffect(() => {
    if (!dedication) return

    const isArabic = /[؀-ۿ]/.test(dedication)
    let el: HTMLElement | null = null
    let fontLink: HTMLLinkElement | null = null

    // Load fonts
    fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital@1&family=Great+Vibes&family=Amiri&display=swap'
    document.head.appendChild(fontLink)

    function buildDedication(): HTMLElement {
      // Outer wrapper — positioned in the 1200×850 stage coordinate system
      const wrap = document.createElement('div')
      wrap.id = 'guest-dedication'
      Object.assign(wrap.style, {
        position: 'absolute',
        top: '44px',
        left: '600px',
        transform: 'translateX(-50%)',
        zIndex: '10',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        width: '500px',
        textAlign: 'center',
      })

      // "Pour" / "إلى" label
      const label = document.createElement('span')
      label.textContent = isArabic ? 'إلى' : 'Pour'
      Object.assign(label.style, {
        fontFamily: isArabic ? "'Amiri', Georgia, serif" : "'Cormorant Garamond', Georgia, serif",
        fontStyle: 'italic',
        fontSize: '12px',
        letterSpacing: isArabic ? '0.04em' : '0.48em',
        textTransform: isArabic ? 'none' : 'uppercase',
        color: 'rgba(140, 108, 55, 0.82)',
        direction: isArabic ? 'rtl' : 'ltr',
        display: 'block',
      })

      // Guest name
      const name = document.createElement('span')
      name.textContent = dedication
      Object.assign(name.style, {
        fontFamily: isArabic ? "'Amiri', Georgia, serif" : "'Great Vibes', cursive",
        fontSize: isArabic ? '24px' : '34px',
        fontWeight: '400',
        color: 'rgba(72, 52, 22, 0.86)',
        lineHeight: '1.3',
        direction: isArabic ? 'rtl' : 'ltr',
        display: 'block',
      })

      // Thin rule
      const rule = document.createElement('div')
      Object.assign(rule.style, {
        width: '36px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(174,138,70,0.55), transparent)',
        marginTop: '2px',
      })

      wrap.appendChild(label)
      wrap.appendChild(name)
      wrap.appendChild(rule)
      return wrap
    }

    let attempts = 0
    function tryInject() {
      if (document.getElementById('guest-dedication')) return

      const stage =
        document.querySelector<HTMLElement>('.opening-stage') ||
        document.querySelector<HTMLElement>('.bs-opening-stage') ||
        document.querySelector<HTMLElement>('.ar-opening-stage')

      if (!stage) {
        if (++attempts < 60) setTimeout(tryInject, 100)
        return
      }

      el = buildDedication()
      stage.appendChild(el)
    }

    tryInject()

    return () => {
      if (el?.parentNode) el.parentNode.removeChild(el)
      if (fontLink?.parentNode) fontLink.parentNode.removeChild(fontLink)
    }
  }, [dedication])

  return null
}
