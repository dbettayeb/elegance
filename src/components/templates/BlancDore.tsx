'use client'
import { useState, useRef } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'

export default function BlancDore({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate, introText,
  } = useInvitationLogic(wedding)

  // Player musique (spécifique à ce template)
  const audioRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const [playing, setPlaying] = useState(false)

  function toggleMusic() {
    if (!playing) {
      const ctx = new AudioContext()
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2)
      gain.connect(ctx.destination)
      ;[220, 330, 440, 550].forEach(freq => {
        const osc = ctx.createOscillator()
        const g2 = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        g2.gain.value = 0.25
        osc.connect(g2)
        g2.connect(gain)
        osc.start()
      })
      audioRef.current = ctx
      gainRef.current = gain
      setPlaying(true)
    } else {
      gainRef.current?.gain.linearRampToValueAtTime(0, audioRef.current!.currentTime + 0.5)
      setPlaying(false)
    }
  }

  const formattedDate = eventDate.toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const formattedTime = eventDate.toLocaleTimeString('fr-TN', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <>
      <style>{CSS}</style>

      {/* ── ENVELOPPE ── */}
      {!opened && (
        <div className="ed-env-screen">
          <div className="ed-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="ed-env-svg" fill="none">
              <rect x="10" y="40" width="260" height="150" rx="3" fill="#FAF7F0" stroke="#C9A84C" strokeWidth="1.2"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#F0EAD6" stroke="#C9A84C" strokeWidth="1"/>
              <path d="M10 40 L140 110 L10 190Z"  fill="#F5F0E8" stroke="#C9A84C" strokeWidth="0.8"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#EDE3CC" stroke="#C9A84C" strokeWidth="0.8"/>
              <path d="M10 40 L140 115 L270 40Z"   fill="#FAF7F0" stroke="#C9A84C" strokeWidth="1.2"/>
              <circle cx="140" cy="105" r="22" fill="#8B6914" opacity="0.9"/>
              <circle cx="140" cy="105" r="18" fill="#C9A84C"/>
              <text x="140" y="112" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" fill="white">
                {wedding.bride_name[0]}&{wedding.groom_name[0]}
              </text>
            </svg>
          </div>
          <p className="ed-env-hint">Appuyez pour ouvrir</p>
        </div>
      )}

      {/* ── INVITATION ── */}
      <div className={`ed-invitation${visible ? ' ed-visible' : ''}`}>

        {/* HERO */}
        <div className="ed-hero">
          <div className="ed-hero-bg"/>
          <div className="ed-hero-content">
            <p className="ed-pre-title">{introText}</p>
            <div className="ed-names">
              {wedding.bride_name}
              <span className="ed-amp">&</span>
              {wedding.groom_name}
            </div>
            <div className="ed-gold-line"><div className="ed-diamond"/></div>
            {wedding.custom_message && (
              <p className="ed-invite-text">{wedding.custom_message}</p>
            )}
            <div className="ed-date-block">
              <span className="ed-date-day">{eventDate.getDate()}</span>
              <span className="ed-date-month">
                {eventDate.toLocaleDateString('fr-TN', { month: 'long' })}
              </span>
              <span className="ed-date-year">{eventDate.getFullYear()}</span>
            </div>
            <p className="ed-time">{formattedTime}</p>
          </div>
        </div>

        {/* COMPTE À REBOURS */}
        <section className="ed-section">
          <p className="ed-label">Compte à rebours</p>
          <h2 className="ed-title">Le Grand Jour approche</h2>
          <div className="ed-countdown">
            {[
              { val: countdown.d, label: 'Jours' },
              { val: countdown.h, label: 'Heures' },
              { val: countdown.m, label: 'Minutes' },
              { val: countdown.s, label: 'Secondes' },
            ].map((item, i) => (
              <div key={i} className="ed-cd-block">
                <span className="ed-cd-number">{item.val}</span>
                <span className="ed-cd-label">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="ed-divider">✦</div>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="ed-section">
            <p className="ed-label">Déroulement</p>
            <h2 className="ed-title">Programme de la Soirée</h2>
            <ul className="ed-timeline">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <li key={i} className={`ed-tl-item ${i % 2 === 0 ? 'ed-tl-left' : 'ed-tl-right'}`}>
                  <div className="ed-tl-content">
                    <span className="ed-tl-time">{item.time}</span>
                    <div className="ed-tl-event">{item.event}</div>
                    {item.venue && <div className="ed-tl-venue">{item.venue}</div>}
                  </div>
                  <div className="ed-tl-dot"><div className="ed-tl-dot-inner"/></div>
                  <div className="ed-tl-empty"/>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="ed-divider">✦</div>

        {/* LIEU */}
        <section className="ed-section">
          <p className="ed-label">Le Lieu</p>
          <h2 className="ed-title">{wedding.venue_name}</h2>
          {wedding.venue_address && (
            <p className="ed-body">{wedding.venue_address}</p>
          )}
          <div className="ed-map-card">
            <div className="ed-btn-row">
              {wedding.gps_google && (
                <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="ed-btn-map">
                  📍 Google Maps
                </a>
              )}
              {wedding.gps_apple && (
                <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="ed-btn-map ed-btn-dark">
                  🗺 Apple Maps
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="ed-divider">✦</div>

        {/* RSVP */}
        <div className="ed-rsvp-section">
          <p className="ed-label" style={{color:'#E8D49E'}}>Confirmation</p>
          <h2 className="ed-title" style={{color:'#FAF7F0'}}>Serez-vous des nôtres ?</h2>
          {rsvpStatus === 'done' ? (
            <p className="ed-rsvp-success">
              Merci ! Votre réponse a bien été enregistrée. 🤍
            </p>
          ) : (
            <form className="ed-rsvp-form" onSubmit={submitRSVP}>
              <input className="ed-input" name="name"  placeholder="Votre prénom et nom"     required />
              <input className="ed-input" name="phone" placeholder="Votre numéro WhatsApp"   />
              <div className="ed-radio-group">
                {(['present','absent','maybe'] as const).map(s => (
                  <div
                    key={s}
                    className={`ed-radio${rsvpChoice === s ? ' ed-radio-on' : ''}`}
                    onClick={() => setRsvpChoice(s)}
                  >
                    {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                  </div>
                ))}
              </div>
              <input className="ed-input" name="guests" type="number" min="0" max="20"
                placeholder="Nombre d'accompagnants" />
              <textarea className="ed-input ed-textarea" name="note"
                placeholder="Message optionnel..." />
              <button className="ed-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer ma présence'}
              </button>
            </form>
          )}
        </div>

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <div className="ed-guestbook">
            <p className="ed-label">Livre d'or</p>
            <h2 className="ed-title">Laissez votre message</h2>

            {/* Messages existants */}
            <div className="ed-messages">
              {messages.map(msg => (
                <div key={msg.id} className="ed-msg-card">
                  <div className="ed-msg-name">{msg.author_name}</div>
                  <div className="ed-msg-text">"{msg.message}"</div>
                </div>
              ))}
            </div>

            {/* Formulaire */}
            {gbStatus === 'done' ? (
              <p className="ed-gb-success">
                {gbPending
                  ? 'Votre message a été envoyé et sera visible après validation. Merci !'
                  : 'Votre message a été publié. Merci !'}
              </p>
            ) : (
              <form className="ed-gb-form" onSubmit={submitMessage}>
                <input className="ed-gb-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="ed-gb-input ed-gb-textarea" name="message"
                  placeholder="Votre message de vœux..." required />
                <button className="ed-btn-gb" type="submit" disabled={gbStatus === 'loading'}>
                  {gbStatus === 'loading' ? 'Envoi...' : 'Publier mon message ✦'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* FOOTER */}
        <footer className="ed-footer">
          <div className="ed-footer-names">{wedding.bride_name} & {wedding.groom_name}</div>
          <div className="ed-footer-date">{formattedDate}</div>
          <div className="ed-footer-credit">Élégance Digitale™</div>
        </footer>
      </div>

      {/* MUSIC PLAYER */}
      <div className="ed-music" onClick={toggleMusic}>
        <div className="ed-music-icon">{playing ? '♫' : '♪'}</div>
        <div>
          <div className="ed-music-label">Musique d'ambiance</div>
          <div className="ed-music-status">{playing ? 'En lecture' : 'Activer'}</div>
        </div>
        {playing && (
          <div className="ed-eq">
            {[1,2,3,4].map(i => <div key={i} className="ed-eq-bar"/>)}
          </div>
        )}
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --gold:#C9A84C;--gold-l:#E8D49E;--gold-d:#8B6914;
    --cream:#FAF7F0;--cream-d:#F0EAD6;--text:#2C2416;
    --mid:#6B5A3E;--light:#9B8A6E;
  }
  body{font-family:'Montserrat',sans-serif;background:var(--cream);color:var(--text);overflow-x:hidden}

  /* ENV */
  .ed-env-screen{position:fixed;inset:0;z-index:1000;background:linear-gradient(145deg,#f5f0e8,#ede3cc);display:flex;flex-direction:column;align-items:center;justify-content:center}
  .ed-env-wrap{cursor:pointer;filter:drop-shadow(0 20px 60px rgba(139,105,20,.25));transition:transform .3s}
  .ed-env-wrap:hover{transform:translateY(-6px) scale(1.02)}
  .ed-env-svg{width:260px;height:auto}
  .ed-env-hint{margin-top:24px;font-family:Georgia,serif;font-size:.95rem;color:var(--gold-d);letter-spacing:.15em;animation:edPulse 2.5s ease-in-out infinite}
  @keyframes edPulse{0%,100%{opacity:.5}50%{opacity:1}}

  /* INVITATION */
  .ed-invitation{opacity:0;transform:translateY(24px);transition:opacity 1s ease,transform 1s ease;min-height:100vh}
  .ed-invitation.ed-visible{opacity:1;transform:none}

  /* HERO */
  .ed-hero{min-height:100vh;position:relative;display:flex;align-items:center;justify-content:center;padding:60px 24px;text-align:center;overflow:hidden}
  .ed-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(201,168,76,.12) 0%,transparent 70%),linear-gradient(180deg,#fff 0%,var(--cream) 60%,var(--cream-d) 100%)}
  .ed-hero-content{position:relative;z-index:1}
  .ed-pre-title{font-size:.6rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:20px}
  .ed-names{font-family:'Great Vibes',cursive,Georgia,serif;font-size:clamp(3.5rem,11vw,6.5rem);line-height:1;color:var(--text)}
  .ed-amp{color:var(--gold);display:block;font-size:clamp(2.2rem,7vw,4rem);line-height:.9}
  .ed-gold-line{display:flex;align-items:center;justify-content:center;gap:16px;margin:20px 0}
  .ed-gold-line::before,.ed-gold-line::after{content:'';flex:1;max-width:80px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
  .ed-diamond{width:6px;height:6px;background:var(--gold);transform:rotate(45deg)}
  .ed-invite-text{font-family:Georgia,serif;font-size:1.05rem;font-style:italic;color:var(--mid);line-height:1.8;max-width:440px;margin:0 auto 24px}
  .ed-date-block{display:inline-flex;flex-direction:column;align-items:center;border:1px solid rgba(201,168,76,.4);padding:18px 36px;background:rgba(255,255,255,.7);position:relative}
  .ed-date-block::before{content:'';position:absolute;top:-1px;left:-1px;width:12px;height:12px;border-top:1px solid var(--gold);border-left:1px solid var(--gold)}
  .ed-date-block::after{content:'';position:absolute;bottom:-1px;right:-1px;width:12px;height:12px;border-bottom:1px solid var(--gold);border-right:1px solid var(--gold)}
  .ed-date-day{font-family:Georgia,serif;font-size:2.6rem;font-weight:300;line-height:1;color:var(--gold-d)}
  .ed-date-month{font-size:.6rem;letter-spacing:.35em;text-transform:uppercase;color:var(--light);margin:4px 0}
  .ed-date-year{font-family:Georgia,serif;font-size:1.1rem;color:var(--gold)}
  .ed-time{font-size:.65rem;letter-spacing:.3em;color:var(--light);margin-top:12px;text-transform:uppercase}

  /* SECTIONS */
  .ed-section{max-width:680px;margin:0 auto;padding:72px 24px;text-align:center}
  .ed-label{font-size:.58rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
  .ed-title{font-family:Georgia,serif;font-size:clamp(1.7rem,4vw,2.3rem);font-weight:300;color:var(--text);margin-bottom:16px;line-height:1.3}
  .ed-body{font-family:Georgia,serif;font-size:1.05rem;font-style:italic;color:var(--mid);line-height:1.9}
  .ed-divider{text-align:center;color:var(--gold);font-size:1.1rem;letter-spacing:.5em;padding:8px 0;opacity:.6}

  /* COUNTDOWN */
  .ed-countdown{display:flex;gap:20px;justify-content:center;margin-top:28px;flex-wrap:wrap}
  .ed-cd-block{display:flex;flex-direction:column;align-items:center;min-width:64px}
  .ed-cd-number{font-family:Georgia,serif;font-size:2.8rem;font-weight:300;color:var(--text);line-height:1}
  .ed-cd-label{font-size:.52rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-top:6px}

  /* TIMELINE */
  .ed-timeline{list-style:none;position:relative;max-width:560px;margin:36px auto 0}
  .ed-timeline::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:1px;background:linear-gradient(180deg,transparent,var(--gold-l) 15%,var(--gold-l) 85%,transparent);transform:translateX(-50%)}
  .ed-tl-item{display:grid;grid-template-columns:1fr 36px 1fr;gap:12px;align-items:center;margin-bottom:28px}
  .ed-tl-left .ed-tl-content{text-align:right;grid-column:1}
  .ed-tl-left .ed-tl-dot{grid-column:2}
  .ed-tl-left .ed-tl-empty{grid-column:3}
  .ed-tl-right .ed-tl-empty{grid-column:1}
  .ed-tl-right .ed-tl-dot{grid-column:2}
  .ed-tl-right .ed-tl-content{text-align:left;grid-column:3}
  .ed-tl-dot{display:flex;align-items:center;justify-content:center;z-index:1}
  .ed-tl-dot-inner{width:9px;height:9px;background:var(--gold);border-radius:50%;box-shadow:0 0 0 4px var(--cream),0 0 0 5px var(--gold-l)}
  .ed-tl-time{font-size:.58rem;letter-spacing:.2em;color:var(--gold);display:block;margin-bottom:3px}
  .ed-tl-event{font-family:Georgia,serif;font-size:1.05rem;font-weight:600;color:var(--text)}
  .ed-tl-venue{font-family:Georgia,serif;font-size:.9rem;color:var(--light);font-style:italic}

  /* MAP */
  .ed-map-card{background:#fff;border:1px solid rgba(201,168,76,.3);padding:28px 20px;margin-top:28px;position:relative}
  .ed-map-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold-l),var(--gold),var(--gold-l))}
  .ed-btn-row{display:flex;justify-content:center;flex-wrap:wrap;gap:12px}
  .ed-btn-map{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold-d),var(--gold));color:#fff;text-decoration:none;padding:13px 28px;font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;transition:all .3s}
  .ed-btn-map:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(139,105,20,.3)}
  .ed-btn-dark{background:linear-gradient(135deg,#444,#222)}

  /* RSVP */
  .ed-rsvp-section{background:linear-gradient(135deg,#2C2416 0%,#3d2e18 100%);padding:72px 24px;text-align:center}
  .ed-rsvp-form{max-width:440px;margin:32px auto 0;display:flex;flex-direction:column;gap:14px}
  .ed-input{width:100%;padding:14px 18px;background:rgba(255,255,255,.07);border:1px solid rgba(201,168,76,.3);color:var(--cream);font-family:Georgia,serif;font-size:.95rem;outline:none;transition:border-color .3s;border-radius:1px}
  .ed-input::placeholder{color:rgba(250,247,240,.4);font-style:italic}
  .ed-input:focus{border-color:var(--gold)}
  .ed-textarea{resize:vertical;min-height:72px}
  .ed-radio-group{display:flex;gap:8px}
  .ed-radio{flex:1;padding:12px 6px;border:1px solid rgba(201,168,76,.3);color:rgba(250,247,240,.7);font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;text-align:center;transition:all .2s}
  .ed-radio-on,.ed-radio:hover{background:var(--gold);border-color:var(--gold);color:#fff}
  .ed-btn-submit{padding:16px;background:linear-gradient(135deg,var(--gold-d),var(--gold));color:#fff;border:none;font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;cursor:pointer;transition:opacity .3s}
  .ed-btn-submit:hover{opacity:.88}
  .ed-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .ed-rsvp-success{font-family:Georgia,serif;font-size:1.3rem;font-style:italic;color:var(--gold-l);padding:20px;margin-top:24px}

  /* GUESTBOOK */
  .ed-guestbook{background:#fff;padding:72px 24px;text-align:center}
  .ed-messages{display:flex;flex-direction:column;gap:14px;max-width:540px;margin:32px auto 0;text-align:left}
  .ed-msg-card{border-left:2px solid var(--gold-l);padding:14px 18px;background:var(--cream)}
  .ed-msg-name{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:5px}
  .ed-msg-text{font-family:Georgia,serif;font-size:1rem;font-style:italic;color:var(--mid);line-height:1.6}
  .ed-gb-form{max-width:540px;margin:28px auto 0;display:flex;flex-direction:column;gap:12px;text-align:left}
  .ed-gb-input{width:100%;padding:13px 16px;border:1px solid rgba(201,168,76,.3);background:var(--cream);font-family:Georgia,serif;font-size:.95rem;outline:none;transition:border-color .3s;color:var(--text)}
  .ed-gb-input:focus{border-color:var(--gold)}
  .ed-gb-textarea{resize:vertical;min-height:80px}
  .ed-btn-gb{padding:13px 28px;background:transparent;border:1px solid var(--gold);color:var(--gold-d);font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;cursor:pointer;transition:all .3s;align-self:flex-end}
  .ed-btn-gb:hover{background:var(--gold);color:#fff}
  .ed-btn-gb:disabled{opacity:.5;cursor:not-allowed}
  .ed-gb-success{font-family:Georgia,serif;font-size:1.05rem;font-style:italic;color:var(--gold-d);padding:20px;max-width:480px;margin:0 auto;line-height:1.8}

  /* FOOTER */
  .ed-footer{padding:48px 24px;text-align:center;background:var(--cream-d);border-top:1px solid rgba(201,168,76,.2)}
  .ed-footer-names{font-family:'Great Vibes',cursive,Georgia,serif;font-size:2.4rem;color:var(--gold-d);margin-bottom:6px}
  .ed-footer-date{font-family:Georgia,serif;font-size:.85rem;font-style:italic;color:var(--light);margin-bottom:24px}
  .ed-footer-credit{font-size:.52rem;letter-spacing:.25em;color:var(--gold);opacity:.55;text-transform:uppercase}

  /* MUSIC */
  .ed-music{position:fixed;bottom:20px;right:20px;z-index:500;display:flex;align-items:center;gap:10px;background:rgba(44,36,22,.92);border:1px solid rgba(201,168,76,.3);padding:10px 16px;cursor:pointer;backdrop-filter:blur(10px);transition:border-color .3s}
  .ed-music:hover{border-color:var(--gold)}
  .ed-music-icon{width:30px;height:30px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;flex-shrink:0}
  .ed-music-label{font-size:.52rem;letter-spacing:.18em;text-transform:uppercase;color:var(--cream-d)}
  .ed-music-status{font-size:.48rem;color:var(--gold);letter-spacing:.12em;margin-top:2px}
  .ed-eq{display:flex;gap:2px;align-items:flex-end;height:14px}
  .ed-eq-bar{width:3px;background:var(--gold);border-radius:1px;animation:edEq .7s ease-in-out infinite alternate}
  .ed-eq-bar:nth-child(1){height:6px;animation-delay:0s}
  .ed-eq-bar:nth-child(2){height:12px;animation-delay:.15s}
  .ed-eq-bar:nth-child(3){height:8px;animation-delay:.05s}
  .ed-eq-bar:nth-child(4){height:14px;animation-delay:.25s}
  @keyframes edEq{from{transform:scaleY(.3)}to{transform:scaleY(1)}}

  @media(max-width:480px){
    .ed-timeline::before{left:18px}
    .ed-tl-item{grid-template-columns:24px 1fr}
    .ed-tl-left .ed-tl-content,.ed-tl-right .ed-tl-content{text-align:left;grid-column:2}
    .ed-tl-left .ed-tl-dot,.ed-tl-right .ed-tl-dot{grid-column:1}
    .ed-tl-empty{display:none}
  }
`