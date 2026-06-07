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
  // Format court "05.07.26" pour le hero (style vidéo)
  const shortDate = `${String(eventDate.getDate()).padStart(2, '0')}.${String(eventDate.getMonth() + 1).padStart(2, '0')}.${String(eventDate.getFullYear()).slice(-2)}`

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
        <div className={`cp-env-screen cp-phase-${phase}`} onClick={startSequence}>
          {/* Texture papier de fond (visible derrière les rabats quand ils sont ouverts) */}
          <div className="cp-env-back" aria-hidden="true" />

          {/* Aperçu de l'invitation derrière (apparaît quand les rabats s'ouvrent) */}
          <div className="cp-env-reveal">
            <div className="cp-env-reveal-inner">
              <p className="cp-env-reveal-eyebrow">Wedding Day</p>
              <p className="cp-env-reveal-names">
                {wedding.bride_name}<br />
                <em>&amp;</em><br />
                {wedding.groom_name}
              </p>
            </div>
          </div>

          {/* Les 4 rabats triangulaires de l'enveloppe */}
          <div className="cp-env-flap cp-flap-top" aria-hidden="true" />
          <div className="cp-env-flap cp-flap-bottom" aria-hidden="true" />
          <div className="cp-env-flap cp-flap-left" aria-hidden="true" />
          <div className="cp-env-flap cp-flap-right" aria-hidden="true" />

          {/* Sceau de cire doré pile au centre, à cheval sur les 4 rabats */}
          <div className="cp-seal">
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              {/* Disque de cire avec bords légèrement irréguliers */}
              <path
                d="M 60 8
                   Q 78 10 86 18
                   Q 102 22 106 36
                   Q 116 46 112 62
                   Q 116 78 106 86
                   Q 102 100 86 104
                   Q 78 114 60 112
                   Q 42 114 34 104
                   Q 18 100 14 86
                   Q 4 78 8 62
                   Q 4 46 14 36
                   Q 18 22 34 18
                   Q 42 10 60 8 Z"
                fill="url(#cpSealGrad)"
              />
              {/* Reflet doré */}
              <ellipse cx="48" cy="38" rx="22" ry="14" fill="url(#cpSealHl)" />
              {/* Éclats de cire */}
              <circle cx="38" cy="44" r="1.5" fill="#5C4418" opacity="0.22" />
              <circle cx="84" cy="56" r="1.2" fill="#5C4418" opacity="0.18" />
              <circle cx="50" cy="86" r="1.8" fill="#5C4418" opacity="0.25" />
              <circle cx="76" cy="82" r="1.3" fill="#5C4418" opacity="0.2" />

              {/* Motif floral central : trois petites fleurs */}
              <g className="cp-seal-flowers" stroke="#5C4418" strokeWidth="1" fill="none" opacity="0.55">
                {/* Tige centrale */}
                <path d="M 60 88 Q 58 70 60 56" strokeLinecap="round" />
                <path d="M 60 76 Q 50 72 46 64" strokeLinecap="round" />
                <path d="M 60 70 Q 70 66 74 58" strokeLinecap="round" />
                {/* Feuilles */}
                <path d="M 56 80 Q 50 78 48 82" />
                <path d="M 64 80 Q 70 78 72 82" />
              </g>
              <g className="cp-seal-flowers">
                {/* Fleur centrale (la plus haute) */}
                <g transform="translate(60 50)">
                  <circle cx="0" cy="-5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="4.8" cy="-1.5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="3" cy="4" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="-3" cy="4" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="-4.8" cy="-1.5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="0" cy="0" r="2" fill="#5C4418" opacity="0.5" />
                </g>
                {/* Fleur gauche */}
                <g transform="translate(43 62) scale(0.75)">
                  <circle cx="0" cy="-5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="4.8" cy="-1.5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="3" cy="4" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="-3" cy="4" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="-4.8" cy="-1.5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="0" cy="0" r="1.8" fill="#5C4418" opacity="0.5" />
                </g>
                {/* Fleur droite */}
                <g transform="translate(77 56) scale(0.75)">
                  <circle cx="0" cy="-5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="4.8" cy="-1.5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="3" cy="4" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="-3" cy="4" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="-4.8" cy="-1.5" r="3.2" fill="#9C7A2E" opacity="0.65" />
                  <circle cx="0" cy="0" r="1.8" fill="#5C4418" opacity="0.5" />
                </g>
              </g>

              <defs>
                <radialGradient id="cpSealGrad" cx="0.3" cy="0.25" r="0.85">
                  <stop offset="0%" stopColor="#E8C878" />
                  <stop offset="45%" stopColor="#C9A05A" />
                  <stop offset="85%" stopColor="#8C6A2A" />
                  <stop offset="100%" stopColor="#5C4418" />
                </radialGradient>
                <radialGradient id="cpSealHl" cx="0.3" cy="0.25" r="0.6">
                  <stop offset="0%" stopColor="#F7E2B0" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#F7E2B0" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Hint sous l'enveloppe */}
          <div className="cp-env-hint">Click to open</div>
        </div>
      )}

      {/* === INVITATION === */}
      <div className={`cp-invitation cp-container${visible ? ' cp-visible' : ''}`}>

        {/* ===== 1. HERO — CHÂTEAU & FONTAINE ===== */}
        <section className="cp-hero">
          {/* Décor : photo de château baroque avec fontaine.
              ↓ REMPLACER cette URL par votre propre photo de venue si désiré.
              Vous pouvez utiliser :
              - L'URL d'une photo de votre château/lieu (uploadée sur Cloudinary, votre serveur, etc.)
              - Une photo Unsplash (https://unsplash.com/s/photos/baroque-palace)
              - Une image générée par IA (Midjourney, DALL-E, etc.) avec un prompt type :
                "watercolor baroque chateau courtyard with stone fountain, dreamy atmosphere" */}
          <div className="cp-hero-scene">
            <img
              className="cp-hero-photo"
              src="https://images.unsplash.com/photo-1762245954281-b8b344981eb9?w=1400&q=85&auto=format&fit=crop"
              alt=""
              loading="eager"
            />
            {/* Overlay pour assombrir légèrement le bas et améliorer la lisibilité du texte */}
            <div className="cp-hero-overlay" aria-hidden="true" />
          </div>

          {/* Type d'événement + date en haut */}
          <div className="cp-hero-top">
            <p className="cp-hero-wedding-day">Wedding Day</p>
            <p className="cp-hero-date-top">{shortDate}</p>
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

          {/* Bouquet de pivoines en premier plan — VRAIE PHOTO
              ↓ REMPLACER cette URL par votre propre photo si désiré.
              Pour trouver des alternatives : https://unsplash.com/s/photos/peonies-bouquet
              Crédit par défaut : Олег Мороз (@tengyart) / Unsplash */}
          <div className="cp-bouquet" aria-hidden="true">
            <img
              className="cp-bouquet-photo"
              src="https://images.unsplash.com/photo-1612771269260-ba63f7e6b53c?w=1400&q=85&auto=format&fit=crop"
              alt=""
              loading="eager"
            />
          </div>
        </section>

        {/* ===== 2. MOT D'ACCUEIL (sur bordeaux) ===== */}
        <section className="cp-welcome">
          {/* Découpe papier déchiré haut */}
          <div className="cp-tear cp-tear-top" aria-hidden="true">
            <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 0 L 1440 0 L 1440 25 Q 1380 35 1320 22 Q 1260 12 1200 28 Q 1140 38 1080 24 Q 1020 14 960 30 Q 900 40 840 26 Q 780 16 720 32 Q 660 40 600 25 Q 540 15 480 30 Q 420 38 360 24 Q 300 14 240 30 Q 180 40 120 26 Q 60 16 0 28 Z" fill="#7B1E2E" />
            </svg>
          </div>

          <div className="cp-welcome-inner">
            <h2 className="cp-welcome-title">Dear Friends and Family,</h2>
            <p className="cp-welcome-text">
              Avec une joie immense, nous vous invitons à partager
              une journée unique placée sous le signe de l'amour,
              du raffinement et de la fête.
            </p>
            <p className="cp-welcome-text">
              Votre présence sera le plus beau des cadeaux,
              et nous serions honorés de vous accueillir
              parmi nous pour cette célébration.
            </p>
          </div>
        </section>

        {/* ===== 3. COMPTE À REBOURS (sur blanc, entre deux découpes bordeaux) ===== */}
        <section className="cp-countdown-section">
          {/* Découpe haut (du bordeaux vers blanc) */}
          <div className="cp-tear cp-tear-burgundy-bottom" aria-hidden="true">
            <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 0 L 1440 0 L 1440 15 Q 1380 28 1320 18 Q 1260 8 1200 22 Q 1140 34 1080 20 Q 1020 10 960 26 Q 900 36 840 22 Q 780 12 720 28 Q 660 36 600 20 Q 540 10 480 26 Q 420 34 360 20 Q 300 10 240 26 Q 180 36 120 22 Q 60 12 0 24 Z" fill="#7B1E2E" />
            </svg>
          </div>

          <div className="cp-countdown-inner">
            <h2 className="cp-countdown-title">The Celebration Begins In</h2>
            <div className="cp-countdown-big">
              <div className="cp-cdb-cell">
                <span className="cp-cdb-num">{countdown.d}</span>
                <span className="cp-cdb-lbl">Days</span>
              </div>
              <span className="cp-cdb-sep" aria-hidden="true">:</span>
              <div className="cp-cdb-cell">
                <span className="cp-cdb-num">{countdown.h}</span>
                <span className="cp-cdb-lbl">Hours</span>
              </div>
              <span className="cp-cdb-sep" aria-hidden="true">:</span>
              <div className="cp-cdb-cell">
                <span className="cp-cdb-num">{countdown.m}</span>
                <span className="cp-cdb-lbl">Minutes</span>
              </div>
              <span className="cp-cdb-sep" aria-hidden="true">:</span>
              <div className="cp-cdb-cell">
                <span className="cp-cdb-num">{countdown.s}</span>
                <span className="cp-cdb-lbl">Seconds</span>
              </div>
            </div>
          </div>

          {/* Découpe bas (du blanc vers bordeaux pour la section suivante) */}
          <div className="cp-tear cp-tear-burgundy-top" aria-hidden="true">
            <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 40 L 1440 40 L 1440 15 Q 1380 28 1320 18 Q 1260 8 1200 22 Q 1140 34 1080 20 Q 1020 10 960 26 Q 900 36 840 22 Q 780 12 720 28 Q 660 36 600 20 Q 540 10 480 26 Q 420 34 360 20 Q 300 10 240 26 Q 180 36 120 22 Q 60 12 0 24 Z" fill="#7B1E2E" />
            </svg>
          </div>
        </section>

        {/* ===== 4. PROGRAMME — TIMELINE STYLE VIDÉO ===== */}
        {wedding.program?.length > 0 && (
          <section className="cp-program">
            <h2 className="cp-program-title">Schedule of Events</h2>

            <div className="cp-timeline-v">
              {(wedding.program as ProgramItem[]).map((item, i) => {
                const isMiddle = i === Math.floor((wedding.program as ProgramItem[]).length / 2) - 1
                return (
                  <div key={i} className="cp-tlv-row">
                    <div className="cp-tlv-time">{item.time}</div>
                    <div className="cp-tlv-axis">
                      {isMiddle ? (
                        <div className="cp-tlv-rose" aria-hidden="true">
                          <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <radialGradient id={`cpRoseG${i}`} cx="0.4" cy="0.4" r="0.6">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#e8d5be" />
                              </radialGradient>
                            </defs>
                            {/* Pétales superposés (rose blanche photographique) */}
                            <circle cx="30" cy="30" r="22" fill={`url(#cpRoseG${i})`} />
                            <circle cx="22" cy="24" r="14" fill="#ffffff" opacity="0.85" />
                            <circle cx="38" cy="26" r="13" fill="#ffffff" opacity="0.75" />
                            <circle cx="30" cy="38" r="14" fill="#ffffff" opacity="0.8" />
                            <circle cx="20" cy="36" r="11" fill={`url(#cpRoseG${i})`} opacity="0.85" />
                            <circle cx="40" cy="38" r="11" fill={`url(#cpRoseG${i})`} opacity="0.85" />
                            <circle cx="30" cy="30" r="8" fill="#f4e3c8" opacity="0.7" />
                            <circle cx="30" cy="30" r="4" fill="#c8a878" opacity="0.5" />
                          </svg>
                        </div>
                      ) : (
                        <span className="cp-tlv-diamond" aria-hidden="true">◆</span>
                      )}
                    </div>
                    <div className="cp-tlv-event">
                      <p className="cp-tlv-event-name">{item.event}</p>
                      {item.venue && <p className="cp-tlv-event-venue">{item.venue}</p>}
                    </div>
                  </div>
                )
              })}
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
            {/* Rappel floral en haut — même photo que le hero pour cohérence */}
            <div className="cp-rsvp-roses" aria-hidden="true">
              <img
                className="cp-rsvp-roses-photo"
                src="https://images.unsplash.com/photo-1612771269260-ba63f7e6b53c?w=1200&q=80&auto=format&fit=crop"
                alt=""
                loading="lazy"
              />
            </div>

            <div className="cp-rsvp-inner">
              <h2 className="cp-rsvp-title">Confirm Your Attendance</h2>
              <p className="cp-rsvp-sub">
                To help us prepare for a joyful celebration,
                kindly confirm your attendance before {formattedDate}.
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

        {/* ===== 7. CONCLUSION : "Hope to see you there!" + couple ===== */}
        <section className="cp-conclusion">
          <h2 className="cp-conclusion-title">Hope to see you there!</h2>
          <p className="cp-conclusion-names">
            {wedding.bride_name} and {wedding.groom_name}
          </p>

          {/* Photo finale stylisée (silhouettes du couple) */}
          <div className="cp-couple-photo" aria-hidden="true">
            <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cpPhotoBg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5C1422" />
                  <stop offset="60%" stopColor="#4A3320" />
                  <stop offset="100%" stopColor="#2D1A0F" />
                </linearGradient>
                <linearGradient id="cpFoliage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a4a2a" />
                  <stop offset="100%" stopColor="#1a2515" />
                </linearGradient>
              </defs>

              {/* Fond ambré sombre */}
              <rect width="400" height="500" fill="url(#cpPhotoBg2)" />

              {/* Feuillage en arrière-plan */}
              <ellipse cx="60" cy="180" rx="80" ry="120" fill="url(#cpFoliage)" opacity="0.85" />
              <ellipse cx="340" cy="160" rx="90" ry="130" fill="url(#cpFoliage)" opacity="0.85" />
              <ellipse cx="200" cy="120" rx="120" ry="90" fill="url(#cpFoliage)" opacity="0.7" />

              {/* Balustrade en pierre */}
              <rect x="0" y="320" width="400" height="40" fill="#8a7a5e" opacity="0.5" />
              <rect x="0" y="315" width="400" height="6" fill="#a89a7e" opacity="0.6" />
              {[40, 100, 160, 220, 280, 340].map(x => (
                <g key={x}>
                  <ellipse cx={x} cy="345" rx="10" ry="6" fill="#a89a7e" opacity="0.5" />
                  <rect x={x - 6} y="360" width="12" height="35" fill="#8a7a5e" opacity="0.5" />
                </g>
              ))}

              {/* Silhouette homme (gauche) — costume crème */}
              <g>
                <ellipse cx="155" cy="170" rx="22" ry="26" fill="#3a2a1c" />
                <path d="M 130 200 Q 130 280 145 360 L 175 360 Q 180 280 175 200 Q 165 195 155 195 Q 145 195 130 200 Z" fill="#e8dcc4" />
                <path d="M 145 220 L 145 300 L 165 300 L 165 220 Z" fill="#1a1a1a" opacity="0.85" />
                <path d="M 130 360 Q 130 440 145 500 L 175 500 Q 180 440 175 360 Z" fill="#d4c8a8" />
                <ellipse cx="140" cy="180" rx="8" ry="4" fill="#1a1a1a" opacity="0.9" />
              </g>

              {/* Silhouette femme (droite) — robe blanche */}
              <g>
                <ellipse cx="240" cy="172" rx="20" ry="25" fill="#5a3a2c" />
                <path d="M 240 145 Q 260 150 270 165 Q 268 155 258 152" fill="#3a2418" />
                <path d="M 215 200 Q 215 280 225 340 L 265 340 Q 275 280 270 200 Q 260 195 240 195 Q 220 195 215 200 Z" fill="#fbf6ea" />
                <path d="M 215 340 Q 200 410 195 500 L 295 500 Q 295 410 280 340 Z" fill="#ffffff" />
                <ellipse cx="222" cy="186" rx="8" ry="4" fill="#1a1a1a" opacity="0.9" />
              </g>

              {/* Vignette atmosphérique */}
              <rect width="400" height="500" fill="url(#cpVignette)" />
              <defs>
                <radialGradient id="cpVignette" cx="0.5" cy="0.5" r="0.7">
                  <stop offset="50%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                </radialGradient>
              </defs>
            </svg>
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
     ÉCRAN ENVELOPPE — 4 RABATS TRIANGULAIRES
     ========================================= */
  .cp-env-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    background: #fefcf7;
    transition: opacity 0.6s ease;
  }
  .cp-env-screen.cp-phase-3 { opacity: 0; pointer-events: none; }

  /* Fond papier texturé (visible une fois les rabats partis) */
  .cp-env-back {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 50%, #fefcf7 0%, #f3e9d3 100%);
    background-image:
      radial-gradient(circle at 15% 25%, rgba(180, 140, 90, 0.05) 0%, transparent 40%),
      radial-gradient(circle at 85% 75%, rgba(180, 140, 90, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, #fefcf7 0%, #f3e9d3 100%);
  }

  /* Aperçu de l'invitation derrière l'enveloppe (apparait quand les rabats s'ouvrent) */
  .cp-env-reveal {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      linear-gradient(to bottom, #c8dcea 0%, #e6eef5 50%, #f3e9d8 100%);
    opacity: 0;
    transition: opacity 0.7s ease 0.5s;
  }
  .cp-phase-2 .cp-env-reveal,
  .cp-phase-3 .cp-env-reveal { opacity: 1; }

  .cp-env-reveal-inner {
    text-align: center;
    padding: 2rem;
  }
  .cp-env-reveal-eyebrow {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(2rem, 7vw, 3rem);
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(60, 20, 30, 0.35);
    margin-bottom: 0.5rem;
    line-height: 1;
  }
  .cp-env-reveal-names {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(3rem, 10vw, 4.5rem);
    color: #ffffff;
    text-shadow: 0 3px 12px rgba(60, 20, 30, 0.4);
    line-height: 1.1;
  }
  .cp-env-reveal-names em {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.5em;
    color: #ffffff;
    margin: 0.1em 0;
  }

  /* Les 4 rabats triangulaires — chacun occupe la moitié de l'écran
     avec une forme de triangle pointant vers le centre */
  .cp-env-flap {
    position: absolute;
    z-index: 4;
    background:
      radial-gradient(ellipse at 50% 50%, #fefcf7 0%, #f3e9d3 100%);
    background-image:
      repeating-linear-gradient(45deg, rgba(180, 140, 90, 0.025) 0px, rgba(180, 140, 90, 0.025) 1px, transparent 1px, transparent 4px),
      radial-gradient(ellipse at 50% 50%, #fefcf7 0%, #f3e9d3 100%);
    box-shadow: 0 4px 12px rgba(60, 30, 10, 0.18);
    transition: transform 1.3s cubic-bezier(0.55, 0, 0.3, 1), opacity 0.4s ease 0.9s;
  }

  /* Rabat HAUT : triangle dont la base est en haut de l'écran, pointe vers le centre */
  .cp-flap-top {
    top: 0; left: 0; right: 0;
    height: 60vh;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    transform-origin: top center;
  }
  /* Rabat BAS : triangle dont la base est en bas, pointe vers le centre */
  .cp-flap-bottom {
    bottom: 0; left: 0; right: 0;
    height: 60vh;
    clip-path: polygon(0 100%, 100% 100%, 50% 0);
    transform-origin: bottom center;
  }
  /* Rabat GAUCHE : triangle base sur le bord gauche, pointe au centre */
  .cp-flap-left {
    top: 0; bottom: 0; left: 0;
    width: 60vw;
    clip-path: polygon(0 0, 0 100%, 100% 50%);
    transform-origin: left center;
  }
  /* Rabat DROIT : triangle base sur le bord droit, pointe au centre */
  .cp-flap-right {
    top: 0; bottom: 0; right: 0;
    width: 60vw;
    clip-path: polygon(100% 0, 100% 100%, 0 50%);
    transform-origin: right center;
  }

  /* OUVERTURE des rabats en phase 2+ : chacun se rétracte vers son bord */
  .cp-phase-2 .cp-flap-top,
  .cp-phase-3 .cp-flap-top    { transform: translateY(-100%); opacity: 0; }
  .cp-phase-2 .cp-flap-bottom,
  .cp-phase-3 .cp-flap-bottom { transform: translateY(100%); opacity: 0; }
  .cp-phase-2 .cp-flap-left,
  .cp-phase-3 .cp-flap-left   { transform: translateX(-100%); opacity: 0; }
  .cp-phase-2 .cp-flap-right,
  .cp-phase-3 .cp-flap-right  { transform: translateX(100%); opacity: 0; }

  /* Sceau de cire — pile au centre, sur les 4 rabats */
  .cp-seal {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(120px, 28vw, 170px);
    height: clamp(120px, 28vw, 170px);
    transform: translate(-50%, -50%);
    z-index: 5;
    filter: drop-shadow(0 6px 12px rgba(80, 50, 20, 0.4));
    animation: cpSealPulse 2.6s ease-in-out infinite;
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .cp-seal svg { width: 100%; height: 100%; }
  .cp-phase-1 .cp-seal,
  .cp-phase-2 .cp-seal,
  .cp-phase-3 .cp-seal {
    animation: none;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.85);
  }
  @keyframes cpSealPulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }

  /* Hint sous le sceau */
  .cp-env-hint {
    position: absolute;
    bottom: 18%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.05rem;
    letter-spacing: 0.06em;
    color: #7B1E2E;
    transition: opacity 0.4s ease;
  }
  .cp-phase-1 .cp-env-hint,
  .cp-phase-2 .cp-env-hint,
  .cp-phase-3 .cp-env-hint { opacity: 0; }

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
  .cp-hero-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
  }
  /* Overlay : éclaircit le haut (lisibilité du Wedding Day) et assombrit légèrement
     le milieu (lisibilité des noms en cursive blanche). */
  .cp-hero-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom,
        rgba(0, 0, 0, 0.15) 0%,
        rgba(0, 0, 0, 0.05) 30%,
        rgba(0, 0, 0, 0.25) 60%,
        rgba(123, 30, 46, 0.35) 100%);
    pointer-events: none;
  }

  .cp-hero-top {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 1rem;
    margin-top: 2rem;
  }
  .cp-hero-wedding-day {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(2.2rem, 7vw, 3.2rem);
    color: #ffffff;
    text-shadow: 0 3px 12px rgba(60, 20, 30, 0.4), 0 1px 4px rgba(60, 20, 30, 0.3);
    line-height: 1;
    margin-bottom: 0.4rem;
  }
  .cp-hero-date-top {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.4rem, 4vw, 1.8rem);
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(60, 20, 30, 0.4);
    letter-spacing: 0.05em;
    font-weight: 500;
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
    bottom: -2px;
    left: 0;
    right: 0;
    height: 38vh;
    max-height: 340px;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }
  .cp-bouquet-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center bottom;
    display: block;
    /* Fade le haut de la photo pour la blender avec le château au-dessus.
       Masque qui révèle 0% en haut → 100% à 35% de hauteur */
    -webkit-mask-image: linear-gradient(to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 12%,
      rgba(0, 0, 0, 0.7) 25%,
      #000 38%,
      #000 100%);
    mask-image: linear-gradient(to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 12%,
      rgba(0, 0, 0, 0.7) 25%,
      #000 38%,
      #000 100%);
    filter: drop-shadow(0 -4px 16px rgba(60, 20, 30, 0.25));
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
  .cp-welcome-title {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(2.6rem, 8vw, 3.8rem);
    color: #ffffff;
    line-height: 1.1;
    margin-bottom: 2rem;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  .cp-welcome-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    line-height: 1.7;
    color: #f7ecdf;
    margin-bottom: 1.5rem;
    max-width: 580px;
    margin-left: auto;
    margin-right: auto;
  }
  .cp-welcome-text:last-child { margin-bottom: 0; }

  /* =========================================
     SECTION COMPTE À REBOURS (sur blanc, entre deux découpes bordeaux)
     ========================================= */
  .cp-countdown-section {
    position: relative;
    background: var(--cp-paper);
    padding: 0;
  }
  .cp-tear-burgundy-bottom,
  .cp-tear-burgundy-top {
    height: 40px;
    line-height: 0;
    margin: 0;
  }
  .cp-tear-burgundy-bottom { margin-top: -1px; }
  .cp-tear-burgundy-top { margin-bottom: -1px; }
  .cp-tear-burgundy-bottom svg,
  .cp-tear-burgundy-top svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .cp-countdown-inner {
    max-width: 720px;
    margin: 0 auto;
    padding: 4rem 1.5rem;
    text-align: center;
  }
  .cp-countdown-title {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(2.4rem, 7vw, 3.4rem);
    color: var(--cp-ink);
    line-height: 1;
    margin-bottom: 2.5rem;
  }
  .cp-countdown-big {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: clamp(0.6rem, 2vw, 1.5rem);
  }
  .cp-cdb-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 70px;
  }
  .cp-cdb-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 9vw, 4.2rem);
    font-weight: 500;
    color: var(--cp-ink);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .cp-cdb-lbl {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(0.85rem, 2.5vw, 1.05rem);
    color: var(--cp-ink-soft);
    margin-top: 0.75rem;
    letter-spacing: 0.02em;
  }
  .cp-cdb-sep {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 9vw, 4.2rem);
    color: var(--cp-ink);
    line-height: 1;
    padding-top: 0;
  }

  /* =========================================
     4. PROGRAMME (TIMELINE)
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

  /* Nouveau titre cursive "Schedule of Events" */
  .cp-program-title {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(2.6rem, 7vw, 3.6rem);
    color: #ffffff;
    text-align: center;
    margin-bottom: 3rem;
    line-height: 1;
  }
  /* Timeline verticale style vidéo : heure | axe | événement */
  .cp-timeline-v {
    max-width: 540px;
    margin: 0 auto;
    position: relative;
  }
  .cp-tlv-row {
    display: grid;
    grid-template-columns: 1fr 60px 1fr;
    align-items: center;
    gap: 1rem;
    min-height: 90px;
    position: relative;
  }
  .cp-tlv-time {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.5rem, 5vw, 2rem);
    color: #ffffff;
    text-align: center;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }
  .cp-tlv-axis {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* Ligne verticale qui traverse l'axe */
  .cp-tlv-axis::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1.5px;
    background: rgba(255, 255, 255, 0.5);
  }
  /* Première et dernière rangée : ligne partielle */
  .cp-tlv-row:first-child .cp-tlv-axis::before { top: 50%; }
  .cp-tlv-row:last-child .cp-tlv-axis::before { bottom: 50%; }

  .cp-tlv-diamond {
    position: relative;
    z-index: 2;
    color: #ffffff;
    font-size: 0.9rem;
    background: var(--cp-burgundy);
    padding: 0 4px;
  }
  .cp-tlv-rose {
    position: relative;
    z-index: 2;
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
  }
  .cp-tlv-rose svg { width: 100%; height: 100%; display: block; }

  .cp-tlv-event {
    text-align: center;
    padding: 0 0.25rem;
  }
  .cp-tlv-event-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.15rem, 3.5vw, 1.4rem);
    color: #ffffff;
    line-height: 1.25;
  }
  .cp-tlv-event-venue {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.2rem;
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
    height: 200px;
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 0;
    overflow: hidden;
    position: relative;
  }
  .cp-rsvp-roses-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    /* Fade en bas pour blender vers le burgundy de la section RSVP */
    -webkit-mask-image: linear-gradient(to bottom,
      #000 0%,
      #000 55%,
      rgba(0, 0, 0, 0.6) 75%,
      transparent 100%);
    mask-image: linear-gradient(to bottom,
      #000 0%,
      #000 55%,
      rgba(0, 0, 0, 0.6) 75%,
      transparent 100%);
  }
  .cp-rsvp-inner {
    max-width: 620px;
    margin: 0 auto;
    text-align: center;
    padding-top: 2rem;
  }
  .cp-rsvp-title {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(2.6rem, 8vw, 3.6rem);
    color: #ffffff;
    line-height: 1;
    margin-bottom: 1rem;
  }
  .cp-rsvp-sub {
    font-family: 'Cormorant Garamond', serif;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 2.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
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
    background: var(--cp-burgundy);
    color: #ffffff;
    padding: 4rem 0 0;
    text-align: center;
  }
  .cp-conclusion-title {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(2.6rem, 8vw, 3.6rem);
    color: #ffffff;
    line-height: 1.1;
    margin-bottom: 0.5rem;
    padding: 0 1.5rem;
  }
  .cp-conclusion-names {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.4rem, 4vw, 1.8rem);
    color: #ffffff;
    letter-spacing: 0.04em;
    margin-bottom: 3rem;
    padding: 0 1.5rem;
  }
  .cp-couple-photo {
    width: 100%;
    max-height: 70vh;
    overflow: hidden;
  }
  .cp-couple-photo svg {
    width: 100%;
    height: 100%;
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
    .cp-env-hint { font-size: 0.95rem; bottom: 14%; }
  }

  @media (max-width: 480px) {
    .cp-env-hint { font-size: 0.9rem; bottom: 12%; }

    .cp-hero { padding-top: 1.5rem; }
    .cp-name { font-size: 3.2rem; }
    .cp-amp { font-size: 1.8rem; }
    .cp-hero-message { font-size: 1rem; padding: 0 0.5rem; }
    .cp-hero-time { font-size: 0.75rem; letter-spacing: 0.22em; }
    .cp-bouquet { height: 28vh; }

    .cp-welcome-text { font-size: 1.05rem; }
    .cp-countdown-big { gap: 0.3rem; }
    .cp-cdb-cell { min-width: 56px; }
    .cp-cdb-lbl { font-size: 0.8rem; margin-top: 0.5rem; }

    /* Timeline mobile : encore grid, mais plus serré */
    .cp-tlv-row { grid-template-columns: 0.8fr 50px 1fr; gap: 0.5rem; min-height: 76px; }
    .cp-tlv-rose { width: 52px; height: 52px; }
    .cp-tlv-time { font-size: 1.35rem; }
    .cp-tlv-event-name { font-size: 1.1rem; }

    .cp-section-title { font-size: 1.75rem; }
    .cp-footer-names { font-size: 1.6rem; }

    .cp-rsvp-choice { padding: 0.7rem 0.9rem; font-size: 0.62rem; letter-spacing: 0.18em; }
    .cp-rsvp-submit { padding: 1.1rem 1.8rem; font-size: 0.7rem; letter-spacing: 0.25em; }
  }
`