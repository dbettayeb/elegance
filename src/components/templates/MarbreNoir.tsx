'use client'
import { Wedding, ProgramItem  } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/fontoverride'

export default function MarbreNoir({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate, introText,
  } = useInvitationLogic(wedding)

  const formattedTime = eventDate.toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' })
  const formattedDate = eventDate.toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <>
      <style>{CSS}</style>
      <FontOverride font={wedding.custom_font} container=".mb-container" />

      {/* Texture marbre SVG en background */}
      <svg className="mb-marble" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <filter id="mb-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.7  0 0 0 0 0.7  0 0 0 0 0.7  0 0 0 0.1 0"/>
          </filter>
          <filter id="mb-veins">
            <feTurbulence type="turbulence" baseFrequency="0.02 0.08" numOctaves="2" seed="3"/>
            <feDisplacementMap in="SourceGraphic" scale="20"/>
            <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.85  0 0 0 0 0.82  0 0 0 0.15 0"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#1C1C1C"/>
        <rect width="100%" height="100%" filter="url(#mb-noise)" opacity="0.4"/>
        <g filter="url(#mb-veins)">
          <line x1="0" y1="30%" x2="100%" y2="60%" stroke="#888" strokeWidth="0.5"/>
          <line x1="0" y1="70%" x2="100%" y2="40%" stroke="#666" strokeWidth="0.4"/>
          <line x1="20%" y1="0" x2="40%" y2="100%" stroke="#999" strokeWidth="0.3"/>
        </g>
      </svg>

      {/* ENVELOPPE */}
      {!opened && (
        <div className="mb-env-screen">
          <div className="mb-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="mb-env-svg" fill="none">
              <defs>
                <linearGradient id="mb-env-grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2A2A2A"/>
                  <stop offset="50%" stopColor="#1C1C1C"/>
                  <stop offset="100%" stopColor="#2A2A2A"/>
                </linearGradient>
                <linearGradient id="mb-platine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#C0C0C0"/>
                  <stop offset="50%" stopColor="#E5E4E2"/>
                  <stop offset="100%" stopColor="#A8A8A8"/>
                </linearGradient>
              </defs>
              <rect x="10" y="40" width="260" height="150" rx="2" fill="url(#mb-env-grad)" stroke="url(#mb-platine)" strokeWidth="1.2"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#222" stroke="url(#mb-platine)" strokeWidth="0.8"/>
              <path d="M10 40 L140 110 L10 190Z" fill="#1A1A1A" stroke="url(#mb-platine)" strokeWidth="0.6"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#1A1A1A" stroke="url(#mb-platine)" strokeWidth="0.6"/>
              <path d="M10 40 L140 115 L270 40Z" fill="#2A2A2A" stroke="url(#mb-platine)" strokeWidth="1.2"/>
              {/* Monogramme */}
              <g transform="translate(140 108)">
                <rect x="-20" y="-12" width="40" height="24" fill="none" stroke="url(#mb-platine)" strokeWidth="0.6"/>
                <text textAnchor="middle" y="4" fontFamily="Georgia,serif" fontSize="10" fill="#E5E4E2" letterSpacing="3">
                  {wedding.bride_name[0]}{wedding.groom_name[0]}
                </text>
              </g>
            </svg>
          </div>
          <p className="mb-env-hint">— Touchez pour ouvrir —</p>
        </div>
      )}

      {/* INVITATION */}
      <div className={`mb-invitation${visible ? ' mb-visible' : ''}`}>

        {/* HERO */}
        <section className="mb-hero">
          <div className="mb-mono">
            <div className="mb-mono-frame">
              <div className="mb-mono-letters">
                {wedding.bride_name[0]}<span>·</span>{wedding.groom_name[0]}
              </div>
            </div>
          </div>
          <p className="mb-pre">{introText}</p>
          <h1 className="mb-names">
            <span>{wedding.bride_name}</span>
            <span className="mb-amp">&</span>
            <span>{wedding.groom_name}</span>
          </h1>
          <div className="mb-divider"><span></span></div>
          {wedding.custom_message && (
            <p className="mb-custom">{wedding.custom_message}</p>
          )}
          <div className="mb-date-wrap">
            <div className="mb-date-day">{eventDate.toLocaleDateString('fr-TN', { weekday: 'long' }).toUpperCase()}</div>
            <div className="mb-date-main">
              <span className="mb-date-num">{eventDate.getDate()}</span>
              <div className="mb-date-mid">
                <div className="mb-date-month">{eventDate.toLocaleDateString('fr-TN', { month: 'long' }).toUpperCase()}</div>
                <div className="mb-date-line"></div>
                <div className="mb-date-yr">{eventDate.getFullYear()}</div>
              </div>
            </div>
            <div className="mb-date-time">— {formattedTime} —</div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="mb-section">
          <p className="mb-label">Compte à rebours</p>
          <h2 className="mb-title">Le grand jour</h2>
          <div className="mb-countdown">
            {[
              { val: countdown.d, label: 'Jours' },
              { val: countdown.h, label: 'Heures' },
              { val: countdown.m, label: 'Minutes' },
              { val: countdown.s, label: 'Secondes' },
            ].map((item, i) => (
              <div key={i} className="mb-cd">
                <div className="mb-cd-num">{item.val}</div>
                <div className="mb-cd-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMME */}
        {wedding.show_program !== false && wedding.program?.length > 0 && (
          <section className="mb-section">
            <p className="mb-label">Déroulement</p>
            <h2 className="mb-title">Programme</h2>
            <div className="mb-program">
              {(wedding.program as ProgramItem []).map((item, i) => (
                <div key={i} className="mb-prog-item">
                  <div className="mb-prog-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="mb-prog-content">
                    <div className="mb-prog-time">{item.time}</div>
                    <div className="mb-prog-event">{item.event}</div>
                    {item.venue && <div className="mb-prog-venue">{item.venue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIEU */}
        <section className="mb-section">
          <p className="mb-label">Le lieu</p>
          <h2 className="mb-title">{wedding.venue_name}</h2>
          {wedding.venue_address && <p className="mb-body">{wedding.venue_address}</p>}
          <div className="mb-btn-row">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="mb-btn-map">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="mb-btn-map mb-btn-alt">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        {wedding.show_rsvp && (
        <section className="mb-section mb-rsvp">
          <p className="mb-label">Confirmation</p>
          <h2 className="mb-title">Honorez-nous de votre présence</h2>
          {rsvpStatus === 'done' ? (
            <p className="mb-success">— Votre réponse a bien été enregistrée —</p>
          ) : (
            <form className="mb-form" onSubmit={submitRSVP}>
              <input className="mb-input" name="name" placeholder="Prénom et nom" required />
              <input className="mb-input" name="phone" placeholder="Numéro WhatsApp" />
              <div className="mb-radios">
                {(['present', 'absent', 'maybe'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`mb-radio${rsvpChoice === s ? ' mb-radio-on' : ''}`}
                    onClick={() => setRsvpChoice(s)}
                  >
                    {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'À confirmer'}
                  </button>
                ))}
              </div>
              <input className="mb-input" name="guests" type="number" min="0" max="20" placeholder="Accompagnants" />
              <textarea className="mb-input mb-textarea" name="note" placeholder="Message (optionnel)" />
              <button className="mb-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer'}
              </button>
            </form>
          )}
        </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="mb-section">
            <p className="mb-label">Livre d'or</p>
            <h2 className="mb-title">Mots de bienveillance</h2>
            {messages.length > 0 && (
              <div className="mb-messages">
                {messages.map(msg => (
                  <div key={msg.id} className="mb-msg">
                    <div className="mb-msg-text">"{msg.message}"</div>
                    <div className="mb-msg-name">— {msg.author_name} —</div>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="mb-success" style={{ marginTop: '20px' }}>
                — {gbPending ? 'Message en attente de validation' : 'Message publié'} —
              </p>
            ) : (
              <form className="mb-form" onSubmit={submitMessage} style={{ marginTop: '24px' }}>
                <input className="mb-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="mb-input mb-textarea" name="message" placeholder="Vos vœux..." required />
                <button className="mb-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                  Publier
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="mb-footer">
          <div className="mb-divider"><span></span></div>
          <div className="mb-footer-names">{wedding.bride_name} & {wedding.groom_name}</div>
          <div className="mb-footer-date">{formattedDate}</div>
          <div className="mb-footer-credit">— Élégance Digitale™ —</div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Montserrat',sans-serif;
    background:#1C1C1C;color:#E5E4E2;overflow-x:hidden;
  }
  .mb-marble{
    position:fixed;inset:0;width:100%;height:100%;
    z-index:0;pointer-events:none;
  }

  /* Enveloppe */
  .mb-env-screen{
    position:fixed;inset:0;z-index:1000;
    background:radial-gradient(ellipse at center,#2A2A2A 0%,#1C1C1C 70%,#0A0A0A 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
  }
  .mb-env-wrap{
    cursor:pointer;
    filter:drop-shadow(0 20px 50px rgba(0,0,0,0.6));
    transition:transform .3s;
  }
  .mb-env-wrap:hover{transform:translateY(-4px) scale(1.02)}
  .mb-env-svg{width:280px;height:auto}
  .mb-env-hint{
    margin-top:32px;font-family:Georgia,serif;font-size:.85rem;
    color:#C0C0C0;letter-spacing:.3em;font-style:italic;
    animation:mbShine 2.5s ease-in-out infinite;
  }
  @keyframes mbShine{0%,100%{opacity:.5}50%{opacity:1}}

  /* Invitation */
  .mb-invitation{
    opacity:0;transform:translateY(20px);
    transition:opacity 1.2s,transform 1.2s;
    position:relative;z-index:1;
  }
  .mb-invitation.mb-visible{opacity:1;transform:none}

  /* Hero */
  .mb-hero{
    min-height:100vh;padding:80px 24px 60px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;
  }
  .mb-mono{margin-bottom:40px}
  .mb-mono-frame{
    width:80px;height:80px;
    border:1px solid #C0C0C0;
    display:flex;align-items:center;justify-content:center;
    background:rgba(28,28,28,0.5);
    position:relative;
  }
  .mb-mono-frame::before,.mb-mono-frame::after{
    content:'';position:absolute;width:12px;height:12px;
    border:1px solid #E5E4E2;
  }
  .mb-mono-frame::before{top:-5px;left:-5px;border-right:none;border-bottom:none}
  .mb-mono-frame::after{bottom:-5px;right:-5px;border-left:none;border-top:none}
  .mb-mono-letters{
    font-family:Georgia,serif;font-size:1.4rem;
    color:#E5E4E2;letter-spacing:.3em;font-weight:300;
  }
  .mb-mono-letters span{color:#C0C0C0;margin:0 -4px}
  .mb-pre{
    font-size:.65rem;letter-spacing:.5em;text-transform:uppercase;
    color:#A8A8A8;margin-bottom:32px;font-weight:300;
  }
  .mb-names{
    font-family:Georgia,serif;font-weight:200;
    font-size:clamp(2.8rem,9vw,5rem);
    line-height:1.1;color:#E5E4E2;letter-spacing:.02em;
    display:flex;flex-direction:column;align-items:center;gap:8px;
    margin:0;
    text-shadow:0 2px 20px rgba(229,228,226,0.1);
  }
  .mb-names span{display:block}
  .mb-amp{
    font-style:italic;color:#C0C0C0;
    font-size:clamp(1.4rem,4vw,2.2rem) !important;
    margin:8px 0 !important;
  }
  .mb-divider{
    width:200px;margin:32px 0 28px;
    display:flex;align-items:center;justify-content:center;gap:14px;
  }
  .mb-divider::before,.mb-divider::after{
    content:'';flex:1;height:1px;
    background:linear-gradient(90deg,transparent,#C0C0C0,transparent);
  }
  .mb-divider span{
    width:6px;height:6px;background:#C0C0C0;transform:rotate(45deg);
  }
  .mb-custom{
    font-family:Georgia,serif;font-size:1.05rem;font-style:italic;
    color:#B8B8B6;line-height:1.9;max-width:480px;margin-bottom:48px;
  }
  .mb-date-wrap{
    display:flex;flex-direction:column;align-items:center;gap:14px;
    padding:32px 48px;
    border:1px solid rgba(192,192,192,0.3);
    background:rgba(28,28,28,0.5);backdrop-filter:blur(8px);
    position:relative;
  }
  .mb-date-wrap::before,.mb-date-wrap::after{
    content:'';position:absolute;width:18px;height:18px;
    border:1px solid #C0C0C0;
  }
  .mb-date-wrap::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .mb-date-wrap::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .mb-date-day{
    font-size:.7rem;letter-spacing:.45em;text-transform:uppercase;
    color:#A8A8A8;font-weight:400;
  }
  .mb-date-main{display:flex;align-items:center;gap:20px}
  .mb-date-num{
    font-family:Georgia,serif;font-weight:200;font-size:4rem;
    color:#E5E4E2;line-height:1;
  }
  .mb-date-mid{display:flex;flex-direction:column;align-items:center;gap:6px}
  .mb-date-month{
    font-size:.72rem;letter-spacing:.4em;color:#C0C0C0;font-weight:500;
  }
  .mb-date-line{width:24px;height:1px;background:#C0C0C0}
  .mb-date-yr{
    font-family:Georgia,serif;font-size:1.2rem;color:#E5E4E2;font-weight:300;
  }
  .mb-date-time{
    font-size:.7rem;letter-spacing:.35em;color:#A8A8A8;
    text-transform:uppercase;font-weight:400;margin-top:8px;
  }

  /* Sections */
  .mb-section{
    max-width:680px;margin:0 auto;
    padding:80px 24px;text-align:center;position:relative;
  }
  .mb-label{
    font-size:.6rem;letter-spacing:.5em;text-transform:uppercase;
    color:#A8A8A8;margin-bottom:14px;font-weight:400;
  }
  .mb-title{
    font-family:Georgia,serif;font-weight:200;
    font-size:clamp(1.8rem,4vw,2.4rem);
    color:#E5E4E2;margin-bottom:32px;line-height:1.3;
  }
  .mb-body{
    font-family:Georgia,serif;font-size:1.05rem;font-style:italic;
    color:#B8B8B6;line-height:1.8;margin-bottom:24px;
  }

  /* Countdown */
  .mb-countdown{
    display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
  }
  .mb-cd{
    display:flex;flex-direction:column;align-items:center;
    min-width:78px;padding:20px 14px;
    background:rgba(42,42,42,0.6);
    border:1px solid rgba(192,192,192,0.2);
    position:relative;
  }
  .mb-cd::before,.mb-cd::after{
    content:'';position:absolute;width:8px;height:8px;
    border:1px solid #C0C0C0;
  }
  .mb-cd::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .mb-cd::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .mb-cd-num{
    font-family:Georgia,serif;font-weight:200;font-size:2.2rem;
    color:#E5E4E2;line-height:1;
  }
  .mb-cd-label{
    font-size:.58rem;letter-spacing:.3em;color:#A8A8A8;
    margin-top:10px;text-transform:uppercase;
  }

  /* Programme */
  .mb-program{
    display:flex;flex-direction:column;
    max-width:520px;margin:0 auto;text-align:left;
  }
  .mb-prog-item{
    display:grid;grid-template-columns:50px 1fr;gap:20px;
    align-items:flex-start;padding:20px 0;
    border-bottom:1px solid rgba(192,192,192,0.15);
  }
  .mb-prog-item:last-child{border-bottom:none}
  .mb-prog-num{
    font-family:Georgia,serif;font-weight:200;font-size:1.4rem;
    color:#C0C0C0;line-height:1;
  }
  .mb-prog-time{
    font-size:.65rem;letter-spacing:.3em;color:#A8A8A8;
    text-transform:uppercase;margin-bottom:6px;
  }
  .mb-prog-event{
    font-family:Georgia,serif;font-size:1.15rem;color:#E5E4E2;font-weight:300;
  }
  .mb-prog-venue{
    font-size:.85rem;font-style:italic;color:#B8B8B6;margin-top:4px;
  }

  /* Map */
  .mb-btn-row{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:24px}
  .mb-btn-map{
    padding:14px 36px;
    background:linear-gradient(135deg,#E5E4E2,#C0C0C0);
    color:#1C1C1C;text-decoration:none;
    font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;
    font-weight:600;transition:all .3s;
  }
  .mb-btn-map:hover{
    transform:translateY(-2px);
    box-shadow:0 8px 24px rgba(229,228,226,0.2);
  }
  .mb-btn-alt{
    background:transparent;color:#E5E4E2;
    border:1px solid #C0C0C0;
  }

  /* RSVP */
  .mb-rsvp{
    background:rgba(10,10,10,0.6);
    max-width:none;
    border-top:1px solid rgba(192,192,192,0.15);
    border-bottom:1px solid rgba(192,192,192,0.15);
  }
  .mb-rsvp > *{max-width:680px;margin-left:auto;margin-right:auto}
  .mb-form{
    max-width:440px;margin:0 auto;
    display:flex;flex-direction:column;gap:14px;text-align:left;
  }
  .mb-input{
    width:100%;padding:14px 18px;
    background:rgba(42,42,42,0.5);
    border:1px solid rgba(192,192,192,0.25);
    color:#E5E4E2;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .mb-input::placeholder{color:rgba(229,228,226,0.35);font-style:italic}
  .mb-input:focus{border-color:#C0C0C0}
  .mb-textarea{resize:vertical;min-height:80px}
  .mb-radios{display:flex;gap:8px}
  .mb-radio{
    flex:1;padding:12px 6px;
    background:transparent;
    border:1px solid rgba(192,192,192,0.25);
    color:rgba(229,228,226,0.7);
    font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;
    cursor:pointer;transition:all .2s;font-family:inherit;font-weight:500;
  }
  .mb-radio-on,.mb-radio:hover{
    background:#E5E4E2;border-color:#E5E4E2;color:#1C1C1C;font-weight:600;
  }
  .mb-btn-submit{
    padding:16px;
    background:linear-gradient(135deg,#E5E4E2,#C0C0C0);
    color:#1C1C1C;border:none;
    font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;
    font-weight:600;cursor:pointer;transition:opacity .3s;font-family:inherit;
  }
  .mb-btn-submit:hover{opacity:.88}
  .mb-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .mb-success{
    font-family:Georgia,serif;font-size:1.1rem;font-style:italic;
    color:#C0C0C0;padding:20px;
  }

  /* Messages */
  .mb-messages{
    display:flex;flex-direction:column;gap:18px;
    max-width:520px;margin:0 auto;text-align:left;
  }
  .mb-msg{
    padding:20px 24px;
    background:rgba(42,42,42,0.5);
    border-left:2px solid #C0C0C0;
  }
  .mb-msg-text{
    font-family:Georgia,serif;font-size:1rem;font-style:italic;
    color:#E5E4E2;line-height:1.7;
  }
  .mb-msg-name{
    font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;
    color:#A8A8A8;margin-top:8px;
  }

  /* Footer */
  .mb-footer{
    padding:48px 24px;text-align:center;
    border-top:1px solid rgba(192,192,192,0.15);
  }
  .mb-footer .mb-divider{margin:0 auto 24px}
  .mb-footer-names{
    font-family:Georgia,serif;font-weight:200;font-size:1.6rem;
    color:#E5E4E2;margin-bottom:6px;
  }
  .mb-footer-date{
    font-family:Georgia,serif;font-size:.85rem;font-style:italic;
    color:#B8B8B6;margin-bottom:24px;
  }
  .mb-footer-credit{
    font-size:.55rem;letter-spacing:.35em;
    color:#C0C0C0;opacity:.5;text-transform:uppercase;
  }

  @media(max-width:480px){
    .mb-date-main{flex-direction:column;gap:12px}
    .mb-date-wrap{padding:24px 28px}
  }
`