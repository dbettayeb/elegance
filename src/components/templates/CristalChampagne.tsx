'use client'
import { useState, useRef } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'

/**
 * Template "Cristal & Champagne" — Ouverture cinématique en 4 phases :
 *   1. Bulles dorées qui montent dans la coupe (1.2s)
 *   2. Champagne qui remplit la coupe (0.8s)
 *   3. Vague de champagne qui déborde sur tout l'écran (1s)
 *   4. Fade vers l'invitation
 *
 * Univers : haute couture, marbre noir veiné d'or, typo Bodoni Moda,
 * compte à rebours dans des mini-coupes, programme façon menu gastronomique.
 */
export default function CristalChampagne({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate, introText,
  } = useInvitationLogic(wedding)

  // Phases de l'animation : 0=idle, 1=bulles, 2=remplissage, 3=débordement, 4=fade
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)

  // Son "pop" via Web Audio API (comme BlancDore)
  const audioRef = useRef<AudioContext | null>(null)

  function playPop() {
    try {
      const ctx = new AudioContext()
      audioRef.current = ctx
      // Pop = sinus rapide à 800Hz qui descend vers 100Hz avec enveloppe courte
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    } catch (e) {
      // Pas grave si l'audio échoue
    }
  }

  function startSequence() {
    if (phase !== 0) return
    playPop()
    setPhase(1)
    setTimeout(() => setPhase(2), 1200)   // bulles → remplissage
    setTimeout(() => setPhase(3), 2000)   // remplissage → débordement
    setTimeout(() => setPhase(4), 3000)   // débordement → fade
    setTimeout(() => openEnvelope(), 3500)
  }

  const formattedTime = eventDate.toLocaleTimeString('fr-TN', {
    hour: '2-digit', minute: '2-digit',
  })

  // Bulles : 14 bulles avec positions et délais aléatoires (générés à la première render)
  const bubbles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: 30 + Math.random() * 40, // 30% à 70% horizontalement (dans la coupe)
    size: 4 + Math.random() * 8,   // 4 à 12 px
    delay: Math.random() * 0.8,
    duration: 0.9 + Math.random() * 0.6,
  }))

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Cinzel:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>
      <FontOverride font={wedding.custom_font} container=".cc-container" />

      {/* ─────────── ÉCRAN D'OUVERTURE ─────────── */}
      {!opened && (
        <div className={`cc-env-screen cc-phase-${phase}`}>
          {/* Marbre noir veiné d'or en fond */}
          <div className="cc-marble-bg" />

          {/* Particules dorées en flou de fond */}
          <div className="cc-stardust">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="cc-dust"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          {/* Coupe de champagne + bulles */}
          <div className="cc-glass-wrap" onClick={startSequence}>
            <svg viewBox="0 0 200 280" className="cc-glass-svg">
              <defs>
                <linearGradient id="cc-glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#fff" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0.18" />
                </linearGradient>
                <linearGradient id="cc-champ-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#C29758" />
                  <stop offset="50%" stopColor="#E5C078" />
                  <stop offset="100%" stopColor="#F4D6A0" />
                </linearGradient>
              </defs>

              {/* Bowl de la coupe (calice) */}
              <path
                d="M 50 30 Q 50 130, 100 145 Q 150 130, 150 30 Z"
                fill="url(#cc-glass-grad)"
                stroke="#D4AF7A"
                strokeWidth="1.2"
              />

              {/* Liquide qui se remplit (mask sur le bowl) */}
              <defs>
                <clipPath id="cc-bowl-clip">
                  <path d="M 50 30 Q 50 130, 100 145 Q 150 130, 150 30 Z" />
                </clipPath>
              </defs>
              <rect
                className="cc-liquid"
                x="48" y="30" width="104" height="120"
                fill="url(#cc-champ-grad)"
                clipPath="url(#cc-bowl-clip)"
              />

              {/* Reflet sur le bowl */}
              <path
                d="M 60 50 Q 65 90, 70 130"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                opacity="0.35"
                strokeLinecap="round"
              />

              {/* Tige de la coupe */}
              <rect x="97" y="145" width="6" height="90" fill="url(#cc-glass-grad)" stroke="#D4AF7A" strokeWidth="0.8" />

              {/* Pied de la coupe */}
              <ellipse cx="100" cy="245" rx="38" ry="6" fill="url(#cc-glass-grad)" stroke="#D4AF7A" strokeWidth="1" />
              <ellipse cx="100" cy="248" rx="38" ry="3" fill="#D4AF7A" opacity="0.3" />
            </svg>

            {/* Bulles dorées qui montent */}
            <div className="cc-bubbles">
              {bubbles.map(b => (
                <span
                  key={b.id}
                  className="cc-bubble"
                  style={{
                    left: `${b.left}%`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    animationDelay: `${b.delay}s`,
                    animationDuration: `${b.duration}s`,
                  }}
                />
              ))}
            </div>

            {phase === 0 && (
              <p className="cc-hint">Portons un toast</p>
            )}
          </div>

          {/* Vague de champagne qui déborde (apparaît en phase 3) */}
          <div className="cc-flood" />
        </div>
      )}

      {/* ─────────── INVITATION ─────────── */}
      <div className={`cc-invitation cc-container${visible ? ' cc-visible' : ''}`}>

        {/* HERO — marbre noir veiné d'or */}
        <section className="cc-hero">
          <div className="cc-hero-marble" />
          <div className="cc-hero-veil" />

          <div className="cc-hero-content">
            <div className="cc-orn-top">
              <svg viewBox="0 0 240 24">
                <line x1="0" y1="12" x2="90" y2="12" stroke="#D4AF7A" strokeWidth="0.8" />
                <g transform="translate(120 12)">
                  <circle r="3" fill="#D4AF7A" />
                  <circle r="8" fill="none" stroke="#D4AF7A" strokeWidth="0.6" />
                </g>
                <line x1="150" y1="12" x2="240" y2="12" stroke="#D4AF7A" strokeWidth="0.8" />
              </svg>
            </div>

            <p className="cc-pre">{introText}</p>

            <h1 className="cc-names">
              <span className="cc-name">{wedding.bride_name}</span>
              <span className="cc-amp">et</span>
              <span className="cc-name">{wedding.groom_name}</span>
            </h1>

            <div className="cc-divider">
              <span /><i>✦</i><span />
            </div>

            {wedding.custom_message && (
              <p className="cc-custom">{wedding.custom_message}</p>
            )}

            <div className="cc-date-card">
              <span className="cc-date-day">{eventDate.getDate()}</span>
              <span className="cc-date-month">
                {eventDate.toLocaleDateString('fr-TN', { month: 'long' })}
              </span>
              <div className="cc-date-line" />
              <span className="cc-date-year">{eventDate.getFullYear()}</span>
              <span className="cc-date-time">{formattedTime}</span>
            </div>
          </div>
        </section>

        {/* COMPTE À REBOURS — chiffres dans des mini-coupes */}
        <section className="cc-section cc-section-dark">
          <p className="cc-label">Compte à rebours</p>
          <h2 className="cc-title">Le grand soir approche</h2>
          <div className="cc-countdown">
            {[
              { val: countdown.d, label: 'Jours' },
              { val: countdown.h, label: 'Heures' },
              { val: countdown.m, label: 'Minutes' },
              { val: countdown.s, label: 'Secondes' },
            ].map((item, i) => (
              <div key={i} className="cc-cd-block">
                <svg viewBox="0 0 80 110" className="cc-cd-glass">
                  <path
                    d="M 18 14 Q 18 56, 40 64 Q 62 56, 62 14 Z"
                    fill="rgba(212,175,122,0.08)"
                    stroke="#D4AF7A"
                    strokeWidth="0.8"
                  />
                  <rect x="38" y="64" width="4" height="36" fill="none" stroke="#D4AF7A" strokeWidth="0.6" />
                  <ellipse cx="40" cy="102" rx="18" ry="3" fill="none" stroke="#D4AF7A" strokeWidth="0.8" />
                </svg>
                <span className="cc-cd-number">{item.val}</span>
                <span className="cc-cd-label">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMME — façon menu gastronomique */}
        {wedding.program?.length > 0 && (
          <section className="cc-section">
            <p className="cc-label">Le déroulement</p>
            <h2 className="cc-title">Programme de la soirée</h2>
            <div className="cc-menu">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <div key={i} className="cc-menu-item">
                  <div className="cc-menu-left">
                    <div className="cc-menu-event">{item.event}</div>
                    {item.venue && (
                      <div className="cc-menu-venue">{item.venue}</div>
                    )}
                  </div>
                  <div className="cc-menu-dots" />
                  <div className="cc-menu-time">{item.time}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIEU */}
        <section className="cc-section">
          <p className="cc-label">La réception</p>
          <h2 className="cc-title">{wedding.venue_name}</h2>
          {wedding.venue_address && (
            <p className="cc-body">{wedding.venue_address}</p>
          )}
          <div className="cc-btn-row">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="cc-btn">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="cc-btn cc-btn-outline">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        {/* RSVP — boutons noir-mat à liseré doré */}
        {wedding.show_rsvp && (
          <section className="cc-rsvp">
            <p className="cc-label cc-label-light">Confirmation</p>
            <h2 className="cc-title cc-title-light">Serez-vous des nôtres ?</h2>
            {rsvpStatus === 'done' ? (
              <p className="cc-success">Merci pour votre réponse ✦</p>
            ) : (
              <form className="cc-form" onSubmit={submitRSVP}>
                <input className="cc-input" name="name" placeholder="Prénom et nom" required />
                <input className="cc-input" name="phone" placeholder="Numéro WhatsApp" />
                <div className="cc-radios">
                  {(['present', 'absent', 'maybe'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`cc-radio${rsvpChoice === s ? ' cc-radio-on' : ''}`}
                      onClick={() => setRsvpChoice(s)}
                    >
                      {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                    </button>
                  ))}
                </div>
                <input className="cc-input" name="guests" type="number" min="0" max="20"
                  placeholder="Nombre d'accompagnants" />
                <textarea className="cc-input cc-textarea" name="note" placeholder="Message (optionnel)" />
                <button className="cc-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                  {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="cc-section">
            <p className="cc-label">Livre d'or</p>
            <h2 className="cc-title">Vos vœux pour les mariés</h2>
            {messages.length > 0 && (
              <div className="cc-messages">
                {messages.map(m => (
                  <div key={m.id} className="cc-msg">
                    <div className="cc-msg-name">{m.author_name}</div>
                    <div className="cc-msg-text">"{m.message}"</div>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="cc-gb-success">
                {gbPending
                  ? 'Votre message sera publié après validation.'
                  : 'Votre message est publié.'}
              </p>
            ) : (
              <form className="cc-gb-form" onSubmit={submitMessage}>
                <input className="cc-gb-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="cc-gb-input cc-gb-textarea" name="message" placeholder="Votre message..." required />
                <button className="cc-btn-gb" type="submit" disabled={gbStatus === 'loading'}>
                  {gbStatus === 'loading' ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="cc-footer">
          <div className="cc-footer-marble" />
          <div className="cc-footer-content">
            <div className="cc-footer-names">{wedding.bride_name} & {wedding.groom_name}</div>
            <div className="cc-footer-date">
              {eventDate.toLocaleDateString('fr-TN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>
            <div className="cc-footer-credit">Élégance Digitale</div>
          </div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cc-black: #0A0A0A;
    --cc-black-l: #1A1A1A;
    --cc-cream: #F7F1E5;
    --cc-nude: #E8D9B8;
    --cc-gold: #D4AF7A;
    --cc-gold-d: #A88547;
    --cc-gold-l: #F4E3B8;
    --cc-champagne: #F4D6A0;
    --cc-mid: #5C5043;
  }
  body { background: var(--cc-cream); color: var(--cc-black); overflow-x: hidden; }

  /* ═══════════════ ÉCRAN D'OUVERTURE ═══════════════ */
  .cc-env-screen {
    position: fixed; inset: 0; z-index: 1000;
    background: var(--cc-black);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }

  /* Marbre noir veiné d'or */
  .cc-marble-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 25% 15%, rgba(212,175,122,0.18) 0%, transparent 45%),
      radial-gradient(ellipse at 80% 75%, rgba(212,175,122,0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(232,217,184,0.08) 0%, transparent 60%),
      linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 40%, #0F0F0F 100%);
  }
  .cc-marble-bg::before, .cc-marble-bg::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(110deg,
      transparent 30%,
      rgba(212,175,122,0.06) 31%,
      transparent 33%,
      transparent 60%,
      rgba(212,175,122,0.04) 61%,
      transparent 63%
    );
    pointer-events: none;
  }
  .cc-marble-bg::after {
    background: linear-gradient(20deg,
      transparent 20%,
      rgba(232,217,184,0.05) 21%,
      transparent 24%,
      transparent 70%,
      rgba(212,175,122,0.05) 71%,
      transparent 73%
    );
  }

  /* Poussière dorée flottante */
  .cc-stardust { position: absolute; inset: 0; pointer-events: none; }
  .cc-dust {
    position: absolute; width: 2px; height: 2px;
    background: var(--cc-gold-l); border-radius: 50%;
    opacity: 0.5;
    box-shadow: 0 0 6px rgba(244,227,184,0.8);
    animation: ccDust 6s ease-in-out infinite;
  }
  @keyframes ccDust {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
    50% { transform: translateY(-25px) scale(1.5); opacity: 0.8; }
  }

  /* La coupe */
  .cc-glass-wrap {
    position: relative; z-index: 2;
    cursor: pointer;
    transition: transform 0.3s;
  }
  .cc-glass-wrap:hover {
    transform: translateY(-6px) scale(1.02);
  }
  .cc-glass-svg {
    width: min(220px, 60vw); height: auto;
    filter: drop-shadow(0 20px 40px rgba(212,175,122,0.3));
  }

  /* Liquide qui se remplit (commence vide en bas) */
  .cc-liquid {
    transform: translateY(120px);
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  /* Phase 2+ : liquide qui monte */
  .cc-phase-2 .cc-liquid,
  .cc-phase-3 .cc-liquid,
  .cc-phase-4 .cc-liquid {
    transform: translateY(0);
  }

  /* Bulles */
  .cc-bubbles {
    position: absolute; inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .cc-bubble {
    position: absolute;
    bottom: 30%;
    background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), rgba(244,227,184,0.4));
    border: 1px solid rgba(244,227,184,0.5);
    border-radius: 50%;
    opacity: 0;
    box-shadow:
      inset 0 0 4px rgba(255,255,255,0.5),
      0 0 8px rgba(244,227,184,0.4);
  }
  /* Phase 1+ : bulles qui montent */
  .cc-phase-1 .cc-bubble,
  .cc-phase-2 .cc-bubble {
    animation: ccBubble 1.2s ease-in forwards;
  }
  @keyframes ccBubble {
    0% {
      opacity: 0;
      transform: translateY(0) scale(0.3);
    }
    20% {
      opacity: 0.9;
    }
    100% {
      opacity: 0;
      transform: translateY(-180px) scale(1);
    }
  }

  /* Hint sous la coupe */
  .cc-hint {
    position: absolute;
    bottom: -50px; left: 50%;
    transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-size: 1.1rem;
    letter-spacing: 0.18em;
    color: var(--cc-gold-l);
    white-space: nowrap;
    animation: ccHintPulse 2.4s ease-in-out infinite;
  }
  @keyframes ccHintPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  /* Vague de débordement (phase 3+) */
  .cc-flood {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, #F4D6A0 0%, #E5C078 50%, #C29758 100%);
    clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
    transition: clip-path 1s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }
  .cc-phase-3 .cc-flood,
  .cc-phase-4 .cc-flood {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  /* Phase 4 : fade global */
  .cc-phase-4 .cc-glass-wrap {
    opacity: 0;
    transition: opacity 0.5s;
  }

  /* ═══════════════ INVITATION ═══════════════ */
  .cc-invitation {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 1.2s ease, transform 1.2s ease;
    min-height: 100vh;
    background: var(--cc-cream);
  }
  .cc-invitation.cc-visible { opacity: 1; transform: none; }

  /* HERO avec marbre noir */
  .cc-hero {
    min-height: 100vh;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    text-align: center;
    padding: 60px 24px;
    overflow: hidden;
    color: var(--cc-cream);
  }
  .cc-hero-marble {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(212,175,122,0.22) 0%, transparent 50%),
      radial-gradient(ellipse at 75% 80%, rgba(212,175,122,0.15) 0%, transparent 55%),
      linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%);
  }
  .cc-hero-marble::before {
    content: ''; position: absolute; inset: 0;
    background:
      linear-gradient(110deg, transparent 28%, rgba(212,175,122,0.08) 30%, transparent 33%),
      linear-gradient(40deg, transparent 50%, rgba(232,217,184,0.06) 52%, transparent 55%);
  }
  .cc-hero-veil {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.4) 100%);
  }
  .cc-hero-content {
    position: relative; z-index: 2;
    max-width: 720px;
  }
  .cc-orn-top { width: 240px; margin: 0 auto 32px; }
  .cc-orn-top svg { width: 100%; height: auto; }

  .cc-pre {
    font-family: 'Cinzel', Georgia, serif;
    font-size: 0.65rem;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: var(--cc-gold-l);
    margin-bottom: 26px;
  }
  .cc-names {
    font-family: 'Bodoni Moda', Georgia, serif;
    font-weight: 400;
    font-size: clamp(3rem, 9vw, 5.5rem);
    line-height: 1.05;
    color: var(--cc-cream);
    margin-bottom: 24px;
  }
  .cc-name { display: block; }
  .cc-amp {
    display: block;
    font-family: 'Bodoni Moda', serif;
    font-style: italic;
    font-weight: 400;
    color: var(--cc-gold);
    font-size: 0.45em;
    margin: 4px 0;
    letter-spacing: 0.1em;
  }
  .cc-divider {
    display: flex; align-items: center; justify-content: center;
    gap: 18px; margin: 28px 0;
  }
  .cc-divider span {
    width: 70px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--cc-gold), transparent);
  }
  .cc-divider i {
    color: var(--cc-gold);
    font-style: normal;
    font-size: 0.85rem;
  }
  .cc-custom {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--cc-nude);
    line-height: 1.7;
    max-width: 480px;
    margin: 0 auto 36px;
  }
  .cc-date-card {
    display: inline-flex; flex-direction: column; align-items: center;
    padding: 28px 56px;
    background: rgba(212,175,122,0.06);
    border: 1px solid var(--cc-gold);
    backdrop-filter: blur(8px);
  }
  .cc-date-day {
    font-family: 'Bodoni Moda', serif;
    font-size: 3.6rem;
    font-weight: 400;
    color: var(--cc-gold-l);
    line-height: 1;
  }
  .cc-date-month {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--cc-nude);
    margin: 10px 0;
  }
  .cc-date-line {
    width: 50px; height: 1px;
    background: var(--cc-gold);
    margin: 6px 0;
  }
  .cc-date-year {
    font-family: 'Bodoni Moda', serif;
    font-size: 1.2rem;
    color: var(--cc-gold);
  }
  .cc-date-time {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: var(--cc-nude);
    margin-top: 14px;
    text-transform: uppercase;
  }

  /* SECTIONS */
  .cc-section {
    max-width: 680px;
    margin: 0 auto;
    padding: 80px 24px;
    text-align: center;
  }
  .cc-section-dark {
    background: var(--cc-black);
    color: var(--cc-cream);
    max-width: none;
  }
  .cc-section-dark .cc-label { color: var(--cc-gold-l); }
  .cc-section-dark .cc-title { color: var(--cc-cream); }

  .cc-label {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--cc-gold-d);
    margin-bottom: 14px;
  }
  .cc-label-light { color: rgba(247,241,229,0.8); }
  .cc-title {
    font-family: 'Bodoni Moda', Georgia, serif;
    font-weight: 400;
    font-style: italic;
    font-size: clamp(1.9rem, 4.5vw, 2.6rem);
    color: var(--cc-black);
    line-height: 1.25;
    margin-bottom: 18px;
  }
  .cc-title-light { color: var(--cc-cream); }
  .cc-body {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-style: italic;
    color: var(--cc-mid);
    line-height: 1.9;
  }

  /* COUNTDOWN avec mini-coupes */
  .cc-countdown {
    display: flex; justify-content: center;
    gap: 18px; margin-top: 36px; flex-wrap: wrap;
  }
  .cc-cd-block {
    position: relative;
    display: flex; flex-direction: column;
    align-items: center;
    min-width: 80px;
  }
  .cc-cd-glass {
    width: 80px; height: 110px;
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    opacity: 0.5;
  }
  .cc-cd-number {
    position: relative; z-index: 1;
    font-family: 'Bodoni Moda', serif;
    font-size: 2.2rem;
    font-weight: 400;
    color: var(--cc-gold-l);
    line-height: 1;
    margin-top: 30px;
  }
  .cc-cd-label {
    position: relative; z-index: 1;
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cc-gold);
    margin-top: 50px;
  }

  /* MENU GASTRONOMIQUE pour le programme */
  .cc-menu {
    max-width: 560px;
    margin: 36px auto 0;
    text-align: left;
  }
  .cc-menu-item {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 20px 0;
    border-bottom: 1px solid rgba(212,175,122,0.2);
  }
  .cc-menu-item:last-child {
    border-bottom: none;
  }
  .cc-menu-left { flex: 0 0 auto; max-width: 60%; }
  .cc-menu-event {
    font-family: 'Bodoni Moda', serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--cc-black);
  }
  .cc-menu-venue {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    font-style: italic;
    color: var(--cc-mid);
    margin-top: 4px;
  }
  .cc-menu-dots {
    flex: 1;
    height: 1px;
    border-bottom: 1px dotted var(--cc-gold);
    margin-bottom: 4px;
  }
  .cc-menu-time {
    flex: 0 0 auto;
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: var(--cc-gold-d);
    letter-spacing: 0.05em;
  }

  /* BOUTONS MAP */
  .cc-btn-row {
    display: flex; justify-content: center;
    gap: 12px; flex-wrap: wrap; margin-top: 28px;
  }
  .cc-btn {
    padding: 14px 32px;
    background: var(--cc-black);
    color: var(--cc-cream);
    text-decoration: none;
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    border: 1px solid var(--cc-gold);
    transition: all 0.3s;
  }
  .cc-btn:hover {
    background: var(--cc-gold);
    color: var(--cc-black);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(212,175,122,0.4);
  }
  .cc-btn-outline {
    background: transparent;
    color: var(--cc-black);
  }
  .cc-btn-outline:hover {
    background: var(--cc-black);
    color: var(--cc-gold-l);
  }

  /* RSVP — Section sombre */
  .cc-rsvp {
    background:
      radial-gradient(ellipse at top, rgba(212,175,122,0.15) 0%, transparent 60%),
      linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%);
    padding: 80px 24px;
    text-align: center;
  }
  .cc-form {
    max-width: 440px; margin: 36px auto 0;
    display: flex; flex-direction: column; gap: 14px;
  }
  .cc-input {
    width: 100%;
    padding: 15px 18px;
    background: rgba(212,175,122,0.06);
    border: 1px solid rgba(212,175,122,0.3);
    color: var(--cc-cream);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
  }
  .cc-input::placeholder {
    color: rgba(247,241,229,0.4);
    font-style: italic;
  }
  .cc-input:focus { border-color: var(--cc-gold); }
  .cc-textarea { resize: vertical; min-height: 75px; }
  .cc-radios { display: flex; gap: 8px; }
  .cc-radio {
    flex: 1;
    padding: 13px 6px;
    background: transparent;
    border: 1px solid rgba(212,175,122,0.3);
    color: rgba(247,241,229,0.7);
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cc-radio:hover, .cc-radio-on {
    background: var(--cc-gold);
    border-color: var(--cc-gold);
    color: var(--cc-black);
  }
  .cc-btn-submit {
    padding: 17px;
    background: linear-gradient(135deg, var(--cc-gold-d) 0%, var(--cc-gold) 100%);
    color: var(--cc-black);
    border: none;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.3s, transform 0.2s;
  }
  .cc-btn-submit:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
  .cc-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .cc-success {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.3rem;
    color: var(--cc-gold-l);
    padding: 24px;
    margin-top: 20px;
  }

  /* GUESTBOOK */
  .cc-messages {
    display: flex; flex-direction: column;
    gap: 14px; max-width: 540px;
    margin: 32px auto 0;
    text-align: left;
  }
  .cc-msg {
    border-left: 3px solid var(--cc-gold);
    padding: 16px 20px;
    background: #fff;
  }
  .cc-msg-name {
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cc-gold-d);
    margin-bottom: 6px;
  }
  .cc-msg-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-style: italic;
    color: var(--cc-mid);
    line-height: 1.6;
  }
  .cc-gb-form {
    max-width: 540px;
    margin: 28px auto 0;
    display: flex; flex-direction: column;
    gap: 12px;
    text-align: left;
  }
  .cc-gb-input {
    width: 100%;
    padding: 14px 18px;
    background: #fff;
    border: 1px solid rgba(212,175,122,0.4);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    outline: none;
    color: var(--cc-black);
    transition: border-color 0.3s;
  }
  .cc-gb-input:focus { border-color: var(--cc-gold); }
  .cc-gb-textarea { resize: vertical; min-height: 80px; }
  .cc-btn-gb {
    align-self: flex-end;
    padding: 13px 32px;
    background: transparent;
    border: 1px solid var(--cc-gold-d);
    color: var(--cc-gold-d);
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
  }
  .cc-btn-gb:hover {
    background: var(--cc-gold-d);
    color: #fff;
  }
  .cc-btn-gb:disabled { opacity: 0.5; cursor: not-allowed; }
  .cc-gb-success {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.08rem;
    color: var(--cc-gold-d);
    padding: 22px;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* FOOTER avec marbre */
  .cc-footer {
    position: relative;
    padding: 56px 24px;
    text-align: center;
    color: var(--cc-cream);
    overflow: hidden;
  }
  .cc-footer-marble {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 30% 50%, rgba(212,175,122,0.18) 0%, transparent 50%),
      linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%);
  }
  .cc-footer-content { position: relative; z-index: 1; }
  .cc-footer-names {
    font-family: 'Bodoni Moda', Georgia, serif;
    font-style: italic;
    font-size: 2.2rem;
    color: var(--cc-gold-l);
    margin-bottom: 8px;
  }
  .cc-footer-date {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.95rem;
    color: var(--cc-nude);
    margin-bottom: 28px;
  }
  .cc-footer-credit {
    font-family: 'Cinzel', serif;
    font-size: 0.58rem;
    letter-spacing: 0.32em;
    color: var(--cc-gold);
    opacity: 0.6;
    text-transform: uppercase;
  }

  @media (max-width: 480px) {
    .cc-glass-svg { width: 65vw; }
    .cc-countdown { gap: 8px; }
    .cc-cd-block { min-width: 70px; }
    .cc-cd-glass { width: 70px; height: 95px; }
    .cc-cd-number { font-size: 1.8rem; margin-top: 26px; }
    .cc-cd-label { margin-top: 42px; font-size: 0.5rem; }
    .cc-menu-event { font-size: 1rem; }
    .cc-menu-time { font-size: 0.85rem; }
  }
`