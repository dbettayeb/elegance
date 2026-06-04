'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'

export default function NuitEtoilee({ wedding }: { wedding: Wedding }) {
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

      {/* Étoiles animées sur tout l'écran */}
      <div className="ne-stars">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="ne-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ENVELOPPE */}
      {!opened && (
        <div className="ne-env-screen">
          <div className="ne-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="ne-env-svg" fill="none">
              <rect x="10" y="40" width="260" height="150" rx="3" fill="#0A0A1F" stroke="#D4AF37" strokeWidth="1.5"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#161628" stroke="#D4AF37" strokeWidth="1"/>
              <path d="M10 40 L140 110 L10 190Z" fill="#0F0F22" stroke="#D4AF37" strokeWidth="0.8"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#0F0F22" stroke="#D4AF37" strokeWidth="0.8"/>
              <path d="M10 40 L140 115 L270 40Z" fill="#0A0A1F" stroke="#D4AF37" strokeWidth="1.5"/>
              <circle cx="140" cy="105" r="22" fill="#D4AF37"/>
              <text x="140" y="112" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="#0A0A1F" fontWeight="600">
                {wedding.bride_name[0]}&{wedding.groom_name[0]}
              </text>
            </svg>
          </div>
          <p className="ne-env-hint">Appuyez pour ouvrir</p>
        </div>
      )}

      {/* INVITATION */}
      <div className={`ne-invitation${visible ? ' ne-visible' : ''}`}>

        {/* HERO */}
        <section className="ne-hero">
          <div className="ne-hero-orn ne-orn-top">✦</div>
          <p className="ne-pre">{introText}</p>
          <h1 className="ne-names">
            <span>{wedding.bride_name}</span>
            <span className="ne-amp">&</span>
            <span>{wedding.groom_name}</span>
          </h1>
          <div className="ne-divider-gold"><span></span><i>✦</i><span></span></div>
          {wedding.custom_message && (
            <p className="ne-custom">{wedding.custom_message}</p>
          )}
          <div className="ne-date">
            <div className="ne-date-num">{eventDate.getDate()}</div>
            <div className="ne-date-mid">
              <div className="ne-date-month">{eventDate.toLocaleDateString('fr-TN', { month: 'long' })}</div>
              <div className="ne-date-line"></div>
              <div className="ne-date-year">{eventDate.getFullYear()}</div>
            </div>
            <div className="ne-date-time">{formattedTime}</div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="ne-section">
          <p className="ne-label">Compte à rebours</p>
          <h2 className="ne-title">Le grand jour approche</h2>
          <div className="ne-countdown">
            {[
              { val: countdown.d, label: 'Jours' },
              { val: countdown.h, label: 'Heures' },
              { val: countdown.m, label: 'Minutes' },
              { val: countdown.s, label: 'Secondes' },
            ].map((item, i) => (
              <div key={i} className="ne-cd">
                <div className="ne-cd-box">{item.val}</div>
                <div className="ne-cd-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="ne-section">
            <p className="ne-label">Déroulement</p>
            <h2 className="ne-title">Programme de la soirée</h2>
            <div className="ne-timeline">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <div key={i} className="ne-tl-item">
                  <div className="ne-tl-time">{item.time}</div>
                  <div className="ne-tl-dot"><span></span></div>
                  <div className="ne-tl-content">
                    <div className="ne-tl-event">{item.event}</div>
                    {item.venue && <div className="ne-tl-venue">{item.venue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIEU */}
        <section className="ne-section">
          <p className="ne-label">Le lieu</p>
          <h2 className="ne-title">{wedding.venue_name}</h2>
          {wedding.venue_address && <p className="ne-body">{wedding.venue_address}</p>}
          <div className="ne-btn-row">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="ne-btn-map">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="ne-btn-map ne-btn-outline">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        {wedding.show_rsvp && (
        <section className="ne-section ne-rsvp">
          <p className="ne-label">Confirmation</p>
          <h2 className="ne-title">Serez-vous des nôtres ?</h2>
          {rsvpStatus === 'done' ? (
            <p className="ne-success">Merci, votre réponse a bien été enregistrée ✦</p>
          ) : (
            <form className="ne-form" onSubmit={submitRSVP}>
              <input className="ne-input" name="name" placeholder="Votre prénom et nom" required />
              <input className="ne-input" name="phone" placeholder="Votre numéro WhatsApp" />
              <div className="ne-radios">
                {(['present', 'absent', 'maybe'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`ne-radio${rsvpChoice === s ? ' ne-radio-on' : ''}`}
                    onClick={() => setRsvpChoice(s)}
                  >
                    {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                  </button>
                ))}
              </div>
              <input className="ne-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
              <textarea className="ne-input ne-textarea" name="note" placeholder="Message optionnel..." />
              <button className="ne-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer ma présence'}
              </button>
            </form>
          )}
        </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="ne-section">
            <p className="ne-label">Livre d'or</p>
            <h2 className="ne-title">Laissez votre message</h2>
            {messages.length > 0 && (
              <div className="ne-messages">
                {messages.map(msg => (
                  <div key={msg.id} className="ne-msg">
                    <div className="ne-msg-name">{msg.author_name}</div>
                    <div className="ne-msg-text">"{msg.message}"</div>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="ne-success" style={{ marginTop: '20px' }}>
                {gbPending ? 'Votre message sera publié après validation.' : 'Votre message est publié.'}
              </p>
            ) : (
              <form className="ne-form" onSubmit={submitMessage} style={{ marginTop: '20px' }}>
                <input className="ne-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="ne-input ne-textarea" name="message" placeholder="Votre message de vœux..." required />
                <button className="ne-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                  {gbStatus === 'loading' ? 'Envoi...' : 'Publier'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="ne-footer">
          <div className="ne-orn">✦</div>
          <div className="ne-footer-names">{wedding.bride_name} & {wedding.groom_name}</div>
          <div className="ne-footer-date">{formattedDate}</div>
          <div className="ne-footer-credit">Élégance Digitale™</div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Montserrat',sans-serif;
    background:#0A0A1F;
    color:#F5E6A8;
    overflow-x:hidden;
  }

  /* Étoiles */
  .ne-stars{
    position:fixed;inset:0;z-index:0;pointer-events:none;
    background:radial-gradient(ellipse at top,#1a1a3a 0%,#0A0A1F 50%,#000 100%);
  }
  .ne-star{
    position:absolute;width:2px;height:2px;background:#F5E6A8;border-radius:50%;
    animation:neTwinkle 3s ease-in-out infinite;
    box-shadow:0 0 4px rgba(245,230,168,0.8);
  }
  @keyframes neTwinkle{
    0%,100%{opacity:0.2;transform:scale(0.5)}
    50%{opacity:1;transform:scale(1.2)}
  }

  /* Enveloppe */
  .ne-env-screen{
    position:fixed;inset:0;z-index:1000;
    background:radial-gradient(ellipse at center,#1a1a3a 0%,#0A0A1F 70%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
  }
  .ne-env-wrap{
    cursor:pointer;
    filter:drop-shadow(0 0 30px rgba(212,175,55,0.4));
    transition:transform .3s;
  }
  .ne-env-wrap:hover{transform:translateY(-6px) scale(1.02)}
  .ne-env-svg{width:280px;height:auto}
  .ne-env-hint{
    margin-top:24px;font-family:Georgia,serif;font-size:.95rem;
    color:#D4AF37;letter-spacing:.2em;
    animation:neGlow 2.5s ease-in-out infinite;
  }
  @keyframes neGlow{
    0%,100%{opacity:.5;text-shadow:0 0 8px rgba(212,175,55,0.4)}
    50%{opacity:1;text-shadow:0 0 16px rgba(212,175,55,0.8)}
  }

  /* Invitation */
  .ne-invitation{
    opacity:0;transform:translateY(24px);
    transition:opacity 1s,transform 1s;
    position:relative;z-index:1;
  }
  .ne-invitation.ne-visible{opacity:1;transform:none}

  /* Hero */
  .ne-hero{
    min-height:100vh;padding:80px 24px 60px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;position:relative;
  }
  .ne-hero-orn{
    color:#D4AF37;font-size:1.5rem;letter-spacing:.5em;margin-bottom:32px;
    text-shadow:0 0 12px rgba(212,175,55,0.6);
  }
  .ne-pre{
    font-size:.65rem;letter-spacing:.45em;text-transform:uppercase;
    color:#D4AF37;margin-bottom:32px;
  }
  .ne-names{
    font-family:'Great Vibes',cursive,Georgia,serif;
    font-size:clamp(3.5rem,12vw,7rem);line-height:1;
    color:#F5E6A8;font-weight:400;
    text-shadow:0 0 30px rgba(245,230,168,0.3);
    margin:0;
  }
  .ne-names span{display:block}
  .ne-amp{
    color:#D4AF37;
    font-size:clamp(2rem,6vw,3.5rem) !important;
    line-height:.9;margin:8px 0;
  }
  .ne-divider-gold{
    display:flex;align-items:center;justify-content:center;
    gap:14px;margin:32px 0 24px;width:100%;max-width:300px;
  }
  .ne-divider-gold span{
    flex:1;height:1px;
    background:linear-gradient(90deg,transparent,#D4AF37,transparent);
  }
  .ne-divider-gold i{color:#D4AF37;font-style:normal;font-size:.8rem}
  .ne-custom{
    font-family:Georgia,serif;font-size:1rem;font-style:italic;
    color:#C5B47E;line-height:1.8;max-width:440px;
    margin-bottom:36px;
  }
  .ne-date{
    display:inline-flex;align-items:center;gap:24px;
    padding:24px 36px;
    border:1px solid rgba(212,175,55,0.3);
    background:rgba(10,10,31,0.6);backdrop-filter:blur(8px);
    position:relative;
  }
  .ne-date::before,.ne-date::after{
    content:'';position:absolute;width:14px;height:14px;
    border:1px solid #D4AF37;
  }
  .ne-date::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .ne-date::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .ne-date-num{
    font-family:Georgia,serif;font-size:3.5rem;font-weight:300;
    color:#F5E6A8;line-height:1;
  }
  .ne-date-mid{display:flex;flex-direction:column;align-items:center;gap:6px}
  .ne-date-month{
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:#D4AF37;
  }
  .ne-date-line{width:30px;height:1px;background:#D4AF37}
  .ne-date-year{font-family:Georgia,serif;font-size:1.1rem;color:#F5E6A8}
  .ne-date-time{
    font-size:.75rem;letter-spacing:.25em;text-transform:uppercase;color:#D4AF37;
  }

  /* Sections */
  .ne-section{
    max-width:680px;margin:0 auto;
    padding:80px 24px;text-align:center;position:relative;
  }
  .ne-label{
    font-size:.6rem;letter-spacing:.5em;text-transform:uppercase;
    color:#D4AF37;margin-bottom:14px;
  }
  .ne-title{
    font-family:Georgia,serif;
    font-size:clamp(1.8rem,4.5vw,2.5rem);font-weight:300;
    color:#F5E6A8;margin-bottom:32px;line-height:1.3;
  }
  .ne-body{
    font-family:Georgia,serif;font-size:1.05rem;font-style:italic;
    color:#C5B47E;line-height:1.8;margin-bottom:24px;
  }

  /* Countdown */
  .ne-countdown{
    display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
  }
  .ne-cd{display:flex;flex-direction:column;align-items:center;gap:8px}
  .ne-cd-box{
    min-width:72px;padding:18px 16px;
    background:rgba(212,175,55,0.05);
    border:1px solid rgba(212,175,55,0.3);
    font-family:Georgia,serif;font-size:2rem;font-weight:300;
    color:#F5E6A8;
  }
  .ne-cd-label{
    font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:#D4AF37;
  }

  /* Timeline */
  .ne-timeline{
    display:flex;flex-direction:column;gap:6px;
    max-width:520px;margin:0 auto;text-align:left;
  }
  .ne-tl-item{
    display:grid;grid-template-columns:80px 20px 1fr;gap:16px;
    align-items:flex-start;padding:14px 0;
  }
  .ne-tl-time{
    font-family:Georgia,serif;font-size:1.2rem;color:#D4AF37;
    text-align:right;padding-top:2px;
  }
  .ne-tl-dot{
    display:flex;justify-content:center;padding-top:6px;
    position:relative;
  }
  .ne-tl-dot::before{
    content:'';position:absolute;top:6px;bottom:-30px;left:50%;
    width:1px;background:rgba(212,175,55,0.3);transform:translateX(-50%);
  }
  .ne-tl-item:last-child .ne-tl-dot::before{display:none}
  .ne-tl-dot span{
    width:10px;height:10px;border-radius:50%;
    background:#D4AF37;
    box-shadow:0 0 0 3px rgba(10,10,31,1),0 0 0 4px rgba(212,175,55,0.4);
    z-index:1;
  }
  .ne-tl-event{
    font-family:Georgia,serif;font-size:1.05rem;font-weight:500;color:#F5E6A8;
  }
  .ne-tl-venue{
    font-size:.85rem;font-style:italic;color:#C5B47E;margin-top:3px;
  }

  /* Map */
  .ne-btn-row{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:24px}
  .ne-btn-map{
    padding:14px 32px;background:#D4AF37;color:#0A0A1F;
    text-decoration:none;font-size:.65rem;letter-spacing:.25em;
    text-transform:uppercase;font-weight:600;
    transition:all .3s;
  }
  .ne-btn-map:hover{
    transform:translateY(-2px);
    box-shadow:0 8px 24px rgba(212,175,55,0.4);
  }
  .ne-btn-outline{
    background:transparent;color:#D4AF37;
    border:1px solid #D4AF37;
  }

  /* RSVP */
  .ne-rsvp{
    background:rgba(0,0,0,0.4);backdrop-filter:blur(10px);
    border-top:1px solid rgba(212,175,55,0.2);
    border-bottom:1px solid rgba(212,175,55,0.2);
    max-width:none;
  }
  .ne-form{
    max-width:440px;margin:0 auto;
    display:flex;flex-direction:column;gap:14px;text-align:left;
  }
  .ne-input{
    width:100%;padding:14px 18px;
    background:rgba(245,230,168,0.04);
    border:1px solid rgba(212,175,55,0.3);
    color:#F5E6A8;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .ne-input::placeholder{color:rgba(245,230,168,0.4);font-style:italic}
  .ne-input:focus{border-color:#D4AF37}
  .ne-textarea{resize:vertical;min-height:80px}
  .ne-radios{display:flex;gap:8px}
  .ne-radio{
    flex:1;padding:12px 6px;
    background:transparent;
    border:1px solid rgba(212,175,55,0.3);
    color:rgba(245,230,168,0.7);
    font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;
    cursor:pointer;transition:all .2s;font-family:inherit;
  }
  .ne-radio-on,.ne-radio:hover{
    background:#D4AF37;border-color:#D4AF37;color:#0A0A1F;font-weight:600;
  }
  .ne-btn-submit{
    padding:16px;background:#D4AF37;color:#0A0A1F;
    border:none;font-size:.65rem;letter-spacing:.3em;
    text-transform:uppercase;font-weight:600;cursor:pointer;
    transition:opacity .3s;font-family:inherit;
  }
  .ne-btn-submit:hover{opacity:.88}
  .ne-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .ne-success{
    font-family:Georgia,serif;font-size:1.2rem;font-style:italic;
    color:#D4AF37;padding:20px;
  }

  /* Guestbook messages */
  .ne-messages{
    display:flex;flex-direction:column;gap:14px;
    max-width:520px;margin:0 auto;text-align:left;
  }
  .ne-msg{
    border-left:2px solid #D4AF37;padding:14px 18px;
    background:rgba(245,230,168,0.04);
  }
  .ne-msg-name{
    font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;
    color:#D4AF37;margin-bottom:6px;
  }
  .ne-msg-text{
    font-family:Georgia,serif;font-size:1rem;font-style:italic;
    color:#C5B47E;line-height:1.6;
  }

  /* Footer */
  .ne-footer{
    padding:48px 24px;text-align:center;
    border-top:1px solid rgba(212,175,55,0.2);
  }
  .ne-orn{color:#D4AF37;font-size:1.2rem;margin-bottom:16px;letter-spacing:.5em}
  .ne-footer-names{
    font-family:'Great Vibes',cursive,Georgia,serif;
    font-size:2.4rem;color:#D4AF37;margin-bottom:6px;
  }
  .ne-footer-date{
    font-family:Georgia,serif;font-size:.85rem;font-style:italic;
    color:#C5B47E;margin-bottom:24px;
  }
  .ne-footer-credit{
    font-size:.55rem;letter-spacing:.3em;
    color:#D4AF37;opacity:.5;text-transform:uppercase;
  }

  @media(max-width:480px){
    .ne-date{flex-direction:column;gap:12px;padding:20px 24px}
    .ne-tl-item{grid-template-columns:60px 20px 1fr;gap:10px}
    .ne-tl-time{font-size:1rem}
  }
`