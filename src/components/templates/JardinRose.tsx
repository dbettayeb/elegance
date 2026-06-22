'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import { getBgCSSForKey } from '@/lib/bg-texture-system'
import OpeningScreen from '@/components/common/OpeningScreen'

const BG_KEY   = 'assets/template2/back2.png'
const DECO_KEY = 'assets/template2/deco2.png'
const DECO_W = 857, DECO_H = 1200
const DECO_Y = 15
const decoWidthVh = (DECO_W / DECO_H * 100).toFixed(2) // "71.42"

const P = {
  accent:        '#B87070',
  accentDark:    '#9A5858',
  textPrimary:   '#3D2B2B',
  textSecondary: '#6B4F4F',
  textMuted:     '#9E7F7F',
  border:        'rgba(184,112,112,0.25)',
}

export default function JardinRose({ wedding }: { wedding: Wedding }) {
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate, introText,
  } = useInvitationLogic(wedding)


  const d  = eventDate.getDate().toString().padStart(2, '0')
  const mo = (eventDate.getMonth() + 1).toString().padStart(2, '0')
  const yy = eventDate.getFullYear().toString().slice(-2)
  const dateStyled = `${d}  |  ${mo}  |  ${yy}`

  const dateFr = eventDate.toLocaleDateString('fr-TN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const timeFr = eventDate.toLocaleTimeString('fr-TN', {
    hour: '2-digit', minute: '2-digit',
  })

  const brideName = wedding.bride_name
  const groomName = wedding.groom_name
  const ampChar   = '&'

  return (
    <>
      {!opened && <OpeningScreen onOpen={openEnvelope} bgColor='#F0E5E3' />}
      <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap"
        rel="stylesheet"
      />

      {/* 1. Zone vide + layout depuis BG_CONFIGS (back2.png) */}
      <style>{getBgCSSForKey(BG_KEY, 'jr')}</style>

      {/* 2. Overrides */}
      <style>{`
        body { background-color: #F0E5E3; }

        @media (max-width: 768px) {
          .jr-deco-fixed { width: 100vw; height: 100vh; height: 100dvh; }
          .jr-texture-bg {
            background-size: 100vw 100vh !important;
            background-size: 100vw 100dvh !important;
            background-position: top left !important;
            min-height: 100vh;
            min-height: 100dvh;
          }
          .jr-hero, .jr-section, .jr-rsvp-wrap, .jr-gb-wrap, .jr-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .jr-content-zone {
            margin-left: 0 !important; margin-right: 0 !important;
            padding-top: ${DECO_Y}vh; padding-bottom: ${DECO_Y}vh;
          }
          .jr-footer .jr-content-zone { padding-top: 24px; padding-bottom: ${DECO_Y}vh; }
        }
        @media (min-width: 769px) {
          .jr-deco-fixed { width: ${decoWidthVh}vh; height: 100vh; }
          .jr-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .jr-hero, .jr-section, .jr-rsvp-wrap, .jr-gb-wrap, .jr-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .jr-content-zone {
            margin-left: 0 !important; margin-right: 0 !important;
            padding-top: ${DECO_Y}vh; padding-bottom: ${DECO_Y}vh;
          }
          .jr-footer .jr-content-zone { padding-top: 24px; padding-bottom: ${DECO_Y}vh; }
        }
      `}</style>

      {/* 3. CSS composants */}
      <style>{buildCSS()}</style>
      <FontOverride font={wedding.custom_font} container=".jr-invitation" />

      <div className={`jr-invitation${visible ? ' jr-visible' : ''}`}>

        {/* Cadre floral fixe */}
        <img src={`/${DECO_KEY}`} alt="" className="jr-deco-fixed" aria-hidden="true" />

        {/* Fond texturé blush */}
        <div className="jr-texture-bg">

          {/* ══ HERO ══ */}
          <section className="jr-hero">
            <div className="jr-content-zone">
              <p className="jr-intro">{introText}</p>
              <div className="jr-names">
                <span className="jr-name">{brideName}</span>
                <span className="jr-amp">{ampChar} {groomName}</span>
              </div>
              <div className="jr-divider"><span /><i>✦</i><span /></div>
              <p className="jr-date-styled">{dateStyled}</p>
              <p className="jr-time-txt">{timeFr}</p>
              {wedding.venue_name    && <p className="jr-venue-txt">{wedding.venue_name}</p>}
              {wedding.venue_address && <p className="jr-addr-txt">{wedding.venue_address}</p>}
              {(wedding.gps_google || wedding.gps_apple) && (
                <div className="jr-maps-mini">
                  {wedding.gps_google && <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="jr-map-link">Google Maps</a>}
                  {wedding.gps_apple  && <a href={wedding.gps_apple}  target="_blank" rel="noreferrer" className="jr-map-link">Apple Maps</a>}
                </div>
              )}
            </div>
          </section>

          {/* ══ COMPTE À REBOURS ══ */}
          {wedding.show_countdown && (
            <section className="jr-section">
              <div className="jr-content-zone">
                <p className="jr-label">Compte à rebours</p>
                <h2 className="jr-title">Le Grand Jour approche</h2>
                <div className="jr-countdown">
                  {[
                    { val: countdown.d, label: 'Jours' },
                    { val: countdown.h, label: 'Heures' },
                    { val: countdown.m, label: 'Minutes' },
                    { val: countdown.s, label: 'Secondes' },
                  ].map((item, i) => (
                    <div key={i} className="jr-cd">
                      <div className="jr-cd-num">{item.val}</div>
                      <div className="jr-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ PROGRAMME ══ */}
          {wedding.program?.length > 0 && (
            <section className="jr-section">
              <div className="jr-content-zone">
                <p className="jr-label">Déroulement</p>
                <h2 className="jr-title">Programme de la Soirée</h2>
                <div className="jr-program">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <div key={i} className="jr-prog-item">
                      <div className="jr-prog-time">{item.time}</div>
                      <div className="jr-prog-star">✦</div>
                      <div className="jr-prog-content">
                        <div className="jr-prog-event">{item.event}</div>
                        {item.venue && <div className="jr-prog-venue">{item.venue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ RSVP ══ */}
          {wedding.show_rsvp && (
            <section className="jr-rsvp-wrap">
              <div className="jr-content-zone">
                <div className="jr-card">
                  <div className="jr-card-divider"><span /><i>✦</i><span /></div>
                  <p className="jr-label">Confirmation</p>
                  <h2 className="jr-card-title">Serez-vous<br />des nôtres ?</h2>
                  <div className="jr-card-divider"><span /><i>✦</i><span /></div>
                  {rsvpStatus === 'done' ? (
                    <p className="jr-success">Merci ! Votre réponse a bien été enregistrée.</p>
                  ) : (
                    <form className="jr-form" onSubmit={submitRSVP} dir="ltr">
                      <div className="jr-field">
                        <label className="jr-field-label">Nom complet</label>
                        <input className="jr-input" name="name" placeholder="Prénom et nom..." required />
                      </div>
                      <div className="jr-field">
                        <label className="jr-field-label">WhatsApp</label>
                        <input className="jr-input" name="phone" placeholder="+216 ..." />
                      </div>
                      <div className="jr-field">
                        <label className="jr-field-label">Présence</label>
                        <div className="jr-radios">
                          {(['present', 'absent', 'maybe'] as const).map(s => (
                            <button
                              key={s}
                              type="button"
                              className={`jr-radio${rsvpChoice === s ? ' jr-radio-on' : ''}`}
                              onClick={() => setRsvpChoice(s)}
                            >
                              {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'En attente'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="jr-field">
                        <label className="jr-field-label">Accompagnants</label>
                        <input className="jr-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                      </div>
                      <div className="jr-field">
                        <label className="jr-field-label">Message optionnel</label>
                        <textarea className="jr-input jr-textarea" name="note" placeholder="Une note pour les mariés..." />
                      </div>
                      <button className="jr-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                        {rsvpStatus === 'loading' ? 'Envoi...' : '✦  Confirmer ma présence  ✦'}
                      </button>
                    </form>
                  )}
                  <div className="jr-card-dots">• • •</div>
                </div>
              </div>
            </section>
          )}

          {/* ══ LIVRE D'OR ══ */}
          {wedding.show_guestbook && (
            <section className="jr-gb-wrap">
              <div className="jr-content-zone">
                <div className="jr-card">
                  <div className="jr-card-divider"><span /><i>✦</i><span /></div>
                  <p className="jr-label">Livre d'or</p>
                  <h2 className="jr-card-title">Laissez votre<br />message</h2>
                  <div className="jr-card-divider"><span /><i>✦</i><span /></div>
                  {messages.length > 0 && (
                    <div className="jr-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className="jr-msg">
                          <p className="jr-msg-text">{msg.message}</p>
                          <p className="jr-msg-author">— {msg.author_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {gbStatus === 'done' ? (
                    <p className="jr-success">
                      {gbPending ? 'En attente de validation' : 'Message publié'}
                    </p>
                  ) : (
                    <form className="jr-form" onSubmit={submitMessage} dir="ltr">
                      <div className="jr-field">
                        <label className="jr-field-label">Votre prénom</label>
                        <input className="jr-input" name="author_name" placeholder="ex. Yasmine..." required />
                      </div>
                      <div className="jr-field">
                        <label className="jr-field-label">Vos vœux</label>
                        <textarea className="jr-input jr-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                      </div>
                      <button className="jr-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                        {gbStatus === 'loading' ? 'Envoi...' : '✦  Publier mon message  ✦'}
                      </button>
                    </form>
                  )}
                  <div className="jr-card-dots">• • •</div>
                </div>
              </div>
            </section>
          )}

          {/* ══ FOOTER ══ */}
          <footer className="jr-footer">
            <div className="jr-content-zone">
              <div className="jr-footer-inner">
                <div className="jr-footer-names">{brideName} {ampChar} {groomName}</div>
                <div className="jr-footer-date">{dateFr}</div>
                <div className="jr-footer-credit">Élégance Digitale™</div>
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
  body { font-family: 'EB Garamond', Garamond, Georgia, serif; color: ${P.textPrimary}; overflow-x: hidden; }

  .jr-invitation {
    opacity: 0; transform: translateY(24px);
    transition: opacity 1s, transform 1s;
    font-family: 'EB Garamond', Garamond, Georgia, serif;
  }
  .jr-invitation.jr-visible { opacity: 1; transform: none; }

  .jr-deco-fixed {
    position: fixed; top: 0;
    pointer-events: none; z-index: 10;
    object-fit: fill;
  }
  @media (max-width: 768px) { .jr-deco-fixed { left: 0; } }
  @media (min-width: 769px) { .jr-deco-fixed { left: 50%; transform: translateX(-50%); } }

  .jr-hero, .jr-section, .jr-rsvp-wrap, .jr-gb-wrap, .jr-footer {
    width: 100%;
    position: relative;
    background: transparent;
  }

  /* ── HERO ── */
  .jr-intro {
    font-size: clamp(.58rem, 1.8vw, .82rem); font-style: italic;
    letter-spacing: .05em;
    color: ${P.textSecondary}; line-height: 1.8;
    white-space: nowrap; overflow: hidden; margin-bottom: 20px;
  }
  .jr-names {
    display: flex; flex-direction: column; align-items: center;
    color: ${P.accent}; line-height: 1.1; margin-bottom: 16px;
  }
  .jr-name { font-size: clamp(2.8rem, 9vw, 4rem); font-style: italic; font-weight: 400; }
  .jr-amp  { font-size: clamp(2.2rem, 7vw, 3.2rem); font-style: italic; font-weight: 400; }

  .jr-divider {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; margin-bottom: 18px; width: 100%;
  }
  .jr-divider span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, ${P.accent}, transparent); }
  .jr-divider i    { color: ${P.accent}; font-style: normal; font-size: .75rem; }

  .jr-date-styled {
    font-size: clamp(1.1rem, 3vw, 1.4rem);
    color: ${P.textPrimary}; letter-spacing: .18em; margin-bottom: 10px;
  }
  .jr-time-txt {
    font-size: clamp(.58rem, 1.8vw, .72rem);
    letter-spacing: .3em; text-transform: uppercase;
    color: ${P.accent}; margin-bottom: 14px;
  }
  .jr-venue-txt {
    font-size: clamp(.86rem, 2.2vw, 1rem); font-style: italic;
    color: ${P.textSecondary}; margin-bottom: 4px;
  }
  .jr-addr-txt { font-size: clamp(.76rem, 2vw, .88rem); color: ${P.textMuted}; margin-bottom: 10px; }
  .jr-maps-mini { display: flex; gap: 16px; justify-content: center; direction: ltr; }
  .jr-map-link { font-size: .48rem; letter-spacing: .1em; text-transform: uppercase; color: ${P.accent}; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px; font-style: normal; }

  /* ── SECTIONS ── */
  .jr-label { font-size: .58rem; letter-spacing: .4em; text-transform: uppercase; color: ${P.accent}; margin-bottom: 8px; }
  .jr-title { font-size: clamp(1.4rem, 4vw, 2rem); font-weight: 400; font-style: italic; color: ${P.textPrimary}; margin-bottom: 16px; line-height: 1.3; }
  .jr-body  { font-style: italic; color: ${P.textSecondary}; line-height: 2; font-size: .98rem; margin-bottom: 16px; }

  /* COUNTDOWN */
  .jr-countdown { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; direction: ltr; }
  .jr-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 64px; padding: 12px 10px;
    background: rgba(255,255,255,.55);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border: 1px solid ${P.border}; position: relative;
  }
  .jr-cd::before,.jr-cd::after { content: ''; position: absolute; width: 10px; height: 10px; border: 1px solid ${P.accent}; }
  .jr-cd::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .jr-cd::after  { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  .jr-cd-num   { font-size: 2rem; color: ${P.accent}; line-height: 1; font-weight: 400; }
  .jr-cd-label { font-size: .52rem; color: ${P.textSecondary}; margin-top: 8px; letter-spacing: .1em; text-transform: uppercase; }

  /* PROGRAMME */
  .jr-program { display: flex; flex-direction: column; gap: 0; width: 100%; }
  .jr-prog-item {
    display: grid; grid-template-columns: 90px 24px 1fr; gap: 16px;
    align-items: center; padding: 14px 0;
    border-bottom: 1px solid ${P.border};
  }
  .jr-prog-item:last-child { border-bottom: none; }
  .jr-prog-time  { font-size: 1.2rem; color: ${P.accent}; font-weight: 400; }
  .jr-prog-star  { color: ${P.accent}; font-size: .9rem; text-align: center; }
  .jr-prog-event { font-size: .98rem; font-weight: 500; color: ${P.textPrimary}; }
  .jr-prog-venue { font-size: .84rem; font-style: italic; color: ${P.textMuted}; margin-top: 3px; }

  /* MAP */
  .jr-btn-row  { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 18px; direction: ltr; }
  .jr-btn-map  { padding: 14px 32px; background: ${P.accent}; color: #fff; text-decoration: none; font-size: .6rem; letter-spacing: .22em; text-transform: uppercase; transition: all .3s; }
  .jr-btn-map:hover { background: ${P.accentDark}; transform: translateY(-2px); }
  .jr-btn-outline { background: transparent; color: ${P.accentDark}; border: 1px solid ${P.accent}; }
  .jr-btn-outline:hover { background: ${P.accent}; color: #fff; }

  /* ── CARD (RSVP / GUESTBOOK) ── */
  .jr-card {
    width: calc(100% - 32px);
    margin: 0 16px;
    background: rgba(255,255,255,.65);
    border: 1px solid ${P.accent};
    border-radius: 4px;
    padding: 28px 24px 16px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
  }

  .jr-card-divider {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; width: 100%; margin: 10px 0;
  }
  .jr-card-divider span { flex: 1; height: 1px; background: ${P.border}; }
  .jr-card-divider i    { color: ${P.accent}; font-style: normal; font-size: .65rem; }

  .jr-card-title {
    font-size: clamp(1.6rem, 4vw, 2.1rem);
    font-weight: 400; font-style: italic; color: ${P.textPrimary};
    line-height: 1.25; margin: 6px 0;
  }
  .jr-card-dots { margin-top: 20px; letter-spacing: .35em; color: ${P.accent}; font-size: .7rem; opacity: .55; }

  /* FORM */
  .jr-form { width: 100%; display: flex; flex-direction: column; gap: 0; text-align: left; direction: ltr; margin-top: 8px; }
  .jr-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .jr-field-label { font-size: .48rem; letter-spacing: .32em; text-transform: uppercase; color: ${P.accent}; font-weight: 500; }
  .jr-input {
    width: 100%; padding: 12px 16px;
    background: rgba(255,255,255,.6);
    border: 1px solid rgba(184,112,112,.2);
    border-radius: 10px;
    color: ${P.textPrimary};
    font-family: 'EB Garamond', Garamond, Georgia, serif;
    font-size: 1rem; font-style: italic;
    outline: none; transition: border-color .25s;
  }
  .jr-input::placeholder { color: rgba(61,43,43,.35); }
  .jr-input:focus { border-color: ${P.accent}; }
  .jr-textarea { resize: vertical; min-height: 100px; }

  .jr-radios { display: flex; gap: 8px; width: 100%; }
  .jr-radio  {
    flex: 1; min-width: 0; padding: 10px 4px;
    background: transparent;
    border: 1px solid rgba(184,112,112,.35);
    border-radius: 10px;
    color: ${P.textSecondary};
    font-size: .46rem; letter-spacing: .12em; text-transform: uppercase;
    cursor: pointer; transition: all .2s; line-height: 1.4;
  }
  .jr-radio-on, .jr-radio:hover { background: ${P.accent}; border-color: ${P.accent}; color: #fff; }

  .jr-btn-submit {
    width: 100%; padding: 15px;
    background: transparent;
    border: 1px solid ${P.accent};
    border-radius: 4px;
    color: ${P.textPrimary};
    font-family: 'EB Garamond', Garamond, Georgia, serif;
    font-size: .52rem; letter-spacing: .3em; text-transform: uppercase;
    cursor: pointer; transition: all .3s; margin-top: 4px;
  }
  .jr-btn-submit:hover { background: ${P.accent}; color: #fff; }
  .jr-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  .jr-success { font-style: italic; color: ${P.accentDark}; padding: 20px; font-size: 1rem; text-align: center; }

  /* MESSAGES */
  .jr-messages { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 16px; text-align: left; }
  .jr-msg { border-bottom: 1px solid ${P.border}; padding: 12px 0; }
  .jr-msg-text   { font-style: italic; color: ${P.textSecondary}; line-height: 1.8; font-size: .95rem; }
  .jr-msg-author { margin-top: 6px; font-size: .58rem; color: ${P.accent}; letter-spacing: .1em; }

  /* FOOTER */
  .jr-footer-inner { width: calc(100% - 32px); display: flex; flex-direction: column; align-items: center; }
  .jr-footer-names  { font-size: 2.2rem; font-style: italic; color: ${P.accent}; margin-bottom: 4px; }
  .jr-footer-date   { font-style: italic; color: ${P.textSecondary}; font-size: .82rem; margin-bottom: 18px; }
  .jr-footer-credit { font-size: .48rem; letter-spacing: .2em; color: ${P.accent}; opacity: .5; text-transform: uppercase; }

  @media (max-width: 600px) {
    .jr-prog-item { grid-template-columns: 60px 16px 1fr; gap: 10px; }
    .jr-cd { min-width: 58px; padding: 12px 8px; }
    .jr-cd-num { font-size: 1.6rem; }
  }
  `
}
