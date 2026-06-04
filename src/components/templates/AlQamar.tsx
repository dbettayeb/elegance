'use client'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import { formatDateArabic, formatTimeArabic, toArabicNumerals, getArabicName, formatMonthArabic } from '@/lib/arabic-utils'

export default function AlQamar({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate,
  } = useInvitationLogic(wedding)

  const brideAr = getArabicName(wedding.bride_name_ar, wedding.bride_name)
  const groomAr = getArabicName(wedding.groom_name_ar, wedding.groom_name)
  const dateAr = formatDateArabic(eventDate)
  const timeAr = formatTimeArabic(eventDate)
  const dateFr = eventDate.toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Étoiles aléatoires pour le fond
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.6 + 0.3,
  }))

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>

      {/* Ciel étoilé en fond fixe */}
      <div className="aq-sky">
        {stars.map(s => (
          <div
            key={s.id}
            className="aq-star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* ENVELOPPE */}
      {!opened && (
        <div className="aq-env-screen">
          <div className="aq-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="aq-env-svg" fill="none">
              <defs>
                <linearGradient id="aq-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A5F"/>
                  <stop offset="100%" stopColor="#0F1B2D"/>
                </linearGradient>
                <radialGradient id="aq-moon-grad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#F4E5B0"/>
                  <stop offset="100%" stopColor="#D4AF37"/>
                </radialGradient>
              </defs>
              <rect x="10" y="40" width="260" height="150" rx="2" fill="url(#aq-grad)" stroke="#D4AF37" strokeWidth="1"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#152843" stroke="#D4AF37" strokeWidth="0.8"/>
              <path d="M10 40 L140 110 L10 190Z" fill="#1A2F4D" stroke="#D4AF37" strokeWidth="0.6"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#1A2F4D" stroke="#D4AF37" strokeWidth="0.6"/>
              <path d="M10 40 L140 115 L270 40Z" fill="url(#aq-grad)" stroke="#D4AF37" strokeWidth="1"/>
              {/* Croissant lunaire */}
              <g transform="translate(140 105)">
                <circle r="22" fill="url(#aq-moon-grad)"/>
                <circle r="22" cx="6" cy="-3" fill="url(#aq-grad)"/>
              </g>
              {/* Petites étoiles autour */}
              <g fill="#D4AF37">
                <circle cx="100" cy="80" r="0.8"/>
                <circle cx="185" cy="90" r="1"/>
                <circle cx="105" cy="130" r="0.7"/>
                <circle cx="175" cy="125" r="0.9"/>
              </g>
            </svg>
          </div>
          <p className="aq-env-hint">المسي لفتح الدعوة تحت ضوء القمر</p>
        </div>
      )}

      {/* INVITATION */}
      <div className={`aq-invitation${visible ? ' aq-visible' : ''}`} dir="rtl">

        {/* HERO */}
        <section className="aq-hero">
          {/* Croissant lunaire en haut */}
          <div className="aq-moon-orn">
            <svg viewBox="0 0 100 100">
              <defs>
                <radialGradient id="aq-moon-big" cx="40%" cy="40%">
                  <stop offset="0%" stopColor="#F4E5B0"/>
                  <stop offset="60%" stopColor="#D4AF37"/>
                  <stop offset="100%" stopColor="#A0822A"/>
                </radialGradient>
                <filter id="aq-glow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#aq-glow)">
                <circle cx="50" cy="50" r="38" fill="url(#aq-moon-big)"/>
                <circle cx="58" cy="42" r="38" fill="#0F1B2D"/>
              </g>
              {/* Petites étoiles décoratives */}
              <g fill="#D4AF37" opacity="0.8">
                <path d="M20 25 L21 27 L23 28 L21 29 L20 31 L19 29 L17 28 L19 27 Z"/>
                <path d="M85 70 L86 72 L88 73 L86 74 L85 76 L84 74 L82 73 L84 72 Z"/>
                <circle cx="15" cy="60" r="0.8"/>
                <circle cx="90" cy="40" r="1"/>
                <circle cx="80" cy="20" r="0.7"/>
              </g>
            </svg>
          </div>

          <p className="aq-pre">في ليلة مقمرة استثنائية</p>

          <h1 className="aq-names">
            <span className="aq-name">{brideAr}</span>
            <span className="aq-and">و</span>
            <span className="aq-name">{groomAr}</span>
          </h1>

          {(wedding.bride_name_ar || wedding.groom_name_ar) && (
            <p className="aq-names-fr">{wedding.bride_name} & {wedding.groom_name}</p>
          )}

          <div className="aq-divider">
            <span></span>
            <i>☾</i>
            <span></span>
          </div>

          <p className="aq-invite">يتشرفان بدعوتكم لمشاركتهما فرحة زفافهما</p>

          {wedding.custom_message && (
            <p className="aq-custom">« {wedding.custom_message} »</p>
          )}

          {/* Date stylée nuit */}
          <div className="aq-date">
            <div className="aq-date-corner aq-tl"></div>
            <div className="aq-date-corner aq-tr"></div>
            <div className="aq-date-corner aq-bl"></div>
            <div className="aq-date-corner aq-br"></div>

            <div className="aq-date-num">{toArabicNumerals(eventDate.getDate())}</div>
            <div className="aq-date-info">
              <div className="aq-date-month">{formatMonthArabic(eventDate)}</div>
              <div className="aq-date-line"></div>
              <div className="aq-date-year">{toArabicNumerals(eventDate.getFullYear())}</div>
            </div>
            <div className="aq-date-time">
              <span className="aq-time-icon">☾</span>
              <span>{timeAr}</span>
            </div>
          </div>
        </section>

        {/* COMPTE À REBOURS */}
        <section className="aq-section">
          <div className="aq-sep">
            <span></span><i>☾</i><span></span>
          </div>
          <p className="aq-label">العد التنازلي</p>
          <h2 className="aq-title">تقترب الليلة المنشودة</h2>
          <div className="aq-countdown">
            {[
              { val: countdown.d, label: 'يوم' },
              { val: countdown.h, label: 'ساعة' },
              { val: countdown.m, label: 'دقيقة' },
              { val: countdown.s, label: 'ثانية' },
            ].map((item, i) => (
              <div key={i} className="aq-cd">
                <div className="aq-cd-num">{toArabicNumerals(item.val)}</div>
                <div className="aq-cd-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="aq-section">
            <div className="aq-sep">
              <span></span><i>☾</i><span></span>
            </div>
            <p className="aq-label">برنامج الحفل</p>
            <h2 className="aq-title">سير الأمسية</h2>
            <div className="aq-program">
              {(wedding.program as ProgramItem[]).map((item, i) => (
                <div key={i} className="aq-prog-item">
                  <div className="aq-prog-time">{toArabicNumerals(item.time)}</div>
                  <div className="aq-prog-moon">☾</div>
                  <div className="aq-prog-content">
                    <div className="aq-prog-event">{item.event}</div>
                    {item.venue && <div className="aq-prog-venue">{item.venue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIEU */}
        <section className="aq-section">
          <div className="aq-sep">
            <span></span><i>☾</i><span></span>
          </div>
          <p className="aq-label">مكان الحفل</p>
          <h2 className="aq-title">{wedding.venue_name}</h2>
          {wedding.venue_address && <p className="aq-body">{wedding.venue_address}</p>}
          <div className="aq-btn-row" dir="ltr">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="aq-btn-map">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="aq-btn-map aq-btn-outline">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        {wedding.show_rsvp && (
        <section className="aq-rsvp">
          <div className="aq-sep">
            <span></span><i>☾</i><span></span>
          </div>
          <p className="aq-label">تأكيد الحضور</p>
          <h2 className="aq-title">شرفونا بحضوركم تحت ضوء القمر</h2>
          <p className="aq-rsvp-fr">Confirmez votre présence</p>
          {rsvpStatus === 'done' ? (
            <p className="aq-success">شكراً جزيلاً • Merci ☾</p>
          ) : (
            <form className="aq-form" onSubmit={submitRSVP} dir="ltr">
              <input className="aq-input" name="name" placeholder="Prénom et nom" required />
              <input className="aq-input" name="phone" placeholder="Numéro WhatsApp" />
              <div className="aq-radios">
                {(['present', 'absent', 'maybe'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`aq-radio${rsvpChoice === s ? ' aq-radio-on' : ''}`}
                    onClick={() => setRsvpChoice(s)}
                  >
                    {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                  </button>
                ))}
              </div>
              <input className="aq-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
              <textarea className="aq-input aq-textarea" name="note" placeholder="Message (optionnel)" />
              <button className="aq-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer ☾'}
              </button>
            </form>
          )}
        </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="aq-section">
            <div className="aq-sep">
              <span></span><i>☾</i><span></span>
            </div>
            <p className="aq-label">دفتر التهاني</p>
            <h2 className="aq-title">رسائل من القلب</h2>
            <p className="aq-rsvp-fr">Laissez un message</p>
            {messages.length > 0 && (
              <div className="aq-messages">
                {messages.map(msg => (
                  <div key={msg.id} className="aq-msg">
                    <div className="aq-msg-moon">☾</div>
                    <p className="aq-msg-text">{msg.message}</p>
                    <p className="aq-msg-author">— {msg.author_name}</p>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="aq-success" style={{ marginTop: '20px' }}>
                {gbPending ? 'En attente de validation ☾' : 'Message publié ☾'}
              </p>
            ) : (
              <form className="aq-form" onSubmit={submitMessage} dir="ltr" style={{ marginTop: '24px' }}>
                <input className="aq-input" name="author_name" placeholder="Votre prénom" required />
                <textarea className="aq-input aq-textarea" name="message" placeholder="Vos vœux..." required />
                <button className="aq-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                  Publier ☾
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="aq-footer">
          <div className="aq-moon-small">☾</div>
          <div className="aq-footer-names">{brideAr} و {groomAr}</div>
          <div className="aq-footer-date" dir="rtl">{dateAr}</div>
          <div className="aq-footer-date-fr">{dateFr}</div>
          <div className="aq-footer-credit">Élégance Digitale™</div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Amiri',Georgia,serif;
    background:#0F1B2D;color:#F4E5B0;overflow-x:hidden;
  }

  /* Ciel étoilé */
  .aq-sky{
    position:fixed;inset:0;z-index:0;pointer-events:none;
    background:
      radial-gradient(ellipse at 20% 30%,rgba(30,58,95,0.5) 0%,transparent 50%),
      radial-gradient(ellipse at 80% 70%,rgba(212,175,55,0.08) 0%,transparent 50%),
      linear-gradient(180deg,#0F1B2D 0%,#152843 50%,#0F1B2D 100%);
  }
  .aq-star{
    position:absolute;background:#F4E5B0;border-radius:50%;
    box-shadow:0 0 4px rgba(244,229,176,0.8);
    animation:aqTwinkle 3s ease-in-out infinite;
  }
  @keyframes aqTwinkle{
    0%,100%{opacity:.3;transform:scale(.8)}
    50%{opacity:1;transform:scale(1.2)}
  }

  /* Enveloppe */
  .aq-env-screen{
    position:fixed;inset:0;z-index:1000;
    background:radial-gradient(ellipse at center,#1E3A5F 0%,#0F1B2D 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
  }
  .aq-env-wrap{
    cursor:pointer;
    filter:drop-shadow(0 16px 50px rgba(212,175,55,0.3));
    transition:transform .3s;
  }
  .aq-env-wrap:hover{transform:translateY(-4px) scale(1.02)}
  .aq-env-svg{width:280px;height:auto}
  .aq-env-hint{
    margin-top:28px;font-family:'Aref Ruqaa',serif;font-size:1.05rem;
    color:#D4AF37;letter-spacing:.05em;
    animation:aqPulse 2.5s ease-in-out infinite;
  }
  @keyframes aqPulse{0%,100%{opacity:.5}50%{opacity:1}}

  /* Invitation */
  .aq-invitation{
    opacity:0;transform:translateY(24px);
    transition:opacity 1s,transform 1s;
    position:relative;z-index:1;
  }
  .aq-invitation.aq-visible{opacity:1;transform:none}

  /* Hero */
  .aq-hero{
    min-height:100vh;padding:60px 24px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;
  }
  .aq-moon-orn{
    width:110px;height:110px;margin-bottom:36px;
    filter:drop-shadow(0 0 20px rgba(212,175,55,0.4));
  }
  .aq-moon-orn svg{width:100%;height:100%}
  .aq-pre{
    font-family:'Reem Kufi',sans-serif;
    font-size:1rem;color:#D4AF37;
    margin-bottom:28px;font-weight:500;letter-spacing:.05em;
  }
  .aq-names{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(2.8rem,9vw,5rem);
    line-height:1.2;font-weight:700;
    display:flex;flex-direction:column;align-items:center;gap:8px;margin:0;
    background:linear-gradient(135deg,#F4E5B0 0%,#D4AF37 50%,#F4E5B0 100%);
    background-clip:text;-webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 2px 8px rgba(212,175,55,0.3));
  }
  .aq-name{display:block}
  .aq-and{
    color:#D4AF37;
    font-size:clamp(2rem,6vw,3.5rem);
    font-weight:400;margin:8px 0;
    -webkit-text-fill-color:#D4AF37;
  }
  .aq-names-fr{
    margin-top:18px;font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:1.05rem;color:rgba(244,229,176,0.6);letter-spacing:.08em;
  }
  .aq-divider{
    display:flex;align-items:center;justify-content:center;
    gap:14px;margin:32px 0;width:100%;max-width:280px;
  }
  .aq-divider span{
    flex:1;height:1px;
    background:linear-gradient(90deg,transparent,#D4AF37,transparent);
  }
  .aq-divider i{
    color:#D4AF37;font-style:normal;font-size:1.4rem;
    text-shadow:0 0 8px rgba(212,175,55,0.5);
  }
  .aq-invite{
    font-family:'Amiri',serif;font-size:1.1rem;
    color:rgba(244,229,176,0.85);line-height:1.8;
    margin-bottom:28px;
  }
  .aq-custom{
    font-family:'Amiri',serif;font-size:1.15rem;font-style:italic;
    color:rgba(244,229,176,0.75);line-height:2;
    max-width:500px;margin-bottom:36px;
  }

  /* Date avec coins */
  .aq-date{
    position:relative;
    display:flex;align-items:center;gap:24px;
    padding:32px 48px;
    background:linear-gradient(135deg,rgba(30,58,95,0.4) 0%,rgba(15,27,45,0.4) 100%);
    backdrop-filter:blur(10px);
    border:1px solid rgba(212,175,55,0.3);
  }
  .aq-date-corner{
    position:absolute;width:18px;height:18px;
    border:1.5px solid #D4AF37;
  }
  .aq-tl{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .aq-tr{top:-1px;right:-1px;border-left:none;border-bottom:none}
  .aq-bl{bottom:-1px;left:-1px;border-right:none;border-top:none}
  .aq-br{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .aq-date-num{
    font-family:'Aref Ruqaa',serif;
    font-size:4rem;font-weight:700;
    background:linear-gradient(135deg,#F4E5B0,#D4AF37);
    background-clip:text;-webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    line-height:1;
  }
  .aq-date-info{display:flex;flex-direction:column;align-items:center;gap:6px}
  .aq-date-month{
    font-family:'Reem Kufi',sans-serif;
    font-size:1rem;color:#F4E5B0;font-weight:600;
  }
  .aq-date-line{width:30px;height:1px;background:#D4AF37}
  .aq-date-year{
    font-family:'Aref Ruqaa',serif;font-size:1.3rem;color:#F4E5B0;
  }
  .aq-date-time{
    display:flex;flex-direction:column;align-items:center;gap:4px;
    border-right:1px solid rgba(212,175,55,0.3);
    padding-right:24px;margin-right:-24px;
    align-self:stretch;justify-content:center;
  }
  .aq-time-icon{color:#D4AF37;font-size:1.2rem}
  .aq-date-time span:last-child{
    font-family:'Aref Ruqaa',serif;font-size:1.4rem;color:#D4AF37;
  }

  /* Sections */
  .aq-section{
    max-width:680px;margin:0 auto;
    padding:48px 24px 24px;text-align:center;
  }
  .aq-sep{
    display:flex;align-items:center;justify-content:center;
    gap:14px;margin:0 auto 32px;max-width:200px;
  }
  .aq-sep span{
    flex:1;height:1px;
    background:linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent);
  }
  .aq-sep i{color:#D4AF37;font-style:normal;font-size:1.2rem}
  .aq-label{
    font-family:'Reem Kufi',sans-serif;
    font-size:.95rem;color:#D4AF37;
    margin-bottom:14px;font-weight:500;letter-spacing:.05em;
  }
  .aq-title{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(1.7rem,4vw,2.3rem);
    color:#F4E5B0;margin-bottom:24px;line-height:1.4;font-weight:700;
  }
  .aq-body{
    font-family:'Amiri',serif;font-size:1.1rem;font-style:italic;
    color:rgba(244,229,176,0.75);line-height:2;margin-bottom:24px;
  }

  /* Countdown */
  .aq-countdown{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;direction:ltr}
  .aq-cd{
    display:flex;flex-direction:column;align-items:center;
    min-width:82px;padding:20px 14px;
    background:linear-gradient(135deg,rgba(30,58,95,0.4) 0%,rgba(15,27,45,0.4) 100%);
    backdrop-filter:blur(10px);
    border:1px solid rgba(212,175,55,0.25);
    position:relative;
  }
  .aq-cd::before,.aq-cd::after{
    content:'';position:absolute;width:10px;height:10px;
    border:1px solid #D4AF37;
  }
  .aq-cd::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .aq-cd::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .aq-cd-num{
    font-family:'Aref Ruqaa',serif;font-size:2.2rem;
    background:linear-gradient(135deg,#F4E5B0,#D4AF37);
    background-clip:text;-webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    line-height:1;font-weight:700;
  }
  .aq-cd-label{
    font-family:'Reem Kufi',sans-serif;
    font-size:.78rem;color:rgba(244,229,176,0.65);margin-top:10px;
  }

  /* Programme */
  .aq-program{
    display:flex;flex-direction:column;gap:0;
    max-width:520px;margin:0 auto;
  }
  .aq-prog-item{
    display:grid;grid-template-columns:1fr 24px 90px;gap:16px;
    align-items:center;padding:18px 0;
    border-bottom:1px solid rgba(212,175,55,0.15);
  }
  .aq-prog-item:last-child{border-bottom:none}
  .aq-prog-time{
    font-family:'Aref Ruqaa',serif;font-size:1.3rem;
    color:#D4AF37;text-align:left;font-weight:700;
  }
  .aq-prog-moon{color:#D4AF37;font-size:1rem;text-align:center}
  .aq-prog-content{text-align:right}
  .aq-prog-event{
    font-family:'Aref Ruqaa',serif;font-size:1.15rem;
    color:#F4E5B0;font-weight:700;
  }
  .aq-prog-venue{
    font-family:'Amiri',serif;font-size:.95rem;font-style:italic;
    color:rgba(244,229,176,0.6);margin-top:4px;
  }

  /* Map */
  .aq-btn-row{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:24px;direction:ltr}
  .aq-btn-map{
    padding:14px 32px;
    background:linear-gradient(135deg,#D4AF37 0%,#B8941F 100%);
    color:#0F1B2D;text-decoration:none;
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;
    font-weight:700;transition:all .3s;
    box-shadow:0 4px 16px rgba(212,175,55,0.2);
  }
  .aq-btn-map:hover{
    transform:translateY(-2px);
    box-shadow:0 8px 24px rgba(212,175,55,0.4);
  }
  .aq-btn-outline{
    background:transparent;color:#D4AF37;
    border:1px solid #D4AF37;box-shadow:none;
  }
  .aq-btn-outline:hover{
    background:rgba(212,175,55,0.1);
  }

  /* RSVP */
  .aq-rsvp{
    padding:60px 24px;text-align:center;
    background:linear-gradient(180deg,rgba(30,58,95,0.4) 0%,rgba(15,27,45,0.6) 100%);
    border-top:1px solid rgba(212,175,55,0.2);
    border-bottom:1px solid rgba(212,175,55,0.2);
  }
  .aq-rsvp-fr{
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    color:rgba(244,229,176,0.5);margin:-12px 0 24px;
  }
  .aq-form{
    max-width:440px;margin:0 auto;
    display:flex;flex-direction:column;gap:14px;text-align:left;direction:ltr;
  }
  .aq-input{
    width:100%;padding:14px 18px;
    background:rgba(15,27,45,0.6);
    border:1px solid rgba(212,175,55,0.3);
    color:#F4E5B0;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .aq-input::placeholder{color:rgba(244,229,176,0.35);font-style:italic}
  .aq-input:focus{border-color:#D4AF37}
  .aq-textarea{resize:vertical;min-height:80px}
  .aq-radios{display:flex;gap:8px}
  .aq-radio{
    flex:1;padding:12px 6px;
    background:rgba(15,27,45,0.6);
    border:1px solid rgba(212,175,55,0.3);
    color:rgba(244,229,176,0.7);
    font-family:'Montserrat',sans-serif;
    font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;
    cursor:pointer;transition:all .2s;font-weight:500;
  }
  .aq-radio-on,.aq-radio:hover{
    background:linear-gradient(135deg,#D4AF37,#B8941F);
    border-color:#D4AF37;color:#0F1B2D;font-weight:700;
  }
  .aq-btn-submit{
    padding:16px;
    background:linear-gradient(135deg,#D4AF37 0%,#B8941F 100%);
    color:#0F1B2D;border:none;
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    font-weight:700;cursor:pointer;transition:all .3s;
    box-shadow:0 4px 16px rgba(212,175,55,0.2);
  }
  .aq-btn-submit:hover{
    transform:translateY(-1px);
    box-shadow:0 8px 24px rgba(212,175,55,0.4);
  }
  .aq-btn-submit:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .aq-success{
    font-family:'Aref Ruqaa',serif;font-size:1.3rem;
    color:#D4AF37;padding:20px;font-weight:700;
  }

  /* Messages */
  .aq-messages{
    display:flex;flex-direction:column;gap:14px;
    max-width:520px;margin:0 auto;
  }
  .aq-msg{
    background:linear-gradient(135deg,rgba(30,58,95,0.4) 0%,rgba(15,27,45,0.4) 100%);
    backdrop-filter:blur(10px);
    border:1px solid rgba(212,175,55,0.2);
    padding:20px 24px;position:relative;
  }
  .aq-msg-moon{
    color:#D4AF37;font-size:1.1rem;margin-bottom:8px;opacity:.8;
  }
  .aq-msg-text{
    font-family:'Amiri',serif;font-size:1rem;font-style:italic;
    color:rgba(244,229,176,0.9);line-height:1.8;
  }
  .aq-msg-author{
    margin-top:10px;
    font-family:'Reem Kufi',sans-serif;font-size:.78rem;
    color:#D4AF37;font-weight:500;letter-spacing:.05em;
  }

  /* Footer */
  .aq-footer{
    padding:48px 24px;text-align:center;
    background:linear-gradient(180deg,transparent 0%,rgba(15,27,45,0.8) 100%);
    border-top:1px solid rgba(212,175,55,0.2);
  }
  .aq-moon-small{
    font-size:2rem;color:#D4AF37;margin-bottom:16px;
    text-shadow:0 0 12px rgba(212,175,55,0.5);
  }
  .aq-footer-names{
    font-family:'Aref Ruqaa',serif;font-size:1.8rem;
    background:linear-gradient(135deg,#F4E5B0,#D4AF37);
    background-clip:text;-webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    margin-bottom:6px;font-weight:700;direction:rtl;
  }
  .aq-footer-date{
    font-family:'Amiri',serif;font-size:1rem;
    color:rgba(244,229,176,0.7);margin-bottom:6px;
  }
  .aq-footer-date-fr{
    font-family:'Cormorant Garamond',serif;font-size:.9rem;font-style:italic;
    color:rgba(244,229,176,0.5);margin-bottom:24px;
  }
  .aq-footer-credit{
    font-family:'Montserrat',sans-serif;
    font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;
    color:#D4AF37;opacity:.6;
  }

  @media(max-width:480px){
    .aq-date{flex-direction:column;gap:16px;padding:24px}
    .aq-date-time{
      border-right:none;border-top:1px solid rgba(212,175,55,0.3);
      padding-right:0;padding-top:16px;margin-right:0;margin-top:8px;
      flex-direction:row;gap:10px;
    }
    .aq-prog-item{grid-template-columns:60px 16px 1fr;gap:10px}
    .aq-prog-time{font-size:1rem;text-align:left}
    .aq-prog-content{text-align:right}
  }
`