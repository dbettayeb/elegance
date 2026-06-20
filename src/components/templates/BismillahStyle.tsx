'use client'
import { useState, useEffect } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import { formatDateArabic, formatTimeArabic, toArabicNumerals, getArabicName, formatMonthArabic } from '@/lib/arabic-utils'
import FontOverride from '@/components/common/fontoverride'
import { getBgCSSForKey, BG_CONFIGS } from '@/lib/bg-texture-system'
import { getBismillahPalette, AR_STYLE_PALETTES_MAP } from '@/lib/bismillah-palettes'

export default function BismillahStyle({
  wedding,
  bgKey,
  decoKey,
}: {
  wedding: Wedding
  bgKey: string
  decoKey: string
}) {
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

  const rawPalette = getBismillahPalette(wedding.bismillah_palette)
  const arPalettes = AR_STYLE_PALETTES_MAP[wedding.template_id]
  const palette = (arPalettes && !arPalettes.some(p => p.id === rawPalette.id))
    ? arPalettes[0]
    : rawPalette
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

  // back*.png = full background texture (use as CSS bg), deco*.png = transparent frame (use as fixed overlay)
  const isFrameMode = !bgKey.includes('/back')
  const bgCfg = BG_CONFIGS[bgKey] ?? BG_CONFIGS['assets/template1/deco1.png']
  const decoWidthVh = (bgCfg.imgW / bgCfg.imgH * 100).toFixed(2)
  const rHoW = bgCfg.imgH / bgCfg.imgW
  const ptVh = bgCfg.y
  const pbVh = Math.max(8, 100 - bgCfg.y - bgCfg.h)
  const ptVw = (bgCfg.y * rHoW).toFixed(1)
  const pbVw = (pbVh * rHoW).toFixed(1)

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
        .bs-texture-bg { background-color: ${palette.bg} !important; }
        body { background-color: ${palette.bg}; }
      `}</style>
      {/* bg-mode: use image as CSS background texture (back2/back5 are full images, not transparent frames) */}
      {!isFrameMode && <style>{getBgCSSForKey(bgKey, 'bs')}</style>}
      <style>{`
        @media (max-width: 768px) {
          .bs-deco-fixed { width: 100vw; height: 100vh; height: 100dvh; }
          .bs-texture-bg {
            ${isFrameMode ? 'background-image: none !important;' : ''}
            min-height: 100dvh; width: 100%; overflow-x: hidden;
          }
          .bs-hero, .bs-section, .bs-rsvp, .bs-footer {
            display: flex !important; flex-direction: column; align-items: center; width: 100%;
          }
          .bs-hero .bs-content-zone { padding-top: ${ptVw}vw; padding-bottom: 4vw; }
          .bs-section .bs-content-zone, .bs-rsvp .bs-content-zone { padding-top: 4vw; padding-bottom: 4vw; }
          .bs-footer .bs-content-zone { padding-top: 4vw; padding-bottom: ${pbVw}vw; }
          .bs-content-zone { margin-left: 0 !important; margin-right: 0 !important; width: ${bgCfg.w}vw; }
        }
        @media (min-width: 769px) {
          .bs-deco-fixed { width: ${decoWidthVh}vh; height: 100vh; }
          .bs-texture-bg { scrollbar-gutter: stable both-edges !important; width: 100%; }
          .bs-hero, .bs-section, .bs-rsvp, .bs-footer {
            display: flex !important; flex-direction: column; align-items: center; width: 100%;
          }
          .bs-hero .bs-content-zone { padding-top: ${ptVh}vh; padding-bottom: 4vh; }
          .bs-section .bs-content-zone, .bs-rsvp .bs-content-zone { padding-top: 4vh; padding-bottom: 4vh; }
          .bs-footer .bs-content-zone { padding-top: 4vh; padding-bottom: ${pbVh}vh; }
          .bs-content-zone { margin-left: 0 !important; margin-right: 0 !important; width: calc(${decoWidthVh}vh * ${(bgCfg.w / 100).toFixed(2)}); }
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
            <div className="bs-seal-btn">
              <img src="/assets/alexa-richard/polygons/seal-center.png" alt="" className="bs-seal-img" />
            </div>
            <span className="bs-opening-hint">اضغط لفتح الدعوة</span>
          </div>
        </div>
      )}

      {/* INVITATION */}
      <div className={`bs-invitation${visible ? ' bs-visible' : ''}`} dir="rtl">
        {isFrameMode && <img src={`/${decoKey}`} alt="" className="bs-deco-fixed" aria-hidden="true" />}
        <div className="bs-texture-bg">

        <section className="bs-hero">
          <div className="bs-content-zone">
            <div className="bs-bismillah">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>

            <div className="bs-verse-wrap">
              <p className="bs-verse">
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
              </p>
              <p className="bs-verse-ref">﴿ سورة الروم - الآية ٢١ ﴾</p>
            </div>

            <div className="bs-divider"><span></span><i>۞</i><span></span></div>

            {(wedding.bride_family_ar || wedding.groom_family_ar) ? (
              <>
                {wedding.families_intro_ar && (
                  <p className="bs-families-intro">
                    {wedding.families_intro_ar.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
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
              {wedding.custom_message || '« بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ »'}
            </p>
          </div>
        </section>

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

        <section className="bs-section">
          <div className="bs-content-zone">
            <p className="bs-label">مكان الحفل</p>
            <h2 className="bs-title">{wedding.venue_name}</h2>
            {wedding.venue_address && <p className="bs-body">{wedding.venue_address}</p>}
            <div className="bs-btn-row" dir="ltr">
              {wedding.gps_google && (
                <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="bs-btn-map">Google Maps</a>
              )}
              {wedding.gps_apple && (
                <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="bs-btn-map bs-btn-outline">Apple Maps</a>
              )}
            </div>
          </div>
        </section>

        {wedding.show_rsvp && (
          <section className="bs-rsvp">
            <div className="bs-content-zone">
              <div className="bs-card">
                <div className="bs-card-divider"><span /><i>۞</i><span /></div>
                <p className="bs-label">تأكيد الحضور</p>
                <h2 className="bs-card-title">هل ستشرفوننا<br />بحضوركم؟</h2>
                <p className="bs-rsvp-fr">Merci de confirmer votre présence</p>
                <div className="bs-card-divider"><span /><i>۞</i><span /></div>
                {rsvpStatus === 'done' ? (
                  <p className="bs-success">جزاكم الله خيراً • Merci pour votre réponse ۞</p>
                ) : (
                  <form className="bs-form" onSubmit={submitRSVP} dir="ltr">
                    <div className="bs-field">
                      <label className="bs-field-label">Nom complet</label>
                      <input className="bs-input" name="name" placeholder="Prénom et nom..." required />
                    </div>
                    <div className="bs-field">
                      <label className="bs-field-label">WhatsApp</label>
                      <input className="bs-input" name="phone" placeholder="+216 ..." />
                    </div>
                    <div className="bs-field">
                      <label className="bs-field-label">Présence</label>
                      <div className="bs-radios">
                        {(['present', 'absent', 'maybe'] as const).map(s => (
                          <button key={s} type="button"
                            className={`bs-radio${rsvpChoice === s ? ' bs-radio-on' : ''}`}
                            onClick={() => setRsvpChoice(s)}>
                            {s === 'present' ? 'Présent(e)' : s === 'absent' ? 'Absent(e)' : 'À confirmer'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bs-field">
                      <label className="bs-field-label">Accompagnants</label>
                      <input className="bs-input" name="guests" type="number" min="0" max="20" placeholder="Nombre de personnes..." />
                    </div>
                    <div className="bs-field">
                      <label className="bs-field-label">Message (optionnel)</label>
                      <textarea className="bs-input bs-textarea" name="note" placeholder="Un mot pour les mariés..." />
                    </div>
                    <button className="bs-btn-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                      {rsvpStatus === 'loading' ? 'Envoi...' : '۞  Confirmer ma présence  ۞'}
                    </button>
                  </form>
                )}
                <div className="bs-card-dots">• • •</div>
              </div>
            </div>
          </section>
        )}

        {wedding.show_guestbook && (
          <section className="bs-rsvp">
            <div className="bs-content-zone">
              <div className="bs-card">
                <div className="bs-card-divider"><span /><i>۞</i><span /></div>
                <p className="bs-label">دفتر التهاني</p>
                <h2 className="bs-card-title">تهانيكم<br />ودعواتكم</h2>
                <p className="bs-rsvp-fr">Laissez un message de vœux</p>
                <div className="bs-card-divider"><span /><i>۞</i><span /></div>
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
                  <p className="bs-success">
                    {gbPending ? 'En attente de validation ۞' : 'Message publié ۞'}
                  </p>
                ) : (
                  <form className="bs-form" onSubmit={submitMessage} dir="ltr">
                    <div className="bs-field">
                      <label className="bs-field-label">Votre prénom</label>
                      <input className="bs-input" name="author_name" placeholder="ex. Yasmine..." required />
                    </div>
                    <div className="bs-field">
                      <label className="bs-field-label">Vos vœux</label>
                      <textarea className="bs-input bs-textarea" name="message" placeholder="Un mot doux pour les mariés..." required />
                    </div>
                    <button className="bs-btn-submit" type="submit" disabled={gbStatus === 'loading'}>
                      {gbStatus === 'loading' ? 'Envoi...' : '۞  Publier mon message  ۞'}
                    </button>
                  </form>
                )}
                <div className="bs-card-dots">• • •</div>
              </div>
            </div>
          </section>
        )}

        <footer className="bs-footer">
          <div className="bs-content-zone">
            <div className="bs-footer-names">{brideAr} و {groomAr}</div>
            <div className="bs-footer-date" dir="rtl">{dateAr}</div>
            <div className="bs-footer-date-fr">{dateFr}</div>
            <div className="bs-footer-credit">Élégance Digitale™</div>
          </div>
        </footer>

        </div>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Amiri',Georgia,serif;background:#1a1108;color:var(--bs-text);overflow-x:hidden;}
  .bs-opening{position:fixed;inset:0;z-index:9999;background:#FAF7F0;overflow:hidden;transition:opacity .6s ease,visibility .6s ease;}
  .bs-opening.bs-op-hidden{opacity:0;visibility:hidden;pointer-events:none}
  .bs-opening-stage{position:absolute;top:50%;left:50%;width:1200px;height:850px;cursor:pointer;--os-scale:1;transform:translate(-50%,-50%) scale(var(--os-scale));transform-origin:center center;}
  .bs-poly{position:absolute;pointer-events:none;transition:transform 2s ease,opacity .5s ease;}
  .bs-poly-left {top:-13px;left:98px;width:467px;height:auto;z-index:1}
  .bs-poly-right{top:-13px;left:635px;width:467px;height:auto;z-index:1}
  .bs-poly-bot  {top:271px;left:95px;width:1011px;height:auto;z-index:1}
  .bs-poly-top  {top:-6px;left:94px;width:1012px;height:auto;z-index:2}
  .bs-opening-stage.bs-animating .bs-poly-left {transform:translateX(-560px);opacity:0}
  .bs-opening-stage.bs-animating .bs-poly-right{transform:translateX(560px);opacity:0}
  .bs-opening-stage.bs-animating .bs-poly-top  {transform:translateY(-430px)}
  .bs-opening-stage.bs-animating .bs-poly-bot  {transform:translateY(566px)}
  .bs-seal-btn{position:absolute;top:283px;left:490px;width:221px;height:221px;z-index:3;transition:transform 1.5s ease,opacity 1s ease;}
  .bs-seal-img{width:100%;height:100%;object-fit:contain;display:block}
  .bs-opening-stage.bs-seal-out .bs-seal-btn,.bs-opening-stage.bs-animating .bs-seal-btn{transform:scale(1.22);opacity:0}
  .bs-opening-hint{position:absolute;top:526px;left:480px;width:240px;text-align:center;color:#C9A84C;font-family:'Aref Ruqaa',serif;font-size:20px;pointer-events:none;z-index:4;transition:opacity 1.5s ease;animation:bsOpPulse 2s ease-in-out infinite;}
  .bs-opening-stage.bs-seal-out .bs-opening-hint,.bs-opening-stage.bs-animating .bs-opening-hint{opacity:0;animation:none;transition:opacity .3s ease}
  @keyframes bsOpPulse{0%,100%{opacity:.5}50%{opacity:1}}
  .bs-invitation{opacity:0;transform:translateY(24px);transition:opacity 1s,transform 1s;font-family:'Amiri',Georgia,serif;}
  .bs-invitation.bs-visible{opacity:1;transform:none}
  .bs-deco-fixed{position:fixed;top:0;pointer-events:none;z-index:10;object-fit:fill;}
  @media(max-width:768px){.bs-deco-fixed{left:0;}}
  @media(min-width:769px){.bs-deco-fixed{left:50%;transform:translateX(-50%);}}
  .bs-hero,.bs-section,.bs-rsvp,.bs-footer{width:100%;position:relative;background:transparent;}
  .bs-orn{width:70px;height:70px;margin-bottom:22px}.bs-orn svg{width:100%;height:100%}
  .bs-orn-small{width:50px;height:50px;margin:0 auto 12px}.bs-orn-small svg{width:100%;height:100%}
  .bs-bismillah{font-family:'Aref Ruqaa',serif;font-size:clamp(1rem,4.5vw,2.2rem);color:var(--bs-text);line-height:1.8;font-weight:700;margin-top:28px;margin-bottom:20px;white-space:nowrap;}
  .bs-verse-wrap{background:linear-gradient(180deg,rgba(201,168,76,0.05) 0%,rgba(255,255,255,0.2) 100%);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);border-top:1px solid var(--bs-border);border-bottom:1px solid var(--bs-border);padding:18px 24px;margin:0 0 22px;width:100%;}
  .bs-verse{font-family:'Amiri',serif;font-size:clamp(1rem,2.5vw,1.4rem);color:var(--bs-text-2);line-height:2.2;font-weight:400;}
  .bs-verse-ref{margin-top:12px;font-family:'Reem Kufi',sans-serif;font-size:.85rem;color:var(--bs-accent);letter-spacing:.05em;}
  .bs-divider{display:flex;align-items:center;justify-content:center;gap:14px;margin:0 0 20px;width:100%;}
  .bs-divider span{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--bs-accent),transparent);}
  .bs-divider i{color:var(--bs-accent);font-style:normal;font-size:1.1rem;}
  .bs-families-intro{font-family:'Amiri',serif;font-size:clamp(.95rem,2.2vw,1.2rem);color:var(--bs-text-2);line-height:1.8;margin-bottom:18px;width:100%;font-style:italic;}
  .bs-families{display:flex;flex-direction:row;align-items:center;justify-content:center;gap:14px;margin-bottom:22px;width:100%;flex-wrap:nowrap;}
  .bs-family{display:flex;flex-direction:column;align-items:center;gap:2px;flex:1 1 0;min-width:0;}
  .bs-family-prefix{font-family:'Reem Kufi',sans-serif;font-size:clamp(.65rem,1.6vw,.85rem);color:var(--bs-text-muted);font-weight:400;letter-spacing:.05em;}
  .bs-family-name{font-family:'Aref Ruqaa',serif;font-size:clamp(.95rem,2.4vw,1.35rem);color:var(--bs-text-2);font-weight:700;line-height:1.3;text-align:center;word-break:break-word;}
  .bs-family-and{font-family:'Aref Ruqaa',serif;font-size:clamp(1.1rem,2.6vw,1.5rem);color:var(--bs-accent);font-weight:400;flex-shrink:0;align-self:center;margin-top:14px;}
  @media(max-width:480px){.bs-families{gap:8px}}
  .bs-intro{font-family:'Reem Kufi',sans-serif;font-size:1rem;color:var(--bs-text-2);margin-bottom:18px;font-weight:500;letter-spacing:.02em;}
  .bs-names{font-family:'Aref Ruqaa',serif;font-size:clamp(2.2rem,7vw,4rem);color:var(--bs-text);line-height:1.2;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:4px;margin:0;}
  .bs-name{display:block}
  .bs-and{color:var(--bs-accent);font-size:clamp(1.6rem,5vw,2.8rem);font-weight:400;margin:4px 0;}
  .bs-date-wrap{position:relative;display:flex;align-items:center;gap:18px;padding:22px 36px;margin-top:10px;background:rgba(255,255,255,0.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid var(--bs-border);}
  .bs-date-corner{position:absolute;width:18px;height:18px;border:1.5px solid var(--bs-gold);}
  .bs-tl{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .bs-tr{top:-1px;right:-1px;border-left:none;border-bottom:none}
  .bs-bl{bottom:-1px;left:-1px;border-right:none;border-top:none}
  .bs-br{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .bs-date-num{font-family:'Aref Ruqaa',serif;font-size:4rem;font-weight:700;color:var(--bs-gold);line-height:1;}
  .bs-date-info{display:flex;flex-direction:column;align-items:center;gap:6px}
  .bs-date-month{font-family:'Reem Kufi',sans-serif;font-size:1rem;color:var(--bs-text);font-weight:600;}
  .bs-date-line{width:30px;height:1px;background:var(--bs-gold)}
  .bs-date-year{font-family:'Aref Ruqaa',serif;font-size:1.3rem;color:var(--bs-text);}
  .bs-date-time{font-family:'Aref Ruqaa',serif;font-size:1.5rem;color:var(--bs-accent);border-right:1px solid var(--bs-border);padding-right:24px;margin-right:-24px;align-self:stretch;display:flex;align-items:center;}
  .bs-hadith{margin-top:26px;width:100%;font-family:'Amiri',serif;font-style:italic;font-size:1.1rem;color:var(--bs-text-2);line-height:2;}
  .bs-label{font-family:'Reem Kufi',sans-serif;font-size:.95rem;color:var(--bs-accent);margin-bottom:8px;font-weight:500;letter-spacing:.05em;}
  .bs-title{font-family:'Aref Ruqaa',serif;font-size:clamp(1.8rem,4.5vw,2.4rem);color:var(--bs-text);margin-bottom:16px;line-height:1.4;font-weight:700;}
  .bs-body{font-family:'Amiri',serif;font-size:1.1rem;font-style:italic;color:var(--bs-text-2);line-height:2;margin-bottom:16px;}
  .bs-countdown{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;direction:ltr;}
  .bs-cd{display:flex;flex-direction:column;align-items:center;min-width:64px;padding:12px 10px;background:rgba(255,255,255,0.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid var(--bs-border);position:relative;}
  .bs-cd::before,.bs-cd::after{content:'';position:absolute;width:10px;height:10px;border:1px solid var(--bs-gold);}
  .bs-cd::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
  .bs-cd::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
  .bs-cd-num{font-family:'Aref Ruqaa',serif;font-size:2rem;color:var(--bs-gold);line-height:1;font-weight:700;}
  .bs-cd-label{font-family:'Reem Kufi',sans-serif;font-size:.72rem;color:var(--bs-text-2);margin-top:8px;}
  .bs-program{display:flex;flex-direction:column;gap:0;width:100%;}
  .bs-prog-item{display:grid;grid-template-columns:1fr 24px 90px;gap:16px;align-items:center;padding:14px 0;border-bottom:1px solid rgba(201,168,76,0.2);}
  .bs-prog-item:last-child{border-bottom:none}
  .bs-prog-time{font-family:'Aref Ruqaa',serif;font-size:1.3rem;color:var(--bs-accent);text-align:left;font-weight:700;}
  .bs-prog-star{color:var(--bs-gold);font-size:.9rem;text-align:center;}
  .bs-prog-content{text-align:right}
  .bs-prog-event{font-family:'Aref Ruqaa',serif;font-size:1.15rem;color:var(--bs-text);font-weight:700;}
  .bs-prog-venue{font-family:'Amiri',serif;font-size:.95rem;font-style:italic;color:var(--bs-text-2);margin-top:4px;}
  .bs-btn-row{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:18px;direction:ltr;}
  .bs-btn-map{padding:14px 32px;background:var(--bs-accent);color:#FFFFFF;text-decoration:none;font-family:'Montserrat',sans-serif;font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;font-weight:600;transition:all .3s;}
  .bs-btn-map:hover{background:var(--bs-accent-dark);transform:translateY(-2px);box-shadow:0 8px 20px var(--bs-border);}
  .bs-btn-outline{background:transparent;color:var(--bs-accent);border:1px solid var(--bs-accent);}
  .bs-btn-outline:hover{background:var(--bs-accent);color:#FFFFFF}
  .bs-card{width:100%;background:var(--bs-accent-soft);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid var(--bs-border);border-radius:4px;padding:28px 20px 16px;display:flex;flex-direction:column;align-items:center;text-align:center;}
  .bs-card-divider{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;margin:10px 0;}
  .bs-card-divider span{flex:1;height:1px;background:var(--bs-border);}
  .bs-card-divider i{color:var(--bs-accent);font-style:normal;font-size:.65rem;}
  .bs-card-title{font-family:'Aref Ruqaa',serif;font-size:clamp(1.6rem,4vw,2.1rem);font-weight:700;color:var(--bs-text);line-height:1.25;margin:6px 0;}
  .bs-card-dots{margin-top:20px;letter-spacing:.35em;color:var(--bs-accent);font-size:.7rem;opacity:.55;}
  .bs-field{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;text-align:left;width:100%;}
  .bs-field-label{font-family:'Montserrat',sans-serif;font-size:.48rem;letter-spacing:.32em;text-transform:uppercase;color:var(--bs-accent);font-weight:500;}
  .bs-rsvp-fr{font-family:'Montserrat',sans-serif;font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:var(--bs-text-muted);margin:-6px 0 14px;}
  .bs-form{width:100%;display:flex;flex-direction:column;gap:0;text-align:left;direction:ltr;margin-top:8px;}
  .bs-input{width:100%;padding:12px 16px;background:rgba(255,255,255,0.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid var(--bs-border);border-radius:10px;color:var(--bs-text);font-family:'Amiri',Georgia,serif;font-size:1rem;font-style:italic;outline:none;transition:border-color .3s;}
  .bs-input::placeholder{color:rgba(26,26,26,0.35);font-style:italic}
  .bs-input:focus{border-color:var(--bs-accent)}
  .bs-textarea{resize:vertical;min-height:90px;font-style:italic;}
  .bs-radios{display:flex;gap:8px;width:100%}
  .bs-radio{flex:1;min-width:0;padding:10px 4px;background:transparent;border:1px solid var(--bs-border);border-radius:10px;color:var(--bs-text-2);font-family:'Montserrat',sans-serif;font-size:clamp(.38rem,2.2vw,.52rem);letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s;font-weight:500;line-height:1.4;}
  .bs-radio-on,.bs-radio:hover{background:var(--bs-accent);border-color:var(--bs-accent);color:#FFFFFF;font-weight:600;}
  .bs-btn-submit{width:100%;padding:15px;background:transparent;border:1px solid var(--bs-accent);border-radius:4px;color:var(--bs-text);font-family:'Aref Ruqaa',serif;font-size:.9rem;letter-spacing:.2em;cursor:pointer;transition:all .3s;margin-top:4px;}
  .bs-btn-submit:hover{background:var(--bs-accent);color:#FFFFFF;}
  .bs-btn-submit:disabled{opacity:.5;cursor:not-allowed}
  .bs-success{font-family:'Aref Ruqaa',serif;font-size:1.3rem;color:var(--bs-accent);padding:20px;font-weight:700;}
  .bs-messages{display:flex;flex-direction:column;gap:10px;width:100%;margin-bottom:12px;}
  .bs-msg{background:rgba(250,247,240,0.5);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(201,168,76,0.2);padding:16px 20px;position:relative;}
  .bs-msg-orn{color:var(--bs-accent);font-size:.9rem;margin-bottom:8px;opacity:.7;}
  .bs-msg-text{font-family:'Amiri',serif;font-size:1rem;font-style:italic;color:var(--bs-text-2);line-height:1.8;}
  .bs-msg-author{margin-top:10px;font-family:'Reem Kufi',sans-serif;font-size:.75rem;color:var(--bs-accent);font-weight:500;letter-spacing:.05em;}
  .bs-footer-names{font-family:'Aref Ruqaa',serif;font-size:1.8rem;color:var(--bs-accent);margin-bottom:4px;font-weight:700;direction:rtl;}
  .bs-footer-date{font-family:'Amiri',serif;font-size:1rem;color:var(--bs-text-2);margin-bottom:4px;}
  .bs-footer-date-fr{font-family:Georgia,serif;font-size:.85rem;font-style:italic;color:var(--bs-text-muted);margin-bottom:18px;}
  .bs-footer-credit{font-family:'Montserrat',sans-serif;font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:var(--bs-accent);opacity:.6;}
  @media(max-width:600px){
    .bs-date-wrap{flex-direction:column;gap:16px;padding:24px}
    .bs-date-time{border-right:none;padding-right:0;margin-right:0;justify-content:center;}
    .bs-prog-item{grid-template-columns:60px 16px 1fr;gap:10px}
    .bs-prog-time{font-size:1rem;text-align:left}
    .bs-cd{min-width:58px;padding:12px 8px}
    .bs-cd-num{font-size:1.6rem}
  }
`
