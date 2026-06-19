'use client'
import { useState } from 'react'

interface Props {
  onOpen?: () => void
  bgColor?: string
}

// Phase timeline:
// 0 → clic → phase 1 (seal fades, 600ms)
// 700ms  → phase 2 (flap opens, 1.4s)
// 2200ms → phase 3 (card slides up, 1.4s)
// 3400ms → phase 4 (screen fades)
// 4000ms → onOpen()

export default function EnveloppeFlorale({ onOpen, bgColor = '#fdf8f3' }: Props) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)

  function start() {
    if (phase !== 0) return
    setPhase(1)
    setTimeout(() => setPhase(2), 700)
    setTimeout(() => setPhase(3), 2200)
    setTimeout(() => setPhase(4), 3400)
    setTimeout(() => onOpen?.(), 4000)
  }

  return (
    <>
      <style>{buildCSS(bgColor)}</style>
      <div
        id="ef-screen"
        className={phase >= 4 ? 'ef-fade' : ''}
      >
        <div
          className="ef-stage"
          onClick={phase === 0 ? start : undefined}
          role="button"
          tabIndex={0}
          aria-label="Ouvrir l'invitation"
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') start() }}
        >

          {/* ── ENVELOPPE ── */}
          <div className="ef-env">

            {/* Intérieur floral (révélé quand le rabat s'ouvre) */}
            <div className="ef-interior">
              <span className="ef-int-fl">❀</span>
              <span className="ef-int-row">✿  ✿  ✿</span>
              <span className="ef-int-fl ef-int-fl--sm">❀</span>
            </div>

            {/* Carte d'invitation (glisse vers le haut) */}
            <div className={`ef-card${phase >= 3 ? ' ef-card--out' : ''}`}>
              <span className="ef-card-deco">✦</span>
              <p className="ef-card-title">Vous êtes cordialement invités</p>
              <p className="ef-card-sep">— ✿ —</p>
              <p className="ef-card-sub">à notre mariage</p>
              <span className="ef-card-deco">✦</span>
            </div>

            {/* Plis latéraux de l'enveloppe */}
            <div className="ef-fold-l" aria-hidden="true" />
            <div className="ef-fold-r" aria-hidden="true" />
            <div className="ef-fold-b" aria-hidden="true" />

            {/* Sceau de cire */}
            <div className={`ef-seal${phase >= 1 ? ' ef-seal--off' : ''}`} aria-hidden="true">
              <span className="ef-seal-glyph">✿</span>
            </div>

            {/* Rabat supérieur (rotation 3D) */}
            <div className={`ef-flap${phase >= 2 ? ' ef-flap--open' : ''}`} aria-hidden="true" />

          </div>

          <p className={`ef-hint${phase >= 1 ? ' ef-hint--out' : ''}`}>
            Cliquez pour ouvrir
          </p>

        </div>
      </div>
    </>
  )
}

function buildCSS(bg: string) { return `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

  /* ── ÉCRAN ── */
  #ef-screen {
    position: fixed; inset: 0; z-index: 9999;
    background: ${bg};
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.7s ease;
  }
  #ef-screen.ef-fade { opacity: 0; pointer-events: none; }

  .ef-stage {
    display: flex; flex-direction: column;
    align-items: center; gap: 32px;
    cursor: pointer; user-select: none; outline: none;
  }

  /* ── ENVELOPPE ── */
  .ef-env {
    position: relative;
    width: 380px; height: 260px;
    background: #f0e8da;
    border-radius: 3px;
    box-shadow: 0 12px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07);
    perspective: 1000px;
  }

  /* Intérieur floral */
  .ef-interior {
    position: absolute; inset: 0; z-index: 0;
    background: linear-gradient(145deg, #fce4ea 0%, #f4cedb 50%, #fce4ea 100%);
    border-radius: 3px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 8px;
  }
  .ef-int-fl       { color: #c87890; font-size: 2.2rem; opacity: 0.5; }
  .ef-int-fl--sm   { font-size: 1rem; opacity: 0.4; }
  .ef-int-row      { color: #c07888; font-size: 1rem; letter-spacing: 0.6em; opacity: 0.45; }

  /* Carte */
  .ef-card {
    position: absolute;
    bottom: 18px; left: 50%;
    width: 276px;
    transform: translateX(-50%) translateY(0);
    background: #fffef9;
    border: 1px solid rgba(180,148,108,0.2);
    padding: 22px 20px;
    display: flex; flex-direction: column;
    align-items: center; gap: 8px;
    z-index: 2;
    opacity: 0;
    transition:
      transform 1.4s cubic-bezier(0.2, 0.85, 0.2, 1),
      opacity 0.7s ease 0.25s;
    box-shadow: 0 4px 28px rgba(0,0,0,0.12);
  }
  .ef-card--out {
    transform: translateX(-50%) translateY(-315px);
    opacity: 1;
  }
  .ef-card-deco  { color: #b8946a; font-size: 0.7rem; }
  .ef-card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem; color: #4a3828;
    letter-spacing: 0.06em; text-align: center; margin: 0;
  }
  .ef-card-sep   { font-size: 0.65rem; color: #b8946a; letter-spacing: 0.25em; margin: 0; }
  .ef-card-sub   {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.85rem; font-style: italic;
    color: #7a6050; margin: 0;
  }

  /* Plis de l'enveloppe */
  .ef-fold-l, .ef-fold-r, .ef-fold-b {
    position: absolute; z-index: 3; pointer-events: none;
  }
  .ef-fold-l {
    bottom: 0; left: 0; width: 0; height: 0;
    border-style: solid;
    border-width: 130px 0 0 190px;
    border-color: transparent transparent transparent #e3d9c8;
  }
  .ef-fold-r {
    bottom: 0; right: 0; width: 0; height: 0;
    border-style: solid;
    border-width: 0 0 130px 190px;
    border-color: transparent transparent #e3d9c8 transparent;
  }
  .ef-fold-b {
    bottom: 0; left: 0; right: 0; height: 50%;
    background: #dacec0;
    clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  }

  /* Sceau de cire */
  .ef-seal {
    position: absolute;
    top: calc(55% - 27px); left: calc(50% - 27px);
    width: 54px; height: 54px;
    background: radial-gradient(circle at 38% 33%, #d84848, #8b1818);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow:
      0 3px 12px rgba(139,24,24,0.45),
      inset 0 1px 4px rgba(255,255,255,0.18);
    z-index: 5;
    transition: transform 0.55s ease, opacity 0.55s ease;
  }
  .ef-seal--off {
    transform: scale(1.5) translateY(-14px);
    opacity: 0;
  }
  .ef-seal-glyph { color: rgba(255,220,210,0.88); font-size: 1.5rem; pointer-events: none; }

  /* Rabat supérieur (3D) */
  .ef-flap {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 55%;
    background: linear-gradient(168deg, #e6dbcc 0%, #ddd0bc 100%);
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    transform-origin: top center;
    transform: rotateX(0deg);
    transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
    backface-visibility: hidden;
    z-index: 4;
  }
  .ef-flap--open { transform: rotateX(-180deg); }

  /* Texte hint */
  .ef-hint {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.95rem; color: #8a7060;
    letter-spacing: 0.2em; margin: 0;
    transition: opacity 0.4s ease;
  }
  .ef-hint--out { opacity: 0; }
` }
