'use client'
import { useState, useEffect } from 'react'

export default function GuestDedicationOverlay({ dedication }: { dedication: string }) {
  const [opacity, setOpacity] = useState(1)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!dedication) return

    function isOpeningDone() {
      // FR templates — OpeningScreen component
      const os = document.getElementById('opening-screen')
      if (os?.classList.contains('os-hidden') || os?.classList.contains('hidden')) return true
      // AR templates — BismillahStyle
      const bs = document.querySelector('.bs-opening')
      if (bs?.classList.contains('bs-op-hidden')) return true
      // AlexaRichard dynamic template
      const ar = document.getElementById('ar-opening')
      if (ar?.classList.contains('ar-hidden')) return true
      // No opening screen at all → already open
      if (!os && !bs && !ar) return true
      return false
    }

    function checkAndHide() {
      if (isOpeningDone()) {
        setOpacity(0)
        setTimeout(() => setGone(true), 750)
        obs.disconnect()
      }
    }

    const obs = new MutationObserver(checkAndHide)
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
      childList: true,
    })

    return () => obs.disconnect()
  }, [dedication])

  if (gone || !dedication) return null

  const isArabic = /[؀-ۿ]/.test(dedication)

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital@1&family=Great+Vibes&family=Amiri&display=swap"
        rel="stylesheet"
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '11%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
          maxWidth: '440px',
          padding: '0 24px',
          opacity,
          transition: 'opacity 0.75s ease',
          textAlign: 'center',
        }}
      >
        {/* "Pour" / "إلى" */}
        <span style={{
          fontFamily: isArabic
            ? "'Amiri', Georgia, serif"
            : "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.55rem, 1.4vw, 0.7rem)',
          letterSpacing: isArabic ? '0.04em' : '0.45em',
          textTransform: isArabic ? 'none' : 'uppercase',
          color: 'rgba(160, 128, 72, 0.85)',
          direction: isArabic ? 'rtl' : 'ltr',
          display: 'block',
        }}>
          {isArabic ? 'إلى' : 'Pour'}
        </span>

        {/* Guest name */}
        <span style={{
          fontFamily: isArabic
            ? "'Amiri', Georgia, serif"
            : "'Great Vibes', 'Cormorant Garamond', cursive",
          fontSize: isArabic
            ? 'clamp(1.1rem, 3.5vw, 1.6rem)'
            : 'clamp(1.3rem, 4vw, 2rem)',
          fontWeight: 400,
          color: 'rgba(80, 58, 28, 0.88)',
          lineHeight: 1.3,
          direction: isArabic ? 'rtl' : 'ltr',
          display: 'block',
        }}>
          {dedication}
        </span>

        {/* Thin gold rule */}
        <div style={{
          width: '36px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(184,146,74,0.6), transparent)',
          marginTop: '2px',
        }} />
      </div>
    </>
  )
}
