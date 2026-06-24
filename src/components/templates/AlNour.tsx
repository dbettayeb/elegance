'use client'
import { useEffect } from 'react'
import { Wedding, ProgramItem } from '@/lib/types'
import { useInvitationLogic } from '@/lib/use-invitation'
import {
  formatDateArabic, formatTimeArabic, toArabicNumerals,
  getArabicName, formatMonthArabic,
} from '@/lib/arabic-utils'
import FontOverride from '@/components/common/fontoverride'
import { getBgCSSForKey, BG_CONFIGS } from '@/lib/bg-texture-system'
import { getBismillahPalette } from '@/lib/bismillah-palettes'

export default function AlNour({ wedding, guestNameAr, guestPrefixAr, guestSuffixAr }: {
  wedding: Wedding
  guestNameAr?: string
  guestPrefixAr?: string
  guestSuffixAr?: string
}) {
  const {
    opened, visible, openEnvelope,
    rsvpStatus, rsvpChoice, setRsvpChoice, submitRSVP,
    gbStatus, gbPending, messages, submitMessage,
    countdown, eventDate,
  } = useInvitationLogic(wedding)

  // Pas d'animation d'ouverture — affichage immédiat
  useEffect(() => {
    if (!opened) openEnvelope()
  }, [])

  const brideAr  = getArabicName(wedding.bride_name_ar, wedding.bride_name)
  const groomAr  = getArabicName(wedding.groom_name_ar, wedding.groom_name)
  const dayName  = eventDate.toLocaleDateString('ar-TN', { weekday: 'long' })
  const dayNum   = toArabicNumerals(eventDate.getDate())
  const monthAr  = formatMonthArabic(eventDate)
  const yearAr   = toArabicNumerals(eventDate.getFullYear())
  const timeAr   = formatTimeArabic(eventDate)
  const dateFr   = eventDate.toLocaleDateString('fr-TN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const palette   = getBismillahPalette(wedding.bismillah_palette)
  const bgKey     = (wedding.background_image ?? 'bg-texture.jpg') as string
  const bgCfg     = BG_CONFIGS[bgKey] ?? BG_CONFIGS['bg-texture.jpg']
  const decoWidthVh  = (bgCfg.imgW / bgCfg.imgH * 100).toFixed(2)
  const decoHeightVw = (bgCfg.imgH / bgCfg.imgW * 100).toFixed(2)

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>
      <style>{`
        .an-invitation {
          --an-accent:      ${palette.accent};
          --an-accent-dark: ${palette.accentDark};
          --an-accent-soft: ${palette.accentSoft};
          --an-border:      ${palette.border};
          --an-bg:          ${palette.bg};
          --an-text:        ${palette.textPrimary};
          --an-text-2:      ${palette.textSecondary};
          --an-text-muted:  ${palette.textMuted};
          --an-gold:        ${palette.decorativeGold ?? palette.accent};
        }
        .an-texture-bg { background-color: ${palette.bg} !important; }
        body { background-color: ${palette.bg}; }
      `}</style>
      <style>{getBgCSSForKey(bgKey, 'an')}</style>
      <style>{`
        @media (max-width: 768px) {
          .an-deco-fixed { width: 100vw; height: 100vh; }
          .an-texture-bg { background-size: 100vw 100vh !important; min-height: 100vh; }
          .an-hero, .an-section, .an-footer {
            display: flex !important;
            flex-direction: column;
            align-items: center;
          }
          .an-content-zone {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-top: 19.6vw;
            padding-bottom: 19.6vw;
          }
        }
        @media (min-width: 769px) {
          .an-deco-fixed { width: ${decoWidthVh}vh; height: 100vh; }
          .an-texture-bg { scrollbar-gutter: stable both-edges !important; }
          .an-hero, .an-section, .an-footer {
            display: flex !important;
            flex-direction: column;
            align-items: center;
          }
          .an-content-zone {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-top: 11vh;
            padding-bottom: 11vh;
          }
        }
      `}</style>
      <FontOverride font={wedding.custom_font} container=".an-invitation" />

      <div className={`an-invitation${visible ? ' an-visible' : ''}`} dir="rtl">

        {/* Cadre décoratif */}
        <img
          src={`/${wedding.decoration_image ?? 'decoration.png'}`}
          alt="" className="an-deco-fixed" aria-hidden="true"
        />

        {/* Fond texturé */}
        <div className="an-texture-bg">

          {/* ── HÉRO PRINCIPAL ── */}
          <section className="an-hero">
            <div className="an-content-zone">

              {/* Invité personnalisé */}
              {guestNameAr && (
                <div className="an-guest">
                  <span className="an-guest-to">{guestPrefixAr || 'إلى السيد'}</span>
                  <span className="an-guest-name">{guestNameAr}</span>
                  <span className="an-guest-suffix">{guestSuffixAr || 'و حرمه'}</span>
                </div>
              )}

              {/* Bismillah */}
              <div className="an-bismillah">
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>

              <div className="an-line-divider"><span/></div>

              {/* Verset */}
              <div className="an-verse-wrap">
                <p className="an-verse">
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
                  وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
                  إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
                </p>
                <p className="an-verse-ref">[ الروم: ٢١ ]</p>
              </div>

              <div className="an-line-divider"><span/></div>

              {/* Intro texte — masquer le défaut français */}
              {wedding.intro_text && wedding.intro_text !== 'Vous êtes cordialement invités au mariage de' && (
                <p className="an-intro-text">
                  {wedding.intro_text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </p>
              )}

              {/* Familles */}
              {(wedding.bride_family_ar || wedding.groom_family_ar) ? (
                <>
                  {wedding.families_intro_ar && (
                    <p className="an-families-intro">
                      {wedding.families_intro_ar.split('\n').map((line, i) => (
                        <span key={i}>{line}<br/></span>
                      ))}
                    </p>
                  )}
                  <p className="an-honor">تتشرف</p>
                  <div className="an-families-row">
                    {wedding.groom_family_ar && (
                      <span>{wedding.groom_family_prefix_ar || 'عائلة'} {wedding.groom_family_ar}</span>
                    )}
                    {wedding.bride_family_ar && wedding.groom_family_ar && (
                      <span className="an-fam-and">و</span>
                    )}
                    {wedding.bride_family_ar && (
                      <span>{wedding.bride_family_prefix_ar || 'عائلة'} {wedding.bride_family_ar}</span>
                    )}
                  </div>
                  <p className="an-invite-line">بدعوتكم لحضور زفاف ابنيهما</p>
                </>
              ) : (
                <p className="an-honor">يتشرفان بدعوتكم لحضور حفل زفافهما</p>
              )}

              <div className="an-line-divider"><span/></div>

              {/* Noms — très grands */}
              <h1 className="an-names">
                {groomAr}
                <span className="an-and"> و </span>
                {brideAr}
              </h1>


              <div className="an-line-divider"><span/></div>

              {/* وذلك بمشيئة الله تعالى */}
              <p className="an-bismillah-will">وذلك بمشيئة الله تعالى</p>

              {/* Date / Programme en texte coulant */}
              {wedding.show_program !== false && wedding.program && (wedding.program as ProgramItem[]).length > 0 ? (
                <div className="an-program-text">
                  {(wedding.program as ProgramItem[]).map((item, i) => (
                    <p key={i} className="an-prog-line">
                      {item.event}
                      {item.time && <> على الساعة {toArabicNumerals(item.time)}</>}
                      {item.venue && <><br/><span className="an-prog-venue">« {item.venue} »</span></>}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="an-date-text">
                  <p className="an-date-line">
                    يوم {dayName} {dayNum} {monthAr} {yearAr}
                  </p>
                  <p className="an-date-line">على الساعة {timeAr}</p>
                  <p className="an-venue-name">{wedding.venue_name}</p>
                  {wedding.venue_address && (
                    <p className="an-venue-addr">« {wedding.venue_address} »</p>
                  )}
                </div>
              )}

              {/* GPS */}
              {(wedding.gps_google || wedding.gps_apple) && (
                <div className="an-gps-row" dir="ltr">
                  {wedding.gps_google && (
                    <a href={wedding.gps_google} target="_blank" rel="noreferrer" className="an-gps-btn">
                      Google Maps
                    </a>
                  )}
                  {wedding.gps_apple && (
                    <a href={wedding.gps_apple} target="_blank" rel="noreferrer" className="an-gps-btn">
                      Apple Maps
                    </a>
                  )}
                </div>
              )}

              <div className="an-line-divider"><span/></div>

              {/* Bénédiction — modifiable via custom_message */}
              <p className="an-blessing">
                {wedding.custom_message || 'وَلَكُمُ العَاقِبَةُ فِي الأَفْرَاحِ وَالمَسَرَّاتِ'}
              </p>

            </div>
          </section>

          {/* ── COMPTE À REBOURS ── */}
          {wedding.show_countdown !== false && (
            <section className="an-section">
              <div className="an-content-zone">
                <p className="an-section-label">العد التنازلي</p>
                <div className="an-countdown" dir="ltr">
                  {[
                    { val: countdown.d, label: 'يوم' },
                    { val: countdown.h, label: 'ساعة' },
                    { val: countdown.m, label: 'دقيقة' },
                    { val: countdown.s, label: 'ثانية' },
                  ].map((item, i) => (
                    <div key={i} className="an-cd">
                      <div className="an-cd-num">{toArabicNumerals(item.val)}</div>
                      <div className="an-cd-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── RSVP ── */}
          {wedding.show_rsvp && (
            <section className="an-section">
              <div className="an-content-zone">
                <p className="an-section-label">تأكيد الحضور</p>
                <p className="an-section-sub">Merci de confirmer votre présence</p>
                {rsvpStatus === 'done' ? (
                  <p className="an-success">جزاكم الله خيراً • Merci pour votre réponse</p>
                ) : (
                  <form className="an-form" onSubmit={submitRSVP} dir="ltr">
                    <input className="an-input" name="name" placeholder="Prénom et nom" required />
                    <input className="an-input" name="phone" placeholder="Numéro WhatsApp" />
                    <div className="an-radios">
                      {(['present', 'absent', 'maybe'] as const).map(s => (
                        <button key={s} type="button"
                          className={`an-radio${rsvpChoice === s ? ' an-radio-on' : ''}`}
                          onClick={() => setRsvpChoice(s)}
                        >
                          {s === 'present' ? '✓ Présent(e)' : s === 'absent' ? '✗ Absent(e)' : '? À confirmer'}
                        </button>
                      ))}
                    </div>
                    <input className="an-input" name="guests" type="number" min="0" max="20" placeholder="Nombre d'accompagnants" />
                    <textarea className="an-input an-textarea" name="note" placeholder="Message (optionnel)" />
                    <button className="an-submit" type="submit" disabled={rsvpStatus === 'loading'}>
                      {rsvpStatus === 'loading' ? 'Envoi...' : 'Confirmer'}
                    </button>
                  </form>
                )}
              </div>
            </section>
          )}

          {/* ── LIVRE D'OR ── */}
          {wedding.show_guestbook && (
            <section className="an-section">
              <div className="an-content-zone">
                <p className="an-section-label">دفتر التهاني</p>
                <p className="an-section-sub">Laissez un message de vœux</p>
                {messages.length > 0 && (
                  <div className="an-messages">
                    {messages.map(msg => (
                      <div key={msg.id} className="an-msg">
                        <p className="an-msg-text">{msg.message}</p>
                        <p className="an-msg-author">— {msg.author_name}</p>
                      </div>
                    ))}
                  </div>
                )}
                {gbStatus === 'done' ? (
                  <p className="an-success">{gbPending ? 'En attente de validation' : 'Message publié'}</p>
                ) : (
                  <form className="an-form" onSubmit={submitMessage} dir="ltr" style={{ marginTop: '20px' }}>
                    <input className="an-input" name="author_name" placeholder="Votre prénom" required />
                    <textarea className="an-input an-textarea" name="message" placeholder="Vos vœux..." required />
                    <button className="an-submit" type="submit" disabled={gbStatus === 'loading'}>
                      Publier
                    </button>
                  </form>
                )}
              </div>
            </section>
          )}

          {/* ── FOOTER ── */}
          <footer className="an-footer">
            <div className="an-content-zone">
              <p className="an-footer-names">{groomAr} و {brideAr}</p>
              <p className="an-footer-date" dir="rtl">{dayNum} {monthAr} {yearAr}</p>
              <p className="an-footer-date-fr">{dateFr}</p>
              <p className="an-footer-credit">Élégance Digitale™</p>
            </div>
          </footer>

        </div>{/* fin an-texture-bg */}
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Amiri', Georgia, serif;
    background: #1a1108;
    color: var(--an-text);
    overflow-x: hidden;
  }

  .an-invitation {
    opacity: 0;
    transition: opacity 1s ease;
    font-family: 'Amiri', Georgia, serif;
  }
  .an-visible { opacity: 1; }

  /* Décoration fixe */
  .an-deco-fixed {
    position: fixed;
    top: 0;
    pointer-events: none;
    z-index: 10;
    object-fit: fill;
  }
  @media (max-width: 768px) { .an-deco-fixed { left: 0; } }
  @media (min-width: 769px) { .an-deco-fixed { left: 50%; transform: translateX(-50%); } }

  /* Sections transparentes */
  .an-hero, .an-section, .an-footer {
    width: 100%;
    position: relative;
    background: transparent;
  }

  /* ── Invité ── */
  .an-guest {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    margin-bottom: 20px;
    padding: 14px 20px;
    background: rgba(201,168,76,0.07);
    border-top: 1px solid var(--an-border);
    border-bottom: 1px solid var(--an-border);
    width: 100%;
  }
  .an-guest-to, .an-guest-suffix {
    font-family: 'Reem Kufi', sans-serif;
    font-size: .85rem; color: var(--an-text-muted); letter-spacing: .04em;
  }
  .an-guest-name {
    font-family: 'Aref Ruqaa', serif;
    font-size: 1.5rem; font-weight: 700; color: var(--an-text);
  }

  /* ── Bismillah ── */
  .an-bismillah {
    font-family: 'Aref Ruqaa', serif;
    font-size: clamp(1.6rem, 5vw, 2.6rem);
    font-weight: 700;
    color: var(--an-text);
    line-height: 1.8;
    margin-top: 32px;
    margin-bottom: 20px;
  }

  /* ── Séparateur ligne fine ── */
  .an-line-divider {
    width: 100%;
    max-width: 260px;
    margin: 18px auto;
  }
  .an-line-divider span {
    display: block; height: 1px;
    background: linear-gradient(90deg, transparent, var(--an-border), transparent);
  }

  /* ── Verset ── */
  .an-verse-wrap { width: 100%; margin: 4px 0; }
  .an-verse {
    font-family: 'Amiri', serif;
    font-size: clamp(1rem, 2.8vw, 1.3rem);
    line-height: 2.2; color: var(--an-text-2); font-weight: 400;
  }
  .an-verse-ref {
    margin-top: 10px;
    font-family: 'Reem Kufi', sans-serif;
    font-size: .85rem; color: var(--an-accent); letter-spacing: .04em;
  }

  /* ── Intro / familles ── */
  .an-intro-text {
    font-family: 'Amiri', serif;
    font-size: clamp(.95rem, 2.5vw, 1.15rem);
    line-height: 2; color: var(--an-text-2);
    margin-bottom: 14px; width: 100%;
  }
  .an-families-intro {
    font-family: 'Amiri', serif;
    font-size: clamp(.9rem, 2.2vw, 1.05rem);
    color: var(--an-text-2); line-height: 1.9;
    margin-bottom: 10px; width: 100%;
  }
  .an-honor {
    font-family: 'Aref Ruqaa', serif;
    font-size: clamp(1.2rem, 3.5vw, 1.8rem);
    font-weight: 700; color: var(--an-text); margin: 10px 0;
  }
  .an-families-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    gap: .4em;
    width: 100%;
    font-family: 'Amiri', serif;
    font-size: clamp(.75rem, 2vw, .95rem);
    color: var(--an-text);
    font-weight: 700;
    line-height: 1.6;
    margin: 6px 0;
    text-align: center;
  }
  .an-fam-and {
    font-family: 'Aref Ruqaa', serif;
    font-size: 1.1em;
    color: var(--an-accent);
    font-weight: 400;
    flex-shrink: 0;
  }
  .an-invite-line {
    font-family: 'Amiri', serif;
    font-size: clamp(.9rem, 2.2vw, 1.05rem);
    color: var(--an-text-2); margin-top: 6px;
  }

  /* ── Noms — grands ── */
  .an-names {
    font-family: 'Aref Ruqaa', serif;
    font-size: clamp(2.4rem, 8vw, 4.8rem);
    font-weight: 700; color: var(--an-text);
    line-height: 1.25; letter-spacing: .02em;
    margin: 6px 0;
  }
  .an-and { color: var(--an-accent); font-weight: 400; font-size: 75%; }

  .an-custom {
    font-family: 'Amiri', serif;
    font-size: clamp(.95rem, 2.5vw, 1.15rem);
    font-style: italic; color: var(--an-text-2);
    line-height: 2; margin: 8px 0; width: 100%;
  }

  /* ── Volonté divine ── */
  .an-bismillah-will {
    font-family: 'Amiri', serif;
    font-size: clamp(1rem, 2.8vw, 1.3rem);
    color: var(--an-text-2);
    font-style: italic;
    margin-bottom: 10px;
    line-height: 1.9;
  }

  /* ── Date en texte coulant ── */
  .an-date-text, .an-program-text {
    width: 100%; display: flex; flex-direction: column;
    align-items: center; gap: 4px;
  }
  .an-date-line {
    font-family: 'Amiri', serif;
    font-size: clamp(1rem, 2.8vw, 1.2rem);
    color: var(--an-text); line-height: 2; font-weight: 700;
  }
  .an-venue-name {
    font-family: 'Aref Ruqaa', serif;
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    color: var(--an-text); font-weight: 700; margin-top: 6px;
  }
  .an-venue-addr {
    font-family: 'Amiri', serif;
    font-size: clamp(.9rem, 2.2vw, 1.05rem);
    font-style: italic; color: var(--an-text-2);
  }
  .an-prog-line {
    font-family: 'Amiri', serif;
    font-size: clamp(.95rem, 2.5vw, 1.15rem);
    color: var(--an-text); line-height: 2;
    width: 100%; text-align: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(201,168,76,0.15);
  }
  .an-prog-line:last-child { border-bottom: none; }
  .an-prog-venue {
    font-size: .9em; font-style: italic; color: var(--an-text-2);
  }

  /* ── GPS ── */
  .an-gps-row {
    display: flex; gap: 12px; margin-top: 16px;
    flex-wrap: wrap; justify-content: center;
  }
  .an-gps-btn {
    padding: 12px 28px;
    background: transparent;
    border: 1px solid var(--an-border);
    color: var(--an-text);
    font-family: 'Reem Kufi', sans-serif;
    font-size: .7rem; letter-spacing: .2em; text-transform: uppercase;
    text-decoration: none; transition: all .2s;
  }
  .an-gps-btn:hover { background: var(--an-accent); color: #fff; border-color: var(--an-accent); }

  /* ── Bénédiction ── */
  .an-blessing {
    font-family: 'Aref Ruqaa', serif;
    font-size: clamp(1rem, 3vw, 1.4rem);
    color: var(--an-text); line-height: 1.9; font-weight: 400;
  }

  /* ── Sections secondaires ── */
  .an-section-label {
    font-family: 'Aref Ruqaa', serif;
    font-size: clamp(1.3rem, 3.5vw, 1.9rem);
    color: var(--an-text); font-weight: 700; margin-bottom: 6px;
  }
  .an-section-sub {
    font-family: 'Reem Kufi', sans-serif;
    font-size: .75rem; letter-spacing: .2em; text-transform: uppercase;
    color: var(--an-accent); margin-bottom: 20px;
  }

  /* ── Countdown ── */
  .an-countdown { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .an-cd {
    display: flex; flex-direction: column; align-items: center;
    min-width: 62px; padding: 12px 8px;
    background: rgba(255,255,255,0.4);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid var(--an-border);
  }
  .an-cd-num {
    font-family: 'Aref Ruqaa', serif;
    font-size: 1.9rem; font-weight: 700;
    color: var(--an-gold); line-height: 1;
  }
  .an-cd-label {
    font-family: 'Reem Kufi', sans-serif;
    font-size: .7rem; color: var(--an-text-2); margin-top: 6px;
  }

  /* ── Formulaires ── */
  .an-form { width: 100%; display: flex; flex-direction: column; gap: 10px; }
  .an-input {
    width: 100%; padding: 13px 16px;
    background: rgba(255,255,255,0.5);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid var(--an-border);
    color: var(--an-text);
    font-family: Georgia, serif; font-size: .95rem;
    outline: none; transition: border-color .2s;
  }
  .an-input:focus { border-color: var(--an-accent); }
  .an-input::placeholder { color: rgba(26,26,26,0.4); font-style: italic; }
  .an-textarea { resize: vertical; min-height: 80px; }
  .an-radios { display: flex; gap: 6px; width: 100%; }
  .an-radio {
    flex: 1; min-width: 0; padding: 10px 4px;
    background: rgba(255,255,255,0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid var(--an-border);
    color: var(--an-text-2);
    font-family: 'Reem Kufi', sans-serif;
    font-size: clamp(.38rem, 2vw, .55rem);
    letter-spacing: 0; text-transform: uppercase;
    cursor: pointer; transition: all .2s; font-weight: 500;
    word-break: break-word; line-height: 1.3;
  }
  .an-radio-on, .an-radio:hover {
    background: var(--an-accent); border-color: var(--an-accent); color: #fff; font-weight: 600;
  }
  .an-submit {
    padding: 15px; background: var(--an-accent); color: #fff;
    border: none; font-family: 'Reem Kufi', sans-serif;
    font-size: .7rem; letter-spacing: .25em; text-transform: uppercase;
    font-weight: 600; cursor: pointer; transition: opacity .2s;
  }
  .an-submit:hover { opacity: .88; }
  .an-submit:disabled { opacity: .5; cursor: not-allowed; }
  .an-success {
    font-family: 'Aref Ruqaa', serif;
    font-size: 1.2rem; color: var(--an-accent); padding: 18px;
  }

  /* ── Messages ── */
  .an-messages { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
  .an-msg {
    background: rgba(250,247,240,0.5);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid var(--an-border);
    padding: 14px 18px; text-align: right;
  }
  .an-msg-text {
    font-family: 'Amiri', serif; font-size: 1rem; font-style: italic;
    color: var(--an-text-2); line-height: 1.8;
  }
  .an-msg-author {
    margin-top: 8px;
    font-family: 'Reem Kufi', sans-serif; font-size: .75rem;
    color: var(--an-accent); font-weight: 500; text-align: left;
  }

  /* ── Footer ── */
  .an-footer-names {
    font-family: 'Aref Ruqaa', serif;
    font-size: 1.6rem; color: var(--an-accent); margin-bottom: 4px; font-weight: 700;
  }
  .an-footer-date {
    font-family: 'Amiri', serif; font-size: .95rem;
    color: var(--an-text-2); margin-bottom: 4px;
  }
  .an-footer-date-fr {
    font-family: Georgia, serif; font-size: .8rem; font-style: italic;
    color: var(--an-text-muted); margin-bottom: 16px;
  }
  .an-footer-credit {
    font-family: 'Reem Kufi', sans-serif;
    font-size: .6rem; letter-spacing: .3em; text-transform: uppercase;
    color: var(--an-accent); opacity: .55;
  }

  @media (max-width: 600px) {
    .an-countdown { gap: 8px; }
    .an-cd { min-width: 54px; padding: 10px 6px; }
    .an-cd-num { font-size: 1.6rem; }
  }
`
