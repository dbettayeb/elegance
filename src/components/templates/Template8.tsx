'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import OpeningScreen from '@/components/common/OpeningScreen'

const DECO_KEY = 'assets/template8/deco8.png'
const RING_KEY = 'assets/template8/Anneau floral qui contient la 1ere lettres des prenoms.png'
const DECO_W = 1500, DECO_H = 2100
const T8_TOP    = 8
const T8_BOTTOM = 10
const decoWidthVh = (DECO_W / DECO_H * 100).toFixed(2) // "71.43"

const P = {
  pink:         '#C06080',
  pinkDark:     '#8B4070',
  pinkLight:    '#E8A0B8',
  bg:           '#fffded',
  textPrimary:  '#3A1A2A',
  textSecondary:'#7B4060',
  textMuted:    '#9B6A80',
  border:       'rgba(192,96,128,0.22)',
  borderSoft:   'rgba(192,96,128,0.12)',
}

export default function Template8({ wedding }: { wedding: Wedding }) {
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate, introText,
  } = useInvitationLogic(wedding)

  const monthFr = eventDate.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase()
  const dayNum  = eventDate.getDate().toString().padStart(2, '0')
  const yearNum = eventDate.getFullYear()
  const dateFr  = eventDate.toLocaleDateString('fr-TN', { day: 'numeric', month: 'long', year: 'numeric' })

  const brideName = wedding.bride_name
  const groomName = wedding.groom_name

  // Initiales pour le monogramme dans les anneaux
  const brideInit = brideName?.charAt(0) || ''
  const groomInit = groomName?.charAt(0) || ''

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
          .t8-deco-fixed { left: 0; width: 100vw; height: 100vh; height: 100dvh; }
          .t8-texture-bg { min-height: 100vh; min-height: 100dvh; }
          .t8-hero, .t8-section, .t8-rsvp-wrap, .t8-gb-wrap, .t8-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .t8-content-zone { width: 72vw; }
          .t8-hero .t8-content-zone { padding-top: ${T8_TOP}vh; padding-bottom: 4vh; }
          .t8-section .t8-content-zone,
          .t8-rsvp-wrap .t8-content-zone,
          .t8-gb-wrap .t8-content-zone { padding-top: 3vh; padding-bottom: 3vh; }
          .t8-footer .t8-content-zone { padding-top: 2vh; padding-bottom: ${T8_BOTTOM}vh; }
        }
        @media (min-width: 769px) {
          .t8-deco-fixed { left: 50%; transform: translateX(-50%); width: ${decoWidthVh}vh; height: 100vh; height: 100dvh; }
          .t8-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .t8-hero, .t8-section, .t8-rsvp-wrap, .t8-gb-wrap, .t8-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .t8-content-zone { width: calc(${decoWidthVh}vh * 0.68); }
          .t8-hero .t8-content-zone { padding-top: ${T8_TOP}vh; padding-bottom: 4vh; }
          .t8-section .t8-content-zone,
          .t8-rsvp-wrap .t8-content-zone,
          .t8-gb-wrap .t8-content-zone { padding-top: 3vh; padding-bottom: 3vh; }
          .t8-footer .t8-content-zone { padding-top: 2vh; padding-bottom: ${T8_BOTTOM}vh; }
        }
      `}</style>

      <style>{buildCSS()}</style>
      <FontOverride font={wedding.custom_font} container=".t8-invitation" />

      <div className={`t8-invitation${visible ? ' t8-visible' : ''}`}>

        {/* Cadre coins floraux fixe */}
        <img src={`/${DECO_KEY}`} alt="" className="t8-deco-fixed" aria-hidden="true" />

        <div className="t8-texture-bg">

          {/* ══ HERO ══ */}
          <section className="t8-hero">
            <div className="t8-content-zone">

              <p className="t8-std">Réservez cette date</p>

              {introText && <p className="t8-intro">{introText}</p>}

              {/* Monogramme double anneau — le wrapper a la même dimension que l'image */}
              <div className="t8-ring-outer">
                <div className="t8-ring-wrap">
                  <img src={`/${RING_KEY}`} alt="" className="t8-ring-img" aria-hidden="true" />
                  {/* Initiale gauche (épouse) — centrée dans anneau gauche */}
                  <span className="t8-initial t8-initial-left">{brideInit}</span>
                  {/* Initiale droite (époux) — centrée dans anneau droit */}
                  <span className="t8-initial t8-initial-right">{groomInit}</span>
                </div>
              </div>

              <p className="t8-name">{brideName}</p>
              <p className="t8-and">et</p>
              <p className="t8-name">{groomName}</p>

              <div className="t8-divider">
                <div className="t8-thin-line" />
                <span className="t8-diamond">◆</span>
                <div className="t8-thin-line" />
              </div>

              {/* Date — Month | Day | Year */}
              <div className="t8-date-row">
                <span className="t8-date-part">{monthFr}</span>
                <span className="t8-date-sep">|</span>
                <span className="t8-date-part">{dayNum}</span>
                <span className="t8-date-sep">|</span>
                <span className="t8-date-part">{yearNum}</span>
              </div>

              {wedding.venue_name    && <p className="t8-venue">{wedding.venue_name}</p>}
              {wedding.venue_address && <p className="t8-addr">{wedding.venue_address}</p>}

              {(wedding.gps_google || wedding.gps_apple) && (
                <div className="t8-maps-row" dir="ltr">
                  {wedding.gps_google && <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="t8-map-link">Google Maps</a>}
                  {wedding.gps_apple  && <a href={wedding.gps_apple}  target="_blank" rel="noreferrer" className="t8-map-link">Apple Maps</a>}
                </div>
              )}
            </div>
          </section>

          {/* ══ COMPTE À REBOURS ══ */}
          {wedding.show_countdown && (
            <section className="t8-section">
              <div className="t8-content-zone">
                <p className="t8-label">Compte à rebours</p>
                <h2 className="t8-title">Le Grand Jour approche</h2>
                <div className="t8-countdown" dir="ltr">
                  {[
                    { val: countdown.d, label: 'Jours' },
                    { val: countdown.h, label: 'Heures' },
                    { val: countdown.m, label: 'Minutes' },
                    { val: countdown.s, label: 'Secondes' },
                  ].map((item, i) => (
                    <div key={i} className="t8-cd">
                      <div className="t8-cd-num">{item.val}</div>
                      <div className="t8-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ PROGRAMME ══ */}
          {wedding.program?.length > 0 && (
            <section className="t8-section">
              <div className="t8-content-zone">
                <p className="t8-label">Déroulement</p>
                <h2 className="t8-title">Programme de la Soirée</h2>
                <div className="t8-program">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <div key={i} className="t8-prog-item">
                      <div className="t8-prog-time">{item.time}</div>
                      <div className="t8-prog-dot">◆</div>
                      <div className="t8-prog-content">
                        <div className="t8-prog-event">{item.event}</div>
                        {item.venue && <div className="t8-prog-venue">{item.venue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ RSVP ══ */}
          {wedding.show_rsvp && (
            <section className="t8-rsvp-wrap">
              <div className="t8-content-zone">
                <div className="t8-card">
                  <p className="t8-label">Confirmation</p>
                  <h2 className="t8-card-title">Serez-vous<br />des nôtres ?</h2>
                  <div className="t8-divider">
                    <div className="t8-thin-line" />
                    <span className="t8-diamond">◆</span>
                    <div className="t8-thin-line" />
                  </div>
                  {rsvpStatus === 'done' ? (
                    <p className="t8-success">Merci ! Votre réponse a bien été enregistrée.</p>
                  ) : (
                    <form className="t8-form" onSubmit={submitRSVP} dir="ltr">
                      <div className="t8-field">
                        <label className="t8-field-label">Nom complet</label>
                        <input className="t8-input" name="name" placeholder="Prénom et nom..." required />
                      </div>
                      <div className="t8-field">
                        <label className="t8-field-label">WhatsApp</label>
                        <input className="t8-input" name="phone" placeholder="+216 ..." />
                      </div>
                      <div className="t8-field">
                        <label className="t8-field-label">Présence</label>
                        <div className="t8-radios">
                          {(['present', 'absent', 'maybe'] as const).map(s => (
                            <button key={s} type="button"
                              className={`t8-radio${rsvpChoice === s ? ' t8-radio-on' : ''}`}
                              onClick={() => setRsvpChoice(s)}
                            >
                              {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'En attente'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="t8-field">
                        <label className="t8-field-label">Accompagnants</label>
                        <input className="t8-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                      </div>
                      <div className="t8-field">
                        <label className="t8-field-label">Message optionnel</label>
                        <textarea className="t8-input t8-textarea" name="note" placeholder="Une note pour les mariés..." />
                      </div>
                      <button className="t8-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
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
            <section className="t8-gb-wrap">
              <div className="t8-content-zone">
                <div className="t8-card">
                  <p className="t8-label">Livre d&apos;or</p>
                  <h2 className="t8-card-title">Laissez votre<br />message</h2>
                  <div className="t8-divider">
                    <div className="t8-thin-line" />
                    <span className="t8-diamond">◆</span>
                    <div className="t8-thin-line" />
                  </div>
                  {messages.length > 0 && (
                    <div className="t8-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className="t8-msg">
                          <p className="t8-msg-text">{msg.message}</p>
                          <p className="t8-msg-author">— {msg.author_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {gbStatus === 'done' ? (
                    <p className="t8-success">
                      {gbPending ? 'En attente de validation' : 'Message publié'}
                    </p>
                  ) : (
                    <form className="t8-form" onSubmit={submitMessage} dir="ltr">
                      <div className="t8-field">
                        <label className="t8-field-label">Votre prénom</label>
                        <input className="t8-input" name="author_name" placeholder="ex. Yasmine..." required />
                      </div>
                      <div className="t8-field">
                        <label className="t8-field-label">Vos vœux</label>
                        <textarea className="t8-input t8-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                      </div>
                      <button className="t8-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                        {gbStatus === 'loading' ? 'Envoi...' : 'Publier mon message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ══ FOOTER ══ */}
          <footer className="t8-footer">
            <div className="t8-content-zone">
              <div className="t8-footer-inner">
                <div className="t8-footer-names">{brideName} &amp; {groomName}</div>
                <div className="t8-footer-date">{dateFr}</div>
                <div className="t8-footer-credit">Élégance Digitale™</div>
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

  .t8-invitation {
    opacity: 0; transform: translateY(20px);
    transition: opacity .9s, transform .9s;
    font-family: 'Raleway', sans-serif;
  }
  .t8-invitation.t8-visible { opacity: 1; transform: none; }

  /* z-index 10 pour que le cadre passe AU-DESSUS du fond */
  .t8-deco-fixed {
    position: fixed; top: 0;
    pointer-events: none; z-index: 10;
    object-fit: fill;
  }

  .t8-texture-bg {
    position: relative; z-index: 1;
    background-color: ${P.bg};
    min-height: 100vh;
  }

  .t8-hero, .t8-section, .t8-rsvp-wrap, .t8-gb-wrap, .t8-footer {
    width: 100%; position: relative; background: transparent;
  }

  /* ── HERO ── */
  .t8-std {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.8rem, 5.5vw, 3rem);
    color: ${P.pink};
    text-align: center; margin-bottom: 4px; margin-top: 0;
    line-height: 1.1;
  }
  .t8-intro {
    font-size: clamp(.56rem, 1.6vw, .68rem);
    color: ${P.textMuted}; font-style: italic;
    text-align: center; margin-bottom: 10px; letter-spacing: .06em;
    line-height: 1.8;
  }

  /* Anneau floral — image 1000×735 (ratio 1.36 : largeur > hauteur)
     Centrer l'image dans l'outer, puis positionner les initiales
     par rapport à l'image elle-même via le wrapper interne */
  .t8-ring-outer {
    width: 100%; display: flex; justify-content: center;
    margin: 10px 0 6px;
  }
  .t8-ring-wrap {
    position: relative;
    width: min(80%, 280px);
    /* ratio 735/1000 = 73.5% */
  }
  .t8-ring-img {
    display: block; width: 100%; height: auto;
  }
  /* Les initiales sont positionnées en % de la largeur de .t8-ring-wrap
     Anneau gauche : centre pixel (302,350) → x=30.2%, y=47.6%
     Anneau droit  : centre pixel (700,442) → x=70.0%, y=60.2% */
  .t8-initial {
    position: absolute;
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.4rem, 5vw, 2rem);
    color: ${P.pinkDark};
    transform: translate(-50%, -50%);
    line-height: 1; pointer-events: none;
  }
  .t8-initial-left  { left: 32.5%; top: 54%; }
  .t8-initial-right { left: 68.0%; top: 60.2%; }

  .t8-name {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(2rem, 7vw, 3.4rem);
    color: ${P.textPrimary};
    line-height: 1; margin: 2px 0; text-align: center;
  }
  .t8-and {
    font-size: clamp(.5rem, 1.5vw, .62rem);
    letter-spacing: .3em; text-transform: uppercase;
    color: ${P.textMuted}; margin: 4px 0; text-align: center;
    font-style: italic;
  }

  .t8-divider {
    display: flex; align-items: center; gap: 10px;
    width: 100%; margin: 10px 0;
  }
  .t8-thin-line { flex: 1; height: 1px; background: ${P.border}; }
  .t8-diamond { font-size: .48rem; color: ${P.pink}; }

  .t8-date-row {
    display: flex; align-items: baseline; justify-content: center;
    gap: 8px; margin: 8px 0;
  }
  .t8-date-part {
    font-size: clamp(.56rem, 1.8vw, .74rem);
    letter-spacing: .2em; text-transform: uppercase;
    color: ${P.textSecondary}; font-weight: 500;
  }
  .t8-date-sep { color: ${P.pink}; font-size: .6rem; }

  .t8-venue {
    font-size: clamp(.68rem, 1.9vw, .84rem);
    font-weight: 600; color: ${P.textPrimary};
    margin: 10px 0 2px; text-align: center;
  }
  .t8-addr {
    font-size: clamp(.56rem, 1.5vw, .68rem);
    color: ${P.textMuted}; text-align: center;
    letter-spacing: .05em; margin-bottom: 10px;
  }
  .t8-maps-row { display: flex; gap: 16px; justify-content: center; margin-top: 8px; }
  .t8-map-link {
    font-size: .46rem; letter-spacing: .14em; text-transform: uppercase;
    color: ${P.pink}; text-decoration: none;
    border-bottom: 1px solid rgba(192,96,128,.35); padding-bottom: 2px;
  }

  /* ── SECTIONS ── */
  .t8-label {
    font-size: .5rem; letter-spacing: .32em; text-transform: uppercase;
    color: ${P.pink}; margin-bottom: 6px; font-weight: 600; text-align: center;
  }
  .t8-title {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.8rem, 5vw, 2.6rem);
    color: ${P.textPrimary}; font-weight: 400; text-align: center; margin-bottom: 16px;
  }

  /* COUNTDOWN */
  .t8-countdown { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; direction: ltr; }
  .t8-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 60px; padding: 12px 8px;
    background: rgba(255,255,255,.75);
    border: 1px solid ${P.border};
  }
  .t8-cd-num   { font-size: 1.8rem; color: ${P.pink}; line-height: 1; font-weight: 300; }
  .t8-cd-label { font-size: .44rem; color: ${P.textMuted}; margin-top: 6px; letter-spacing: .1em; text-transform: uppercase; }

  /* PROGRAMME */
  .t8-program { display: flex; flex-direction: column; width: 100%; }
  .t8-prog-item {
    display: grid; grid-template-columns: 65px 14px 1fr; gap: 10px;
    align-items: center; padding: 10px 0;
    border-bottom: 1px solid ${P.borderSoft};
  }
  .t8-prog-item:last-child { border-bottom: none; }
  .t8-prog-time  { font-size: 1.05rem; color: ${P.pink}; }
  .t8-prog-dot   { color: ${P.pink}; font-size: .65rem; text-align: center; }
  .t8-prog-event { font-size: .86rem; color: ${P.textSecondary}; font-weight: 500; }
  .t8-prog-venue { font-size: .74rem; color: ${P.textMuted}; margin-top: 2px; }

  /* CARD */
  .t8-card {
    width: 100%;
    background: rgba(255,255,255,.75);
    border: 1px solid ${P.border};
    padding: 24px 20px 16px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .t8-card-title {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    color: ${P.textPrimary}; font-weight: 400; line-height: 1.2; margin: 6px 0 8px;
  }

  /* FORM */
  .t8-form { width: 100%; display: flex; flex-direction: column; text-align: left; direction: ltr; margin-top: 6px; }
  .t8-field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
  .t8-field-label { font-size: .44rem; letter-spacing: .24em; text-transform: uppercase; color: ${P.pink}; font-weight: 600; }
  .t8-input {
    width: 100%; padding: 10px 14px;
    background: rgba(255,255,255,.8);
    border: 1px solid rgba(192,96,128,.2); border-radius: 6px;
    color: ${P.textPrimary};
    font-family: 'Raleway', sans-serif; font-size: .9rem; font-weight: 300;
    outline: none; transition: border-color .25s;
  }
  .t8-input::placeholder { color: rgba(155,106,128,.4); }
  .t8-input:focus { border-color: ${P.pink}; }
  .t8-textarea { resize: vertical; min-height: 88px; }

  .t8-radios { display: flex; gap: 6px; width: 100%; }
  .t8-radio {
    flex: 1; min-width: 0; padding: 9px 4px;
    background: transparent; border: 1px solid rgba(192,96,128,.25); border-radius: 6px;
    color: ${P.textMuted}; font-size: .4rem; letter-spacing: .1em; text-transform: uppercase;
    cursor: pointer; transition: all .2s; font-family: 'Raleway', sans-serif;
  }
  .t8-radio-on, .t8-radio:hover { background: ${P.pink}; border-color: ${P.pink}; color: #fff; }

  .t8-btn-submit {
    width: 100%; padding: 13px;
    background: ${P.pink}; border: none; border-radius: 4px;
    color: #fff; font-family: 'Raleway', sans-serif;
    font-size: .46rem; letter-spacing: .22em; text-transform: uppercase; font-weight: 600;
    cursor: pointer; transition: background .3s; margin-top: 4px;
  }
  .t8-btn-submit:hover { background: ${P.pinkDark}; }
  .t8-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  .t8-success { font-style: italic; color: ${P.pink}; padding: 16px; font-size: .9rem; }

  /* MESSAGES */
  .t8-messages { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 14px; text-align: left; }
  .t8-msg { border-bottom: 1px solid ${P.borderSoft}; padding: 10px 0; }
  .t8-msg-text   { color: ${P.textSecondary}; line-height: 1.8; font-size: .86rem; }
  .t8-msg-author { margin-top: 4px; font-size: .48rem; color: ${P.pink}; letter-spacing: .08em; }

  /* FOOTER */
  .t8-footer-inner { width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .t8-footer-names {
    font-family: 'Great Vibes', cursive; font-size: 2.2rem;
    color: ${P.textPrimary}; margin-bottom: 4px; font-weight: 400; text-align: center; width: 100%;
  }
  .t8-footer-date   { font-size: .68rem; color: ${P.textMuted}; margin-bottom: 14px; text-align: center; width: 100%; }
  .t8-footer-credit { font-size: .4rem; letter-spacing: .18em; color: ${P.pink}; opacity: .55; text-transform: uppercase; text-align: center; width: 100%; }

  @media (max-width: 600px) {
    .t8-cd { min-width: 54px; padding: 10px 6px; }
    .t8-cd-num { font-size: 1.5rem; }
    .t8-prog-item { grid-template-columns: 52px 12px 1fr; gap: 8px; }
  }
`
}
