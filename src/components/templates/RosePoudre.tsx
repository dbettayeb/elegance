'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/FontOverride'

export default function RosePoudre({ wedding }: { wedding: Wedding }) {
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
      <FontOverride font={wedding.custom_font} container=".rp-container" />

      {/* Aquarelles décoratives */}
      <svg className="rp-watercolor rp-wc-top" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="rp-grad1" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#E8C5B5" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#E8C5B5" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="100" rx="100" ry="80" fill="url(#rp-grad1)"/>
      </svg>
      <svg className="rp-watercolor rp-wc-bot" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="rp-grad2" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#D4A373" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#D4A373" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="100" rx="100" ry="80" fill="url(#rp-grad2)"/>
      </svg>

      {/* ENVELOPPE */}
      {!opened && (
        <div className="rp-env-screen">
          <div className="rp-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="rp-env-svg" fill="none">
              <rect x="10" y="40" width="260" height="150" rx="3" fill="#FAF0EB" stroke="#D4A373" strokeWidth="1.2"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#F5E5DC" stroke="#D4A373" strokeWidth="0.9"/>
              <path d="M10 40 L140 110 L10 190Z" fill="#FAF0EB" stroke="#D4A373" strokeWidth="0.7"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#F5E5DC" stroke="#D4A373" strokeWidth="0.7"/>
              <path d="M10 40 L140 115 L270 40Z" fill="#FAF0EB" stroke="#D4A373" strokeWidth="1.2"/>
              {/* Fleur centrale */}
              <g transform="translate(140 105)">
                <circle r="18" fill="#7C3F58" opacity="0.9"/>
                {[0, 60, 120, 180, 240, 300].map(angle => (
                  <ellipse
                    key={angle}
                    cx="0" cy="-10"
                    rx="4" ry="7"
                    fill="#E8C5B5"
                    transform={`rotate(${angle})`}
                    opacity="0.95"
                  />
                ))}
                <circle r="3" fill="#D4A373"/>
                <text y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" fill="#7C3F58" letterSpacing="2">
                  {wedding.bride_name[0]}&{wedding.groom_name[0]}
                </text>
              </g>
            </svg>
          </div>
          <p className="rp-env-hint">Touchez pour découvrir</p>
        </div>
      )}

      {/* INVITATION */}
      <div className={`rp-invitation${visible ? ' rp-visible' : ''}`}>

        {/* HERO */}
        <section className="rp-hero">
          {/* Fleurs aquarelles dans le hero */}
          <svg className="rp-flower rp-fl-tl" viewBox="0 0 60 60">
            {[0, 72, 144, 216, 288].map(angle => (
              <ellipse
                key={angle}
                cx="30" cy="18"
                rx="6" ry="10"
                fill="#E8C5B5"
                opacity="0.7"
                transform={`rotate(${angle} 30 30)`}
              />
            ))}
            <circle cx="30" cy="30" r="4" fill="#D4A373"/>
          </svg>
          <svg className="rp-flower rp-fl-br" viewBox="0 0 60 60">
            {[0, 72, 144, 216, 288].map(angle => (
              <ellipse
                key={angle}
                cx="30" cy="18"
                rx="6" ry="10"
                fill="#E8C5B5"
                opacity="0.6"
                transform={`rotate(${angle} 30 30)`}
              />
            ))}
            <circle cx="30" cy="30" r="4" fill="#D4A373"/>
          </svg>

          <p className="rp-pre">{introText}</p>
          <h1 className="rp-names">
            {wedding.bride_name}
            <span className="rp-amp">&</span>
            {wedding.groom_name}
          </h1>
          <div className="rp-leaf">
            <svg viewBox="0 0 120 14" preserveAspectRatio="none">
              <path d="M0 7 Q40 0 60 7 T120 7" fill="none" stroke="#D4A373" strokeWidth="0.8"/>
              <circle cx="60" cy="7" r="2.5" fill="#7C3F58"/>
            </svg>
          </div>
          {wedding.custom_message && (
            <p className="rp-custom">{wedding.custom_message}</p>
          )}
          <div className="rp-date">
            <div className="rp-date-day">{eventDate.getDate()}</div>
            <div className="rp-date-info">
              <div>{eventDate.toLocaleDateString('fr-TN', { month: 'long' })}</div>
              <div className="rp-date-yr">{eventDate.getFullYear()}</div>
            </div>
          </div>
          <p className="rp-time">{formattedTime}</p>
        </section>

        {/* COUNTDOWN */}
        <section className="rp-section">
          <p className="rp-label">Compte à rebours</p>
          <h2 className="rp-title">Le jour J approche</h2>
          <div className="rp-countdown">
            {[
              { val: countdown.d, label: 'Jours' },
              { val: countdown.h, label: 'Heures' },
              { val: countdown.m, label: 'Minutes' },
              { val: countdown.s, label: 'Secondes' },
            ].map((item, i) => (
              <div key={i} className="rp-cd">
                <div className="rp-cd-num">{item.val}</div>
                <div className="rp-cd-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="rp-section">
            <p className="rp-label">Déroulement</p>
            <h2 className="rp-title">Programme de la fête</h2>
            <div className="rp-program">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <div key={i} className="rp-prog-item">
                  <div className="rp-prog-time">{item.time}</div>
                  <div className="rp-prog-dot"></div>
                  <div className="rp-prog-content">
                    <div className="rp-prog-event">{item.event}</div>
                    {item.venue && <div className="rp-prog-venue">{item.venue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIEU */}
        <section className="rp-section">
          <p className="rp-label">Le lieu</p>
          <h2 className="rp-title">{wedding.venue_name}</h2>
          {wedding.venue_address && <p className="rp-body">{wedding.venue_address}</p>}
          <div className="rp-btn-row">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="rp-btn-map">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="rp-btn-map rp-btn-alt">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        {wedding.show_rsvp && (
        <section className="rp-section rp-rsvp">
          <p className="rp-label">Confirmation</p>
          <h2 className="rp-title">Aurons-nous le plaisir ?</h2>
          {rsvpStatus === 'done' ? (
            <p className="rp-success">Merci infiniment ! Votre réponse a bien été reçue. ❀</p>
          ) : (
            <form className="rp-form" onSubmit={submitRSVP}>
              <input className="rp-input" name="name" placeholder="Votre prénom et nom" required />
              <input className="rp-input" name="phone" placeholder="Votre WhatsApp" />
              <div className="rp-radios">
                {(['present', 'absent', 'maybe'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`rp-radio${rsvpChoice === s ? ' rp-radio-on' : ''}`}
                    onClick={() => setRsvpChoice(s)}
                  >
                    {s === 'present' ? '✿ Présent(e)' : s === 'absent' ? 'Absent(e)' : 'À confirmer'}
                  </button>
                ))}
              </div>
              <input className="rp-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
              <textarea className="rp-input rp-textarea" name="note" placeholder="Petit mot..." />
              <button className="rp-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer ❀'}
              </button>
            </form>
          )}
        </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="rp-section">
            <p className="rp-label">Livre d'or</p>
            <h2 className="rp-title">Vos mots tendres</h2>
            {messages.length > 0 && (
              <div className="rp-messages">
                {messages.map(msg => (
                  <div key={msg.id} className="rp-msg">
                    <div className="rp-msg-text">"{msg.message}"</div>
                    <div className="rp-msg-name">— {msg.author_name}</div>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="rp-success" style={{ marginTop: '20px' }}>
                {gbPending ? 'Votre message sera publié bientôt.' : 'Votre message est publié.'}
              </p>
            ) : (
              <form className="rp-form" onSubmit={submitMessage} style={{ marginTop: '24px' }}>
                <input className="rp-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="rp-input rp-textarea" name="message" placeholder="Vos vœux pour les mariés..." required />
                <button className="rp-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                  Publier ❀
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="rp-footer">
          <div className="rp-leaf">
            <svg viewBox="0 0 120 14" preserveAspectRatio="none">
              <path d="M0 7 Q40 0 60 7 T120 7" fill="none" stroke="#D4A373" strokeWidth="0.8"/>
              <circle cx="60" cy="7" r="2.5" fill="#7C3F58"/>
            </svg>
          </div>
          <div className="rp-footer-names">{wedding.bride_name} & {wedding.groom_name}</div>
          <div className="rp-footer-date">{formattedDate}</div>
          <div className="rp-footer-credit">Élégance Digitale™</div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Montserrat',sans-serif;
    background:#FAF0EB;color:#7C3F58;overflow-x:hidden;
  }

  /* Aquarelles fixes décoratives */
  .rp-watercolor{
    position:fixed;width:400px;height:400px;pointer-events:none;z-index:0;opacity:0.6;
  }
  .rp-wc-top{top:-150px;left:-100px}
  .rp-wc-bot{bottom:-150px;right:-100px}

  /* Enveloppe */
  .rp-env-screen{
    position:fixed;inset:0;z-index:1000;
    background:linear-gradient(135deg,#FAF0EB 0%,#F5E5DC 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
  }
  .rp-env-wrap{
    cursor:pointer;
    filter:drop-shadow(0 16px 36px rgba(124,63,88,0.15));
    transition:transform .3s;
  }
  .rp-env-wrap:hover{transform:translateY(-4px) scale(1.02)}
  .rp-env-svg{width:280px;height:auto}
  .rp-env-hint{
    margin-top:24px;font-family:Georgia,serif;font-size:.95rem;font-style:italic;
    color:#7C3F58;letter-spacing:.15em;
    animation:rpPulse 2.5s ease-in-out infinite;
  }
  @keyframes rpPulse{0%,100%{opacity:.5}50%{opacity:1}}

  /* Invitation */
  .rp-invitation{
    opacity:0;transform:translateY(24px);
    transition:opacity 1s,transform 1s;
    position:relative;z-index:1;
  }
  .rp-invitation.rp-visible{opacity:1;transform:none}

  /* Hero */
  .rp-hero{
    min-height:100vh;padding:80px 24px 60px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;position:relative;
  }
  .rp-flower{
    position:absolute;width:80px;height:80px;opacity:0.5;
  }
  .rp-fl-tl{top:40px;left:30px}
  .rp-fl-br{bottom:40px;right:30px}
  .rp-pre{
    font-size:.65rem;letter-spacing:.4em;text-transform:uppercase;
    color:#D4A373;margin-bottom:32px;font-weight:500;
  }
  .rp-names{
    font-family:'Great Vibes',cursive,Georgia,serif;
    font-size:clamp(3.5rem,11vw,6.5rem);line-height:1;
    color:#7C3F58;font-weight:400;margin:0;
  }
  .rp-amp{
    display:block;color:#D4A373;
    font-size:clamp(2rem,6vw,3.5rem);margin:8px 0;
  }
  .rp-leaf{margin:32px 0 24px;width:140px;height:14px}
  .rp-leaf svg{width:100%;height:100%}
  .rp-custom{
    font-family:Georgia,serif;font-size:1.05rem;font-style:italic;
    color:#9B6478;line-height:1.9;max-width:440px;margin-bottom:36px;
  }
  .rp-date{
    display:flex;align-items:center;gap:20px;
    background:rgba(255,255,255,0.55);backdrop-filter:blur(8px);
    border:1px solid rgba(212,163,115,0.3);
    padding:20px 32px;border-radius:200px;
  }
  .rp-date-day{
    font-family:Georgia,serif;font-size:3.5rem;font-weight:300;
    color:#7C3F58;line-height:1;
  }
  .rp-date-info{
    display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:4px;
  }
  .rp-date-info > div:first-child{
    font-size:.75rem;letter-spacing:.3em;text-transform:uppercase;color:#D4A373;font-weight:500;
  }
  .rp-date-yr{
    font-family:Georgia,serif;font-size:1.2rem;color:#7C3F58;
  }
  .rp-time{
    margin-top:16px;font-size:.75rem;letter-spacing:.3em;
    color:#D4A373;text-transform:uppercase;font-weight:500;
  }

  /* Sections */
  .rp-section{
    max-width:640px;margin:0 auto;
    padding:72px 24px;text-align:center;position:relative;
  }
  .rp-label{
    font-size:.6rem;letter-spacing:.45em;text-transform:uppercase;
    color:#D4A373;margin-bottom:12px;font-weight:500;
  }
  .rp-title{
    font-family:Georgia,serif;font-size:clamp(1.7rem,4vw,2.2rem);
    font-weight:300;color:#7C3F58;margin-bottom:32px;line-height:1.3;
  }
  .rp-body{
    font-family:Georgia,serif;font-size:1.05rem;font-style:italic;
    color:#9B6478;line-height:1.8;margin-bottom:24px;
  }

  /* Countdown */
  .rp-countdown{
    display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
  }
  .rp-cd{
    display:flex;flex-direction:column;align-items:center;
    min-width:78px;padding:18px 14px;
    background:rgba(255,255,255,0.55);
    border:1px solid rgba(212,163,115,0.25);
    border-radius:12px;
  }
  .rp-cd-num{
    font-family:Georgia,serif;font-size:2.2rem;font-weight:300;
    color:#7C3F58;line-height:1;
  }
  .rp-cd-label{
    font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;
    color:#D4A373;margin-top:8px;font-weight:500;
  }

  /* Programme */
  .rp-program{
    display:flex;flex-direction:column;gap:0;
    max-width:480px;margin:0 auto;text-align:left;
  }
  .rp-prog-item{
    display:grid;grid-template-columns:90px 16px 1fr;gap:16px;
    align-items:center;padding:18px 0;
    border-bottom:1px dashed rgba(212,163,115,0.3);
  }
  .rp-prog-item:last-child{border-bottom:none}
  .rp-prog-time{
    font-family:Georgia,serif;font-size:1.3rem;color:#D4A373;
    text-align:right;
  }
  .rp-prog-dot{
    width:10px;height:10px;border-radius:50%;
    background:#7C3F58;justify-self:center;
  }
  .rp-prog-event{
    font-family:Georgia,serif;font-size:1.1rem;font-weight:500;color:#7C3F58;
  }
  .rp-prog-venue{
    font-size:.85rem;font-style:italic;color:#9B6478;margin-top:4px;
  }

  /* Map */
  .rp-btn-row{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:20px}
  .rp-btn-map{
    padding:14px 32px;
    background:linear-gradient(135deg,#7C3F58,#9B6478);color:#FAF0EB;
    text-decoration:none;font-size:.62rem;letter-spacing:.25em;
    text-transform:uppercase;font-weight:600;border-radius:200px;
    transition:all .3s;
  }
  .rp-btn-map:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(124,63,88,0.3)}
  .rp-btn-alt{
    background:linear-gradient(135deg,#D4A373,#E8C5B5);color:#7C3F58;
  }

  /* RSVP */
  .rp-rsvp{
    background:linear-gradient(135deg,#FAF0EB 0%,#F5E5DC 100%);
    max-width:none;padding:80px 24px;
  }
  .rp-rsvp > *{max-width:640px;margin-left:auto;margin-right:auto}
  .rp-form{
    max-width:440px;margin:0 auto;
    display:flex;flex-direction:column;gap:14px;text-align:left;
  }
  .rp-input{
    width:100%;padding:14px 18px;
    background:rgba(255,255,255,0.7);
    border:1px solid rgba(212,163,115,0.4);
    border-radius:8px;
    color:#7C3F58;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .rp-input::placeholder{color:rgba(124,63,88,0.4);font-style:italic}
  .rp-input:focus{border-color:#D4A373;background:#fff}
  .rp-textarea{resize:vertical;min-height:80px}
  .rp-radios{display:flex;gap:8px}
  .rp-radio{
    flex:1;padding:12px 6px;
    background:rgba(255,255,255,0.5);
    border:1px solid rgba(212,163,115,0.4);
    border-radius:8px;color:#9B6478;
    font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;
    cursor:pointer;transition:all .2s;font-family:inherit;font-weight:500;
  }
  .rp-radio-on,.rp-radio:hover{
    background:linear-gradient(135deg,#7C3F58,#9B6478);
    border-color:#7C3F58;color:#FAF0EB;
  }
  .rp-btn-submit{
    padding:16px;
    background:linear-gradient(135deg,#7C3F58,#9B6478);
    color:#FAF0EB;border:none;border-radius:200px;
    font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;
    font-weight:600;cursor:pointer;transition:opacity .3s;font-family:inherit;
  }
  .rp-btn-submit:hover{opacity:.9}
  .rp-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .rp-success{
    font-family:Georgia,serif;font-size:1.2rem;font-style:italic;
    color:#D4A373;padding:20px;
  }

  /* Messages */
  .rp-messages{
    display:flex;flex-direction:column;gap:14px;
    max-width:480px;margin:0 auto;text-align:left;
  }
  .rp-msg{
    background:rgba(255,255,255,0.7);
    border:1px solid rgba(212,163,115,0.25);
    border-radius:12px;padding:18px 22px;
  }
  .rp-msg-text{
    font-family:Georgia,serif;font-size:1rem;font-style:italic;
    color:#7C3F58;line-height:1.7;
  }
  .rp-msg-name{
    font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;
    color:#D4A373;margin-top:8px;font-weight:500;
  }

  /* Footer */
  .rp-footer{
    padding:48px 24px;text-align:center;
    background:rgba(245,229,220,0.6);
  }
  .rp-footer .rp-leaf{margin:0 auto 24px}
  .rp-footer-names{
    font-family:'Great Vibes',cursive,Georgia,serif;font-size:2.4rem;
    color:#7C3F58;margin-bottom:6px;
  }
  .rp-footer-date{
    font-family:Georgia,serif;font-size:.85rem;font-style:italic;
    color:#9B6478;margin-bottom:24px;
  }
  .rp-footer-credit{
    font-size:.55rem;letter-spacing:.3em;
    color:#D4A373;opacity:.7;text-transform:uppercase;font-weight:500;
  }

  @media(max-width:480px){
    .rp-flower{width:60px;height:60px}
    .rp-date{flex-direction:column;gap:12px;border-radius:24px;padding:20px 28px}
    .rp-date-info{align-items:center;text-align:center}
  }
`