'use client'
import { Wedding, ProgramItem  } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import { formatDateArabic, formatTimeArabic, toArabicNumerals, getArabicName, formatMonthArabic } from '@/lib/arabic-utils'
import FontOverride from '@/components/common/fontoverride'

export default function AlAsala({ wedding }: { wedding: Wedding }) {
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

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>
      <FontOverride font={wedding.custom_font} container=".aa-container" />

      {/* Motif zellige en fond */}
      <svg className="aa-zellige" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="aa-zlj" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#C97B5C" strokeWidth="0.3" opacity="0.25"/>
            <path d="M30 10 L50 30 L30 50 L10 30 Z" fill="none" stroke="#5C7A4A" strokeWidth="0.3" opacity="0.25"/>
            <path d="M30 20 L40 30 L30 40 L20 30 Z" fill="#C97B5C" opacity="0.08"/>
            <circle cx="30" cy="30" r="2" fill="#5C7A4A" opacity="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aa-zlj)"/>
      </svg>

      {/* ENVELOPPE */}
      {!opened && (
        <div className="aa-env-screen">
          <div className="aa-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="aa-env-svg" fill="none">
              <rect x="10" y="40" width="260" height="150" rx="0" fill="#FAF3E8" stroke="#5C7A4A" strokeWidth="1.5"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#F0E5D2" stroke="#5C7A4A" strokeWidth="1"/>
              <path d="M10 40 L140 110 L10 190Z" fill="#F5EAD9" stroke="#5C7A4A" strokeWidth="0.8"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#F5EAD9" stroke="#5C7A4A" strokeWidth="0.8"/>
              <path d="M10 40 L140 115 L270 40Z" fill="#FAF3E8" stroke="#5C7A4A" strokeWidth="1.5"/>
              {/* Zellige central */}
              <g transform="translate(140 105)">
                <rect x="-20" y="-20" width="40" height="40" fill="#5C7A4A" transform="rotate(45)"/>
                <rect x="-14" y="-14" width="28" height="28" fill="#C97B5C" transform="rotate(45)"/>
                <rect x="-8" y="-8" width="16" height="16" fill="#FAF3E8"/>
                <text textAnchor="middle" y="3" fontFamily="Aref Ruqaa,serif" fontSize="10" fill="#3D2817" fontWeight="700">
                  {wedding.bride_name[0]}{wedding.groom_name[0]}
                </text>
              </g>
            </svg>
          </div>
          <p className="aa-env-hint">المسي لفتح الدعوة</p>
        </div>
      )}

      {/* INVITATION */}
      <div className={`aa-invitation${visible ? ' aa-visible' : ''}`} dir="rtl">

        {/* HERO */}
        <section className="aa-hero">
          {/* Ornement zellige supérieur */}
          <div className="aa-zlj-orn">
            <svg viewBox="0 0 80 40">
              <g fill="none" stroke="#C97B5C" strokeWidth="0.8">
                <rect x="36" y="10" width="8" height="8" transform="rotate(45 40 14)"/>
                <rect x="32" y="6" width="16" height="16" transform="rotate(45 40 14)"/>
              </g>
              <line x1="0" y1="20" x2="28" y2="20" stroke="#5C7A4A" strokeWidth="0.6"/>
              <line x1="52" y1="20" x2="80" y2="20" stroke="#5C7A4A" strokeWidth="0.6"/>
              <circle cx="40" cy="20" r="2" fill="#C97B5C"/>
            </svg>
          </div>

          <p className="aa-pre">يتشرف الأهل بدعوتكم إلى حفل زفاف</p>

          <h1 className="aa-names">
            <span className="aa-name">{brideAr}</span>
            <span className="aa-and">و</span>
            <span className="aa-name">{groomAr}</span>
          </h1>
          <div className="aa-divider">
            <span></span>
            <i>◆</i>
            <span></span>
          </div>

          {wedding.custom_message && (
            <p className="aa-custom">{wedding.custom_message}</p>
          )}

          <div className="aa-date">
            <div className="aa-date-num">{toArabicNumerals(eventDate.getDate())}</div>
            <div className="aa-date-info">
              <div className="aa-date-month">{formatMonthArabic(eventDate)}</div>
              <div className="aa-date-line"></div>
              <div className="aa-date-year">{toArabicNumerals(eventDate.getFullYear())}</div>
            </div>
          </div>
          <p className="aa-time">۞ {timeAr} ۞</p>
        </section>

        {/* COMPTE À REBOURS */}
        <section className="aa-section">
          <div className="aa-zlj-sep">
            <svg viewBox="0 0 200 20">
              <line x1="0" y1="10" x2="80" y2="10" stroke="#5C7A4A" strokeWidth="0.6"/>
              <g transform="translate(100 10)">
                <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#C97B5C" strokeWidth="0.8" transform="rotate(45)"/>
                <rect x="-3" y="-3" width="6" height="6" fill="#C97B5C" transform="rotate(45)"/>
              </g>
              <line x1="120" y1="10" x2="200" y2="10" stroke="#5C7A4A" strokeWidth="0.6"/>
            </svg>
          </div>

          <p className="aa-label">العد التنازلي</p>
          <h2 className="aa-title">يقترب اليوم</h2>
          <div className="aa-countdown">
            {[
              { val: countdown.d, label: 'يوم' },
              { val: countdown.h, label: 'ساعة' },
              { val: countdown.m, label: 'دقيقة' },
              { val: countdown.s, label: 'ثانية' },
            ].map((item, i) => (
              <div key={i} className="aa-cd">
                <div className="aa-cd-num">{toArabicNumerals(item.val)}</div>
                <div className="aa-cd-label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="aa-section">
            <div className="aa-zlj-sep">
              <svg viewBox="0 0 200 20">
                <line x1="0" y1="10" x2="80" y2="10" stroke="#5C7A4A" strokeWidth="0.6"/>
                <g transform="translate(100 10)">
                  <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#C97B5C" strokeWidth="0.8" transform="rotate(45)"/>
                  <rect x="-3" y="-3" width="6" height="6" fill="#C97B5C" transform="rotate(45)"/>
                </g>
                <line x1="120" y1="10" x2="200" y2="10" stroke="#5C7A4A" strokeWidth="0.6"/>
              </svg>
            </div>
            <p className="aa-label">برنامج الحفل</p>
            <h2 className="aa-title">ترتيب الأحداث</h2>
            <div className="aa-program">
              {(wedding.program as ProgramItem []).map((item, i) => (
                <div key={i} className="aa-prog-item">
                  <div className="aa-prog-time">{toArabicNumerals(item.time)}</div>
                  <div className="aa-prog-diamond">◆</div>
                  <div className="aa-prog-content">
                    <div className="aa-prog-event">{item.event}</div>
                    {item.venue && <div className="aa-prog-venue">{item.venue}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIEU */}
        <section className="aa-section">
          <div className="aa-zlj-sep">
            <svg viewBox="0 0 200 20">
              <line x1="0" y1="10" x2="80" y2="10" stroke="#5C7A4A" strokeWidth="0.6"/>
              <g transform="translate(100 10)">
                <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#C97B5C" strokeWidth="0.8" transform="rotate(45)"/>
                <rect x="-3" y="-3" width="6" height="6" fill="#C97B5C" transform="rotate(45)"/>
              </g>
              <line x1="120" y1="10" x2="200" y2="10" stroke="#5C7A4A" strokeWidth="0.6"/>
            </svg>
          </div>
          <p className="aa-label">مكان الحفل</p>
          <h2 className="aa-title">{wedding.venue_name}</h2>
          {wedding.venue_address && <p className="aa-body">{wedding.venue_address}</p>}
          <div className="aa-btn-row" dir="ltr">
            {wedding.gps_google && (
              <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="aa-btn-map">
                Google Maps
              </a>
            )}
            {wedding.gps_apple && (
              <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="aa-btn-map aa-btn-alt">
                Apple Maps
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        {wedding.show_rsvp && (
        <section className="aa-rsvp">
          <p className="aa-label" style={{ color: '#F0E5D2' }}>تأكيد الحضور</p>
          <h2 className="aa-title" style={{ color: '#FAF3E8' }}>شرفونا بحضوركم</h2>
          <p className="aa-rsvp-fr">Confirmez votre présence</p>
          {rsvpStatus === 'done' ? (
            <p className="aa-success">شكراً جزيلاً • Merci ◆</p>
          ) : (
            <form className="aa-form" onSubmit={submitRSVP} dir="ltr">
              <input className="aa-input" name="name" placeholder="Prénom et nom" required />
              <input className="aa-input" name="phone" placeholder="Numéro WhatsApp" />
              <div className="aa-radios">
                {(['present', 'absent', 'maybe'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`aa-radio${rsvpChoice === s ? ' aa-radio-on' : ''}`}
                    onClick={() => setRsvpChoice(s)}
                  >
                    {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                  </button>
                ))}
              </div>
              <input className="aa-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
              <textarea className="aa-input aa-textarea" name="note" placeholder="Message (optionnel)" />
              <button className="aa-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer ◆'}
              </button>
            </form>
          )}
        </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="aa-section">
            <p className="aa-label">دفتر التهاني</p>
            <h2 className="aa-title">تهانيكم</h2>
            <p className="aa-rsvp-fr-light">Laissez un message</p>
            {messages.length > 0 && (
              <div className="aa-messages">
                {messages.map(msg => (
                  <div key={msg.id} className="aa-msg">
                    <div className="aa-msg-text">{msg.message}</div>
                    <div className="aa-msg-author">— {msg.author_name}</div>
                  </div>
                ))}
              </div>
            )}
            {gbStatus === 'done' ? (
              <p className="aa-success-light">
                {gbPending ? 'En attente de validation ◆' : 'Message publié ◆'}
              </p>
            ) : (
              <form className="aa-form" onSubmit={submitMessage} dir="ltr" style={{ marginTop: '24px' }}>
                <input className="aa-input-light" name="author_name" placeholder="Votre prénom" required />
                <textarea className="aa-input-light aa-textarea" name="message" placeholder="Vos vœux..." required />
                <button className="aa-btn-light" type="submit" disabled={gbStatus === 'loading'}>
                  Publier ◆
                </button>
              </form>
            )}
          </section>
        )}

        {/* FOOTER */}
        <footer className="aa-footer">
          <svg viewBox="0 0 60 30" style={{ width: '80px', margin: '0 auto 16px' }}>
            <g transform="translate(30 15)">
              <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#C97B5C" strokeWidth="0.8" transform="rotate(45)"/>
              <rect x="-4" y="-4" width="8" height="8" fill="#C97B5C" transform="rotate(45)"/>
            </g>
          </svg>
          <div className="aa-footer-names">{brideAr} و {groomAr}</div>
          <div className="aa-footer-date" dir="rtl">{dateAr}</div>
          <div className="aa-footer-date-fr">{dateFr}</div>
          <div className="aa-footer-credit">Élégance Digitale™</div>
        </footer>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Amiri',Georgia,serif;
    background:#FAF3E8;color:#3D2817;overflow-x:hidden;
  }
  .aa-zellige{
    position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.6;
  }

  /* Enveloppe */
  .aa-env-screen{
    position:fixed;inset:0;z-index:1000;
    background:linear-gradient(135deg,#FAF3E8 0%,#F0E5D2 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
  }
  .aa-env-wrap{
    cursor:pointer;
    filter:drop-shadow(0 16px 40px rgba(92,122,74,0.2));
    transition:transform .3s;
  }
  .aa-env-wrap:hover{transform:translateY(-4px) scale(1.02)}
  .aa-env-svg{width:280px;height:auto}
  .aa-env-hint{
    margin-top:24px;font-family:'Aref Ruqaa',serif;font-size:1.05rem;
    color:#5C7A4A;letter-spacing:.05em;
    animation:aaPulse 2.5s ease-in-out infinite;
  }
  @keyframes aaPulse{0%,100%{opacity:.5}50%{opacity:1}}

  /* Invitation */
  .aa-invitation{
    opacity:0;transform:translateY(24px);
    transition:opacity 1s,transform 1s;
    position:relative;z-index:1;
  }
  .aa-invitation.aa-visible{opacity:1;transform:none}

  /* Hero */
  .aa-hero{
    min-height:100vh;padding:60px 24px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;
    background:linear-gradient(180deg,rgba(250,243,232,0.85) 0%,rgba(240,229,210,0.85) 100%);
  }
  .aa-zlj-orn{width:160px;height:40px;margin-bottom:36px}
  .aa-zlj-orn svg{width:100%;height:100%}
  .aa-pre{
    font-family:'Reem Kufi',sans-serif;
    font-size:1rem;color:#5C7A4A;
    margin-bottom:28px;font-weight:500;
  }
  .aa-names{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(2.8rem,9vw,5rem);
    color:#3D2817;line-height:1.2;font-weight:700;
    display:flex;flex-direction:column;align-items:center;gap:8px;margin:0;
  }
  .aa-name{display:block}
  .aa-and{
    color:#C97B5C;
    font-size:clamp(2rem,6vw,3.5rem);
    font-weight:400;margin:8px 0;
  }
  .aa-names-fr{
    margin-top:20px;font-family:Georgia,serif;font-style:italic;
    font-size:1rem;color:#7A6549;letter-spacing:.05em;
  }
  .aa-divider{
    display:flex;align-items:center;justify-content:center;
    gap:14px;margin:32px 0;width:100%;max-width:280px;
  }
  .aa-divider span{
    flex:1;height:1px;
    background:linear-gradient(90deg,transparent,#C97B5C,transparent);
  }
  .aa-divider i{color:#C97B5C;font-style:normal;font-size:.8rem}
  .aa-custom{
    font-family:'Amiri',serif;font-size:1.1rem;font-style:italic;
    color:#5C4A33;line-height:2;max-width:480px;margin-bottom:36px;
  }
  .aa-date{
    display:flex;align-items:center;gap:24px;
    padding:24px 36px;
    background:rgba(255,255,255,0.5);backdrop-filter:blur(6px);
    border:2px solid #5C7A4A;position:relative;
  }
  .aa-date::before{
    content:'';position:absolute;inset:4px;
    border:1px solid rgba(201,123,92,0.4);pointer-events:none;
  }
  .aa-date-num{
    font-family:'Aref Ruqaa',serif;font-size:4rem;font-weight:700;
    color:#C97B5C;line-height:1;
  }
  .aa-date-info{display:flex;flex-direction:column;align-items:center;gap:6px}
  .aa-date-month{
    font-family:'Reem Kufi',sans-serif;font-size:1rem;
    color:#3D2817;font-weight:600;
  }
  .aa-date-line{width:32px;height:1px;background:#C97B5C}
  .aa-date-year{
    font-family:'Aref Ruqaa',serif;font-size:1.2rem;color:#3D2817;
  }
  .aa-time{
    margin-top:18px;font-family:'Aref Ruqaa',serif;
    font-size:1.3rem;color:#5C7A4A;letter-spacing:.1em;
  }

  /* Sections */
  .aa-section{
    max-width:680px;margin:0 auto;
    padding:48px 24px 24px;text-align:center;
  }
  .aa-zlj-sep{
    width:200px;margin:0 auto 32px;height:20px;
  }
  .aa-zlj-sep svg{width:100%;height:100%}
  .aa-label{
    font-family:'Reem Kufi',sans-serif;
    font-size:.9rem;color:#C97B5C;
    margin-bottom:14px;font-weight:500;letter-spacing:.05em;
  }
  .aa-title{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(1.7rem,4vw,2.2rem);
    color:#3D2817;margin-bottom:24px;line-height:1.4;font-weight:700;
  }
  .aa-body{
    font-family:'Amiri',serif;font-size:1.1rem;font-style:italic;
    color:#5C4A33;line-height:1.9;margin-bottom:24px;
  }

  /* Countdown */
  .aa-countdown{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;direction:ltr}
  .aa-cd{
    display:flex;flex-direction:column;align-items:center;
    min-width:78px;padding:18px 14px;
    background:rgba(255,255,255,0.6);
    border:1px solid rgba(92,122,74,0.3);
  }
  .aa-cd-num{
    font-family:'Aref Ruqaa',serif;font-size:2.2rem;
    color:#C97B5C;line-height:1;font-weight:700;
  }
  .aa-cd-label{
    font-family:'Reem Kufi',sans-serif;
    font-size:.78rem;color:#5C7A4A;margin-top:10px;
  }

  /* Programme */
  .aa-program{
    display:flex;flex-direction:column;gap:0;
    max-width:520px;margin:0 auto;
  }
  .aa-prog-item{
    display:grid;grid-template-columns:1fr 24px 90px;gap:16px;
    align-items:center;padding:18px 0;
    border-bottom:1px dashed rgba(201,123,92,0.4);
  }
  .aa-prog-item:last-child{border-bottom:none}
  .aa-prog-time{
    font-family:'Aref Ruqaa',serif;font-size:1.25rem;
    color:#C97B5C;text-align:left;font-weight:700;
  }
  .aa-prog-diamond{color:#5C7A4A;font-size:.8rem;text-align:center}
  .aa-prog-content{text-align:right}
  .aa-prog-event{
    font-family:'Aref Ruqaa',serif;font-size:1.15rem;
    color:#3D2817;font-weight:700;
  }
  .aa-prog-venue{
    font-family:'Amiri',serif;font-size:.95rem;font-style:italic;
    color:#5C4A33;margin-top:4px;
  }

  /* Map */
  .aa-btn-row{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:24px;direction:ltr}
  .aa-btn-map{
    padding:14px 32px;
    background:#5C7A4A;color:#FAF3E8;text-decoration:none;
    font-family:'Montserrat',sans-serif;
    font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;
    font-weight:600;transition:all .3s;
  }
  .aa-btn-map:hover{background:#4A6638;transform:translateY(-2px)}
  .aa-btn-alt{background:#C97B5C}
  .aa-btn-alt:hover{background:#B86B4C}

  /* RSVP */
  .aa-rsvp{
    background:linear-gradient(135deg,#5C7A4A 0%,#4A6638 100%);
    padding:60px 24px;text-align:center;position:relative;
  }
  .aa-rsvp-fr{
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    color:rgba(250,243,232,0.7);margin:-12px 0 24px;
  }
  .aa-rsvp-fr-light{
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    color:#7A6549;margin:-12px 0 24px;
  }
  .aa-form{
    max-width:440px;margin:0 auto;
    display:flex;flex-direction:column;gap:14px;text-align:left;direction:ltr;
  }
  .aa-input{
    width:100%;padding:14px 18px;
    background:rgba(250,243,232,0.06);
    border:1px solid rgba(201,123,92,0.5);
    color:#FAF3E8;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .aa-input::placeholder{color:rgba(250,243,232,0.4);font-style:italic}
  .aa-input:focus{border-color:#C97B5C}
  .aa-textarea{resize:vertical;min-height:80px}
  .aa-radios{display:flex;gap:8px}
  .aa-radio{
    flex:1;padding:12px 6px;
    background:transparent;
    border:1px solid rgba(201,123,92,0.5);
    color:rgba(250,243,232,0.8);
    font-family:'Montserrat',sans-serif;
    font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;
    cursor:pointer;transition:all .2s;font-weight:500;
  }
  .aa-radio-on,.aa-radio:hover{
    background:#C97B5C;border-color:#C97B5C;color:#FAF3E8;font-weight:600;
  }
  .aa-btn-submit{
    padding:16px;background:#C97B5C;color:#FAF3E8;
    border:none;font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    font-weight:600;cursor:pointer;transition:opacity .3s;
  }
  .aa-btn-submit:hover{opacity:.88}
  .aa-success{
    font-family:'Aref Ruqaa',serif;font-size:1.3rem;
    color:#C97B5C;padding:20px;font-weight:700;
  }
  .aa-success-light{
    font-family:'Aref Ruqaa',serif;font-size:1.1rem;
    color:#5C7A4A;padding:16px;text-align:center;font-weight:700;
  }

  /* Messages */
  .aa-messages{
    display:flex;flex-direction:column;gap:14px;
    max-width:480px;margin:0 auto;
  }
  .aa-msg{
    background:rgba(255,255,255,0.6);
    border-right:3px solid #C97B5C;
    padding:18px 22px;
  }
  .aa-msg-text{
    font-family:'Amiri',serif;font-size:1rem;font-style:italic;
    color:#3D2817;line-height:1.7;
  }
  .aa-msg-author{
    margin-top:8px;
    font-family:'Reem Kufi',sans-serif;font-size:.75rem;
    color:#5C7A4A;font-weight:500;
  }
  .aa-input-light{
    width:100%;padding:13px 16px;
    background:#FFFFFF;
    border:1px solid rgba(92,122,74,0.3);
    color:#3D2817;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .aa-input-light:focus{border-color:#5C7A4A}
  .aa-btn-light{
    padding:13px 28px;background:transparent;
    border:1px solid #5C7A4A;color:#5C7A4A;
    font-family:'Montserrat',sans-serif;
    font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;
    cursor:pointer;transition:all .3s;align-self:flex-end;font-weight:600;
  }
  .aa-btn-light:hover{background:#5C7A4A;color:#FAF3E8}

  /* Footer */
  .aa-footer{
    padding:48px 24px;text-align:center;
    background:rgba(240,229,210,0.6);
    border-top:1px solid rgba(92,122,74,0.3);
  }
  .aa-footer-names{
    font-family:'Aref Ruqaa',serif;font-size:1.8rem;
    color:#3D2817;margin-bottom:6px;font-weight:700;direction:rtl;
  }
  .aa-footer-date{
    font-family:'Amiri',serif;font-size:1rem;
    color:#5C4A33;margin-bottom:6px;
  }
  .aa-footer-date-fr{
    font-family:Georgia,serif;font-size:.85rem;font-style:italic;
    color:#7A6549;margin-bottom:24px;
  }
  .aa-footer-credit{
    font-family:'Montserrat',sans-serif;
    font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;
    color:#C97B5C;opacity:.7;
  }

  @media(max-width:480px){
    .aa-date{flex-direction:column;gap:12px;padding:20px 28px}
    .aa-prog-item{grid-template-columns:60px 16px 1fr;gap:10px}
    .aa-prog-time{font-size:1rem;text-align:left}
    .aa-prog-content{text-align:right}
  }
`