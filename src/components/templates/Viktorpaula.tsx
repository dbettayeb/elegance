'use client'

import { useState, useEffect, useRef } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'

export default function ViktorPaula({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate,
  } = useInvitationLogic(wedding)

  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)
  const [pigeonTop, setPigeonTop] = useState(95)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const scheduleRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])

  const formattedDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const day = String(eventDate.getDate()).padStart(2, '0')
  const month = String(eventDate.getMonth() + 1).padStart(2, '0')
  const year = String(eventDate.getFullYear())
  const shortYear = year.slice(-2)

  // --- Opening sequence ---
  function startSequence() {
    if (phase !== 0) return
    setPhase(1)
    setTimeout(() => setPhase(2), 2500)
    setTimeout(() => {
      setPhase(3)
      openEnvelope()
      if (audioRef.current && !audioPlaying) {
        audioRef.current.play().catch(() => {})
        setAudioPlaying(true)
      }
    }, 3000)
  }

  // --- Pigeon tracker (identique au HTML) ---
  useEffect(() => {
    if (!visible) return
    const rowTops = [95, 175, 264, 342]
    function updatePigeon() {
      if (!dotRefs.current.length) return
      const vh = window.innerHeight
      let bestIdx = 0
      let bestScore = -Infinity
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return
        const rect = dot.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const score = vh / 2 - Math.abs(centerY - vh * 0.4)
        if (score > bestScore) { bestScore = score; bestIdx = i }
      })
      setPigeonTop(rowTops[bestIdx] || 95)
    }
    window.addEventListener('scroll', updatePigeon, { passive: true })
    window.addEventListener('resize', updatePigeon)
    updatePigeon()
    return () => {
      window.removeEventListener('scroll', updatePigeon)
      window.removeEventListener('resize', updatePigeon)
    }
  }, [visible])

  // --- Programme par défaut (comme HTML) ---
  const defaultProgram: ProgramItem[] = [
    { time: '16:00', event: 'Wedding Ceremony' },
    { time: '17:00', event: 'Cocktail Hour' },
    { time: '19:00', event: 'Dinner' },
    { time: '20:00', event: 'Party' }
  ]
  const program = (wedding.program && wedding.program.length > 0) ? wedding.program : defaultProgram

  // --- Séparateur à bords déchirés ---
  const TornSeparator = ({ flip = false }: { flip?: boolean }) => (
    <div className={`sep ${flip ? 'sep--up' : 'sep--down'}`}>
      <img src="/assets/separator/separator.svg" alt="" />
    </div>
  )

  // --- Bouton audio flottant ---
  const AudioControl = () => {
    const [playing, setPlaying] = useState(false)
    useEffect(() => setPlaying(audioPlaying), [audioPlaying])
    const toggle = () => {
      if (audioRef.current) {
        if (audioPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play().catch(() => {})
        }
        setAudioPlaying(!audioPlaying)
        setPlaying(!audioPlaying)
      }
    }
    if (!visible) return null
    return (
      <button className="audio-control visible" onClick={toggle}>
        {playing ? (
          <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        ) : (
          <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
        )}
      </button>
    )
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Ovo&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <style>{POS_CSS}</style>
      <FontOverride font={wedding.custom_font} container="#main-content" />

      <audio ref={audioRef} loop src="/assets/audio/music.mp3" preload="auto" />

      {/* ÉCRAN D'OUVERTURE */}
      {!opened && (
        <div id="opening-screen" className={phase >= 2 ? 'hidden' : ''}>
          <div className={`opening-stage ${phase >= 1 ? 'animating' : ''}`} onClick={startSequence}>
            <img className="poly poly-left" src="/assets/polygons/polygon-left.png" alt="" />
            <img className="poly poly-right" src="/assets/polygons/polygon-right.png" alt="" />
            <img className="poly poly-top" src="/assets/polygons/polygon-top.png" alt="" />
            <img className="poly poly-bot" src="/assets/polygons/polygon-bottom.png" alt="" />
            <button className="dove-btn"><img src="/assets/dove/dove-open.webp" alt="Open" /></button>
            <span className="click-hint">Click to open</span>
          </div>
        </div>
      )}

      {/* CONTENU PRINCIPAL */}
      <div id="main-content" className={visible ? 'visible' : ''}>
        <AudioControl />

        {/* HERO */}
        <div id="hero">
          <div className="artboard hero-artboard">
            <div className="hero-video-wrap">
              <video autoPlay muted loop playsInline>
                <source src="/assets/video/couple.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="hero-overlay"></div>
            <div className="hero-gradient"></div>
            <div className="hero-bottom-bar"></div>

            <div className="hero-text hero-wedding-day anim-fade-up" style={{ animationDelay: '3.2s' }}>Wedding Day</div>
            <div className="hero-text hero-date anim-fade-up" style={{ animationDelay: '3.3s' }}>{day}.{month}.{shortYear}</div>

            {/* Hero names with proper spacing for the ampersand */}
            <div className="hero-names-block anim-fade-up" style={{ animationDelay: '3.4s' }}>
              <div className="hero-name">{wedding.bride_name}</div>
              <div className="hero-amp">&amp;</div>
              <div className="hero-name">{wedding.groom_name}</div>
            </div>

            {/* Rubis (exactement comme HTML) */}
            <div className="ruby ruby-1 anim-zoom" style={{ animationDelay: '3.0s' }}><img src="/assets/rubies/ruby-1.png" alt="" /></div>
            <div className="ruby ruby-2 anim-zoom" style={{ animationDelay: '3.1s' }}><img src="/assets/rubies/ruby-2.png" alt="" /></div>
            <div className="ruby ruby-4 anim-zoom" style={{ animationDelay: '3.0s' }}><img src="/assets/rubies/ruby-4.png" alt="" /></div>
            <div className="ruby ruby-6d anim-zoom" style={{ animationDelay: '3.2s' }}><img src="/assets/rubies/ruby-6d.png" alt="" /></div>
            <div className="ruby ruby-7u anim-zoom" style={{ animationDelay: '3.0s' }}><img src="/assets/rubies/ruby-7u.png" alt="" /></div>
            <div className="ruby ruby-8 anim-zoom" style={{ animationDelay: '3.1s' }}><img src="/assets/rubies/ruby-8.png" alt="" /></div>
            <div className="ruby ruby-nr anim-zoom" style={{ animationDelay: '3.2s' }}><img src="/assets/rubies/noroot.png" alt="" /></div>
          </div>
        </div>

        {/* DEAR FRIENDS (toujours affiché, texte par défaut si vide) */}
        <div id="dear-friends">
          <div className="dear-friends-inner">
            <h2>Dear Friends and Family,</h2>
            <p>
              {wedding.custom_message ||
                `As we get ready to say "I do," we feel grateful for the wonderful people in our lives.
                Your support means the world to us, and we would be honored to have you with us as we begin our life together.`}
            </p>
          </div>
        </div>

        <TornSeparator />

        {/* COUNTDOWN */}
        <div id="countdown-section">
          <div className="countdown-inner">
            <h2>The Celebration Begins In</h2>
            <div className="countdown-timer">
              <div className="time-block"><div className="time-number">{countdown.d}</div><div className="time-label">Days</div></div>
              <div className="time-sep">:</div>
              <div className="time-block"><div className="time-number">{countdown.h}</div><div className="time-label">Hours</div></div>
              <div className="time-sep">:</div>
              <div className="time-block"><div className="time-number">{countdown.m}</div><div className="time-label">Minutes</div></div>
              <div className="time-sep">:</div>
              <div className="time-block"><div className="time-number">{countdown.s}</div><div className="time-label">Seconds</div></div>
            </div>
          </div>
        </div>

        <TornSeparator flip />

        {/* SCHEDULE (avec positions absolues exactes du HTML) */}
        <div id="schedule">
          <div className="artboard schedule-artboard" ref={scheduleRef}>
            <div className="schedule-title">Schedule of Events</div>
            <div className="tl-line"></div>

            <div className="pigeon-timeline" style={{ top: `${pigeonTop}px` }}>
              <img src="/assets/dove/dove-timeline.png" alt="" />
            </div>

            {/* Génération des 4 lignes exactement comme dans le HTML */}
            {program.slice(0, 4).map((item, idx) => (
              <div key={idx}>
                <div className={`tl-time tl-time-${idx+1}`}>{item.time}</div>
                <div
                  className={`tl-dot tl-dot-${idx+1}`}
                  ref={el => { dotRefs.current[idx] = el }}
                />
                <div className={`tl-event tl-event-${idx+1}`}>
                  {item.event}
                  {item.venue && <div className="tl-event-venue">{item.venue}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <TornSeparator />

        {/* LOCATION */}
        <div id="location">
          <div className="location-inner">
            <h2>Location</h2>
            <div className="location-photo">
              <img src="/assets/location/chateau.png" alt="Chateau de Paon" />
            </div>
            <p className="location-name">{wedding.venue_name || 'Chateau de Paon'}</p>
            {wedding.venue_address && <p className="location-address">{wedding.venue_address}</p>}
            {(wedding.gps_google || wedding.gps_apple) && (
              <div className="location-buttons">
                {wedding.gps_google && <a className="map-btn" href={wedding.gps_google} target="_blank">Google Maps</a>}
                {wedding.gps_apple && <a className="map-btn" href={wedding.gps_apple} target="_blank">Apple Maps</a>}
              </div>
            )}
          </div>
        </div>

        <TornSeparator flip />


        <TornSeparator />

        {/* DETAILS (avec les 12 fleurs) */}
        <div id="details">
          <div className="artboard details-artboard">
            <div className="details-redbar"></div>
            <div className="details-title">Details</div>
            <div className="details-text details-text-1">For additional information or questions, please contact the wedding organizers.</div>
            <div className="details-text details-text-2">Amelia</div>
            <div className="details-text details-text-3">{wedding.couple_phone || '+31 6845965887'}</div>
            <div className="details-text details-text-4">Your presence is the greatest gift to us. However, if you wish to honor us with a present, a contribution toward our future would be sincerely appreciated.</div>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
              <div key={num} className={`flower fl-${num}`}>
                <img src={`/assets/details/flower-${num}.png`} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* PLUS AUCUN SÉPARATEUR ENTRE DETAILS ET RSVP */}

        {/* RSVP (suppression du padding bottom pour coller au guestbook) */}
        {wedding.show_rsvp && (
          <div id="rsvp">
            <div className="rsvp-inner">
              <h2>Confirm Your Attendance</h2>
              <p>To help us prepare for a joyful celebration, kindly confirm your attendance before {formattedDate}.</p>
              {rsvpStatus === 'done' ? (
                <div className="rsvp-done">Thank you! We look forward to celebrating with you. 💕</div>
              ) : (
                <form className="rsvp-form" onSubmit={submitRSVP}>
                  <div className="rsvp-choices">
                    {(['present', 'absent', 'maybe'] as const).map(s => (
                      <button key={s} type="button" className={`rsvp-choice${rsvpChoice === s ? ' active' : ''}`} onClick={() => setRsvpChoice(s)}>
                        {s === 'present' ? '✓ Attending' : s === 'absent' ? '✗ Can\'t make it' : '? To be confirmed'}
                      </button>
                    ))}
                  </div>
                  <div className="rsvp-fields">
                    <input className="rsvp-input" name="name" placeholder="Your name" required />
                    <input className="rsvp-input" name="phone" placeholder="WhatsApp (optional)" />
                    <input className="rsvp-input" name="guests" type="number" min="0" max="20" placeholder="Number of guests" />
                    <input className="rsvp-input" name="food" placeholder="Food intolerances (optional)" />
                    <textarea className="rsvp-input rsvp-textarea" name="note" placeholder="A word for the couple (optional)" />
                  </div>
                  <button type="submit" className="rsvp-submit" disabled={rsvpStatus === 'loading'}>
                    {rsvpStatus === 'loading' ? 'Submitting…' : 'RSVP'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* GUESTBOOK - plus de séparateur, plus de marge blanche, fond bordeaux direct */}
        {wedding.show_guestbook && (
          <div id="guestbook" style={{ background: 'var(--bordeaux)', paddingTop: '0' }}>
            <div className="guestbook-inner" style={{ paddingTop: '2rem' }}>
              <h2>Wishes &amp; Messages</h2>
              {messages.length > 0 && (
                <div className="guestbook-list">
                  {messages.map(m => (
                    <div key={m.id} className="guestbook-card">
                      <span className="guestbook-quote">❝</span>
                      <p className="guestbook-message">{m.message}</p>
                      <p className="guestbook-author">— {m.author_name}</p>
                    </div>
                  ))}
                </div>
              )}
              {gbStatus === 'done' ? (
                <p className="guestbook-done">{gbPending ? 'Your message will be published after review.' : 'Your message has been published. Thank you!'}</p>
              ) : (
                <form className="guestbook-form" onSubmit={submitMessage}>
                  <input className="guestbook-input" name="author_name" placeholder="Your first name" required />
                  <textarea className="guestbook-input guestbook-textarea" name="message" placeholder="Leave a sweet note for the couple…" required />
                  <button type="submit" className="guestbook-submit" disabled={gbStatus === 'loading'}>
                    {gbStatus === 'loading' ? 'Sending…' : 'Send my message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* CLOSING */}
        <footer id="closing">
          <div className="closing-inner">
            <h2>Hope to see you there!</h2>
            <p className="closing-names">{wedding.bride_name} and {wedding.groom_name}</p>
            <div className="closing-photo">
              <img src="/assets/closing/couple-final.png" alt="The couple" />
              <img className="closing-overlay-img" src="/assets/closing/overlay.png" alt="" />
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bordeaux: #66021f;
    --bordeaux-dark: #660120;
    --cream: #fffaf8;
    --ink: #3a3a3a;
    --font: 'Cormorant Garamond', serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bordeaux);
    font-family: var(--font);
    overflow-x: hidden;
  }

  /* ========== ARTBOARD ========== */
  .artboard {
    position: relative;
    width: 100%;
    margin: 0;
  }

  /* ========== OPENING SCREEN ========== */
  #opening-screen {
    position: fixed;
    inset: 0;
    background: var(--bordeaux);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  }
  #opening-screen.hidden { opacity: 0; visibility: hidden; pointer-events: none; }

  .opening-stage {
    position: relative;
    width: 100%;
    height: 850px;
    cursor: pointer;
    overflow: hidden;
  }

  .poly {
    position: absolute;
    pointer-events: none;
    transition: transform 2.5s ease, opacity 0.5s ease;
  }
  .poly-left  { top: -13px; left: 98px;  width: 467px; height: auto; }
  .poly-right { top: -13px; left: 635px; width: 467px; height: auto; }
  .poly-top   { top: -6px;  left: 94px;  width: 1012px; height: auto; }
  .poly-bot   { top: 271px; left: 95px;  width: 1011px; height: auto; }

  .opening-stage.animating .poly-left  { transform: translateX(-560px); opacity: 0; }
  .opening-stage.animating .poly-right { transform: translateX(560px);  opacity: 0; }
  .opening-stage.animating .poly-top   { transform: translateY(-430px); }
  .opening-stage.animating .poly-bot   { transform: translateY(566px); }

  .dove-btn {
    position: absolute;
    top: 288px;
    left: 515px;
    width: 170px;
    height: 170px;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    transition: transform 1.5s ease, opacity 1.5s ease;
  }
  .dove-btn img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .opening-stage.animating .dove-btn { transform: scale(1.22); opacity: 0; }

  .click-hint {
    position: absolute;
    top: 468px;
    left: 535px;
    width: 130px;
    text-align: center;
    color: var(--bordeaux);
    font-family: var(--font);
    font-size: 20px;
    font-weight: 400;
    pointer-events: none;
    transition: opacity 1.5s ease;
    white-space: nowrap;
  }
  .opening-stage.animating .click-hint { opacity: 0; }

  /* ========== MAIN CONTENT ========== */
  #main-content {
    opacity: 0;
    transition: opacity 1.2s ease;
    background: var(--bordeaux);
  }
  #main-content.visible { opacity: 1; }

  /* ========== HERO (espacement corrigé pour que & soit bien centré) ========== */
  #hero {
    background: var(--bordeaux);
    width: 100%;
    overflow: hidden;
  }
  .hero-artboard {
    height: 763px;
  }
  .hero-video-wrap {
    position: absolute;
    top: 0;
    left: 380px;
    width: 440px;
    height: 763px;
    z-index: 1;
  }
  .hero-video-wrap video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
