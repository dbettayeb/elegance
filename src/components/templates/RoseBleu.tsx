'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import OpeningScreen from '@/components/common/OpeningScreen'

const DECO_KEY = 'assets/template5/deco5.png'
const ROSE_KEY = 'assets/template5/rose bleu.png'
const DECO_W = 857, DECO_H = 1200
const RB_TOP    = 12
const RB_BOTTOM = 10
const decoWidthVh = (DECO_W / DECO_H * 100).toFixed(2) // "71.42"

const P = {
  blue:      '#6b8fa8',
  blueDark:  '#4a6b82',
  blueLight: '#8aafc8',
  bg:        '#f5ede0',
  border:    'rgba(107, 143, 168, 0.28)',
  borderSoft:'rgba(107, 143, 168, 0.15)',
}

export default function RoseBleu({ wedding }: { wedding: Wedding }) {
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate, introText,
  } = useInvitationLogic(wedding)


  const dateFr = eventDate.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()
  const timeFr = eventDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  })

  const brideName = wedding.bride_name
  const groomName = wedding.groom_name
  const ampChar   = '&'

  return (
    <>
      {!opened && <OpeningScreen onOpen={openEnvelope} bgColor={P.bg} />}
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Raleway:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        body { background-color: ${P.bg}; }

        @media (max-width: 768px) {
          .rb-bg-fixed { background-size: 100vw 100vh; background-position: center top; }
          .rb-deco-fixed { left: 0; width: 100vw; height: 100vh; height: 100dvh; }
          .rb-texture-bg { min-height: 100vh; min-height: 100dvh; }
          .rb-hero, .rb-section, .rb-rsvp-wrap, .rb-gb-wrap, .rb-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .rb-content-zone { width: 78vw; }
          .rb-hero .rb-content-zone { padding-top: ${RB_TOP}vh; padding-bottom: 4vh; }
          .rb-section .rb-content-zone,
          .rb-rsvp-wrap .rb-content-zone,
          .rb-gb-wrap .rb-content-zone { padding-top: 3vh; padding-bottom: 3vh; }
          .rb-footer .rb-content-zone { padding-top: 2vh; padding-bottom: ${RB_BOTTOM}vh; }
        }
        @media (min-width: 769px) {
          .rb-bg-fixed { background-size: ${decoWidthVh}vh 100vh; background-position: center top; }
          .rb-deco-fixed { left: 50%; transform: translateX(-50%); width: ${decoWidthVh}vh; height: 100vh; height: 100dvh; }
          .rb-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .rb-hero, .rb-section, .rb-rsvp-wrap, .rb-gb-wrap, .rb-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .rb-content-zone { width: calc(${decoWidthVh}vh * 0.78); }
          .rb-hero .rb-content-zone { padding-top: ${RB_TOP}vh; padding-bottom: 4vh; }
          .rb-section .rb-content-zone,
          .rb-rsvp-wrap .rb-content-zone,
          .rb-gb-wrap .rb-content-zone { padding-top: 3vh; padding-bottom: 3vh; }
          .rb-footer .rb-content-zone { padding-top: 2vh; padding-bottom: ${RB_BOTTOM}vh; }
        }
      `}</style>

      <style>{buildCSS()}</style>
      <FontOverride font={wedding.custom_font} container=".rb-invitation" />

      <div className={`rb-invitation${visible ? ' rb-visible' : ''}`}>

        {/* Fond papier fixe — reste en place pendant le scroll */}
        <div className="rb-bg-fixed" aria-hidden="true" />

        {/* Cadre décoratif fixe */}
        <img src={`/${DECO_KEY}`} alt="" className="rb-deco-fixed" aria-hidden="true" />

        <div className="rb-texture-bg">

          {/* ══ HERO ══ */}
          <section className="rb-hero">
            <div className="rb-content-zone">

              {/* Rose bleue */}
              <img src={`/${ROSE_KEY}`} alt="" className="rb-rose" aria-hidden="true" />

              {/* Intro */}
              <p className="rb-intro">{introText}</p>

              {/* Noms côte à côte */}
              <p className="rb-names-line">
                <span className="rb-name">{brideName}</span>
                <span className="rb-amp">{ampChar}</span>
                <span className="rb-name">{groomName}</span>
              </p>

              {/* Date */}
              <p className="rb-date-txt">{dateFr}</p>

              {/* Heure */}
              <p className="rb-time-txt">{timeFr}</p>

              {/* Lieu */}
              {wedding.venue_name    && <p className="rb-venue-txt">{wedding.venue_name}</p>}
              {wedding.venue_address && <p className="rb-addr-txt">{wedding.venue_address}</p>}

              {/* Maps */}
              {(wedding.gps_google || wedding.gps_apple) && (
                <div className="rb-maps-mini" dir="ltr">
                  {wedding.gps_google && <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="rb-map-link">Google Maps</a>}
                  {wedding.gps_apple  && <a href={wedding.gps_apple}  target="_blank" rel="noreferrer" className="rb-map-link">Apple Maps</a>}
                </div>
              )}
            </div>
          </section>

          {/* ══ COMPTE À REBOURS ══ */}
          {wedding.show_countdown && (
            <section className="rb-section">
              <div className="rb-content-zone">
                <p className="rb-label">Compte à rebours</p>
                <h2 className="rb-title">Le Grand Jour approche</h2>
                <div className="rb-countdown" dir="ltr">
                  {[
                    { val: countdown.d, label: 'Jours' },
                    { val: countdown.h, label: 'Heures' },
                    { val: countdown.m, label: 'Minutes' },
                    { val: countdown.s, label: 'Secondes' },
                  ].map((item, i) => (
                    <div key={i} className="rb-cd">
                      <div className="rb-cd-num">{item.val}</div>
                      <div className="rb-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ PROGRAMME ══ */}
          {wedding.program?.length > 0 && (
            <section className="rb-section">
              <div className="rb-content-zone">
                <p className="rb-label">Déroulement</p>
                <h2 className="rb-title">Programme de la Soirée</h2>
                <div className="rb-program">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <div key={i} className="rb-prog-item">
                      <div className="rb-prog-time">{item.time}</div>
                      <div className="rb-prog-dot">◆</div>
                      <div className="rb-prog-content">
                        <div className="rb-prog-event">{item.event}</div>
                        {item.venue && <div className="rb-prog-venue">{item.venue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ RSVP ══ */}
          {wedding.show_rsvp && (
            <section className="rb-rsvp-wrap">
              <div className="rb-content-zone">
                <div className="rb-card">
                  <p className="rb-label">Confirmation</p>
                  <h2 className="rb-card-title">Serez-vous<br />des nôtres ?</h2>
                  <div className="rb-thin-line" />
                  {rsvpStatus === 'done' ? (
                    <p className="rb-success">Merci ! Votre réponse a bien été enregistrée.</p>
                  ) : (
                    <form className="rb-form" onSubmit={submitRSVP} dir="ltr">
                      <div className="rb-field">
                        <label className="rb-field-label">Nom complet</label>
                        <input className="rb-input" name="name" placeholder="Prénom et nom..." required />
                      </div>
                      <div className="rb-field">
                        <label className="rb-field-label">WhatsApp</label>
                        <input className="rb-input" name="phone" placeholder="+216 ..." />
                      </div>
                      <div className="rb-field">
                        <label className="rb-field-label">Présence</label>
                        <div className="rb-radios">
                          {(['present', 'absent', 'maybe'] as const).map(s => (
                            <button key={s} type="button"
                              className={`rb-radio${rsvpChoice === s ? ' rb-radio-on' : ''}`}
                              onClick={() => setRsvpChoice(s)}>
                              {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'En attente'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="rb-field">
                        <label className="rb-field-label">Accompagnants</label>
                        <input className="rb-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                      </div>
                      <div className="rb-field">
                        <label className="rb-field-label">Message optionnel</label>
                        <textarea className="rb-input rb-textarea" name="note" placeholder="Une note pour les mariés..." />
                      </div>
                      <button className="rb-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
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
            <section className="rb-gb-wrap">
              <div className="rb-content-zone">
                <div className="rb-card">
                  <p className="rb-label">Livre d'or</p>
                  <h2 className="rb-card-title">Laissez votre<br />message</h2>
                  <div className="rb-thin-line" />
                  {messages.length > 0 && (
                    <div className="rb-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className="rb-msg">
                          <p className="rb-msg-text">{msg.message}</p>
                          <p className="rb-msg-author">— {msg.author_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {gbStatus === 'done' ? (
                    <p className="rb-success">{gbPending ? 'En attente de validation' : 'Message publié'}</p>
                  ) : (
                    <form className="rb-form" onSubmit={submitMessage} dir="ltr">
                      <div className="rb-field">
                        <label className="rb-field-label">Votre prénom</label>
                        <input className="rb-input" name="author_name" placeholder="ex. Yasmine..." required />
                      </div>
                      <div className="rb-field">
                        <label className="rb-field-label">Vos vœux</label>
                        <textarea className="rb-input rb-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                      </div>
                      <button className="rb-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                        {gbStatus === 'loading' ? 'Envoi...' : 'Publier mon message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══ FOOTER ══ */}
          <footer className="rb-footer">
            <div className="rb-content-zone">
              <div className="rb-footer-inner">
                <div className="rb-footer-names">{brideName} {ampChar} {groomName}</div>
                <div className="rb-footer-date">{dateFr}</div>
                <div className="rb-footer-credit">Élégance Digitale™</div>
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
  body { font-family: 'Raleway', sans-serif; color: ${P.blue}; overflow-x: hidden; }

  .rb-invitation {
    opacity: 0; transform: translateY(20px);
    transition: opacity .9s, transform .9s;
    font-family: 'Raleway', sans-serif;
  }
  .rb-invitation.rb-visible { opacity: 1; transform: none; }

  .rb-bg-fixed {
    position: fixed; inset: 0; z-index: 0;
    background-color: ${P.bg};
    background-image: url(/assets/template5/back5.png);
    background-position: center top;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  .rb-deco-fixed {
    position: fixed; top: 0;
    pointer-events: none; z-index: 10; object-fit: fill;
  }

  .rb-texture-bg {
    position: relative; z-index: 1;
    background: transparent;
    min-height: 100vh;
  }

  .rb-hero, .rb-section, .rb-rsvp-wrap, .rb-gb-wrap, .rb-footer {
    width: 100%; position: relative; background: transparent;
  }

  /* ── HERO ── */
  .rb-rose {
    width: min(290px, 82%); height: auto;
    display: block; margin: 0 auto 6px;
  }

  .rb-names-line {
    display: grid; grid-template-columns: auto auto auto;
    align-items: center; gap: 0 0.6rem;
    justify-content: center;
    width: 100%; margin-bottom: 10px;
  }
  .rb-name {
    font-family: 'Great Vibes', cursive; font-weight: 400;
    font-size: clamp(2.6rem, 6.5vw, 4.5rem);
    color: ${P.blue};
  }
  .rb-amp {
    font-family: 'Great Vibes', cursive; font-weight: 400;
    font-size: clamp(4rem, 10vw, 6.5rem);
    color: ${P.blue}; line-height: .8;
    text-align: center;
  }

  .rb-intro {
    font-size: clamp(.56rem, 1.4vw, .7rem);
    color: ${P.blue}; text-align: center;
    line-height: 1.7; font-style: italic;
    margin-bottom: 14px;
  }

  .rb-date-txt {
    font-size: clamp(.42rem, 1.1vw, .54rem);
    letter-spacing: .18em; text-transform: uppercase;
    color: ${P.blue}; text-align: center; margin-bottom: 2px;
  }
  .rb-time-txt {
    font-family: 'Great Vibes', cursive; font-weight: 400;
    font-size: clamp(2.2rem, 7vw, 3.4rem);
    color: ${P.blue}; text-align: center;
    line-height: 1; margin-bottom: 12px;
  }
  .rb-venue-txt {
    font-size: clamp(.48rem, 1.3vw, .6rem);
    letter-spacing: .12em; text-transform: uppercase;
    color: ${P.blue}; text-align: center; margin-bottom: 3px;
  }
  .rb-addr-txt {
    font-size: clamp(.42rem, 1.1vw, .52rem);
    letter-spacing: .1em; text-transform: uppercase;
    color: ${P.blueLight}; text-align: center; margin-bottom: 10px;
  }
  .rb-maps-mini { display: flex; gap: 16px; justify-content: center; direction: ltr; }
  .rb-map-link {
    font-size: .44rem; letter-spacing: .14em; text-transform: uppercase;
    color: ${P.blue}; text-decoration: none;
    border-bottom: 1px solid rgba(107,143,168,.4); padding-bottom: 2px;
  }

  /* ── SECTIONS ── */
  .rb-label {
    font-size: .5rem; letter-spacing: .3em; text-transform: uppercase;
    color: ${P.blue}; margin-bottom: 6px; font-weight: 600; text-align: center;
  }
  .rb-title {
    font-family: 'Great Vibes', cursive; font-weight: 400;
    font-size: clamp(2rem, 6vw, 3rem);
    color: ${P.blue}; text-align: center; margin-bottom: 16px; line-height: 1.2;
  }
  .rb-thin-line { width: 60px; height: 1px; background: ${P.border}; margin: 8px auto 14px; }

  /* COUNTDOWN */
  .rb-countdown { display: flex; align-items: stretch; justify-content: center; flex-wrap: wrap; direction: ltr; }
  .rb-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 62px; padding: 12px 8px;
    border: 1px solid ${P.border}; background: rgba(255,255,255,.5);
  }
  .rb-cd + .rb-cd { border-left: none; }
  .rb-cd-num   { font-size: 1.8rem; color: ${P.blue}; line-height: 1; font-weight: 300; }
  .rb-cd-label { font-size: .44rem; color: ${P.blueLight}; margin-top: 6px; letter-spacing: .1em; text-transform: uppercase; }

  /* PROGRAMME */
  .rb-program { display: flex; flex-direction: column; width: 100%; }
  .rb-prog-item {
    display: grid; grid-template-columns: 65px 14px 1fr; gap: 10px;
    align-items: center; padding: 10px 0;
    border-bottom: 1px solid ${P.borderSoft};
  }
  .rb-prog-item:last-child { border-bottom: none; }
  .rb-prog-time  { font-size: 1rem; color: ${P.blue}; }
  .rb-prog-dot   { color: ${P.blue}; font-size: .6rem; text-align: center; }
  .rb-prog-event { font-size: .86rem; color: ${P.blue}; font-weight: 500; }
  .rb-prog-venue { font-size: .74rem; color: ${P.blueLight}; margin-top: 2px; }

  /* CARD */
  .rb-card {
    width: 100%;
    background: rgba(255,255,255,.55);
    border: 1px solid ${P.border};
    padding: 22px 20px 16px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .rb-card-title {
    font-family: 'Great Vibes', cursive; font-weight: 400;
    font-size: clamp(2rem, 6vw, 2.8rem);
    color: ${P.blue}; line-height: 1.2; margin: 6px 0 8px;
  }

  /* FORM */
  .rb-form { width: 100%; display: flex; flex-direction: column; text-align: left; direction: ltr; margin-top: 6px; }
  .rb-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
  .rb-field-label { font-size: .44rem; letter-spacing: .22em; text-transform: uppercase; color: ${P.blue}; font-weight: 600; }
  .rb-input {
    width: 100%; padding: 10px 14px;
    background: rgba(255,255,255,.8);
    border: 1px solid rgba(107,143,168,.25); border-radius: 4px;
    color: ${P.blue}; font-family: 'Raleway', sans-serif; font-size: .9rem; font-weight: 300;
    outline: none; transition: border-color .25s;
  }
  .rb-input::placeholder { color: rgba(107,143,168,.4); }
  .rb-input:focus { border-color: ${P.blue}; }
  .rb-textarea { resize: vertical; min-height: 88px; }

  .rb-radios { display: flex; gap: 6px; width: 100%; }
  .rb-radio {
    flex: 1; min-width: 0; padding: 9px 4px;
    background: transparent; border: 1px solid rgba(107,143,168,.3); border-radius: 4px;
    color: ${P.blue}; font-size: .4rem; letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: all .2s; font-family: 'Raleway', sans-serif;
  }
  .rb-radio-on, .rb-radio:hover { background: ${P.blue}; border-color: ${P.blue}; color: #fff; }

  .rb-btn-submit {
    width: 100%; padding: 12px;
    background: ${P.blue}; border: none; border-radius: 4px;
    color: #fff; font-family: 'Raleway', sans-serif;
    font-size: .46rem; letter-spacing: .22em; text-transform: uppercase; font-weight: 600;
    cursor: pointer; transition: background .3s; margin-top: 4px;
  }
  .rb-btn-submit:hover { background: ${P.blueDark}; }
  .rb-btn-submit:disabled { opacity: .5; cursor: not-allowed; }
  .rb-success { font-style: italic; color: ${P.blue}; padding: 16px; font-size: .9rem; }

  /* MESSAGES */
  .rb-messages { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 14px; text-align: left; }
  .rb-msg { border-bottom: 1px solid ${P.borderSoft}; padding: 10px 0; }
  .rb-msg-text   { color: ${P.blue}; line-height: 1.8; font-size: .86rem; }
  .rb-msg-author { margin-top: 4px; font-size: .48rem; color: ${P.blueLight}; letter-spacing: .08em; }

  /* FOOTER */
  .rb-footer-inner { width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .rb-footer-names {
    font-family: 'Great Vibes', cursive; font-size: 2.4rem; font-weight: 400;
    color: ${P.blue}; margin-bottom: 4px; width: 100%; text-align: center;
  }
  .rb-footer-date   { font-size: .62rem; color: ${P.blueLight}; margin-bottom: 14px; letter-spacing: .08em; width: 100%; text-align: center; }
  .rb-footer-credit { font-size: .4rem; letter-spacing: .18em; color: ${P.blue}; opacity: .4; text-transform: uppercase; width: 100%; text-align: center; }

  @media (max-width: 600px) {
    .rb-rose { width: min(250px, 82%); }
    .rb-cd { min-width: 54px; padding: 10px 6px; }
    .rb-cd-num { font-size: 1.5rem; }
    .rb-prog-item { grid-template-columns: 52px 12px 1fr; gap: 8px; }
  }
  `
}
