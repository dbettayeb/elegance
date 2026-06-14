'use client'
import { useState, useEffect } from 'react'
import { Wedding, ProgramItem  } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import { formatDateArabic, formatTimeArabic, toArabicNumerals, getArabicName, formatMonthArabic } from '@/lib/arabic-utils'
import FontOverride from '@/components/common/fontoverride'
import { getBgCSSForKey, BG_CONFIGS } from '@/lib/bg-texture-system'
import { getBismillahPalette } from '@/lib/bismillah-palettes'

export default function Bismillah({ wedding, guestNameAr, guestPrefixAr, guestSuffixAr }: { wedding: Wedding; guestNameAr?: string; guestPrefixAr?: string; guestSuffixAr?: string }) {
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

  const palette = getBismillahPalette(wedding.bismillah_palette)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)

  useEffect(() => {
    function scaleOpening() {
      const stage = document.querySelector<HTMLElement>('.bs-opening-stage')
      if (!stage) return
      const scale = (window.innerWidth >= 1200 && window.innerHeight >= 850)
        ? 1
        : Math.min(window.innerHeight / 580, window.innerWidth / 440, 1.5)
      stage.style.setProperty('--os-scale', scale.toFixed(4))
    }
    scaleOpening()
    window.addEventListener('resize', scaleOpening)
    return () => window.removeEventListener('resize', scaleOpening)
  }, [])

  function startSequence() {
    if (phase !== 0) return
    setPhase(1)
    setTimeout(() => setPhase(2), 800)
    setTimeout(() => setPhase(3), 3000)
    setTimeout(() => { setPhase(4); openEnvelope() }, 3600)
  }

  // Background dynamique : lit bg-config.json via bg-texture-system.ts
  const bgKey = (wedding.background_image ?? 'bg-texture.jpg') as string
  const bgCfg = BG_CONFIGS[bgKey] ?? BG_CONFIGS['bg-texture.jpg']
  const decoWidthVh   = (bgCfg.imgW / bgCfg.imgH * 100).toFixed(2)  // desktop: width en vh
  const decoHeightVw  = (bgCfg.imgH / bgCfg.imgW * 100).toFixed(2)  // mobile:  height en vw

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>
      <style>{`
        .bs-invitation {
          --bs-accent: ${palette.accent};
          --bs-accent-dark: ${palette.accentDark};
          --bs-accent-soft: ${palette.accentSoft};
          --bs-border: ${palette.border};
          --bs-bg: ${palette.bg};
          --bs-text: ${palette.textPrimary};
          --bs-text-2: ${palette.textSecondary};
          --bs-text-muted: ${palette.textMuted};
          --bs-gold: ${palette.decorativeGold ?? palette.accent};
        }
        .bs-invitation .bs-orn svg path { stroke: var(--bs-gold); }
        .bs-invitation .bs-orn svg circle { fill: var(--bs-gold); }
        .bs-invitation .bs-orn-small svg path { stroke: var(--bs-gold); }
        .bs-invitation .bs-orn-small svg circle { fill: var(--bs-gold); }
      `}</style>
      {/* CSS dynamique : zone vide + texture calculés depuis bg-config.json */}
      <style>{getBgCSSForKey(bgKey, 'bs')}</style>
      {/* Dimensions décoration = mêmes que bg sélectionné */}
      <style>{`
        @media (max-width: 768px) {
          .bs-deco-fixed { width: 100vw; height: ${decoHeightVw}vw; }
        }
        @media (min-width: 769px) {
          .bs-deco-fixed { width: ${decoWidthVh}vh; height: 100vh; }
        }
      `}</style>
      {/* Surcharge du padding content-zone : 11% au lieu de 15% */}
      <style>{`
        @media (max-width: 768px) {
          .bs-content-zone { padding-top: 19.6vw; padding-bottom: 19.6vw; }
        }
        @media (min-width: 769px) {
          .bs-content-zone { padding-top: 11vh; padding-bottom: 11vh; }
        }
      `}</style>
      <FontOverride font={wedding.custom_font} container=".bs-container" />

      {/* OPENING */}
      {!opened && (
        <div className={`bs-opening${phase >= 3 ? ' bs-op-hidden' : ''}`}>
          <div
            className={`bs-opening-stage${phase >= 1 ? ' bs-seal-out' : ''}${phase >= 2 ? ' bs-animating' : ''}`}
            onClick={startSequence}
            role="button"
            tabIndex={0}
            aria-label="Open invitation"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startSequence() }}
          >
            <img className="bs-poly bs-poly-left"  src="/assets/alexa-richard/polygons/polygon-left.png"   alt="" />
            <img className="bs-poly bs-poly-right" src="/assets/alexa-richard/polygons/polygon-right.png"  alt="" />
            <img className="bs-poly bs-poly-top"   src="/assets/alexa-richard/polygons/polygon-top.png"    alt="" />
            <img className="bs-poly bs-poly-bot"   src="/assets/alexa-richard/polygons/polygon-bottom.png" alt="" />
            {guestNameAr && (
              <div className="bs-guest-name">
                <span className="bs-guest-to">{guestPrefixAr || 'إلى السيد'}</span>
                <span className="bs-guest-ar">{guestNameAr}</span>
                <span className="bs-guest-suffix">{guestSuffixAr || 'و حرمه'}</span>
              </div>
            )}
            <div className="bs-seal-btn">
              <img src="/assets/alexa-richard/polygons/seal-center.png" alt="" className="bs-seal-img" />
            </div>
            <span className="bs-opening-hint">اضغط لفتح الدعوة</span>
          </div>
        </div>
      )}

      {/* INVITATION */}
      <div className={`bs-invitation${visible ? ' bs-visible' : ''}`} dir="rtl">

        {/* Cadre décoratif fixe — se superpose au bg-texture avec les mêmes dimensions */}
        <img src={`/${wedding.decoration_image ?? 'decoration.png'}`} alt="" className="bs-deco-fixed" aria-hidden="true" />

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

            {(wedding.bride_family_ar || wedding.groom_family_ar) ? (
              <>
                {wedding.families_intro_ar && (
                  <p className="bs-families-intro">
                    {wedding.families_intro_ar.split('\n').map((line, i) => (
                      <span key={i}>{line}<br/></span>
                    ))}
                  </p>
                )}
                <div className="bs-families">
                  {wedding.groom_family_ar && (
                    <div className="bs-family">
                      <span className="bs-family-prefix">{wedding.groom_family_prefix_ar || 'عائلة'}</span>
                      <span className="bs-family-name">{wedding.groom_family_ar}</span>
                    </div>
                  )}
                  {wedding.bride_family_ar && wedding.groom_family_ar && (
                    <div className="bs-family-and">و</div>
                  )}
                  {wedding.bride_family_ar && (
                    <div className="bs-family">
                      <span className="bs-family-prefix">{wedding.bride_family_prefix_ar || 'عائلة'}</span>
                      <span className="bs-family-name">{wedding.bride_family_ar}</span>
                    </div>
                  )}
                </div>
                <p className="bs-intro">بدعوتكم لحضور حفل زفاف نجليهما</p>
              </>
            ) : (
              <p className="bs-intro">يتشرفان بدعوتكم لحضور حفل زفافهما</p>
            )}

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
        {wedding.show_countdown !== false && (
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
        )}

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
    background:#1a1108;color:var(--bs-text);overflow-x:hidden;
  }

  /* Opening screen */
  .bs-opening{
    position:fixed;inset:0;z-index:9999;
    background:#FAF7F0;overflow:hidden;
    transition:opacity .6s ease,visibility .6s ease;
  }
  .bs-opening.bs-op-hidden{opacity:0;visibility:hidden;pointer-events:none}
  .bs-opening-stage{
    position:absolute;top:50%;left:50%;
    width:1200px;height:850px;
    cursor:pointer;--os-scale:1;
    transform:translate(-50%,-50%) scale(var(--os-scale));
    transform-origin:center center;
  }
  .bs-poly{
    position:absolute;pointer-events:none;
    transition:transform 2s ease,opacity .5s ease;
  }
  .bs-poly-left {top:-13px;left:98px; width:467px;height:auto;z-index:1}
  .bs-poly-right{top:-13px;left:635px;width:467px;height:auto;z-index:1}
  .bs-poly-bot  {top:271px;left:95px; width:1011px;height:auto;z-index:1}
  .bs-poly-top  {top:-6px; left:94px; width:1012px;height:auto;z-index:2}
  .bs-opening-stage.bs-animating .bs-poly-left {transform:translateX(-560px);opacity:0}
  .bs-opening-stage.bs-animating .bs-poly-right{transform:translateX(560px); opacity:0}
  .bs-opening-stage.bs-animating .bs-poly-top  {transform:translateY(-430px)}
  .bs-opening-stage.bs-animating .bs-poly-bot  {transform:translateY(566px)}
  .bs-guest-name{
    position:absolute;top:195px;left:400px;width:400px;
    text-align:center;direction:rtl;z-index:3;
    color:#8B6914;
    transition:transform 2s ease;
  }
  .bs-opening-stage.bs-animating .bs-guest-name{transform:translateY(-430px)}
  .bs-guest-to,.bs-guest-suffix{
    display:block;font-family:'Reem Kufi',sans-serif;
    font-size:15px;letter-spacing:.04em;opacity:.85;
  }
  .bs-guest-ar{
    display:block;font-family:'Aref Ruqaa',serif;
    font-size:24px;font-weight:700;margin:6px 0;color:#5C4A14;
  }
  .bs-seal-btn{
    position:absolute;top:283px;left:490px;
    width:221px;height:221px;z-index:3;
    transition:transform 1.5s ease,opacity 1s ease;
  }
  .bs-seal-img{width:100%;height:100%;object-fit:contain;display:block}
  .bs-opening-stage.bs-seal-out .bs-seal-btn,
  .bs-opening-stage.bs-animating .bs-seal-btn{transform:scale(1.22);opacity:0}
  .bs-opening-hint{
    position:absolute;top:526px;left:480px;width:240px;
    text-align:center;
    color:#C9A84C;font-family:'Aref Ruqaa',serif;font-size:20px;
    pointer-events:none;z-index:4;
    transition:opacity 1.5s ease;
    animation:bsOpPulse 2s ease-in-out infinite;
  }
  .bs-opening-stage.bs-seal-out .bs-opening-hint,
  .bs-opening-stage.bs-animating .bs-opening-hint{opacity:0;animation:none;transition:opacity .3s ease}
  @keyframes bsOpPulse{0%,100%{opacity:.5}50%{opacity:1}}

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

  /* Cadre décoratif — fixe sur le viewport, couvre exactement l'écran */
  .bs-deco-fixed {
    position:fixed;
    top:0;
    pointer-events:none;
    z-index:10;
    object-fit:fill;
  }
  @media (max-width: 768px) {
    .bs-deco-fixed { left:0; }
  }
  @media (min-width: 769px) {
    .bs-deco-fixed { left:50%; transform:translateX(-50%); }
  }

  /* Les sections sont transparentes (fond géré par bs-texture-bg) */
  .bs-hero,.bs-section,.bs-rsvp,.bs-footer{
    width:100%;
    position:relative;
    background:transparent;
  }

  .bs-orn{width:70px;height:70px;margin-bottom:22px}
  .bs-orn svg{width:100%;height:100%}
  .bs-orn-small{width:50px;height:50px;margin:0 auto 12px}
  .bs-orn-small svg{width:100%;height:100%}

  /* Bismillah */
  .bs-bismillah{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(1.8rem,5vw,2.8rem);
    color:var(--bs-accent);line-height:1.8;
    font-weight:700;
    margin-bottom:20px;
    letter-spacing:.02em;
    text-shadow:0 1px 2px rgba(201,168,76,0.1);
  }

  /* Verset coranique */
  .bs-verse-wrap{
    background:linear-gradient(180deg,rgba(201,168,76,0.05) 0%,rgba(255,255,255,0.2) 100%);
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
    border-top:1px solid var(--bs-border);
    border-bottom:1px solid var(--bs-border);
    padding:18px 24px;margin:0 0 22px;
    width:100%;
  }
  .bs-verse{
    font-family:'Amiri',serif;
    font-size:clamp(1rem,2.5vw,1.4rem);
    color:var(--bs-text-2);line-height:2.2;
    font-weight:400;
  }
  .bs-verse-ref{
    margin-top:12px;
    font-family:'Reem Kufi',sans-serif;
    font-size:.85rem;color:var(--bs-accent);letter-spacing:.05em;
  }

  /* Divider */
  .bs-divider{
    display:flex;align-items:center;justify-content:center;
    gap:14px;margin:0 0 20px;width:100%;
  }
  .bs-divider span{
    flex:1;height:1px;
    background:linear-gradient(90deg,transparent,var(--bs-accent),transparent);
  }
  .bs-divider i{color:var(--bs-accent);font-style:normal;font-size:1.1rem;}

  /* Familles intro */
  .bs-families-intro{
    font-family:'Amiri',serif;
    font-size:clamp(.95rem,2.2vw,1.2rem);
    color:var(--bs-text-2);line-height:1.8;
    margin-bottom:18px;width:100%;
    font-style:italic;
  }

  /* Familles (Bismillah only) */
  .bs-families{
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    gap:14px;
    margin-bottom:22px;
    width:100%;
    flex-wrap:nowrap;
  }
  .bs-family{
    display:flex;flex-direction:column;align-items:center;gap:2px;
    flex:1 1 0;
    min-width:0;
  }
  .bs-family-prefix{
    font-family:'Reem Kufi',sans-serif;
    font-size:clamp(.65rem,1.6vw,.85rem);
    color:var(--bs-text-muted);font-weight:400;letter-spacing:.05em;
  }
  .bs-family-name{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(.95rem,2.4vw,1.35rem);
    color:var(--bs-text-2);font-weight:700;line-height:1.3;
    text-align:center;
    word-break:break-word;
  }
  .bs-family-and{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(1.1rem,2.6vw,1.5rem);
    color:var(--bs-accent);font-weight:400;
    flex-shrink:0;
    align-self:center;
    margin-top:14px;
  }
  @media(max-width:480px){
    .bs-families{gap:8px}
  }

  /* Intro */
  .bs-intro{
    font-family:'Reem Kufi',sans-serif;
    font-size:1rem;color:var(--bs-text-2);
    margin-bottom:18px;font-weight:500;
    letter-spacing:.02em;
  }

  /* Noms */
  .bs-names{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(2.2rem,7vw,4rem);
    color:var(--bs-text);line-height:1.2;font-weight:700;
    display:flex;flex-direction:column;align-items:center;gap:4px;
    margin:0;
  }
  .bs-name{display:block}
  .bs-and{
    color:var(--bs-accent);
    font-size:clamp(1.6rem,5vw,2.8rem);
    font-weight:400;margin:4px 0;
  }

  /* Message custom */
  .bs-custom{
    font-family:'Amiri',serif;font-size:1.1rem;font-style:italic;
    color:var(--bs-text-2);line-height:2;
    width:100%;margin:22px auto;
  }

  /* Date */
  .bs-date-wrap{
    position:relative;
    display:flex;align-items:center;gap:18px;
    padding:22px 36px;margin-top:10px;
    background:rgba(255,255,255,0.45);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
    border:1px solid var(--bs-border);
  }
  .bs-date-corner{
    position:absolute;width:18px;height:18px;
    border:1.5px solid var(--bs-gold);
  }
  .bs-tl{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .bs-tr{top:-1px;right:-1px;border-left:none;border-bottom:none}
  .bs-bl{bottom:-1px;left:-1px;border-right:none;border-top:none}
  .bs-br{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .bs-date-num{
    font-family:'Aref Ruqaa',serif;
    font-size:4rem;font-weight:700;
    color:var(--bs-gold);line-height:1;
  }
  .bs-date-info{display:flex;flex-direction:column;align-items:center;gap:6px}
  .bs-date-month{
    font-family:'Reem Kufi',sans-serif;
    font-size:1rem;color:var(--bs-text);font-weight:600;
  }
  .bs-date-line{width:30px;height:1px;background:var(--bs-gold)}
  .bs-date-year{font-family:'Aref Ruqaa',serif;font-size:1.3rem;color:var(--bs-text);}
  .bs-date-time{
    font-family:'Aref Ruqaa',serif;font-size:1.5rem;color:var(--bs-accent);
    border-right:1px solid var(--bs-border);
    padding-right:24px;margin-right:-24px;
    align-self:stretch;display:flex;align-items:center;
  }

  /* Hadith */
  .bs-hadith{
    margin-top:26px;width:100%;
    font-family:'Amiri',serif;font-style:italic;
    font-size:1.1rem;color:var(--bs-text-2);line-height:2;
  }

  /* Sections labels */
  .bs-label{
    font-family:'Reem Kufi',sans-serif;
    font-size:.95rem;color:var(--bs-accent);
    margin-bottom:8px;font-weight:500;
    letter-spacing:.05em;
  }
  .bs-title{
    font-family:'Aref Ruqaa',serif;
    font-size:clamp(1.8rem,4.5vw,2.4rem);
    color:var(--bs-text);margin-bottom:16px;line-height:1.4;font-weight:700;
  }
  .bs-body{
    font-family:'Amiri',serif;font-size:1.1rem;font-style:italic;
    color:var(--bs-text-2);line-height:2;margin-bottom:16px;
  }

  /* Countdown */
  .bs-countdown{
    display:flex;gap:14px;justify-content:center;flex-wrap:wrap;
    direction:ltr;
  }
  .bs-cd{
    display:flex;flex-direction:column;align-items:center;
    min-width:64px;padding:12px 10px;
    background:rgba(255,255,255,0.45);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
    border:1px solid var(--bs-border);
    position:relative;
  }
  .bs-cd::before,.bs-cd::after{
    content:'';position:absolute;width:10px;height:10px;
    border:1px solid var(--bs-gold);
  }
  .bs-cd::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .bs-cd::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .bs-cd-num{
    font-family:'Aref Ruqaa',serif;font-size:2rem;
    color:var(--bs-gold);line-height:1;font-weight:700;
  }
  .bs-cd-label{
    font-family:'Reem Kufi',sans-serif;
    font-size:.72rem;color:var(--bs-text-2);margin-top:8px;
  }

  /* Programme */
  .bs-program{
    display:flex;flex-direction:column;gap:0;
    width:100%;
  }
  .bs-prog-item{
    display:grid;grid-template-columns:1fr 24px 90px;gap:16px;
    align-items:center;padding:14px 0;
    border-bottom:1px solid rgba(201,168,76,0.2);
  }
  .bs-prog-item:last-child{border-bottom:none}
  .bs-prog-time{
    font-family:'Aref Ruqaa',serif;font-size:1.3rem;color:var(--bs-accent);
    text-align:left;font-weight:700;
  }
  .bs-prog-star{color:var(--bs-gold);font-size:.9rem;text-align:center;}
  .bs-prog-content{text-align:right}
  .bs-prog-event{
    font-family:'Aref Ruqaa',serif;font-size:1.15rem;
    color:var(--bs-text);font-weight:700;
  }
  .bs-prog-venue{
    font-family:'Amiri',serif;font-size:.95rem;font-style:italic;
    color:var(--bs-text-2);margin-top:4px;
  }

  /* Map */
  .bs-btn-row{
    display:flex;justify-content:center;gap:12px;flex-wrap:wrap;
    margin-top:18px;direction:ltr;
  }
  .bs-btn-map{
    padding:14px 32px;
    background:var(--bs-accent);color:#FFFFFF;text-decoration:none;
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;
    font-weight:600;transition:all .3s;
  }
  .bs-btn-map:hover{
    background:var(--bs-accent-dark);transform:translateY(-2px);
    box-shadow:0 8px 20px var(--bs-border);
  }
  .bs-btn-outline{
    background:transparent;color:var(--bs-accent);border:1px solid var(--bs-accent);
  }
  .bs-btn-outline:hover{background:var(--bs-accent);color:#FFFFFF}

  /* RSVP */
  .bs-rsvp-fr{
    font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    color:var(--bs-text-muted);margin:-10px 0 18px;
  }
  .bs-form{
    width:100%;
    display:flex;flex-direction:column;gap:10px;text-align:left;
    direction:ltr;
  }
  .bs-input{
    width:100%;padding:14px 18px;
    background:rgba(255,255,255,0.55);
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
    border:1px solid var(--bs-border);
    color:var(--bs-text);font-family:Georgia,serif;font-size:.95rem;
    outline:none;transition:border-color .3s;
  }
  .bs-input::placeholder{color:rgba(26,26,26,0.4);font-style:italic}
  .bs-input:focus{border-color:var(--bs-accent)}
  .bs-textarea{resize:vertical;min-height:80px}
  .bs-radios{display:flex;gap:8px}
  .bs-radio{
    flex:1;padding:12px 6px;
    background:rgba(255,255,255,0.45);
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
    border:1px solid var(--bs-border);
    color:var(--bs-text-2);
    font-family:'Montserrat',sans-serif;
    font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;
    cursor:pointer;transition:all .2s;font-weight:500;
  }
  .bs-radio-on,.bs-radio:hover{
    background:var(--bs-accent);border-color:var(--bs-accent);color:#FFFFFF;font-weight:600;
  }
  .bs-btn-submit{
    padding:16px;background:var(--bs-accent);color:#FFFFFF;
    border:none;font-family:'Montserrat',sans-serif;
    font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;
    font-weight:600;cursor:pointer;transition:opacity .3s;
  }
  .bs-btn-submit:hover{opacity:.88}
  .bs-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .bs-success{
    font-family:'Aref Ruqaa',serif;font-size:1.3rem;
    color:var(--bs-accent);padding:20px;font-weight:700;
  }

  /* Messages */
  .bs-messages{
    display:flex;flex-direction:column;gap:10px;
    width:100%;margin-bottom:12px;
  }
  .bs-msg{
    background:rgba(250,247,240,0.5);
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
    border:1px solid rgba(201,168,76,0.2);
    padding:16px 20px;position:relative;
  }
  .bs-msg-orn{color:var(--bs-accent);font-size:.9rem;margin-bottom:8px;opacity:.7;}
  .bs-msg-text{
    font-family:'Amiri',serif;font-size:1rem;font-style:italic;
    color:var(--bs-text-2);line-height:1.8;
  }
  .bs-msg-author{
    margin-top:10px;
    font-family:'Reem Kufi',sans-serif;font-size:.75rem;
    color:var(--bs-accent);font-weight:500;letter-spacing:.05em;
  }

  /* Footer */
  .bs-footer-names{
    font-family:'Aref Ruqaa',serif;font-size:1.8rem;
    color:var(--bs-accent);margin-bottom:4px;font-weight:700;
    direction:rtl;
  }
  .bs-footer-date{
    font-family:'Amiri',serif;font-size:1rem;
    color:var(--bs-text-2);margin-bottom:4px;
  }
  .bs-footer-date-fr{
    font-family:Georgia,serif;font-size:.85rem;font-style:italic;
    color:var(--bs-text-muted);margin-bottom:18px;
  }
  .bs-footer-credit{
    font-family:'Montserrat',sans-serif;
    font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;
    color:var(--bs-accent);opacity:.6;
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