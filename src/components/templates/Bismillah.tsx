'use client'
import { Wedding, ProgramItem  } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import { formatDateArabic, formatTimeArabic, toArabicNumerals, getArabicName, formatMonthArabic } from '@/lib/arabic-utils'
import FontOverride from '@/components/common/fontoverride'
import { getBgCSSForKey } from '@/lib/bg-texture-system'
export default function Bismillah({ wedding }: { wedding: Wedding }) {
  const {
    opened, visible, openEnvelope, countdown,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    eventDate, introText,
  } = useInvitationLogic(wedding)

  const brideAr = getArabicName(wedding.bride_name_ar, wedding.bride_name)
  const groomAr = getArabicName(wedding.groom_name_ar, wedding.groom_name)
  const dateAr = formatDateArabic(eventDate)
  const timeAr = formatTimeArabic(eventDate)
  const dateFr = eventDate.toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Background dynamique : lit bg-config.json via bg-texture-system.ts
  const bgKey = (wedding.background_image ?? 'bg-texture.jpg') as string

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>
      {/* CSS dynamique : zone vide + texture calculés depuis bg-config.json */}
      <style>{getBgCSSForKey(bgKey, 'bs')}</style>
      <FontOverride font={wedding.custom_font} container=".bs-container" />

      {/* ENVELOPPE */}
      {!opened && (
        <div className="bs-env-screen">
          <div className="bs-env-wrap" onClick={openEnvelope}>
            <svg viewBox="0 0 280 200" className="bs-env-svg" fill="none">
              <rect x="10" y="40" width="260" height="150" rx="2" fill="#FFFFFF" stroke="#C9A84C" strokeWidth="1.5"/>
              <path d="M10 190 L140 110 L270 190Z" fill="#FAF7F0" stroke="#C9A84C" strokeWidth="1"/>
              <path d="M10 40 L140 110 L10 190Z" fill="#FCFAF5" stroke="#C9A84C" strokeWidth="0.7"/>
              <path d="M270 40 L140 110 L270 190Z" fill="#FCFAF5" stroke="#C9A84C" strokeWidth="0.7"/>
              <path d="M10 40 L140 115 L270 40Z" fill="#FFFFFF" stroke="#C9A84C" strokeWidth="1.5"/>
              <g transform="translate(140 105)">
                <circle r="24" fill="#C9A84C"/>
                <g fill="#FFFFFF">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                    <path
                      key={angle}
                      d="M0 -14 L3 -3 L0 0 L-3 -3 Z"
                      transform={`rotate(${angle})`}
                    />
                  ))}
                  <circle r="3" fill="#FFFFFF"/>
                </g>
              </g>
            </svg>
          </div>
          <p className="bs-env-hint">اضغط لفتح الدعوة</p>
        </div>
      )}

      {/* INVITATION */}
      <div className={`bs-invitation${visible ? ' bs-visible' : ''}`} dir="rtl">

        {/* UN SEUL fond texturé — toutes les sections sont des enfants */}
        <div className="bs-texture-bg">

        {/* HERO - BISMILLAH */}
        <section className="bs-hero">
          <div className="bs-content-zone">
            <div className="bs-orn">
              <svg viewBox="0 0 60 60">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                  <path
                    key={angle}
                    d="M30 8 L34 26 L52 30 L34 34 L30 52 L26 34 L8 30 L26 26 Z"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="0.5"
                    opacity="0.4"
                    transform={`rotate(${angle} 30 30)`}
                  />
                ))}
                <circle cx="30" cy="30" r="3" fill="#C9A84C"/>
              </svg>
            </div>

            <div className="bs-bismillah">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>

            <div className="bs-verse-wrap">
              <p className="bs-verse">
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
              </p>
              <p className="bs-verse-ref">﴿ سورة الروم - الآية ٢١ ﴾</p>
            </div>

            <div className="bs-divider">
              <span></span>
              <i>۞</i>
              <span></span>
            </div>

            <p className="bs-intro">يتشرفان بدعوتكم لحضور حفل زفافهما</p>

            <h1 className="bs-names">
              <span className="bs-name">{brideAr}</span>
              <span className="bs-and">و</span>
              <span className="bs-name">{groomAr}</span>
            </h1>

            {wedding.custom_message && (
              <p className="bs-custom">{wedding.custom_message}</p>
            )}

            <div className="bs-date-wrap">
              <div className="bs-date-corner bs-tl"></div>
              <div className="bs-date-corner bs-tr"></div>
              <div className="bs-date-corner bs-bl"></div>
              <div className="bs-date-corner bs-br"></div>
              <div className="bs-date-num">{toArabicNumerals(eventDate.getDate())}</div>
              <div className="bs-date-info">
                <div className="bs-date-month">{formatMonthArabic(eventDate)}</div>
                <div className="bs-date-line"></div>
                <div className="bs-date-year">{toArabicNumerals(eventDate.getFullYear())}</div>
              </div>
              <div className="bs-date-time">{timeAr}</div>
            </div>

            <p className="bs-hadith">
              « بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ »
            </p>
          </div>
        </section>

        {/* COMPTE À REBOURS */}
        <section className="bs-section">
          <div className="bs-content-zone">
            <p className="bs-label">العد التنازلي</p>
            <h2 className="bs-title">يقترب اليوم الموعود</h2>
            <div className="bs-countdown">
              {[
                { val: countdown.d, label: 'يوم' },
                { val: countdown.h, label: 'ساعة' },
                { val: countdown.m, label: 'دقيقة' },
                { val: countdown.s, label: 'ثانية' },
              ].map((item, i) => (
                <div key={i} className="bs-cd">
                  <div className="bs-cd-num">{toArabicNumerals(item.val)}</div>
                  <div className="bs-cd-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAMME */}
        {wedding.program?.length > 0 && (
          <section className="bs-section">
            <div className="bs-content-zone">
              <p className="bs-label">برنامج الحفل</p>
              <h2 className="bs-title">ترتيب الأحداث</h2>
              <div className="bs-program">
                {(wedding.program as ProgramItem[]).map((item, i) => (
                  <div key={i} className="bs-prog-item">
                    <div className="bs-prog-time">{toArabicNumerals(item.time)}</div>
                    <div className="bs-prog-star">۞</div>
                    <div className="bs-prog-content">
                      <div className="bs-prog-event">{item.event}</div>
                      {item.venue && <div className="bs-prog-venue">{item.venue}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LIEU */}
        <section className="bs-section">
          <div className="bs-content-zone">
            <p className="bs-label">مكان الحفل</p>
            <h2 className="bs-title">{wedding.venue_name}</h2>
            {wedding.venue_address && <p className="bs-body">{wedding.venue_address}</p>}
            <div className="bs-btn-row" dir="ltr">
              {wedding.gps_google && (
                <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="bs-btn-map">
                  Google Maps
                </a>
              )}
              {wedding.gps_apple && (
                <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="bs-btn-map bs-btn-outline">
                  Apple Maps
                </a>
              )}
            </div>
          </div>
        </section>

        {/* RSVP */}
        {wedding.show_rsvp && (
          <section className="bs-rsvp">
            <div className="bs-content-zone">
              <p className="bs-label">تأكيد الحضور</p>
              <h2 className="bs-title">هل ستشرفوننا بحضوركم؟</h2>
              <p className="bs-rsvp-fr">Merci de confirmer votre présence</p>
              {rsvpStatus === 'done' ? (
                <p className="bs-success">جزاكم الله خيراً • Merci pour votre réponse ۞</p>
              ) : (
                <form className="bs-form" onSubmit={submitRSVP} dir="ltr">
                  <input className="bs-input" name="name" placeholder="Prénom et nom" required />
                  <input className="bs-input" name="phone" placeholder="Numéro WhatsApp" />
                  <div className="bs-radios">
                    {(['present', 'absent', 'maybe'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        className={`bs-radio${rsvpChoice === s ? ' bs-radio-on' : ''}`}
                        onClick={() => setRsvpChoice(s)}
                      >
                        {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                      </button>
                    ))}
                  </div>
                  <input className="bs-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
                  <textarea className="bs-input bs-textarea" name="note" placeholder="Message (optionnel)" />
                  <button className="bs-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                    {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer ۞'}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* LIVRE D'OR */}
        {wedding.show_guestbook && (
          <section className="bs-section">
            <div className="bs-content-zone">
              <p className="bs-label">دفتر التهاني</p>
              <h2 className="bs-title">تهانيكم ودعواتكم</h2>
              <p className="bs-rsvp-fr">Laissez un message de vœux</p>
              {messages.length > 0 && (
                <div className="bs-messages">
                  {messages.map(msg => (
                    <div key={msg.id} className="bs-msg">
                      <div className="bs-msg-orn">۞</div>
                      <p className="bs-msg-text">{msg.message}</p>
                      <p className="bs-msg-author">— {msg.author_name}</p>
                    </div>
                  ))}
                </div>
              )}
              {gbStatus === 'done' ? (
                <p className="bs-success" style={{ marginTop: '20px' }}>
                  {gbPending ? 'En attente de validation ۞' : 'Message publié ۞'}
                </p>
              ) : (
                <form className="bs-form" onSubmit={submitMessage} dir="ltr" style={{ marginTop: '24px' }}>
                  <input className="bs-input" name="author_name" placeholder="Votre prénom" required />
                  <textarea className="bs-input bs-textarea" name="message" placeholder="Vos vœux..." required />
                  <button className="bs-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                    Publier ۞
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="bs-footer">
          <div className="bs-content-zone">
            <div className="bs-orn-small">
              <svg viewBox="0 0 40 40">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                  <path
                    key={angle}
                    d="M20 6 L23 18 L34 20 L23 22 L20 34 L17 22 L6 20 L17 18 Z"
                    fill="none" stroke="#C9A84C" strokeWidth="0.5"
                    transform={`rotate(${angle} 20 20)`}
                  />
                ))}
                <circle cx="20" cy="20" r="2.5" fill="#C9A84C"/>
              </svg>
            </div>
            <div className="bs-footer-names">{brideAr} و {groomAr}</div>
            <div className="bs-footer-date" dir="rtl">{dateAr}</div>
            <div className="bs-footer-date-fr">{dateFr}</div>
            <div className="bs-footer-credit">Élégance Digitale™</div>
          </div>
        </footer>

        </div>{/* fin bs-texture-bg */}

      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  body{
    font-family:'Amiri',Georgia,serif;
    background:#1a1108;color:#1A1A1A;overflow-x:hidden;
  }

  /* Enveloppe */
  .bs-env-screen{
    position:fixed;inset:0;z-index:1000;
    background:linear-gradient(135deg,#FFFFFF 0%,#FAF7F0 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
  }
  .bs-env-wrap{
    cursor:pointer;
    filter:drop-shadow(0 16px 40px rgba(201,168,76,0.15));
    transition:transform .3s;
  }
  .bs-env-wrap:hover{transform:translateY(-4px) scale(1.02)}
  .bs-env-svg{width:280px;height:auto}
  .bs-env-hint{
    margin-top:28px;font-family:'Aref Ruqaa',serif;font-size:1.1rem;
    color:#C9A84C;letter-spacing:.05em;
    animation:bsPulse 2.5s ease-in-out infinite;
  }
  @keyframes bsPulse{0%,100%{opacity:.5}50%{opacity:1}}

  /* Invitation wrapper */
  .bs-invitation{
    opacity:0;transform:translateY(24px);
    transition:opacity 1s,transform 1s;
    font-family:'Amiri',Georgia,serif;
  }
  .bs-invitation.bs-visible{opacity:1;transform:none}

  /* ── Texture & layout : générés dynamiquement par getBgCSSForKey()
     depuis src/lib/bg-texture-system.ts + src/lib/bg-config.json
     → bs-texture-bg, bs-content-zone, media queries mobile/desktop ── */

  /* Les sections sont transparentes (fond géré par bs-texture-bg) */
  .bs-hero,.bs-section,.bs-rsvp,.bs-footer{
    width:100%;
    position:relative;
    background:transparent;
  }

  .bs-orn{width:80px;height:80px;margin-bottom:32px}
  .bs-orn svg{width:100%;height:100%}
  .bs-orn-small{width:50px;height:50px;margin:0 auto 16px}
  .bs-orn-small svg{width:100%;height:100%}

  /* Bismillah */
  .bs-bismillah{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(1.8rem,5vw,2.8rem);
    color:#C9A84C;line-height:1.8;
    font-weight:700;
    margin-bottom:36px;
    letter-spacing:.02em;
    text-shadow:0 1px 2px rgba(201,168,76,0.1);
  }

  /* Verset coranique */
  .bs-verse-wrap{
    background:linear-gradient(180deg,rgba(201,168,76,0.04) 0%,transparent 100%);
    border-top:1px solid rgba(201,168,76,0.3);
    border-bottom:1px solid rgba(201,168,76,0.3);
    padding:24px 28px;margin:0 0 36px;
    width:100%;
  }
  .bs-verse{
    font-family:'Amiri',serif;
    font-size:clamp(1rem,2.5vw,1.4rem);
    color:#3D2817;line-height:2.2;
    font-weight:400;
  }
  .bs-verse-ref{
    margin-top:12px;
    font-family:'Reem Kufi',sans-serif;
    font-size:.85rem;color:#C9A84C;letter-spacing:.05em;
  }

  /* Divider */
  .bs-divider{
    display:flex;align-items:center;justify-content:center;
    gap:14px;margin:0 0 32px;width:100%;
  }
  .bs-divider span{
    flex:1;height:1px;
    background:linear-gradient(90deg,transparent,#C9A84C,transparent);
  }
  .bs-divider i{color:#C9A84C;font-style:normal;font-size:1.1rem;}

  /* Intro */
  .bs-intro{
    font-family:'Reem Kufi',sans-serif;
    font-size:1rem;color:#6B5A3E;
    margin-bottom:28px;font-weight:500;
    letter-spacing:.02em;
  }

  /* Noms */
  .bs-names{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(2.2rem,7vw,4rem);
    color:#1A1A1A;line-height:1.2;font-weight:700;
    display:flex;flex-direction:column;align-items:center;gap:8px;
    margin:0;
  }
  .bs-name{display:block}
  .bs-and{
    color:#C9A84C;
    font-size:clamp(1.6rem,5vw,2.8rem);
    font-weight:400;margin:8px 0;
  }

  /* Message custom */
  .bs-custom{
    font-family:'Amiri',serif;font-size:1.1rem;font-style:italic;
    color:#4A3E2A;line-height:2;
    width:100%;margin:32px auto;
  }

  /* Date */
  .bs-date-wrap{
    position:relative;
    display:flex;align-items:center;gap:24px;
    padding:32px 48px;margin-top:16px;
    background:#FFFFFF;
    border:1px solid rgba(201,168,76,0.3);
  }
  .bs-date-corner{
    position:absolute;width:18px;height:18px;
    border:1.5px solid #C9A84C;
  }
  .bs-tl{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .bs-tr{top:-1px;right:-1px;border-left:none;border-bottom:none}
  .bs-bl{bottom:-1px;left:-1px;border-right:none;border-top:none}
  .bs-br{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .bs-date-num{
    font-family:'Aref Ruqaa',serif;
    font-size:4rem;font-weight:700;
    color:#C9A84C;line-height:1;
  }
  .bs-date-info{display:flex;flex-direction:column;align-items:center;gap:6px}
  .bs-date-month{
    font-family:'Reem Kufi',sans-serif;
    font-size:1rem;color:#1A1A1A;font-weight:600;
  }
  .bs-date-line{width:30px;height:1px;background:#C9A84C}
  .bs-date-year{font-family:'Aref Ruqaa',serif;font-size:1.3rem;color:#1A1A1A;}
  .bs-date-time{
    font-family:'Aref Ruqaa',serif;font-size:1.5rem;color:#C9A84C;
    border-right:1px solid rgba(201,168,76,0.3);
    padding-right:24px;margin-right:-24px;
    align-self:stretch;display:flex;align-items:center;
  }

  /* Hadith */
  .bs-hadith{
    margin-top:40px;width:100%;
    font-family:'Amiri',serif;font-style:italic;
    font-size:1.1rem;color:#6B5A3E;line-height:2;
  }

  /* Sections labels */
  .bs-label{
    font-family:'Reem Kufi',sans-serif;
    font-size:.95rem;color:#C9A84C;
    margin-bottom:14px;font-weight:500;
    letter-spacing:.05em;
  }
  .bs-title{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(1.8rem,4.5vw,2.4rem);
    color:#1A1A1A;margin-bottom:24px;line-height:1.4;font-weight:700;
  }
  .bs-body{
    font-family:'Amiri',serif;font-size:1.1rem;font-style:italic;
    color:#6B5A3E;line-height:2;margin-bottom:24px;
  }

  /* Countdown */
  .bs-countdown{
    display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
    direction:ltr;
  }
  .bs-cd{
    display:flex;flex-direction:column;align-items:center;
    min-width:70px;padding:16px 12px;
    background:#FFFFFF;
    border:1px solid rgba(201,168,76,0.25);
    position:relative;
  }
  .bs-cd::before,.bs-cd::after{
    content:'';position:absolute;width:10px;height:10px;
    border:1px solid #C9A84C;
  }
  .bs-cd::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .bs-cd::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .bs-cd-num{
    font-family:'Aref Ruqaa',serif;font-size:2rem;
    color:#C9A84C;line-height:1;font-weight:700;
  }
  .bs-cd-label{
    font-family:'Reem Kufi',sans-serif;
    font-size:.72rem;color:#6B5A3E;margin-top:8px;
  }

  /* Programme */
  .bs-program{
    display:flex;flex-direction:column;gap:0;
    width:100%;
  }
  .bs-prog-item{
    display:grid;grid-template-columns:1fr 24px 90px;gap:16px;
    align-items:center;padding:18px 0;
    border-bottom:1px solid rgba(201,168,76,0.2);
  }
  .bs-prog-item:last-child{border-bottom:none}
  .bs-prog-time{
    font-family:'Aref Ruqaa',serif;font-size:1.3rem;color:#C9A84C;
    text-align:left;font-weight:700;
  }
  .bs-prog-star{color:#C9A84C;font-size:.9rem;text-align:center;}
  .bs-prog-content{text-align:right}
  .bs-prog-event{
    font-family:'Aref Ruqaa',serif;font-size:1.15rem;
    color:#1A1A1A;font-weight:700;
  }
  .bs-prog-venue{
    font-family:'Amiri',serif;font-size:.95rem;font-style:italic;
    color:#6B5A3E;margin-top:4px;
  }

  /* Map */
  .bs-btn-row{
    display:flex;justify-content:center;gap:12px;flex-wrap:wrap;
    margin-top:24px;direction:ltr;
  }
  .bs-btn-map{
    padding:14px 32px;
    background:#C9A84C;color:#FFFFFF;text-decoration:none;
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;
    font-weight:600;transition:all .3s;
  }
  .bs-btn-map:hover{
    background:#B8973F;transform:translateY(-2px);
    box-shadow:0 8px 20px rgba(201,168,76,0.3);
  }
  .bs-btn-outline{
    background:transparent;color:#C9A84C;border:1px solid #C9A84C;
  }
  .bs-btn-outline:hover{background:#C9A84C;color:#FFFFFF}

  /* RSVP */
  .bs-rsvp-fr{
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    color:#9B8A6E;margin:-12px 0 24px;
  }
  .bs-form{
    width:100%;
    display:flex;flex-direction:column;gap:14px;text-align:left;
    direction:ltr;
  }
  .bs-input{
    width:100%;padding:14px 18px;
    background:#FFFFFF;
    border:1px solid rgba(201,168,76,0.3);
    color:#1A1A1A;font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .bs-input::placeholder{color:rgba(26,26,26,0.4);font-style:italic}
  .bs-input:focus{border-color:#C9A84C}
  .bs-textarea{resize:vertical;min-height:80px}
  .bs-radios{display:flex;gap:8px}
  .bs-radio{
    flex:1;padding:12px 6px;
    background:#FFFFFF;
    border:1px solid rgba(201,168,76,0.3);
    color:#6B5A3E;
    font-family:'Montserrat',sans-serif;
    font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;
    cursor:pointer;transition:all .2s;font-weight:500;
  }
  .bs-radio-on,.bs-radio:hover{
    background:#C9A84C;border-color:#C9A84C;color:#FFFFFF;font-weight:600;
  }
  .bs-btn-submit{
    padding:16px;background:#C9A84C;color:#FFFFFF;
    border:none;font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    font-weight:600;cursor:pointer;transition:opacity .3s;
  }
  .bs-btn-submit:hover{opacity:.88}
  .bs-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .bs-success{
    font-family:'Aref Ruqaa',serif;font-size:1.3rem;
    color:#C9A84C;padding:20px;font-weight:700;
  }

  /* Messages */
  .bs-messages{
    display:flex;flex-direction:column;gap:14px;
    width:100%;margin-bottom:16px;
  }
  .bs-msg{
    background:#FAF7F0;border:1px solid rgba(201,168,76,0.2);
    padding:20px 24px;position:relative;
  }
  .bs-msg-orn{color:#C9A84C;font-size:.9rem;margin-bottom:8px;opacity:.7;}
  .bs-msg-text{
    font-family:'Amiri',serif;font-size:1rem;font-style:italic;
    color:#3D2817;line-height:1.8;
  }
  .bs-msg-author{
    margin-top:10px;
    font-family:'Reem Kufi',sans-serif;font-size:.75rem;
    color:#C9A84C;font-weight:500;letter-spacing:.05em;
  }

  /* Footer */
  .bs-footer-names{
    font-family:'Aref Ruqaa',serif;font-size:1.8rem;
    color:#C9A84C;margin-bottom:6px;font-weight:700;
    direction:rtl;
  }
  .bs-footer-date{
    font-family:'Amiri',serif;font-size:1rem;
    color:#6B5A3E;margin-bottom:6px;
  }
  .bs-footer-date-fr{
    font-family:Georgia,serif;font-size:.85rem;font-style:italic;
    color:#9B8A6E;margin-bottom:24px;
  }
  .bs-footer-credit{
    font-family:'Montserrat',sans-serif;
    font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;
    color:#C9A84C;opacity:.6;
  }

  @media(max-width:600px){
    .bs-date-wrap{flex-direction:column;gap:16px;padding:24px}
    .bs-date-time{border-right:none;padding-right:0;margin-right:0}
    .bs-prog-item{grid-template-columns:60px 16px 1fr;gap:10px}
    .bs-prog-time{font-size:1rem;text-align:left}
    .bs-prog-content{text-align:right}
    .bs-cd{min-width:58px;padding:12px 8px}
    .bs-cd-num{font-size:1.6rem}
  }

  /* Desktop : tout calculé en % de l'image (56.25vh × 100vh)
     Image largeur = 56.25vh, hauteur = 100vh  (background-size: auto 100vh, fixed)
     Zone vide : X=18%, Y=15%, W=64%, H=70%

     Calculs dans la section (= 56.25vh de large) :
       content width      = 64% × 56.25vh = 36vh
       margin-left        = 18% × 56.25vh = 10.125vh  (depuis bord gauche section)
       margin-right       = 18% × 56.25vh = 10.125vh  (symétrique → zone centrée)
       padding-top        = 15% × 100vh   = 15vh
       padding-bottom     = 15% × 100vh   = 15vh

     Note : margin:0 auto est équivalent à margin-left/right:10.125vh ici
     car 10.125 + 36 + 10.125 = 56.25 (section pleine). On garde auto pour flexibilité. */
  /* Desktop : géré par getBgCSSForKey() */
`