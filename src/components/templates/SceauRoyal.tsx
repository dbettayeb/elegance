'use client'
import { useState, useEffect } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'

/**
 * Template "Sceau Royal" — Ouverture cinématique en 4 phases :
 *   1. Sceau de cire se craquèle (fragments qui tombent)
 *   2. Rabat de l'enveloppe se soulève en 3D
 *   3. La lettre glisse hors de l'enveloppe
 *   4. Contenu de l'invitation se révèle
 *
 * Sequence totale : ~3.2s, déclenchée par clic sur le sceau.
 */
export default function SceauRoyal({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate, introText,
  } = useInvitationLogic(wedding)

  // Sous-états pour la séquence d'animation
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)
  // 0 = idle (sceau intact)
  // 1 = sceau qui se craquèle
  // 2 = rabat qui s'ouvre
  // 3 = lettre qui sort
  // 4 = fade vers invitation (puis on délègue à openEnvelope du hook)

  function startSequence() {
    if (phase !== 0) return
    setPhase(1)
    // Sceau brisé → ouverture rabat (650ms)
    setTimeout(() => setPhase(2), 650)
    // Rabat ouvert → lettre qui sort (1300ms)
    setTimeout(() => setPhase(3), 1300)
    // Lettre extraite → fade vers contenu (2100ms)
    setTimeout(() => setPhase(4), 2100)
    // Fin de séquence → bascule sur opened/visible du hook (3000ms)
    setTimeout(() => openEnvelope(), 3000)
  }

  const formattedTime = eventDate.toLocaleTimeString('fr-TN', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Cinzel:wght@400;500;600&family=Pinyon+Script&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>
      <FontOverride font={wedding.custom_font} container=".sr-container" />

      {/* ─────────── ENVELOPPE + SÉQUENCE ─────────── */}
      {!opened && (
        <div className="sr-env-screen">
          {/* Particules dorées en fond */}
          <div className="sr-particles">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="sr-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${4 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          <div className={`sr-stage sr-phase-${phase}`}>
            {/* ────── L'ENVELOPPE ────── */}
            <div className="sr-envelope">
              {/* Corps de l'enveloppe */}
              <div className="sr-env-body">
                {/* Triangles latéraux + bas (visibles en permanence) */}
                <svg viewBox="0 0 320 220" className="sr-env-back" preserveAspectRatio="none">
                  <rect x="0" y="0" width="320" height="220" fill="#E8DCC0" />
                  <path d="M0 220 L160 130 L320 220 Z" fill="#D9CBA6" />
                  <path d="M0 0 L160 135 L0 220 Z" fill="#DFD2B0" />
                  <path d="M320 0 L160 135 L320 220 Z" fill="#DFD2B0" />
                </svg>

                {/* La LETTRE à l'intérieur (sort à la phase 3) */}
                <div className="sr-letter">
                  <div className="sr-letter-content">
                    <div className="sr-letter-monogram">
                      {wedding.bride_name[0]}<span>&amp;</span>{wedding.groom_name[0]}
                    </div>
                    <div className="sr-letter-line" />
                    <p className="sr-letter-text">Vous êtes conviés</p>
                  </div>
                </div>

                {/* Rabat supérieur (s'ouvre à la phase 2) */}
                <div className="sr-env-flap">
                  <svg viewBox="0 0 320 140" className="sr-flap-svg" preserveAspectRatio="none">
                    <path d="M0 0 L160 135 L320 0 Z" fill="#E8DCC0" stroke="#B8985A" strokeWidth="0.6" />
                  </svg>
                </div>

                {/* ────── LE SCEAU DE CIRE ────── */}
                <div className="sr-seal-wrap" onClick={startSequence}>
                  {/* Sceau intact (visible phase 0) */}
                  <div className="sr-seal-intact">
                    <svg viewBox="0 0 100 100" className="sr-seal-svg">
                      <defs>
                        <radialGradient id="srWax" cx="35%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#A82F2F" />
                          <stop offset="55%" stopColor="#7B1E1E" />
                          <stop offset="100%" stopColor="#4A0E0E" />
                        </radialGradient>
                        <radialGradient id="srHighlight" cx="35%" cy="30%" r="40%">
                          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      {/* Cire ronde irrégulière (forme de goutte écrasée) */}
                      <path
                        d="M50 6
                          C 72 6, 92 22, 94 42
                          C 96 60, 88 78, 70 90
                          C 60 96, 40 96, 30 90
                          C 12 78, 4 60, 6 42
                          C 8 22, 28 6, 50 6 Z"
                        fill="url(#srWax)"
                      />
                      {/* Reflet lumineux */}
                      <ellipse cx="40" cy="32" rx="14" ry="10" fill="url(#srHighlight)" />
                      {/* Empreinte du monogramme gravée */}
                      <text
                        x="50" y="58"
                        textAnchor="middle"
                        fontFamily="Cinzel, Georgia, serif"
                        fontSize="26"
                        fontWeight="600"
                        fill="#3A0808"
                        opacity="0.75"
                      >
                        {wedding.bride_name[0]}{wedding.groom_name[0]}
                      </text>
                      {/* Bordure décorative gravée */}
                      <circle cx="50" cy="50" r="38" fill="none"
                        stroke="#3A0808" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
                    </svg>
                  </div>

                  {/* Fragments brisés (visibles phase 1+) */}
                  <div className="sr-seal-fragments">
                    {[
                      { x: -28, y: -14, r: -45, d: 0 },
                      { x: 32, y: -18, r: 30, d: 0.05 },
                      { x: -20, y: 22, r: 90, d: 0.1 },
                      { x: 26, y: 26, r: -60, d: 0.15 },
                      { x: -8, y: -28, r: 15, d: 0.2 },
                      { x: 14, y: 18, r: -110, d: 0.25 },
                    ].map((frag, i) => (
                      <span
                        key={i}
                        className="sr-fragment"
                        style={{
                          '--dx': `${frag.x}px`,
                          '--dy': `${frag.y}px`,
                          '--dr': `${frag.r}deg`,
                          animationDelay: `${frag.d}s`,
                        } as React.CSSProperties}
                      >
                        <svg viewBox="0 0 30 30" width="30" height="30">
                          <polygon
                            points={
                              i % 2 === 0
                                ? "5,3 22,2 27,15 20,26 8,24 2,12"
                                : "8,2 24,5 28,18 18,28 4,22 2,10"
                            }
                            fill="#7B1E1E"
                            stroke="#4A0E0E"
                            strokeWidth="0.5"
                          />
                          {/* Petit reflet */}
                          <ellipse cx="11" cy="8" rx="3" ry="2" fill="#fff" opacity="0.25" />
                        </svg>
                      </span>
                    ))}
                  </div>

                  {/* Hint "Appuyez" sous le sceau */}
                  {phase === 0 && (
                    <p className="sr-seal-hint">Appuyez sur le sceau</p>
                  )}
                </div>
              </div>
            </div>

            {/* Ombre portée animée sous l'enveloppe */}
            <div className="sr-shadow" />
          </div>
        </div>
      )}

      {/* ─────────── INVITATION ─────────── */}
      <div className={`sr-invitation sr-container${visible ? ' sr-visible' : ''}`}>

        {/* HERO */}
        <section className="sr-hero">
          <div className="sr-hero-orn-top">
            <svg viewBox="0 0 200 30">
              <path d="M0 15 L80 15" stroke="#B8985A" strokeWidth="0.7" />
              <g transform="translate(100 15)">
                <circle r="4" fill="#7B1E1E" />
                <circle r="9" fill="none" stroke="#B8985A" strokeWidth="0.7" />
                <circle r="14" fill="none" stroke="#B8985A" strokeWidth="0.4" opacity="0.6" />
              </g>
              <path d="M120 15 L200 15" stroke="#B8985A" strokeWidth="0.7" />
            </svg>
          </div>

          <p className="sr-pre">{introText}</p>
          <h1 className="sr-names">
            <span className="sr-name">{wedding.bride_name}</span>
            <span className="sr-amp">&</span>
            <span className="sr-name">{wedding.groom_name}</span>
          </h1>
          <div className="sr-divider">
            <span /><i>✦</i><span />
          </div>
          {wedding.custom_message && (
            <p className="sr-custom">{wedding.custom_message}</p>
          )}
          <div className="sr-date-card">
            <div className="sr-date-corner sr-tl" />
            <div className="sr-date-corner sr-tr" />
            <div className="sr-date-corner sr-bl" />
            <div className="sr-date-corner sr-br" />
            <div className="sr-date-day">{eventDate.getDate()}</div>
            <div className="sr-date-month">
              {eventDate.toLocaleDateString('fr-TN', { month: 'long' })}
            </div>
            <div className="sr-date-year">{eventDate.getFullYear()}</div>
            <div className="sr-date-time">{formattedTime}</div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="sr-section">
          <p className="sr-label">Compte à rebours</p>
          <h2 className="sr-title">Le grand jour approche</h2>
          <div className="sr-countdown">
            {[
              { val: countdown.d, label: 'Jours' },
              { val: countdown.h, label: 'Heures' },
              { val: countdown.m, label: 'Minutes' },
              { val: countdown.s, label: 'Secondes' },
            ].map((item, i) => (
              <div key={i} className="sr-cd-block">
                <span className="sr-cd-number">{item.val}</span>
                <span className="sr-cd-label">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="sr-section-divider">✦</div>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="sr-section">
            <p className="sr-label">Déroulement</p>
            <h2 className="sr-title">Programme de la soirée</h2>
            <ul className="sr-timeline">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <li key={i} className="sr-tl-item">
                  <div className="sr-tl-time">{item.time}</div>
                  <div className="sr-tl-dot"><span /></div>
                  <div className="sr-tl-content">
                    <div className="sr-tl-event">{item.event}</div>
                    {item.venue && <div className="sr-tl-venue">{item.venue}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="sr-section-divider">✦</div>

        {/* LIEU */}
        <section className="sr-section">
          <p className="sr-label">Le lieu</p>
          <h2 className="sr-title">{wedding.venue_name}</h2>
          {wedding.venue_address && (
            <p className="sr-body">{wedding.venue_address}</p>
          )}
          <div className="sr-btn-row">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="sr-btn-map">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="sr-btn-map sr-btn-outline">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        <div className="sr-section-divider">✦</div>

        {/* RSVP */}
        {wedding.show_rsvp && (
          <section className="sr-rsvp">
            <p className="sr-label sr-label-light">Confirmation</p>
            <h2 className="sr-title sr-title-light">Serez-vous des nôtres ?</h2>
            {rsvpStatus === 'done' ? (
              <p className="sr-success">Merci pour votre réponse ✦</p>
            ) : (
              <form className="sr-form" onSubmit={submitRSVP}>
                <input className="sr-input" name="name" placeholder="Prénom et nom" required />
                <input className="sr-input" name="phone" placeholder="Numéro WhatsApp" />
                <div className="sr-radios">
                  {(['present', 'absent', 'maybe'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`sr-radio${rsvpChoice === s ? ' sr-radio-on' : ''}`}
                      onClick={() => setRsvpChoice(s)}
                    >
                      {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                    </button>
                  ))}
                </div>
                <input className="sr-input" name="guests" type="number" min="0" max="20"
                  placeholder="Nombre d'accompagnants" />
                <textarea className="sr-input sr-textarea" name="note" placeholder="Message (optionnel)" />
                <button className="sr-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                  {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="sr-section">
            <p className="sr-label">Livre d'or</p>
            <h2 className="sr-title">Vos mots pour les mariés</h2>
            {messages.length > 0 && (
              <div className="sr-messages">
                {messages.map(m => (
                  <div key={m.id} className="sr-msg">
                    <div className="sr-msg-name">{m.author_name}</div>
                    <div className="sr-msg-text">"{m.message}"</div>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="sr-gb-success">
                {gbPending
                  ? 'Votre message sera publié après validation.'
                  : 'Votre message est publié.'}
              </p>
            ) : (
              <form className="sr-gb-form" onSubmit={submitMessage}>
                <input className="sr-gb-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="sr-gb-input sr-gb-textarea" name="message" placeholder="Votre message..." required />
                <button className="sr-btn-gb" type="submit" disabled={gbStatus === 'loading'}>
                  {gbStatus === 'loading' ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="sr-footer">
          <div className="sr-footer-names">{wedding.bride_name} & {wedding.groom_name}</div>
          <div className="sr-footer-date">
            {eventDate.toLocaleDateString('fr-TN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </div>
          <div className="sr-footer-credit">Élégance Digitale</div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --sr-cream: #F4EDE0;
    --sr-paper: #E8DCC0;
    --sr-paper-d: #D9CBA6;
    --sr-wax: #7B1E1E;
    --sr-wax-d: #4A0E0E;
    --sr-ink: #1A1A1A;
    --sr-gold: #B8985A;
    --sr-gold-d: #8B6914;
    --sr-mid: #4A3F2A;
  }
  body { background: var(--sr-cream); color: var(--sr-ink); overflow-x: hidden; }

  /* ═══════════════ ENVELOPPE ═══════════════ */
  .sr-env-screen {
    position: fixed; inset: 0; z-index: 1000;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(184,152,90,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 80%, rgba(123,30,30,0.08) 0%, transparent 60%),
      linear-gradient(180deg, #F4EDE0 0%, #E5D8BD 100%);
    display: flex; align-items: center; justify-content: center;
    perspective: 1200px;
    overflow: hidden;
  }

  /* Particules dorées */
  .sr-particles { position: absolute; inset: 0; pointer-events: none; }
  .sr-particle {
    position: absolute; width: 3px; height: 3px;
    background: var(--sr-gold); border-radius: 50%;
    opacity: 0.4; box-shadow: 0 0 6px rgba(184,152,90,0.6);
    animation: srFloat 6s ease-in-out infinite;
  }
  @keyframes srFloat {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
    50% { transform: translateY(-30px) scale(1.4); opacity: 0.7; }
  }

  /* Stage = conteneur 3D */
  .sr-stage {
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Enveloppe */
  .sr-envelope {
    position: relative;
    width: min(320px, 80vw); height: min(220px, 55vw);
    filter: drop-shadow(0 25px 50px rgba(74,15,15,0.25));
    transform-style: preserve-3d;
  }

  .sr-env-body {
    position: absolute; inset: 0;
    transform-style: preserve-3d;
  }

  .sr-env-back {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    z-index: 1;
  }

  /* ─── LE RABAT (qui s'ouvre en phase 2) ─── */
  .sr-env-flap {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 63%;
    transform-origin: top center;
    transform: rotateX(0deg);
    transition: transform 0.85s cubic-bezier(0.55, 0, 0.45, 1);
    z-index: 4;
    filter: drop-shadow(0 4px 8px rgba(74,15,15,0.15));
  }
  .sr-flap-svg { width: 100%; height: 100%; display: block; }

  /* Phase 2+ : rabat ouvert */
  .sr-phase-2 .sr-env-flap,
  .sr-phase-3 .sr-env-flap,
  .sr-phase-4 .sr-env-flap {
    transform: rotateX(-180deg);
  }

  /* ─── LA LETTRE (qui glisse en phase 3) ─── */
  .sr-letter {
    position: absolute;
    top: 12%; left: 8%; right: 8%; bottom: 8%;
    background: linear-gradient(180deg, #FBF7EE 0%, #F0E8D4 100%);
    border: 1px solid rgba(184,152,90,0.4);
    box-shadow: inset 0 0 30px rgba(184,152,90,0.1);
    display: flex; align-items: center; justify-content: center;
    z-index: 2;
    transform: translateY(0) scale(1);
    transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0;
  }
  .sr-letter::before, .sr-letter::after {
    content: ''; position: absolute;
    width: 12px; height: 12px; border: 1px solid var(--sr-gold);
  }
  .sr-letter::before { top: 6px; left: 6px; border-right: none; border-bottom: none; }
  .sr-letter::after { bottom: 6px; right: 6px; border-left: none; border-top: none; }

  /* Phase 2+ : lettre visible */
  .sr-phase-2 .sr-letter,
  .sr-phase-3 .sr-letter,
  .sr-phase-4 .sr-letter {
    opacity: 1;
  }
  /* Phase 3+ : lettre qui sort */
  .sr-phase-3 .sr-letter,
  .sr-phase-4 .sr-letter {
    transform: translateY(-55%) scale(1.08);
  }

  .sr-letter-content {
    text-align: center; padding: 16px;
  }
  .sr-letter-monogram {
    font-family: 'Cinzel', Georgia, serif;
    font-size: 2.4rem; font-weight: 500;
    color: var(--sr-ink);
    line-height: 1;
  }
  .sr-letter-monogram span {
    color: var(--sr-wax);
    font-style: italic;
    margin: 0 6px;
  }
  .sr-letter-line {
    width: 50px; height: 1px;
    background: var(--sr-gold);
    margin: 10px auto;
  }
  .sr-letter-text {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.78rem; letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--sr-mid);
  }

  /* ─── LE SCEAU DE CIRE ─── */
  .sr-seal-wrap {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 110px; height: 110px;
    z-index: 5;
    cursor: pointer;
  }

  /* Sceau intact */
  .sr-seal-intact {
    position: absolute; inset: 0;
    filter: drop-shadow(0 6px 12px rgba(74,15,15,0.5));
    animation: srSealPulse 2.8s ease-in-out infinite;
    transition: opacity 0.2s, transform 0.3s;
  }
  .sr-seal-svg { width: 100%; height: 100%; }

  @keyframes srSealPulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 6px 12px rgba(74,15,15,0.5)); }
    50% { transform: scale(1.04); filter: drop-shadow(0 8px 16px rgba(123,30,30,0.7)); }
  }

  .sr-seal-wrap:hover .sr-seal-intact {
    transform: scale(1.08);
  }

  /* Phase 1+ : sceau disparait, fragments apparaissent */
  .sr-phase-1 .sr-seal-intact,
  .sr-phase-2 .sr-seal-intact,
  .sr-phase-3 .sr-seal-intact,
  .sr-phase-4 .sr-seal-intact {
    opacity: 0; transform: scale(0.85);
    animation: none;
  }

  /* Fragments */
  .sr-seal-fragments {
    position: absolute; inset: 0;
    pointer-events: none;
  }
  .sr-fragment {
    position: absolute;
    top: 50%; left: 50%;
    width: 30px; height: 30px;
    margin: -15px 0 0 -15px;
    opacity: 0;
    transform: translate(0, 0) rotate(0deg);
  }
  /* Activation des fragments en phase 1 */
  .sr-phase-1 .sr-fragment,
  .sr-phase-2 .sr-fragment,
  .sr-phase-3 .sr-fragment,
  .sr-phase-4 .sr-fragment {
    animation: srFragmentFall 1s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
  }
  @keyframes srFragmentFall {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    30% {
      opacity: 1;
      transform: translate(calc(var(--dx) * 0.5), calc(var(--dy) * 0.3)) rotate(calc(var(--dr) * 0.4)) scale(1.05);
    }
    100% {
      opacity: 0;
      transform: translate(var(--dx), calc(var(--dy) + 120px)) rotate(var(--dr)) scale(0.85);
    }
  }

  /* Hint sous le sceau */
  .sr-seal-hint {
    position: absolute;
    bottom: -50px; left: 50%;
    transform: translateX(-50%);
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    color: var(--sr-mid);
    font-size: 0.95rem;
    letter-spacing: 0.15em;
    animation: srHintPulse 2.5s ease-in-out infinite;
    white-space: nowrap;
  }
  @keyframes srHintPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  /* Ombre sous l'enveloppe */
  .sr-shadow {
    position: absolute;
    bottom: -60px; left: 50%;
    transform: translateX(-50%);
    width: 280px; height: 24px;
    background: radial-gradient(ellipse, rgba(74,15,15,0.3) 0%, transparent 70%);
    filter: blur(8px);
    transition: all 0.8s;
  }
  .sr-phase-3 .sr-shadow,
  .sr-phase-4 .sr-shadow {
    width: 200px; opacity: 0.6;
  }

  /* Phase 4 : fade vers le contenu */
  .sr-phase-4 .sr-envelope {
    opacity: 0;
    transform: scale(1.1) translateY(-20px);
    transition: opacity 0.7s, transform 0.7s;
  }

  /* ═══════════════ INVITATION ═══════════════ */
  .sr-invitation {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 1.2s ease, transform 1.2s ease;
    min-height: 100vh;
    background: var(--sr-cream);
  }
  .sr-invitation.sr-visible {
    opacity: 1; transform: none;
  }

  /* HERO */
  .sr-hero {
    min-height: 100vh; padding: 60px 24px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    position: relative;
    background:
      radial-gradient(ellipse at 50% 0%, rgba(184,152,90,0.12) 0%, transparent 60%),
      var(--sr-cream);
  }
  .sr-hero-orn-top { width: 200px; margin-bottom: 32px; }
  .sr-hero-orn-top svg { width: 100%; height: auto; }

  .sr-pre {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic; font-size: 1rem;
    color: var(--sr-mid);
    margin-bottom: 18px; letter-spacing: 0.08em;
  }
  .sr-names {
    font-family: 'Pinyon Script', 'Great Vibes', cursive;
    font-size: clamp(3.2rem, 11vw, 6rem);
    font-weight: 400;
    color: var(--sr-ink);
    line-height: 1.05;
    margin-bottom: 20px;
  }
  .sr-name { display: block; }
  .sr-amp {
    color: var(--sr-wax);
    font-family: 'Cinzel', Georgia, serif;
    font-size: 0.5em;
    font-style: italic;
    display: block;
    margin: -8px 0;
  }
  .sr-divider {
    display: flex; align-items: center; justify-content: center;
    gap: 18px; margin: 24px 0;
  }
  .sr-divider span {
    width: 60px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--sr-gold), transparent);
  }
  .sr-divider i {
    color: var(--sr-wax); font-style: normal;
    font-size: 0.85rem;
  }
  .sr-custom {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic; font-size: 1.08rem;
    color: var(--sr-mid); line-height: 1.7;
    max-width: 480px; margin: 0 auto 32px;
  }

  .sr-date-card {
    position: relative;
    display: inline-flex; flex-direction: column; align-items: center;
    padding: 26px 48px;
    background: rgba(255,255,255,0.5);
    border: 1px solid rgba(184,152,90,0.5);
  }
  .sr-date-corner {
    position: absolute; width: 14px; height: 14px;
    border: 1px solid var(--sr-gold);
  }
  .sr-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .sr-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
  .sr-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
  .sr-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

  .sr-date-day {
    font-family: 'Cinzel', Georgia, serif;
    font-size: 3.2rem; font-weight: 500;
    color: var(--sr-wax); line-height: 1;
  }
  .sr-date-month {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.78rem; letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--sr-gold-d);
    margin: 8px 0;
  }
  .sr-date-year {
    font-family: 'Cinzel', serif;
    font-size: 1.2rem;
    color: var(--sr-mid);
  }
  .sr-date-time {
    font-size: 0.7rem; letter-spacing: 0.25em;
    color: var(--sr-mid);
    margin-top: 12px; text-transform: uppercase;
  }

  /* SECTIONS */
  .sr-section {
    max-width: 680px; margin: 0 auto;
    padding: 72px 24px; text-align: center;
  }
  .sr-label {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem; letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--sr-gold-d);
    margin-bottom: 14px;
  }
  .sr-label-light { color: rgba(244,237,224,0.8); }
  .sr-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    font-weight: 300; font-style: italic;
    color: var(--sr-ink); margin-bottom: 18px;
    line-height: 1.3;
  }
  .sr-title-light { color: var(--sr-cream); }
  .sr-body {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-style: italic;
    color: var(--sr-mid); line-height: 1.9;
  }
  .sr-section-divider {
    text-align: center;
    color: var(--sr-wax);
    font-size: 1rem; letter-spacing: 0.5em;
    padding: 8px 0; opacity: 0.6;
  }

  /* COUNTDOWN */
  .sr-countdown {
    display: flex; gap: 20px; justify-content: center;
    margin-top: 28px; flex-wrap: wrap;
  }
  .sr-cd-block {
    display: flex; flex-direction: column;
    align-items: center; min-width: 70px;
    padding: 14px 8px;
    border: 1px solid rgba(184,152,90,0.3);
    background: rgba(255,255,255,0.4);
  }
  .sr-cd-number {
    font-family: 'Cinzel', serif;
    font-size: 2.4rem; font-weight: 500;
    color: var(--sr-wax); line-height: 1;
  }
  .sr-cd-label {
    font-size: 0.55rem; letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--sr-gold-d);
    margin-top: 6px;
  }

  /* TIMELINE */
  .sr-timeline {
    list-style: none; max-width: 480px;
    margin: 32px auto 0; text-align: left;
  }
  .sr-tl-item {
    display: grid; grid-template-columns: 70px 30px 1fr;
    align-items: flex-start; gap: 16px;
    padding: 18px 0;
    border-bottom: 1px solid rgba(184,152,90,0.18);
  }
  .sr-tl-item:last-child { border-bottom: none; }
  .sr-tl-time {
    font-family: 'Cinzel', serif;
    font-size: 0.85rem; color: var(--sr-wax);
    letter-spacing: 0.05em; padding-top: 3px;
  }
  .sr-tl-dot {
    display: flex; justify-content: center; padding-top: 8px;
  }
  .sr-tl-dot span {
    width: 8px; height: 8px;
    background: var(--sr-gold);
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(184,152,90,0.2);
  }
  .sr-tl-event {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; color: var(--sr-ink);
  }
  .sr-tl-venue {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem; font-style: italic;
    color: var(--sr-mid); margin-top: 3px;
  }

  /* MAP */
  .sr-btn-row {
    display: flex; justify-content: center;
    gap: 12px; flex-wrap: wrap; margin-top: 24px;
  }
  .sr-btn-map {
    padding: 13px 32px;
    background: var(--sr-wax);
    color: #fff; text-decoration: none;
    font-family: 'Cinzel', serif;
    font-size: 0.7rem; letter-spacing: 0.25em;
    text-transform: uppercase;
    transition: all 0.3s;
  }
  .sr-btn-map:hover {
    background: var(--sr-wax-d);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(123,30,30,0.3);
  }
  .sr-btn-outline {
    background: transparent;
    color: var(--sr-wax);
    border: 1px solid var(--sr-wax);
  }
  .sr-btn-outline:hover {
    background: var(--sr-wax); color: #fff;
  }

  /* RSVP */
  .sr-rsvp {
    background: linear-gradient(135deg, var(--sr-ink) 0%, #2A2620 100%);
    padding: 72px 24px; text-align: center;
  }
  .sr-form {
    max-width: 420px; margin: 32px auto 0;
    display: flex; flex-direction: column; gap: 14px;
  }
  .sr-input {
    width: 100%; padding: 14px 18px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(184,152,90,0.3);
    color: var(--sr-cream);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; outline: none;
    transition: border-color 0.3s;
  }
  .sr-input::placeholder {
    color: rgba(244,237,224,0.4);
    font-style: italic;
  }
  .sr-input:focus { border-color: var(--sr-gold); }
  .sr-textarea { resize: vertical; min-height: 70px; }
  .sr-radios { display: flex; gap: 8px; }
  .sr-radio {
    flex: 1; padding: 12px 8px;
    background: transparent;
    border: 1px solid rgba(184,152,90,0.3);
    color: rgba(244,237,224,0.7);
    font-family: 'Cinzel', serif;
    font-size: 0.62rem; letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
  }
  .sr-radio:hover, .sr-radio-on {
    background: var(--sr-wax);
    border-color: var(--sr-wax);
    color: #fff;
  }
  .sr-btn-submit {
    padding: 16px;
    background: linear-gradient(135deg, var(--sr-wax) 0%, var(--sr-wax-d) 100%);
    color: #fff; border: none;
    font-family: 'Cinzel', serif;
    font-size: 0.7rem; letter-spacing: 0.3em;
    text-transform: uppercase;
    cursor: pointer; transition: opacity 0.3s;
  }
  .sr-btn-submit:hover { opacity: 0.88; }
  .sr-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .sr-success {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-style: italic;
    color: var(--sr-gold); padding: 20px;
    margin-top: 20px;
  }

  /* GUESTBOOK */
  .sr-messages {
    display: flex; flex-direction: column; gap: 14px;
    max-width: 520px; margin: 28px auto 0;
    text-align: left;
  }
  .sr-msg {
    border-left: 3px solid var(--sr-wax);
    padding: 14px 18px;
    background: rgba(255,255,255,0.5);
  }
  .sr-msg-name {
    font-family: 'Cinzel', serif;
    font-size: 0.62rem; letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--sr-wax); margin-bottom: 5px;
  }
  .sr-msg-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.02rem; font-style: italic;
    color: var(--sr-mid); line-height: 1.6;
  }
  .sr-gb-form {
    max-width: 520px; margin: 28px auto 0;
    display: flex; flex-direction: column; gap: 12px;
    text-align: left;
  }
  .sr-gb-input {
    width: 100%; padding: 13px 16px;
    background: rgba(255,255,255,0.5);
    border: 1px solid rgba(184,152,90,0.3);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; outline: none;
    color: var(--sr-ink);
    transition: border-color 0.3s;
  }
  .sr-gb-input:focus { border-color: var(--sr-gold); }
  .sr-gb-textarea { resize: vertical; min-height: 80px; }
  .sr-btn-gb {
    align-self: flex-end;
    padding: 13px 32px; background: transparent;
    border: 1px solid var(--sr-wax);
    color: var(--sr-wax);
    font-family: 'Cinzel', serif;
    font-size: 0.65rem; letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer; transition: all 0.3s;
  }
  .sr-btn-gb:hover {
    background: var(--sr-wax); color: #fff;
  }
  .sr-btn-gb:disabled { opacity: 0.5; cursor: not-allowed; }
  .sr-gb-success {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-style: italic;
    color: var(--sr-wax); padding: 20px;
    max-width: 480px; margin: 0 auto; line-height: 1.7;
  }

  /* FOOTER */
  .sr-footer {
    padding: 48px 24px; text-align: center;
    background: var(--sr-paper);
    border-top: 1px solid rgba(184,152,90,0.2);
  }
  .sr-footer-names {
    font-family: 'Pinyon Script', cursive;
    font-size: 2.2rem; color: var(--sr-wax);
    margin-bottom: 8px;
  }
  .sr-footer-date {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.92rem; font-style: italic;
    color: var(--sr-mid); margin-bottom: 24px;
  }
  .sr-footer-credit {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem; letter-spacing: 0.3em;
    color: var(--sr-gold); opacity: 0.6;
    text-transform: uppercase;
  }

  /* Mobile */
  @media (max-width: 480px) {
    .sr-envelope {
      width: 90vw; height: 60vw;
    }
    .sr-seal-wrap {
      width: 90px; height: 90px;
    }
    .sr-letter-monogram { font-size: 1.8rem; }
    .sr-tl-item {
      grid-template-columns: 55px 24px 1fr;
      gap: 10px;
    }
  }
`