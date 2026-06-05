'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import FontOverride from '@/components/common/FontOverride'

export default function Minimaliste({ wedding }: { wedding: Wedding }) {
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
      <FontOverride font={wedding.custom_font} container=".mn-container" />

      {/* ENVELOPPE */}
      {!opened && (
        <div className="mn-env-screen">
          <div className="mn-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="mn-env-svg" fill="none">
              <rect x="10" y="40" width="260" height="150" rx="0" fill="#fff" stroke="#000" strokeWidth="1"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#f8f8f8" stroke="#000" strokeWidth="0.6"/>
              <path d="M10 40 L140 110 L10 190Z" fill="#fff" stroke="#000" strokeWidth="0.6"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#fff" stroke="#000" strokeWidth="0.6"/>
              <path d="M10 40 L140 115 L270 40Z" fill="#fff" stroke="#000" strokeWidth="1"/>
              <text x="140" y="112" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fill="#000" letterSpacing="3">
                {wedding.bride_name[0]}&nbsp;&amp;&nbsp;{wedding.groom_name[0]}
              </text>
              <line x1="100" y1="120" x2="180" y2="120" stroke="#B8985A" strokeWidth="0.6"/>
            </svg>
          </div>
          <p className="mn-env-hint">Ouvrir</p>
        </div>
      )}

      {/* INVITATION */}
      <div className={`mn-invitation${visible ? ' mn-visible' : ''}`}>

        {/* HERO - Pleine page très épurée */}
        <section className="mn-hero">
          <p className="mn-pre">{introText}</p>

          <h1 className="mn-names">
            <span className="mn-name">{wedding.bride_name}</span>
            <span className="mn-and">et</span>
            <span className="mn-name">{wedding.groom_name}</span>
          </h1>

          <div className="mn-gold-line"></div>

          {wedding.custom_message && (
            <p className="mn-custom">{wedding.custom_message}</p>
          )}

          <div className="mn-date">
            <div className="mn-date-line">
              {eventDate.toLocaleDateString('fr-TN', { weekday: 'long' }).toUpperCase()}
            </div>
            <div className="mn-date-big">
              {eventDate.getDate()}
              <span className="mn-date-month">
                {eventDate.toLocaleDateString('fr-TN', { month: 'long' })}
              </span>
              {eventDate.getFullYear()}
            </div>
            <div className="mn-date-line">{formattedTime}</div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="mn-section">
          <p className="mn-label">Compte à rebours</p>
          <div className="mn-countdown">
            {[
              { val: countdown.d, label: 'jours' },
              { val: countdown.h, label: 'heures' },
              { val: countdown.m, label: 'minutes' },
              { val: countdown.s, label: 'secondes' },
            ].map((item, i) => (
              <div key={i} className="mn-cd">
                <div className="mn-cd-num">{item.val}</div>
                <div className="mn-cd-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="mn-section">
            <p className="mn-label">Programme</p>
            <div className="mn-program">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <div key={i} className="mn-prog-item">
                  <div className="mn-prog-time">{item.time}</div>
                  <div className="mn-prog-content">
                    <div className="mn-prog-event">{item.event}</div>
                    {item.venue && <div className="mn-prog-venue">{item.venue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIEU */}
        <section className="mn-section">
          <p className="mn-label">Lieu</p>
          <h2 className="mn-venue-name">{wedding.venue_name}</h2>
          {wedding.venue_address && <p className="mn-venue-addr">{wedding.venue_address}</p>}
          <div className="mn-btn-row">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="mn-btn">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="mn-btn">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        {wedding.show_rsvp && (
        <section className="mn-section mn-rsvp">
          <p className="mn-label">RSVP</p>
          <h2 className="mn-rsvp-title">Confirmez votre présence</h2>
          {rsvpStatus === 'done' ? (
            <p className="mn-success">Réponse enregistrée.</p>
          ) : (
            <form className="mn-form" onSubmit={submitRSVP}>
              <input className="mn-input" name="name" placeholder="Prénom et nom" required />
              <input className="mn-input" name="phone" placeholder="Numéro WhatsApp" />
              <div className="mn-radios">
                {(['present', 'absent', 'maybe'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`mn-radio${rsvpChoice === s ? ' mn-radio-on' : ''}`}
                    onClick={() => setRsvpChoice(s)}
                  >
                    {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'À confirmer'}
                  </button>
                ))}
              </div>
              <input className="mn-input" name="guests" type="number" min="0" max="20" placeholder="Accompagnants" />
              <textarea className="mn-input mn-textarea" name="note" placeholder="Message (optionnel)" />
              <button className="mn-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer'}
              </button>
            </form>
          )}
        </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="mn-section">
            <p className="mn-label">Livre d'or</p>
            {messages.length > 0 && (
              <div className="mn-messages">
                {messages.map(msg => (
                  <div key={msg.id} className="mn-msg">
                    <div className="mn-msg-text">"{msg.message}"</div>
                    <div className="mn-msg-name">— {msg.author_name}</div>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="mn-success" style={{ marginTop: '20px' }}>
                {gbPending ? 'En attente de validation.' : 'Publié.'}
              </p>
            ) : (
              <form className="mn-form" onSubmit={submitMessage} style={{ marginTop: '20px' }}>
                <input className="mn-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="mn-input mn-textarea" name="message" placeholder="Votre message..." required />
                <button className="mn-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                  Publier
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="mn-footer">
          <div className="mn-gold-line" style={{ margin: '0 auto 24px' }}></div>
          <div className="mn-footer-names">{wedding.bride_name} · {wedding.groom_name}</div>
          <div className="mn-footer-date">{formattedDate}</div>
          <div className="mn-footer-credit">Élégance Digitale</div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Montserrat',sans-serif;font-weight:300;
    background:#fff;color:#000;overflow-x:hidden;
  }

  /* Enveloppe */
  .mn-env-screen{
    position:fixed;inset:0;z-index:1000;background:#fafafa;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
  }
  .mn-env-wrap{
    cursor:pointer;
    filter:drop-shadow(0 12px 28px rgba(0,0,0,0.08));
    transition:transform .4s;
  }
  .mn-env-wrap:hover{transform:translateY(-4px)}
  .mn-env-svg{width:280px;height:auto}
  .mn-env-hint{
    margin-top:32px;font-size:.7rem;letter-spacing:.5em;text-transform:uppercase;
    color:#000;animation:mnFade 2.5s ease-in-out infinite;
  }
  @keyframes mnFade{0%,100%{opacity:.3}50%{opacity:1}}

  /* Invitation */
  .mn-invitation{
    opacity:0;transform:translateY(20px);
    transition:opacity 1.2s,transform 1.2s;
  }
  .mn-invitation.mn-visible{opacity:1;transform:none}

  /* Hero */
  .mn-hero{
    min-height:100vh;padding:80px 24px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;
  }
  .mn-pre{
    font-size:.7rem;letter-spacing:.5em;text-transform:uppercase;
    color:#888;margin-bottom:40px;font-weight:400;
  }
  .mn-names{
    font-family:Georgia,serif;font-weight:200;
    font-size:clamp(2.5rem,8vw,4.5rem);
    line-height:1.1;color:#000;letter-spacing:-.01em;
    display:flex;flex-direction:column;align-items:center;gap:8px;
    margin:0;
  }
  .mn-name{display:block}
  .mn-and{
    font-style:italic;font-weight:300;
    font-size:clamp(1.2rem,3vw,1.8rem);
    color:#888;margin:4px 0;
  }
  .mn-gold-line{
    width:60px;height:1px;background:#B8985A;
    margin:40px 0;
  }
  .mn-custom{
    font-family:Georgia,serif;font-size:1rem;font-style:italic;
    color:#666;line-height:1.9;max-width:440px;
    margin-bottom:48px;
  }
  .mn-date{
    display:flex;flex-direction:column;align-items:center;gap:12px;
  }
  .mn-date-line{
    font-size:.7rem;letter-spacing:.4em;text-transform:uppercase;color:#888;
  }
  .mn-date-big{
    display:flex;flex-direction:column;align-items:center;gap:6px;
    font-family:Georgia,serif;font-weight:200;font-size:3.5rem;
    color:#000;line-height:1;
  }
  .mn-date-month{
    font-size:.75rem;letter-spacing:.4em;text-transform:uppercase;
    color:#B8985A;font-family:'Montserrat',sans-serif;font-weight:500;
    margin:6px 0;
  }

  /* Sections */
  .mn-section{
    max-width:560px;margin:0 auto;padding:80px 24px;text-align:center;
    border-top:1px solid #f0f0f0;
  }
  .mn-label{
    font-size:.7rem;letter-spacing:.5em;text-transform:uppercase;
    color:#B8985A;margin-bottom:32px;font-weight:500;
  }
  .mn-rsvp-title,.mn-venue-name{
    font-family:Georgia,serif;font-weight:200;
    font-size:clamp(1.6rem,4vw,2.2rem);
    color:#000;margin-bottom:24px;
  }
  .mn-venue-addr{
    color:#666;font-style:italic;font-family:Georgia,serif;
    margin-bottom:24px;font-size:1rem;
  }

  /* Countdown */
  .mn-countdown{
    display:flex;justify-content:center;gap:32px;flex-wrap:wrap;
  }
  .mn-cd{display:flex;flex-direction:column;align-items:center}
  .mn-cd-num{
    font-family:Georgia,serif;font-weight:200;font-size:3rem;
    color:#000;line-height:1;
  }
  .mn-cd-label{
    font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;
    color:#888;margin-top:10px;font-weight:400;
  }

  /* Programme */
  .mn-program{
    display:flex;flex-direction:column;text-align:left;
    max-width:460px;margin:0 auto;
  }
  .mn-prog-item{
    display:grid;grid-template-columns:90px 1fr;gap:24px;
    padding:20px 0;border-bottom:1px solid #f0f0f0;
  }
  .mn-prog-item:last-child{border-bottom:none}
  .mn-prog-time{
    font-family:Georgia,serif;font-weight:300;font-size:1.4rem;color:#B8985A;
  }
  .mn-prog-event{
    font-family:Georgia,serif;font-weight:400;font-size:1.05rem;color:#000;
  }
  .mn-prog-venue{
    font-size:.85rem;color:#888;font-style:italic;margin-top:4px;
  }

  /* Map buttons */
  .mn-btn-row{
    display:flex;justify-content:center;gap:12px;flex-wrap:wrap;
  }
  .mn-btn{
    padding:12px 32px;background:#000;color:#fff;text-decoration:none;
    font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;
    font-weight:500;transition:opacity .3s;
  }
  .mn-btn:hover{opacity:.8}

  /* RSVP */
  .mn-rsvp{background:#fafafa;border:none;max-width:none}
  .mn-rsvp > *{max-width:560px;margin-left:auto;margin-right:auto}
  .mn-form{
    max-width:440px;margin:0 auto;
    display:flex;flex-direction:column;gap:12px;text-align:left;
  }
  .mn-input{
    width:100%;padding:14px 0;
    background:transparent;
    border:none;border-bottom:1px solid #ccc;
    color:#000;font-family:Georgia,serif;font-size:1rem;
    outline:none;transition:border-color .3s;font-weight:300;
  }
  .mn-input::placeholder{color:#aaa;font-style:italic}
  .mn-input:focus{border-bottom-color:#000}
  .mn-textarea{resize:vertical;min-height:60px;font-family:Georgia,serif}
  .mn-radios{display:flex;gap:8px;margin:12px 0}
  .mn-radio{
    flex:1;padding:11px 6px;
    background:transparent;border:1px solid #ddd;
    color:#666;font-size:.62rem;letter-spacing:.18em;
    text-transform:uppercase;cursor:pointer;transition:all .2s;
    font-family:inherit;font-weight:500;
  }
  .mn-radio-on,.mn-radio:hover{
    background:#000;border-color:#000;color:#fff;
  }
  .mn-btn-submit{
    margin-top:16px;padding:14px;
    background:#000;color:#fff;border:none;
    font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;
    font-weight:500;cursor:pointer;transition:opacity .3s;
    font-family:inherit;
  }
  .mn-btn-submit:hover{opacity:.85}
  .mn-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .mn-success{
    font-family:Georgia,serif;font-size:1.1rem;font-style:italic;
    color:#000;padding:20px;
  }

  /* Messages */
  .mn-messages{
    display:flex;flex-direction:column;gap:24px;
    max-width:440px;margin:0 auto;text-align:left;
  }
  .mn-msg{padding:0}
  .mn-msg-text{
    font-family:Georgia,serif;font-size:1.05rem;font-style:italic;
    color:#333;line-height:1.7;
  }
  .mn-msg-name{
    font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;
    color:#B8985A;margin-top:8px;
  }

  /* Footer */
  .mn-footer{
    padding:60px 24px;text-align:center;
    border-top:1px solid #f0f0f0;
  }
  .mn-footer-names{
    font-family:Georgia,serif;font-weight:300;font-size:1.4rem;
    color:#000;margin-bottom:6px;
  }
  .mn-footer-date{
    font-family:Georgia,serif;font-size:.85rem;font-style:italic;
    color:#888;margin-bottom:32px;
  }
  .mn-footer-credit{
    font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;
    color:#B8985A;font-weight:500;
  }
`