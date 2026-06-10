'use client'

import { useState, useEffect, useRef } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'

export default function AlexaRichard({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate,
  } = useInvitationLogic(wedding)

  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [allScratched, setAllScratched] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const scheduleRef = useRef<HTMLDivElement>(null)
  const dearRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const scratchDoneRef = useRef([false, false, false])

  const day   = String(eventDate.getDate())
  const month = eventDate.toLocaleDateString('en-GB', { month: 'long' })
  const year  = String(eventDate.getFullYear())

  const GALLERY = [
    '/assets/alexa-richard/gallery/01.png',
    '/assets/alexa-richard/gallery/02.png',
    '/assets/alexa-richard/gallery/03.jpg',
    '/assets/alexa-richard/gallery/04.jpg',
    '/assets/alexa-richard/gallery/05.jpg',
    '/assets/alexa-richard/gallery/06.jpg',
    '/assets/alexa-richard/gallery/07.jpg',
    '/assets/alexa-richard/gallery/08.jpg',
    '/assets/alexa-richard/gallery/09.jpg',
    '/assets/alexa-richard/gallery/10.jpg',
  ]

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

  useEffect(() => {
    function scaleOpening() {
      const stage = document.querySelector<HTMLElement>('.ar-opening-stage')
      if (!stage) return
      const PAPER_H = 580
      const scale = window.innerWidth >= 1200 ? 1 : window.innerHeight / PAPER_H
      stage.style.setProperty('--os-scale', String(scale.toFixed(4)))
    }
    scaleOpening()
    window.addEventListener('resize', scaleOpening)
    return () => window.removeEventListener('resize', scaleOpening)
  }, [])

  // Scroll-linked reveals: Dear (letter sliding out of the envelope) + Schedule (leaves parting)
  useEffect(() => {
    function progressFor(el: HTMLElement | null) {
      if (!el) return 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 0 when the section's top is at the bottom of the viewport,
      // 1 when the section's center has reached the viewport's center.
      const start = vh
      const end = vh / 2 - r.height / 2
      const span = start - end || 1
      const p = (start - r.top) / span
      return Math.max(0, Math.min(1, p))
    }
    function onScroll() {
      const dp = progressFor(dearRef.current)
      if (dearRef.current) dearRef.current.style.setProperty('--dear-p', dp.toFixed(4))
      const sp = progressFor(scheduleRef.current)
      if (scheduleRef.current) scheduleRef.current.style.setProperty('--sched-p', sp.toFixed(4))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [opened, visible])

  useEffect(() => {
    if (!opened || allScratched) return

    const tileIds = ['ar-tile-day', 'ar-tile-month', 'ar-tile-year']

    function paintChampagne(ctx: CanvasRenderingContext2D, w: number, h: number) {
      const base = ctx.createLinearGradient(0, 0, w, h)
      base.addColorStop(0,    '#dce8ee')
      base.addColorStop(0.25, '#d2dfe6')
      base.addColorStop(0.55, '#c8d7df')
      base.addColorStop(0.8,  '#d0dde5')
      base.addColorStop(1,    '#c4d3dc')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)

      const hl = ctx.createRadialGradient(w * 0.28, h * 0.24, 0, w * 0.28, h * 0.24, w * 0.65)
      hl.addColorStop(0,    'rgba(240,248,252,0.65)')
      hl.addColorStop(0.45, 'rgba(230,242,248,0.22)')
      hl.addColorStop(1,    'rgba(230,242,248,0)')
      ctx.fillStyle = hl
      ctx.fillRect(0, 0, w, h)

      ctx.globalAlpha = 0.10
      for (let i = -h; i < w + h; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + h * 0.75, h)
        ctx.strokeStyle = '#eef4f8'; ctx.lineWidth = 9; ctx.stroke()
      }
      ctx.globalAlpha = 1

      ctx.strokeStyle = 'rgba(220,238,248,0.45)'; ctx.lineWidth = 1.5
      ctx.strokeRect(0.75, 0.75, w - 1.5, h - 1.5)
    }

    tileIds.forEach((tileId, idx) => {
      const tile = document.getElementById(tileId)
      const cvs  = document.createElement('canvas')
      if (!tile) return
      cvs.style.cssText = 'position:absolute;inset:0;border-radius:12px;touch-action:none;cursor:pointer;width:100%;height:100%;'
      tile.style.position = 'relative'
      tile.appendChild(cvs)
      const ctx = cvs.getContext('2d')!
      let isDone  = false
      let isDown  = false

      function resize() {
        const r = tile!.getBoundingClientRect()
        cvs.width  = Math.round(r.width)
        cvs.height = Math.round(r.height)
        if (!isDone) paintChampagne(ctx, cvs.width, cvs.height)
      }
      resize()
      window.addEventListener('resize', resize)
      setTimeout(resize, 200)
      setTimeout(resize, 600)

      function canvasXY(cx: number, cy: number) {
        const r = cvs.getBoundingClientRect()
        return { x: (cx - r.left) * (cvs.width / r.width), y: (cy - r.top) * (cvs.height / r.height) }
      }
      function scratchAt(x: number, y: number) {
        if (isDone) return
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath(); ctx.arc(x, y, 36, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,0,1)'; ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
        checkDone()
      }
      function checkDone() {
        if (Math.random() > 0.12) return
        const d = ctx.getImageData(0, 0, cvs.width, cvs.height).data
        let vis = 0, tot = 0
        for (let i = 3; i < d.length; i += 12) { tot++; if (d[i] > 10) vis++ }
        if ((tot - vis) / tot > 0.40) finishPanel()
      }
      function finishPanel() {
        if (isDone) return
        isDone = true
        let a = 1
        const fade = setInterval(() => {
          a -= 0.055
          if (a <= 0) {
            clearInterval(fade); cvs.style.display = 'none'
          } else {
            ctx.clearRect(0, 0, cvs.width, cvs.height)
            ctx.globalAlpha = Math.max(0, a)
            paintChampagne(ctx, cvs.width, cvs.height)
            ctx.globalAlpha = 1
          }
        }, 22)
        scratchDoneRef.current[idx] = true
        if (scratchDoneRef.current.every(Boolean)) {
          setTimeout(() => setAllScratched(true), 550)
        }
      }

      cvs.addEventListener('mousedown',  e => { isDown = true; const p = canvasXY(e.clientX, e.clientY); scratchAt(p.x, p.y) })
      cvs.addEventListener('mousemove',  e => { if (!isDown) return; const p = canvasXY(e.clientX, e.clientY); scratchAt(p.x, p.y) })
      cvs.addEventListener('mouseup',    () => { isDown = false })
      cvs.addEventListener('mouseleave', () => { isDown = false })
      cvs.addEventListener('touchstart', e => { e.preventDefault(); isDown = true; const t = e.touches[0]; const p = canvasXY(t.clientX, t.clientY); scratchAt(p.x, p.y) }, { passive: false })
      cvs.addEventListener('touchmove',  e => { e.preventDefault(); if (!isDown) return; const t = e.touches[0]; const p = canvasXY(t.clientX, t.clientY); scratchAt(p.x, p.y) }, { passive: false })
      cvs.addEventListener('touchend',   e => { e.preventDefault(); isDown = false }, { passive: false })
    })
  }, [opened])

  const defaultProgram: ProgramItem[] = [
    { time: '16:30', event: 'Opening of the doors' },
    { time: '17:00', event: 'Ceremony' },
    { time: '18:00', event: 'Cocktail & dancing' },
    { time: '20:00', event: 'Dinner' },
    { time: '21:00', event: 'Party & Open Bar' },
    { time: '23:00', event: 'End of celebration' },
  ]
  const program = (wedding.program && wedding.program.length > 0) ? wedding.program : defaultProgram

  const AudioControl = () => {
    const [playing, setPlaying] = useState(false)
    useEffect(() => setPlaying(audioPlaying), [audioPlaying])
    const toggle = () => {
      if (audioRef.current) {
        if (audioPlaying) { audioRef.current.pause() } else { audioRef.current.play().catch(() => {}) }
        setAudioPlaying(!audioPlaying)
        setPlaying(!audioPlaying)
      }
    }
    if (!visible) return null
    return (
      <button className="ar-audio-control" onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'}>
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
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Rufina:wght@400;700&family=Imperial+Script&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <style>{POS_CSS}</style>
      <FontOverride font={wedding.custom_font} container="#ar-main" />

      <audio ref={audioRef} loop src="/assets/alexa-richard/audio/music.mp3" preload="auto" />

      {/* ─── OPENING SCREEN ─── */}
      {!opened && (
        <div id="ar-opening" className={phase >= 2 ? 'ar-hidden' : ''}>
          <div
            className={`ar-opening-stage${phase >= 1 ? ' ar-animating' : ''}`}
            onClick={startSequence}
            role="button"
            tabIndex={0}
            aria-label="Open invitation"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startSequence() }}
          >
            <img className="ar-poly ar-poly-left"  src="/assets/alexa-richard/polygons/polygon-left.png"   alt="" />
            <img className="ar-poly ar-poly-right" src="/assets/alexa-richard/polygons/polygon-right.png"  alt="" />
            <img className="ar-poly ar-poly-top"   src="/assets/alexa-richard/polygons/polygon-top.png"    alt="" />
            <img className="ar-poly ar-poly-bot"   src="/assets/alexa-richard/polygons/polygon-bottom.png" alt="" />
            <button className="ar-seal-btn" tabIndex={-1} aria-hidden="true">
              <img src="/assets/alexa-richard/polygons/seal-center.png" alt="" />
            </button>
            <span className="ar-click-hint">Click to open</span>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div id="ar-main" className={`ar-page${visible ? ' ar-visible' : ''}`}>
        <AudioControl />

        {/* ── HERO ── */}
        <div id="ar-hero">
          <div className="ar-artboard ar-hero-artboard">
            <div className="ar-hero-video-wrap">
              <video autoPlay muted loop playsInline>
                <source src="/assets/alexa-richard/video/hero.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="ar-hero-overlay"></div>
            <div className="ar-hero-fade-bottom"></div>
            <div className="ar-hero-text ar-hero-names ar-anim-up" style={{ animationDelay: '3.2s' }}>
              {wedding.bride_name} &amp; {wedding.groom_name}
            </div>
            <div className="ar-hero-text ar-hero-sub ar-anim-up" style={{ animationDelay: '3.35s' }}>
              are getting married!
            </div>
          </div>
        </div>

        {/* ── THE DATE (Scratch-to-reveal) ── */}
        <div id="ar-date">
          <div className="ar-date-inner">
            <h2 className="ar-date-title">The Date</h2>
            <p className="ar-date-hint">… Scratch to reveal the date …</p>
            <div className="ar-scratch-panels">
              {[{ label: 'Day', value: day }, { label: 'Month', value: month }, { label: 'Year', value: year }].map((item, idx) => (
                <div className="ar-scratch-panel" key={idx}>
                  <div className="ar-scratch-tile" id={['ar-tile-day', 'ar-tile-month', 'ar-tile-year'][idx]}>
                    <div className="ar-tile-bg">
                      <span className={`ar-tile-num${idx === 1 ? ' ar-tile-month' : ''}`}>{item.value}</span>
                    </div>
                  </div>
                  <div className="ar-tile-label">{item.label}</div>
                </div>
              ))}
            </div>
            {allScratched && (
              <div className="ar-scratch-reveal">You&apos;re invited!</div>
            )}
          </div>
        </div>

        {/* ── COUNTDOWN ── */}
        <div id="ar-countdown">
          <div className="ar-countdown-inner">
            <h2>The Celebration Begins In</h2>
            <div className="ar-countdown-timer">
              <div className="ar-time-block"><div className="ar-time-num">{countdown.d}</div><div className="ar-time-label">Days</div></div>
              <div className="ar-time-sep">:</div>
              <div className="ar-time-block"><div className="ar-time-num">{countdown.h}</div><div className="ar-time-label">Hours</div></div>
              <div className="ar-time-sep">:</div>
              <div className="ar-time-block"><div className="ar-time-num">{countdown.m}</div><div className="ar-time-label">Minutes</div></div>
              <div className="ar-time-sep">:</div>
              <div className="ar-time-block"><div className="ar-time-num">{countdown.s}</div><div className="ar-time-label">Seconds</div></div>
            </div>
          </div>
        </div>

        {/* ── DEAR FRIENDS ── */}
        <div id="ar-dear">
          <div className="ar-artboard ar-dear-artboard" ref={dearRef}>
            <img className="ar-dear-hearts" src="/assets/alexa-richard/dear/heart-outline.png" alt="" />
            <div className="ar-dear-box">
              <h2 className="ar-dear-title">Dear friends and family,</h2>
              <p className="ar-dear-text">
                {wedding.custom_message ||
                  `As we get ready to say "I do," we feel grateful for the wonderful people in our lives.\n\nYour support means the world to us, and we would be honored to have you with us as we begin our life together.`}
              </p>
            </div>
            <img className="ar-dear-envelope" src="/assets/alexa-richard/dear/envelope-old.png" alt="" />
          </div>
        </div>

        {/* ── SCHEDULE ── */}
        {program.length > 0 && (
          <div id="ar-schedule">
            <div className="ar-artboard ar-sched-artboard" ref={scheduleRef}>
              <div className="ar-sched-title">Schedule of Events</div>

              <img className="ar-sched-leaves ar-leaves-1" src="/assets/alexa-richard/schedule/leaves-1.png" alt="" />
              <img className="ar-sched-leaves ar-leaves-2" src="/assets/alexa-richard/schedule/leaves-2.png" alt="" />

              <div className="ar-tl-line"></div>

              {program.slice(0, 6).map((item, idx) => {
                const isRight = idx % 2 === 0
                return (
                  <div key={idx}>
                    <div className={`ar-tl-dot ar-tl-dot-${idx + 1}`}></div>
                    <div className={`ar-sched-evt ${isRight ? 'ar-evt-r' : 'ar-evt-l'} ar-evt-${idx + 1}`}>
                      <div className="ar-evt-time">{item.time}</div>
                      <div className="ar-evt-label">{item.event}</div>
                      {item.venue && <div className="ar-evt-venue">{item.venue}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── VENUE ── */}
        <div id="ar-venue">
          <div className="ar-venue-inner">
            <h2 className="ar-venue-title">Wedding Venue</h2>
            <div className="ar-venue-photo-wrap">
              <img
                src="/assets/alexa-richard/venue/photo.jpg"
                alt={wedding.venue_name || 'Wedding Venue'}
                className="ar-venue-photo"
                onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22440%22 height=%22580%22%3E%3Crect fill=%22%23e8eff3%22 width=%22440%22 height=%22580%22/%3E%3C/svg%3E' }}
              />
              <div className="ar-venue-fade"></div>
            </div>
            <div className="ar-venue-info">
              <div className="ar-venue-pin">
                <img src="/assets/alexa-richard/venue/pin.png" alt="" />
              </div>
              <div>
                <p className="ar-venue-name">{wedding.venue_name || 'Villa Borghese'}</p>
                {wedding.venue_address && <p className="ar-venue-addr">{wedding.venue_address}</p>}
              </div>
            </div>
            {(wedding.gps_google || wedding.gps_apple) && (
              <div className="ar-venue-btns">
                {wedding.gps_google && <a className="ar-map-btn" href={wedding.gps_google} target="_blank" rel="noopener noreferrer">Google Maps</a>}
                {wedding.gps_apple  && <a className="ar-map-btn" href={wedding.gps_apple}  target="_blank" rel="noopener noreferrer">Apple Maps</a>}
              </div>
            )}
          </div>
        </div>

        {/* ── DRESS CODE ── */}
        <div id="ar-dress">
          <div className="ar-dress-inner">
            <h2 className="ar-dress-title">Dress Code</h2>
            <p className="ar-dress-desc">We would be very happy if your outfit is in the colours of our wedding theme.</p>

            <div className="ar-dress-arrow-wrap">
              <img className="ar-dress-arrow" src="/assets/alexa-richard/dress/arrow.png" alt="" />
            </div>

            <div className="t1148__gallery ar-dress-gallery">
              <div
                className="t1148__slider ar-dress-track"
                ref={galleryRef}
                onMouseDown={(e) => {
                  const el = galleryRef.current
                  if (!el) return
                  el.classList.add('t1148__slider_dragging')
                  const startX = e.pageX - el.offsetLeft
                  const startScroll = el.scrollLeft
                  let moved = false
                  const onMove = (ev: MouseEvent) => {
                    const x = ev.pageX - el.offsetLeft
                    if (Math.abs(x - startX) > 5) moved = true
                    el.scrollLeft = startScroll - (x - startX)
                  }
                  const onUp = () => {
                    el.classList.remove('t1148__slider_dragging')
                    window.removeEventListener('mousemove', onMove)
                    window.removeEventListener('mouseup', onUp)
                    if (moved) {
                      const onClickCapture = (ev: MouseEvent) => { ev.preventDefault(); ev.stopPropagation() }
                      el.addEventListener('click', onClickCapture, { capture: true, once: true })
                    }
                  }
                  window.addEventListener('mousemove', onMove)
                  window.addEventListener('mouseup', onUp)
                }}
              >
                {GALLERY.map((src, i) => (
                  <div key={i} className="t1148__item ar-dress-item">
                    <div className="t1148__img-wrapper ar-dress-img-wrapper">
                      <img className="t1148__img ar-dress-slide" src={src} alt="" draggable={false} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="t1148__controls t1148__controls_gallery">
                <button
                  className="t1148__control t1148__control_md ar-dress-nav ar-dress-prev"
                  onClick={() => galleryRef.current?.scrollBy({ left: -((galleryRef.current.querySelector('.ar-dress-item') as HTMLElement)?.offsetWidth || 0), behavior: 'smooth' })}
                  aria-label="Previous"
                >&#8249;</button>
                <button
                  className="t1148__control t1148__control_md t1148__control_right ar-dress-nav ar-dress-next"
                  onClick={() => galleryRef.current?.scrollBy({ left: (galleryRef.current.querySelector('.ar-dress-item') as HTMLElement)?.offsetWidth || 0, behavior: 'smooth' })}
                  aria-label="Next"
                >&#8249;</button>
              </div>
            </div>

            <div className="ar-swatches">
              {['#faf1db','#f5d9b1','#f2cac9','#afcff1','#7ebbfa'].map((c, i) => (
                <div key={i} className="ar-swatch" style={{ background: c }}></div>
              ))}
            </div>
            <p className="ar-dress-note">
              <strong>Ladies:</strong> Elegant summer dresses in pastel tones.<br/>
              <strong>Gentlemen:</strong> Suits or shirts in grey, blue, brown or beige.
            </p>
          </div>
        </div>

        {/* ── RSVP ── */}
        {wedding.show_rsvp && (
          <div id="ar-rsvp">
            <div className="ar-rsvp-inner">
              <h2>Confirm Your Attendance</h2>
              <p>To help us prepare for a joyful celebration, kindly confirm your attendance.</p>
              {rsvpStatus === 'done' ? (
                <div className="ar-rsvp-done">Thank you! We look forward to celebrating with you. 🎉</div>
              ) : (
                <form className="ar-rsvp-form" onSubmit={submitRSVP}>
                  <div className="ar-rsvp-choices">
                    {(['present', 'absent', 'maybe'] as const).map(s => (
                      <button key={s} type="button"
                        className={`ar-rsvp-choice${rsvpChoice === s ? ' ar-active' : ''}`}
                        onClick={() => setRsvpChoice(s)}>
                        {s === 'present' ? '✓ Attending' : s === 'absent' ? "✗ Can't make it" : '? To be confirmed'}
                      </button>
                    ))}
                  </div>
                  <div className="ar-rsvp-fields">
                    <input className="ar-rsvp-input" name="name"   placeholder="Your name" required />
                    <input className="ar-rsvp-input" name="phone"  placeholder="WhatsApp (optional)" />
                    <input className="ar-rsvp-input" name="guests" type="number" min="0" max="20" placeholder="Number of guests" />
                    <input className="ar-rsvp-input" name="food"   placeholder="Food intolerances (optional)" />
                    <textarea className="ar-rsvp-input ar-rsvp-textarea" name="note" placeholder="A word for the couple (optional)" />
                  </div>
                  <button type="submit" className="ar-rsvp-submit" disabled={rsvpStatus === 'loading'}>
                    {rsvpStatus === 'loading' ? 'Submitting…' : 'RSVP'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── GUESTBOOK ── */}
        {wedding.show_guestbook && (
          <div id="ar-guestbook">
            <div className="ar-gb-inner">
              <h2>Wishes &amp; Messages</h2>
              {messages.length > 0 && (
                <div className="ar-gb-list">
                  {messages.map(m => (
                    <div key={m.id} className="ar-gb-card">
                      <span className="ar-gb-quote">"</span>
                      <p className="ar-gb-message">{m.message}</p>
                      <p className="ar-gb-author">— {m.author_name}</p>
                    </div>
                  ))}
                </div>
              )}
              {gbStatus === 'done' ? (
                <p className="ar-gb-done">{gbPending ? 'Your message will be published after review.' : 'Your message has been published. Thank you!'}</p>
              ) : (
                <form className="ar-gb-form" onSubmit={submitMessage}>
                  <input    className="ar-gb-input"               name="author_name" placeholder="Your first name"                    required />
                  <textarea className="ar-gb-input ar-gb-textarea" name="message"    placeholder="Leave a sweet note for the couple…" required />
                  <button type="submit" className="ar-gb-submit" disabled={gbStatus === 'loading'}>
                    {gbStatus === 'loading' ? 'Sending…' : 'Send my message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ── CLOSING ── */}
        <div id="ar-closing">
          <div className="ar-closing-inner">
            <h2 className="ar-closing-title">Hope to see you there!</h2>
            <p className="ar-closing-names">{wedding.bride_name} &amp; {wedding.groom_name}</p>
            <div className="ar-closing-photo-wrap">
              <img
                src="/assets/alexa-richard/closing/couple.jpg"
                alt="The couple"
                className="ar-closing-photo"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <img className="ar-closing-deco" src="/assets/alexa-richard/closing/heart-small.png" alt="" />
              <div className="ar-closing-fade"></div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="ar-footer">
          <p>✦ {wedding.bride_name} &amp; {wedding.groom_name}&nbsp;&nbsp;·&nbsp;&nbsp;{day} {month} {year} ✦</p>
          <p className="ar-footer-credit">Élégance Digitale</p>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --ar-cream:     #fffdfb;
    --ar-dark:      #3a3a3a;
    --ar-gray:      #4a4a4a;
    --ar-blue:      #64a0bd;
    --ar-blue-soft: #7a9aaa;
    --ar-blue-deep: #52839c;
    --ar-btn:       #9bc9e1;
    --ar-font:      'Cormorant Garamond', Georgia, serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--ar-cream);
    font-family: var(--ar-font);
    color: var(--ar-dark);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  .ar-artboard {
    position: relative;
    width: 100%;
    margin: 0;
  }

  #ar-opening {
    position: fixed;
    inset: 0;
    background: var(--ar-cream);
    z-index: 9999;
    overflow: hidden;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  }
  #ar-opening.ar-hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
  .ar-opening-stage {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1200px;
    height: 850px;
    cursor: pointer;
    --os-scale: 1;
    transform: translate(-50%, -50%) scale(var(--os-scale));
    transform-origin: center center;
  }
  .ar-poly {
    position: absolute;
    pointer-events: none;
    transition: transform 2s ease, opacity 0.5s ease;
  }
  .ar-poly-left  { top: -13px; left: 98px;  width: 467px; height: auto; }
  .ar-poly-right { top: -13px; left: 635px; width: 467px; height: auto; }
  .ar-poly-top   { top: -6px;  left: 94px;  width: 1012px; height: auto; }
  .ar-poly-bot   { top: 271px; left: 95px;  width: 1011px; height: auto; }
  .ar-opening-stage.ar-animating .ar-poly-left  { transform: translateX(-560px); opacity: 0; }
  .ar-opening-stage.ar-animating .ar-poly-right { transform: translateX(560px);  opacity: 0; }
  .ar-opening-stage.ar-animating .ar-poly-top   { transform: translateY(-430px); }
  .ar-opening-stage.ar-animating .ar-poly-bot   { transform: translateY(566px); }

  .ar-seal-btn {
    position: absolute;
    top: 283px; left: 480px;
    width: 241px; height: 241px;
    cursor: pointer;
    border: none; background: none; padding: 0;
    transition: transform 1.5s ease, opacity 1s ease;
  }
  .ar-seal-btn img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .ar-opening-stage.ar-animating .ar-seal-btn { transform: scale(1.22); opacity: 0; }

  .ar-click-hint {
    position: absolute;
    top: 478px; left: 535px;
    width: 130px;
    text-align: center;
    color: var(--ar-blue-deep);
    font-family: var(--ar-font);
    font-size: 20px;
    pointer-events: none;
    transition: opacity 1.5s ease;
    animation: ar-pulse 2s ease-in-out infinite;
  }
  .ar-opening-stage.ar-animating .ar-click-hint { opacity: 0; }
  @keyframes ar-pulse { 0%,100%{opacity:.6;} 50%{opacity:1;} }

  .ar-page {
    opacity: 0;
    transition: opacity 1.2s ease;
    background: var(--ar-cream);
  }
  .ar-page.ar-visible { opacity: 1; }

  /* ── HERO ── */
  #ar-hero {
    background: var(--ar-cream);
    width: 100%;
    overflow: hidden;
  }
  .ar-hero-artboard { height: 782px; }

  .ar-hero-video-wrap {
    position: absolute;
    top: 0; left: 380px;
    width: 440px; height: 782px;
    z-index: 1; overflow: hidden;
  }
  .ar-hero-video-wrap video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ar-hero-overlay {
    position: absolute;
    top: 0; left: 380px;
    width: 440px; height: 782px;
    background: rgba(255,253,251,0.10);
    z-index: 2;
  }
  .ar-hero-fade-bottom {
    position: absolute;
    top: 474px; left: 380px;
    width: 440px; height: 308px;
    background: linear-gradient(to top, rgba(255,253,251,1) 0%, rgba(255,253,251,0) 100%);
    z-index: 3;
  }
  .ar-hero-text {
    position: absolute;
    text-align: center;
    color: var(--ar-gray);
    z-index: 4;
    font-family: var(--ar-font);
    text-shadow: 0 0 9px rgba(255,255,255,1);
  }
  .ar-hero-names {
    top: 250px; left: 320px;
    width: 560px;
    font-size: 45px; font-weight: 500; line-height: 1.55;
  }
  .ar-hero-sub {
    top: 310px; left: 430px;
    width: 340px;
    font-size: 22px; font-weight: 400; line-height: 1.15;
  }
  @keyframes ar-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ar-anim-up { opacity: 0; animation: ar-fade-up 2s ease forwards; }

  /* ── DEAR FRIENDS ── */
  #ar-dear {
    background: var(--ar-cream);
    width: 100%;
    overflow: hidden;
  }
  .ar-dear-artboard {
    height: 670px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 0;
  }

  /* small heart doodle, centered above the letter */
  .ar-dear-hearts {
    width: 90px; height: auto;
    margin-bottom: 14px;
    opacity: var(--dear-p, 0);
    transform: translateY(calc((1 - var(--dear-p, 0)) * 24px));
    transition: opacity 0.25s ease-out, transform 0.25s ease-out;
    animation: ar-bob 2.5s ease-in-out infinite;
  }

  /* the letter card: sits centered, its bottom portion tucked behind the envelope's front flap */
  .ar-dear-box {
    position: relative;
    width: 302px; height: 327px;
    margin-bottom: -210px; /* pulled down so the envelope flap covers its lower part */
    background: #fff;
    box-shadow: -7px -7px 19px 0 rgba(42,38,38,0.09);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 28px 24px;
    text-align: center;
    z-index: 3;
    transform-origin: bottom center;
    transform:
      translateY(calc((1 - var(--dear-p, 0)) * 130px))
      scale(calc(0.85 + var(--dear-p, 0) * 0.15));
    opacity: calc(0.25 + var(--dear-p, 0) * 0.75);
    transition: transform 0.25s ease-out, opacity 0.25s ease-out;
    will-change: transform, opacity;
  }

  /* envelope: sits at the bottom, full width, in front of the letter */
  .ar-dear-envelope {
    position: relative;
    width: 100%; max-width: 490px; height: auto;
    pointer-events: none;
    z-index: 6;
  }

  @keyframes ar-bob { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }

  .ar-dear-title {
    font-size: 28px;
    font-weight: 500;
    color: var(--ar-dark);
    margin-bottom: 18px;
    line-height: 1.3;
  }
  .ar-dear-text {
    font-size: 18px;
    color: var(--ar-dark);
    line-height: 1.45;
    white-space: pre-line;
  }

  /* ── DATE / SCRATCH ── */
  #ar-date {
    background: var(--ar-cream);
    padding: 40px 0 50px;
  }
  .ar-date-inner {
    max-width: 540px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }
  .ar-date-title {
    font-size: 41px; font-weight: 500; color: var(--ar-dark);
    line-height: 1.55; margin-bottom: 4px;
  }
  .ar-date-hint {
    font-size: 17px; color: var(--ar-blue-soft); margin-bottom: 20px;
  }
  .ar-scratch-panels {
    display: flex; gap: 10px; justify-content: center;
    width: 100%; max-width: 460px; margin: 0 auto 12px;
  }
  .ar-scratch-panel {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .ar-scratch-tile {
    position: relative; width: 90%; aspect-ratio: 1 / 1.15;
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 2px 16px rgba(100,160,189,0.15), 0 1px 3px rgba(0,0,0,0.05);
    cursor: pointer;
  }
  .ar-tile-bg {
    position: absolute; inset: 0;
    background: #fff; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .ar-tile-num {
    font-family: 'Rufina', serif;
    font-size: clamp(26px, 6.5vw, 38px);
    color: var(--ar-dark); line-height: 1;
    user-select: none; pointer-events: none;
  }
  .ar-tile-month { font-size: clamp(16px, 4vw, 24px); }
  .ar-tile-label {
    font-family: 'Rufina', serif;
    font-size: clamp(9px, 2vw, 11px); letter-spacing: 4px;
    color: var(--ar-blue-soft); text-transform: uppercase; text-align: center;
  }
  .ar-scratch-reveal {
    font-family: 'Imperial Script', cursive;
    font-size: clamp(28px, 7vw, 36px); color: var(--ar-dark); text-align: center;
    animation: ar-reveal-in 1.1s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes ar-reveal-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── COUNTDOWN ── */
  #ar-countdown {
    background: var(--ar-cream);
    padding: 30px 0 50px;
    border-top: 1px solid rgba(100,160,189,0.15);
    border-bottom: 1px solid rgba(100,160,189,0.15);
  }
  .ar-countdown-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 30px 20px 40px; text-align: center;
  }
  .ar-countdown-inner h2 {
    font-size: 33px; font-weight: 500; color: var(--ar-dark);
    line-height: 1.55; margin-bottom: 20px;
  }
  .ar-countdown-timer {
    display: flex; justify-content: center; align-items: center;
    gap: 8px; margin-top: 16px;
  }
  .ar-time-block { text-align: center; }
  .ar-time-num   { font-size: 48px; color: var(--ar-blue-deep); font-weight: 600; }
  .ar-time-label { font-size: 16px; margin-top: 6px; color: var(--ar-gray); letter-spacing: 1px; }
  .ar-time-sep   { font-size: 52px; color: var(--ar-blue); font-weight: 300; line-height: 1; margin-top: -36px; }

  /* ── SCHEDULE ── */
  #ar-schedule {
    background: var(--ar-cream);
    width: 100%;
    overflow: hidden;
    padding-top: 45px;
  }
  .ar-sched-artboard { height: 620px; }
  .ar-sched-title {
    position: absolute;
    top: 0; left: 320px; width: 560px;
    text-align: center;
    font-family: var(--ar-font);
    color: var(--ar-dark);
    font-size: 41px; font-weight: 500; line-height: 1.55;
  }
  .ar-sched-leaves {
    position: absolute;
    left: 122px; width: 957px; height: auto;
    display: block;
    opacity: 0.85;
    z-index: 5;                 /* in FRONT of the programme so they cover it, then part */
    pointer-events: none;
    transition: transform 0.08s linear;
    will-change: transform;
  }
  /* --sched-p: 0 = closed (covers programme), 1 = fully parted. Matches Tilda mx +700 / -690 */
  .ar-leaves-1 { top: 69px;  transform: translateX(calc(var(--sched-p, 1) * 700px)); }
  .ar-leaves-2 { top: 200px; transform: translateX(calc(var(--sched-p, 1) * -690px)); }
  @keyframes ar-drift-r { from{transform:translateX(0);} to{transform:translateX(40px);} }
  @keyframes ar-drift-l { from{transform:translateX(0);} to{transform:translateX(-40px);} }

  .ar-tl-line {
    position: absolute;
    top: 130px; left: 598px;
    width: 4px; height: 424px;
    background: var(--ar-blue);
    opacity: 0.6; z-index: 2; border-radius: 2px;
  }
  .ar-tl-dot {
    position: absolute;
    left: 595px; width: 10px; height: 10px;
    background: var(--ar-blue); transform: rotate(45deg); z-index: 3;
  }
  .ar-tl-dot-1 { top: 133px; }
  .ar-tl-dot-2 { top: 209px; }
  .ar-tl-dot-3 { top: 285px; }
  .ar-tl-dot-4 { top: 361px; }
  .ar-tl-dot-5 { top: 437px; }
  .ar-tl-dot-6 { top: 513px; }

  .ar-sched-evt {
    position: absolute; z-index: 3;
    font-family: var(--ar-font); color: var(--ar-dark); text-align: center;
  }
  .ar-evt-time  { font-size: 30px; font-weight: 700; line-height: 1.55; }
  .ar-evt-label { font-size: 19px; font-weight: 400; line-height: 1.1; margin-top: 4px; }
  .ar-evt-venue { font-size: 14px; opacity: 0.65; margin-top: 3px; }

  .ar-evt-r.ar-evt-1 { top: 103px; left: 634px; width: 125px; }
  .ar-evt-r.ar-evt-3 { top: 257px; left: 630px; width: 132px; }
  .ar-evt-r.ar-evt-5 { top: 413px; left: 634px; width: 125px; }
  .ar-evt-l.ar-evt-2 { top: 187px; left: 445px; width: 100px; }
  .ar-evt-l.ar-evt-4 { top: 332px; left: 421px; width: 130px; }
  .ar-evt-l.ar-evt-6 { top: 489px; left: 421px; width: 130px; }

  /* ── VENUE ── */
  #ar-venue { background: var(--ar-cream); padding: 50px 0 60px; }
  .ar-venue-inner { max-width: 680px; margin: 0 auto; padding: 0 20px; text-align: center; }
  .ar-venue-title { font-size: 41px; font-weight: 500; color: var(--ar-gray); margin-bottom: 20px; }
  .ar-venue-photo-wrap {
    position: relative; width: 440px; max-width: 100%;
    margin: 0 auto; border-radius: 30px; overflow: hidden;
  }
  .ar-venue-photo { width: 100%; height: 420px; object-fit: cover; display: block; border-radius: 30px; }
  .ar-venue-fade {
    position: absolute; top: 0; left: 0; width: 100%; height: 40%;
    background: linear-gradient(to bottom, rgba(255,253,251,0.85) 0%, rgba(255,253,251,0) 100%);
  }
  .ar-venue-info {
    display: flex; align-items: flex-start;
    justify-content: center; gap: 10px; margin-top: 16px;
  }
  .ar-venue-pin { flex-shrink: 0; width: 24px; height: 24px; margin-top: 2px; }
  .ar-venue-pin img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .ar-venue-name { font-size: 22px; color: var(--ar-gray); font-weight: 500; text-align: left; }
  .ar-venue-addr { font-size: 18px; color: var(--ar-gray); text-align: left; margin-top: 2px; }
  .ar-venue-btns {
    display: flex; justify-content: center; gap: 12px; margin-top: 20px; flex-wrap: wrap;
  }
  .ar-map-btn {
    background: transparent; border: 1px solid var(--ar-blue);
    color: var(--ar-blue-deep); padding: 0.5rem 1.5rem;
    text-decoration: none; border-radius: 30px;
    font-family: var(--ar-font); font-size: 18px; transition: all 0.2s;
  }
  .ar-map-btn:hover { background: var(--ar-btn); color: #fff; border-color: var(--ar-btn); }

  /* ── DRESS CODE ── */
  #ar-dress {
    background: var(--ar-cream);
    padding: 40px 0 50px;
    border-top: 1px solid rgba(100,160,189,0.12);
  }
  .ar-dress-inner { max-width: 680px; margin: 0 auto; padding: 0 20px; text-align: center; }
  .ar-dress-title { font-size: 41px; font-weight: 500; color: var(--ar-gray); margin-bottom: 10px; }
  .ar-dress-desc  { font-size: 19px; color: var(--ar-gray); margin-bottom: 20px; line-height: 1.4; }

  .ar-dress-arrow-wrap { text-align: center; margin-bottom: 20px; }
  .ar-dress-arrow {
    width: 90px; height: auto; display: inline-block;
    animation: ar-drift-r 3s ease-in-out infinite alternate;
  }

  .ar-dress-gallery {
    position: relative; width: 100%; max-width: 760px;
    margin: 0 auto 28px;
  }
  /* Tilda t1148 slider: flex row, native overflow scroll + snap + drag */
  .ar-dress-track {
    --padding-right: 4px; --padding-left: 4px;
    display: flex; align-items: flex-start; gap: 20px;
    padding: 4px var(--padding-right) 16px var(--padding-left);
    max-width: 100%; box-sizing: border-box;
    overflow: auto hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(100,160,189,0.45) transparent;
    scroll-snap-type: x mandatory;
    scroll-padding-left: var(--padding-left);
    scroll-padding-right: var(--padding-right);
    -webkit-overflow-scrolling: touch;
    cursor: grab;
  }
  .ar-dress-track.t1148__slider_dragging {
    scroll-behavior: smooth; cursor: grabbing;
  }
  .ar-dress-track.t1148__slider_dragging .ar-dress-item { pointer-events: none; }
  .ar-dress-track::-webkit-scrollbar { height: 6px; }
  .ar-dress-track::-webkit-scrollbar-thumb { background: rgba(100,160,189,0.45); border-radius: 3px; }
  .ar-dress-track::-webkit-scrollbar-track { background: transparent; }

  .ar-dress-item {
    flex-shrink: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  .ar-dress-img-wrapper {
    position: relative;
    --height: 460px;
    height: var(--height);
    width: calc(var(--height) / 3 * 2); /* 2:3 portrait, like t1148__img-wrapper_2_3 */
    flex-shrink: 0;
  }
  .ar-dress-slide {
    width: 100%; height: 100%;
    object-fit: cover; display: block; border-radius: 12px;
    user-select: none;
  }
  @media (max-width: 640px) {
    .ar-dress-img-wrapper { --height: 350px; }
  }

  .t1148__controls_gallery {
    display: inline-flex; align-items: center; gap: 5px;
    position: absolute; left: 0; top: 50%; z-index: 2;
    width: 100%; justify-content: space-between;
    padding: 0 10px; margin: 0; box-sizing: border-box;
    transform: translateY(-50%); pointer-events: none;
  }
  .ar-dress-nav {
    pointer-events: auto;
    background: rgba(255,253,251,0.85); border: none;
    width: 40px; height: 40px; border-radius: 50%;
    font-size: 26px; line-height: 1; cursor: pointer;
    color: var(--ar-blue-deep); transition: background 0.2s;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ar-dress-nav:hover { background: rgba(255,253,251,1); }
  .ar-dress-next { transform: rotate(0.5turn); }

  .ar-swatches { display: flex; justify-content: center; gap: 10px; margin-bottom: 24px; }
  .ar-swatch {
    width: 52px; height: 52px; border-radius: 50%;
    border: 1px solid #f2e9df; animation: ar-fadein 1s ease both;
  }
  .ar-swatches .ar-swatch:nth-child(1) { animation-delay: 0s; }
  .ar-swatches .ar-swatch:nth-child(2) { animation-delay: 0.1s; }
  .ar-swatches .ar-swatch:nth-child(3) { animation-delay: 0.2s; }
  .ar-swatches .ar-swatch:nth-child(4) { animation-delay: 0.3s; }
  .ar-swatches .ar-swatch:nth-child(5) { animation-delay: 0.4s; }
  @keyframes ar-fadein { from{opacity:0;} to{opacity:1;} }
  .ar-dress-note { font-size: 18px; color: var(--ar-gray); line-height: 1.5; }
  .ar-dress-note strong { font-weight: 600; color: var(--ar-blue-deep); }

  /* ── RSVP ── */
  #ar-rsvp { background: var(--ar-blue-deep); padding: 60px 0 40px; }
  .ar-rsvp-inner { max-width: 680px; margin: 0 auto; padding: 0 20px; text-align: center; }
  .ar-rsvp-inner h2 { font-size: 41px; font-weight: 500; color: var(--ar-cream); margin-bottom: 12px; }
  .ar-rsvp-inner > p { font-size: 20px; color: rgba(255,253,251,0.85); margin-bottom: 28px; }
  .ar-rsvp-form    { display: flex; flex-direction: column; gap: 1rem; }
  .ar-rsvp-choices { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4px; }
  .ar-rsvp-choice {
    background: transparent; border: 1px solid rgba(255,253,251,0.6);
    color: var(--ar-cream); padding: 0.5rem 1.2rem;
    cursor: pointer; border-radius: 30px; transition: all 0.2s;
    font-family: var(--ar-font); font-size: 17px;
  }
  .ar-rsvp-choice.ar-active { background: var(--ar-cream); color: var(--ar-blue-deep); }
  .ar-rsvp-fields { display: flex; flex-direction: column; gap: 0.75rem; }
  .ar-rsvp-input {
    background: rgba(255,253,251,0.1); border: 1px solid rgba(255,253,251,0.3);
    color: var(--ar-cream); padding: 0.8rem; border-radius: 5px;
    font-family: var(--ar-font); font-size: 1rem; width: 100%;
  }
  .ar-rsvp-input::placeholder { color: rgba(255,253,251,0.5); }
  .ar-rsvp-textarea { min-height: 80px; resize: vertical; }
  .ar-rsvp-submit {
    background: var(--ar-btn); color: #fff; border: none;
    padding: 0.8rem 2.5rem; font-size: 1.2rem;
    cursor: pointer; border-radius: 30px; font-family: var(--ar-font);
    transition: all 0.2s; overflow: hidden; position: relative; isolation: isolate;
  }
  .ar-rsvp-submit::after {
    content: ''; position: absolute; top: 0; left: -85px;
    width: 45px; height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,.1), rgba(255,255,255,.4));
    transform: skewX(-45deg); animation: ar-flash 3s linear infinite;
  }
  @keyframes ar-flash {
    20%  { transform: translateX(285px) skewX(-45deg); }
    100% { transform: translateX(285px) skewX(-45deg); }
  }
  .ar-rsvp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .ar-rsvp-done { background: rgba(255,253,251,0.12); padding: 1rem; border-radius: 8px; color: var(--ar-cream); }

  /* ── GUESTBOOK ── */
  #ar-guestbook { background: var(--ar-blue-deep); padding: 0 0 60px; }
  .ar-gb-inner { max-width: 680px; margin: 0 auto; padding: 0 1.5rem 2rem; text-align: center; }
  .ar-gb-inner h2 { font-size: 41px; font-weight: 500; color: var(--ar-cream); margin-bottom: 2rem; padding-top: 2rem; }
  .ar-gb-list    { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }
  .ar-gb-card {
    position: relative;
    background: rgba(255,253,251,0.07); border: 1px solid rgba(255,253,251,0.2);
    padding: 1.2rem; border-radius: 5px; text-align: left; overflow: hidden;
  }
  .ar-gb-quote   { position: absolute; top: 6px; right: 10px; font-size: 1.4rem; color: rgba(255,253,251,0.2); }
  .ar-gb-message { position: relative; color: var(--ar-cream); font-style: italic; font-size: 1rem; line-height: 1.4; }
  .ar-gb-author  { margin-top: 0.5rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; color: var(--ar-cream); text-align: right; }
  .ar-gb-form    { display: flex; flex-direction: column; gap: 0.75rem; }
  .ar-gb-input {
    background: rgba(255,253,251,0.1); border: 1px solid rgba(255,253,251,0.3);
    color: var(--ar-cream); padding: 0.8rem; border-radius: 5px; font-family: var(--ar-font);
  }
  .ar-gb-input::placeholder { color: rgba(255,253,251,0.5); }
  .ar-gb-textarea { min-height: 80px; resize: vertical; }
  .ar-gb-submit {
    background: rgba(255,253,251,0.12); border: 1px solid rgba(255,253,251,0.4);
    color: var(--ar-cream); padding: 0.8rem 2rem; cursor: pointer;
    border-radius: 30px; font-family: var(--ar-font);
  }
  .ar-gb-done { color: rgba(255,253,251,0.7); font-style: italic; }

  /* ── CLOSING ── */
  #ar-closing { background: var(--ar-cream); padding: 60px 0 0; text-align: center; }
  .ar-closing-inner { max-width: 600px; margin: 0 auto; padding: 0 20px; }
  .ar-closing-title { font-size: 33px; font-weight: 500; color: var(--ar-gray); margin-bottom: 8px; animation: ar-fadein 2s ease forwards; }
  .ar-closing-names { font-size: 28px; color: var(--ar-gray); margin-bottom: 24px; animation: ar-fadein 2s ease 0.2s forwards; opacity: 0; }
  .ar-closing-photo-wrap {
    position: relative; width: 440px; max-width: 100%;
    margin: 0 auto; border-radius: 0 0 30px 30px; overflow: hidden;
  }
  .ar-closing-photo { width: 100%; display: block; border-radius: 0 0 30px 30px; }
  .ar-closing-deco {
    position: absolute; top: 26px; right: 18px;
    width: 30px; height: auto; z-index: 2; pointer-events: none;
  }
  .ar-closing-fade {
    position: absolute; top: 0; left: 0; width: 100%; height: 45%;
    background: linear-gradient(to bottom, rgba(255,253,251,1) 0%, rgba(255,253,251,0.8) 51%, rgba(255,255,255,0) 100%);
  }

  /* ── FOOTER ── */
  .ar-footer {
    text-align: center; padding: 30px 16px 24px;
    background: var(--ar-cream); color: var(--ar-blue-soft);
    font-family: Georgia, serif; font-size: 13px;
    letter-spacing: 2px; text-transform: uppercase;
  }
  .ar-footer-credit { margin-top: 6px; font-size: 11px; opacity: 0.6; letter-spacing: 3px; }

  /* ── AUDIO ── */
  .ar-audio-control {
    position: fixed; bottom: 20px; right: 20px;
    width: 60px; height: 60px;
    background: var(--ar-btn); border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .ar-audio-control svg { width: 28px; height: 28px; fill: #fff; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .ar-dear-title    { font-size: 24px; }
    .ar-dear-text     { font-size: 16px; }
    .ar-countdown-inner h2 { font-size: 26px; }
    .ar-time-num      { font-size: 34px; }
    .ar-time-label    { font-size: 13px; }
    .ar-time-sep      { font-size: 38px; margin-top: -28px; }
    .ar-venue-title   { font-size: 28px; }
    .ar-venue-btns    { flex-direction: column; align-items: center; }
    .ar-dress-title   { font-size: 28px; }
    .ar-dress-slide   { height: 320px; }
    .ar-rsvp-inner h2 { font-size: 28px; }
    .ar-rsvp-inner > p { font-size: 17px; }
    .ar-rsvp-choices  { flex-direction: column; align-items: center; }
    .ar-gb-inner h2   { font-size: 28px; }
    .ar-closing-title { font-size: 26px; }
    .ar-closing-names { font-size: 20px; }
    .ar-audio-control { width: 48px; height: 48px; bottom: 14px; right: 14px; }
    .ar-audio-control svg { width: 20px; height: 20px; }
  }

  @media (max-width: 480px) {
    .ar-dear-artboard { height: 760px; }
    .ar-dear-box      { width: 260px; height: 300px; padding: 20px 16px; margin-bottom: -190px; }
    .ar-dear-title    { font-size: 20px; }
    .ar-dear-text     { font-size: 15px; }
    .ar-countdown-inner    { padding: 20px 16px 32px; }
    .ar-countdown-inner h2 { font-size: 22px; }
    .ar-time-num  { font-size: 28px; }
    .ar-time-label { font-size: 11px; }
    .ar-time-sep  { font-size: 30px; margin-top: -22px; }
    .ar-countdown-timer { gap: 3px; }
    .ar-date-title { font-size: 30px; }
    .ar-venue-photo { height: 280px; }
    .ar-dress-slide { height: 260px; }
    .ar-rsvp-inner h2 { font-size: 24px; }
    .ar-rsvp-inner > p { font-size: 15px; }
    .ar-gb-inner h2 { font-size: 24px; }
    .ar-gb-message  { font-size: 0.9rem; }
    .ar-closing-title { font-size: 22px; }
    .ar-closing-names { font-size: 17px; }
    .ar-sched-artboard { height: 740px; }
    .ar-tl-line { height: 520px; }
    .ar-tl-dot-1 { top: 133px; } .ar-tl-dot-2 { top: 222px; }
    .ar-tl-dot-3 { top: 315px; } .ar-tl-dot-4 { top: 405px; }
    .ar-tl-dot-5 { top: 497px; } .ar-tl-dot-6 { top: 587px; }
    .ar-evt-r.ar-evt-1 { top: 113px; } .ar-evt-l.ar-evt-2 { top: 200px; }
    .ar-evt-r.ar-evt-3 { top: 293px; } .ar-evt-l.ar-evt-4 { top: 383px; }
    .ar-evt-r.ar-evt-5 { top: 475px; } .ar-evt-l.ar-evt-6 { top: 565px; }
  }
`

const POS: [string, number, number, number, number, number][] = [
  // hero
  ['.ar-hero-video-wrap',   380, 260, 100,  20, -60],
  ['.ar-hero-overlay',      380, 260, 100,  20, -60],
  ['.ar-hero-fade-bottom',  380, 260, 100,  20, -60],
  ['.ar-hero-names',        320, 200,  40, -40,-120],
  ['.ar-hero-sub',          430, 310, 150,  70, -10],
  // dear friends — now centered via flexbox, no per-breakpoint left offsets needed
  // schedule
  ['.ar-sched-title',       320, 200,  40, -40,-120],
  ['.ar-sched-leaves',      122,   2,-158,-238,-318],
  ['.ar-tl-line',           598, 478, 318, 238, 158],
  ['.ar-tl-dot-1',          595, 475, 315, 235, 155],
  ['.ar-tl-dot-2',          595, 475, 315, 235, 155],
  ['.ar-tl-dot-3',          595, 475, 315, 235, 155],
  ['.ar-tl-dot-4',          595, 475, 315, 235, 155],
  ['.ar-tl-dot-5',          595, 475, 315, 235, 155],
  ['.ar-tl-dot-6',          595, 475, 315, 235, 155],
  ['.ar-evt-r.ar-evt-1',    634, 514, 354, 274, 194],
  ['.ar-evt-r.ar-evt-3',    630, 510, 350, 270, 190],
  ['.ar-evt-r.ar-evt-5',    634, 514, 354, 274, 194],
  ['.ar-evt-l.ar-evt-2',    445, 325, 165,  85,   5],
  ['.ar-evt-l.ar-evt-4',    421, 301, 141,  61, -19],
  ['.ar-evt-l.ar-evt-6',    421, 301, 141,  61, -19],
]

const BREAKPOINTS: [number, number][] = [
  [1199, 480],
  [959,  320],
  [639,  240],
  [479,  160],
]

const POS_CSS = (() => {
  let css = POS.map(([sel, d]) => `${sel}{left:calc(50% - 600px + ${d}px);}`).join('')
  BREAKPOINTS.forEach(([mq, half], i) => {
    const rules = POS.map((p) => `${p[0]}{left:calc(50% - ${half}px + ${p[i + 2]}px);}`).join('')
    css += `@media (max-width:${mq}px){${rules}}`
  })
  return css
})()