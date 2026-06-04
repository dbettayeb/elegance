'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'

export default function JardinAndalou({ wedding }: { wedding: Wedding }) {
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

      {/* Motif arabesque en fond, fixe */}
      <svg className="ja-pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="ja-arabesque" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="20" fill="none" stroke="#A8B5A0" strokeWidth="0.4" opacity="0.3"/>
            <circle cx="40" cy="40" r="12" fill="none" stroke="#C9A87A" strokeWidth="0.3" opacity="0.3"/>
            <path d="M40 20 L60 40 L40 60 L20 40 Z" fill="none" stroke="#A8B5A0" strokeWidth="0.3" opacity="0.4"/>
            <path d="M40 28 L52 40 L40 52 L28 40 Z" fill="none" stroke="#C9A87A" strokeWidth="0.3" opacity="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ja-arabesque)"/>
      </svg>

      {/* ENVELOPPE */}
      {!opened && (
        <div className="ja-env-screen">
          <div className="ja-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="ja-env-svg" fill="none">
              <rect x="10" y="40" width="260" height="150" rx="2" fill="#F4EFE6" stroke="#A8B5A0" strokeWidth="1.5"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#E8E4D8" stroke="#A8B5A0" strokeWidth="1"/>
              <path d="M10 40 L140 110 L10 190Z" fill="#EFE9DC" stroke="#A8B5A0" strokeWidth="0.8"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#EFE9DC" stroke="#A8B5A0" strokeWidth="0.8"/>
              <path d="M10 40 L140 115 L270 40Z" fill="#F4EFE6" stroke="#A8B5A0" strokeWidth="1.5"/>
              {/* Rosace centrale */}
              <g transform="translate(140 105)">
                <circle r="22" fill="#3D4A3A"/>
                <circle r="18" fill="none" stroke="#C9A87A" strokeWidth="0.6"/>
                <path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z" fill="#C9A87A"/>
                <text y="3" textAnchor="middle" fontFamily="Georgia,serif" fontSize="9" fill="#3D4A3A" fontWeight="600">
                  {wedding.bride_name[0]}{wedding.groom_name[0]}
                </text>
              </g>
            </svg>
          </div>
          <p className="ja-env-hint">Touchez pour ouvrir</p>
        </div>
      )}

      {/* INVITATION */}
      <div className={`ja-invitation${visible ? ' ja-visible' : ''}`}>

        {/* HERO */}
        <section className="ja-hero">
          <div className="ja-ornament">
            <div className="ja-orn-side"></div>
            <svg viewBox="0 0 40 40" className="ja-orn-center">
              <path d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z"
                fill="none" stroke="#C9A87A" strokeWidth="1"/>
              <circle cx="20" cy="20" r="3" fill="#C9A87A"/>
            </svg>
            <div className="ja-orn-side"></div>
          </div>
          <p className="ja-pre">{introText}</p>
          <h1 className="ja-names">
            {wedding.bride_name}
            <span className="ja-amp">&</span>
            {wedding.groom_name}
          </h1>
          {wedding.custom_message && (
            <p className="ja-custom">{wedding.custom_message}</p>
          )}
          <div className="ja-date-card">
            <div className="ja-date-corner ja-tl"></div>
            <div className="ja-date-corner ja-tr"></div>
            <div className="ja-date-corner ja-bl"></div>
            <div className="ja-date-corner ja-br"></div>
            <div className="ja-date-inner">
              <div className="ja-date-num">{eventDate.getDate()}</div>
              <div className="ja-date-month">
                {eventDate.toLocaleDateString('fr-TN', { month: 'long' }).toUpperCase()}
              </div>
              <div className="ja-date-sep">—</div>
              <div className="ja-date-year">{eventDate.getFullYear()}</div>
              <div className="ja-date-time">{formattedTime}</div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="ja-section">
          <p className="ja-label">Compte à rebours</p>
          <h2 className="ja-title">L'attente du grand jour</h2>
          <div className="ja-countdown">
            {[
              { val: countdown.d, label: 'Jours' },
              { val: countdown.h, label: 'Heures' },
              { val: countdown.m, label: 'Minutes' },
              { val: countdown.s, label: 'Secondes' },
            ].map((item, i) => (
              <div key={i} className="ja-cd">
                <div className="ja-cd-num">{item.val}</div>
                <div className="ja-cd-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="ja-sep">
          <svg viewBox="0 0 100 12" preserveAspectRatio="none">
            <line x1="0" y1="6" x2="40" y2="6" stroke="#C9A87A" strokeWidth="0.5"/>
            <circle cx="50" cy="6" r="2" fill="#C9A87A"/>
            <line x1="60" y1="6" x2="100" y2="6" stroke="#C9A87A" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="ja-section">
            <p className="ja-label">Déroulement</p>
            <h2 className="ja-title">Programme de la fête</h2>
            <div className="ja-program">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <div key={i} className="ja-prog-item">
                  <div className="ja-prog-time">{item.time}</div>
                  <div className="ja-prog-line"></div>
                  <div className="ja-prog-content">
                    <div className="ja-prog-event">{item.event}</div>
                    {item.venue && <div className="ja-prog-venue">{item.venue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="ja-sep">
          <svg viewBox="0 0 100 12" preserveAspectRatio="none">
            <line x1="0" y1="6" x2="40" y2="6" stroke="#C9A87A" strokeWidth="0.5"/>
            <circle cx="50" cy="6" r="2" fill="#C9A87A"/>
            <line x1="60" y1="6" x2="100" y2="6" stroke="#C9A87A" strokeWidth="0.5"/>
          </svg>
        </div>

        {/* LIEU */}
        <section className="ja-section">
          <p className="ja-label">Le lieu</p>
          <h2 className="ja-title">{wedding.venue_name}</h2>
          {wedding.venue_address && <p className="ja-body">{wedding.venue_address}</p>}
          <div className="ja-btn-row">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="ja-btn-map">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="ja-btn-map ja-btn-alt">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        {wedding.show_rsvp && (
        <section className="ja-rsvp">
          <p className="ja-label" style={{ color: '#C9A87A' }}>Confirmation</p>
          <h2 className="ja-title" style={{ color: '#F4EFE6' }}>Serez-vous des nôtres ?</h2>
          {rsvpStatus === 'done' ? (
            <p className="ja-success">Votre réponse a bien été enregistrée. Merci ❀</p>
          ) : (
            <form className="ja-form" onSubmit={submitRSVP}>
              <input className="ja-input" name="name" placeholder="Votre prénom et nom" required />
              <input className="ja-input" name="phone" placeholder="Votre numéro WhatsApp" />
              <div className="ja-radios">
                {(['present', 'absent', 'maybe'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`ja-radio${rsvpChoice === s ? ' ja-radio-on' : ''}`}
                    onClick={() => setRsvpChoice(s)}
                  >
                    {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'À confirmer'}
                  </button>
                ))}
              </div>
              <input className="ja-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
              <textarea className="ja-input ja-textarea" name="note" placeholder="Message optionnel..." />
              <button className="ja-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer'}
              </button>
            </form>
          )}
        </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="ja-section">
            <p className="ja-label">Livre d'or</p>
            <h2 className="ja-title">Vos mots pour les mariés</h2>
            {messages.length > 0 && (
              <div className="ja-messages">
                {messages.map(msg => (
                  <div key={msg.id} className="ja-msg">
                    <div className="ja-msg-name">{msg.author_name}</div>
                    <div className="ja-msg-text">"{msg.message}"</div>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="ja-success-light">
                {gbPending ? 'Votre message sera publié après validation.' : 'Votre message est publié.'}
              </p>
            ) : (
              <form className="ja-form" onSubmit={submitMessage} style={{ marginTop: '20px' }}>
                <input className="ja-input-light" name="author_name" placeholder="Votre prénom" required />
                <textarea className="ja-input-light ja-textarea" name="message" placeholder="Votre message..." required />
                <button className="ja-btn-light" type="submit" disabled={gbStatus === 'loading'}>
                  {gbStatus === 'loading' ? 'Envoi...' : 'Publier'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="ja-footer">
          <svg viewBox="0 0 40 40" style={{ width: '40px', margin: '0 auto 16px' }}>
            <path d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z"
              fill="none" stroke="#C9A87A" strokeWidth="1"/>
            <circle cx="20" cy="20" r="3" fill="#C9A87A"/>
          </svg>
          <div className="ja-footer-names">{wedding.bride_name} & {wedding.groom_name}</div>
          <div className="ja-footer-date">{formattedDate}</div>
          <div className="ja-footer-credit">Élégance Digitale™</div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Montserrat',sans-serif;
    background:#F4EFE6;color:#3D4A3A;overflow-x:hidden;
  }
  .ja-pattern{
    position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.5;
  }

  /* Enveloppe */
  .ja-env-screen{
    position:fixed;inset:0;z-index:1000;
    background:linear-gradient(135deg,#F4EFE6 0%,#EFE9DC 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
  }
  .ja-env-wrap{
    cursor:pointer;
    filter:drop-shadow(0 16px 40px rgba(61,74,58,0.15));
    transition:transform .3s;
  }
  .ja-env-wrap:hover{transform:translateY(-4px) scale(1.02)}
  .ja-env-svg{width:280px;height:auto}
  .ja-env-hint{
    margin-top:24px;font-family:Georgia,serif;font-size:.9rem;
    color:#C9A87A;letter-spacing:.2em;
    animation:jaPulse 2.5s ease-in-out infinite;
  }
  @keyframes jaPulse{0%,100%{opacity:.5}50%{opacity:1}}

  /* Invitation */
  .ja-invitation{
    opacity:0;transform:translateY(24px);
    transition:opacity 1s,transform 1s;
    position:relative;z-index:1;
  }
  .ja-invitation.ja-visible{opacity:1;transform:none}

  /* Hero */
  .ja-hero{
    min-height:100vh;padding:60px 24px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;
    background:linear-gradient(180deg,rgba(244,239,230,0.9) 0%,rgba(239,233,220,0.9) 100%);
  }
  .ja-ornament{
    display:flex;align-items:center;gap:14px;margin-bottom:36px;
    width:100%;max-width:300px;
  }
  .ja-orn-side{
    flex:1;height:1px;
    background:linear-gradient(90deg,transparent,#C9A87A,transparent);
  }
  .ja-orn-center{width:36px;height:36px}
  .ja-pre{
    font-size:.65rem;letter-spacing:.4em;text-transform:uppercase;
    color:#A8B5A0;margin-bottom:28px;
  }
  .ja-names{
    font-family:Georgia,serif;
    font-size:clamp(2.8rem,9vw,4.8rem);
    font-weight:300;color:#3D4A3A;line-height:1.1;letter-spacing:.02em;
    margin:0;
  }
  .ja-amp{
    display:block;font-family:'Great Vibes',cursive,Georgia,serif;
    color:#C9A87A;font-size:clamp(2rem,6vw,3rem);margin:8px 0;
  }
  .ja-custom{
    font-family:Georgia,serif;font-size:1.05rem;font-style:italic;
    color:#6B7460;line-height:1.9;max-width:480px;margin:32px auto 36px;
  }
  .ja-date-card{
    position:relative;padding:28px 48px;
    background:rgba(255,255,255,0.6);backdrop-filter:blur(8px);
    border:1px solid rgba(201,168,122,0.4);
    min-width:240px;
  }
  .ja-date-corner{
    position:absolute;width:16px;height:16px;
    border:1.5px solid #C9A87A;
  }
  .ja-tl{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .ja-tr{top:-1px;right:-1px;border-left:none;border-bottom:none}
  .ja-bl{bottom:-1px;left:-1px;border-right:none;border-top:none}
  .ja-br{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .ja-date-inner{display:flex;flex-direction:column;align-items:center;gap:4px}
  .ja-date-num{
    font-family:Georgia,serif;font-size:3.4rem;font-weight:300;
    color:#3D4A3A;line-height:1;
  }
  .ja-date-month{
    font-size:.7rem;letter-spacing:.4em;color:#C9A87A;margin-top:6px;
  }
  .ja-date-sep{color:#A8B5A0;margin:2px 0}
  .ja-date-year{
    font-family:Georgia,serif;font-size:1.1rem;color:#3D4A3A;
  }
  .ja-date-time{
    font-size:.7rem;letter-spacing:.3em;color:#A8B5A0;
    margin-top:8px;text-transform:uppercase;
  }

  /* Sections */
  .ja-section{
    max-width:680px;margin:0 auto;
    padding:72px 24px;text-align:center;position:relative;
  }
  .ja-label{
    font-size:.6rem;letter-spacing:.45em;text-transform:uppercase;
    color:#C9A87A;margin-bottom:12px;
  }
  .ja-title{
    font-family:Georgia,serif;font-size:clamp(1.8rem,4vw,2.4rem);
    font-weight:300;color:#3D4A3A;margin-bottom:32px;line-height:1.3;
  }
  .ja-body{
    font-family:Georgia,serif;font-size:1.05rem;font-style:italic;
    color:#6B7460;line-height:1.8;margin-bottom:24px;
  }
  .ja-sep{
    max-width:200px;margin:0 auto;
  }
  .ja-sep svg{width:100%;height:20px}

  /* Countdown */
  .ja-countdown{
    display:flex;gap:12px;justify-content:center;flex-wrap:wrap;
  }
  .ja-cd{
    display:flex;flex-direction:column;align-items:center;
    min-width:72px;padding:16px 12px;
    background:rgba(255,255,255,0.6);
    border:1px solid rgba(201,168,122,0.25);
  }
  .ja-cd-num{
    font-family:Georgia,serif;font-size:2.2rem;font-weight:300;
    color:#3D4A3A;line-height:1;
  }
  .ja-cd-label{
    font-size:.58rem;letter-spacing:.25em;color:#A8B5A0;
    margin-top:8px;text-transform:uppercase;
  }

  /* Programme */
  .ja-program{
    display:flex;flex-direction:column;gap:0;
    max-width:480px;margin:0 auto;
  }
  .ja-prog-item{
    display:grid;grid-template-columns:80px 16px 1fr;gap:16px;
    align-items:center;padding:16px 0;
    border-bottom:1px solid rgba(201,168,122,0.2);
    text-align:left;
  }
  .ja-prog-item:last-child{border-bottom:none}
  .ja-prog-time{
    font-family:Georgia,serif;font-size:1.2rem;color:#C9A87A;
    text-align:right;
  }
  .ja-prog-line{
    width:8px;height:8px;border-radius:50%;
    background:#C9A87A;justify-self:center;
  }
  .ja-prog-event{
    font-family:Georgia,serif;font-size:1.05rem;font-weight:500;color:#3D4A3A;
  }
  .ja-prog-venue{
    font-size:.85rem;font-style:italic;color:#6B7460;margin-top:3px;
  }

  /* Map */
  .ja-btn-row{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:20px}
  .ja-btn-map{
    padding:13px 28px;
    background:#3D4A3A;color:#F4EFE6;
    text-decoration:none;font-size:.62rem;letter-spacing:.25em;
    text-transform:uppercase;font-weight:500;
    transition:all .3s;
  }
  .ja-btn-map:hover{background:#2D372A;transform:translateY(-2px)}
  .ja-btn-alt{background:#C9A87A;color:#3D4A3A}

  /* RSVP */
  .ja-rsvp{
    background:#3D4A3A;padding:80px 24px;text-align:center;
    position:relative;
  }
  .ja-form{
    max-width:440px;margin:0 auto;
    display:flex;flex-direction:column;gap:14px;text-align:left;
  }
  .ja-input{
    width:100%;padding:14px 18px;
    background:rgba(244,239,230,0.05);
    border:1px solid rgba(201,168,122,0.4);
    color:#F4EFE6;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .ja-input::placeholder{color:rgba(244,239,230,0.4);font-style:italic}
  .ja-input:focus{border-color:#C9A87A}
  .ja-textarea{resize:vertical;min-height:80px}
  .ja-radios{display:flex;gap:8px}
  .ja-radio{
    flex:1;padding:12px 6px;
    background:transparent;
    border:1px solid rgba(201,168,122,0.4);
    color:rgba(244,239,230,0.7);
    font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;
    cursor:pointer;transition:all .2s;font-family:inherit;
  }
  .ja-radio-on,.ja-radio:hover{
    background:#C9A87A;border-color:#C9A87A;color:#3D4A3A;font-weight:600;
  }
  .ja-btn-submit{
    padding:16px;background:#C9A87A;color:#3D4A3A;
    border:none;font-size:.65rem;letter-spacing:.3em;
    text-transform:uppercase;font-weight:600;cursor:pointer;
    transition:opacity .3s;font-family:inherit;
  }
  .ja-btn-submit:hover{opacity:.88}
  .ja-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .ja-success{
    font-family:Georgia,serif;font-size:1.2rem;font-style:italic;
    color:#C9A87A;padding:20px;
  }
  .ja-success-light{
    font-family:Georgia,serif;font-size:1rem;font-style:italic;
    color:#C9A87A;padding:16px;text-align:center;
  }

  /* Messages */
  .ja-messages{
    display:flex;flex-direction:column;gap:14px;
    max-width:480px;margin:0 auto;text-align:left;
  }
  .ja-msg{
    border-left:2px solid #C9A87A;padding:14px 18px;
    background:rgba(255,255,255,0.6);
  }
  .ja-msg-name{
    font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;
    color:#A8B5A0;margin-bottom:5px;
  }
  .ja-msg-text{
    font-family:Georgia,serif;font-size:1rem;font-style:italic;
    color:#3D4A3A;line-height:1.6;
  }
  .ja-input-light{
    width:100%;padding:13px 16px;
    background:#fff;
    border:1px solid rgba(201,168,122,0.3);
    color:#3D4A3A;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .ja-input-light:focus{border-color:#C9A87A}
  .ja-btn-light{
    padding:13px 28px;background:transparent;
    border:1px solid #C9A87A;color:#C9A87A;
    font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;
    cursor:pointer;transition:all .3s;align-self:flex-end;font-family:inherit;
  }
  .ja-btn-light:hover{background:#C9A87A;color:#F4EFE6}

  /* Footer */
  .ja-footer{
    padding:48px 24px;text-align:center;
    background:rgba(239,233,220,0.6);
    border-top:1px solid rgba(201,168,122,0.2);
  }
  .ja-footer-names{
    font-family:Georgia,serif;font-size:1.6rem;
    color:#3D4A3A;margin-bottom:6px;font-weight:300;
  }
  .ja-footer-date{
    font-family:Georgia,serif;font-size:.85rem;font-style:italic;
    color:#6B7460;margin-bottom:24px;
  }
  .ja-footer-credit{
    font-size:.55rem;letter-spacing:.3em;
    color:#C9A87A;opacity:.6;text-transform:uppercase;
  }
`