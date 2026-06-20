'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import { getBgCSSForKey } from '@/lib/bg-texture-system'
import OpeningScreen from '@/components/common/OpeningScreen'
import { getToileBleueVariant, ToileBleueVariant } from '@/lib/template-variants'

const DEFAULT_DECO = 'assets/template1/deco1.png'
const ROSE_SRC = '/assets/template1/rose bleu apèrs les noms.png'
const DECO_W = 857
const DECO_H = 1200
const DECO_Y = 8
const decoWidthVh = (DECO_W / DECO_H * 100).toFixed(2)

export default function ToileBleue({ wedding }: { wedding: Wedding }) {
  const P = getToileBleueVariant(wedding.template_variant)
  const DECO_KEY = wedding.decoration_image ?? DEFAULT_DECO
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate, introText,
  } = useInvitationLogic(wedding)


  const dayName = eventDate.toLocaleDateString('fr-TN', { weekday: 'long' }).toUpperCase()
  const dateFr = eventDate.toLocaleDateString('fr-TN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()
  const timeFr = eventDate.toLocaleTimeString('fr-TN', {
    hour: '2-digit', minute: '2-digit',
  })

  const brideName = wedding.bride_name_ar || wedding.bride_name
  const groomName = wedding.groom_name_ar || wedding.groom_name
  const ampChar   = wedding.bride_name_ar ? 'و' : '&'

  return (
    <>
      {!opened && <OpeningScreen onOpen={openEnvelope} bgColor={P.bg} />}
      <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap"
        rel="stylesheet"
      />

      {/* 1. Fond couleur unie */}
      <style>{`
        .tb-texture-bg { background-image: none !important; background-color: ${P.bg} !important; }
        body { background-color: ${P.bg}; }
      `}</style>

      {/* 2. Zone vide + layout depuis BG_CONFIGS */}
      <style>{getBgCSSForKey(DECO_KEY, 'tb')}</style>

      {/* 3. Overrides dimension — même logique Bismillah/CarteSimple */}
      <style>{`
        @media (max-width: 768px) {
          .tb-deco-fixed { width: 100vw; height: 100vh; height: 100dvh; }
          .tb-texture-bg { background-size: 100vw 100vh !important; background-size: 100vw 100dvh !important; min-height: 100vh; min-height: 100dvh; }
          .tb-hero, .tb-section, .tb-rsvp-wrap, .tb-gb-wrap, .tb-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .tb-content-zone {
            margin-left: 0 !important; margin-right: 0 !important;
            padding-top: ${DECO_Y}vh; padding-bottom: 13vh;
          }
          .tb-footer .tb-content-zone { padding-top: 24px; padding-bottom: 13vh; }
        }
        @media (min-width: 769px) {
          .tb-deco-fixed { width: ${decoWidthVh}vh; height: 100vh; }
          .tb-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .tb-hero, .tb-section, .tb-rsvp-wrap, .tb-gb-wrap, .tb-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .tb-content-zone {
            margin-left: 0 !important; margin-right: 0 !important;
            padding-top: ${DECO_Y}vh; padding-bottom: 13vh;
          }
          .tb-footer .tb-content-zone { padding-top: 24px; padding-bottom: 13vh; }
        }
      `}</style>

      {/* 4. CSS composants */}
      <style>{buildCSS(P)}</style>
      <FontOverride font={wedding.custom_font} container=".tb-invitation" />

      <div className={`tb-invitation${visible ? ' tb-visible' : ''}`}>

        <img src={`/${DECO_KEY}`} alt="" className="tb-deco-fixed" aria-hidden="true" />

        <div className="tb-texture-bg">

          {/* ══ HERO ══ */}
          <section className="tb-hero">
            <div className="tb-content-zone">
              <p className="tb-intro">{introText}</p>
              <div className="tb-names">
                <span className="tb-name">{brideName}</span>
                <span className="tb-amp">{ampChar} {groomName}</span>
              </div>
              <div className="tb-date-block">
                <p className="tb-day-name">{dayName}</p>
                <p className="tb-date-line">{dateFr}</p>
              </div>
              <img src={ROSE_SRC} alt="" className="tb-rose" aria-hidden="true" />
              <p className="tb-time-txt">{timeFr}</p>
              {wedding.venue_name    && <p className="tb-venue-txt">{wedding.venue_name}</p>}
              {wedding.venue_address && <p className="tb-addr-txt">{wedding.venue_address}</p>}
              {(wedding.gps_google || wedding.gps_apple) && (
                <div className="tb-maps-mini">
                  {wedding.gps_google && <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="tb-map-link">Google Maps</a>}
                  {wedding.gps_apple  && <a href={wedding.gps_apple}  target="_blank" rel="noreferrer" className="tb-map-link">Apple Maps</a>}
                </div>
              )}
            </div>
          </section>

          {/* ══ COMPTE À REBOURS ══ */}
          {wedding.show_countdown && (
            <section className="tb-section">
              <div className="tb-content-zone">
                <p className="tb-label">Compte à rebours</p>
                <h2 className="tb-title">Le Grand Jour approche</h2>
                <div className="tb-countdown">
                  {[
                    { val: countdown.d, label: 'Jours' },
                    { val: countdown.h, label: 'Heures' },
                    { val: countdown.m, label: 'Minutes' },
                    { val: countdown.s, label: 'Secondes' },
                  ].map((item, i) => (
                    <div key={i} className="tb-cd">
                      <div className="tb-cd-num">{item.val}</div>
                      <div className="tb-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ PROGRAMME ══ */}
          {wedding.program?.length > 0 && (
            <section className="tb-section">
              <div className="tb-content-zone">
                <p className="tb-label">Déroulement</p>
                <h2 className="tb-title">Programme de la Soirée</h2>
                <div className="tb-program">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <div key={i} className="tb-prog-item">
                      <div className="tb-prog-time">{item.time}</div>
                      <div className="tb-prog-star">✦</div>
                      <div className="tb-prog-content">
                        <div className="tb-prog-event">{item.event}</div>
                        {item.venue && <div className="tb-prog-venue">{item.venue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ RSVP ══ */}
          {wedding.show_rsvp && (
            <section className="tb-rsvp-wrap">
              <div className="tb-content-zone">
                <div className="tb-card">
                  <div className="tb-card-divider"><span /><i>◆</i><span /></div>
                  <p className="tb-label">Confirmation</p>
                  <h2 className="tb-card-title">Serez-vous<br />des nôtres ?</h2>
                  <div className="tb-card-divider"><span /><i>◆</i><span /></div>
                  {rsvpStatus === 'done' ? (
                    <p className="tb-success">Merci ! Votre réponse a bien été enregistrée.</p>
                  ) : (
                    <form className="tb-form" onSubmit={submitRSVP} dir="ltr">
                      <div className="tb-field">
                        <label className="tb-field-label">Nom complet</label>
                        <input className="tb-input" name="name" placeholder="Prénom et nom..." required />
                      </div>
                      <div className="tb-field">
                        <label className="tb-field-label">WhatsApp</label>
                        <input className="tb-input" name="phone" placeholder="+216 ..." />
                      </div>
                      <div className="tb-field">
                        <label className="tb-field-label">Présence</label>
                        <div className="tb-radios">
                          {(['present', 'absent', 'maybe'] as const).map(s => (
                            <button
                              key={s}
                              type="button"
                              className={`tb-radio${rsvpChoice === s ? ' tb-radio-on' : ''}`}
                              onClick={() => setRsvpChoice(s)}
                            >
                              {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'En attente'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="tb-field">
                        <label className="tb-field-label">Accompagnants</label>
                        <input className="tb-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                      </div>
                      <div className="tb-field">
                        <label className="tb-field-label">Message optionnel</label>
                        <textarea className="tb-input tb-textarea" name="note" placeholder="Une note pour les mariés..." />
                      </div>
                      <button className="tb-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                        {rsvpStatus === 'loading' ? 'Envoi...' : '◆  Confirmer ma présence  ◆'}
                      </button>
                    </form>
                  )}
                  <div className="tb-card-dots">• • •</div>
                </div>
              </div>
            </section>
          )}

          {/* ══ LIVRE D'OR ══ */}
          {wedding.show_guestbook && (
            <section className="tb-gb-wrap">
              <div className="tb-content-zone">
                <div className="tb-card">
                  <div className="tb-card-divider"><span /><i>◆</i><span /></div>
                  <p className="tb-label">Livre d'or</p>
                  <h2 className="tb-card-title">Laissez votre<br />message</h2>
                  <div className="tb-card-divider"><span /><i>◆</i><span /></div>
                  {messages.length > 0 && (
                    <div className="tb-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className="tb-msg">
                          <p className="tb-msg-text">{msg.message}</p>
                          <p className="tb-msg-author">— {msg.author_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {gbStatus === 'done' ? (
                    <p className="tb-success">
                      {gbPending ? 'En attente de validation' : 'Message publié'}
                    </p>
                  ) : (
                    <form className="tb-form" onSubmit={submitMessage} dir="ltr">
                      <div className="tb-field">
                        <label className="tb-field-label">Votre prénom</label>
                        <input className="tb-input" name="author_name" placeholder="ex. Yasmine..." required />
                      </div>
                      <div className="tb-field">
                        <label className="tb-field-label">Vos vœux</label>
                        <textarea className="tb-input tb-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                      </div>
                      <button className="tb-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                        {gbStatus === 'loading' ? 'Envoi...' : '◆  Publier mon message  ◆'}
                      </button>
                    </form>
                  )}
                  <div className="tb-card-dots">• • •</div>
                </div>
              </div>
            </section>
          )}

          {/* ══ FOOTER ══ */}
          <footer className="tb-footer">
            <div className="tb-content-zone">
              <div className="tb-footer-names">{brideName} {ampChar} {groomName}</div>
              <div className="tb-footer-date">{dateFr}</div>
              <div className="tb-footer-credit">Élégance Digitale™</div>
            </div>
          </footer>

        </div>
      </div>
    </>
  )
}

function buildCSS(P: ToileBleueVariant): string {
  return `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'EB Garamond', Garamond, Georgia, serif; color: ${P.textPrimary}; overflow-x: hidden; }

  .tb-invitation {
    opacity: 0; transform: translateY(24px);
    transition: opacity 1s, transform 1s;
    font-family: 'EB Garamond', Garamond, Georgia, serif;
  }
  .tb-invitation.tb-visible { opacity: 1; transform: none; }

  .tb-deco-fixed {
    position: fixed; top: 0;
    pointer-events: none; z-index: 10;
    object-fit: fill;
  }
  @media (max-width: 768px) { .tb-deco-fixed { left: 0; } }
  @media (min-width: 769px) { .tb-deco-fixed { left: 50%; transform: translateX(-50%); } }

  .tb-hero, .tb-section, .tb-rsvp-wrap, .tb-gb-wrap, .tb-footer {
    width: 100%;
    position: relative;
    background: transparent;
  }

  /* ── HERO ── */
  .tb-intro {
    font-family: 'EB Garamond', Garamond, Georgia, serif;
    font-size: clamp(.58rem, 2.2vw, 1.05rem); font-weight: 400; font-style: italic;
    color: ${P.textSecondary}; line-height: 1.8; letter-spacing: .03em;
    max-width: 100%; white-space: nowrap; overflow: hidden; margin-bottom: 22px;
  }
  .tb-names {
    display: flex; flex-direction: column; align-items: center;
    font-family: 'EB Garamond', Garamond, Georgia, serif;
    color: ${P.accent}; line-height: 1.05; margin-bottom: 16px;
  }
  .tb-name { font-size: clamp(2.6rem, 8.5vw, 4.2rem); font-weight: 500; letter-spacing: .05em; }
  .tb-amp  { font-size: clamp(2rem, 6.5vw, 3.2rem); font-style: italic; font-weight: 500; }

  .tb-date-block {
    display: flex; flex-direction: column; align-items: center;
    gap: 3px; margin-bottom: 22px;
  }
  .tb-day-name {
    font-size: clamp(.58rem, 1.8vw, .72rem);
    letter-spacing: .35em; text-transform: uppercase;
    color: ${P.accent}; font-weight: 400;
  }
  .tb-date-line {
    font-size: clamp(.58rem, 1.8vw, .72rem);
    letter-spacing: .25em;
    color: ${P.accent}; font-weight: 400;
  }

  .tb-rose {
    width: 70px; height: auto;
    display: block; margin: 0 auto 18px;
    opacity: 0.88;
  }

  .tb-time-txt {
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    font-family: 'EB Garamond', Garamond, Georgia, serif;
    font-weight: 400; color: ${P.accent};
    letter-spacing: .06em; margin-bottom: 12px;
  }
  .tb-venue-txt {
    font-size: clamp(.82rem, 2.2vw, .95rem); font-weight: 400;
    color: ${P.textSecondary}; letter-spacing: .04em; margin-bottom: 4px;
    font-style: italic;
  }
  .tb-addr-txt { font-size: clamp(.75rem, 2vw, .87rem); color: ${P.textMuted}; margin-bottom: 10px; }
  .tb-maps-mini { display: flex; gap: 16px; justify-content: center; direction: ltr; }
  .tb-map-link { font-size: .48rem; letter-spacing: .15em; text-transform: uppercase; color: ${P.accent}; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px; }

  /* ── SECTIONS ── */
  .tb-label { font-size: .55rem; letter-spacing: .4em; text-transform: uppercase; color: ${P.accent}; margin-bottom: 8px; }
  .tb-title { font-family: 'EB Garamond', Garamond, Georgia, serif; font-size: clamp(1.4rem, 4vw, 2rem); font-weight: 400; color: ${P.textPrimary}; margin-bottom: 16px; line-height: 1.3; }
  .tb-body  { font-style: italic; color: ${P.textSecondary}; line-height: 2; font-size: .98rem; margin-bottom: 16px; }

  /* COUNTDOWN */
  .tb-countdown { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; direction: ltr; }
  .tb-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 64px; padding: 12px 10px;
    background: rgba(255,255,255,.45);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border: 1px solid ${P.border}; position: relative;
  }
  .tb-cd::before,.tb-cd::after { content: ''; position: absolute; width: 10px; height: 10px; border: 1px solid ${P.accent}; }
  .tb-cd::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .tb-cd::after  { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  .tb-cd-num   { font-family: 'EB Garamond', Garamond, Georgia, serif; font-size: 2rem; color: ${P.accent}; line-height: 1; font-weight: 400; }
  .tb-cd-label { font-size: .52rem; color: ${P.textSecondary}; margin-top: 8px; letter-spacing: .1em; text-transform: uppercase; }

  /* PROGRAMME */
  .tb-program { display: flex; flex-direction: column; gap: 0; width: 100%; }
  .tb-prog-item {
    display: grid; grid-template-columns: 90px 24px 1fr; gap: 16px;
    align-items: center; padding: 14px 0;
    border-bottom: 1px solid rgba(61,90,138,.2);
  }
  .tb-prog-item:last-child { border-bottom: none; }
  .tb-prog-time  { font-family: 'EB Garamond', Garamond, Georgia, serif; font-size: 1.2rem; color: ${P.accent}; font-weight: 400; }
  .tb-prog-star  { color: ${P.accent}; font-size: .9rem; text-align: center; }
  .tb-prog-event { font-size: .98rem; font-weight: 500; color: ${P.textPrimary}; }
  .tb-prog-venue { font-size: .84rem; font-style: italic; color: ${P.textMuted}; margin-top: 3px; }

  /* MAP */
  .tb-btn-row  { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 18px; direction: ltr; }
  .tb-btn-map  { padding: 14px 32px; background: ${P.accent}; color: #fff; text-decoration: none; font-size: .6rem; letter-spacing: .22em; text-transform: uppercase; transition: all .3s; }
  .tb-btn-map:hover { background: ${P.accentDark}; transform: translateY(-2px); }
  .tb-btn-outline { background: transparent; color: ${P.accentDark}; border: 1px solid ${P.accent}; }
  .tb-btn-outline:hover { background: ${P.accent}; color: #fff; }

  /* ── CARD (RSVP / GUESTBOOK) ── */
  .tb-card {
    width: calc(100% - 32px);
    margin: 0 16px;
    background: rgba(255,255,255,.55);
    border: 1px solid ${P.accent};
    border-radius: 4px;
    padding: 28px 24px 16px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
  }

  .tb-card-divider {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; width: 100%; margin: 10px 0;
  }
  .tb-card-divider span { flex: 1; height: 1px; background: ${P.border}; }
  .tb-card-divider i    { color: ${P.accent}; font-style: normal; font-size: .65rem; }

  .tb-card-title {
    font-family: 'EB Garamond', Garamond, Georgia, serif;
    font-size: clamp(1.6rem, 4vw, 2.1rem);
    font-weight: 400; color: ${P.textPrimary};
    line-height: 1.25; margin: 6px 0;
  }

  .tb-card-dots {
    margin-top: 20px; letter-spacing: .35em;
    color: ${P.accent}; font-size: .7rem; opacity: .55;
  }

  /* FORM */
  .tb-form { width: 100%; display: flex; flex-direction: column; gap: 0; text-align: left; direction: ltr; margin-top: 8px; }
  .tb-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .tb-field-label {
    font-size: .48rem; letter-spacing: .32em; text-transform: uppercase;
    color: ${P.accent}; font-weight: 500;
  }
  .tb-input {
    width: 100%; padding: 12px 16px;
    background: rgba(255,255,255,.6);
    border: 1px solid rgba(61,90,138,.2);
    border-radius: 10px;
    color: ${P.textPrimary};
    font-family: 'EB Garamond', Garamond, Georgia, serif;
    font-size: 1rem; font-style: italic;
    outline: none; transition: border-color .25s;
  }
  .tb-input::placeholder { color: rgba(44,36,22,.35); }
  .tb-input:focus { border-color: ${P.accent}; }
  .tb-textarea { resize: vertical; min-height: 100px; font-style: italic; }

  .tb-radios { display: flex; gap: 8px; width: 100%; }
  .tb-radio  {
    flex: 1; min-width: 0; padding: 10px 4px;
    background: transparent;
    border: 1px solid rgba(61,90,138,.35);
    border-radius: 10px;
    color: ${P.textSecondary};
    font-size: .46rem; letter-spacing: .12em; text-transform: uppercase;
    cursor: pointer; transition: all .2s; line-height: 1.4;
  }
  .tb-radio-on, .tb-radio:hover { background: ${P.accent}; border-color: ${P.accent}; color: #fff; }

  .tb-btn-submit {
    width: 100%; padding: 15px;
    background: transparent;
    border: 1px solid ${P.accent};
    border-radius: 4px;
    color: ${P.textPrimary};
    font-family: 'EB Garamond', Garamond, Georgia, serif;
    font-size: .52rem; letter-spacing: .3em; text-transform: uppercase;
    cursor: pointer; transition: all .3s; margin-top: 4px;
  }
  .tb-btn-submit:hover { background: ${P.accent}; color: #fff; }
  .tb-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  .tb-success { font-style: italic; color: ${P.accentDark}; padding: 20px; font-size: 1rem; text-align: center; }

  /* MESSAGES */
  .tb-messages { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 16px; text-align: left; }
  .tb-msg { border-bottom: 1px solid ${P.border}; padding: 12px 0; }
  .tb-msg-text   { font-style: italic; color: ${P.textSecondary}; line-height: 1.8; font-size: .95rem; }
  .tb-msg-author { margin-top: 6px; font-size: .58rem; color: ${P.accent}; letter-spacing: .1em; }

  /* FOOTER */
  .tb-footer-names  { font-family: 'EB Garamond', Garamond, Georgia, serif; font-size: 2.2rem; font-style: italic; color: ${P.accent}; margin-bottom: 4px; }
  .tb-footer-date   { font-style: italic; color: ${P.textSecondary}; font-size: .82rem; margin-bottom: 18px; }
  .tb-footer-credit { font-size: .48rem; letter-spacing: .2em; color: ${P.accent}; opacity: .5; text-transform: uppercase; }

  @media (max-width: 600px) {
    .tb-prog-item { grid-template-columns: 60px 16px 1fr; gap: 10px; }
    .tb-cd { min-width: 58px; padding: 12px 8px; }
    .tb-cd-num { font-size: 1.6rem; }
  }
  `
}
