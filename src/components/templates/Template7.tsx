'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import OpeningScreen from '@/components/common/OpeningScreen'

const DECO_KEY      = 'assets/template7/deco7.png'
const ROSE_LR_KEY   = 'assets/template7/rose gauche et droite.png'
const ROSE_MINI_KEY = 'assets/template7/petite rose centrale.png'
const DECO_W = 857, DECO_H = 1200
const T7_TOP    = 14
const T7_BOTTOM = 14
const decoWidthVh = (DECO_W / DECO_H * 100).toFixed(2) // "71.42"

const P = {
  gold:          '#B8924A',
  goldDark:      '#8B6914',
  wine:          '#7B3A55',
  bg:            '#f8f3ef',
  textPrimary:   '#2C1A10',
  textSecondary: '#5A3A28',
  textMuted:     '#8B6A5A',
  border:        'rgba(184,146,74,0.22)',
  borderSoft:    'rgba(184,146,74,0.12)',
}

export default function Template7({ wedding }: { wedding: Wedding }) {
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate,
  } = useInvitationLogic(wedding)

  const monthFr = eventDate.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()
  const dayNum  = eventDate.getDate()
  const yearNum = eventDate.getFullYear()
  const timeFr  = eventDate.toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' })
  const dateFr  = eventDate.toLocaleDateString('fr-TN', { day: 'numeric', month: 'long', year: 'numeric' })

  const brideName = wedding.bride_name
  const groomName = wedding.groom_name

  return (
    <>
      {!opened && <OpeningScreen onOpen={openEnvelope} bgColor={P.bg} />}
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap"
        rel="stylesheet"
      />

      <style>{`
        body { background-color: ${P.bg}; }

        @media (max-width: 768px) {
          .t7-deco-fixed { left: 0; width: 100vw; height: 100vh; height: 100dvh; }
          .t7-texture-bg { min-height: 100vh; min-height: 100dvh; }
          .t7-hero, .t7-section, .t7-rsvp-wrap, .t7-gb-wrap, .t7-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .t7-content-zone { width: 65vw; }
          .t7-hero .t7-content-zone { padding-top: ${T7_TOP}vh; padding-bottom: 4vh; }
          .t7-section .t7-content-zone,
          .t7-rsvp-wrap .t7-content-zone,
          .t7-gb-wrap .t7-content-zone { padding-top: 3vh; padding-bottom: 3vh; }
          .t7-footer .t7-content-zone { padding-top: 2vh; padding-bottom: ${T7_BOTTOM}vh; }
        }
        @media (min-width: 769px) {
          .t7-deco-fixed { left: 50%; transform: translateX(-50%); width: ${decoWidthVh}vh; height: 100vh; height: 100dvh; }
          .t7-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .t7-hero, .t7-section, .t7-rsvp-wrap, .t7-gb-wrap, .t7-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .t7-content-zone { width: calc(${decoWidthVh}vh * 0.62); }
          .t7-hero .t7-content-zone { padding-top: ${T7_TOP}vh; padding-bottom: 4vh; }
          .t7-section .t7-content-zone,
          .t7-rsvp-wrap .t7-content-zone,
          .t7-gb-wrap .t7-content-zone { padding-top: 3vh; padding-bottom: 3vh; }
          .t7-footer .t7-content-zone { padding-top: 2vh; padding-bottom: ${T7_BOTTOM}vh; }
        }
      `}</style>

      <style>{buildCSS()}</style>
      <FontOverride font={wedding.custom_font} container=".t7-invitation" />

      <div className={`t7-invitation${visible ? ' t7-visible' : ''}`}>

        {/* Cadre floral fixe */}
        <img src={`/${DECO_KEY}`} alt="" className="t7-deco-fixed" aria-hidden="true" />

        <div className="t7-texture-bg">

          {/* ══ HERO ══ */}
          <section className="t7-hero">
            <div className="t7-content-zone">

              <p className="t7-wedding-of">Mariage de</p>

              <p className="t7-name" data-ef="bride_name">{brideName}</p>

              <div className="t7-rose-row">
                <img src={`/${ROSE_LR_KEY}`} alt="" className="t7-rose-lr" aria-hidden="true" />
                <span className="t7-amp">&amp;</span>
              </div>

              <p className="t7-name" data-ef="groom_name">{groomName}</p>

              <div className="t7-rose-mini-wrap">
                <div className="t7-thin-line" />
                <img src={`/${ROSE_MINI_KEY}`} alt="" className="t7-rose-mini" aria-hidden="true" />
                <div className="t7-thin-line" />
              </div>

              <p className="t7-std">Réservez cette date</p>

              <div className="t7-date-block">
                <span className="t7-date-month">{monthFr}</span>
                <span className="t7-date-day">{dayNum}</span>
                <span className="t7-date-year">{yearNum}</span>
              </div>

              <p className="t7-time">{timeFr}</p>

              {wedding.venue_name    && <p className="t7-venue" data-ef="venue_name">{wedding.venue_name}</p>}
              {wedding.venue_address && <p className="t7-addr">{wedding.venue_address}</p>}

              {(wedding.gps_google || wedding.gps_apple) && (
                <div className="t7-maps-row" dir="ltr">
                  {wedding.gps_google && <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="t7-map-link">Google Maps</a>}
                  {wedding.gps_apple  && <a href={wedding.gps_apple}  target="_blank" rel="noreferrer" className="t7-map-link">Apple Maps</a>}
                </div>
              )}
            </div>
          </section>

          {/* ══ COMPTE À REBOURS ══ */}
          {wedding.show_countdown && (
            <section className="t7-section">
              <div className="t7-content-zone">
                <p className="t7-label">Compte à rebours</p>
                <h2 className="t7-title">Le Grand Jour approche</h2>
                <div className="t7-countdown" dir="ltr">
                  {[
                    { val: countdown.d, label: 'Jours' },
                    { val: countdown.h, label: 'Heures' },
                    { val: countdown.m, label: 'Minutes' },
                    { val: countdown.s, label: 'Secondes' },
                  ].map((item, i) => (
                    <div key={i} className="t7-cd">
                      <div className="t7-cd-num">{item.val}</div>
                      <div className="t7-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ PROGRAMME ══ */}
          {wedding.show_program !== false && wedding.program?.length > 0 && (
            <section className="t7-section">
              <div className="t7-content-zone">
                <p className="t7-label">Déroulement</p>
                <h2 className="t7-title">Programme de la Soirée</h2>
                <div className="t7-program">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <div key={i} className="t7-prog-item">
                      <div className="t7-prog-time">{item.time}</div>
                      <div className="t7-prog-dot">✦</div>
                      <div className="t7-prog-content">
                        <div className="t7-prog-event">{item.event}</div>
                        {item.venue && <div className="t7-prog-venue">{item.venue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ RSVP ══ */}
          {wedding.show_rsvp && (
            <section className="t7-rsvp-wrap">
              <div className="t7-content-zone">
                <div className="t7-card">
                  <p className="t7-label">Confirmation</p>
                  <h2 className="t7-card-title">Serez-vous<br />des nôtres ?</h2>
                  <div className="t7-thin-line t7-thin-line-center" />
                  {rsvpStatus === 'done' ? (
                    <p className="t7-success">Merci ! Votre réponse a bien été enregistrée.</p>
                  ) : (
                    <form className="t7-form" onSubmit={submitRSVP} dir="ltr">
                      <div className="t7-field">
                        <label className="t7-field-label">Nom complet</label>
                        <input className="t7-input" name="name" placeholder="Prénom et nom..." required />
                      </div>
                      <div className="t7-field">
                        <label className="t7-field-label">WhatsApp</label>
                        <input className="t7-input" name="phone" placeholder="+216 ..." />
                      </div>
                      <div className="t7-field">
                        <label className="t7-field-label">Présence</label>
                        <div className="t7-radios">
                          {(['present', 'absent', 'maybe'] as const).map(s => (
                            <button key={s} type="button"
                              className={`t7-radio${rsvpChoice === s ? ' t7-radio-on' : ''}`}
                              onClick={() => setRsvpChoice(s)}
                            >
                              {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'En attente'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="t7-field">
                        <label className="t7-field-label">Accompagnants</label>
                        <input className="t7-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                      </div>
                      <div className="t7-field">
                        <label className="t7-field-label">Message optionnel</label>
                        <textarea className="t7-input t7-textarea" name="note" placeholder="Une note pour les mariés..." />
                      </div>
                      <button className="t7-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
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
            <section className="t7-gb-wrap">
              <div className="t7-content-zone">
                <div className="t7-card">
                  <p className="t7-label">Livre d&apos;or</p>
                  <h2 className="t7-card-title">Laissez votre<br />message</h2>
                  <div className="t7-thin-line t7-thin-line-center" />
                  {messages.length > 0 && (
                    <div className="t7-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className="t7-msg">
                          <p className="t7-msg-text">{msg.message}</p>
                          <p className="t7-msg-author">— {msg.author_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {gbStatus === 'done' ? (
                    <p className="t7-success">
                      {gbPending ? 'En attente de validation' : 'Message publié'}
                    </p>
                  ) : (
                    <form className="t7-form" onSubmit={submitMessage} dir="ltr">
                      <div className="t7-field">
                        <label className="t7-field-label">Votre prénom</label>
                        <input className="t7-input" name="author_name" placeholder="ex. Yasmine..." required />
                      </div>
                      <div className="t7-field">
                        <label className="t7-field-label">Vos vœux</label>
                        <textarea className="t7-input t7-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                      </div>
                      <button className="t7-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                        {gbStatus === 'loading' ? 'Envoi...' : 'Publier mon message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══ FOOTER ══ */}
          <footer className="t7-footer">
            <div className="t7-content-zone">
              <div className="t7-footer-inner">
                <div className="t7-footer-names">{brideName} &amp; {groomName}</div>
                <div className="t7-footer-date">{dateFr}</div>
                <div className="t7-footer-credit">Élégance Digitale™</div>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}

function buildCSS(): string {
  return `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Raleway', sans-serif; color: ${P.textPrimary}; overflow-x: hidden; }

  .t7-invitation {
    opacity: 0; transform: translateY(20px);
    transition: opacity .9s, transform .9s;
    font-family: 'Raleway', sans-serif;
  }
  .t7-invitation.t7-visible { opacity: 1; transform: none; }

  /* z-index 10 pour que le cadre passe AU-DESSUS du fond */
  .t7-deco-fixed {
    position: fixed; top: 0;
    pointer-events: none; z-index: 10;
    object-fit: fill;
  }

  .t7-texture-bg {
    position: relative; z-index: 1;
    background-color: ${P.bg};
    min-height: 100vh;
  }

  .t7-hero, .t7-section, .t7-rsvp-wrap, .t7-gb-wrap, .t7-footer {
    width: 100%; position: relative; background: transparent;
  }

  /* ── HERO ── */
  .t7-wedding-of {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    color: ${P.textMuted};
    letter-spacing: .12em;
    margin-bottom: 4px; text-align: center;
  }
  .t7-name {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(2.4rem, 8vw, 3.8rem);
    color: ${P.textPrimary};
    line-height: 1.1; margin: 0; text-align: center;
  }
  .t7-rose-row {
    position: relative; width: 100%;
    margin: 2px 0;
    display: flex; align-items: center; justify-content: center;
  }
  .t7-rose-lr { width: 100%; display: block; opacity: .88; }
  .t7-amp {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.4rem, 4vw, 2.2rem);
    color: ${P.gold}; line-height: 1;
  }
  .t7-rose-mini-wrap {
    display: flex; align-items: center; gap: 10px;
    width: 100%; margin: 8px 0;
  }
  .t7-thin-line { flex: 1; height: 1px; background: ${P.border}; }
  .t7-thin-line-center { width: 60px; margin: 6px auto 10px; flex: unset; }
  .t7-rose-mini { height: 18px; width: auto; opacity: .75; }

  .t7-std {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.2rem, 3.5vw, 1.8rem);
    color: ${P.gold};
    letter-spacing: .08em;
    margin: 4px 0; text-align: center;
  }
  .t7-date-block {
    display: flex; align-items: baseline; justify-content: center;
    gap: 10px; margin: 4px 0;
  }
  .t7-date-month, .t7-date-year {
    font-size: clamp(.56rem, 1.6vw, .7rem);
    letter-spacing: .25em; text-transform: uppercase;
    color: ${P.textSecondary}; font-weight: 500;
  }
  .t7-date-day {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.8rem, 5.5vw, 2.8rem);
    color: ${P.textPrimary}; line-height: 1;
  }
.t7-time {
    font-size: clamp(.56rem, 1.6vw, .7rem);
    letter-spacing: .3em; text-transform: uppercase;
    color: ${P.gold}; margin: 4px 0; text-align: center;
  }
  .t7-venue {
    font-size: clamp(.68rem, 1.9vw, .84rem);
    font-weight: 600; color: ${P.textPrimary};
    margin: 10px 0 2px; text-align: center;
  }
  .t7-addr {
    font-size: clamp(.56rem, 1.5vw, .68rem);
    color: ${P.textMuted}; text-align: center;
    letter-spacing: .05em; margin-bottom: 10px;
  }
  .t7-maps-row { display: flex; gap: 16px; justify-content: center; margin-top: 8px; }
  .t7-map-link {
    font-size: .46rem; letter-spacing: .14em; text-transform: uppercase;
    color: ${P.gold}; text-decoration: none;
    border-bottom: 1px solid rgba(184,146,74,.35); padding-bottom: 2px;
  }

  /* ── SECTIONS ── */
  .t7-label {
    font-size: .5rem; letter-spacing: .32em; text-transform: uppercase;
    color: ${P.gold}; margin-bottom: 6px; font-weight: 600; text-align: center;
  }
  .t7-title {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.8rem, 5vw, 2.6rem);
    color: ${P.textPrimary}; font-weight: 400; text-align: center; margin-bottom: 16px;
  }

  /* COUNTDOWN */
  .t7-countdown { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; direction: ltr; }
  .t7-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 60px; padding: 12px 8px;
    background: rgba(255,255,255,.75);
    border: 1px solid ${P.border};
  }
  .t7-cd-num   { font-size: 1.8rem; color: ${P.gold}; line-height: 1; font-weight: 300; }
  .t7-cd-label { font-size: .44rem; color: ${P.textMuted}; margin-top: 6px; letter-spacing: .1em; text-transform: uppercase; }

  /* PROGRAMME */
  .t7-program { display: flex; flex-direction: column; width: 100%; }
  .t7-prog-item {
    display: grid; grid-template-columns: 65px 14px 1fr; gap: 10px;
    align-items: center; padding: 10px 0;
    border-bottom: 1px solid ${P.borderSoft};
  }
  .t7-prog-item:last-child { border-bottom: none; }
  .t7-prog-time  { font-size: 1.05rem; color: ${P.gold}; }
  .t7-prog-dot   { color: ${P.gold}; font-size: .65rem; text-align: center; }
  .t7-prog-event { font-size: .86rem; color: ${P.textSecondary}; font-weight: 500; }
  .t7-prog-venue { font-size: .74rem; color: ${P.textMuted}; margin-top: 2px; }

  /* CARD */
  .t7-card {
    width: 100%;
    background: rgba(255,255,255,.75);
    border: 1px solid ${P.border};
    padding: 24px 20px 16px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .t7-card-title {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    color: ${P.textPrimary}; font-weight: 400; line-height: 1.2; margin: 6px 0 8px;
  }

  /* FORM */
  .t7-form { width: 100%; display: flex; flex-direction: column; text-align: left; direction: ltr; margin-top: 6px; }
  .t7-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
  .t7-field-label { font-size: .44rem; letter-spacing: .24em; text-transform: uppercase; color: ${P.gold}; font-weight: 600; }
  .t7-input {
    width: 100%; padding: 10px 14px;
    background: rgba(255,255,255,.8);
    border: 1px solid rgba(184,146,74,.2); border-radius: 6px;
    color: ${P.textPrimary};
    font-family: 'Raleway', sans-serif; font-size: .9rem; font-weight: 300;
    outline: none; transition: border-color .25s;
  }
  .t7-input::placeholder { color: rgba(139,106,90,.4); }
  .t7-input:focus { border-color: ${P.gold}; }
  .t7-textarea { resize: vertical; min-height: 88px; }

  .t7-radios { display: flex; gap: 6px; width: 100%; }
  .t7-radio {
    flex: 1; min-width: 0; padding: 9px 4px;
    background: transparent; border: 1px solid rgba(184,146,74,.25); border-radius: 6px;
    color: ${P.textMuted}; font-size: .4rem; letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: all .2s; font-family: 'Raleway', sans-serif;
  }
  .t7-radio-on, .t7-radio:hover { background: ${P.gold}; border-color: ${P.gold}; color: #fff; }

  .t7-btn-submit {
    width: 100%; padding: 13px;
    background: ${P.gold}; border: none; border-radius: 4px;
    color: #fff; font-family: 'Raleway', sans-serif;
    font-size: .46rem; letter-spacing: .22em; text-transform: uppercase; font-weight: 600;
    cursor: pointer; transition: background .3s; margin-top: 4px;
  }
  .t7-btn-submit:hover { background: ${P.goldDark}; }
  .t7-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  .t7-success { font-style: italic; color: ${P.gold}; padding: 16px; font-size: .9rem; }

  /* MESSAGES */
  .t7-messages { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 14px; text-align: left; }
  .t7-msg { border-bottom: 1px solid ${P.borderSoft}; padding: 10px 0; }
  .t7-msg-text   { color: ${P.textSecondary}; line-height: 1.8; font-size: .86rem; }
  .t7-msg-author { margin-top: 4px; font-size: .48rem; color: ${P.gold}; letter-spacing: .08em; }

  /* FOOTER */
  .t7-footer-inner { width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .t7-footer-names {
    font-family: 'Great Vibes', cursive; font-size: 2.2rem;
    color: ${P.textPrimary}; margin-bottom: 4px; font-weight: 400; text-align: center; width: 100%;
  }
  .t7-footer-date   { font-size: .68rem; color: ${P.textMuted}; margin-bottom: 14px; text-align: center; width: 100%; }
  .t7-footer-credit { font-size: .4rem; letter-spacing: .18em; color: ${P.gold}; opacity: .55; text-transform: uppercase; text-align: center; width: 100%; }

  @media (max-width: 600px) {
    .t7-cd { min-width: 54px; padding: 10px 6px; }
    .t7-cd-num { font-size: 1.5rem; }
    .t7-prog-item { grid-template-columns: 52px 12px 1fr; gap: 8px; }
  }
`
}
