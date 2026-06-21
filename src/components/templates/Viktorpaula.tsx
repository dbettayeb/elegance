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

  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [pigeonTop, setPigeonTop] = useState(95)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [showIntroVideo, setShowIntroVideo] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const introVideoRef = useRef<HTMLVideoElement | null>(null)
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
    setPhase(1)                          // dove & hint fade out
    setTimeout(() => setPhase(2), 1000)  // polygons start opening
    setTimeout(() => setPhase(3), 3500)  // opening screen fades out
    setTimeout(() => {
      setPhase(4)
      if (wedding.intro_video_url) {
        setShowIntroVideo(true)
        setTimeout(() => {
          introVideoRef.current?.play().catch(() => {
            setShowIntroVideo(false)
            openEnvelope()
            if (audioRef.current && !audioPlaying) {
              audioRef.current.play().catch(() => {})
              setAudioPlaying(true)
            }
          })
        }, 50)
      } else {
        openEnvelope()
        if (audioRef.current && !audioPlaying) {
          audioRef.current.play().catch(() => {})
          setAudioPlaying(true)
        }
      }
    }, 4100)
  }

  function handleIntroVideoEnd() {
    setShowIntroVideo(false)
    setTimeout(() => {
      openEnvelope()
      if (audioRef.current && !audioPlaying) {
        audioRef.current.play().catch(() => {})
        setAudioPlaying(true)
      }
    }, 600)
  }



  // --- Opening screen scale (responsive) ---
  useEffect(() => {
    function scaleOpening() {
      const stage = document.querySelector<HTMLElement>('.opening-stage')
      if (!stage) return
      // Scale so the 580px-tall envelope paper fills the viewport height.
      // Width is intentionally not constrained — the stage overflows horizontally
      // and is clipped by overflow:hidden, giving a centered crop on narrow screens.
      // On desktop (≥1200px wide AND ≥850px tall) we keep scale = 1.
      const PAPER_H = 580
      const scale = (window.innerWidth >= 1200 && window.innerHeight >= 850)
        ? 1
        : Math.min(window.innerHeight / PAPER_H, 1.5)
      stage.style.setProperty('--os-scale', String(scale.toFixed(4)))
    }
    scaleOpening()
    window.addEventListener('resize', scaleOpening)
    return () => window.removeEventListener('resize', scaleOpening)
  }, [])

  // --- Pigeon tracker ---
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

  // --- Default program ---
  const defaultProgram: ProgramItem[] = [
    { time: '16:00', event: 'Wedding Ceremony' },
    { time: '17:00', event: 'Cocktail Hour' },
    { time: '19:00', event: 'Dinner' },
    { time: '20:00', event: 'Party' }
  ]
  const program = (wedding.program && wedding.program.length > 0) ? wedding.program : defaultProgram

  // --- Torn separator ---
  const TornSeparator = ({ flip = false }: { flip?: boolean }) => (
    <div className={`sep ${flip ? 'sep--up' : 'sep--down'}`}>
      <img src="/assets/separator/separator.svg" alt="" />
    </div>
  )

  // --- Audio control button ---
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
      <button className="audio-control visible" onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'}>
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

      {/* ─── OPENING SCREEN ─── */}
      {!opened && (
        <div id="opening-screen" className={phase >= 3 ? 'hidden' : ''}>
          <div
            className={`opening-stage${phase >= 1 ? ' seal-out' : ''}${phase >= 2 ? ' animating' : ''}`}
            onClick={startSequence}
            aria-label="Open invitation"
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startSequence() }}
          >
            <img className="poly poly-left"  src="/assets/polygons/polygon-left.png"   alt="" />
            <img className="poly poly-right" src="/assets/polygons/polygon-right.png"  alt="" />
            <img className="poly poly-top"   src="/assets/polygons/polygon-top.png"    alt="" />
            <img className="poly poly-bot"   src="/assets/polygons/polygon-bottom.png" alt="" />
            <button className="dove-btn" tabIndex={-1} aria-hidden="true">
              <img src="/assets/dove/dove-open.webp" alt="" />
            </button>
            <span className="click-hint">Click to open</span>
          </div>
        </div>
      )}

      {/* ─── INTRO VIDEO OVERLAY ─── */}
      {wedding.intro_video_url && (
        <div id="intro-video-screen" className={showIntroVideo ? '' : 'hidden'}>
          <video
            ref={introVideoRef}
            src={wedding.intro_video_url}
            onEnded={handleIntroVideoEnd}
            playsInline
          />
          <button className="video-skip-btn" onClick={handleIntroVideoEnd} aria-label="Skip video">
            Skip ›
          </button>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
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

            <div className="hero-text hero-wedding-day anim-fade-up" style={{ animationDelay: '3.2s' }}>{wedding.wedding_day_text || 'Wedding Day'}</div>
            <div className="hero-text hero-date anim-fade-up" style={{ animationDelay: '3.3s' }}>{day}.{month}.{shortYear}</div>

            <div className="hero-names-block anim-fade-up" style={{ animationDelay: '3.4s' }}>
              <div className="hero-name">{wedding.bride_name}</div>
              <div className="hero-amp">&amp;</div>
              <div className="hero-name">{wedding.groom_name}</div>
            </div>

            <div className="ruby ruby-1 anim-zoom"  style={{ animationDelay: '3.0s' }}><img src="/assets/rubies/ruby-1.png"   alt="" /></div>
            <div className="ruby ruby-2 anim-zoom"  style={{ animationDelay: '3.1s' }}><img src="/assets/rubies/ruby-2.png"   alt="" /></div>
            <div className="ruby ruby-4 anim-zoom"  style={{ animationDelay: '3.0s' }}><img src="/assets/rubies/ruby-4.png"   alt="" /></div>
            <div className="ruby ruby-6d anim-zoom" style={{ animationDelay: '3.2s' }}><img src="/assets/rubies/ruby-6d.png"  alt="" /></div>
            <div className="ruby ruby-7u anim-zoom" style={{ animationDelay: '3.0s' }}><img src="/assets/rubies/ruby-7u.png"  alt="" /></div>
            <div className="ruby ruby-8 anim-zoom"  style={{ animationDelay: '3.1s' }}><img src="/assets/rubies/ruby-8.png"   alt="" /></div>
            <div className="ruby ruby-nr anim-zoom" style={{ animationDelay: '3.2s' }}><img src="/assets/rubies/noroot.png"   alt="" /></div>
          </div>
        </div>

        {/* DEAR FRIENDS */}
        <div id="dear-friends">
          <div className="dear-friends-inner">
            <h2>{(wedding.intro_text && !wedding.intro_text.startsWith('Vous êtes')) ? wedding.intro_text : 'Dear Friends and Family,'}</h2>
            <p>
              {wedding.custom_message ||
                `As we get ready to say "I do," we feel grateful for the wonderful people in our lives. Your support means the world to us, and we would be honored to have you with us as we begin our life together.`}
            </p>
          </div>
        </div>

        {wedding.show_countdown && (
          <>
            <TornSeparator />
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
          </>
        )}

        {/* SCHEDULE */}
        <div id="schedule">
          <div className="artboard schedule-artboard" ref={scheduleRef}>
            <div className="schedule-title">Schedule of Events</div>
            <div className="tl-line"></div>

            <div className="pigeon-timeline" style={{ top: `${pigeonTop}px` }}>
              <img src="/assets/dove/dove-timeline.png" alt="" />
            </div>

            {program.slice(0, 4).map((item, idx) => (
              <div key={idx}>
                <div className={`tl-time tl-time-${idx + 1}`}>{item.time}</div>
                <div
                  className={`tl-dot tl-dot-${idx + 1}`}
                  ref={el => { dotRefs.current[idx] = el }}
                />
                <div className={`tl-event tl-event-${idx + 1}`}>
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
            {wedding.venue_photo && (
              <div className="location-photo">
                <img src={wedding.venue_photo} alt={wedding.venue_name} />
              </div>
            )}
            <p className="location-name">{wedding.venue_name || 'Chateau de Paon'}</p>
            {wedding.venue_address && <p className="location-address">{wedding.venue_address}</p>}
            {(wedding.gps_google || wedding.gps_apple) && (
              <div className="location-buttons">
                {wedding.gps_google && <a className="map-btn" href={wedding.gps_google} target="_blank" rel="noopener noreferrer">Google Maps</a>}
                {wedding.gps_apple  && <a className="map-btn" href={wedding.gps_apple}  target="_blank" rel="noopener noreferrer">Apple Maps</a>}
              </div>
            )}
          </div>
        </div>

        {/* FLOWERS DECORATION */}
        <div id="flowers-deco">
          <div className="artboard flowers-artboard">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
              <div key={num} className={`flower fl-${num}`}>
                <img src={`/assets/details/flower-${num}.png`} alt="" />
              </div>
            ))}
          </div>
        </div>

        <TornSeparator flip />

        {/* RSVP */}
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
                        {s === 'present' ? '✓ Attending' : s === 'absent' ? "✗ Can't make it" : '? To be confirmed'}
                      </button>
                    ))}
                  </div>
                  <div className="rsvp-fields">
                    <input className="rsvp-input" name="name"   placeholder="Your name"                          required />
                    <input className="rsvp-input" name="phone"  placeholder="WhatsApp (optional)" />
                    <input className="rsvp-input" name="guests" type="number" min="0" max="20" placeholder="Number of guests" />
                    <input className="rsvp-input" name="food"   placeholder="Food intolerances (optional)" />
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

        {/* GUESTBOOK */}
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
                  <input    className="guestbook-input"              name="author_name" placeholder="Your first name"                       required />
                  <textarea className="guestbook-input guestbook-textarea" name="message"     placeholder="Leave a sweet note for the couple…" required />
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
            {wedding.couple_photo && (
              <div className="closing-photo">
                <img src={wedding.couple_photo} alt="The couple" />
              </div>
            )}
          </div>
        </footer>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
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

  /* ═══════════════════════════════════════════════════════
     OPENING SCREEN — pure CSS responsive
     Strategy:
     • #opening-screen fills the viewport (position:fixed, inset:0)
     • .opening-stage is 1200×850, centered with absolute + translate(-50%,-50%)
       so its center always sits at the viewport center regardless of size
     • transform: translate(-50%,-50%) scale(var(--os-scale)) scales from the
       center outward — set via CSS custom property at each breakpoint
     • On mobile portrait the envelope is zoomed-in on its center,
       cropping the bordeaux margins — exactly like a "zoom on center"
  ═══════════════════════════════════════════════════════ */
  #opening-screen {
    position: fixed;
    inset: 0;
    background: var(--bordeaux);
    z-index: 9999;
    overflow: hidden;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  }
  #opening-screen.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .opening-stage {
    /* fixed 1200×850 canvas, centered in the viewport */
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1200px;
    height: 850px;
    cursor: pointer;
    /* translate(-50%,-50%) centers it; scale zooms from the center outward.
       Desktop (≥1200px): scale 1 — no zoom, fits perfectly.
       Smaller screens: scale < 1 zooms out just enough to show the envelope.
       The --os-scale custom property is set per breakpoint below. */
    --os-scale: 1;
    transform: translate(-50%, -50%) scale(var(--os-scale));
    transform-origin: center center;
  }

  .poly {
    position: absolute;
    pointer-events: none;
    transition: transform 2.5s ease, opacity 0.5s ease;
  }
  .poly-left  { top: -13px; left: 98px;  width: 467px; height: auto; z-index: 1; }
  .poly-right { top: -13px; left: 635px; width: 467px; height: auto; z-index: 1; }
  .poly-bot   { top: 271px; left: 95px;  width: 1011px; height: auto; z-index: 1; }
  .poly-top   { top: -6px;  left: 94px;  width: 1012px; height: auto; z-index: 2; }

  .opening-stage.animating .poly-left  { transform: translateX(-560px); opacity: 0; }
  .opening-stage.animating .poly-right { transform: translateX(560px);  opacity: 0; }
  .opening-stage.animating .poly-top   { transform: translateY(-430px); }
  .opening-stage.animating .poly-bot   { transform: translateY(566px); }

  /* Responsive scale: the envelope (the paper part) sits roughly in the
     center 440px of the 1200px canvas. We want it to fill ~100% of viewport
     width on mobile. That means scale ≈ vw / 440.
     But since we want the full bordeaux background visible on large screens
     and a zoomed-in envelope on small ones, we use vw/1200 as the base
     (fills canvas edge to edge) and add a boost factor so the envelope paper
     reaches the screen edges on mobile.
     Computed values: scale = vw / 1200 * boost
       boost ≈ 1200/440 ≈ 2.73 would fully fill with paper — too much.
       boost ≈ 1.8 gives a nice "zoomed in on center" look.
     Per standard breakpoint (scale = vw / 1200 * 1.8, capped at 1):
       1199px → 1199/1200*1.8 = 1.80 → cap at 1
        959px →  959/1200*1.8 = 1.44 → cap at 1
        767px →  767/1200*1.8 = 1.15 → cap at 1
        599px →  599/1200*1.8 = 0.90
        479px →  479/1200*1.8 = 0.72
        374px →  374/1200*1.8 = 0.56
        319px →  319/1200*1.8 = 0.48
  */
  /* --os-scale is set dynamically by scaleOpening() in JS, which computes
     vh / 580 so the envelope paper fills the screen exactly.
     The default --os-scale: 1 (desktop) is declared on .opening-stage above. */

  .dove-btn {
    position: absolute;
    top: 318px;
    left: 515px;
    width: 170px;
    height: 170px;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    z-index: 3;
    transition: transform 1.5s ease, opacity 1.5s ease;
  }
  .dove-btn img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .opening-stage.seal-out .dove-btn,
  .opening-stage.animating .dove-btn { transform: scale(1.22); opacity: 0; }

  .click-hint {
    position: absolute;
    top: 540px;
    left: 535px;
    width: 130px;
    text-align: center;
    color: var(--bordeaux);
    font-family: var(--font);
    font-size: 20px;
    font-weight: 400;
    pointer-events: none;
    z-index: 1;
    transition: opacity 1.5s ease;
    white-space: nowrap;
  }
  .opening-stage.seal-out .click-hint,
  .opening-stage.animating .click-hint {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* ========== MAIN CONTENT ========== */
  #main-content {
    opacity: 0;
    transition: opacity 1.2s ease;
    background: var(--bordeaux);
  }
  #main-content.visible { opacity: 1; }

  /* ========== HERO ========== */
  #hero {
    background: var(--bordeaux);
    width: 100%;
    overflow: hidden;
  }
  .hero-artboard { height: 763px; }
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
  }
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 380px;
    width: 440px;
    height: 763px;
    background: rgba(0,0,0,0.4);
    z-index: 2;
  }
  .hero-gradient {
    position: absolute;
    top: 628px;
    left: 303px;
    width: 594px;
    height: 85px;
    background: linear-gradient(0deg, rgba(102,1,32,1) 0%, rgba(102,1,32,0) 100%);
    z-index: 3;
  }
  .hero-bottom-bar {
    position: absolute;
    top: 713px;
    left: 303px;
    width: 594px;
    height: 50px;
    background: var(--bordeaux-dark);
    z-index: 3;
  }
  .hero-text {
    position: absolute;
    text-align: center;
    color: var(--cream);
    z-index: 4;
    font-family: var(--font);
  }
  .hero-wedding-day {
    top: 94px;
    left: 320px;
    width: 560px;
    font-size: 40px;
    font-weight: 300;
    font-style: italic;
    line-height: 1;
    letter-spacing: 0.02em;
  }
  .hero-date {
    top: 136px;
    left: 320px;
    width: 560px;
    font-size: 25px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.05em;
  }
  .hero-names-block {
    position: absolute;
    top: 210px;
    left: 320px;
    width: 560px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    z-index: 4;
  }
  .hero-name {
    font-family: var(--font);
    font-size: 85px;
    font-weight: 500;
    color: var(--cream);
    text-align: center;
    line-height: 1;
  }
  .hero-amp {
    font-family: var(--font);
    font-size: 50px;
    color: var(--cream);
    text-align: center;
    line-height: 1;
    margin: 6px 0;
  }

  /* Rubis */
  .ruby { position: absolute; z-index: 5; pointer-events: none; }
  .ruby img { display: block; width: 100%; height: auto; }
  .ruby-1  { top: 490px; left: 660px; width: 259px; }
  .ruby-2  { top: 632px; left: 632px; width: 180px; }
  .ruby-4  { top: 628px; left: 495px; width: 149px; }
  .ruby-6d { top: 644px; left: 414px; width: 137px; }
  .ruby-7u { top: 597px; left: 457px; width: 100px; }
  .ruby-8  { top: 626px; left: 344px; width: 136px; }
  .ruby-nr { top: 570px; left: 547px; width: 180px; }

  /* ========== DEAR FRIENDS ========== */
  #dear-friends {
    background: var(--bordeaux);
    padding: 30px 0;
  }
  .dear-friends-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
    color: var(--cream);
  }
  .dear-friends-inner h2 {
    font-size: 41px;
    font-weight: 500;
    line-height: 1.55;
    margin-bottom: 16px;
  }
  .dear-friends-inner p {
    font-size: 21px;
    font-weight: 400;
    line-height: 1.25;
    max-width: 500px;
    margin: 0 auto;
  }

  /* ========== COUNTDOWN ========== */
  #countdown-section {
    background: var(--cream);
    padding: 30px 0;
    position: relative;
  }
  .countdown-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px 60px;
    text-align: center;
  }
  .countdown-inner h2 {
    font-size: 41px;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 20px;
    line-height: 1.55;
  }
  .countdown-timer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
  }
  .time-block  { text-align: center; }
  .time-number { font-size: 45px; color: var(--ink); font-family: 'Ovo', serif; font-weight: 400; }
  .time-label  { font-size: 19px; margin-top: 8px; color: var(--ink); font-family: 'Ovo', serif; }
  .time-sep    { font-size: 52px; color: var(--ink); font-family: 'Ovo', serif; line-height: 1; margin-top: -40px; }

  /* ========== SCHEDULE ========== */
  #schedule { background: var(--bordeaux); width: 100%; overflow: hidden; }
  .schedule-artboard { height: 398px; }
  .schedule-title {
    position: absolute;
    top: 0; left: 320px; width: 560px;
    text-align: center;
    font-family: var(--font);
    color: var(--cream);
    font-size: 41px; font-weight: 500; line-height: 1.55;
  }
  .tl-line {
    position: absolute;
    top: 115px; left: 599px;
    width: 2px; height: 258px;
    background: rgba(255,255,255,0.5);
    opacity: 0.7;
  }
  .tl-time {
    position: absolute;
    left: 465px; width: 75px;
    color: #fff; font-family: var(--font);
    font-size: 30px; font-weight: 700; line-height: 1.55;
  }
  .tl-time-1 { top: 96px; }
  .tl-time-2 { top: 178px; }
  .tl-time-3 { top: 266px; }
  .tl-time-4 { top: 343px; left: 463px; width: 79px; }
  .tl-dot {
    position: absolute;
    left: 596px; width: 8px; height: 8px;
    background: #fff; transform: rotate(45deg); z-index: 2;
  }
  .tl-dot-1 { top: 116px; }
  .tl-dot-2 { top: 198px; }
  .tl-dot-3 { top: 286px; }
  .tl-dot-4 { top: 363px; }
  .tl-event {
    position: absolute;
    text-align: center; color: var(--cream);
    font-family: var(--font); font-size: 20px; font-weight: 400; line-height: 1.1;
  }
  .tl-event-1 { top: 98px;  left: 643px; width: 94px; }
  .tl-event-2 { top: 180px; left: 650px; width: 80px; }
  .tl-event-3 { top: 279px; left: 655px; width: 69px; }
  .tl-event-4 { top: 356px; left: 659px; width: 61px; }
  .tl-event-venue { font-size: 14px; opacity: 0.7; margin-top: 4px; }
  .pigeon-timeline {
    position: absolute;
    top: 95px; left: 573px;
    width: 55px; height: 56px;
    transition: top 0.6s ease;
    pointer-events: none; z-index: 3;
  }
  .pigeon-timeline img { width: 100%; height: 100%; object-fit: contain; display: block; }

  /* ========== LOCATION ========== */
  #location { background: var(--cream); padding: 30px 0 0; position: relative; }
  .location-inner { max-width: 1200px; margin: 0 auto; padding: 40px 20px 80px; position: relative; }
  .location-inner h2 {
    font-size: 41px; font-weight: 500; color: var(--ink);
    line-height: 1.55; text-align: center; margin-bottom: 20px;
  }
  .location-photo { display: block; width: 450px; max-width: 100%; margin: 0 auto; }
  .location-photo img { width: 100%; height: auto; display: block; }
  .location-name    { font-size: 20px; color: var(--ink); text-align: center; margin-top: 12px; }
  .location-address { font-size: 17px; color: var(--ink); text-align: center; line-height: 1.25; margin-top: 4px; }
  .location-buttons { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
  .map-btn {
    background: transparent; border: 1px solid var(--bordeaux); color: var(--bordeaux);
    padding: 0.5rem 1.5rem; text-decoration: none; border-radius: 2px; transition: all 0.2s;
  }
  .map-btn:hover { background: var(--bordeaux); color: var(--cream); }

  /* ========== FLOWERS DECO ========== */
  #flowers-deco { background: var(--cream); width: 100%; overflow: visible; position: relative; z-index: 4; height: 80px; }
  .flowers-artboard { height: 80px; }
  .flower { position: absolute; z-index: 3; pointer-events: none; }
  .flower img { width: 100%; height: auto; display: block; }
  .fl-1  { top: 10px; left: 720px; width: 181px; }
  .fl-2  { top: 28px; left: 720px; width: 55px;  }
  .fl-3  { top: 104px; left: 693px; width: 130px; }
  .fl-4  { top: 49px; left: 614px; width: 164px; }
  .fl-5  { top: 51px; left: 629px; width: 42px;  }
  .fl-6  { top: 70px; left: 552px; width: 129px; }
  .fl-7  { top: 154px; left: 624px; width: 50px;  }
  .fl-8  { top: 50px; left: 503px; width: 83px;  }
  .fl-9  { top: 97px; left: 495px; width: 118px; }
  .fl-10 { top: 79px; left: 424px; width: 118px; }
  .fl-11 { top: 46px; left: 424px; width: 83px;  }
  .fl-12 { top: 12px; left: 293px; width: 203px; }

  /* ========== INTRO VIDEO ========== */
  #intro-video-screen {
    position: fixed; inset: 0; background: #000; z-index: 9998;
    transition: opacity 0.6s ease, visibility 0.6s ease;
    overflow: hidden;
  }
  #intro-video-screen video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  #intro-video-screen.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
  .video-skip-btn {
    position: absolute; bottom: 28px; right: 28px;
    background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.4);
    color: #fff; font-family: var(--font); font-size: 1rem;
    padding: 8px 20px; border-radius: 2px; cursor: pointer; z-index: 1;
    min-height: 40px; touch-action: manipulation;
  }
  .video-skip-btn:hover { background: rgba(255,255,255,0.3); }
  @media (max-width: 768px) {
    .video-skip-btn { bottom: 20px; right: 16px; padding: 10px 18px; min-height: 44px; }
  }
  @media (max-width: 480px) {
    .video-skip-btn { bottom: 16px; right: 12px; font-size: 0.9rem; }
  }

  /* ========== RSVP ========== */
  #rsvp { background: var(--bordeaux); padding: 60px 0 30px; }
  .rsvp-inner { max-width: 680px; margin: 0 auto; padding: 0 20px; text-align: center; }
  .rsvp-inner h2   { font-size: 41px; font-weight: 500; color: var(--cream); margin-bottom: 12px; }
  .rsvp-inner > p  { font-size: 21px; color: var(--cream); margin-bottom: 24px; }
  .rsvp-form       { display: flex; flex-direction: column; gap: 1rem; }
  .rsvp-choices    { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
  .rsvp-choice {
    background: transparent; border: 1px solid var(--cream); color: var(--cream);
    padding: 0.5rem 1.2rem; cursor: pointer; border-radius: 2px; transition: all 0.2s;
  }
  .rsvp-choice.active { background: var(--cream); color: var(--bordeaux); }
  .rsvp-fields     { display: flex; flex-direction: column; gap: 0.75rem; }
  .rsvp-input {
    background: rgba(255,250,248,0.1); border: 1px solid rgba(255,250,248,0.3);
    color: var(--cream); padding: 0.8rem; border-radius: 2px;
    font-family: var(--font); font-size: 1rem;
  }
  .rsvp-input::placeholder { color: rgba(255,250,248,0.5); }
  .rsvp-textarea { min-height: 80px; resize: vertical; }
  .rsvp-submit {
    background: var(--cream); color: var(--bordeaux); border: none;
    padding: 0.8rem 2rem; font-size: 1.2rem; cursor: pointer; border-radius: 2px; transition: all 0.2s;
  }
  .rsvp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .rsvp-done { background: rgba(255,250,248,0.1); padding: 1rem; border-radius: 4px; color: var(--cream); }

  /* ========== GUESTBOOK ========== */
  #guestbook { background: var(--bordeaux); padding-top: 0; }
  .guestbook-inner { max-width: 680px; margin: 0 auto; padding: 0 1.5rem 4rem; text-align: center; }
  .guestbook-inner h2 { font-size: 41px; font-weight: 500; color: var(--cream); margin-bottom: 2rem; }
  .guestbook-list { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }
  .guestbook-card {
    position: relative;
    background: rgba(255,250,248,0.06); border: 1px solid rgba(255,250,248,0.18);
    padding: 1.2rem; border-radius: 3px; text-align: left; overflow: hidden;
  }
  .guestbook-quote {
    position: absolute; top: 6px; right: 10px;
    font-size: 1.4rem; line-height: 1; color: rgba(255,250,248,0.22);
    z-index: 0; pointer-events: none; font-family: Georgia, serif;
  }
  .guestbook-message { position: relative; z-index: 1; color: var(--cream); font-style: italic; font-size: 1rem; line-height: 1.4; }
  .guestbook-author  { margin-top: 0.5rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; color: var(--cream); text-align: right; }
  .guestbook-form    { display: flex; flex-direction: column; gap: 0.75rem; }
  .guestbook-input {
    background: rgba(255,250,248,0.1); border: 1px solid rgba(255,250,248,0.3);
    color: var(--cream); padding: 0.8rem; border-radius: 2px; font-family: var(--font);
  }
  .guestbook-textarea { min-height: 80px; }
  .guestbook-submit {
    background: rgba(255,250,248,0.12); border: 1px solid rgba(255,250,248,0.4);
    color: var(--cream); padding: 0.8rem 2rem; cursor: pointer;
    border-radius: 2px; font-family: var(--font);
  }
  .guestbook-done { color: rgba(255,250,248,0.7); font-style: italic; }

  /* ========== CLOSING ========== */
  #closing { background: var(--bordeaux); padding: 60px 0 30px; text-align: center; }
  .closing-inner { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  .closing-inner h2 { font-size: 41px; font-weight: 500; color: var(--cream); margin-bottom: 6px; }
  .closing-names  { font-size: 28px; color: var(--cream); margin-bottom: 24px; }
  .closing-photo  { position: relative; width: 450px; max-width: 100%; margin: 0 auto; }
  .closing-photo img { width: 100%; height: auto; display: block; }
  .closing-overlay-img { position: absolute; inset: 0; }

  /* ========== SEPARATOR ========== */
  .sep { display: block; width: 100%; line-height: 0; position: relative; z-index: 2; }
  .sep img { display: block; width: 100%; height: 121px; object-fit: fill; }
  .sep--down {
    background: linear-gradient(to bottom,
      var(--bordeaux) 0%, var(--bordeaux) 50%,
      var(--cream)    50%, var(--cream)    100%);
  }
  .sep--up {
    background: linear-gradient(to bottom,
      var(--cream)    0%, var(--cream)    50%,
      var(--bordeaux) 50%, var(--bordeaux) 100%);
  }
  .sep--up img { transform: rotate(180deg); }

  /* ========== AUDIO CONTROL ========== */
  .audio-control {
    position: fixed; bottom: 20px; right: 20px;
    width: 60px; height: 60px;
    background: var(--bordeaux); border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    visibility: hidden; opacity: 0; transition: opacity 0.3s ease;
  }
  .audio-control.visible { visibility: visible; opacity: 1; }
  .audio-control svg { width: 24px; height: 24px; fill: var(--cream); }

  /* ========== ANIMATIONS ========== */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.3); }
    to   { opacity: 1; transform: scale(1); }
  }
  .anim-fade-up { opacity: 0; animation: fadeInUp 2s ease forwards; }
  .anim-zoom    { opacity: 0; animation: zoomIn  2s ease forwards; }

  /* ========== FIXED HEIGHTS ========== */
  #hero          { height: 763px; }
  #schedule      { height: 398px; }

  /* ========== RESPONSIVE ========== */

  /* Hero: full-width layout on mobile — artboard calc-left doesn't center reliably on narrow screens */
  @media (max-width: 767px) {
    .hero-video-wrap,
    .hero-overlay,
    .hero-gradient,
    .hero-bottom-bar,
    .hero-wedding-day,
    .hero-date,
    .hero-names-block {
      left: 0 !important;
      width: 100% !important;
    }
    .hero-name { font-size: 64px; }
    .hero-amp  { font-size: 38px; }
    .hero-wedding-day { font-size: 34px; }
    .hero-date        { font-size: 22px; }
  }
  @media (max-width: 480px) {
    .hero-name { font-size: 52px; }
    .hero-amp  { font-size: 32px; }
  }

  @media (max-width: 768px) {
    .dear-friends-inner h2 { font-size: 28px; }
    .dear-friends-inner p  { font-size: 17px; }
    .countdown-inner h2    { font-size: 26px; }
    .time-number           { font-size: 32px; }
    .time-label            { font-size: 14px; }
    .time-sep              { font-size: 36px; margin-top: -28px; }
    .location-inner h2     { font-size: 28px; }
    .location-photo        { width: 100%; }
    .location-name         { font-size: 17px; }
    .location-address      { font-size: 15px; }
    .location-buttons      { flex-direction: column; align-items: center; }
    .rsvp-inner h2         { font-size: 28px; }
    .rsvp-inner > p        { font-size: 17px; }
    .rsvp-choices          { flex-direction: column; align-items: stretch; }
    .rsvp-choice           { text-align: center; }
    .guestbook-inner h2    { font-size: 28px; }
    .guestbook-inner       { padding: 0 1rem 3rem; }
    .guestbook-card        { padding: 1rem; }
    .guestbook-message     { font-size: 0.95rem; }
    .closing-inner h2      { font-size: 26px; }
    .closing-names         { font-size: 20px; }
    .closing-photo         { width: 100%; }
    .audio-control         { width: 48px; height: 48px; bottom: 14px; right: 14px; }
    .audio-control svg     { width: 20px; height: 20px; }
  }

  @media (max-width: 480px) {
    #dear-friends            { padding: 20px 0; }
    .dear-friends-inner h2   { font-size: 24px; }
    .dear-friends-inner p    { font-size: 15px; }
    .countdown-inner         { padding: 24px 16px 40px; }
    .countdown-inner h2      { font-size: 22px; }
    .time-number             { font-size: 26px; }
    .time-label              { font-size: 12px; }
    .time-sep                { font-size: 28px; margin-top: -22px; }
    .countdown-timer         { gap: 3px; }
    .rsvp-inner h2           { font-size: 24px; }
    .rsvp-inner > p          { font-size: 15px; }
    .guestbook-inner h2      { font-size: 24px; }
    .guestbook-message       { font-size: 0.9rem; }
    .guestbook-author        { font-size: 0.72rem; }
    .closing-inner h2        { font-size: 22px; }
    .closing-names           { font-size: 17px; }
    .location-inner          { padding: 24px 16px 50px; }
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// POSITIONING CSS (Tilda-faithful responsive model)
// Chaque élément d'artboard est ancré au centre du viewport :
//   left: calc(50% - HALF + offset)
// HALF = moitié du canvas de référence selon le breakpoint (600/480/320/240/160).
// Colonnes : [selector, desktop, res960, res640, res480, res320]
// ─────────────────────────────────────────────────────────────────────────────
const POS: [string, number, number, number, number, number][] = [
  // --- Hero ---
  ['.hero-video-wrap',  380,  260,  100,   20,  -60],
  ['.hero-overlay',     380,  260,  100,   20,  -60],
  ['.hero-gradient',    303,  167,    7,  -73, -137],
  ['.hero-bottom-bar',  303,  157,   -3,  -83, -137],
  ['.hero-wedding-day', 320,  200,   40,  -40, -120],
  ['.hero-date',        320,  200,   40,  -40, -120],
  ['.hero-names-block', 320,  200,   40,  -40, -120],
  ['.ruby-1',           660,  540,  380,  300,  220],
  ['.ruby-2',           632,  512,  352,  272,  192],
  ['.ruby-4',           495,  375,  215,  135,   55],
  ['.ruby-6d',          414,  294,  134,   54,  -26],
  ['.ruby-7u',          457,  337,  177,   97,   17],
  ['.ruby-8',           344,  224,   64,  -16,  -96],
  ['.ruby-nr',          547,  427,  267,  187,  107],
  // --- Schedule ---
  ['.schedule-title',   320,  200,   40,  -40, -120],
  ['.tl-time-1',        465,  345,  185,  105,   25],
  ['.tl-time-2',        465,  345,  185,  105,   25],
  ['.tl-time-3',        465,  345,  185,  105,   25],
  ['.tl-time-4',        463,  343,  183,  103,   23],
  ['.tl-event-1',       643,  523,  363,  283,  203],
  ['.tl-event-2',       650,  530,  370,  290,  210],
  ['.tl-event-3',       655,  535,  375,  295,  215],
  ['.tl-event-4',       659,  539,  379,  299,  219],
  ['.tl-line',          599,  479,  319,  239,  159],
  ['.tl-dot-1',         596,  476,  316,  236,  156],
  ['.tl-dot-2',         596,  476,  316,  236,  156],
  ['.tl-dot-3',         596,  476,  316,  236,  156],
  ['.tl-dot-4',         596,  476,  316,  236,  156],
  ['.pigeon-timeline',  573,  453,  293,  213,  133],
  // --- Flowers deco ---
  ['.fl-1',             720,  600,  441,  360,  280],
  ['.fl-2',             720,  600,  441,  360,  280],
  ['.fl-3',             693,  573,  414,  333,  253],
  ['.fl-4',             614,  494,  335,  254,  174],
  ['.fl-5',             629,  509,  350,  269,  189],
  ['.fl-6',             552,  432,  273,  192,  112],
  ['.fl-7',             624,  504,  345,  264,  184],
  ['.fl-8',             503,  383,  224,  143,   63],
  ['.fl-9',             495,  375,  216,  135,   55],
  ['.fl-10',            424,  304,  145,   64,  -16],
  ['.fl-11',            424,  304,  145,   64,  -16],
  ['.fl-12',            293,  173,   14,  -67, -147],
]

// [maxWidth, half] — miroir des canvas Tilda 1200/960/640/480/320
const BREAKPOINTS: [number, number][] = [
  [1199, 480],
  [959,  320],
  [639,  240],
  [479,  160],
]

const POS_CSS = (() => {
  // Desktop ≥ 1200px : canvas 1200 → half = 600
  let css = POS.map(([sel, d]) => `${sel}{left:calc(50% - ${600 - d}px);}`).join('')
  BREAKPOINTS.forEach(([mq, half], i) => {
    const rules = POS.map((p) => `${p[0]}{left:calc(50% - ${half - (p[i + 2] as number)}px);}`).join('')
    css += `@media (max-width:${mq}px){${rules}}`
  })
  return css
})()