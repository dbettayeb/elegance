'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import OpeningScreen from '@/components/common/OpeningScreen'

const DECO_KEY = 'assets/template3/deco3.png'
const DECO_W = 857, DECO_H = 1200
const FA_TOP = 26    // vh — zone sûre haute (intérieur arche, sous la courbe)
const FA_BOTTOM = 14 // vh — zone sûre basse
const decoWidthVh = (DECO_W / DECO_H * 100).toFixed(2) // "71.42"

const P = {
  green:      '#497043',
  greenDark:  '#3a5934',
  coral:      '#e38080',
  coralDark:  '#c86060',
  muted:      '#7b7872',
  mutedLight: '#a09c96',
  bg:         '#f8f7f7',
  border:     'rgba(73,112,67,0.18)',
}

export default function FloralArch({ wedding }: { wedding: Wedding }) {
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate, introText,
  } = useInvitationLogic(wedding)


  const dateFr = eventDate.toLocaleDateString('fr-TN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
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

      {/* Overrides responsive */}
      <style>{`
        body { background-color: ${P.bg}; }

        @media (max-width: 768px) {
          .fa-deco-fixed { left: 0; width: 100vw; height: 100vh; height: 100dvh; }
          .fa-texture-bg { min-height: 100vh; min-height: 100dvh; }
          .fa-hero, .fa-section, .fa-rsvp-wrap, .fa-gb-wrap, .fa-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .fa-content-zone { width: 58vw; }
          .fa-hero .fa-content-zone { padding-top: ${FA_TOP}vh; padding-bottom: 4vh; }
          .fa-section .fa-content-zone,
          .fa-rsvp-wrap .fa-content-zone,
          .fa-gb-wrap .fa-content-zone { padding-top: 3vh; padding-bottom: 3vh; }
          .fa-footer .fa-content-zone { padding-top: 2vh; padding-bottom: ${FA_BOTTOM}vh; }
        }
        @media (min-width: 769px) {
          .fa-deco-fixed { left: 50%; transform: translateX(-50%); width: ${decoWidthVh}vh; height: 100vh; height: 100dvh; }
          .fa-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .fa-hero, .fa-section, .fa-rsvp-wrap, .fa-gb-wrap, .fa-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .fa-content-zone { width: calc(${decoWidthVh}vh * 0.58); }
          .fa-hero .fa-content-zone { padding-top: ${FA_TOP}vh; padding-bottom: 4vh; }
          .fa-section .fa-content-zone,
          .fa-rsvp-wrap .fa-content-zone,
          .fa-gb-wrap .fa-content-zone { padding-top: 3vh; padding-bottom: 3vh; }
          .fa-footer .fa-content-zone { padding-top: 2vh; padding-bottom: ${FA_BOTTOM}vh; }
        }
      `}</style>

      <style>{buildCSS()}</style>
      <FontOverride font={wedding.custom_font} container=".fa-invitation" />

      <div className={`fa-invitation${visible ? ' fa-visible' : ''}`}>

        {/* Cadre floral fixe */}
        <img src={`/${DECO_KEY}`} alt="" className="fa-deco-fixed" aria-hidden="true" />

        {/* Fond crème */}
        <div className="fa-texture-bg">

          {/* ══ HERO ══ */}
          <section className="fa-hero">
            <div className="fa-content-zone">
              <p className="fa-intro">{introText}</p>
              <div className="fa-names">
                <span className="fa-name">{brideName}</span>
                <span className="fa-amp">{ampChar}</span>
                <span className="fa-name">{groomName}</span>
              </div>
              <div className="fa-save-block">
                <p className="fa-save-label">Réservez cette date</p>
                <div className="fa-thin-line" />
                <p className="fa-date-txt">{dateFr}</p>
                <p className="fa-time-txt">{timeFr}</p>
              </div>
              {wedding.venue_name    && <p className="fa-venue-txt">{wedding.venue_name}</p>}
              {wedding.venue_address && <p className="fa-addr-txt">{wedding.venue_address}</p>}
              {(wedding.gps_google || wedding.gps_apple) && (
                <div className="fa-maps-mini">
                  {wedding.gps_google && <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="fa-map-link">Google Maps</a>}
                  {wedding.gps_apple  && <a href={wedding.gps_apple}  target="_blank" rel="noreferrer" className="fa-map-link">Apple Maps</a>}
                </div>
              )}
            </div>
          </section>

          {/* ══ COMPTE À REBOURS ══ */}
          {wedding.show_countdown && (
            <section className="fa-section">
              <div className="fa-content-zone">
                <p className="fa-label">Compte à rebours</p>
                <h2 className="fa-title">Le Grand Jour approche</h2>
                <div className="fa-countdown">
                  {[
                    { val: countdown.d, label: 'Jours' },
                    { val: countdown.h, label: 'Heures' },
                    { val: countdown.m, label: 'Minutes' },
                    { val: countdown.s, label: 'Secondes' },
                  ].map((item, i) => (
                    <div key={i} className="fa-cd">
                      <div className="fa-cd-num">{item.val}</div>
                      <div className="fa-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ PROGRAMME ══ */}
          {wedding.show_program !== false && wedding.program?.length > 0 && (
            <section className="fa-section">
              <div className="fa-content-zone">
                <p className="fa-label">Déroulement</p>
                <h2 className="fa-title">Programme de la Soirée</h2>
                <div className="fa-program">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <div key={i} className="fa-prog-item">
                      <div className="fa-prog-time">{item.time}</div>
                      <div className="fa-prog-dot">◆</div>
                      <div className="fa-prog-content">
                        <div className="fa-prog-event">{item.event}</div>
                        {item.venue && <div className="fa-prog-venue">{item.venue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ RSVP ══ */}
          {wedding.show_rsvp && (
            <section className="fa-rsvp-wrap">
              <div className="fa-content-zone">
                <div className="fa-card">
                  <p className="fa-label">Confirmation</p>
                  <h2 className="fa-card-title">Serez-vous<br />des nôtres ?</h2>
                  <div className="fa-thin-line" />
                  {rsvpStatus === 'done' ? (
                    <p className="fa-success">Merci ! Votre réponse a bien été enregistrée.</p>
                  ) : (
                    <form className="fa-form" onSubmit={submitRSVP} dir="ltr">
                      <div className="fa-field">
                        <label className="fa-field-label">Nom complet</label>
                        <input className="fa-input" name="name" placeholder="Prénom et nom..." required />
                      </div>
                      <div className="fa-field">
                        <label className="fa-field-label">WhatsApp</label>
                        <input className="fa-input" name="phone" placeholder="+216 ..." />
                      </div>
                      <div className="fa-field">
                        <label className="fa-field-label">Présence</label>
                        <div className="fa-radios">
                          {(['present', 'absent', 'maybe'] as const).map(s => (
                            <button
                              key={s}
                              type="button"
                              className={`fa-radio${rsvpChoice === s ? ' fa-radio-on' : ''}`}
                              onClick={() => setRsvpChoice(s)}
                            >
                              {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'En attente'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="fa-field">
                        <label className="fa-field-label">Accompagnants</label>
                        <input className="fa-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                      </div>
                      <div className="fa-field">
                        <label className="fa-field-label">Message optionnel</label>
                        <textarea className="fa-input fa-textarea" name="note" placeholder="Une note pour les mariés..." />
                      </div>
                      <button className="fa-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
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
            <section className="fa-gb-wrap">
              <div className="fa-content-zone">
                <div className="fa-card">
                  <p className="fa-label">Livre d'or</p>
                  <h2 className="fa-card-title">Laissez votre<br />message</h2>
                  <div className="fa-thin-line" />
                  {messages.length > 0 && (
                    <div className="fa-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className="fa-msg">
                          <p className="fa-msg-text">{msg.message}</p>
                          <p className="fa-msg-author">— {msg.author_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {gbStatus === 'done' ? (
                    <p className="fa-success">
                      {gbPending ? 'En attente de validation' : 'Message publié'}
                    </p>
                  ) : (
                    <form className="fa-form" onSubmit={submitMessage} dir="ltr">
                      <div className="fa-field">
                        <label className="fa-field-label">Votre prénom</label>
                        <input className="fa-input" name="author_name" placeholder="ex. Yasmine..." required />
                      </div>
                      <div className="fa-field">
                        <label className="fa-field-label">Vos vœux</label>
                        <textarea className="fa-input fa-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                      </div>
                      <button className="fa-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                        {gbStatus === 'loading' ? 'Envoi...' : 'Publier mon message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══ FOOTER ══ */}
          <footer className="fa-footer">
            <div className="fa-content-zone">
              <div className="fa-footer-inner">
                <div className="fa-footer-names">{brideName} {ampChar} {groomName}</div>
                <div className="fa-footer-date">{dateFr}</div>
                <div className="fa-footer-credit">Élégance Digitale™</div>
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
  body { font-family: 'Raleway', sans-serif; color: ${P.muted}; overflow-x: hidden; }

  .fa-invitation {
    opacity: 0; transform: translateY(20px);
    transition: opacity .9s, transform .9s;
    font-family: 'Raleway', sans-serif;
  }
  .fa-invitation.fa-visible { opacity: 1; transform: none; }

  .fa-deco-fixed {
    position: fixed; top: 0;
    pointer-events: none; z-index: 10;
    object-fit: fill;
  }

  .fa-texture-bg {
    position: relative; z-index: 1;
    background-color: ${P.bg};
    min-height: 100vh;
  }

  .fa-hero, .fa-section, .fa-rsvp-wrap, .fa-gb-wrap, .fa-footer {
    width: 100%; position: relative; background: transparent;
  }

  /* ── HERO ── */
  .fa-intro {
    font-size: clamp(.56rem, 1.5vw, .72rem); font-weight: 300; text-transform: uppercase;
    letter-spacing: .12em; color: ${P.muted}; line-height: 1.7; text-align: center;
    margin-bottom: 10px; max-width: 100%;
  }
  .fa-names {
    display: flex; flex-direction: column; align-items: center;
    margin-bottom: 14px;
  }
  .fa-name {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(2.8rem, 8.5vw, 4.56rem);
    color: ${P.green}; line-height: 1.2; font-weight: 400;
  }
  .fa-amp {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.6rem, 5vw, 2.4rem);
    color: ${P.coral}; line-height: 1.2; font-weight: 400;
  }

  .fa-save-block {
    display: flex; flex-direction: column; align-items: center; margin-bottom: 12px;
  }
  .fa-save-label {
    font-size: clamp(.5rem, 1.4vw, .62rem); letter-spacing: .28em; text-transform: uppercase;
    color: ${P.coral}; font-weight: 600; margin-bottom: 8px;
  }
  .fa-thin-line {
    width: 60px; height: 1px; background: rgba(73,112,67,.25); margin: 6px auto 10px;
  }
  .fa-date-txt {
    font-size: clamp(.68rem, 1.8vw, .86rem); color: ${P.green}; font-weight: 400;
  }
  .fa-time-txt {
    font-size: clamp(.55rem, 1.4vw, .68rem); color: ${P.green};
    letter-spacing: .08em; margin-top: 2px;
  }

  .fa-venue-txt {
    font-size: clamp(.66rem, 1.7vw, .82rem); color: ${P.muted};
    text-align: center; margin-top: 10px; margin-bottom: 3px;
  }
  .fa-addr-txt {
    font-size: clamp(.58rem, 1.5vw, .72rem); color: ${P.mutedLight};
    text-align: center; margin-bottom: 10px;
  }
  .fa-maps-mini { display: flex; gap: 16px; justify-content: center; direction: ltr; }
  .fa-map-link {
    font-size: .46rem; letter-spacing: .14em; text-transform: uppercase;
    color: ${P.green}; text-decoration: none; border-bottom: 1px solid rgba(73,112,67,.35); padding-bottom: 2px;
  }

  /* ── SECTIONS ── */
  .fa-label {
    font-size: .5rem; letter-spacing: .32em; text-transform: uppercase;
    color: ${P.coral}; margin-bottom: 6px; font-weight: 600; text-align: center;
  }
  .fa-title {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    color: ${P.green}; font-weight: 400; text-align: center; margin-bottom: 16px;
  }

  /* COUNTDOWN */
  .fa-countdown { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; direction: ltr; }
  .fa-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 60px; padding: 12px 8px;
    background: rgba(255,255,255,.75);
    border: 1px solid ${P.border};
  }
  .fa-cd-num   { font-size: 1.8rem; color: ${P.green}; line-height: 1; font-weight: 300; }
  .fa-cd-label { font-size: .44rem; color: ${P.mutedLight}; margin-top: 6px; letter-spacing: .1em; text-transform: uppercase; }

  /* PROGRAMME */
  .fa-program { display: flex; flex-direction: column; width: 100%; }
  .fa-prog-item {
    display: grid; grid-template-columns: 65px 14px 1fr; gap: 10px;
    align-items: center; padding: 10px 0;
    border-bottom: 1px solid rgba(73,112,67,.1);
  }
  .fa-prog-item:last-child { border-bottom: none; }
  .fa-prog-time  { font-size: 1.05rem; color: ${P.green}; }
  .fa-prog-dot   { color: ${P.coral}; font-size: .65rem; text-align: center; }
  .fa-prog-event { font-size: .86rem; color: ${P.green}; font-weight: 500; }
  .fa-prog-venue { font-size: .74rem; color: ${P.mutedLight}; margin-top: 2px; }

  /* CARD */
  .fa-card {
    width: 100%;
    background: rgba(255,255,255,.75);
    border: 1px solid ${P.border};
    padding: 24px 20px 16px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .fa-card-title {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    color: ${P.green}; font-weight: 400; line-height: 1.2; margin: 6px 0 8px;
  }

  /* FORM */
  .fa-form { width: 100%; display: flex; flex-direction: column; text-align: left; direction: ltr; margin-top: 6px; }
  .fa-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
  .fa-field-label { font-size: .44rem; letter-spacing: .24em; text-transform: uppercase; color: ${P.green}; font-weight: 600; }
  .fa-input {
    width: 100%; padding: 10px 14px;
    background: rgba(255,255,255,.8);
    border: 1px solid rgba(73,112,67,.2); border-radius: 6px;
    color: ${P.muted};
    font-family: 'Raleway', sans-serif; font-size: .9rem; font-weight: 300;
    outline: none; transition: border-color .25s;
  }
  .fa-input::placeholder { color: rgba(123,120,114,.4); }
  .fa-input:focus { border-color: ${P.green}; }
  .fa-textarea { resize: vertical; min-height: 88px; }

  .fa-radios { display: flex; gap: 6px; width: 100%; }
  .fa-radio {
    flex: 1; min-width: 0; padding: 9px 4px;
    background: transparent; border: 1px solid rgba(73,112,67,.25); border-radius: 6px;
    color: ${P.muted}; font-size: .4rem; letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: all .2s; font-family: 'Raleway', sans-serif;
  }
  .fa-radio-on, .fa-radio:hover { background: ${P.green}; border-color: ${P.green}; color: #fff; }

  .fa-btn-submit {
    width: 100%; padding: 13px;
    background: ${P.green}; border: none; border-radius: 4px;
    color: #fff; font-family: 'Raleway', sans-serif;
    font-size: .46rem; letter-spacing: .22em; text-transform: uppercase; font-weight: 600;
    cursor: pointer; transition: background .3s; margin-top: 4px;
  }
  .fa-btn-submit:hover { background: ${P.greenDark}; }
  .fa-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  .fa-success { font-style: italic; color: ${P.green}; padding: 16px; font-size: .9rem; }

  /* MESSAGES */
  .fa-messages { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 14px; text-align: left; }
  .fa-msg { border-bottom: 1px solid rgba(73,112,67,.1); padding: 10px 0; }
  .fa-msg-text   { color: ${P.muted}; line-height: 1.8; font-size: .86rem; }
  .fa-msg-author { margin-top: 4px; font-size: .48rem; color: ${P.coral}; letter-spacing: .08em; }

  /* FOOTER */
  .fa-footer-inner { width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .fa-footer-names {
    font-family: 'Great Vibes', cursive; font-size: 2.2rem;
    color: ${P.green}; margin-bottom: 4px; font-weight: 400; text-align: center; width: 100%;
  }
  .fa-footer-date   { font-size: .68rem; color: ${P.muted}; margin-bottom: 14px; text-align: center; width: 100%; }
  .fa-footer-credit { font-size: .4rem; letter-spacing: .18em; color: ${P.coral}; opacity: .55; text-transform: uppercase; text-align: center; width: 100%; }

  @media (max-width: 600px) {
    .fa-cd { min-width: 54px; padding: 10px 6px; }
    .fa-cd-num { font-size: 1.5rem; }
    .fa-prog-item { grid-template-columns: 52px 12px 1fr; gap: 8px; }
  }
  `
}
