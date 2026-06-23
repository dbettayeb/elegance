'use client'
import { useState } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'

export default function CoeurDore({ wedding }: { wedding: Wedding }) {
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
  const weekday = eventDate.toLocaleDateString('fr-TN', { weekday: 'long' })
  const day = eventDate.getDate()
  const month = eventDate.toLocaleDateString('fr-TN', { month: 'long' })
  const year = eventDate.getFullYear()

  function playSoftChime() {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.55)
    } catch (e) { /* noop */ }
  }

  function startSequence() {
    if (phase !== 0) return
    playSoftChime()
    setPhase(1)                                       // sceau cœur fade
    setTimeout(() => setPhase(2), 700)                // les deux pans s'ouvrent
    setTimeout(() => setPhase(3), 2000)               // fade global
    setTimeout(() => { setPhase(4); openEnvelope() }, 2600)
  }

  // SVG réutilisable : motif de branches dorées (style image 1)
  const BotanicalBranches = ({ flip = false }: { flip?: boolean }) => (
    <svg viewBox="0 0 200 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <g stroke="#B8924A" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.85">
        {/* Branche principale gauche */}
        <path d="M -10 50 Q 40 80 50 150 Q 55 220 30 280 Q 10 340 35 410 Q 60 480 20 560" />
        <path d="M 10 90 Q 60 110 70 170" />
        <path d="M 20 200 Q 70 220 80 270" />
        <path d="M 15 320 Q 65 340 70 390" />
        <path d="M 30 450 Q 75 470 70 520" />

        {/* Petites feuilles ovales sur la branche */}
        {[60, 100, 140, 175, 215, 250, 290, 330, 370, 410, 450, 490, 530].map((y, i) => (
          <g key={i}>
            <ellipse cx={i % 2 === 0 ? 18 + (i * 3) % 10 : 35 + (i * 5) % 12} cy={y} rx="6" ry="2.5" fill="#C9A961" opacity="0.4" transform={`rotate(${30 + i * 7} ${i % 2 === 0 ? 18 + (i * 3) % 10 : 35 + (i * 5) % 12} ${y})`} />
            <ellipse cx={i % 2 === 0 ? 18 + (i * 3) % 10 : 35 + (i * 5) % 12} cy={y} rx="6" ry="2.5" fill="none" stroke="#B8924A" strokeWidth="0.6" transform={`rotate(${30 + i * 7} ${i % 2 === 0 ? 18 + (i * 3) % 10 : 35 + (i * 5) % 12} ${y})`} />
          </g>
        ))}

        {/* Branche secondaire (vers le centre) */}
        <path d="M 80 100 Q 110 130 120 180 Q 130 240 110 290" opacity="0.7" />
        <path d="M 90 250 Q 130 280 140 330 Q 145 380 125 430" opacity="0.7" />
        <path d="M 70 440 Q 110 470 130 510" opacity="0.7" />

        {/* Feuilles branches secondaires */}
        {[120, 160, 200, 240, 280, 320, 360, 400, 440, 480].map((y, i) => (
          <g key={`s-${i}`}>
            <ellipse cx={95 + (i % 3) * 8} cy={y} rx="5" ry="2" fill="#C9A961" opacity="0.35" transform={`rotate(${-20 + i * 11} ${95 + (i % 3) * 8} ${y})`} />
          </g>
        ))}

        {/* Petites baies/fleurs */}
        {[80, 180, 280, 380, 480].map((y, i) => (
          <g key={`b-${i}`}>
            <circle cx={50 + (i % 2) * 25} cy={y + 10} r="1.8" fill="#D4B775" opacity="0.6" />
            <circle cx={55 + (i % 2) * 25} cy={y + 14} r="1.5" fill="#D4B775" opacity="0.6" />
          </g>
        ))}
      </g>
    </svg>
  )

  // Décoration florale de coin (style image 2 — pivoines blanches sculptées + feuilles or)
  const FloralCorner = ({ rotate = 0 }: { rotate?: number }) => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ transform: `rotate(${rotate}deg)` }}>
      <defs>
        <radialGradient id={`cdPetal${rotate}`} cx="0.4" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#FBF6EA" />
          <stop offset="80%" stopColor="#EBDFC6" />
          <stop offset="100%" stopColor="#D4C29A" />
        </radialGradient>
        <linearGradient id={`cdLeaf${rotate}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4B775" />
          <stop offset="100%" stopColor="#9C7A2E" />
        </linearGradient>
      </defs>

      {/* Feuilles dorées en arrière */}
      <g fill={`url(#cdLeaf${rotate})`} opacity="0.85">
        <path d="M 20 30 Q 40 20 70 35 Q 60 50 35 45 Z" />
        <path d="M 10 60 Q 35 55 60 75 Q 45 90 20 80 Z" />
        <path d="M 30 100 Q 55 95 75 120 Q 60 130 35 120 Z" />
        <path d="M 60 20 Q 90 25 105 50 Q 85 55 65 40 Z" />
        <path d="M 95 35 Q 125 40 135 70 Q 115 70 95 55 Z" />
        <path d="M 130 20 Q 155 30 160 60 Q 140 60 125 40 Z" />
      </g>

      {/* Tiges dorées fines */}
      <g stroke="#B8924A" strokeWidth="0.8" fill="none" opacity="0.7">
        <path d="M 25 35 Q 50 50 80 50" />
        <path d="M 50 50 Q 75 60 100 80" />
        <path d="M 80 50 Q 110 45 140 55" />
      </g>

      {/* Pivoine principale */}
      <g transform="translate(70 60)">
        <circle cx="0" cy="-12" r="14" fill={`url(#cdPetal${rotate})`} />
        <circle cx="12" cy="-4" r="14" fill={`url(#cdPetal${rotate})`} />
        <circle cx="10" cy="12" r="14" fill={`url(#cdPetal${rotate})`} />
        <circle cx="-10" cy="12" r="14" fill={`url(#cdPetal${rotate})`} />
        <circle cx="-12" cy="-4" r="14" fill={`url(#cdPetal${rotate})`} />
        <circle cx="0" cy="0" r="9" fill={`url(#cdPetal${rotate})`} />
        {/* Ombres internes pour effet sculpté */}
        <circle cx="0" cy="0" r="6" fill="#B8924A" opacity="0.18" />
        <circle cx="0" cy="0" r="3" fill="#9C7A2E" opacity="0.35" />
        {/* Étamines dorées */}
        <circle cx="-2" cy="-1" r="0.8" fill="#D4B775" />
        <circle cx="2" cy="-1" r="0.8" fill="#D4B775" />
        <circle cx="0" cy="2" r="0.8" fill="#D4B775" />
      </g>

      {/* Pivoine secondaire */}
      <g transform="translate(135 90) scale(0.75)">
        <circle cx="0" cy="-10" r="12" fill={`url(#cdPetal${rotate})`} />
        <circle cx="10" cy="-3" r="12" fill={`url(#cdPetal${rotate})`} />
        <circle cx="8" cy="10" r="12" fill={`url(#cdPetal${rotate})`} />
        <circle cx="-8" cy="10" r="12" fill={`url(#cdPetal${rotate})`} />
        <circle cx="-10" cy="-3" r="12" fill={`url(#cdPetal${rotate})`} />
        <circle cx="0" cy="0" r="7" fill={`url(#cdPetal${rotate})`} />
        <circle cx="0" cy="0" r="4" fill="#B8924A" opacity="0.2" />
      </g>

      {/* Petite fleur tertiaire */}
      <g transform="translate(40 130) scale(0.55)">
        <circle cx="0" cy="-8" r="10" fill={`url(#cdPetal${rotate})`} />
        <circle cx="8" cy="-2" r="10" fill={`url(#cdPetal${rotate})`} />
        <circle cx="6" cy="8" r="10" fill={`url(#cdPetal${rotate})`} />
        <circle cx="-6" cy="8" r="10" fill={`url(#cdPetal${rotate})`} />
        <circle cx="-8" cy="-2" r="10" fill={`url(#cdPetal${rotate})`} />
        <circle cx="0" cy="0" r="5" fill="#9C7A2E" opacity="0.3" />
      </g>

      {/* Petites baies dorées */}
      <circle cx="155" cy="25" r="3" fill="#D4B775" opacity="0.85" />
      <circle cx="165" cy="30" r="2.5" fill="#D4B775" opacity="0.85" />
      <circle cx="170" cy="40" r="2" fill="#D4B775" opacity="0.85" />
    </svg>
  )

  // Ornement décoratif central (le petit flourish doré)
  const GoldFlourish = () => (
    <svg viewBox="0 0 120 16" xmlns="http://www.w3.org/2000/svg" className="cd-flourish-svg">
      <g stroke="#B8924A" strokeWidth="0.9" fill="none" strokeLinecap="round">
        <path d="M 10 8 L 35 8" />
        <path d="M 35 8 Q 45 2 50 8 Q 55 14 60 8" />
        <path d="M 60 8 Q 65 2 70 8 Q 75 14 85 8" />
        <path d="M 85 8 L 110 8" />
        <circle cx="60" cy="8" r="1.8" fill="#B8924A" />
        <circle cx="35" cy="8" r="1.2" fill="#B8924A" />
        <circle cx="85" cy="8" r="1.2" fill="#B8924A" />
      </g>
    </svg>
  )

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cinzel:wght@400;500;600&family=Amiri&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>
      <FontOverride font={wedding.custom_font} container=".cd-container" />

      {/* === ÉCRAN D'OUVERTURE — ENVELOPPE À RABATS LATÉRAUX === */}
      {!opened && (
        <div className={`cd-env-screen cd-phase-${phase}`}>
          <div className="cd-env-stage" onClick={startSequence}>

            {/* Arrière-plan : aperçu de la carte (visible quand l'enveloppe s'ouvre) */}
            <div className="cd-env-reveal">
              <div className="cd-env-reveal-card">
                <p className="cd-env-reveal-eyebrow">Vous êtes invités</p>
                <p className="cd-env-reveal-names">
                  <span>{wedding.bride_name}</span>
                  <em>&amp;</em>
                  <span>{wedding.groom_name}</span>
                </p>
                <p className="cd-env-reveal-date">{formattedDate}</p>
              </div>
            </div>

            {/* Pan GAUCHE de l'enveloppe */}
            <div className="cd-env-flap cd-env-flap-l">
              <div className="cd-env-flap-paper">
                <div className="cd-env-branches cd-env-branches-l">
                  <BotanicalBranches />
                </div>
                <div className="cd-env-flap-shadow cd-env-flap-shadow-l" />
                <div className="cd-env-flap-edge cd-env-flap-edge-l" />
              </div>
            </div>

            {/* Pan DROIT de l'enveloppe */}
            <div className="cd-env-flap cd-env-flap-r">
              <div className="cd-env-flap-paper">
                <div className="cd-env-branches cd-env-branches-r">
                  <BotanicalBranches flip />
                </div>
                <div className="cd-env-flap-shadow cd-env-flap-shadow-r" />
                <div className="cd-env-flap-edge cd-env-flap-edge-r" />
              </div>
            </div>

            {/* SCEAU CŒUR — pile au centre, à cheval sur les deux pans */}
            <div className="cd-seal">
              <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="cdSealGrad" cx="0.35" cy="0.3" r="0.85">
                    <stop offset="0%" stopColor="#E8C878" />
                    <stop offset="45%" stopColor="#C9A961" />
                    <stop offset="80%" stopColor="#8C6A2A" />
                    <stop offset="100%" stopColor="#5C4418" />
                  </radialGradient>
                  <radialGradient id="cdSealHl" cx="0.3" cy="0.25" r="0.5">
                    <stop offset="0%" stopColor="#F7E2B0" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#F7E2B0" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Contour ondulé de la cire */}
                <path
                  d="M 70 8
                     Q 92 12 100 20
                     Q 116 22 122 38
                     Q 134 46 130 68
                     Q 134 88 122 98
                     Q 116 116 100 118
                     Q 92 130 70 128
                     Q 48 130 40 118
                     Q 24 116 18 100
                     Q 6 92 10 70
                     Q 6 48 18 38
                     Q 24 22 40 20
                     Q 48 12 70 8 Z"
                  fill="url(#cdSealGrad)"
                />
                {/* Reflet supérieur */}
                <ellipse cx="55" cy="40" rx="35" ry="25" fill="url(#cdSealHl)" />
                {/* Texture éclats de cire */}
                <circle cx="42" cy="48" r="1.8" fill="#5C4418" opacity="0.25" />
                <circle cx="98" cy="60" r="1.4" fill="#5C4418" opacity="0.22" />
                <circle cx="55" cy="95" r="2" fill="#5C4418" opacity="0.28" />
                <circle cx="88" cy="92" r="1.5" fill="#5C4418" opacity="0.22" />
                <circle cx="35" cy="78" r="1" fill="#5C4418" opacity="0.2" />

                {/* CŒUR central — style griffonné comme dans l'image */}
                <g stroke="#5C4418" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
                  <path d="M 70 92 C 50 75 40 60 50 50 C 58 42 68 48 70 58 C 72 48 82 42 90 50 C 100 60 90 75 70 92 Z" />
                  <path d="M 70 88 C 54 73 46 60 53 52 C 60 46 68 52 70 60" opacity="0.6" />
                </g>
                {/* Surbrillance dorée sur le cœur */}
                <g stroke="#F7E2B0" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6">
                  <path d="M 58 56 C 56 58 56 62 58 65" />
                  <path d="M 78 53 C 82 55 83 60 80 64" />
                </g>
              </svg>
            </div>

            {/* Hint sous l'enveloppe */}
            <div className="cd-env-hint">
              <span className="cd-env-hint-line" />
              <span className="cd-env-hint-text">Cliquez sur le sceau</span>
              <span className="cd-env-hint-line" />
            </div>
          </div>
        </div>
      )}

      {/* === INVITATION === */}
      <div className={`cd-invitation cd-container${visible ? ' cd-visible' : ''}`}>

        {/* ===== 1. HERO — CARTE D'INVITATION ===== */}
        <section className="cd-hero">
          <div className="cd-hero-bg" aria-hidden="true">
            {/* Branches dorées légères en fond */}
            <div className="cd-hero-branches cd-hero-branches-l"><BotanicalBranches /></div>
            <div className="cd-hero-branches cd-hero-branches-r"><BotanicalBranches flip /></div>
          </div>

          <article className="cd-card">
            {/* Cadre double doré */}
            <div className="cd-card-frame" aria-hidden="true" />
            <div className="cd-card-frame-inner" aria-hidden="true" />

            {/* Coins floraux */}
            <div className="cd-card-corner cd-corner-tr"><FloralCorner rotate={90} /></div>
            <div className="cd-card-corner cd-corner-bl"><FloralCorner rotate={-90} /></div>

            <div className="cd-card-content">
              {/* Bismillah / phrase arabe optionnelle */}
              {(wedding.bride_name_ar || wedding.groom_name_ar) && (
                <p className="cd-arabic-bismillah" dir="rtl">
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
              )}

              <p className="cd-card-eyebrow">{introText}</p>

              <h1 className="cd-card-names">
                <span className="cd-name" data-ef="bride_name">{wedding.bride_name}</span>
                <span className="cd-amp">&amp;</span>
                <span className="cd-name" data-ef="groom_name">{wedding.groom_name}</span>
              </h1>

              <div className="cd-card-flourish"><GoldFlourish /></div>

              <p className="cd-card-invite">
                ont le plaisir de vous convier<br />
                à la célébration de leur mariage
              </p>

              {/* Date format magazine */}
              <div className="cd-date-block">
                <div className="cd-date-side">
                  <p className="cd-date-weekday">{weekday}</p>
                </div>
                <div className="cd-date-center">
                  <p className="cd-date-month">{month}</p>
                  <p className="cd-date-day">{day}</p>
                  <p className="cd-date-year">{year}</p>
                </div>
                <div className="cd-date-side">
                  <p className="cd-date-time">à {formattedTime}</p>
                </div>
              </div>

              {wedding.custom_message && (
                <p className="cd-card-message">{wedding.custom_message}</p>
              )}

              <div className="cd-card-venue">
                <p className="cd-venue-label">Lieu</p>
                <p className="cd-venue-name" data-ef="venue_name">{wedding.venue_name}</p>
                {wedding.venue_address && (
                  <p className="cd-venue-addr">{wedding.venue_address}</p>
                )}
              </div>

              <div className="cd-card-flourish-mini"><GoldFlourish /></div>

              {wedding.couple_phone && (
                <p className="cd-card-rsvp-note">
                  Merci de confirmer · {wedding.couple_phone}
                </p>
              )}
            </div>
          </article>
        </section>

        {/* ===== 2. COMPTE À REBOURS ===== */}
        <section className="cd-countdown-section">
          <p className="cd-section-eyebrow">— En attendant le grand jour —</p>
          <h2 className="cd-section-title">Plus que…</h2>

          <div className="cd-countdown">
            <div className="cd-cd-cell">
              <span className="cd-cd-num">{countdown.d}</span>
              <span className="cd-cd-lbl">Jours</span>
            </div>
            <span className="cd-cd-dot" aria-hidden="true">◆</span>
            <div className="cd-cd-cell">
              <span className="cd-cd-num">{countdown.h}</span>
              <span className="cd-cd-lbl">Heures</span>
            </div>
            <span className="cd-cd-dot" aria-hidden="true">◆</span>
            <div className="cd-cd-cell">
              <span className="cd-cd-num">{countdown.m}</span>
              <span className="cd-cd-lbl">Minutes</span>
            </div>
            <span className="cd-cd-dot" aria-hidden="true">◆</span>
            <div className="cd-cd-cell">
              <span className="cd-cd-num">{countdown.s}</span>
              <span className="cd-cd-lbl">Secondes</span>
            </div>
          </div>
        </section>

        {/* ===== 3. PROGRAMME ===== */}
        {wedding.program?.length > 0 && (
          <section className="cd-program">
            <div className="cd-program-decor cd-program-decor-l" aria-hidden="true">
              <FloralCorner rotate={0} />
            </div>
            <div className="cd-program-decor cd-program-decor-r" aria-hidden="true">
              <FloralCorner rotate={180} />
            </div>

            <p className="cd-section-eyebrow">— Le déroulé —</p>
            <h2 className="cd-section-title">Programme de la journée</h2>

            <div className="cd-program-list">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <div key={i} className="cd-prog-item">
                  <div className="cd-prog-time">
                    <span>{item.time}</span>
                  </div>
                  <div className="cd-prog-dots" aria-hidden="true" />
                  <div className="cd-prog-event">
                    <p className="cd-prog-event-name">{item.event}</p>
                    {item.venue && <p className="cd-prog-event-venue">{item.venue}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== 4. LIEU ===== */}
        <section className="cd-venue-section">
          <p className="cd-section-eyebrow">— Rendez-vous —</p>
          <h2 className="cd-section-title">Le lieu de la fête</h2>

          <div className="cd-venue-card">
            <div className="cd-venue-card-corner cd-vc-tl"><FloralCorner rotate={0} /></div>
            <div className="cd-venue-card-corner cd-vc-br"><FloralCorner rotate={180} /></div>

            <h3 className="cd-venue-card-name">{wedding.venue_name}</h3>
            {wedding.venue_address && (
              <p className="cd-venue-card-addr">{wedding.venue_address}</p>
            )}

            {(wedding.gps_google || wedding.gps_apple) && (
              <div className="cd-venue-card-buttons">
                {wedding.gps_google && (
                  <a className="cd-map-btn" href={wedding.gps_google} target="_blank" rel="noopener noreferrer">
                    Google Maps
                  </a>
                )}
                {wedding.gps_apple && (
                  <a className="cd-map-btn" href={wedding.gps_apple} target="_blank" rel="noopener noreferrer">
                    Apple Plans
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ===== 5. RSVP ===== */}
        {wedding.show_rsvp && (
          <section className="cd-rsvp">
            <p className="cd-section-eyebrow">— Confirmation —</p>
            <h2 className="cd-section-title">Serez-vous des nôtres ?</h2>
            <p className="cd-rsvp-sub">
              Votre présence sera notre plus beau cadeau. Merci de bien vouloir
              nous confirmer avant le {formattedDate}.
            </p>

            <div className="cd-rsvp-card">
              <div className="cd-card-corner cd-corner-tr"><FloralCorner rotate={90} /></div>
              <div className="cd-card-corner cd-corner-bl"><FloralCorner rotate={-90} /></div>

              {rsvpStatus === 'done' ? (
                <div className="cd-rsvp-done">
                  <div className="cd-flourish-center"><GoldFlourish /></div>
                  <p className="cd-rsvp-done-title">Merci pour votre réponse</p>
                  <p className="cd-rsvp-done-sub">Nous sommes ravis de partager ce moment avec vous.</p>
                </div>
              ) : (
                <form className="cd-rsvp-form" onSubmit={submitRSVP}>
                  <div className="cd-rsvp-choices">
                    {(['present', 'absent', 'maybe'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        className={`cd-rsvp-choice${rsvpChoice === s ? ' cd-on' : ''}`}
                        onClick={() => setRsvpChoice(s)}
                      >
                        {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                      </button>
                    ))}
                  </div>

                  <div className="cd-rsvp-fields">
                    <input className="cd-input" name="name" placeholder="Prénom et nom" required />
                    <input className="cd-input" name="phone" placeholder="WhatsApp (facultatif)" />
                    <input className="cd-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
                    <textarea className="cd-input cd-textarea" name="note" placeholder="Un mot pour les mariés (facultatif)" />
                  </div>

                  <button
                    type="submit"
                    className="cd-rsvp-submit"
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
          <section className="cd-guestbook">
            <p className="cd-section-eyebrow">— Livre d'or —</p>
            <h2 className="cd-section-title">Vos mots les plus tendres</h2>

            {messages.length > 0 && (
              <div className="cd-gb-list">
                {messages.map(m => (
                  <div key={m.id} className="cd-gb-card">
                    <span className="cd-gb-quote" aria-hidden="true">"</span>
                    <p className="cd-gb-msg">{m.message}</p>
                    <p className="cd-gb-author">— {m.author_name}</p>
                  </div>
                ))}
              </div>
            )}

            {gbStatus === 'done' ? (
              <p className="cd-gb-done">
                {gbPending
                  ? 'Votre message sera publié après validation.'
                  : 'Votre message a été publié. Merci !'}
              </p>
            ) : (
              <form className="cd-gb-form" onSubmit={submitMessage}>
                <input className="cd-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="cd-input cd-textarea" name="message" placeholder="Laissez un mot doux aux mariés…" required />
                <button type="submit" className="cd-gb-submit" disabled={gbStatus === 'loading'}>
                  {gbStatus === 'loading' ? 'Envoi…' : 'Déposer mon mot'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* ===== 7. FOOTER ===== */}
        <footer className="cd-footer">
          <div className="cd-footer-flourish"><GoldFlourish /></div>
          <p className="cd-footer-names">{wedding.bride_name} &amp; {wedding.groom_name}</p>
          <p className="cd-footer-date">{formattedDate}</p>
          <p className="cd-footer-brand">
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
    --cd-paper: #F7ECD5;
    --cd-paper-light: #FAF3E2;
    --cd-paper-deep: #EFE3CB;
    --cd-card: #FBF6EA;
    --cd-card-shadow-warm: rgba(140, 106, 42, 0.18);
    --cd-gold: #C9A961;
    --cd-gold-deep: #B8924A;
    --cd-gold-dark: #8C6A2A;
    --cd-gold-light: #DCC68F;
    --cd-gold-soft: #F7E2B0;
    --cd-ink: #5C4418;
    --cd-ink-soft: #8B7A5C;
    --cd-text: #4A3A20;
  }

  body {
    background: var(--cd-paper);
    color: var(--cd-text);
    overflow-x: hidden;
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  .cd-container { font-family: 'Cormorant Garamond', Georgia, serif; }

  /* =========================================
     ÉCRAN ENVELOPPE
     ========================================= */
  .cd-env-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background:
      radial-gradient(ellipse at 50% 40%, #FAF3E2 0%, #EFE3CB 60%, #DCC8A4 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    transition: opacity 0.6s ease;
  }
  .cd-env-screen.cd-phase-3 { opacity: 0; pointer-events: none; }

  .cd-env-stage {
    position: relative;
    width: min(480px, 92vw);
    height: min(680px, 80vh);
    cursor: pointer;
    user-select: none;
    perspective: 1800px;
  }

  /* ----- Aperçu de la carte derrière l'enveloppe ----- */
  .cd-env-reveal {
    position: absolute;
    inset: 8% 12%;
    background: var(--cd-card);
    border-radius: 4px;
    box-shadow:
      0 0 0 1px var(--cd-gold),
      inset 0 0 0 4px var(--cd-card),
      inset 0 0 0 5px var(--cd-gold-light),
      0 20px 50px rgba(140, 106, 42, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.6s ease 0.5s;
  }
  .cd-phase-2 .cd-env-reveal,
  .cd-phase-3 .cd-env-reveal { opacity: 1; }

  .cd-env-reveal-card {
    text-align: center;
    padding: 2rem;
  }
  .cd-env-reveal-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--cd-gold-deep);
    margin-bottom: 1.2rem;
  }
  .cd-env-reveal-names {
    font-family: 'Allura', cursive;
    color: var(--cd-gold-deep);
    font-size: clamp(2.4rem, 7vw, 3.4rem);
    line-height: 1;
    margin-bottom: 1.2rem;
  }
  .cd-env-reveal-names em {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.5em;
    color: var(--cd-gold);
    margin: 0.2em 0;
  }
  .cd-env-reveal-date {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--cd-ink-soft);
  }

  /* ----- Les deux pans de l'enveloppe ----- */
  .cd-env-flap {
    position: absolute;
    top: 0; bottom: 0;
    width: 50%;
    transform-style: preserve-3d;
    transition: transform 1.3s cubic-bezier(0.55, 0, 0.3, 1);
    z-index: 2;
  }
  .cd-env-flap-l {
    left: 0;
    transform-origin: left center;
  }
  .cd-env-flap-r {
    right: 0;
    transform-origin: right center;
  }

  /* OUVERTURE des pans en phase 2+ */
  .cd-phase-2 .cd-env-flap-l,
  .cd-phase-3 .cd-env-flap-l {
    transform: rotateY(-165deg);
  }
  .cd-phase-2 .cd-env-flap-r,
  .cd-phase-3 .cd-env-flap-r {
    transform: rotateY(165deg);
  }

  .cd-env-flap-paper {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, #FAF3E2 0%, #EFE3CB 100%);
    box-shadow:
      0 12px 40px rgba(140, 106, 42, 0.22),
      0 2px 6px rgba(140, 106, 42, 0.12),
      inset 0 0 80px rgba(180, 140, 90, 0.08);
    overflow: hidden;
  }
  .cd-env-flap-l .cd-env-flap-paper {
    border-radius: 4px 0 0 4px;
    background:
      radial-gradient(ellipse at right, rgba(180, 140, 90, 0.08), transparent 60%),
      linear-gradient(135deg, #FAF3E2 0%, #EFE3CB 100%);
  }
  .cd-env-flap-r .cd-env-flap-paper {
    border-radius: 0 4px 4px 0;
    background:
      radial-gradient(ellipse at left, rgba(180, 140, 90, 0.08), transparent 60%),
      linear-gradient(-135deg, #FAF3E2 0%, #EFE3CB 100%);
  }

  /* Branches dorées sur les pans */
  .cd-env-branches {
    position: absolute;
    top: 0; bottom: 0;
    width: 100%;
    opacity: 0.95;
  }
  .cd-env-branches svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .cd-env-branches-l { left: 0; }
  .cd-env-branches-r { right: 0; }

  /* Bord central (pli) — ombre subtile à l'intérieur */
  .cd-env-flap-shadow-l {
    position: absolute;
    top: 0; bottom: 0; right: 0;
    width: 60px;
    background: linear-gradient(to right, transparent, rgba(140, 106, 42, 0.18));
    pointer-events: none;
  }
  .cd-env-flap-shadow-r {
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 60px;
    background: linear-gradient(to left, transparent, rgba(140, 106, 42, 0.18));
    pointer-events: none;
  }

  /* Liseré doré sur le bord intérieur */
  .cd-env-flap-edge-l {
    position: absolute;
    top: 0; bottom: 0; right: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--cd-gold-deep) 20%, var(--cd-gold-deep) 80%, transparent);
    opacity: 0.6;
  }
  .cd-env-flap-edge-r {
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--cd-gold-deep) 20%, var(--cd-gold-deep) 80%, transparent);
    opacity: 0.6;
  }

  /* ----- Sceau cœur ----- */
  .cd-seal {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(120px, 25%, 160px);
    height: clamp(120px, 25%, 160px);
    transform: translate(-50%, -50%);
    z-index: 5;
    filter: drop-shadow(0 8px 12px rgba(80, 50, 20, 0.4));
    animation: cdSealPulse 2.6s ease-in-out infinite;
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .cd-seal svg { width: 100%; height: 100%; }
  .cd-phase-1 .cd-seal,
  .cd-phase-2 .cd-seal,
  .cd-phase-3 .cd-seal {
    animation: none;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.85);
  }
  @keyframes cdSealPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }

  /* ----- Hint ----- */
  .cd-env-hint {
    position: absolute;
    bottom: -3rem;
    left: 0; right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--cd-gold-deep);
    transition: opacity 0.4s ease;
  }
  .cd-phase-1 .cd-env-hint,
  .cd-phase-2 .cd-env-hint,
  .cd-phase-3 .cd-env-hint { opacity: 0; }
  .cd-env-hint-line {
    display: inline-block;
    width: 40px;
    height: 1px;
    background: var(--cd-gold-deep);
    opacity: 0.6;
  }

  /* =========================================
     INVITATION
     ========================================= */
  .cd-invitation {
    opacity: 0;
    transition: opacity 0.8s ease;
    background: var(--cd-paper);
  }
  .cd-invitation.cd-visible { opacity: 1; }

  /* =========================================
     1. HERO — CARTE D'INVITATION
     ========================================= */
  .cd-hero {
    position: relative;
    min-height: 100vh;
    padding: 3rem 1.5rem 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .cd-hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .cd-hero-branches {
    position: absolute;
    top: 0; bottom: 0;
    width: 35%;
    max-width: 260px;
    opacity: 0.35;
  }
  .cd-hero-branches svg { width: 100%; height: 100%; }
  .cd-hero-branches-l { left: 0; }
  .cd-hero-branches-r { right: 0; }

  .cd-card {
    position: relative;
    width: 100%;
    max-width: 520px;
    background: var(--cd-card);
    padding: clamp(3rem, 7vw, 4.5rem) clamp(1.5rem, 5vw, 3rem);
    box-shadow:
      0 30px 60px rgba(140, 106, 42, 0.18),
      0 6px 16px rgba(140, 106, 42, 0.08);
    border-radius: 2px;
    z-index: 1;
  }
  /* Double cadre doré (style image 2) */
  .cd-card-frame {
    position: absolute;
    inset: 14px;
    border: 1px solid var(--cd-gold-deep);
    pointer-events: none;
  }
  .cd-card-frame-inner {
    position: absolute;
    inset: 20px;
    border: 0.5px solid var(--cd-gold);
    opacity: 0.55;
    pointer-events: none;
  }
  /* Coins floraux */
  .cd-card-corner {
    position: absolute;
    width: clamp(110px, 22vw, 160px);
    height: clamp(110px, 22vw, 160px);
    pointer-events: none;
    z-index: 0;
  }
  .cd-card-corner svg { width: 100%; height: 100%; display: block; }
  .cd-corner-tr { top: 0; right: 0; transform: translate(8%, -6%); }
  .cd-corner-bl { bottom: 0; left: 0; transform: translate(-8%, 6%); }

  .cd-card-content {
    position: relative;
    z-index: 2;
    text-align: center;
  }
  .cd-arabic-bismillah {
    font-family: 'Amiri', serif;
    font-size: 1.4rem;
    color: var(--cd-gold-deep);
    margin-bottom: 1.5rem;
    letter-spacing: 0.05em;
  }
  .cd-card-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cd-gold-dark);
    margin-bottom: 2rem;
  }
  .cd-card-names {
    font-family: 'Allura', cursive;
    color: var(--cd-gold-deep);
    line-height: 1;
    margin-bottom: 1.5rem;
  }
  .cd-card-names .cd-name {
    display: block;
    font-size: clamp(3.5rem, 11vw, 5.5rem);
    text-shadow: 0 1px 2px rgba(184, 146, 74, 0.15);
  }
  .cd-card-names .cd-amp {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: clamp(1.8rem, 5vw, 2.6rem);
    color: var(--cd-gold);
    margin: 0.15em 0;
  }
  .cd-card-flourish {
    display: flex;
    justify-content: center;
    margin-bottom: 1.75rem;
  }
  .cd-card-flourish-mini {
    display: flex;
    justify-content: center;
    margin: 1.5rem 0 1rem;
    opacity: 0.7;
  }
  .cd-flourish-svg {
    width: 120px;
    height: 16px;
    display: block;
  }
  .cd-card-invite {
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--cd-text);
    line-height: 1.9;
    margin-bottom: 2.25rem;
  }
  /* Date format magazine (image 2) */
  .cd-date-block {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .cd-date-side {
    flex: 0 0 auto;
    text-align: center;
    min-width: 80px;
  }
  .cd-date-weekday,
  .cd-date-time {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--cd-text);
  }
  .cd-date-center {
    position: relative;
    padding: 0 1rem;
    border-left: 1px solid var(--cd-gold);
    border-right: 1px solid var(--cd-gold);
  }
  .cd-date-month {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--cd-gold-deep);
    margin-bottom: 0.3rem;
  }
  .cd-date-day {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 8vw, 3.4rem);
    font-weight: 500;
    color: var(--cd-text);
    line-height: 1;
  }
  .cd-date-year {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: var(--cd-text);
    margin-top: 0.3rem;
  }
  .cd-card-message {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--cd-ink-soft);
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 380px;
    margin-left: auto;
    margin-right: auto;
  }
  .cd-card-venue {
    margin-bottom: 0.5rem;
  }
  .cd-venue-label {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cd-gold-deep);
    margin-bottom: 0.5rem;
  }
  .cd-venue-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--cd-text);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.3rem;
  }
  .cd-venue-addr {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    color: var(--cd-ink-soft);
    letter-spacing: 0.05em;
  }
  .cd-card-rsvp-note {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cd-gold-dark);
    margin-top: 0.5rem;
  }

  /* =========================================
     SECTION COMMUNES
     ========================================= */
  .cd-section-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cd-gold-deep);
    text-align: center;
    margin-bottom: 0.6rem;
  }
  .cd-section-title {
    font-family: 'Allura', cursive;
    font-size: clamp(2.5rem, 6vw, 3.4rem);
    color: var(--cd-gold-deep);
    text-align: center;
    margin-bottom: 2.5rem;
    line-height: 1;
  }

  /* =========================================
     2. COMPTE À REBOURS
     ========================================= */
  .cd-countdown-section {
    background: var(--cd-paper-deep);
    padding: 5rem 1.5rem;
    text-align: center;
  }
  .cd-countdown {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    flex-wrap: nowrap;
    max-width: 720px;
    margin: 0 auto;
  }
  .cd-cd-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 70px;
    padding: 1.5rem 0.5rem;
    background: var(--cd-card);
    border: 1px solid var(--cd-gold-light);
    border-radius: 2px;
    box-shadow: 0 4px 14px rgba(140, 106, 42, 0.08);
  }
  .cd-cd-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 6vw, 2.6rem);
    font-weight: 500;
    color: var(--cd-gold-deep);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .cd-cd-lbl {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cd-text);
    margin-top: 0.6rem;
  }
  .cd-cd-dot {
    font-size: 0.65rem;
    color: var(--cd-gold);
  }

  /* =========================================
     3. PROGRAMME
     ========================================= */
  .cd-program {
    position: relative;
    background: var(--cd-paper);
    padding: 5rem 1.5rem;
    overflow: hidden;
  }
  .cd-program-decor {
    position: absolute;
    width: 180px;
    height: 180px;
    opacity: 0.25;
    pointer-events: none;
  }
  .cd-program-decor svg { width: 100%; height: 100%; }
  .cd-program-decor-l { top: 1rem; left: -3rem; }
  .cd-program-decor-r { bottom: 1rem; right: -3rem; }

  .cd-program-list {
    max-width: 580px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .cd-prog-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 0;
    border-bottom: 1px dashed var(--cd-gold-light);
  }
  .cd-prog-item:last-child { border-bottom: none; }
  .cd-prog-time {
    flex: 0 0 auto;
    min-width: 80px;
  }
  .cd-prog-time span {
    font-family: 'Cinzel', serif;
    font-size: 1.05rem;
    letter-spacing: 0.12em;
    color: var(--cd-gold-deep);
    font-weight: 500;
  }
  .cd-prog-dots {
    flex: 1;
    height: 1px;
    background-image: radial-gradient(circle, var(--cd-gold) 0.6px, transparent 0.6px);
    background-size: 6px 1px;
    background-repeat: repeat-x;
    background-position: center;
    opacity: 0.5;
  }
  .cd-prog-event {
    flex: 0 0 auto;
    text-align: right;
    max-width: 60%;
  }
  .cd-prog-event-name {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.25rem;
    color: var(--cd-text);
    margin-bottom: 0.2rem;
  }
  .cd-prog-event-venue {
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cd-ink-soft);
  }

  /* =========================================
     4. LIEU
     ========================================= */
  .cd-venue-section {
    background: var(--cd-paper-deep);
    padding: 5rem 1.5rem;
  }
  .cd-venue-card {
    position: relative;
    max-width: 540px;
    margin: 0 auto;
    background: var(--cd-card);
    padding: clamp(2.5rem, 6vw, 3.5rem) clamp(1.5rem, 5vw, 2.5rem);
    text-align: center;
    box-shadow:
      0 20px 50px rgba(140, 106, 42, 0.15),
      inset 0 0 0 1px var(--cd-gold-deep),
      inset 0 0 0 4px var(--cd-card),
      inset 0 0 0 5px var(--cd-gold);
    border-radius: 2px;
  }
  .cd-venue-card-corner {
    position: absolute;
    width: 120px;
    height: 120px;
    pointer-events: none;
  }
  .cd-venue-card-corner svg { width: 100%; height: 100%; }
  .cd-vc-tl { top: 0; left: 0; transform: translate(-15%, -15%); }
  .cd-vc-br { bottom: 0; right: 0; transform: translate(15%, 15%); }

  .cd-venue-card-name {
    font-family: 'Allura', cursive;
    font-size: clamp(2.2rem, 6vw, 3rem);
    color: var(--cd-gold-deep);
    margin-bottom: 0.5rem;
    line-height: 1;
    position: relative;
    z-index: 2;
  }
  .cd-venue-card-addr {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.05rem;
    color: var(--cd-ink-soft);
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
  }
  .cd-venue-card-buttons {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }
  .cd-map-btn {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--cd-gold-deep);
    background: transparent;
    border: 1px solid var(--cd-gold-deep);
    padding: 0.95rem 1.6rem;
    text-decoration: none;
    border-radius: 2px;
    transition: all 0.25s ease;
  }
  .cd-map-btn:hover {
    background: var(--cd-gold-deep);
    color: var(--cd-card);
  }

  /* =========================================
     5. RSVP
     ========================================= */
  .cd-rsvp {
    background: var(--cd-paper);
    padding: 5rem 1.5rem;
    text-align: center;
  }
  .cd-rsvp-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: var(--cd-ink-soft);
    font-size: 1.1rem;
    max-width: 480px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
  }
  .cd-rsvp-card {
    position: relative;
    max-width: 540px;
    margin: 0 auto;
    background: var(--cd-card);
    padding: clamp(2.5rem, 6vw, 3.5rem) clamp(1.5rem, 5vw, 2.5rem);
    box-shadow:
      0 20px 50px rgba(140, 106, 42, 0.15),
      inset 0 0 0 1px var(--cd-gold-deep);
    border-radius: 2px;
  }
  .cd-rsvp-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    position: relative;
    z-index: 2;
  }
  .cd-rsvp-choices {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }
  .cd-rsvp-choice {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    background: transparent;
    color: var(--cd-gold-deep);
    border: 1px solid var(--cd-gold);
    padding: 0.8rem 1.15rem;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.25s ease;
  }
  .cd-rsvp-choice:hover { background: rgba(201, 169, 97, 0.08); }
  .cd-rsvp-choice.cd-on {
    background: var(--cd-gold-deep);
    border-color: var(--cd-gold-deep);
    color: var(--cd-card);
  }
  .cd-rsvp-fields {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .cd-input {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid var(--cd-gold-light);
    color: var(--cd-text);
    padding: 0.95rem 1.15rem;
    border-radius: 2px;
    width: 100%;
    transition: all 0.2s ease;
  }
  .cd-input::placeholder { color: rgba(92, 68, 24, 0.4); font-style: italic; }
  .cd-input:focus { outline: none; border-color: var(--cd-gold-deep); background: #ffffff; }
  .cd-textarea { min-height: 90px; resize: vertical; }

  .cd-rsvp-submit {
    margin-top: 0.5rem;
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    background: var(--cd-gold-deep);
    color: var(--cd-card);
    border: none;
    padding: 1.2rem 2.5rem;
    cursor: pointer;
    border-radius: 999px;
    transition: all 0.25s ease;
    align-self: center;
    box-shadow: 0 6px 18px rgba(140, 106, 42, 0.3);
  }
  .cd-rsvp-submit:hover:not(:disabled) {
    background: var(--cd-gold-dark);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(140, 106, 42, 0.4);
  }
  .cd-rsvp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .cd-rsvp-done {
    text-align: center;
    padding: 1.5rem 0;
  }
  .cd-flourish-center {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  .cd-rsvp-done-title {
    font-family: 'Allura', cursive;
    font-size: 2.4rem;
    color: var(--cd-gold-deep);
    margin-bottom: 0.5rem;
    line-height: 1;
  }
  .cd-rsvp-done-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: var(--cd-ink-soft);
    font-size: 1.05rem;
  }

  /* =========================================
     6. LIVRE D'OR
     ========================================= */
  .cd-guestbook {
    background: var(--cd-paper-deep);
    padding: 5rem 1.5rem;
  }
  .cd-gb-list {
    max-width: 680px;
    margin: 0 auto 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .cd-gb-card {
    position: relative;
    background: var(--cd-card);
    border: 1px solid var(--cd-gold-light);
    padding: 1.8rem 1.75rem 1.5rem;
    border-radius: 2px;
    box-shadow: 0 4px 14px rgba(140, 106, 42, 0.08);
  }
  .cd-gb-quote {
    position: absolute;
    top: -10px;
    left: 16px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.5rem;
    color: var(--cd-gold);
    line-height: 1;
    background: var(--cd-card);
    padding: 0 0.4rem;
  }
  .cd-gb-msg {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--cd-text);
    line-height: 1.5;
    margin-bottom: 0.6rem;
  }
  .cd-gb-author {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--cd-gold-deep);
  }
  .cd-gb-form {
    max-width: 580px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .cd-gb-submit {
    margin-top: 0.5rem;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    background: var(--cd-gold-deep);
    color: var(--cd-card);
    border: none;
    padding: 1rem 2rem;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.25s ease;
    align-self: center;
  }
  .cd-gb-submit:hover:not(:disabled) { background: var(--cd-gold-dark); }
  .cd-gb-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .cd-gb-done {
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: var(--cd-gold-deep);
    font-size: 1.1rem;
  }

  /* =========================================
     FOOTER
     ========================================= */
  .cd-footer {
    background: var(--cd-paper);
    text-align: center;
    padding: 4rem 1.5rem 3rem;
    border-top: 1px solid var(--cd-gold-light);
  }
  .cd-footer-flourish {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  .cd-footer-names {
    font-family: 'Allura', cursive;
    font-size: 2.8rem;
    color: var(--cd-gold-deep);
    margin-bottom: 0.4rem;
    line-height: 1;
  }
  .cd-footer-date {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--cd-text);
    margin-bottom: 2rem;
  }
  .cd-footer-brand {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.85rem;
    color: var(--cd-ink-soft);
  }
  .cd-footer-brand strong {
    font-style: normal;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.22em;
    color: var(--cd-gold-deep);
  }

  /* =========================================
     RESPONSIVE
     ========================================= */
  @media (max-width: 768px) {
    .cd-env-stage { height: min(640px, 78vh); }
  }

  @media (max-width: 480px) {
    .cd-env-stage { width: 92vw; height: 72vh; }
    .cd-env-hint { font-size: 0.62rem; letter-spacing: 0.22em; gap: 0.6rem; bottom: -2.5rem; }
    .cd-env-hint-line { width: 24px; }
    .cd-env-reveal { inset: 10% 14%; }

    .cd-card { padding: 2.5rem 1.25rem; }
    .cd-card-frame { inset: 10px; }
    .cd-card-frame-inner { inset: 14px; }
    .cd-card-names .cd-name { font-size: 3.4rem; }
    .cd-card-names .cd-amp { font-size: 1.7rem; }

    .cd-date-block { gap: 0.5rem; flex-direction: column; }
    .cd-date-side { min-width: 0; }
    .cd-date-center {
      padding: 0.8rem 0;
      border-left: none;
      border-right: none;
      border-top: 1px solid var(--cd-gold);
      border-bottom: 1px solid var(--cd-gold);
      width: 100%;
    }

    .cd-countdown { gap: 0.35rem; }
    .cd-cd-cell { min-width: 56px; padding: 1rem 0.3rem; }
    .cd-cd-num { font-size: 1.6rem; }
    .cd-cd-lbl { font-size: 0.52rem; letter-spacing: 0.16em; margin-top: 0.4rem; }
    .cd-cd-dot { font-size: 0.55rem; }

    .cd-section-title { font-size: 2.2rem; }

    /* Programme : passe en colonne */
    .cd-prog-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.4rem;
      text-align: left;
    }
    .cd-prog-dots { display: none; }
    .cd-prog-event { text-align: left; max-width: 100%; }

    .cd-footer-names { font-size: 2.2rem; }
    .cd-rsvp-choice { padding: 0.7rem 0.9rem; font-size: 0.6rem; letter-spacing: 0.18em; }
  }
`