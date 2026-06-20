'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import OpeningScreen from '@/components/common/OpeningScreen'
import { getRosesIvoireVariant, RosesIvoireVariant } from '@/lib/template-variants'

const DEFAULT_DECO = 'assets/template4/deco4.png'
const RINGS_KEY = 'assets/template4/rings.png'
const BARRE_KEY = 'assets/template4/barre entre les noms.png'
const DECO_W = 1500, DECO_H = 2100
const RI_TOP    = 12  // vh — zone sûre haute (intérieur cadre)
const RI_BOTTOM = 10  // vh — zone sûre basse
const decoWidthVh = (DECO_W / DECO_H * 100).toFixed(2) // "71.43"

export default function RosesIvoire({ wedding }: { wedding: Wedding }) {
  const P = getRosesIvoireVariant(wedding.template_variant)
  const DECO_KEY = wedding.decoration_image ?? DEFAULT_DECO
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate, introText,
  } = useInvitationLogic(wedding)


  const monthEn = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const dayNum  = eventDate.getDate().toString()
  const yearNum = eventDate.getFullYear().toString()
  const timeFr  = eventDate.toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' })
  const dateFr  = eventDate.toLocaleDateString('fr-TN', { day: 'numeric', month: 'long', year: 'numeric' })

  const brideName = wedding.bride_name_ar || wedding.bride_name
  const groomName = wedding.groom_name_ar || wedding.groom_name
  const ampChar   = wedding.bride_name_ar ? 'و' : '&'

  return (
    <>
      {!opened && <OpeningScreen onOpen={openEnvelope} bgColor={P.bg} />}
      <link
        href="https://fonts.googleapis.com/css2?family=Parisienne&family=IBM+Plex+Serif:wght@300;400;500&family=Raleway:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Overrides responsive */}
      <style>{`
        body { background-color: ${P.bg}; }

        @media (max-width: 768px) {
          .ri-deco-fixed { left: 0; width: 100vw; height: 100vh; height: 100dvh; }
          .ri-texture-bg { min-height: 100vh; min-height: 100dvh; }
          .ri-hero, .ri-section, .ri-rsvp-wrap, .ri-gb-wrap, .ri-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .ri-content-zone { width: 82vw; padding-top: ${RI_TOP}vh; padding-bottom: ${RI_BOTTOM}vh; }
          .ri-footer .ri-content-zone { padding-top: 16px; padding-bottom: ${RI_BOTTOM}vh; }
        }
        @media (min-width: 769px) {
          .ri-deco-fixed { left: 50%; transform: translateX(-50%); width: ${decoWidthVh}vh; height: 100vh; }
          .ri-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .ri-hero, .ri-section, .ri-rsvp-wrap, .ri-gb-wrap, .ri-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .ri-content-zone { width: 82vw; padding-top: ${RI_TOP}vh; padding-bottom: ${RI_BOTTOM}vh; }
          .ri-footer .ri-content-zone { padding-top: 16px; padding-bottom: ${RI_BOTTOM}vh; }
        }
      `}</style>

      <style>{buildCSS(P)}</style>
      <FontOverride font={wedding.custom_font} container=".ri-invitation" />

      <div className={`ri-invitation${visible ? ' ri-visible' : ''}`}>

        {/* Cadre doré fixe */}
        <img src={`/${DECO_KEY}`} alt="" className="ri-deco-fixed" aria-hidden="true" />

        <div className="ri-texture-bg">

          {/* ══ HERO ══ */}
          <section className="ri-hero">
            <div className="ri-content-zone">

              {/* Anneaux */}
              <img src={`/${RINGS_KEY}`} alt="" className="ri-rings" aria-hidden="true" />

              {/* Intro boxé */}
              <div className="ri-box">
                <p className="ri-box-text">{introText}</p>
              </div>

              {/* Noms + barre */}
              <div className="ri-names">
                <span className="ri-name">{brideName}</span>
                <img src={`/${BARRE_KEY}`} alt="&" className="ri-barre" />
                <span className="ri-name">{groomName}</span>
              </div>

              {/* Date 3 cases */}
              <div className="ri-date-row" dir="ltr">
                <div className="ri-date-cell ri-date-month">{monthEn}</div>
                <div className="ri-date-cell ri-date-day">{dayNum}</div>
                <div className="ri-date-cell ri-date-year">{yearNum}</div>
              </div>

              {/* Heure */}
              <p className="ri-time-txt">{timeFr}</p>

              {/* Lieu */}
              {wedding.venue_name    && <p className="ri-venue-txt">{wedding.venue_name}</p>}
              {wedding.venue_address && <p className="ri-addr-txt">{wedding.venue_address}</p>}

              {/* Maps */}
              {(wedding.gps_google || wedding.gps_apple) && (
                <div className="ri-maps-mini" dir="ltr">
                  {wedding.gps_google && <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="ri-map-link">Google Maps</a>}
                  {wedding.gps_apple  && <a href={wedding.gps_apple}  target="_blank" rel="noreferrer" className="ri-map-link">Apple Maps</a>}
                </div>
              )}

              {/* Réception box */}
              <div className="ri-box ri-box-bottom">
                <p className="ri-box-text">RÉCEPTION À SUIVRE</p>
              </div>
            </div>
          </section>

          {/* ══ COMPTE À REBOURS ══ */}
          {wedding.show_countdown && (
            <section className="ri-section">
              <div className="ri-content-zone">
                <p className="ri-label">Compte à rebours</p>
                <h2 className="ri-title">Le Grand Jour approche</h2>
                <div className="ri-countdown" dir="ltr">
                  {[
                    { val: countdown.d, label: 'Jours' },
                    { val: countdown.h, label: 'Heures' },
                    { val: countdown.m, label: 'Minutes' },
                    { val: countdown.s, label: 'Secondes' },
                  ].map((item, i) => (
                    <div key={i} className="ri-cd">
                      <div className="ri-cd-num">{item.val}</div>
                      <div className="ri-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ PROGRAMME ══ */}
          {wedding.program?.length > 0 && (
            <section className="ri-section">
              <div className="ri-content-zone">
                <p className="ri-label">Déroulement</p>
                <h2 className="ri-title">Programme de la Soirée</h2>
                <div className="ri-program">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <div key={i} className="ri-prog-item">
                      <div className="ri-prog-time">{item.time}</div>
                      <div className="ri-prog-dot">◆</div>
                      <div className="ri-prog-content">
                        <div className="ri-prog-event">{item.event}</div>
                        {item.venue && <div className="ri-prog-venue">{item.venue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ RSVP ══ */}
          {wedding.show_rsvp && (
            <section className="ri-rsvp-wrap">
              <div className="ri-content-zone">
                <div className="ri-card">
                  <p className="ri-label">Confirmation</p>
                  <h2 className="ri-card-title">Serez-vous<br />des nôtres ?</h2>
                  <div className="ri-thin-line" />
                  {rsvpStatus === 'done' ? (
                    <p className="ri-success">Merci ! Votre réponse a bien été enregistrée.</p>
                  ) : (
                    <form className="ri-form" onSubmit={submitRSVP} dir="ltr">
                      <div className="ri-field">
                        <label className="ri-field-label">Nom complet</label>
                        <input className="ri-input" name="name" placeholder="Prénom et nom..." required />
                      </div>
                      <div className="ri-field">
                        <label className="ri-field-label">WhatsApp</label>
                        <input className="ri-input" name="phone" placeholder="+216 ..." />
                      </div>
                      <div className="ri-field">
                        <label className="ri-field-label">Présence</label>
                        <div className="ri-radios">
                          {(['present', 'absent', 'maybe'] as const).map(s => (
                            <button key={s} type="button"
                              className={`ri-radio${rsvpChoice === s ? ' ri-radio-on' : ''}`}
                              onClick={() => setRsvpChoice(s)}>
                              {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'En attente'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="ri-field">
                        <label className="ri-field-label">Accompagnants</label>
                        <input className="ri-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                      </div>
                      <div className="ri-field">
                        <label className="ri-field-label">Message optionnel</label>
                        <textarea className="ri-input ri-textarea" name="note" placeholder="Une note pour les mariés..." />
                      </div>
                      <button className="ri-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                        {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer ma présence'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══ LIVRE D'OR ══ */}
          {wedding.show_guestbook && (
            <section className="ri-gb-wrap">
              <div className="ri-content-zone">
                <div className="ri-card">
                  <p className="ri-label">Livre d'or</p>
                  <h2 className="ri-card-title">Laissez votre<br />message</h2>
                  <div className="ri-thin-line" />
                  {messages.length > 0 && (
                    <div className="ri-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className="ri-msg">
                          <p className="ri-msg-text">{msg.message}</p>
                          <p className="ri-msg-author">— {msg.author_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {gbStatus === 'done' ? (
                    <p className="ri-success">{gbPending ? 'En attente de validation' : 'Message publié'}</p>
                  ) : (
                    <form className="ri-form" onSubmit={submitMessage} dir="ltr">
                      <div className="ri-field">
                        <label className="ri-field-label">Votre prénom</label>
                        <input className="ri-input" name="author_name" placeholder="ex. Yasmine..." required />
                      </div>
                      <div className="ri-field">
                        <label className="ri-field-label">Vos vœux</label>
                        <textarea className="ri-input ri-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                      </div>
                      <button className="ri-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                        {gbStatus === 'loading' ? 'Envoi...' : 'Publier mon message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══ FOOTER ══ */}
          <footer className="ri-footer">
            <div className="ri-content-zone">
              <div className="ri-footer-inner">
                <div className="ri-footer-names">{brideName} {ampChar} {groomName}</div>
                <div className="ri-footer-date">{dateFr}</div>
                <div className="ri-footer-credit">Élégance Digitale™</div>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}

function buildCSS(P: RosesIvoireVariant): string {
  return `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Raleway', sans-serif; color: ${P.gold}; overflow-x: hidden; }

  .ri-invitation {
    opacity: 0; transform: translateY(20px);
    transition: opacity .9s, transform .9s;
    font-family: 'Raleway', sans-serif;
  }
  .ri-invitation.ri-visible { opacity: 1; transform: none; }

  .ri-deco-fixed {
    position: fixed; top: 0;
    pointer-events: none; z-index: 10; object-fit: fill;
  }
  @media (max-width: 768px) { .ri-deco-fixed { left: 0; } }
  @media (min-width: 769px) { .ri-deco-fixed { left: 50%; transform: translateX(-50%); } }

  .ri-texture-bg {
    position: relative; z-index: 1;
    background-color: ${P.bg}; min-height: 100vh;
  }
  .ri-hero, .ri-section, .ri-rsvp-wrap, .ri-gb-wrap, .ri-footer {
    width: 100%; position: relative; background: transparent;
  }

  /* ── HERO ── */
  .ri-rings {
    width: 58px; height: auto;
    display: block; margin: 0 auto 16px;
  }

  .ri-box {
    border: 1px solid ${P.gold};
    border-radius: 8px;
    padding: 9px 22px;
    display: flex; align-items: center; justify-content: center;
    width: fit-content; min-width: 170px;
    margin: 0 auto 20px; text-align: center;
  }
  .ri-box-text {
    font-family: 'IBM Plex Serif', serif;
    font-size: clamp(.4rem, 1.1vw, .52rem);
    letter-spacing: .18em; text-transform: uppercase;
    color: ${P.gold}; line-height: 1.7; font-weight: 400;
  }
  .ri-box-bottom { margin-top: 22px; margin-bottom: 0; }

  .ri-names {
    display: flex; flex-direction: column; align-items: center;
    margin-bottom: 18px;
  }
  .ri-name {
    font-family: 'Parisienne', cursive;
    font-size: clamp(2.4rem, 8vw, 3.8rem);
    color: ${P.gold}; line-height: 1.25; font-weight: 400;
  }
  .ri-barre {
    width: min(160px, 60%); height: auto;
    display: block; margin: 2px 0;
  }

  /* Date 3 cases */
  .ri-date-row {
    display: flex; align-items: stretch; justify-content: center;
    gap: 8px; margin-bottom: 14px;
  }
  .ri-date-cell {
    border: 1px solid ${P.gold}; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: ${P.gold};
  }
  .ri-date-month {
    font-family: 'IBM Plex Serif', serif;
    padding: 8px 14px; font-size: clamp(.54rem, 1.5vw, .68rem);
    font-weight: 400; letter-spacing: .16em; text-transform: uppercase;
  }
  .ri-date-day {
    font-family: 'Parisienne', cursive;
    padding: 6px 16px; font-size: clamp(2rem, 5.5vw, 2.8rem);
    font-weight: 400; line-height: 1;
  }
  .ri-date-year {
    font-family: 'IBM Plex Serif', serif;
    padding: 8px 14px; font-size: clamp(.54rem, 1.5vw, .68rem);
    font-weight: 400; letter-spacing: .16em;
  }

  .ri-time-txt {
    font-size: clamp(.42rem, 1.2vw, .52rem); letter-spacing: .2em; text-transform: uppercase;
    color: ${P.gold}; margin-bottom: 10px; text-align: center;
  }
  .ri-venue-txt {
    font-size: clamp(.5rem, 1.4vw, .62rem); letter-spacing: .14em; text-transform: uppercase;
    color: ${P.gold}; margin-bottom: 3px; text-align: center;
  }
  .ri-addr-txt {
    font-size: clamp(.44rem, 1.2vw, .55rem); letter-spacing: .12em; text-transform: uppercase;
    color: ${P.goldMid}; margin-bottom: 12px; text-align: center;
  }
  .ri-maps-mini { display: flex; gap: 16px; justify-content: center; margin-bottom: 10px; direction: ltr; }
  .ri-map-link {
    font-size: .44rem; letter-spacing: .14em; text-transform: uppercase;
    color: ${P.gold}; text-decoration: none;
    border-bottom: 1px solid rgba(130,103,75,.4); padding-bottom: 2px;
  }

  /* ── SECTIONS ── */
  .ri-label {
    font-size: .5rem; letter-spacing: .3em; text-transform: uppercase;
    color: ${P.gold}; margin-bottom: 6px; font-weight: 600; text-align: center;
  }
  .ri-title {
    font-family: 'Parisienne', cursive;
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    color: ${P.gold}; font-weight: 400; text-align: center; margin-bottom: 16px;
  }
  .ri-thin-line { width: 60px; height: 1px; background: ${P.border}; margin: 8px auto 14px; }

  /* COUNTDOWN */
  .ri-countdown { display: flex; align-items: stretch; justify-content: center; flex-wrap: wrap; }
  .ri-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 66px; padding: 12px 8px;
    border: 1px solid ${P.border};
  }
  .ri-cd + .ri-cd { border-left: none; }
  .ri-cd-num   { font-size: 1.8rem; color: ${P.gold}; line-height: 1; font-weight: 300; }
  .ri-cd-label { font-size: .44rem; color: ${P.goldMid}; margin-top: 6px; letter-spacing: .1em; text-transform: uppercase; }

  /* PROGRAMME */
  .ri-program { display: flex; flex-direction: column; width: 100%; }
  .ri-prog-item {
    display: grid; grid-template-columns: 65px 14px 1fr; gap: 10px;
    align-items: center; padding: 10px 0;
    border-bottom: 1px solid ${P.borderSoft};
  }
  .ri-prog-item:last-child { border-bottom: none; }
  .ri-prog-time  { font-size: 1rem; color: ${P.gold}; }
  .ri-prog-dot   { color: ${P.gold}; font-size: .6rem; text-align: center; }
  .ri-prog-event { font-size: .86rem; color: ${P.gold}; font-weight: 500; }
  .ri-prog-venue { font-size: .74rem; color: ${P.goldMid}; margin-top: 2px; }

  /* CARD */
  .ri-card {
    width: calc(100% - 32px); margin: 0 16px;
    background: rgba(255,255,255,.92);
    border: 1px solid ${P.border};
    padding: 22px 20px 16px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .ri-card-title {
    font-family: 'Parisienne', cursive;
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    color: ${P.gold}; font-weight: 400; line-height: 1.2; margin: 6px 0 8px;
  }

  /* FORM */
  .ri-form { width: 100%; display: flex; flex-direction: column; text-align: left; direction: ltr; margin-top: 6px; }
  .ri-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
  .ri-field-label { font-size: .44rem; letter-spacing: .22em; text-transform: uppercase; color: ${P.gold}; font-weight: 600; }
  .ri-input {
    width: 100%; padding: 10px 14px;
    background: #fff; border: 1px solid rgba(130,103,75,.25); border-radius: 4px;
    color: ${P.gold}; font-family: 'Raleway', sans-serif; font-size: .9rem; font-weight: 300;
    outline: none; transition: border-color .25s;
  }
  .ri-input::placeholder { color: rgba(130,103,75,.35); }
  .ri-input:focus { border-color: ${P.gold}; }
  .ri-textarea { resize: vertical; min-height: 88px; }

  .ri-radios { display: flex; gap: 6px; width: 100%; }
  .ri-radio {
    flex: 1; min-width: 0; padding: 9px 4px;
    background: transparent; border: 1px solid rgba(130,103,75,.3); border-radius: 4px;
    color: ${P.gold}; font-size: .4rem; letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: all .2s; font-family: 'Raleway', sans-serif;
  }
  .ri-radio-on, .ri-radio:hover { background: ${P.gold}; border-color: ${P.gold}; color: #fff; }

  .ri-btn-submit {
    width: 100%; padding: 12px;
    background: ${P.gold}; border: none; border-radius: 4px;
    color: #fff; font-family: 'Raleway', sans-serif;
    font-size: .46rem; letter-spacing: .22em; text-transform: uppercase; font-weight: 600;
    cursor: pointer; transition: background .3s; margin-top: 4px;
  }
  .ri-btn-submit:hover { background: ${P.goldDark}; }
  .ri-btn-submit:disabled { opacity: .5; cursor: not-allowed; }
  .ri-success { font-style: italic; color: ${P.gold}; padding: 16px; font-size: .9rem; }

  /* MESSAGES */
  .ri-messages { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 14px; text-align: left; }
  .ri-msg { border-bottom: 1px solid ${P.borderSoft}; padding: 10px 0; }
  .ri-msg-text   { color: ${P.gold}; line-height: 1.8; font-size: .86rem; }
  .ri-msg-author { margin-top: 4px; font-size: .48rem; color: ${P.goldMid}; letter-spacing: .08em; }

  /* FOOTER */
  .ri-footer-inner { width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .ri-footer-names {
    font-family: 'Parisienne', cursive; font-size: 2.2rem;
    color: ${P.gold}; margin-bottom: 4px; font-weight: 400; width: 100%; text-align: center;
  }
  .ri-footer-date   { font-size: .62rem; color: ${P.goldMid}; margin-bottom: 14px; letter-spacing: .08em; width: 100%; text-align: center; }
  .ri-footer-credit { font-size: .4rem; letter-spacing: .18em; color: ${P.gold}; opacity: .4; text-transform: uppercase; width: 100%; text-align: center; }

  @media (max-width: 600px) {
    .ri-date-month, .ri-date-year { padding: 7px 10px; }
    .ri-date-day { padding: 5px 12px; font-size: 1.8rem; }
    .ri-date-row { gap: 6px; }
    .ri-barre { width: min(140px, 55%); }
    .ri-cd { min-width: 54px; padding: 10px 6px; }
    .ri-cd-num { font-size: 1.5rem; }
    .ri-prog-item { grid-template-columns: 52px 12px 1fr; gap: 8px; }
  }
  `
}
