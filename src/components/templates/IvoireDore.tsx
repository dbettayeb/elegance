'use client'
import { useEffect } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'
import { getBgTextureCSS, BG_CONFIGS } from '@/lib/bg-texture-system'
import { getIvoirePalette, IvoirePalette } from '@/lib/ivoire-palettes'

/* ─── parse template_variant: "palette_id|layout_id" ─── */
function parseVariant(v?: string | null) {
  const [paletteId = 'or_classique', layoutId = 'layout_a'] = (v ?? '').split('|')
  return { paletteId, layoutId: layoutId as 'layout_a' | 'layout_b' | 'layout_c' }
}

export default function IvoireDore({ wedding }: { wedding: Wedding }) {
  const {
    opened, openEnvelope, visible,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate, introText,
  } = useInvitationLogic(wedding)

  useEffect(() => { if (!opened) openEnvelope() }, [])

  const { paletteId, layoutId } = parseVariant(wedding.template_variant)
  const palette = getIvoirePalette(paletteId)

  const bgKey = (wedding.background_image && BG_CONFIGS[wedding.background_image])
    ? wedding.background_image
    : 'decoration7.png'
  const bgCfg = BG_CONFIGS[bgKey]

  const dateFr = eventDate.toLocaleDateString('fr-TN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const timeFr = eventDate.toLocaleTimeString('fr-TN', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{getBgTextureCSS(`/${bgKey}`, bgCfg, 'iv')}</style>
      <style>{buildCSS(palette)}</style>
      <FontOverride font={wedding.custom_font} />

      {/* Décoration overlay fixe */}
      {wedding.decoration_image && wedding.decoration_image !== 'none' && (
        <div
          className="iv-deco-fixed"
          style={{ backgroundImage: `url(/${wedding.decoration_image})` }}
        />
      )}

      <div className={`iv-texture-bg iv-root${visible ? ' iv-visible' : ''}`}>

        {/* ══ HERO ══ */}
        <section className="iv-hero">
          <div className="iv-content-zone">
            {layoutId === 'layout_a' && <LayoutA wedding={wedding} introText={introText} dateFr={dateFr} timeFr={timeFr} />}
            {layoutId === 'layout_b' && <LayoutB wedding={wedding} introText={introText} dateFr={dateFr} timeFr={timeFr} />}
            {layoutId === 'layout_c' && <LayoutC wedding={wedding} dateFr={dateFr} timeFr={timeFr} />}
          </div>
        </section>

        {/* ══ COMPTE À REBOURS ══ */}
        {wedding.show_countdown && (
          <section className="iv-section">
            <p className="iv-label">Compte à rebours</p>
            <h2 className="iv-title">Le Grand Jour approche</h2>
            <div className="iv-countdown">
              {[
                { val: countdown.d, label: 'Jours' },
                { val: countdown.h, label: 'Heures' },
                { val: countdown.m, label: 'Minutes' },
                { val: countdown.s, label: 'Secondes' },
              ].map((item, i) => (
                <div key={i} className="iv-cd-block">
                  <span className="iv-cd-num">{item.val}</span>
                  <span className="iv-cd-lbl">{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="iv-divider">✦</div>

        {/* ══ PROGRAMME ══ */}
        {wedding.program?.length > 0 && (
          <section className="iv-section">
            <p className="iv-label">Déroulement</p>
            <h2 className="iv-title">Programme de la Soirée</h2>
            <ul className="iv-timeline">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <li key={i} className={`iv-tl-item ${i % 2 === 0 ? 'iv-tl-l' : 'iv-tl-r'}`}>
                  <div className="iv-tl-content">
                    <span className="iv-tl-time">{item.time}</span>
                    <div className="iv-tl-event">{item.event}</div>
                    {item.venue && <div className="iv-tl-venue">{item.venue}</div>}
                  </div>
                  <div className="iv-tl-dot"><div className="iv-tl-dot-inner" /></div>
                  <div className="iv-tl-empty" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="iv-divider">✦</div>

        {/* ══ LIEU ══ */}
        <section className="iv-section">
          <p className="iv-label">Le Lieu</p>
          <h2 className="iv-title">{wedding.venue_name}</h2>
          {wedding.venue_address && <p className="iv-body">{wedding.venue_address}</p>}
          <div className="iv-map-card">
            <div className="iv-btn-row">
              {wedding.gps_google && (
                <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="iv-btn-map">
                  📍 Google Maps
                </a>
              )}
              {wedding.gps_apple && (
                <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="iv-btn-map iv-btn-dark">
                  🗺 Apple Maps
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="iv-divider">✦</div>

        {/* ══ RSVP ══ */}
        {wedding.show_rsvp && (
          <div className="iv-rsvp-wrap">
            <p className="iv-label" style={{ color: 'var(--iv-gold-l)' }}>Confirmation</p>
            <h2 className="iv-title" style={{ color: '#FAF7F0' }}>Serez-vous des nôtres ?</h2>
            {rsvpStatus === 'done' ? (
              <p className="iv-rsvp-ok">Merci ! Votre réponse a bien été enregistrée. 🤍</p>
            ) : (
              <form className="iv-rsvp-form" onSubmit={submitRSVP}>
                <input className="iv-input" name="name" placeholder="Votre prénom et nom" required />
                <input className="iv-input" name="phone" placeholder="Votre numéro WhatsApp" />
                <div className="iv-radio-group">
                  {(['present', 'absent', 'maybe'] as const).map(s => (
                    <div key={s}
                      className={`iv-radio${rsvpChoice === s ? ' iv-radio-on' : ''}`}
                      onClick={() => setRsvpChoice(s)}>
                      {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                    </div>
                  ))}
                </div>
                <input className="iv-input" name="guests" type="number" min="0" max="20"
                  placeholder="Nombre d'accompagnants" />
                <textarea className="iv-input iv-textarea" name="note" placeholder="Message optionnel..." />
                <button className="iv-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                  {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer ma présence'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ══ LIVRE D'OR ══ */}
        {wedding.show_guestbook && (
          <div className="iv-gb-wrap">
            <p className="iv-label">Livre d'or</p>
            <h2 className="iv-title">Laissez votre message</h2>
            <div className="iv-messages">
              {messages.map(msg => (
                <div key={msg.id} className="iv-msg-card">
                  <div className="iv-msg-name">{msg.author_name}</div>
                  <div className="iv-msg-text">"{msg.message}"</div>
                </div>
              ))}
            </div>
            {gbStatus === 'done' ? (
              <p className="iv-gb-ok">
                {gbPending
                  ? 'Votre message sera visible après validation. Merci !'
                  : 'Votre message a été publié. Merci !'}
              </p>
            ) : (
              <form className="iv-gb-form" onSubmit={submitMessage}>
                <input className="iv-gb-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="iv-gb-input iv-gb-textarea" name="message"
                  placeholder="Votre message de vœux..." required />
                <button className="iv-btn-gb" type="submit" disabled={gbStatus === 'loading'}>
                  {gbStatus === 'loading' ? 'Envoi...' : 'Publier mon message ✦'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ══ FOOTER ══ */}
        <footer className="iv-footer">
          <div className="iv-footer-names">{wedding.bride_name} &amp; {wedding.groom_name}</div>
          <div className="iv-footer-date">{dateFr}</div>
          <div className="iv-footer-credit">Élégance Digitale™</div>
        </footer>

      </div>
    </>
  )
}

/* ══════════════════════════════════════════
   LAYOUT A — Classique centré
   Cœur → intro → Noms grands → séparateur → date → lieu
══════════════════════════════════════════ */
function LayoutA({ wedding, introText, dateFr, timeFr }: LayoutProps) {
  return (
    <>
      <div className="iv-heart">♥</div>
      <p className="iv-intro">{introText}</p>
      <div className="iv-names">
        <span className="iv-name">{wedding.bride_name}</span>
        <span className="iv-amp">&amp;</span>
        <span className="iv-name">{wedding.groom_name}</span>
      </div>
      <div className="iv-line-sep" />
      <p className="iv-date-txt">Le {dateFr}</p>
      {wedding.venue_name && <p className="iv-venue-txt">{wedding.venue_name}</p>}
      {wedding.venue_address && <p className="iv-addr-txt">{wedding.venue_address}</p>}
      <p className="iv-time-txt">{timeFr}</p>
    </>
  )
}

/* ══════════════════════════════════════════
   LAYOUT B — Noms en vedette
   Noms très grands → ornement → intro → date encadrée → lieu
══════════════════════════════════════════ */
function LayoutB({ wedding, introText, dateFr, timeFr }: LayoutProps) {
  return (
    <>
      <div className="iv-names iv-names-xl">
        <span className="iv-name iv-name-xl">{wedding.bride_name}</span>
        <span className="iv-amp iv-amp-xl">&amp;</span>
        <span className="iv-name iv-name-xl">{wedding.groom_name}</span>
      </div>
      <div className="iv-ornament">✦ ── ✦</div>
      <p className="iv-intro iv-intro-sm">{introText}</p>
      <div className="iv-date-box">
        <span className="iv-date-day">{new Date(dateFr).getDate() || ''}</span>
        <span className="iv-date-month">
          {/* extract month from dateFr string */}
          {dateFr.split(' ')[1]}
        </span>
        <span className="iv-date-year">{dateFr.split(' ').at(-1)}</span>
      </div>
      {wedding.venue_name && <p className="iv-venue-txt">{wedding.venue_name}</p>}
      {wedding.venue_address && <p className="iv-addr-txt">{wedding.venue_address}</p>}
      <p className="iv-time-txt">{timeFr}</p>
    </>
  )
}

/* ══════════════════════════════════════════
   LAYOUT C — Minimaliste
   Noms + fine ligne + date + lieu, sans texte d'intro
══════════════════════════════════════════ */
function LayoutC({ wedding, dateFr, timeFr }: Omit<LayoutProps, 'introText'>) {
  return (
    <>
      <div className="iv-names">
        <span className="iv-name">{wedding.bride_name}</span>
        <span className="iv-amp">&amp;</span>
        <span className="iv-name">{wedding.groom_name}</span>
      </div>
      <div className="iv-line-sep iv-line-sep-wide" />
      <p className="iv-date-txt iv-date-txt-lg">Le {dateFr}</p>
      <p className="iv-time-txt">{timeFr}</p>
      {wedding.venue_name && <p className="iv-venue-txt iv-venue-bold">{wedding.venue_name}</p>}
      {wedding.venue_address && <p className="iv-addr-txt">{wedding.venue_address}</p>}
    </>
  )
}

interface LayoutProps {
  wedding: Wedding
  introText: string
  dateFr: string
  timeFr: string
}

/* ══════════════════════════════════════════
   CSS dynamique (palette injectée)
══════════════════════════════════════════ */
function buildCSS(p: IvoirePalette): string {
  return `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Cormorant Garamond',Georgia,serif;background:${p.bg};color:${p.textPrimary};overflow-x:hidden}

  /* ROOT */
  .iv-root{opacity:0;transform:translateY(14px);transition:opacity .9s ease,transform .9s ease}
  .iv-root.iv-visible{opacity:1;transform:none}

  /* DECO FIXED OVERLAY */
  .iv-deco-fixed{
    position:fixed;inset:0;z-index:0;pointer-events:none;
    background-repeat:no-repeat;background-size:contain;background-position:center;
  }

  /* HERO */
  .iv-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;z-index:1}

  /* ── Éléments communs ── */
  .iv-heart{font-size:1.5rem;color:${p.accent};margin-bottom:16px;display:block}

  .iv-intro{
    font-size:.95rem;font-weight:300;color:${p.textSecondary};
    line-height:1.75;margin-bottom:22px;letter-spacing:.04em;
  }
  .iv-intro-sm{font-size:.82rem;margin-bottom:18px}

  .iv-names{
    display:flex;flex-direction:column;align-items:center;
    font-family:'Great Vibes',cursive,Georgia,serif;
    color:${p.accent};line-height:1.05;margin-bottom:18px;
  }
  .iv-name {font-size:clamp(2.8rem,11vw,5rem)}
  .iv-amp  {font-size:clamp(2rem,7.5vw,3.5rem);color:${p.accentDark}}
  .iv-names-xl{margin-bottom:12px}
  .iv-name-xl{font-size:clamp(3.4rem,13vw,6rem)}
  .iv-amp-xl {font-size:clamp(2.4rem,9vw,4.2rem)}

  .iv-ornament{
    font-size:.75rem;letter-spacing:.5em;color:${p.accent};
    margin-bottom:16px;opacity:.7;
  }

  .iv-line-sep{
    width:50px;height:1px;margin:0 auto 16px;
    background:linear-gradient(90deg,transparent,${p.accent},transparent);
  }
  .iv-line-sep-wide{width:80px;margin-bottom:20px}

  .iv-date-txt{font-size:1rem;font-weight:300;color:${p.textSecondary};margin-bottom:4px;letter-spacing:.05em}
  .iv-date-txt-lg{font-size:1.15rem;margin-bottom:8px}
  .iv-venue-txt{font-size:.95rem;font-weight:300;color:${p.textSecondary};margin-bottom:2px}
  .iv-venue-bold{font-weight:500}
  .iv-addr-txt{font-size:.82rem;color:${p.textMuted};margin-bottom:2px}
  .iv-time-txt{font-size:.68rem;letter-spacing:.25em;text-transform:uppercase;color:${p.accent};margin-top:8px}

  /* ── Layout B date-box ── */
  .iv-date-box{
    display:inline-flex;flex-direction:column;align-items:center;
    border:1px solid ${p.border};padding:14px 30px;
    position:relative;margin-bottom:14px;
  }
  .iv-date-box::before{content:'';position:absolute;top:-1px;left:-1px;width:10px;height:10px;border-top:1px solid ${p.accent};border-left:1px solid ${p.accent}}
  .iv-date-box::after {content:'';position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;border-bottom:1px solid ${p.accent};border-right:1px solid ${p.accent}}
  .iv-date-day  {font-size:2.2rem;font-weight:300;color:${p.accentDark};line-height:1}
  .iv-date-month{font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:${p.textMuted};margin:3px 0}
  .iv-date-year {font-size:1rem;color:${p.accent}}

  /* SECTIONS */
  .iv-section{max-width:680px;margin:0 auto;padding:60px 24px;text-align:center;background:${p.bg}}
  .iv-label{font-size:.56rem;letter-spacing:.4em;text-transform:uppercase;color:${p.accent};margin-bottom:10px}
  .iv-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.5rem,4vw,2.1rem);font-weight:300;color:${p.textPrimary};margin-bottom:14px;line-height:1.3}
  .iv-body {font-style:italic;color:${p.textSecondary};line-height:1.9;font-size:.95rem}
  .iv-divider{text-align:center;color:${p.accent};font-size:.9rem;letter-spacing:.5em;padding:5px 0;opacity:.55;background:${p.bg}}

  /* COUNTDOWN */
  .iv-countdown{display:flex;gap:18px;justify-content:center;margin-top:22px;flex-wrap:wrap}
  .iv-cd-block {display:flex;flex-direction:column;align-items:center;min-width:56px}
  .iv-cd-num   {font-family:'Cormorant Garamond',Georgia,serif;font-size:2.4rem;font-weight:300;color:${p.textPrimary};line-height:1}
  .iv-cd-lbl   {font-size:.5rem;letter-spacing:.22em;text-transform:uppercase;color:${p.accent};margin-top:4px}

  /* TIMELINE */
  .iv-timeline{list-style:none;position:relative;max-width:520px;margin:28px auto 0}
  .iv-timeline::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:linear-gradient(180deg,transparent,${p.border} 15%,${p.border} 85%,transparent);transform:translateX(-50%)}
  .iv-tl-item{display:grid;grid-template-columns:1fr 28px 1fr;gap:8px;align-items:center;margin-bottom:22px}
  .iv-tl-l .iv-tl-content{text-align:right;grid-column:1}
  .iv-tl-l .iv-tl-dot    {grid-column:2}
  .iv-tl-l .iv-tl-empty  {grid-column:3}
  .iv-tl-r .iv-tl-empty  {grid-column:1}
  .iv-tl-r .iv-tl-dot    {grid-column:2}
  .iv-tl-r .iv-tl-content{text-align:left;grid-column:3}
  .iv-tl-dot      {display:flex;align-items:center;justify-content:center;z-index:1}
  .iv-tl-dot-inner{width:7px;height:7px;background:${p.accent};border-radius:50%;box-shadow:0 0 0 3px ${p.bg},0 0 0 4px ${p.border}}
  .iv-tl-time {font-size:.52rem;letter-spacing:.16em;color:${p.accent};display:block;margin-bottom:2px}
  .iv-tl-event{font-size:.95rem;font-weight:500;color:${p.textPrimary}}
  .iv-tl-venue{font-size:.82rem;color:${p.textMuted};font-style:italic}

  /* MAP */
  .iv-map-card{border:1px solid ${p.border};padding:22px 16px;margin-top:22px;position:relative}
  .iv-map-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${p.accent},transparent)}
  .iv-btn-row {display:flex;justify-content:center;flex-wrap:wrap;gap:10px}
  .iv-btn-map {display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,${p.accentDark},${p.accent});color:#fff;text-decoration:none;padding:11px 22px;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;transition:all .3s}
  .iv-btn-map:hover{transform:translateY(-2px);box-shadow:0 6px 18px ${p.accentSoft}}
  .iv-btn-dark{background:linear-gradient(135deg,#444,#222)}

  /* RSVP */
  .iv-rsvp-wrap{background:linear-gradient(135deg,${p.accentDark} 0%,${p.textPrimary} 100%);padding:60px 24px;text-align:center}
  .iv-rsvp-form{max-width:400px;margin:24px auto 0;display:flex;flex-direction:column;gap:11px}
  .iv-input{width:100%;padding:12px 15px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);color:#FAF7F0;font-family:'Cormorant Garamond',Georgia,serif;font-size:.92rem;outline:none;transition:border-color .3s}
  .iv-input::placeholder{color:rgba(255,255,255,.35);font-style:italic}
  .iv-input:focus{border-color:${p.accent}}
  .iv-textarea{resize:vertical;min-height:66px}
  .iv-radio-group{display:flex;gap:6px}
  .iv-radio{flex:1;padding:10px 4px;border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.65);font-size:.56rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;text-align:center;transition:all .2s}
  .iv-radio-on,.iv-radio:hover{background:${p.accent};border-color:${p.accent};color:#fff}
  .iv-btn-submit{padding:14px;background:linear-gradient(135deg,${p.accentDark},${p.accent});color:#fff;border:none;font-size:.58rem;letter-spacing:.24em;text-transform:uppercase;cursor:pointer;transition:opacity .3s}
  .iv-btn-submit:hover{opacity:.88}
  .iv-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .iv-rsvp-ok{font-style:italic;color:${p.accentSoft};padding:16px;margin-top:18px;font-size:1.1rem;color:#E8D49E}

  /* GUESTBOOK */
  .iv-gb-wrap {background:${p.bg};padding:60px 24px;text-align:center}
  .iv-messages{display:flex;flex-direction:column;gap:10px;max-width:480px;margin:24px auto 0;text-align:left}
  .iv-msg-card{border-left:2px solid ${p.border};padding:10px 14px}
  .iv-msg-name{font-size:.52rem;letter-spacing:.16em;text-transform:uppercase;color:${p.accent};margin-bottom:3px}
  .iv-msg-text{font-style:italic;color:${p.textSecondary};line-height:1.6;font-size:.9rem}
  .iv-gb-form {max-width:480px;margin:22px auto 0;display:flex;flex-direction:column;gap:9px;text-align:left}
  .iv-gb-input{width:100%;padding:11px 14px;border:1px solid ${p.border};background:#fff;font-family:'Cormorant Garamond',Georgia,serif;font-size:.92rem;outline:none;transition:border-color .3s;color:${p.textPrimary}}
  .iv-gb-input:focus{border-color:${p.accent}}
  .iv-gb-textarea{resize:vertical;min-height:72px}
  .iv-btn-gb{padding:11px 24px;background:transparent;border:1px solid ${p.accent};color:${p.accentDark};font-size:.56rem;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;transition:all .3s;align-self:flex-end}
  .iv-btn-gb:hover{background:${p.accent};color:#fff}
  .iv-btn-gb:disabled{opacity:.5;cursor:not-allowed}
  .iv-gb-ok{font-style:italic;color:${p.accentDark};padding:16px;max-width:440px;margin:0 auto;line-height:1.8;font-size:.95rem}

  /* FOOTER */
  .iv-footer{padding:40px 24px;text-align:center;background:${p.bg};border-top:1px solid ${p.border}}
  .iv-footer-names {font-family:'Great Vibes',cursive,Georgia,serif;font-size:2rem;color:${p.accentDark};margin-bottom:4px}
  .iv-footer-date  {font-style:italic;color:${p.textMuted};font-size:.82rem;margin-bottom:20px}
  .iv-footer-credit{font-size:.48rem;letter-spacing:.2em;color:${p.accent};opacity:.5;text-transform:uppercase}

  @media(max-width:480px){
    .iv-timeline::before{left:14px}
    .iv-tl-item{grid-template-columns:18px 1fr}
    .iv-tl-l .iv-tl-content,.iv-tl-r .iv-tl-content{text-align:left;grid-column:2}
    .iv-tl-l .iv-tl-dot,.iv-tl-r .iv-tl-dot{grid-column:1}
    .iv-tl-empty{display:none}
  }
`
}
