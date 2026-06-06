'use client'
import { useState } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'

export default function ChateauPivoines({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate, introText,
  } = useInvitationLogic(wedding)

  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)

  const formattedTime = eventDate.toLocaleTimeString('fr-TN', {
    hour: '2-digit', minute: '2-digit',
  })
  const formattedDate = eventDate.toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  function playSealCrack() {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } catch (e) { /* noop */ }
  }

  function startSequence() {
    if (phase !== 0) return
    playSealCrack()
    setPhase(1)                                      // sceau qui se brise
    setTimeout(() => setPhase(2), 800)               // rabat qui s'ouvre
    setTimeout(() => setPhase(3), 1800)              // enveloppe disparait
    setTimeout(() => { setPhase(4); openEnvelope() }, 2400) // fade vers invitation
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Cinzel:wght@400;500;600&family=Inter:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>
      <FontOverride font={wedding.custom_font} container=".cp-container" />

      {/* === ÉCRAN D'OUVERTURE — ENVELOPPE & SCEAU === */}
      {!opened && (
        <div className={`cp-env-screen cp-phase-${phase}`}>
          <div className="cp-env-wrap" onClick={startSequence}>
            {/* Corps de l'enveloppe (papier texturé) */}
            <div className="cp-env-body">
              <div className="cp-env-paper-texture" />

              {/* Rabat inférieur (toujours fermé) */}
              <div className="cp-env-flap-bottom" />
              {/* Rabats latéraux */}
              <div className="cp-env-flap-left" />
              <div className="cp-env-flap-right" />

              {/* Rabat supérieur — s'ouvre vers le haut */}
              <div className="cp-env-flap-top">
                <div className="cp-env-flap-shadow" />
              </div>

              {/* Sceau de cire doré */}
              <div className="cp-seal">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  {/* Demi-sceau gauche */}
                  <g className="cp-seal-left">
                    <circle cx="60" cy="60" r="46" fill="url(#cpSealGrad)" />
                    <circle cx="60" cy="60" r="46" fill="none" stroke="#7a5a1e" strokeWidth="1.5" opacity="0.6" />
                    {/* Texture éclats de cire */}
                    <circle cx="44" cy="44" r="2" fill="#7a5a1e" opacity="0.18" />
                    <circle cx="52" cy="78" r="1.5" fill="#7a5a1e" opacity="0.14" />
                    <circle cx="38" cy="68" r="1" fill="#7a5a1e" opacity="0.18" />
                    {/* Bord déchiré gauche */}
                    <path d="M 60 14 Q 58 30 60 45 Q 56 55 60 65 Q 58 80 60 95 Q 56 105 60 106 L 14 60 Z" fill="url(#cpSealGrad)" opacity="0" />
                  </g>

                  {/* Demi-sceau droit (se détache en phase 1) */}
                  <g className="cp-seal-right">
                    <circle cx="60" cy="60" r="46" fill="url(#cpSealGrad)" clipPath="url(#cpSealRightClip)" />
                  </g>

                  {/* Motif floral central : trois petites fleurs */}
                  <g className="cp-seal-flowers">
                    {/* Fleur centrale (plus grande) */}
                    <g transform="translate(60 60)">
                      <circle cx="0" cy="-6" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="5.7" cy="-1.8" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="3.5" cy="5" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="-3.5" cy="5" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="-5.7" cy="-1.8" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="0" cy="0" r="2.2" fill="#9c7a2e" />
                    </g>
                    {/* Fleur haut-gauche */}
                    <g transform="translate(40 38) scale(0.55)">
                      <circle cx="0" cy="-6" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="5.7" cy="-1.8" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="3.5" cy="5" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="-3.5" cy="5" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="-5.7" cy="-1.8" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="0" cy="0" r="2" fill="#9c7a2e" />
                    </g>
                    {/* Fleur bas-droite */}
                    <g transform="translate(80 82) scale(0.55)">
                      <circle cx="0" cy="-6" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="5.7" cy="-1.8" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="3.5" cy="5" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="-3.5" cy="5" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="-5.7" cy="-1.8" r="3.5" fill="#fef7e6" opacity="0.85" />
                      <circle cx="0" cy="0" r="2" fill="#9c7a2e" />
                    </g>
                    {/* Petites feuilles décoratives */}
                    <path d="M 50 50 Q 55 48 58 52" stroke="#fef7e6" strokeWidth="1.2" fill="none" opacity="0.7" />
                    <path d="M 70 70 Q 65 72 62 68" stroke="#fef7e6" strokeWidth="1.2" fill="none" opacity="0.7" />
                  </g>

                  <defs>
                    <radialGradient id="cpSealGrad" cx="0.35" cy="0.35" r="0.75">
                      <stop offset="0%" stopColor="#e8c878" />
                      <stop offset="50%" stopColor="#c9a05a" />
                      <stop offset="100%" stopColor="#8c6a2a" />
                    </radialGradient>
                    <clipPath id="cpSealRightClip">
                      <path d="M 60 14 Q 62 30 60 45 Q 64 55 60 65 Q 62 80 60 95 Q 64 105 60 106 L 106 60 Z" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Texte d'invitation sous l'enveloppe */}
            <p className="cp-env-hint">
              <span className="cp-env-hint-line" />
              Cliquez sur le sceau pour ouvrir l'invitation
              <span className="cp-env-hint-line" />
            </p>
          </div>
        </div>
      )}

      {/* === INVITATION === */}
      <div className={`cp-invitation cp-container${visible ? ' cp-visible' : ''}`}>

        {/* ===== 1. HERO — CHÂTEAU & FONTAINE ===== */}
        <section className="cp-hero">
          {/* Décor ciel + château */}
          <div className="cp-hero-scene">
            <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="cp-castle-svg">
              {/* Ciel dégradé */}
              <defs>
                <linearGradient id="cpSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8dcea" />
                  <stop offset="60%" stopColor="#e6eef5" />
                  <stop offset="100%" stopColor="#f3e9d8" />
                </linearGradient>
                <linearGradient id="cpCastleStone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#efe2c8" />
                  <stop offset="100%" stopColor="#c8b48a" />
                </linearGradient>
                <linearGradient id="cpRoof" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c5640" />
                  <stop offset="100%" stopColor="#5a3e2c" />
                </linearGradient>
                <radialGradient id="cpFountainWater" cx="0.5" cy="0.3" r="0.7">
                  <stop offset="0%" stopColor="#d6e6ef" />
                  <stop offset="100%" stopColor="#8aa9bd" />
                </radialGradient>
              </defs>

              {/* Ciel */}
              <rect x="0" y="0" width="800" height="600" fill="url(#cpSky)" />

              {/* Nuages */}
              <g opacity="0.85" fill="#ffffff">
                <ellipse cx="120" cy="90" rx="55" ry="14" />
                <ellipse cx="160" cy="80" rx="35" ry="10" />
                <ellipse cx="650" cy="110" rx="70" ry="16" />
                <ellipse cx="700" cy="100" rx="40" ry="11" />
                <ellipse cx="400" cy="60" rx="45" ry="11" />
              </g>

              {/* Colombes */}
              <g className="cp-dove cp-dove-1" fill="#ffffff">
                <path d="M 200 140 Q 210 130 220 138 Q 218 142 215 142 Q 222 145 226 142 Q 222 148 218 148 L 212 148 Q 206 150 200 146 Q 198 142 200 140 Z" />
                <path d="M 205 138 Q 200 132 195 134 Q 200 138 205 138" />
              </g>
              <g className="cp-dove cp-dove-2" fill="#ffffff">
                <path d="M 580 170 Q 590 160 600 168 Q 598 172 595 172 Q 602 175 606 172 Q 602 178 598 178 L 592 178 Q 586 180 580 176 Q 578 172 580 170 Z" />
                <path d="M 585 168 Q 580 162 575 164 Q 580 168 585 168" />
              </g>

              {/* Château — tour gauche */}
              <rect x="120" y="280" width="100" height="200" fill="url(#cpCastleStone)" />
              <polygon points="120,280 170,210 220,280" fill="url(#cpRoof)" />
              <rect x="155" y="320" width="30" height="50" fill="#5a3e2c" opacity="0.7" rx="14" />
              <circle cx="170" cy="245" r="3" fill="#c9a961" />
              <line x1="170" y1="195" x2="170" y2="210" stroke="#6a4a32" strokeWidth="2" />

              {/* Château — corps central */}
              <rect x="220" y="240" width="360" height="240" fill="url(#cpCastleStone)" />
              <polygon points="220,240 400,180 580,240" fill="url(#cpRoof)" />
              {/* Fenêtres */}
              <g fill="#5a3e2c" opacity="0.7">
                <rect x="250" y="290" width="22" height="40" rx="11" />
                <rect x="295" y="290" width="22" height="40" rx="11" />
                <rect x="340" y="290" width="22" height="40" rx="11" />
                <rect x="438" y="290" width="22" height="40" rx="11" />
                <rect x="483" y="290" width="22" height="40" rx="11" />
                <rect x="528" y="290" width="22" height="40" rx="11" />
              </g>
              {/* Porte centrale */}
              <path d="M 380 480 L 380 400 Q 380 370 400 370 Q 420 370 420 400 L 420 480 Z" fill="#3e2818" opacity="0.85" />
              <line x1="400" y1="380" x2="400" y2="478" stroke="#c9a961" strokeWidth="0.8" opacity="0.6" />
              {/* Drapeau */}
              <line x1="400" y1="160" x2="400" y2="185" stroke="#6a4a32" strokeWidth="2" />
              <path d="M 400 168 L 420 173 L 400 178 Z" fill="#7B1E2E" />

              {/* Château — tour droite */}
              <rect x="580" y="280" width="100" height="200" fill="url(#cpCastleStone)" />
              <polygon points="580,280 630,210 680,280" fill="url(#cpRoof)" />
              <rect x="615" y="320" width="30" height="50" fill="#5a3e2c" opacity="0.7" rx="14" />
              <circle cx="630" cy="245" r="3" fill="#c9a961" />
              <line x1="630" y1="195" x2="630" y2="210" stroke="#6a4a32" strokeWidth="2" />

              {/* Sol / esplanade */}
              <rect x="0" y="480" width="800" height="120" fill="#d4c08e" />
              <rect x="0" y="478" width="800" height="6" fill="#a8915c" opacity="0.5" />

              {/* Fontaine — bassin */}
              <ellipse cx="400" cy="540" rx="170" ry="22" fill="#7a6a4a" opacity="0.4" />
              <ellipse cx="400" cy="535" rx="170" ry="22" fill="url(#cpFountainWater)" />
              <ellipse cx="400" cy="530" rx="170" ry="18" fill="none" stroke="#a8915c" strokeWidth="3" />

              {/* Fontaine — colonne et vasque */}
              <rect x="390" y="475" width="20" height="60" fill="#c8b48a" />
              <ellipse cx="400" cy="475" rx="40" ry="8" fill="#c8b48a" />
              <ellipse cx="400" cy="472" rx="40" ry="8" fill="none" stroke="#a8915c" strokeWidth="1.5" />
              {/* Jets d'eau */}
              <g fill="#d6e6ef" opacity="0.7">
                <path d="M 400 470 Q 395 455 393 475" />
                <path d="M 400 470 Q 405 455 407 475" />
                <path d="M 400 468 L 400 455" stroke="#d6e6ef" strokeWidth="2" fill="none" />
              </g>
            </svg>
          </div>

          {/* Type d'événement + date en haut */}
          <div className="cp-hero-top">
            <p className="cp-hero-eyebrow">— Mariage —</p>
            <p className="cp-hero-date-top">{formattedDate}</p>
          </div>

          {/* Noms cursifs centrés au-dessus de la fontaine */}
          <div className="cp-hero-names">
            <p className="cp-hero-intro">{introText}</p>
            <h1 className="cp-names">
              <span className="cp-name">{wedding.bride_name}</span>
              <span className="cp-amp">&amp;</span>
              <span className="cp-name">{wedding.groom_name}</span>
            </h1>
            <p className="cp-hero-time">à {formattedTime}</p>
            {wedding.custom_message && (
              <p className="cp-hero-message">{wedding.custom_message}</p>
            )}
          </div>

          {/* Bouquet de pivoines en premier plan */}
          <div className="cp-bouquet" aria-hidden="true">
            <svg viewBox="0 0 1200 280" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="cpRoseRed" cx="0.4" cy="0.35" r="0.7">
                  <stop offset="0%" stopColor="#c44a5c" />
                  <stop offset="60%" stopColor="#9c1f33" />
                  <stop offset="100%" stopColor="#6e1424" />
                </radialGradient>
                <radialGradient id="cpRoseWhite" cx="0.4" cy="0.35" r="0.7">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#f7ecdf" />
                  <stop offset="100%" stopColor="#d8c4ad" />
                </radialGradient>
                <radialGradient id="cpRosePink" cx="0.4" cy="0.35" r="0.7">
                  <stop offset="0%" stopColor="#f0c4cb" />
                  <stop offset="100%" stopColor="#c88a96" />
                </radialGradient>
                <linearGradient id="cpLeaf" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4a6a3a" />
                  <stop offset="100%" stopColor="#2d4525" />
                </linearGradient>
              </defs>

              {/* Feuillage arrière */}
              <g opacity="0.85">
                <ellipse cx="180" cy="160" rx="70" ry="28" fill="url(#cpLeaf)" transform="rotate(-20 180 160)" />
                <ellipse cx="350" cy="130" rx="80" ry="30" fill="url(#cpLeaf)" transform="rotate(-10 350 130)" />
                <ellipse cx="600" cy="100" rx="90" ry="32" fill="url(#cpLeaf)" />
                <ellipse cx="850" cy="130" rx="80" ry="30" fill="url(#cpLeaf)" transform="rotate(10 850 130)" />
                <ellipse cx="1020" cy="160" rx="70" ry="28" fill="url(#cpLeaf)" transform="rotate(20 1020 160)" />
              </g>

              {/* Roses & pivoines — rangée arrière */}
              {[
                { cx: 140, cy: 180, r: 55, fill: 'url(#cpRoseWhite)' },
                { cx: 260, cy: 150, r: 60, fill: 'url(#cpRoseRed)' },
                { cx: 380, cy: 130, r: 65, fill: 'url(#cpRoseWhite)' },
                { cx: 510, cy: 115, r: 70, fill: 'url(#cpRoseRed)' },
                { cx: 650, cy: 110, r: 72, fill: 'url(#cpRoseWhite)' },
                { cx: 790, cy: 115, r: 70, fill: 'url(#cpRoseRed)' },
                { cx: 920, cy: 130, r: 65, fill: 'url(#cpRoseWhite)' },
                { cx: 1040, cy: 150, r: 60, fill: 'url(#cpRoseRed)' },
                { cx: 1160, cy: 180, r: 55, fill: 'url(#cpRosePink)' },
              ].map((r, i) => (
                <g key={`back-${i}`}>
                  <circle cx={r.cx} cy={r.cy} r={r.r} fill={r.fill} />
                  {/* Pétales suggestifs */}
                  <circle cx={r.cx - r.r * 0.25} cy={r.cy - r.r * 0.2} r={r.r * 0.45} fill={r.fill} opacity="0.7" />
                  <circle cx={r.cx + r.r * 0.3} cy={r.cy + r.r * 0.1} r={r.r * 0.4} fill={r.fill} opacity="0.6" />
                  <circle cx={r.cx} cy={r.cy} r={r.r * 0.25} fill="#000" opacity="0.08" />
                </g>
              ))}

              {/* Rangée avant — plus petites, plus dense */}
              {[
                { cx: 80, cy: 230, r: 40, fill: 'url(#cpRoseRed)' },
                { cx: 200, cy: 220, r: 45, fill: 'url(#cpRoseWhite)' },
                { cx: 320, cy: 210, r: 50, fill: 'url(#cpRoseRed)' },
                { cx: 450, cy: 200, r: 52, fill: 'url(#cpRoseWhite)' },
                { cx: 590, cy: 195, r: 55, fill: 'url(#cpRoseRed)' },
                { cx: 730, cy: 200, r: 52, fill: 'url(#cpRoseWhite)' },
                { cx: 860, cy: 210, r: 50, fill: 'url(#cpRoseRed)' },
                { cx: 980, cy: 220, r: 45, fill: 'url(#cpRoseWhite)' },
                { cx: 1100, cy: 230, r: 40, fill: 'url(#cpRoseRed)' },
              ].map((r, i) => (
                <g key={`front-${i}`}>
                  <circle cx={r.cx} cy={r.cy} r={r.r} fill={r.fill} />
                  <circle cx={r.cx - r.r * 0.25} cy={r.cy - r.r * 0.2} r={r.r * 0.45} fill={r.fill} opacity="0.7" />
                  <circle cx={r.cx} cy={r.cy} r={r.r * 0.22} fill="#000" opacity="0.1" />
                </g>
              ))}
            </svg>
          </div>
        </section>

        {/* ===== 2. MOT D'ACCUEIL + COMPTE À REBOURS ===== */}
        <section className="cp-welcome">
          {/* Découpe papier déchiré haut */}
          <div className="cp-tear cp-tear-top" aria-hidden="true">
            <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 0 L 1440 0 L 1440 25 Q 1380 35 1320 22 Q 1260 12 1200 28 Q 1140 38 1080 24 Q 1020 14 960 30 Q 900 40 840 26 Q 780 16 720 32 Q 660 40 600 25 Q 540 15 480 30 Q 420 38 360 24 Q 300 14 240 30 Q 180 40 120 26 Q 60 16 0 28 Z" fill="#7B1E2E" />
            </svg>
          </div>

          <div className="cp-welcome-inner">
            <p className="cp-welcome-eyebrow">— Le mot d'accueil —</p>
            <p className="cp-welcome-text">
              Avec une joie immense, nous vous invitons à partager
              une journée unique placée sous le signe de l'amour,
              du raffinement et de la fête. Votre présence sera
              le plus beau des cadeaux.
            </p>

            <div className="cp-countdown-wrap">
              <div className="cp-tear-mini cp-tear-mini-top" aria-hidden="true" />
              <p className="cp-countdown-label">Le grand jour dans</p>
              <div className="cp-countdown">
                <div className="cp-cd-cell">
                  <span className="cp-cd-num">{countdown.d}</span>
                  <span className="cp-cd-lbl">Jours</span>
                </div>
                <span className="cp-cd-sep">:</span>
                <div className="cp-cd-cell">
                  <span className="cp-cd-num">{countdown.h}</span>
                  <span className="cp-cd-lbl">Heures</span>
                </div>
                <span className="cp-cd-sep">:</span>
                <div className="cp-cd-cell">
                  <span className="cp-cd-num">{countdown.m}</span>
                  <span className="cp-cd-lbl">Minutes</span>
                </div>
                <span className="cp-cd-sep">:</span>
                <div className="cp-cd-cell">
                  <span className="cp-cd-num">{countdown.s}</span>
                  <span className="cp-cd-lbl">Secondes</span>
                </div>
              </div>
              <div className="cp-tear-mini cp-tear-mini-bot" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* ===== 3. PROGRAMME — TIMELINE VERTICALE ===== */}
        {wedding.program?.length > 0 && (
          <section className="cp-program">
            <p className="cp-section-eyebrow cp-eyebrow-light">— Programme de la journée —</p>
            <h2 className="cp-section-title cp-title-light">Le déroulé</h2>

            <div className="cp-timeline">
              <div className="cp-timeline-line" />
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <div key={i} className={`cp-tl-item ${i % 2 === 0 ? 'cp-tl-left' : 'cp-tl-right'}`}>
                  <div className="cp-tl-marker" aria-hidden="true">
                    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      {/* Bouton de rose blanche */}
                      <defs>
                        <radialGradient id={`cpBudGrad${i}`} cx="0.4" cy="0.4" r="0.6">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#e8d5be" />
                        </radialGradient>
                      </defs>
                      {/* Feuilles */}
                      <ellipse cx="12" cy="28" rx="8" ry="3" fill="#4a6a3a" transform="rotate(-30 12 28)" />
                      <ellipse cx="28" cy="28" rx="8" ry="3" fill="#4a6a3a" transform="rotate(30 28 28)" />
                      {/* Bouton */}
                      <ellipse cx="20" cy="18" rx="9" ry="11" fill={`url(#cpBudGrad${i})`} />
                      <path d="M 20 8 Q 14 12 14 20 Q 14 26 20 28 Q 26 26 26 20 Q 26 12 20 8 Z" fill="#ffffff" opacity="0.5" />
                      <ellipse cx="20" cy="18" rx="3" ry="6" fill="#c8a878" opacity="0.4" />
                    </svg>
                  </div>
                  <div className="cp-tl-card">
                    <p className="cp-tl-time">{item.time}</p>
                    <p className="cp-tl-event">{item.event}</p>
                    {item.venue && <p className="cp-tl-venue">{item.venue}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== 4. LIEU — CROQUIS À L'ENCRE ===== */}
        <section className="cp-venue">
          <p className="cp-section-eyebrow">— Le lieu —</p>
          <h2 className="cp-section-title">Nous vous attendons</h2>

          <div className="cp-venue-sketch" aria-hidden="true">
            <svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              {/* Sol */}
              <line x1="40" y1="245" x2="560" y2="245" />
              {/* Corps principal */}
              <rect x="200" y="120" width="200" height="125" />
              {/* Toit central */}
              <polyline points="200,120 300,70 400,120" />
              {/* Tour gauche */}
              <rect x="120" y="145" width="80" height="100" />
              <polyline points="120,145 160,100 200,145" />
              <line x1="160" y1="85" x2="160" y2="100" />
              <circle cx="160" cy="83" r="2" fill="#1a1a1a" />
              {/* Tour droite */}
              <rect x="400" y="145" width="80" height="100" />
              <polyline points="400,145 440,100 480,145" />
              <line x1="440" y1="85" x2="440" y2="100" />
              <circle cx="440" cy="83" r="2" fill="#1a1a1a" />
              {/* Fenêtres centrales */}
              <rect x="225" y="155" width="14" height="30" rx="7" />
              <rect x="255" y="155" width="14" height="30" rx="7" />
              <rect x="331" y="155" width="14" height="30" rx="7" />
              <rect x="361" y="155" width="14" height="30" rx="7" />
              {/* Porte */}
              <path d="M 285 245 L 285 200 Q 285 185 300 185 Q 315 185 315 200 L 315 245" />
              {/* Fenêtres tours */}
              <rect x="148" y="170" width="24" height="30" rx="12" />
              <rect x="428" y="170" width="24" height="30" rx="12" />
              {/* Fanion */}
              <line x1="300" y1="55" x2="300" y2="70" />
              <path d="M 300 60 L 315 64 L 300 68 Z" />
              {/* Arbres décoratifs */}
              <circle cx="65" cy="225" r="20" />
              <line x1="65" y1="245" x2="65" y2="240" />
              <circle cx="535" cy="225" r="20" />
              <line x1="535" y1="245" x2="535" y2="240" />
              {/* Petits motifs sol */}
              <path d="M 50 250 Q 100 252 150 250" opacity="0.5" />
              <path d="M 450 250 Q 500 252 550 250" opacity="0.5" />
            </svg>
          </div>

          <div className="cp-venue-info">
            <h3 className="cp-venue-name">{wedding.venue_name}</h3>
            {wedding.venue_address && (
              <p className="cp-venue-addr">{wedding.venue_address}</p>
            )}

            {(wedding.gps_google || wedding.gps_apple) && (
              <div className="cp-venue-buttons">
                {wedding.gps_google && (
                  <a className="cp-venue-btn" href={wedding.gps_google} target="_blank" rel="noopener noreferrer">
                    Google Maps
                  </a>
                )}
                {wedding.gps_apple && (
                  <a className="cp-venue-btn" href={wedding.gps_apple} target="_blank" rel="noopener noreferrer">
                    Apple Plans
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ===== 5. RSVP ===== */}
        {wedding.show_rsvp && (
          <section className="cp-rsvp">
            {/* Petit rappel floral en haut */}
            <div className="cp-rsvp-roses" aria-hidden="true">
              <svg viewBox="0 0 600 60" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="cpRsvpRoseR" cx="0.4" cy="0.4" r="0.7">
                    <stop offset="0%" stopColor="#c44a5c" />
                    <stop offset="100%" stopColor="#6e1424" />
                  </radialGradient>
                  <radialGradient id="cpRsvpRoseW" cx="0.4" cy="0.4" r="0.7">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#d8c4ad" />
                  </radialGradient>
                </defs>
                <ellipse cx="100" cy="30" rx="40" ry="14" fill="#4a6a3a" opacity="0.8" transform="rotate(-15 100 30)" />
                <ellipse cx="500" cy="30" rx="40" ry="14" fill="#4a6a3a" opacity="0.8" transform="rotate(15 500 30)" />
                <circle cx="120" cy="32" r="22" fill="url(#cpRsvpRoseR)" />
                <circle cx="170" cy="38" r="18" fill="url(#cpRsvpRoseW)" />
                <circle cx="220" cy="34" r="20" fill="url(#cpRsvpRoseR)" />
                <circle cx="300" cy="36" r="22" fill="url(#cpRsvpRoseW)" />
                <circle cx="380" cy="34" r="20" fill="url(#cpRsvpRoseR)" />
                <circle cx="430" cy="38" r="18" fill="url(#cpRsvpRoseW)" />
                <circle cx="480" cy="32" r="22" fill="url(#cpRsvpRoseR)" />
              </svg>
            </div>

            <div className="cp-rsvp-inner">
              <p className="cp-section-eyebrow cp-eyebrow-light">— Confirmation —</p>
              <h2 className="cp-section-title cp-title-light">Serez-vous des nôtres ?</h2>
              <p className="cp-rsvp-sub">
                Merci de bien vouloir nous confirmer votre présence
                avant le {formattedDate}.
              </p>

              {rsvpStatus === 'done' ? (
                <div className="cp-rsvp-done">
                  <p className="cp-rsvp-done-title">Merci pour votre réponse</p>
                  <p className="cp-rsvp-done-sub">Nous sommes ravis de partager ce moment avec vous.</p>
                </div>
              ) : (
                <form className="cp-rsvp-form" onSubmit={submitRSVP}>
                  <div className="cp-rsvp-choices">
                    {(['present', 'absent', 'maybe'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        className={`cp-rsvp-choice${rsvpChoice === s ? ' cp-on' : ''}`}
                        onClick={() => setRsvpChoice(s)}
                      >
                        {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                      </button>
                    ))}
                  </div>

                  <div className="cp-rsvp-fields">
                    <input className="cp-input" name="name" placeholder="Prénom et nom" required />
                    <input className="cp-input" name="phone" placeholder="WhatsApp (facultatif)" />
                    <input className="cp-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
                    <textarea className="cp-input cp-textarea" name="note" placeholder="Un mot pour les mariés (facultatif)" />
                  </div>

                  <button
                    type="submit"
                    className="cp-rsvp-submit"
                    disabled={rsvpStatus === 'loading'}
                  >
                    {rsvpStatus === 'loading' ? 'Envoi en cours…' : 'Confirmer ma présence'}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* ===== 6. LIVRE D'OR ===== */}
        {wedding.show_guestbook && (
          <section className="cp-guestbook">
            <p className="cp-section-eyebrow">— Livre d'or —</p>
            <h2 className="cp-section-title">Vos mots, leur trésor</h2>

            {messages.length > 0 && (
              <div className="cp-gb-list">
                {messages.map(m => (
                  <div key={m.id} className="cp-gb-card">
                    <p className="cp-gb-msg">« {m.message} »</p>
                    <p className="cp-gb-author">— {m.author_name}</p>
                  </div>
                ))}
              </div>
            )}

            {gbStatus === 'done' ? (
              <p className="cp-gb-done">
                {gbPending
                  ? 'Votre message sera publié après validation.'
                  : 'Votre message a été publié. Merci !'}
              </p>
            ) : (
              <form className="cp-gb-form" onSubmit={submitMessage}>
                <input className="cp-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="cp-input cp-textarea" name="message" placeholder="Laissez un mot doux aux mariés…" required />
                <button type="submit" className="cp-gb-submit" disabled={gbStatus === 'loading'}>
                  {gbStatus === 'loading' ? 'Envoi…' : 'Déposer mon mot'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* ===== 7. CONCLUSION + FOOTER ===== */}
        <section className="cp-conclusion">
          <p className="cp-conclusion-text">
            « Avec tout notre amour, nous comptons les jours
            qui nous séparent du moment de vous accueillir. »
          </p>
          <p className="cp-conclusion-sig">
            {wedding.bride_name} &amp; {wedding.groom_name}
          </p>

          {/* Photo finale stylisée (placeholder élégant) */}
          <div className="cp-couple-photo" aria-hidden="true">
            <div className="cp-photo-inner">
              <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cpPhotoBg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f3e9d8" />
                    <stop offset="100%" stopColor="#d4c08e" />
                  </linearGradient>
                </defs>
                <rect width="200" height="240" fill="url(#cpPhotoBg)" />
                {/* Silhouettes du couple */}
                <ellipse cx="78" cy="95" rx="22" ry="26" fill="#3e2818" opacity="0.85" />
                <path d="M 56 120 Q 56 170 78 200 Q 100 240 100 240 L 56 240 Z" fill="#3e2818" opacity="0.85" />
                <path d="M 56 120 Q 78 130 100 130 L 100 200 Q 80 220 56 200 Z" fill="#3e2818" opacity="0.85" />
                <ellipse cx="125" cy="92" rx="20" ry="24" fill="#7B1E2E" opacity="0.85" />
                <path d="M 105 115 Q 105 175 125 200 Q 145 240 145 240 L 105 240 Z" fill="#7B1E2E" opacity="0.85" />
                {/* Bouquet entre eux */}
                <circle cx="100" cy="160" r="10" fill="#c44a5c" />
                <circle cx="93" cy="155" r="8" fill="#ffffff" opacity="0.9" />
                <circle cx="107" cy="158" r="8" fill="#c44a5c" />
              </svg>
            </div>
          </div>
        </section>

        <footer className="cp-footer">
          <div className="cp-footer-flourish">❦</div>
          <p className="cp-footer-names">{wedding.bride_name} &amp; {wedding.groom_name}</p>
          <p className="cp-footer-date">{formattedDate}</p>
          <p className="cp-footer-brand">
            Invitation digitale signée <strong>Élégance Digitale</strong>
          </p>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cp-burgundy: #7B1E2E;
    --cp-burgundy-deep: #5C1422;
    --cp-burgundy-soft: #9B2E3E;
    --cp-paper: #FAF6EE;
    --cp-paper-warm: #F3E9D8;
    --cp-cream: #FEF7E6;
    --cp-gold: #C9A961;
    --cp-gold-deep: #A88547;
    --cp-rose-red: #C44A5C;
    --cp-rose-white: #F7ECDF;
    --cp-ink: #1A1A1A;
    --cp-ink-soft: #4A4A4A;
    --cp-leaf: #4A6A3A;
  }

  body {
    background: var(--cp-paper);
    color: var(--cp-ink);
    overflow-x: hidden;
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  .cp-container { font-family: 'Cormorant Garamond', Georgia, serif; }

  /* =========================================
     ÉCRAN ENVELOPPE
     ========================================= */
  .cp-env-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: radial-gradient(ellipse at center, #f7ecdf 0%, #e0cdb0 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    transition: opacity 0.6s ease;
  }
  .cp-env-screen.cp-phase-3 { opacity: 0; pointer-events: none; }

  .cp-env-wrap {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    user-select: none;
  }

  .cp-env-body {
    position: relative;
    width: 360px;
    height: 240px;
    transform-style: preserve-3d;
    perspective: 1200px;
  }

  /* Corps de l'enveloppe (texture papier) */
  .cp-env-paper-texture {
    position: absolute;
    inset: 0;
    background: #fefcf7;
    border-radius: 4px;
    box-shadow:
      0 12px 40px rgba(60, 30, 10, 0.18),
      0 2px 6px rgba(60, 30, 10, 0.08),
      inset 0 0 80px rgba(180, 140, 90, 0.08);
    background-image:
      radial-gradient(circle at 20% 30%, rgba(200, 170, 130, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(200, 170, 130, 0.05) 0%, transparent 50%),
      repeating-linear-gradient(45deg, rgba(180, 140, 90, 0.02) 0px, rgba(180, 140, 90, 0.02) 1px, transparent 1px, transparent 3px);
  }

  /* Rabats latéraux & inférieur */
  .cp-env-flap-bottom {
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background:
      linear-gradient(135deg, transparent 49.5%, rgba(180, 140, 90, 0.18) 50%, transparent 50.5%),
      linear-gradient(-135deg, transparent 49.5%, rgba(180, 140, 90, 0.18) 50%, transparent 50.5%);
    pointer-events: none;
  }
  .cp-env-flap-left,
  .cp-env-flap-right {
    position: absolute;
    top: 0; bottom: 0;
    width: 50%;
    background: linear-gradient(to right, rgba(180, 140, 90, 0.05), transparent 80%);
    pointer-events: none;
  }
  .cp-env-flap-right {
    left: auto; right: 0;
    background: linear-gradient(to left, rgba(180, 140, 90, 0.05), transparent 80%);
  }

  /* Rabat supérieur — clé de l'animation */
  .cp-env-flap-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 130px;
    background: #fefcf7;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    transform-origin: top center;
    transition: transform 0.9s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.4s ease 0.6s;
    box-shadow: 0 4px 8px rgba(60, 30, 10, 0.08);
    z-index: 3;
  }
  .cp-env-flap-shadow {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(180, 140, 90, 0.12));
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }
  .cp-phase-2 .cp-env-flap-top,
  .cp-phase-3 .cp-env-flap-top {
    transform: rotateX(-180deg);
    opacity: 0;
  }

  /* Sceau de cire */
  .cp-seal {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 110px;
    height: 110px;
    transform: translate(-50%, -50%);
    z-index: 4;
    filter: drop-shadow(0 4px 8px rgba(80, 50, 20, 0.35));
    animation: cpSealPulse 2.4s ease-in-out infinite;
  }
  .cp-seal svg { width: 100%; height: 100%; }
  .cp-phase-1 .cp-seal,
  .cp-phase-2 .cp-seal,
  .cp-phase-3 .cp-seal {
    animation: none;
  }

  /* Casse du sceau en phase 1 */
  .cp-seal-left,
  .cp-seal-right {
    transform-origin: center;
    transition: transform 0.6s cubic-bezier(0.6, 0, 0.4, 1), opacity 0.5s ease 0.3s;
  }
  .cp-phase-1 .cp-seal-left { transform: translateX(-30px) rotate(-12deg); opacity: 0; }
  .cp-phase-1 .cp-seal-right { transform: translateX(30px) rotate(12deg); opacity: 0; }
  .cp-phase-2 .cp-seal-left,
  .cp-phase-3 .cp-seal-left { transform: translateX(-30px) rotate(-12deg); opacity: 0; }
  .cp-phase-2 .cp-seal-right,
  .cp-phase-3 .cp-seal-right { transform: translateX(30px) rotate(12deg); opacity: 0; }

  .cp-seal-flowers {
    transition: opacity 0.4s ease;
  }
  .cp-phase-1 .cp-seal-flowers,
  .cp-phase-2 .cp-seal-flowers,
  .cp-phase-3 .cp-seal-flowers {
    opacity: 0;
  }

  @keyframes cpSealPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.04); }
  }

  /* Hint sous l'enveloppe */
  .cp-env-hint {
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: #7a5a3a;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }
  .cp-env-hint-line {
    display: inline-block;
    width: 36px;
    height: 1px;
    background: #7a5a3a;
    opacity: 0.5;
  }

  /* =========================================
     INVITATION — base
     ========================================= */
  .cp-invitation {
    opacity: 0;
    transition: opacity 0.8s ease;
    background: var(--cp-paper);
  }
  .cp-invitation.cp-visible { opacity: 1; }

  /* =========================================
     1. HERO
     ========================================= */
  .cp-hero {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    padding: 2.5rem 1.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cp-hero-scene {
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  .cp-castle-svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .cp-dove {
    animation: cpDoveFloat 5s ease-in-out infinite;
    transform-origin: center;
  }
  .cp-dove-2 { animation-delay: -2s; animation-duration: 6s; }
  @keyframes cpDoveFloat {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(8px, -10px); }
  }

  .cp-hero-top {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 2rem;
  }
  .cp-hero-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cp-burgundy);
    margin-bottom: 0.5rem;
  }
  .cp-hero-date-top {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1rem;
    color: var(--cp-ink-soft);
    letter-spacing: 0.05em;
  }

  .cp-hero-names {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-top: 2vh;
    max-width: 620px;
  }
  .cp-hero-intro {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.05rem;
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    margin-bottom: 1.5rem;
    letter-spacing: 0.02em;
  }
  .cp-names {
    font-family: 'Pinyon Script', cursive;
    font-weight: 400;
    color: #ffffff;
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .cp-name {
    font-size: clamp(3.5rem, 9vw, 6rem);
    display: block;
  }
  .cp-amp {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: clamp(2rem, 5vw, 3rem);
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
  .cp-hero-time {
    font-family: 'Cinzel', serif;
    color: #ffffff;
    font-size: 0.95rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    margin-top: 1.5rem;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }
  .cp-hero-message {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: #ffffff;
    font-size: 1.1rem;
    margin-top: 1.5rem;
    max-width: 480px;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    line-height: 1.6;
  }

  .cp-bouquet {
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 35vh;
    max-height: 280px;
    z-index: 1;
    pointer-events: none;
  }
  .cp-bouquet svg {
    width: 100%;
    height: 100%;
    display: block;
    filter: drop-shadow(0 -4px 12px rgba(60, 20, 30, 0.2));
  }

  /* =========================================
     2. ACCUEIL & COMPTE À REBOURS
     ========================================= */
  .cp-welcome {
    position: relative;
    background: var(--cp-burgundy);
    color: #ffffff;
    padding: 0 1.5rem 5rem;
  }
  .cp-tear {
    position: relative;
    height: 40px;
    margin-top: -1px;
    line-height: 0;
  }
  .cp-tear svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .cp-welcome-inner {
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
    padding-top: 2rem;
  }
  .cp-welcome-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cp-gold);
    margin-bottom: 2rem;
  }
  .cp-welcome-text {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.25rem;
    line-height: 1.8;
    color: #f7ecdf;
    margin-bottom: 3.5rem;
    max-width: 580px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Compte à rebours */
  .cp-countdown-wrap {
    position: relative;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    padding: 2.5rem 1.5rem;
    max-width: 580px;
    margin: 0 auto;
  }
  .cp-tear-mini {
    position: absolute;
    left: 0; right: 0;
    height: 12px;
    background-image:
      linear-gradient(135deg, transparent 49%, var(--cp-burgundy) 50%),
      linear-gradient(-135deg, transparent 49%, var(--cp-burgundy) 50%);
    background-size: 16px 12px;
    background-repeat: repeat-x;
  }
  .cp-tear-mini-top { top: -1px; background-position: 0 0; }
  .cp-tear-mini-bot { bottom: -1px; transform: scaleY(-1); }

  .cp-countdown-label {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cp-gold);
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .cp-countdown {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 0.4rem;
  }
  .cp-cd-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
  }
  .cp-cd-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 6vw, 2.8rem);
    font-weight: 500;
    color: #ffffff;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .cp-cd-lbl {
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--cp-gold);
    margin-top: 0.6rem;
  }
  .cp-cd-sep {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 6vw, 2.8rem);
    color: rgba(255, 255, 255, 0.35);
    line-height: 1;
    padding-top: 0;
  }

  /* =========================================
     3. PROGRAMME (TIMELINE)
     ========================================= */
  .cp-program {
    background: var(--cp-burgundy);
    color: #ffffff;
    padding: 4rem 1.5rem 6rem;
  }
  .cp-section-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cp-burgundy);
    text-align: center;
    margin-bottom: 0.75rem;
  }
  .cp-eyebrow-light { color: var(--cp-gold); }
  .cp-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: clamp(2rem, 5vw, 2.8rem);
    font-weight: 500;
    text-align: center;
    color: var(--cp-ink);
    margin-bottom: 3rem;
    letter-spacing: 0.01em;
  }
  .cp-title-light { color: #ffffff; }

  .cp-timeline {
    position: relative;
    max-width: 760px;
    margin: 0 auto;
    padding: 1rem 0;
  }
  .cp-timeline-line {
    position: absolute;
    top: 0; bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    background: linear-gradient(to bottom,
      transparent,
      rgba(255, 255, 255, 0.4) 5%,
      rgba(255, 255, 255, 0.4) 95%,
      transparent);
  }
  .cp-tl-item {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 2.5rem;
    min-height: 80px;
  }
  .cp-tl-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    height: 56px;
    z-index: 2;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
  }
  .cp-tl-marker svg { width: 100%; height: 100%; }
  .cp-tl-card {
    width: calc(50% - 50px);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 1.25rem 1.5rem;
    border-radius: 4px;
  }
  .cp-tl-left .cp-tl-card { margin-right: auto; text-align: right; }
  .cp-tl-right .cp-tl-card { margin-left: auto; text-align: left; }
  .cp-tl-time {
    font-family: 'Cinzel', serif;
    font-size: 1.15rem;
    letter-spacing: 0.15em;
    color: var(--cp-gold);
    margin-bottom: 0.3rem;
  }
  .cp-tl-event {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem;
    font-style: italic;
    color: #ffffff;
    margin-bottom: 0.3rem;
  }
  .cp-tl-venue {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
  }

  /* =========================================
     4. LIEU (CROQUIS À L'ENCRE)
     ========================================= */
  .cp-venue {
    background: var(--cp-paper);
    padding: 5rem 1.5rem;
    text-align: center;
  }
  .cp-venue-sketch {
    max-width: 480px;
    margin: 2rem auto 2.5rem;
  }
  .cp-venue-sketch svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .cp-venue-info {
    max-width: 520px;
    margin: 0 auto;
  }
  .cp-venue-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    font-style: italic;
    font-weight: 500;
    color: var(--cp-burgundy);
    margin-bottom: 0.75rem;
  }
  .cp-venue-addr {
    font-family: 'Cormorant Garamond', serif;
    color: var(--cp-ink-soft);
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  .cp-venue-buttons {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .cp-venue-btn {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--cp-burgundy);
    background: transparent;
    border: 1px solid var(--cp-burgundy);
    padding: 0.85rem 1.5rem;
    text-decoration: none;
    border-radius: 2px;
    transition: all 0.25s ease;
  }
  .cp-venue-btn:hover {
    background: var(--cp-burgundy);
    color: var(--cp-cream);
  }

  /* =========================================
     5. RSVP
     ========================================= */
  .cp-rsvp {
    position: relative;
    background: var(--cp-burgundy);
    color: #ffffff;
    padding: 0 1.5rem 5rem;
  }
  .cp-rsvp-roses {
    height: 60px;
    margin-top: -1px;
    line-height: 0;
  }
  .cp-rsvp-roses svg { width: 100%; height: 100%; display: block; }
  .cp-rsvp-inner {
    max-width: 620px;
    margin: 0 auto;
    text-align: center;
    padding-top: 2rem;
  }
  .cp-rsvp-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: rgba(255, 255, 255, 0.78);
    margin-bottom: 2.5rem;
    font-size: 1.05rem;
  }
  .cp-rsvp-form { display: flex; flex-direction: column; gap: 1.25rem; }
  .cp-rsvp-choices {
    display: flex;
    gap: 0.6rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }
  .cp-rsvp-choice {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    background: transparent;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 0.8rem 1.2rem;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.25s ease;
  }
  .cp-rsvp-choice:hover { border-color: var(--cp-gold); color: var(--cp-gold); }
  .cp-rsvp-choice.cp-on {
    background: var(--cp-gold);
    border-color: var(--cp-gold);
    color: var(--cp-burgundy-deep);
  }
  .cp-rsvp-fields {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .cp-input {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #ffffff;
    padding: 0.95rem 1.2rem;
    border-radius: 2px;
    width: 100%;
    transition: border-color 0.2s ease;
  }
  .cp-input::placeholder { color: rgba(255, 255, 255, 0.45); font-style: italic; }
  .cp-input:focus { outline: none; border-color: var(--cp-gold); }
  .cp-textarea { min-height: 90px; resize: vertical; }

  .cp-rsvp-submit {
    margin-top: 1rem;
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    background: #ffffff;
    color: var(--cp-burgundy);
    border: none;
    padding: 1.3rem 2.5rem;
    cursor: pointer;
    border-radius: 999px;
    transition: all 0.25s ease;
    align-self: center;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  }
  .cp-rsvp-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
  }
  .cp-rsvp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .cp-rsvp-done {
    text-align: center;
    padding: 2rem;
    border: 1px solid var(--cp-gold);
    border-radius: 4px;
    background: rgba(201, 169, 97, 0.08);
  }
  .cp-rsvp-done-title {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.5rem;
    color: var(--cp-gold);
    margin-bottom: 0.5rem;
  }
  .cp-rsvp-done-sub {
    font-family: 'Cormorant Garamond', serif;
    color: rgba(255, 255, 255, 0.75);
  }

  /* =========================================
     6. LIVRE D'OR
     ========================================= */
  .cp-guestbook {
    background: var(--cp-paper);
    padding: 5rem 1.5rem;
  }
  .cp-gb-list {
    max-width: 720px;
    margin: 0 auto 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .cp-gb-card {
    background: #ffffff;
    border: 1px solid rgba(123, 30, 46, 0.15);
    border-left: 3px solid var(--cp-burgundy);
    padding: 1.5rem 1.75rem;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(60, 20, 30, 0.04);
  }
  .cp-gb-msg {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--cp-ink);
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  .cp-gb-author {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--cp-burgundy);
  }
  .cp-gb-form {
    max-width: 580px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .cp-gb-form .cp-input {
    background: #ffffff;
    border: 1px solid rgba(123, 30, 46, 0.2);
    color: var(--cp-ink);
  }
  .cp-gb-form .cp-input::placeholder { color: rgba(74, 74, 74, 0.5); }
  .cp-gb-form .cp-input:focus { border-color: var(--cp-burgundy); }
  .cp-gb-submit {
    margin-top: 0.5rem;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    background: var(--cp-burgundy);
    color: #ffffff;
    border: none;
    padding: 1.05rem 2rem;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.25s ease;
    align-self: center;
  }
  .cp-gb-submit:hover:not(:disabled) { background: var(--cp-burgundy-deep); }
  .cp-gb-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .cp-gb-done {
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: var(--cp-burgundy);
    font-size: 1.1rem;
  }

  /* =========================================
     7. CONCLUSION & FOOTER
     ========================================= */
  .cp-conclusion {
    background: var(--cp-paper-warm);
    padding: 5rem 1.5rem 3rem;
    text-align: center;
  }
  .cp-conclusion-text {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.3rem;
    color: var(--cp-ink);
    line-height: 1.7;
    max-width: 560px;
    margin: 0 auto 1.5rem;
  }
  .cp-conclusion-sig {
    font-family: 'Pinyon Script', cursive;
    font-size: 2.5rem;
    color: var(--cp-burgundy);
    margin-bottom: 3rem;
  }
  .cp-couple-photo {
    max-width: 280px;
    margin: 0 auto;
  }
  .cp-photo-inner {
    background: #ffffff;
    padding: 14px 14px 56px;
    box-shadow: 0 12px 32px rgba(60, 20, 30, 0.18);
    transform: rotate(-2deg);
    border-radius: 2px;
  }
  .cp-photo-inner svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .cp-footer {
    background: var(--cp-burgundy-deep);
    color: #f7ecdf;
    text-align: center;
    padding: 3rem 1.5rem 2.5rem;
  }
  .cp-footer-flourish {
    font-size: 1.8rem;
    color: var(--cp-gold);
    margin-bottom: 1rem;
  }
  .cp-footer-names {
    font-family: 'Pinyon Script', cursive;
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 0.4rem;
  }
  .cp-footer-date {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--cp-gold);
    margin-bottom: 1.5rem;
  }
  .cp-footer-brand {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.85rem;
    color: rgba(247, 236, 223, 0.6);
  }
  .cp-footer-brand strong {
    font-style: normal;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    color: var(--cp-gold);
  }

  /* =========================================
     RESPONSIVE
     ========================================= */
  @media (max-width: 768px) {
    .cp-env-body { width: 300px; height: 200px; }
    .cp-env-flap-top { height: 108px; }
    .cp-seal { width: 90px; height: 90px; }
  }

  @media (max-width: 480px) {
    .cp-env-body { width: 260px; height: 175px; }
    .cp-env-flap-top { height: 95px; }
    .cp-seal { width: 78px; height: 78px; }
    .cp-env-hint { font-size: 0.68rem; letter-spacing: 0.22em; gap: 0.6rem; }
    .cp-env-hint-line { width: 20px; }

    .cp-hero { padding-top: 1.5rem; }
    .cp-name { font-size: 3.2rem; }
    .cp-amp { font-size: 1.8rem; }
    .cp-hero-message { font-size: 1rem; padding: 0 0.5rem; }
    .cp-hero-time { font-size: 0.75rem; letter-spacing: 0.22em; }
    .cp-bouquet { height: 28vh; }

    .cp-welcome-text { font-size: 1.05rem; }
    .cp-countdown { gap: 0.2rem; }
    .cp-cd-cell { min-width: 48px; }
    .cp-cd-num { font-size: 1.7rem; }
    .cp-cd-lbl { font-size: 0.55rem; letter-spacing: 0.18em; }
    .cp-cd-sep { font-size: 1.7rem; }
    .cp-countdown-wrap { padding: 2rem 1rem; }

    /* Timeline en colonne simple sur mobile */
    .cp-timeline-line { left: 28px; }
    .cp-tl-item { padding-left: 70px; }
    .cp-tl-marker { left: 28px; width: 44px; height: 44px; }
    .cp-tl-card,
    .cp-tl-left .cp-tl-card,
    .cp-tl-right .cp-tl-card {
      width: 100%;
      text-align: left;
      margin-left: 0;
      margin-right: 0;
    }
    .cp-tl-event { font-size: 1.15rem; }

    .cp-section-title { font-size: 1.75rem; }
    .cp-conclusion-text { font-size: 1.1rem; }
    .cp-conclusion-sig { font-size: 2rem; }
    .cp-footer-names { font-size: 1.6rem; }

    .cp-rsvp-choice { padding: 0.7rem 0.9rem; font-size: 0.62rem; letter-spacing: 0.18em; }
    .cp-rsvp-submit { padding: 1.1rem 1.8rem; font-size: 0.7rem; letter-spacing: 0.25em; }
  }
`