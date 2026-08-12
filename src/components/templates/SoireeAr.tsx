'use client'

import { useState, useRef, useEffect } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import type { BismillahPalette } from '@/lib/bismillah-palettes'
import { useInvitationLogic } from '@/lib/use-invitation'
import { getArTypographyTheme } from '@/lib/typography-themes'
import { getBismillahPalette } from '@/lib/bismillah-palettes'
import FontOverride from '@/components/common/fontoverride'
import AddToCalendar from '@/components/common/AddToCalendar'

/**
 * Arabic template built for a single evening (henna, engagement, reception).
 *
 * Two things set it apart from the other templates:
 *  - the hero video is the couple's own, taken from intro_video_url, instead
 *    of artwork baked into the template
 *  - the line above the date is free text (wedding_day_text), so the evening
 *    names itself rather than always reading "Wedding Day"
 */
export default function SoireeAr({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate,
  } = useInvitationLogic(wedding)

  const [videoFailed, setVideoFailed] = useState(false)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null)

  const theme = getArTypographyTheme(wedding.ar_font_theme)
  const palette = getBismillahPalette(wedding.bismillah_palette)

  // ar-TN gives Arabic month names with Western digits, which is what Tunisian
  // invitations use. The time is forced to 24h: the locale default would print
  // "07:00 م" for a 19:00 reception.
  const formattedDate = eventDate.toLocaleDateString('ar-TN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const eventTime = eventDate.toLocaleTimeString('ar-TN', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  })

  const heroTitle = wedding.wedding_day_text || 'ليلة العمر'
  // custom_font_size est un pourcentage. Appliqué comme facteur sur la taille de
  // base du titre plutôt qu'en font-size:%, qui se calculerait sur le parent.
  const titleScale = (wedding.custom_font_size ?? 100) / 100
  const hasVideo = !!wedding.intro_video_url && !videoFailed

  // No envelope to open: the invitation shows straight away. The shared hook
  // starts closed for every other template, so it is opened here on mount.
  useEffect(() => {
    openEnvelope()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Autoplay needs muted; some browsers still refuse, so failure is silent.
  useEffect(() => {
    if (!opened || !hasVideo) return
    heroVideoRef.current?.play().catch(() => {})
  }, [opened, hasVideo])

  const program: ProgramItem[] = Array.isArray(wedding.program) ? wedding.program : []
  const parties = (wedding.show_celebrations ?? true) ? (wedding.parties ?? []) : []

  return (
    <>
      <link
        href={`https://fonts.googleapis.com/css2?family=${theme.googleFonts}&display=swap`}
        rel="stylesheet"
      />
      <style>{CSS(theme.display, theme.body, titleScale, palette)}</style>
      <FontOverride font={wedding.custom_font} fontSize={wedding.custom_font_size} container=".sa-root" />

      <div className="sa-root" dir="rtl" lang="ar">
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

                <div className="sa-hero-rule sa-anim" style={{ animationDelay: '0.5s' }}>
                  <span /><i>✦</i><span />
                </div>

                <div className="sa-hero-date sa-anim" style={{ animationDelay: '0.65s' }}>
                  {formattedDate}
                </div>
                <div className="sa-hero-time sa-anim" style={{ animationDelay: '0.75s' }}>
                  {eventTime}
                </div>
              </div>
            </div>
          </header>

          {/* ─── MOT D'ACCUEIL ─── */}
          {(wedding.families_intro_ar || wedding.custom_message) && (
            <section className="sa-section sa-welcome">
              {wedding.families_intro_ar && (
                <h2 className="sa-welcome-intro">{wedding.families_intro_ar}</h2>
              )}
              {wedding.custom_message && (
                <p className="sa-welcome-text">{wedding.custom_message}</p>
              )}
            </section>
          )}

          {/* ─── COMPTE À REBOURS ─── */}
          {wedding.show_countdown !== false && (
            <section className="sa-section">
              <p className="sa-label">العد التنازلي</p>
              <h2 className="sa-title">يقترب اليوم الموعود</h2>
              <div className="sa-countdown">
                {([['يوم', countdown.d], ['ساعة', countdown.h], ['دقيقة', countdown.m], ['ثانية', countdown.s]] as const).map(([label, value]) => (
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
              <p className="sa-label">الاحتفالات</p>
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
              <p className="sa-label">برنامج الحفل</p>
              <h2 className="sa-title">ترتيب الأحداث</h2>
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
            <p className="sa-label">مكان الحفل</p>
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

          {/* ─── RSVP ─── */}
          {wedding.show_rsvp && (
            <section className="sa-section sa-rsvp">
              <p className="sa-label">تأكيد الحضور</p>
              <h2 className="sa-title">هل ستشرفوننا<br />بحضوركم؟</h2>
              {rsvpStatus === 'done' ? (
                <p className="sa-success">جزاكم الله خيراً • Merci pour votre réponse ۞</p>
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
                    <label className="sa-field-label">Accompagnants</label>
                    <input className="sa-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                  </div>
                  <div className="sa-field">
                    <label className="sa-field-label">Message (optionnel)</label>
                    <textarea className="sa-input sa-textarea" name="note" placeholder="Un mot pour les mariés..." />
                  </div>
                  <button className="sa-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                    {rsvpStatus === 'loading' ? 'Envoi...' : '۞  Confirmer ma présence  ۞'}
                  </button>
                </form>
              )}
              <AddToCalendar wedding={wedding} />
            </section>
          )}

          {/* ─── LIVRE D'OR ─── */}
          {wedding.show_guestbook && (
            <section className="sa-section">
              <p className="sa-label">دفتر التهاني</p>
              <h2 className="sa-title">تهانيكم<br />ودعواتكم</h2>
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
                  {gbPending ? 'En attente de validation ۞' : 'Message publié ۞'}
                </p>
              ) : (
                <form className="sa-form" onSubmit={submitMessage} dir="ltr">
                  <div className="sa-field">
                    <label className="sa-field-label">Votre prénom</label>
                    <input className="sa-input" name="author_name" placeholder="ex. Yasmine..." required />
                  </div>
                  <div className="sa-field">
                    <label className="sa-field-label">Vos vœux</label>
                    <textarea className="sa-input sa-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                  </div>
                  <button className="sa-submit" type="submit" disabled={gbStatus === 'loading'}>
                    {gbStatus === 'loading' ? 'Envoi...' : '۞  Publier mon message  ۞'}
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
    </>
  )
}

const CSS = (display: string, body: string, titleScale: number, p: BismillahPalette) => `
.sa-root {
  --sa-night:    ${p.bg};
  --sa-gold:     ${p.accent};
  --sa-gold-dim: ${p.border};
  --sa-soft:     ${p.accentSoft};
  --sa-cream:    ${p.textPrimary};
  --sa-second:   ${p.textSecondary};
  --sa-muted:    ${p.textMuted};
  --sa-title-scale: ${titleScale};
  --sa-display: ${display};
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
  background: color-mix(in srgb, var(--sa-night) 62%, transparent);
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
  font-family: var(--sa-display);
  font-size: calc(52px * var(--sa-title-scale));
  color: var(--sa-gold);
  line-height: 1.45;
}
.sa-hero-date {
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
.sa-hero-rule {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0;
}
.sa-hero-rule span { width: 62px; height: 1px; background: var(--sa-gold-dim); }
.sa-hero-rule i    { color: var(--sa-gold); font-size: 11px; font-style: normal; }

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
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--sa-gold);
  margin-bottom: 8px;
}
.sa-title {
  font-family: var(--sa-display);
  font-size: clamp(1.8rem, 4.5vw, 2.4rem);
  font-weight: 700;
  color: var(--sa-cream);
  line-height: 1.4;
  margin-bottom: 26px;
}
/* pre-line : la phrase d'introduction est saisie sur plusieurs lignes. */
.sa-welcome-intro { font-family: var(--sa-display); font-size: 25px; line-height: 1.9; margin-bottom: 16px; font-weight: 400; white-space: pre-line; }
.sa-welcome-text  { font-size: 17px; line-height: 2.1; color: var(--sa-muted); }

/* ── Compte à rebours ── */
.sa-countdown { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.sa-cd-cell {
  min-width: 74px;
  padding: 14px 8px;
  border: 1px solid var(--sa-gold-dim);
}
.sa-cd-num   { font-size: 27px; font-weight: 700; color: var(--sa-gold); line-height: 1; }
.sa-cd-label { font-size: 12px; color: var(--sa-muted); margin-top: 7px; }

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
  border-bottom: 1px solid color-mix(in srgb, var(--sa-gold) 12%, transparent);
  text-align: right;
}
.sa-program-row:last-child { border-bottom: none; }
.sa-program-time  { min-width: 62px; color: var(--sa-gold); font-weight: 700; font-size: 16px; }
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
.sa-form { display: flex; flex-direction: column; gap: 14px; text-align: left; }
.sa-field { display: flex; flex-direction: column; gap: 6px; }
.sa-field-label {
  font-family: var(--sa-body);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  color: var(--sa-muted);
}
.sa-input {
  width: 100%;
  padding: 13px 15px;
  background: var(--sa-soft);
  border: 1px solid color-mix(in srgb, var(--sa-gold) 26%, transparent);
  color: var(--sa-cream);
  font-family: var(--sa-body);
  font-size: 15px;
  outline: none;
  transition: border-color 0.25s ease;
}
.sa-input::placeholder { color: var(--sa-muted); opacity: 0.7; }
.sa-input:focus { border-color: var(--sa-gold); }
.sa-textarea { min-height: 96px; resize: vertical; }
.sa-choices { display: flex; gap: 8px; flex-wrap: wrap; }
.sa-choice {
  flex: 1;
  min-width: 96px;
  padding: 11px 8px;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--sa-gold) 26%, transparent);
  color: var(--sa-muted);
  font-family: var(--sa-body);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.sa-choice-on { border-color: var(--sa-gold); color: var(--sa-gold); background: color-mix(in srgb, var(--sa-gold) 9%, transparent); }
.sa-submit {
  padding: 14px;
  margin-top: 4px;
  background: var(--sa-gold);
  border: none;
  color: var(--sa-night);
  font-family: var(--sa-body);
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.25s ease;
}
.sa-submit:disabled { opacity: 0.55; cursor: default; }
.sa-success { font-family: var(--sa-display); font-size: 20px; color: var(--sa-gold); }

/* ── Livre d'or ── */
.sa-messages { display: flex; flex-direction: column; gap: 14px; margin-bottom: 26px; }
.sa-message { padding: 17px; border: 1px solid color-mix(in srgb, var(--sa-gold) 16%, transparent); }
.sa-message-text   { font-size: 16px; line-height: 1.9; }
.sa-message-author { font-size: 13px; color: var(--sa-gold); margin-top: 9px; }

/* ── Pied de page ── */
.sa-footer { padding: 44px 20px 56px; text-align: center; }
.sa-footer-orn   { color: var(--sa-gold); font-size: 13px; margin-bottom: 14px; }
.sa-footer-title { font-family: var(--sa-display); font-size: calc(26px * var(--sa-title-scale)); color: var(--sa-gold); }

/* ── Responsive ── */
@media (max-width: 640px) {
  .sa-hero-panel   { max-width: 100%; height: 84vh; min-height: 460px; }
  .sa-hero-content { padding-top: 5vh; }
  .sa-hero-title   { font-size: calc(40px * var(--sa-title-scale)); }
  .sa-hero-date    { font-size: 19px; }
  .sa-section      { padding: 44px 20px; }
}
@media (max-width: 380px) {
  .sa-hero-title { font-size: calc(33px * var(--sa-title-scale)); }
  .sa-hero-rule span { width: 44px; }
  .sa-cd-cell { min-width: 64px; }
}
`
