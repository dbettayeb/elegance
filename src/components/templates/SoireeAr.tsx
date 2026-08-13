'use client'

import { useState, useRef, useEffect } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import type { BismillahPalette } from '@/lib/bismillah-palettes'
import { useInvitationLogic } from '@/lib/use-invitation'
import { getArTypographyTheme } from '@/lib/typography-themes'
import { SOIREE_AR_PALETTES } from '@/lib/bismillah-palettes'
import FontOverride from '@/components/common/fontoverride'
import AddToCalendar from '@/components/common/AddToCalendar'
import { SOIREE_AR, SOIREE_FR, SOIREE_FR_THEME } from '@/lib/soiree-strings'
import { timeRange } from '@/lib/event-time'

/** Rend un titre multiligne sans passer par du HTML brut. */
function lines(parts: readonly string[]) {
  return parts.map((part, i) => (
    <span key={i}>{i > 0 && <br />}{part}</span>
  ))
}

/**
 * Arabic template built for a single evening (henna, engagement, reception).
 *
 * Two things set it apart from the other templates:
 *  - the hero video is the couple's own, taken from intro_video_url, instead
 *    of artwork baked into the template
 *  - the line above the date is free text (wedding_day_text), so the evening
 *    names itself rather than always reading "Wedding Day"
 */
export default function SoireeAr({ wedding, lang = 'ar' }: { wedding: Wedding; lang?: 'ar' | 'fr' }) {
  const t = lang === 'fr' ? SOIREE_FR : SOIREE_AR
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate,
  } = useInvitationLogic(wedding)

  const [videoFailed, setVideoFailed] = useState(false)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [musicOn, setMusicOn] = useState(false)
  // Phases d'ouverture : 0 inerte, 1 le sceau s'efface, 2 les pans s'écartent,
  // 3 l'écran disparaît, 4 invitation ouverte.
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)

  const theme = lang === 'fr' ? SOIREE_FR_THEME : getArTypographyTheme(wedding.ar_font_theme)
  // Restreint aux palettes de ce template : le défaut global est 'or_classique',
  // une palette claire qui rendrait le texte illisible sur la vidéo.
  const palette =
    SOIREE_AR_PALETTES.find(pal => pal.id === wedding.bismillah_palette) ?? SOIREE_AR_PALETTES[0]

  // ar-TN gives Arabic month names with Western digits, which is what Tunisian
  // invitations use. The time is forced to 24h: the locale default would print
  // "07:00 م" for a 19:00 reception.
  const formattedDate = eventDate.toLocaleDateString(t.locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: false } as const
  // Devient « 19:00 – 02:00 » dès que le marié renseigne une fin.
  const eventTime = timeRange(wedding, eventDate, d => d.toLocaleTimeString(t.locale, timeOpts))

  const heroTitle = wedding.wedding_day_text || t.heroTitleDefault
  // Un titre arabe sur le template français : les polices latines n'ont pas ces
  // glyphes, le navigateur retomberait sur une police système quelconque. On lui
  // applique donc la calligraphie choisie par le marié, et on la charge en plus.
  const titleIsArabic = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(heroTitle)
  const arTheme = getArTypographyTheme(wedding.ar_font_theme)
  const needsArabicTitle = lang === 'fr' && titleIsArabic
  const titleFont = needsArabicTitle ? arTheme.display : theme.display
  // custom_font_size est un pourcentage. Appliqué comme facteur sur la taille de
  // base du titre plutôt qu'en font-size:%, qui se calculerait sur le parent.
  const titleScale = (wedding.custom_font_size ?? 100) / 100
  const hasVideo = !!wedding.intro_video_url && !videoFailed
  const hasMusic = !!wedding.music_url
  // null = illimité. Le serveur applique la même limite, le max HTML étant contournable.
  const maxGuests = wedding.max_guests ?? null

  // L'invité doit toucher l'enveloppe pour entrer. Ce geste est aussi ce qui
  // autorise le son : sans lui, tout navigateur refuse de lancer la musique.
  function startSequence() {
    if (phase !== 0) return
    setPhase(1)                          // le sceau et l'invite s'effacent
    setTimeout(() => setPhase(2), 1000)  // les pans s'écartent
    setTimeout(() => setPhase(3), 3500)  // l'écran s'efface
    setTimeout(() => {
      setPhase(4)
      openEnvelope()
    }, 4100)
  }

  // Met l'enveloppe à l'échelle de l'écran : la scène est un gabarit fixe de
  // 1200×850 dans lequel le papier fait 580px de haut.
  useEffect(() => {
    if (phase >= 3) return
    function scaleOpening() {
      const stage = document.querySelector<HTMLElement>('.sa-stage')
      if (!stage) return
      const PAPER_H = 580
      const scale = (window.innerWidth >= 1200 && window.innerHeight >= 850)
        ? 1
        : Math.min(window.innerHeight / PAPER_H, 1.5)
      stage.style.setProperty('--os-scale', scale.toFixed(4))
    }
    scaleOpening()
    window.addEventListener('resize', scaleOpening)
    return () => window.removeEventListener('resize', scaleOpening)
  }, [phase])

  // Autoplay needs muted; some browsers still refuse, so failure is silent.
  useEffect(() => {
    if (!opened || !hasVideo) return
    heroVideoRef.current?.play().catch(() => {})
  }, [opened, hasVideo])

  // La musique part à l'ouverture de l'enveloppe, comme chez Viktor & Paula :
  // le clic qui vient d'avoir lieu autorise le son. Le repli sur le geste
  // suivant ne sert plus que de garde-fou si le navigateur refuse quand même.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !hasMusic || !opened) return

    let armed = true
    const start = (ev?: Event) => {
      if (!armed) return
      // Le bouton pilote déjà la lecture. Sans cette garde, un premier geste
      // porté sur lui lancerait le son ici, puis toggleMusic le couperait
      // aussitôt : l'invité appuierait sur « lecture » et n'entendrait rien.
      const target = ev?.target
      if (target instanceof Element && target.closest('.sa-audio-control')) return
      audio.play().then(() => {
        armed = false
        setMusicOn(true)
        detach()
      }).catch(() => {})
    }
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const
    const detach = () =>
      events.forEach(e => window.removeEventListener(e, start))

    start()
    events.forEach(e => window.addEventListener(e, start, { passive: true }))
    return () => { armed = false; detach() }
  }, [hasMusic, opened])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (musicOn) {
      audio.pause()
      setMusicOn(false)
    } else {
      audio.play().then(() => setMusicOn(true)).catch(() => {})
    }
  }

  const program: ProgramItem[] = Array.isArray(wedding.program) ? wedding.program : []
  const parties = (wedding.show_celebrations ?? true) ? (wedding.parties ?? []) : []
  const dressWomen = wedding.dress_code_women?.trim()
  const dressMen = wedding.dress_code_men?.trim()
  const dressColors = Array.isArray(wedding.dress_code_colors) ? wedding.dress_code_colors : []
  const dressImages = (Array.isArray(wedding.dress_code_images) ? wedding.dress_code_images : []).filter(Boolean)

  return (
    <>
      <link
        href={`https://fonts.googleapis.com/css2?family=${theme.googleFonts}&display=swap`}
        rel="stylesheet"
      />
      {needsArabicTitle && (
        <link
          href={`https://fonts.googleapis.com/css2?family=${arTheme.googleFonts}&display=swap`}
          rel="stylesheet"
        />
      )}
      <style>{CSS(theme.display, theme.body, titleScale, palette, titleFont)}</style>
      <FontOverride font={wedding.custom_font} fontSize={wedding.custom_font_size} container=".sa-root" />

      {!opened && (
        <div className={`sa-opening${phase >= 3 ? ' sa-opening-gone' : ''}`}>
          <div
            className={`sa-stage${phase >= 1 ? ' sa-seal-out' : ''}${phase >= 2 ? ' sa-animating' : ''}`}
            onClick={startSequence}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startSequence() }}
            role="button"
            tabIndex={0}
            aria-label={t.openAria}
          >
            <img className="sa-poly sa-poly-left"  src="/assets/polygons/polygon-left.png"   alt="" />
            <img className="sa-poly sa-poly-right" src="/assets/polygons/polygon-right.png"  alt="" />
            <img className="sa-poly sa-poly-bot"   src="/assets/polygons/polygon-bottom.png" alt="" />
            <img className="sa-poly sa-poly-top"   src="/assets/polygons/polygon-top.png"    alt="" />
            <span className="sa-dove" aria-hidden="true">
              <img src="/assets/dove/dove-open.webp" alt="" />
            </span>
            <span className="sa-hint">{t.hint}</span>
          </div>
        </div>
      )}

      <div className="sa-root" dir={t.dir} lang={t.lang}>
        <div className={`sa-main${visible ? ' sa-visible' : ''}`}>
          {/* ─── HERO VIDÉO ─── */}
          <header className="sa-hero">
            <div className="sa-hero-panel">
              {hasVideo ? (
                <video
                  ref={heroVideoRef}
                  className="sa-hero-video"
                  src={wedding.intro_video_url}
                  onError={() => setVideoFailed(true)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ) : (
                <div className="sa-hero-fallback" />
              )}

              <div className="sa-hero-veil" />
              <div className="sa-hero-fade" />

              <div className="sa-hero-content">
                <div className="sa-hero-title sa-anim" style={{ animationDelay: '0.3s' }}>
                  {heroTitle}
                </div>

                <div className="sa-hero-date sa-anim" style={{ animationDelay: '0.5s' }}>
                  {formattedDate}
                </div>
                <div className="sa-hero-time sa-anim" style={{ animationDelay: '0.62s' }}>
                  {eventTime}
                </div>
              </div>
            </div>
          </header>

          {/* ─── MOT D'ACCUEIL ─── */}
          {wedding.custom_message && (
            <section className="sa-section sa-welcome">
              <p className="sa-welcome-text">{wedding.custom_message}</p>
            </section>
          )}

          {/* ─── COMPTE À REBOURS ─── */}
          {wedding.show_countdown !== false && (
            <section className="sa-section">
              <p className="sa-label">{t.countdownLabel}</p>
              <h2 className="sa-title">{t.countdownTitle}</h2>
              <div className="sa-countdown">
                {([[t.units[0], countdown.d], [t.units[1], countdown.h], [t.units[2], countdown.m], [t.units[3], countdown.s]] as const).map(([label, value]) => (
                  <div className="sa-cd-cell" key={label}>
                    <div className="sa-cd-num">{value}</div>
                    <div className="sa-cd-label">{label}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── CÉLÉBRATIONS ─── */}
          {parties.length > 0 && (
            <section className="sa-section">
              <p className="sa-label">{t.celebrationsLabel}</p>
              <div className="sa-parties">
                {parties.map((party, i) => (
                  <div className="sa-party" key={i}>
                    <div className="sa-party-title">{party.title}</div>
                    <div className="sa-party-meta">{party.date} · {party.time}</div>
                    <div className="sa-party-venue">{party.venue_name}</div>
                    {party.venue_address && (
                      <div className="sa-party-address">{party.venue_address}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── PROGRAMME ─── */}
          {wedding.show_program !== false && program.length > 0 && (
            <section className="sa-section">
              <p className="sa-label">{t.programLabel}</p>
              <h2 className="sa-title">{t.programTitle}</h2>
              <div className="sa-program">
                {program.map((item, i) => (
                  <div className="sa-program-row" key={i}>
                    <div className="sa-program-time">{item.time}</div>
                    <div className="sa-program-event">
                      {item.event}
                      {item.venue && <span className="sa-program-venue">{item.venue}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── LIEU ─── */}
          <section className="sa-section">
            <p className="sa-label">{t.venueLabel}</p>
            <h2 className="sa-title" data-ef="venue_name">{wedding.venue_name}</h2>
            {wedding.venue_address && (
              <p className="sa-venue-address">{wedding.venue_address}</p>
            )}
            {(wedding.gps_google || wedding.gps_apple) && (
              <div className="sa-maps" dir="ltr">
                {wedding.gps_google && (
                  <a className="sa-map-link" href={wedding.gps_google} target="_blank" rel="noopener noreferrer">
                    Google Maps
                  </a>
                )}
                {wedding.gps_apple && (
                  <a className="sa-map-link" href={wedding.gps_apple} target="_blank" rel="noopener noreferrer">
                    Apple Maps
                  </a>
                )}
              </div>
            )}
          </section>

          {/* ─── DRESS CODE ─── */}
          {wedding.show_dress_code && (dressWomen || dressMen || dressColors.length > 0 || dressImages.length > 0) && (
            <section className="sa-section">
              <h2 className="sa-title">{t.dressTitle}</h2>
              <div className="sa-dress">
                {dressWomen && (
                  <div className="sa-dress-col">
                    <div className="sa-dress-who">{t.dressWomen}</div>
                    <div className="sa-dress-text">{dressWomen}</div>
                  </div>
                )}
                {dressMen && (
                  <div className="sa-dress-col">
                    <div className="sa-dress-who">{t.dressMen}</div>
                    <div className="sa-dress-text">{dressMen}</div>
                  </div>
                )}
              </div>
              {dressColors.length > 0 && (
                <div className="sa-dress-colors">
                  {dressColors.map((color, i) => (
                    <span className="sa-dress-dot" key={i} style={{ background: color }} />
                  ))}
                </div>
              )}
              {dressImages.length > 0 && (
                <div className="sa-dress-gallery" dir="ltr">
                  {dressImages.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="sa-dress-photo" key={i} src={src} alt="" loading="lazy" draggable={false} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ─── RSVP ─── */}
          {wedding.show_rsvp && (
            <section className="sa-section sa-rsvp">
              <p className="sa-label">{t.rsvpLabel}</p>
              <h2 className="sa-title">{lines(t.rsvpTitle)}</h2>
              {rsvpStatus === 'done' ? (
                <p className="sa-success">{t.rsvpSuccess}</p>
              ) : (
                <form className="sa-form" onSubmit={submitRSVP} dir="ltr">
                  <div className="sa-field">
                    <label className="sa-field-label">Nom complet</label>
                    <input className="sa-input" name="name" placeholder="Prénom et nom..." required />
                  </div>
                  <div className="sa-field">
                    <label className="sa-field-label">WhatsApp</label>
                    <input className="sa-input" name="phone" placeholder="+216 ..." />
                  </div>
                  <div className="sa-field">
                    <label className="sa-field-label">Présence</label>
                    <div className="sa-choices">
                      {(['present', 'absent', 'maybe'] as const).map(s => (
                        <button
                          key={s}
                          type="button"
                          className={`sa-choice${rsvpChoice === s ? ' sa-choice-on' : ''}`}
                          onClick={() => setRsvpChoice(s)}
                        >
                          {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'À confirmer'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sa-field">
                    <label className="sa-field-label">
                      Accompagnants
                      {maxGuests !== null && (
                        <span className="sa-field-hint"> — {maxGuests} maximum</span>
                      )}
                    </label>
                    <input
                      className="sa-input"
                      name="guests"
                      type="number"
                      min="0"
                      max={maxGuests ?? 20}
                      placeholder={maxGuests !== null ? `Jusqu'à ${maxGuests}...` : 'Nombre de personnes...'}
                    />
                  </div>
                  <div className="sa-field">
                    <label className="sa-field-label">Message (optionnel)</label>
                    <textarea className="sa-input sa-textarea" name="note" maxLength={1500} placeholder={t.notePlaceholder} />
                  </div>
                  <button className="sa-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                    {rsvpStatus === 'loading' ? 'Envoi...' : `\u2066${t.ornament}  Confirmer ma présence  ${t.ornament}\u2069`}
                  </button>
                </form>
              )}
              <AddToCalendar wedding={wedding} />
            </section>
          )}

          {/* ─── LIVRE D'OR ─── */}
          {wedding.show_guestbook && (
            <section className="sa-section">
              <p className="sa-label">{t.guestbookLabel}</p>
              <h2 className="sa-title">{lines(t.guestbookTitle)}</h2>
              {messages.length > 0 && (
                <div className="sa-messages">
                  {messages.map(msg => (
                    <div className="sa-message" key={msg.id}>
                      <div className="sa-message-text">{msg.message}</div>
                      <div className="sa-message-author">— {msg.author_name}</div>
                    </div>
                  ))}
                </div>
              )}
              {gbStatus === 'done' ? (
                <p className="sa-success">
                  {gbPending ? `En attente de validation ${t.ornament}` : `Message publié ${t.ornament}`}
                </p>
              ) : (
                <form className="sa-form" onSubmit={submitMessage} dir="ltr">
                  <div className="sa-field">
                    <label className="sa-field-label">Votre prénom</label>
                    <input className="sa-input" name="author_name" placeholder="ex. Yasmine..." required />
                  </div>
                  <div className="sa-field">
                    <label className="sa-field-label">Vos vœux</label>
                    <textarea className="sa-input sa-textarea" name="message" maxLength={3000} placeholder={t.messagePlaceholder} required />
                  </div>
                  <button className="sa-submit" type="submit" disabled={gbStatus === 'loading'}>
                    {gbStatus === 'loading' ? 'Envoi...' : `\u2066${t.ornament}  Publier mon message  ${t.ornament}\u2069`}
                  </button>
                </form>
              )}
            </section>
          )}

          <footer className="sa-footer">
            <div className="sa-footer-orn">✦</div>
            <div className="sa-footer-title">{heroTitle}</div>
          </footer>
        </div>
      </div>

      {hasMusic && (
        <>
          <audio ref={audioRef} loop preload="auto" src={wedding.music_url} />
          <button
            type="button"
            className={`sa-audio-control${opened ? '' : ' sa-audio-hidden'}`}
            onClick={toggleMusic}
            aria-label={musicOn ? t.musicPause : t.musicPlay}
          >
            {musicOn ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>
        </>
      )}
    </>
  )
}

const CSS = (display: string, body: string, titleScale: number, p: BismillahPalette, titleFont: string) => `
.sa-root {
  --sa-night:    ${p.bg};
  --sa-gold:     ${p.accent};
  --sa-gold-dim: ${p.border};
  --sa-gold-deep: ${p.accentDark};
  --sa-soft:     ${p.accentSoft};
  --sa-cream:    ${p.textPrimary};
  --sa-second:   ${p.textSecondary};
  --sa-muted:    ${p.textMuted};
  --sa-title-scale: ${titleScale};
  --sa-display: ${display};
  /* Police du titre de la soirée : distincte quand il est écrit en arabe
     alors que le reste du template est en latin. */
  --sa-title-font: ${titleFont};
  --sa-body:    ${body};

  background: var(--sa-night);
  color: var(--sa-cream);
  font-family: var(--sa-body);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Corps ── */
.sa-main { opacity: 0; transition: opacity 1s ease; }
.sa-main.sa-visible { opacity: 1; }

/* ── Hero vidéo ──
   Panneau centré sur grand écran, pleine largeur sur mobile : même intention
   que Viktor & Paula, sans le calcul d'artboard. */
.sa-hero {
  display: flex;
  justify-content: center;
  background: var(--sa-night);
}
.sa-hero-panel {
  position: relative;
  width: 100%;
  max-width: 460px;
  height: 88vh;
  min-height: 520px;
  max-height: 780px;
  overflow: hidden;
}
.sa-hero-video,
.sa-hero-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sa-hero-fallback {
  background: linear-gradient(160deg, var(--sa-soft) 0%, var(--sa-night) 55%, var(--sa-soft) 100%);
}
.sa-hero-veil {
  position: absolute;
  inset: 0;
  /* Dégradé plutôt qu'un voile uniforme : assez dense derrière le titre pour
     le garder lisible sur une vidéo claire, presque nul plus bas pour ne pas
     assombrir l'image. */
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--sa-night) 48%, transparent) 0%,
    color-mix(in srgb, var(--sa-night) 32%, transparent) 38%,
    color-mix(in srgb, var(--sa-night) 10%, transparent) 66%,
    transparent 85%
  );
}
.sa-hero-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 190px;
  background: linear-gradient(0deg, var(--sa-night) 0%, transparent 100%);
}
/* Ancré vers le haut du panneau, pas centré : le bas de la vidéo reste
   visible sous le texte. */
.sa-hero-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 6vh 26px 0;
}
/* Le titre porte le hero à lui seul : pas de prénoms sous la date. */
.sa-hero-title {
  font-family: var(--sa-title-font);
  font-size: calc(52px * var(--sa-title-scale));
  color: var(--sa-gold);
  line-height: 1.45;
}
.sa-hero-date {
  /* Collée au titre : le filet qui les séparait est parti, et l'écart qu'il
     laissait derrière lui détachait la date de ce qu'elle date. */
  margin-top: 18px;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.sa-hero-time {
  font-size: 14px;
  letter-spacing: 0.22em;
  color: var(--sa-muted);
  margin-top: 6px;
}

.sa-anim { opacity: 0; animation: saFadeUp 1.1s ease forwards; }
@keyframes saFadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Sections ── */
.sa-section {
  max-width: 620px;
  margin: 0 auto;
  padding: 54px 26px;
  text-align: center;
  border-bottom: 1px solid color-mix(in srgb, var(--sa-gold) 14%, transparent);
}
/* Paire surtitre + titre, reprise de Bismillah. */
.sa-label {
  font-family: var(--sa-body);
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--sa-gold);
  margin-bottom: 14px;
}
.sa-title {
  font-family: var(--sa-display);
  font-size: clamp(1.8rem, 4.5vw, 2.4rem);
  font-weight: 700;
  color: var(--sa-cream);
  line-height: 1.4;
  margin-bottom: 26px;
}
.sa-welcome-text  { font-size: 17px; line-height: 2.1; color: var(--sa-muted); }

/* ── Compte à rebours ── */
.sa-countdown { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.sa-countdown { gap: 0; }
/* Les cellules n'ont plus de cadre : un filet vertical suffit à les séparer,
   et il s'estompe aux extrémités pour ne pas redessiner une boîte. */
.sa-cd-cell {
  min-width: 78px;
  padding: 4px 14px;
  position: relative;
}
.sa-cd-cell + .sa-cd-cell::before {
  content: ''; position: absolute; inset-inline-start: 0; top: 12%; height: 76%;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--sa-gold-dim) 35%,
                              var(--sa-gold-dim) 65%, transparent);
}
.sa-cd-num {
  /* Chiffres pris dans la police de texte : ceux de la police de titre sont
     dessinés en style ancien, où le 1 se confond avec un I majuscule. */
  font-family: var(--sa-body);
  font-size: 38px; font-weight: 300; color: var(--sa-cream);
  line-height: 1;
  font-variant-numeric: tabular-nums lining-nums;
}
.sa-cd-label {
  font-size: 10px; color: var(--sa-gold); margin-top: 10px;
  letter-spacing: 0.2em; text-transform: uppercase;
}

/* ── Célébrations ── */
.sa-parties { display: flex; flex-direction: column; gap: 16px; }
.sa-party { padding: 20px; border: 1px solid color-mix(in srgb, var(--sa-gold) 20%, transparent); }
.sa-party-title   { font-family: var(--sa-display); font-size: 22px; color: var(--sa-gold); margin-bottom: 8px; }
.sa-party-meta    { font-size: 14px; color: var(--sa-muted); margin-bottom: 8px; }
.sa-party-venue   { font-size: 17px; }
.sa-party-address { font-size: 14px; color: var(--sa-muted); margin-top: 4px; }

/* ── Programme ── */
.sa-program { display: flex; flex-direction: column; gap: 2px; }
.sa-program-row {
  display: flex;
  align-items: baseline;
  gap: 18px;
  padding: 15px 4px;
  border-bottom: 1px solid color-mix(in srgb, var(--sa-gold) 9%, transparent);
  text-align: start;
}
.sa-program-row:last-child { border-bottom: none; }
.sa-program-time {
  min-width: 62px; color: var(--sa-gold); font-weight: 400; font-size: 15px;
  letter-spacing: 0.06em; font-variant-numeric: tabular-nums;
}
.sa-program-event { font-size: 17px; }
.sa-program-venue { display: block; font-size: 13px; color: var(--sa-muted); margin-top: 3px; }

/* ── Lieu ── */
.sa-venue-address { font-size: 15px; color: var(--sa-muted); line-height: 1.8; font-style: italic; }
.sa-maps { display: flex; justify-content: center; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
.sa-map-link {
  padding: 10px 20px;
  border: 1px solid var(--sa-gold-dim);
  color: var(--sa-cream);
  font-size: 13px;
  text-decoration: none;
  transition: border-color 0.3s ease;
}
.sa-map-link:hover { border-color: var(--sa-gold); }

/* ── Formulaires ── */
.sa-form { display: flex; flex-direction: column; gap: 22px; text-align: start; }
.sa-field { display: flex; flex-direction: column; gap: 9px; }
.sa-field-label {
  font-family: var(--sa-body);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sa-gold);
}
.sa-field-hint { opacity: 0.75; }
/* Un simple filet sous le champ, pas un cadre : cinq boîtes empilées
   donnaient au formulaire l'allure d'un guichet plutôt que d'une invitation. */
.sa-input {
  width: 100%;
  padding: 11px 2px;
  background: transparent;
  border: none;
  border-bottom: 1px solid color-mix(in srgb, var(--sa-gold) 24%, transparent);
  border-radius: 0;
  color: var(--sa-cream);
  font-family: var(--sa-body);
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s ease;
}
.sa-input::placeholder { color: color-mix(in srgb, var(--sa-cream) 34%, transparent); }
.sa-input:focus { border-bottom-color: var(--sa-gold); }
.sa-input::placeholder { color: var(--sa-muted); opacity: 0.7; }
.sa-input:focus { border-color: var(--sa-gold); }
.sa-textarea { min-height: 84px; resize: vertical; line-height: 1.6; }
.sa-choices { display: flex; gap: 8px; flex-wrap: wrap; }
.sa-choice {
  flex: 1;
  min-width: 96px;
  padding: 11px 8px;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--sa-gold) 22%, transparent);
  border-radius: 999px;
  color: var(--sa-muted);
  font-family: var(--sa-body);
  font-size: 13.5px;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: all 0.25s ease;
}
.sa-choice-on { border-color: var(--sa-gold); color: var(--sa-gold); background: color-mix(in srgb, var(--sa-gold) 9%, transparent); }
.sa-submit {
  align-self: center;
  padding: 15px 42px;
  margin-top: 14px;
  background: linear-gradient(160deg, var(--sa-gold), var(--sa-gold-deep));
  border: none;
  border-radius: 999px;
  color: var(--sa-night);
  font-family: var(--sa-body);
  font-size: 13px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--sa-gold) 22%, transparent);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.sa-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--sa-gold) 30%, transparent);
}
.sa-submit:disabled { opacity: 0.55; cursor: default; }
.sa-submit:disabled { opacity: 0.55; cursor: default; }
.sa-success { font-family: var(--sa-display); font-size: 20px; color: var(--sa-gold); }

/* ── Livre d'or ── */
.sa-messages { display: flex; flex-direction: column; gap: 14px; margin-bottom: 26px; }
.sa-message { padding: 17px; border: 1px solid color-mix(in srgb, var(--sa-gold) 16%, transparent); }
.sa-message-text   { overflow-wrap: anywhere; font-size: 16px; line-height: 1.9; }
.sa-message-author { font-size: 13px; color: var(--sa-gold); margin-top: 9px; }

/* ── Pied de page ── */
.sa-footer { padding: 44px 20px 56px; text-align: center; }
.sa-footer-orn   { color: var(--sa-gold); font-size: 13px; margin-bottom: 14px; }
.sa-footer-title { font-family: var(--sa-title-font); font-size: calc(26px * var(--sa-title-scale)); color: var(--sa-gold); }

/* ── Responsive ── */
/* ── DRESS CODE ──
   Deux colonnes sur grand écran, empilées sur mobile : une consigne pour les
   femmes, une pour les hommes, et la palette en pastilles sous les deux. */
.sa-dress {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 30px 56px; margin-top: 26px;
}
.sa-dress-col { flex: 1 1 220px; max-width: 300px; }
.sa-dress-who {
  font-family: var(--sa-body);
  font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--sa-gold); margin-bottom: 10px;
}
.sa-dress-text {
  font-family: var(--sa-body);
  font-size: 16px; line-height: 1.7; color: var(--sa-second);
}
.sa-dress-colors {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 12px; margin-top: 30px;
}
.sa-dress-dot {
  width: 30px; height: 30px; border-radius: 50%;
  border: 1px solid var(--sa-gold-dim);
  box-shadow: 0 2px 8px rgba(0,0,0,0.28);
}

/* Galerie d'inspiration. Défilement natif avec accroche plutôt qu'un carrousel
   scripté : le geste tactile et le trackpad fonctionnent sans code, et une
   image qui ne charge pas ne casse pas la rangée. */
.sa-dress-gallery {
  display: flex; gap: 14px;
  margin-top: 32px; padding-bottom: 10px;
  overflow-x: auto; scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--sa-gold-dim) transparent;
  justify-content: safe center;
}
.sa-dress-photo {
  flex: 0 0 auto;
  width: 260px; height: 350px; object-fit: cover;
  border-radius: 3px; border: 1px solid var(--sa-gold-dim);
  scroll-snap-align: center;
  box-shadow: 0 8px 22px rgba(0,0,0,0.35);
}

@media (max-width: 640px) {
  .sa-dress     { gap: 26px; margin-top: 22px; }
  .sa-dress-col { flex: 1 1 100%; max-width: none; }
  .sa-dress-dot   { width: 26px; height: 26px; }
  .sa-dress-photo { width: 215px; height: 290px; }
}

/* ── ENVELOPPE D'OUVERTURE ──
   Reprise de Viktor & Paula : même scène de 1200×850, mêmes décalages, mêmes
   durées. Le fond garde le bordeaux de ses illustrations, qui sont peintes
   dans cette teinte et jureraient sur la palette nuit du template. */
.sa-opening {
  position: fixed; inset: 0;
  /* Seul le fond suit la palette : les pans et le sceau restent les
     illustrations d'origine, avec leurs teintes. */
  background: ${p.bg};
  z-index: 10000; overflow: hidden;
  transition: opacity 0.6s ease, visibility 0.6s ease;
}
.sa-opening-gone { opacity: 0; visibility: hidden; pointer-events: none; }

.sa-stage {
  position: absolute; top: 50%; left: 50%;
  width: 1200px; height: 850px;
  cursor: pointer;
  --os-scale: 1;
  transform: translate(-50%, -50%) scale(var(--os-scale));
  transform-origin: center center;
}
.sa-poly {
  position: absolute; pointer-events: none;
  transition: transform 2.5s ease, opacity 0.5s ease;
}
.sa-poly-left  { top: -13px; left: 98px;  width: 467px;  height: auto; z-index: 1; }
.sa-poly-right { top: -13px; left: 635px; width: 467px;  height: auto; z-index: 1; }
.sa-poly-bot   { top: 271px; left: 95px;  width: 1011px; height: auto; z-index: 1; }
.sa-poly-top   { top: -6px;  left: 94px;  width: 1012px; height: auto; z-index: 2; }

.sa-animating .sa-poly-left  { transform: translateX(-560px); opacity: 0; }
.sa-animating .sa-poly-right { transform: translateX(560px);  opacity: 0; }
.sa-animating .sa-poly-top   { transform: translateY(-430px); }
.sa-animating .sa-poly-bot   { transform: translateY(566px); }

.sa-dove {
  position: absolute; top: 318px; left: 515px;
  width: 170px; height: 170px; z-index: 3;
  transition: transform 1.5s ease, opacity 1.5s ease;
}
.sa-dove img { width: 100%; height: 100%; object-fit: contain; display: block; }
.sa-seal-out .sa-dove, .sa-animating .sa-dove { transform: scale(1.22); opacity: 0; }

.sa-hint {
  /* Tendue sur toute la scène plutôt qu'une boîte de 130px : celle-ci venait
     de Viktor & Paula, dont « Click to open » y tenait. « Cliquez pour ouvrir »
     déborde, et le dépassement part à droite — l'invite se retrouvait décalée
     de 28px. Sans largeur fixe, elle se centre quelle que soit la langue. */
  position: absolute; top: 540px; left: 0; right: 0;
  text-align: center;
  color: ${p.bg}; font-family: ${body};
  font-size: 20px; pointer-events: none; z-index: 1;
  white-space: nowrap;
  transition: opacity 1.5s ease;
}
.sa-seal-out .sa-hint, .sa-animating .sa-hint {
  opacity: 0; transition: opacity 0.3s ease;
}

/* ── CONTRÔLE MUSIQUE ──
   Placé hors de .sa-root pour qu'aucun conteneur transformé ne détourne le
   position:fixed, donc hors de portée des variables --sa-* : les couleurs de
   la palette sont écrites en dur ici. */
.sa-audio-control {
  position: fixed; bottom: 20px; left: 20px;
  width: 54px; height: 54px;
  border: 1px solid ${p.border}; border-radius: 50%;
  background: ${p.bg}; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.sa-audio-control:hover { transform: scale(1.06); border-color: ${p.accent}; }
/* Rien ne doit flotter au-dessus de l'enveloppe tant qu'elle est fermée. */
.sa-audio-hidden { opacity: 0; visibility: hidden; pointer-events: none; }
.sa-audio-control svg { width: 20px; height: 20px; fill: ${p.accent}; }

@media (max-width: 640px) {
  .sa-audio-control     { width: 46px; height: 46px; bottom: 14px; left: 14px; }
  .sa-audio-control svg { width: 17px; height: 17px; }
}

@media (max-width: 640px) {
  .sa-hero-panel   { max-width: 100%; height: 84vh; min-height: 460px; }
  .sa-hero-content { padding-top: 5vh; }
  .sa-hero-title   { font-size: calc(40px * var(--sa-title-scale)); }
  .sa-hero-date    { font-size: 19px; }
  .sa-section      { padding: 44px 20px; }
}
@media (max-width: 380px) {
  .sa-hero-title { font-size: calc(33px * var(--sa-title-scale)); }
  .sa-cd-cell { min-width: 64px; }
}
`
