'use client'
import { useEffect } from 'react'

// Injects guest dedication into the opening stage so it physically moves
// with the poly-top (top flap) when the envelope opens.
export default function GuestDedicationOverlay({ dedication }: { dedication: string }) {
  useEffect(() => {
    if (!dedication) return

    const isArabic = /[؀-ۿ]/.test(dedication)

    const fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&family=Amiri&display=swap'
    document.head.appendChild(fontLink)

    function findStage() {
      return (
        document.querySelector<HTMLElement>('.opening-stage') ||
        document.querySelector<HTMLElement>('.bs-opening-stage') ||
        document.querySelector<HTMLElement>('.ar-opening-stage')
      )
    }

    function inject(stage: HTMLElement) {
      if (document.getElementById('guest-dedication')) return

      const wrap = document.createElement('div')
      wrap.id = 'guest-dedication'
      // top:44px places the text on the poly-top (top flap) area of the 1200×850 stage.
      // transition matches poly-top: transform 2.5s ease, plus opacity fade-out.
      wrap.style.cssText = [
        'position:absolute',
        'top:44px',
        'left:600px',
        'transform:translateX(-50%)',
        'z-index:10',
        'pointer-events:none',
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'gap:5px',
        'width:600px',
        'text-align:center',
        'transition:transform 2.5s ease,opacity 0.6s ease',
      ].join(';')

      const label = document.createElement('span')
      label.textContent = isArabic ? 'إلى' : 'Pour'
      label.style.cssText = [
        "font-family:'Cormorant Garamond',Georgia,serif",
        'font-style:italic',
        'font-size:11px',
        'letter-spacing:0.4em',
        'text-transform:uppercase',
        'color:rgba(185,148,72,0.88)',
        'text-shadow:0 1px 4px rgba(0,0,0,0.35)',
        'display:block',
      ].join(';')

      const name = document.createElement('span')
      name.textContent = dedication
      name.style.cssText = [
        `font-family:${isArabic ? "'Amiri',Georgia,serif" : "'Cormorant Garamond',Georgia,serif"}`,
        `font-size:${isArabic ? '22px' : '28px'}`,
        'font-weight:500',
        'font-style:italic',
        'color:rgba(200,162,78,0.97)',
        'text-shadow:0 1px 8px rgba(0,0,0,0.4)',
        'line-height:1.3',
        `direction:${isArabic ? 'rtl' : 'ltr'}`,
        'display:block',
        'white-space:nowrap',
      ].join(';')

      const rule = document.createElement('div')
      rule.style.cssText = [
        'width:32px',
        'height:1px',
        'background:linear-gradient(90deg,transparent,rgba(185,148,72,0.5),transparent)',
        'margin-top:2px',
      ].join(';')

      wrap.appendChild(label)
      wrap.appendChild(name)
      wrap.appendChild(rule)
      stage.appendChild(wrap)

      // Sync movement with poly-top: when the stage gets its animating class,
      // apply the same translateY(-430px) so the text flies up with the flap.
      const animObs = new MutationObserver(() => {
        const cls = stage.className
        const isAnimating =
          cls.includes('animating') ||  // covers: animating, os-animating, ar-animating, bs-animating
          cls.includes('bs-animating')

        if (isAnimating) {
          wrap.style.transform = 'translateX(-50%) translateY(-430px)'
          wrap.style.opacity = '0'
          animObs.disconnect()
        }
      })
      animObs.observe(stage, { attributes: true, attributeFilter: ['class'] })
    }

    const stage = findStage()
    if (stage) {
      inject(stage)
    } else {
      const obs = new MutationObserver(() => {
        const s = findStage()
        if (s) { inject(s); obs.disconnect() }
      })
      obs.observe(document.body, { childList: true, subtree: true })
      return () => {
        obs.disconnect()
        document.getElementById('guest-dedication')?.remove()
        fontLink.remove()
      }
    }

    return () => {
      document.getElementById('guest-dedication')?.remove()
      fontLink.remove()
    }
  }, [dedication])

  return null
}
