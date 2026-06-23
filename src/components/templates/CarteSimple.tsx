'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import OpeningScreen from '@/components/common/OpeningScreen'
import { getIvoirePalette, IvoirePalette } from '@/lib/ivoire-palettes'
import { getBgCSSForKey, BG_CONFIGS } from '@/lib/bg-texture-system'

function parseVariant(v?: string | null) {
  const [paletteId = 'or_classique'] = (v ?? '').split('|')
  return { paletteId }
}

export default function CarteSimple({ wedding }: { wedding: Wedding }) {
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate, introText,
  } = useInvitationLogic(wedding)


  const { paletteId } = parseVariant(wedding.template_variant)
  const palette = getIvoirePalette(paletteId)

  const bgKey = (wedding.background_image && BG_CONFIGS[wedding.background_image])
    ? wedding.background_image
    : 'decoration7.png'
  const bgCfg = BG_CONFIGS[bgKey]
  const decoWidthVh = (bgCfg.imgW / bgCfg.imgH * 100).toFixed(2)

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
      {!opened && <OpeningScreen onOpen={openEnvelope} bgColor={palette.bg} />}
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap"
        rel="stylesheet"
      />

      {/* 1. Palette — fond couleur unie (override background-image du système) */}
      <style>{`
        .cs-texture-bg { background-image: none !important; background-color: ${palette.bg} !important; }
        body { background-color: ${palette.bg}; }
      `}</style>

      {/* 2. Zone vide + layout — généré depuis BG_CONFIGS, même système que Bismillah */}
      <style>{getBgCSSForKey(bgKey, 'cs')}</style>

      {/* 3. Overrides dimension — identique au bloc dynamique de Bismillah */}
      <style>{`
        @media (max-width: 768px) {
          .cs-deco-fixed { width: 100vw; height: 100vh; height: 100dvh; }
          .cs-texture-bg { background-size: 100vw 100vh !important; background-size: 100vw 100dvh !important; min-height: 100vh; min-height: 100dvh; }
          .cs-hero, .cs-section, .cs-rsvp-wrap, .cs-gb-wrap, .cs-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .cs-content-zone {
            margin-left: 0 !important; margin-right: 0 !important;
            padding-top: ${bgCfg.y}vh; padding-bottom: ${bgCfg.y}vh;
          }
          .cs-footer .cs-content-zone { padding-top: 24px; padding-bottom: ${bgCfg.y}vh; }
        }
        @media (min-width: 769px) {
          .cs-deco-fixed { width: ${decoWidthVh}vh; height: 100vh; }
          .cs-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .cs-hero, .cs-section, .cs-rsvp-wrap, .cs-gb-wrap, .cs-footer {
            display: flex !important; flex-direction: column; align-items: center;
          }
          .cs-content-zone {
            margin-left: 0 !important; margin-right: 0 !important;
            padding-top: ${bgCfg.y}vh; padding-bottom: ${bgCfg.y}vh;
          }
          .cs-footer .cs-content-zone { padding-top: 24px; padding-bottom: ${bgCfg.y}vh; }
        }
      `}</style>

      {/* 4. CSS composants */}
      <style>{buildCSS(palette)}</style>
      <FontOverride font={wedding.custom_font} container=".cs-invitation" />

      {/* ═══════════════════════════════════════════════════════
          STRUCTURE IDENTIQUE À BISMILLAH :
          cs-invitation
            ├─ cs-deco-fixed  (img fixed z-index:10, par-dessus le fond)
            └─ cs-texture-bg  (fond couleur unie, contient TOUTES les sections)
                 ├─ cs-hero > cs-content-zone
                 ├─ cs-section > cs-content-zone  (×N)
                 └─ cs-footer > cs-content-zone
      ═══════════════════════════════════════════════════════ */}
      <div className={`cs-invitation${visible ? ' cs-visible' : ''}`}>

        {/* Décoration fixe — se superpose au fond, couvre le même écran */}
        <img
          src={`/${bgKey}`}
          alt=""
          className="cs-deco-fixed"
          aria-hidden="true"
        />

        {/* Fond couleur unie — UN SEUL wrapper, contient toutes les sections */}
        <div className="cs-texture-bg">

          {/* ══ HERO ══ */}
          <section className="cs-hero">
            <div className="cs-content-zone">
              <span className="cs-heart">♥</span>
              <p className="cs-intro">{introText}</p>
              <div className="cs-names">
                <span className="cs-name" data-ef="bride_name">{brideName}</span>
                <span className="cs-amp">{ampChar} <span data-ef="groom_name">{groomName}</span></span>
              </div>
              <div className="cs-divider">
                <span /><i>✦</i><span />
              </div>
              <div className="cs-event-info">
                <p className="cs-date-txt">Le {dateFr}</p>
                <p className="cs-time-txt">{timeFr}</p>
                {wedding.venue_name    && <p className="cs-venue-txt" data-ef="venue_name">{wedding.venue_name}</p>}
                {wedding.venue_address && <p className="cs-addr-txt">{wedding.venue_address}</p>}
                {(wedding.gps_google || wedding.gps_apple) && (
                  <div className="cs-maps-mini">
                    {wedding.gps_google && <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="cs-map-link">Google Maps</a>}
                    {wedding.gps_apple  && <a href={wedding.gps_apple}  target="_blank" rel="noreferrer" className="cs-map-link">Apple Maps</a>}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ══ COMPTE À REBOURS ══ */}
          {wedding.show_countdown && (
            <section className="cs-section">
              <div className="cs-content-zone">
                <p className="cs-label">Compte à rebours</p>
                <h2 className="cs-title">Le Grand Jour approche</h2>
                <div className="cs-countdown">
                  {[
                    { val: countdown.d, label: 'Jours' },
                    { val: countdown.h, label: 'Heures' },
                    { val: countdown.m, label: 'Minutes' },
                    { val: countdown.s, label: 'Secondes' },
                  ].map((item, i) => (
                    <div key={i} className="cs-cd">
                      <div className="cs-cd-num">{item.val}</div>
                      <div className="cs-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ PROGRAMME ══ */}
          {wedding.program?.length > 0 && (
            <section className="cs-section">
              <div className="cs-content-zone">
                <p className="cs-label">Déroulement</p>
                <h2 className="cs-title">Programme de la Soirée</h2>
                <div className="cs-program">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <div key={i} className="cs-prog-item">
                      <div className="cs-prog-time">{item.time}</div>
                      <div className="cs-prog-star">✦</div>
                      <div className="cs-prog-content">
                        <div className="cs-prog-event">{item.event}</div>
                        {item.venue && <div className="cs-prog-venue">{item.venue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══ RSVP ══ */}
          {wedding.show_rsvp && (
            <section className="cs-rsvp-wrap">
              <div className="cs-content-zone">
                <div className="cs-card">
                  <div className="cs-card-divider"><span /><i>◆</i><span /></div>
                  <p className="cs-label">Confirmation</p>
                  <h2 className="cs-card-title">Serez-vous<br />des nôtres ?</h2>
                  <div className="cs-card-divider"><span /><i>◆</i><span /></div>
                  {rsvpStatus === 'done' ? (
                    <p className="cs-success">Merci ! Votre réponse a bien été enregistrée.</p>
                  ) : (
                    <form className="cs-form" onSubmit={submitRSVP} dir="ltr">
                      <div className="cs-field">
                        <label className="cs-field-label">Nom complet</label>
                        <input className="cs-input" name="name" placeholder="Prénom et nom..." required />
                      </div>
                      <div className="cs-field">
                        <label className="cs-field-label">WhatsApp</label>
                        <input className="cs-input" name="phone" placeholder="+216 ..." />
                      </div>
                      <div className="cs-field">
                        <label className="cs-field-label">Présence</label>
                        <div className="cs-radios">
                          {(['present', 'absent', 'maybe'] as const).map(s => (
                            <button
                              key={s}
                              type="button"
                              className={`cs-radio${rsvpChoice === s ? ' cs-radio-on' : ''}`}
                              onClick={() => setRsvpChoice(s)}
                            >
                              {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'En attente'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="cs-field">
                        <label className="cs-field-label">Accompagnants</label>
                        <input className="cs-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                      </div>
                      <div className="cs-field">
                        <label className="cs-field-label">Message optionnel</label>
                        <textarea className="cs-input cs-textarea" name="note" placeholder="Une note pour les mariés..." />
                      </div>
                      <button className="cs-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                        {rsvpStatus === 'loading' ? 'Envoi...' : '◆  Confirmer ma présence  ◆'}
                      </button>
                    </form>
                  )}
                  <div className="cs-card-dots">• • •</div>
                </div>
              </div>
            </section>
          )}

          {/* ══ LIVRE D'OR ══ */}
          {wedding.show_guestbook && (
            <section className="cs-gb-wrap">
              <div className="cs-content-zone">
                <div className="cs-card">
                  <div className="cs-card-divider"><span /><i>◆</i><span /></div>
                  <p className="cs-label">Livre d'or</p>
                  <h2 className="cs-card-title">Laissez votre<br />message</h2>
                  <div className="cs-card-divider"><span /><i>◆</i><span /></div>
                  {messages.length > 0 && (
                    <div className="cs-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className="cs-msg">
                          <p className="cs-msg-text">{msg.message}</p>
                          <p className="cs-msg-author">— {msg.author_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {gbStatus === 'done' ? (
                    <p className="cs-success">
                      {gbPending ? 'En attente de validation' : 'Message publié'}
                    </p>
                  ) : (
                    <form className="cs-form" onSubmit={submitMessage} dir="ltr">
                      <div className="cs-field">
                        <label className="cs-field-label">Votre prénom</label>
                        <input className="cs-input" name="author_name" placeholder="ex. Yasmine..." required />
                      </div>
                      <div className="cs-field">
                        <label className="cs-field-label">Vos vœux</label>
                        <textarea className="cs-input cs-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                      </div>
                      <button className="cs-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                        {gbStatus === 'loading' ? 'Envoi...' : '◆  Publier mon message  ◆'}
                      </button>
                    </form>
                  )}
                  <div className="cs-card-dots">• • •</div>
                </div>
              </div>
            </section>
          )}

          {/* ══ FOOTER ══ */}
          <footer className="cs-footer">
            <div className="cs-content-zone">
              <div className="cs-footer-inner">
                <div className="cs-footer-names">{brideName} {ampChar} {groomName}</div>
                <div className="cs-footer-date">{dateFr}</div>
                <div className="cs-footer-credit">Élégance Digitale™</div>
              </div>
            </div>
          </footer>

        </div>{/* fin cs-texture-bg */}
      </div>
    </>
  )
}

function buildCSS(p: IvoirePalette): string {
  return `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Cormorant Garamond', Georgia, serif; color: ${p.textPrimary}; overflow-x: hidden; }

  /* Invitation wrapper */
  .cs-invitation {
    opacity: 0; transform: translateY(24px);
    transition: opacity 1s, transform 1s;
    font-family: 'Cormorant Garamond', Georgia, serif;
  }
  .cs-invitation.cs-visible { opacity: 1; transform: none; }

  /* Décoration fixe — même règle que .bs-deco-fixed dans Bismillah */
  .cs-deco-fixed {
    position: fixed; top: 0;
    pointer-events: none; z-index: 10;
    object-fit: fill;
  }
  @media (max-width: 768px) { .cs-deco-fixed { left: 0; } }
  @media (min-width: 769px) { .cs-deco-fixed { left: 50%; transform: translateX(-50%); } }

  /* Sections — transparentes, même règle que Bismillah */
  .cs-hero, .cs-section, .cs-rsvp-wrap, .cs-gb-wrap, .cs-footer {
    width: 100%;
    position: relative;
    background: transparent;
  }

  /* ── HERO : éléments ── */
  .cs-heart {
    font-size: 1.6rem; color: ${p.accent};
    margin-bottom: 18px; display: block;
  }
  .cs-intro {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(.58rem, 2.2vw, 1.05rem); font-weight: 300;
    color: ${p.textSecondary}; line-height: 1.8; letter-spacing: .03em;
    max-width: 100%; white-space: nowrap; overflow: hidden; margin-bottom: 20px;
  }
  .cs-names {
    display: flex; flex-direction: column; align-items: center;
    font-family: 'Great Vibes', cursive, Georgia, serif;
    color: ${p.accent}; line-height: 1.05; margin-bottom: 20px;
  }
  .cs-name { font-size: clamp(3rem, 10vw, 5rem); }
  .cs-amp  { font-size: clamp(2.5rem, 8.5vw, 4.2rem); }

  .cs-divider {
    display: flex; align-items: center; justify-content: center;
    gap: 14px; margin-bottom: 20px; width: 100%;
  }
  .cs-divider span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, ${p.accent}, transparent); }
  .cs-divider i    { color: ${p.accent}; font-style: normal; font-size: .9rem; }

  .cs-event-info { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .cs-date-txt  { font-size: clamp(.9rem, 2.4vw, 1.05rem); font-weight: 300; color: ${p.textSecondary}; letter-spacing: .04em; }
  .cs-venue-txt { font-size: clamp(.86rem, 2.2vw, 1rem); font-weight: 300; color: ${p.textSecondary}; }
  .cs-addr-txt  { font-size: clamp(.78rem, 2vw, .9rem); color: ${p.textMuted}; margin-bottom: 8px; }
  .cs-maps-mini { display: flex; gap: 16px; justify-content: center; direction: ltr; margin-bottom: 4px; }
  .cs-map-link  { font-size: .48rem; letter-spacing: .15em; text-transform: uppercase; color: ${p.accent}; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px; }
  .cs-time-txt  { font-size: .58rem; letter-spacing: .24em; text-transform: uppercase; color: ${p.accent}; margin-top: 4px; }

  /* ── SECTIONS ── */
  .cs-label { font-size: .58rem; letter-spacing: .4em; text-transform: uppercase; color: ${p.accent}; margin-bottom: 8px; }
  .cs-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 300; color: ${p.textPrimary}; margin-bottom: 16px; line-height: 1.3; }
  .cs-body  { font-style: italic; color: ${p.textSecondary}; line-height: 2; font-size: .98rem; margin-bottom: 16px; }

  /* COUNTDOWN */
  .cs-countdown { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; direction: ltr; }
  .cs-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 64px; padding: 12px 10px;
    background: rgba(255,255,255,.45);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border: 1px solid ${p.border}; position: relative;
  }
  .cs-cd::before,.cs-cd::after { content: ''; position: absolute; width: 10px; height: 10px; border: 1px solid ${p.accent}; }
  .cs-cd::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
  .cs-cd::after  { bottom: -1px; right: -1px; border-left: none; border-top: none; }
  .cs-cd-num   { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; color: ${p.accent}; line-height: 1; font-weight: 300; }
  .cs-cd-label { font-size: .52rem; color: ${p.textSecondary}; margin-top: 8px; letter-spacing: .1em; text-transform: uppercase; }

  /* PROGRAMME */
  .cs-program { display: flex; flex-direction: column; gap: 0; width: 100%; }
  .cs-prog-item {
    display: grid; grid-template-columns: 90px 24px 1fr; gap: 16px;
    align-items: center; padding: 14px 0;
    border-bottom: 1px solid rgba(201,168,76,.2);
  }
  .cs-prog-item:last-child { border-bottom: none; }
  .cs-prog-time    { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.2rem; color: ${p.accent}; font-weight: 300; }
  .cs-prog-star    { color: ${p.accent}; font-size: .9rem; text-align: center; }
  .cs-prog-event   { font-size: .98rem; font-weight: 500; color: ${p.textPrimary}; }
  .cs-prog-venue   { font-size: .84rem; font-style: italic; color: ${p.textMuted}; margin-top: 3px; }

  /* MAP */
  .cs-btn-row  { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 18px; direction: ltr; }
  .cs-btn-map  { padding: 14px 32px; background: ${p.accent}; color: #fff; text-decoration: none; font-size: .6rem; letter-spacing: .22em; text-transform: uppercase; transition: all .3s; }
  .cs-btn-map:hover { background: ${p.accentDark}; transform: translateY(-2px); }
  .cs-btn-outline { background: transparent; color: ${p.accentDark}; border: 1px solid ${p.accent}; }
  .cs-btn-outline:hover { background: ${p.accent}; color: #fff; }

  /* ── CARD (RSVP / GUESTBOOK) ── */
  .cs-card {
    width: calc(100% - 32px);
    margin: 0 16px;
    background: rgba(255,255,255,.55);
    border: 1px solid ${p.accent};
    border-radius: 4px;
    padding: 28px 24px 16px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
  }

  .cs-card-divider {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; width: 100%; margin: 10px 0;
  }
  .cs-card-divider span { flex: 1; height: 1px; background: ${p.border}; }
  .cs-card-divider i    { color: ${p.accent}; font-style: normal; font-size: .65rem; }

  .cs-card-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(1.6rem, 4vw, 2.1rem);
    font-weight: 400; color: ${p.textPrimary};
    line-height: 1.25; margin: 6px 0;
  }

  .cs-card-dots {
    margin-top: 20px; letter-spacing: .35em;
    color: ${p.accent}; font-size: .7rem; opacity: .55;
  }

  /* FORM */
  .cs-form { width: 100%; display: flex; flex-direction: column; gap: 0; text-align: left; direction: ltr; margin-top: 8px; }
  .cs-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .cs-field-label {
    font-size: .48rem; letter-spacing: .32em; text-transform: uppercase;
    color: ${p.accent}; font-weight: 500;
  }
  .cs-input {
    width: 100%; padding: 12px 16px;
    background: rgba(255,255,255,.6);
    border: 1px solid rgba(201,168,76,.2);
    border-radius: 10px;
    color: ${p.textPrimary};
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem; font-style: italic;
    outline: none; transition: border-color .25s;
  }
  .cs-input::placeholder { color: rgba(44,36,22,.35); }
  .cs-input:focus { border-color: ${p.accent}; }
  .cs-textarea { resize: vertical; min-height: 100px; }

  .cs-radios { display: flex; gap: 8px; width: 100%; }
  .cs-radio  {
    flex: 1; min-width: 0; padding: 10px 4px;
    background: transparent;
    border: 1px solid rgba(201,168,76,.35);
    border-radius: 10px;
    color: ${p.textSecondary};
    font-size: .46rem; letter-spacing: .12em; text-transform: uppercase;
    cursor: pointer; transition: all .2s; line-height: 1.4;
  }
  .cs-radio-on, .cs-radio:hover { background: ${p.accent}; border-color: ${p.accent}; color: #fff; }

  .cs-btn-submit {
    width: 100%; padding: 15px;
    background: transparent;
    border: 1px solid ${p.accent};
    border-radius: 4px;
    color: ${p.textPrimary};
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: .52rem; letter-spacing: .3em; text-transform: uppercase;
    cursor: pointer; transition: all .3s; margin-top: 4px;
  }
  .cs-btn-submit:hover { background: ${p.accent}; color: #fff; }
  .cs-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  .cs-success { font-style: italic; color: ${p.accentDark}; padding: 20px; font-size: 1rem; text-align: center; }

  /* MESSAGES */
  .cs-messages { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 16px; text-align: left; }
  .cs-msg { border-bottom: 1px solid ${p.border}; padding: 12px 0; }
  .cs-msg-text   { font-style: italic; color: ${p.textSecondary}; line-height: 1.8; font-size: .95rem; }
  .cs-msg-author { margin-top: 6px; font-size: .58rem; color: ${p.accent}; letter-spacing: .1em; }

  /* FOOTER */
  .cs-footer-inner {
    width: calc(100% - 32px);
    display: flex; flex-direction: column; align-items: center;
  }
  .cs-footer-names  { font-family: 'Great Vibes', cursive, Georgia, serif; font-size: 2rem; color: ${p.accent}; margin-bottom: 4px; }
  .cs-footer-date   { font-style: italic; color: ${p.textSecondary}; font-size: .82rem; margin-bottom: 18px; }
  .cs-footer-credit { font-size: .48rem; letter-spacing: .2em; color: ${p.accent}; opacity: .5; text-transform: uppercase; }

  /* Mobile small */
  @media (max-width: 600px) {
    .cs-prog-item { grid-template-columns: 60px 16px 1fr; gap: 10px; }
    .cs-cd { min-width: 58px; padding: 12px 8px; }
    .cs-cd-num { font-size: 1.6rem; }
  }
  `
}
