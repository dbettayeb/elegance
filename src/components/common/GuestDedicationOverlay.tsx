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
          top: '60%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          maxWidth: '520px',
          padding: '0 24px',
          opacity,
          transition: 'opacity 0.75s ease',
          textAlign: 'center',
        }}
      >
        {/* Thin gold rule */}
        <div style={{
          width: '48px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,183,120,0.75), transparent)',
          marginBottom: '2px',
        }} />

        {/* "Pour" / "إلى" */}
        <span style={{
          fontFamily: isArabic
            ? "'Amiri', Georgia, serif"
            : "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 'clamp(0.65rem, 2vw, 0.85rem)',
          letterSpacing: isArabic ? '0.04em' : '0.42em',
          textTransform: isArabic ? 'none' : 'uppercase',
          color: 'rgba(218, 190, 128, 0.92)',
          textShadow: '0 1px 10px rgba(0,0,0,0.65)',
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
            ? 'clamp(1.7rem, 6vw, 2.9rem)'
            : 'clamp(2rem, 7vw, 3.5rem)',
          fontWeight: 400,
          color: 'rgba(255, 250, 228, 0.97)',
          textShadow: '0 2px 32px rgba(0,0,0,0.55), 0 0 80px rgba(0,0,0,0.2)',
          lineHeight: 1.3,
          direction: isArabic ? 'rtl' : 'ltr',
          display: 'block',
        }}>
          {dedication}
        </span>

        {/* Thin gold rule */}
        <div style={{
          width: '48px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,183,120,0.75), transparent)',
          marginTop: '2px',
        }} />
      </div>
    </>
  )
}
