'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TEMPLATES_META } from '@/lib/templates-meta'

type Status = 'idle' | 'loading' | 'success' | 'error'
type StepId = 'design' | 'options' | 'coords' | 'preview'

const STEP_LABELS: Record<StepId, string> = {
  design:  'Design',
  options: 'Options',
  coords:  'Coordonnées',
  preview: 'Aperçu',
}

const PHONE_CODES = [
  { code: '+216', label: '🇹🇳 +216', country: 'Tunisie' },
  { code: '+213', label: '🇩🇿 +213', country: 'Algérie' },
  { code: '+212', label: '🇲🇦 +212', country: 'Maroc' },
  { code: '+218', label: '🇱🇾 +218', country: 'Libye' },
  { code: '+33',  label: '🇫🇷 +33',  country: 'France' },
  { code: '+32',  label: '🇧🇪 +32',  country: 'Belgique' },
  { code: '+41',  label: '🇨🇭 +41',  country: 'Suisse' },
  { code: '+49',  label: '🇩🇪 +49',  country: 'Allemagne' },
  { code: '+44',  label: '🇬🇧 +44',  country: 'Royaume-Uni' },
  { code: '+966', label: '🇸🇦 +966', country: 'Arabie Saoudite' },
  { code: '+971', label: '🇦🇪 +971', country: 'Émirats' },
  { code: '+974', label: '🇶🇦 +974', country: 'Qatar' },
  { code: '+965', label: '🇰🇼 +965', country: 'Koweït' },
]

const OPTIONS_DEF = [
  { id: 'countdown',            label: 'Compte à rebours',          desc: 'Décompte animé jusqu\'au jour J',           price: 0 },
  { id: 'program',              label: 'Programme',                  desc: 'Déroulé de la cérémonie pour vos invités',  price: 0 },
  { id: 'rsvp',                 label: 'RSVP',                       desc: 'Confirmation de présence en ligne',          price: 29 },
  { id: 'guestbook',            label: 'Livre d\'or',                desc: 'Messages et vœux de vos invités',           price: 29 },
  { id: 'personalised_invites', label: 'Invitations personnalisées', desc: 'Cartes nominatives envoyées par email',      price: 59 },
]

export default function OrderForm() {
  const searchParams = useSearchParams()
  const initialTemplate = searchParams.get('template') ?? ''
  const fromPreview = !!(
    searchParams.get('bride') || searchParams.get('groom') ||
    searchParams.get('venue') || searchParams.get('date')
  )

  const STEPS: StepId[] = fromPreview
    ? ['options', 'coords', 'preview']
    : ['design', 'options', 'coords', 'preview']

  const [currentStep, setCurrentStep] = useState<StepId>(STEPS[0])
  const [form, setForm] = useState({
    template_id:   initialTemplate,
    bride_name:    searchParams.get('bride')    ?? '',
    groom_name:    searchParams.get('groom')    ?? '',
    bride_name_ar: searchParams.get('bride_ar') ?? '',
    groom_name_ar: searchParams.get('groom_ar') ?? '',
    couple_email:  '',
    couple_phone:  '',
    event_date:    searchParams.get('date')     ?? '',
    venue_name:    searchParams.get('venue')    ?? '',
  })
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['countdown', 'program'])
  const [phoneCode, setPhoneCode] = useState('+216')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  const selectedTemplate = TEMPLATES_META.find(t => t.id === form.template_id)
  const isArabicTemplate = selectedTemplate?.language === 'ar'
  const stepIndex = STEPS.indexOf(currentStep)
  const basePrice = selectedTemplate?.basePrice ?? 59
  const optionsPrice = OPTIONS_DEF
    .filter(o => selectedOptions.includes(o.id))
    .reduce((s, o) => s + o.price, 0)
  const totalPrice = basePrice + optionsPrice

  function upd<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function toggleOption(id: string) {
    setSelectedOptions(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  function canProceed(): boolean {
    if (currentStep === 'design')  return !!form.template_id
    if (currentStep === 'coords') {
      return !!(form.bride_name && form.groom_name && form.couple_email && form.couple_phone)
    }
    return true
  }

  function goNext() {
    const next = STEPS[stepIndex + 1]
    if (next) { setError(''); setCurrentStep(next) }
  }

  function goBack() {
    const prev = STEPS[stepIndex - 1]
    if (prev) { setError(''); setCurrentStep(prev) }
  }

  async function handleSubmit() {
    setStatus('loading')
    setError('')

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id:   form.template_id,
        bride_name:    form.bride_name,
        groom_name:    form.groom_name,
        bride_name_ar: form.bride_name_ar || undefined,
        groom_name_ar: form.groom_name_ar || undefined,
        couple_email:  form.couple_email,
        couple_phone:  `${phoneCode}${form.couple_phone}`,
        event_date:    form.event_date || undefined,
        venue_name:    form.venue_name || undefined,
        options:       selectedOptions,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setStatus('success')
      setReference(data.reference)
    } else {
      setStatus('error')
      setError(data.error ?? 'Une erreur est survenue. Réessayez ou contactez-nous directement.')
    }
  }

  const iframeSrc = useMemo(() => {
    if (!form.template_id) return ''
    const p = new URLSearchParams()
    p.set('bride', form.bride_name || 'Mariée')
    p.set('groom', form.groom_name || 'Marié')
    if (form.event_date)    p.set('date',     form.event_date)
    if (form.venue_name)    p.set('venue',    form.venue_name)
    if (form.bride_name_ar) p.set('bride_ar', form.bride_name_ar)
    if (form.groom_name_ar) p.set('groom_ar', form.groom_name_ar)
    p.set('show_countdown', selectedOptions.includes('countdown') ? '1' : '0')
    p.set('show_rsvp',      selectedOptions.includes('rsvp')      ? '1' : '0')
    p.set('show_guestbook', selectedOptions.includes('guestbook') ? '1' : '0')
    return `/templates/${form.template_id}/embed?${p.toString()}`
  }, [form, selectedOptions])

  if (status === 'success') {
    return (
      <div className="of-success">
        <style>{CSS}</style>
        <div className="of-success-icon">✓</div>
        <h2 className="of-success-title">Demande envoyée !</h2>
        <p className="of-success-msg">
          Merci&nbsp;! Votre demande a bien été reçue.<br />
          Nous vous contactons sous 24h pour finaliser votre invitation.
        </p>
        <div className="of-success-ref">Référence : <strong>{reference}</strong></div>
        <Link href="/" className="of-btn-primary" style={{ marginTop: 28 }}>
          Retour à l&apos;accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="of-wrap">
      <style>{CSS}</style>

      {/* ── Design confirmé (visible si fromPreview) ──────────── */}
      {fromPreview && selectedTemplate && (
        <div className="of-design-bar">
          <div className="of-design-bar-swatch">
            {selectedTemplate.palette.slice(0, 4).map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </div>
          <div className="of-design-bar-body">
            <span className="of-design-bar-tag">Design confirmé</span>
            <span className="of-design-bar-name">{selectedTemplate.name}</span>
          </div>
          <Link href={`/templates/${form.template_id}`} className="of-design-bar-change">
            Modifier le design →
          </Link>
        </div>
      )}

      {/* ── Progression ───────────────────────────────────────── */}
      <nav className="of-progress">
        {STEPS.map((s, i) => (
          <div key={s} className={`of-ps${i < stepIndex ? ' of-ps--past' : ''}${i === stepIndex ? ' of-ps--active' : ''}`}>
            <div className="of-ps-dot">
              {i < stepIndex ? '✓' : String(i + 1).padStart(2, '0')}
            </div>
            <div className="of-ps-lbl">{STEP_LABELS[s]}</div>
            {i < STEPS.length - 1 && <div className="of-ps-line" />}
          </div>
        ))}
      </nav>

      {/* ── ÉTAPE : DESIGN ────────────────────────────────────── */}
      {currentStep === 'design' && (
        <section className="of-section">
          <header className="of-section-head">
            <h2 className="of-h">Choisissez votre design</h2>
            <p className="of-h-sub">Sélectionnez l&apos;univers qui vous ressemble.</p>
          </header>
          <div className="of-tpl-grid">
            {TEMPLATES_META.filter(t => !t.hidden).map(t => (
              <button key={t.id} type="button" onClick={() => upd('template_id', t.id)}
                className={`of-tpl${form.template_id === t.id ? ' of-tpl-on' : ''}`}>
                <div className="of-tpl-visual" style={{ background: t.palette[0] }}>
                  <div className="of-tpl-name" style={{ color: t.palette[2] || t.palette[1] }}>{t.name}</div>
                  <div className="of-tpl-palette">
                    {t.palette.slice(0, 4).map((c, i) => (
                      <div key={i} className="of-tpl-swatch" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="of-tpl-label">
                  {t.name}
                  {t.language === 'ar' && <span className="of-tpl-ar"> · عربي</span>}
                </div>
                <div className="of-tpl-price">{t.basePrice} DT</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── ÉTAPE : OPTIONS ───────────────────────────────────── */}
      {currentStep === 'options' && (
        <section className="of-section">
          <header className="of-section-head">
            <h2 className="of-h">Personnalisez votre invitation</h2>
            <p className="of-h-sub">Choisissez les fonctionnalités à inclure.</p>
          </header>
          <div className="of-options">
            {OPTIONS_DEF.map(opt => {
              const on = selectedOptions.includes(opt.id)
              return (
                <button key={opt.id} type="button" onClick={() => toggleOption(opt.id)}
                  className={`of-opt${on ? ' of-opt--on' : ''}`}>
                  <div className="of-opt-check">{on && <span>✓</span>}</div>
                  <div className="of-opt-body">
                    <div className="of-opt-label">{opt.label}</div>
                    <div className="of-opt-desc">{opt.desc}</div>
                  </div>
                  <div className="of-opt-price">
                    {opt.price === 0
                      ? <span className="of-opt-free">Gratuit</span>
                      : <><span className="of-opt-amount">{opt.price}</span><span className="of-opt-cur"> DT</span></>
                    }
                  </div>
                </button>
              )
            })}
          </div>
          <div className="of-total">
            <div className="of-total-breakdown">
              <span className="of-total-line">Invitation de base <strong>{basePrice} DT</strong></span>
              {optionsPrice > 0 && <span className="of-total-line">Options <strong>+{optionsPrice} DT</strong></span>}
            </div>
            <div className="of-total-right">
              <span className="of-total-label">Total estimé</span>
              <span className="of-total-amount">{totalPrice}<span className="of-total-cur"> DT</span></span>
            </div>
          </div>
          <p className="of-total-note">Le paiement intervient après validation de votre invitation.</p>
        </section>
      )}

      {/* ── ÉTAPE : COORDONNÉES ───────────────────────────────── */}
      {currentStep === 'coords' && (
        <section className="of-section">
          <header className="of-section-head">
            <h2 className="of-h">Vos coordonnées</h2>
            <p className="of-h-sub">C&apos;est tout ce dont nous avons besoin pour démarrer.</p>
          </header>
          <div className="of-fields">
            <div className="of-row">
              <Field label="Prénom de la mariée" required>
                <input className="of-input" value={form.bride_name}
                  onChange={e => upd('bride_name', e.target.value)} required />
              </Field>
              <Field label="Prénom du marié" required>
                <input className="of-input" value={form.groom_name}
                  onChange={e => upd('groom_name', e.target.value)} required />
              </Field>
            </div>
            <Field label="Email" required>
              <input className="of-input" type="email" value={form.couple_email}
                onChange={e => upd('couple_email', e.target.value)} required />
            </Field>
            <Field label="Téléphone / WhatsApp" required>
              <div className="of-phone">
                <select className="of-phone-code" value={phoneCode}
                  onChange={e => setPhoneCode(e.target.value)}>
                  {PHONE_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label} {c.country}</option>
                  ))}
                </select>
                <input className="of-input of-phone-num" type="tel" value={form.couple_phone}
                  onChange={e => upd('couple_phone', e.target.value)}
                  placeholder="XX XXX XXX" required />
              </div>
            </Field>
          </div>
        </section>
      )}

      {/* ── ÉTAPE : APERÇU FINAL ──────────────────────────────── */}
      {currentStep === 'preview' && (
        <section className="of-section">
          <header className="of-section-head">
            <h2 className="of-h">Vérification finale</h2>
            <p className="of-h-sub">Confirmez que tout vous convient avant de valider.</p>
          </header>

          <div className="of-summary">
            <div className="of-summary-row">
              <span className="of-summary-key">Design</span>
              <span className="of-summary-val">{selectedTemplate?.name ?? form.template_id}</span>
            </div>
            <div className="of-summary-row">
              <span className="of-summary-key">Couple</span>
              <span className="of-summary-val">{form.bride_name} &amp; {form.groom_name}</span>
            </div>
            {form.event_date && (
              <div className="of-summary-row">
                <span className="of-summary-key">Date</span>
                <span className="of-summary-val">
                  {new Date(form.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
            <div className="of-summary-row">
              <span className="of-summary-key">Options</span>
              <span className="of-summary-val">
                {OPTIONS_DEF.filter(o => selectedOptions.includes(o.id)).map(o => o.label).join(', ') || 'Aucune'}
              </span>
            </div>
            <div className="of-summary-row">
              <span className="of-summary-key">Base</span>
              <span className="of-summary-val">{basePrice} DT</span>
            </div>
            <div className="of-summary-row of-summary-row--total">
              <span className="of-summary-key">Total estimé</span>
              <span className="of-summary-val of-summary-price">{totalPrice} DT</span>
            </div>
          </div>

          {iframeSrc && (
            <div className="of-iframe-outer">
              <p className="of-iframe-label">Aperçu de votre invitation</p>
              <div className="of-iframe-wrap">
                <iframe src={iframeSrc} className="of-iframe" title="Aperçu de votre invitation" />
              </div>
              <p className="of-iframe-hint">Faites défiler pour voir l&apos;invitation complète.</p>
            </div>
          )}
        </section>
      )}

      {error && <div className="of-error">{error}</div>}

      {/* ── Navigation ────────────────────────────────────────── */}
      <div className="of-nav">
        <div>
          {stepIndex > 0 && (
            <button type="button" onClick={goBack} className="of-btn-back">
              ← Retour
            </button>
          )}
        </div>
        <div className="of-nav-right">
          {currentStep !== 'preview' && (
            <button type="button" onClick={goNext} disabled={!canProceed()} className="of-btn-next">
              Continuer →
            </button>
          )}
          {currentStep === 'preview' && (
            <button type="button" onClick={handleSubmit} disabled={status === 'loading'} className="of-btn-submit">
              {status === 'loading' ? 'Envoi en cours…' : 'Confirmer ma commande'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, help, children }: {
  label: string; required?: boolean; help?: string; children: React.ReactNode
}) {
  return (
    <div className="of-field">
      <label className="of-label">
        {label}{required && <span className="of-required"> *</span>}
      </label>
      {children}
      {help && <div className="of-help">{help}</div>}
    </div>
  )
}

const CSS = `
  /* ── Wrap ───────────────────────────────────────────────────── */
  .of-wrap {
    max-width: 760px; margin: 0 auto;
    padding: 0 28px 96px;
    display: flex; flex-direction: column; gap: 0;
  }

  /* ── Design bar (fromPreview) ───────────────────────────────── */
  .of-design-bar {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 20px; margin-bottom: 8px;
    background: #fafafa; border: 1px solid var(--pub-border);
  }
  .of-design-bar-swatch {
    display: flex; gap: 3px; flex-shrink: 0;
  }
  .of-design-bar-swatch span {
    display: block; width: 14px; height: 14px; border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .of-design-bar-body {
    flex: 1; display: flex; flex-direction: column; gap: 1px;
  }
  .of-design-bar-tag {
    font-size: 0.62rem; letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--pub-gold); font-weight: 500;
  }
  .of-design-bar-name {
    font-family: Georgia, serif; font-size: 0.95rem; font-weight: 300;
  }
  .of-design-bar-change {
    font-size: 0.75rem; color: var(--pub-text-muted);
    text-decoration: none; white-space: nowrap;
    border-bottom: 1px solid transparent; transition: all 0.2s;
  }
  .of-design-bar-change:hover { color: var(--pub-text); border-bottom-color: var(--pub-text); }

  /* ── Progress ───────────────────────────────────────────────── */
  .of-progress {
    display: flex; align-items: center; justify-content: center;
    padding: 32px 0 48px; gap: 0;
  }
  .of-ps { display: flex; align-items: center; gap: 0; }
  .of-ps-dot {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid var(--pub-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; letter-spacing: 0.05em; color: var(--pub-text-muted);
    background: #fff; transition: all 0.3s; font-family: Georgia, serif;
  }
  .of-ps--past .of-ps-dot {
    background: var(--pub-text); border-color: var(--pub-text);
    color: #fff; font-size: 0.7rem;
  }
  .of-ps--active .of-ps-dot {
    border-color: var(--pub-text); color: var(--pub-text); font-weight: 600;
  }
  .of-ps-lbl {
    margin-left: 8px; font-size: 0.72rem; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--pub-text-muted);
    transition: color 0.3s;
  }
  .of-ps--active .of-ps-lbl { color: var(--pub-text); }
  .of-ps--past .of-ps-lbl   { color: var(--pub-text-muted); }
  .of-ps-line {
    width: 48px; height: 1px; background: var(--pub-border);
    margin: 0 12px; flex-shrink: 0;
  }

  /* ── Section ────────────────────────────────────────────────── */
  .of-section { margin-bottom: 0; }
  .of-section-head { margin-bottom: 32px; }
  .of-h { font-family: Georgia, serif; font-size: 1.55rem; font-weight: 300; margin-bottom: 6px; }
  .of-h-sub { color: var(--pub-text-muted); font-size: 0.9rem; font-style: italic; }

  /* ── Template grid ──────────────────────────────────────────── */
  .of-tpl-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 12px;
  }
  .of-tpl {
    background: transparent; border: 2px solid transparent;
    padding: 4px; cursor: pointer; text-align: center;
    transition: all 0.2s; font-family: inherit;
  }
  .of-tpl:hover { transform: translateY(-2px); }
  .of-tpl-on { border-color: var(--pub-text); }
  .of-tpl-visual {
    aspect-ratio: 3 / 4; position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .of-tpl-name {
    font-family: Georgia, serif; font-size: 0.8rem;
    text-align: center; padding: 0 8px; line-height: 1.2;
  }
  .of-tpl-palette { position: absolute; bottom: 6px; left: 6px; display: flex; gap: 2px; }
  .of-tpl-swatch {
    width: 7px; height: 7px; border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .of-tpl-label { margin-top: 8px; font-size: 0.76rem; font-weight: 500; }
  .of-tpl-ar { color: var(--pub-text-muted); font-family: 'Amiri', serif; }
  .of-tpl-price {
    font-family: Georgia, serif; font-size: 0.82rem; font-weight: 300;
    color: var(--pub-gold-dark, #8C7042); margin-top: 2px;
  }

  /* ── Options ────────────────────────────────────────────────── */
  .of-options { display: flex; flex-direction: column; gap: 10px; }
  .of-opt {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 20px; border: 1.5px solid var(--pub-border);
    cursor: pointer; text-align: left; background: #fff;
    transition: all 0.2s; font-family: inherit; width: 100%;
  }
  .of-opt:hover { border-color: var(--pub-text-muted); }
  .of-opt--on { border-color: var(--pub-text); background: #fafafa; }
  .of-opt-check {
    width: 20px; height: 20px; border: 1.5px solid var(--pub-border);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 0.7rem; transition: all 0.2s;
    color: transparent;
  }
  .of-opt--on .of-opt-check {
    border-color: var(--pub-text); background: var(--pub-text); color: #fff;
  }
  .of-opt-body { flex: 1; min-width: 0; }
  .of-opt-label { font-size: 0.92rem; font-weight: 500; margin-bottom: 2px; }
  .of-opt-desc { font-size: 0.78rem; color: var(--pub-text-muted); }
  .of-opt-price { text-align: right; white-space: nowrap; flex-shrink: 0; }
  .of-opt-free {
    font-size: 0.68rem; letter-spacing: 0.15em; font-weight: 600;
    text-transform: uppercase; color: var(--pub-gold);
  }
  .of-opt-amount { font-family: Georgia, serif; font-size: 1.15rem; font-weight: 300; }
  .of-opt-cur { font-size: 0.75rem; color: var(--pub-text-muted); }

  .of-total {
    display: flex; justify-content: space-between; align-items: flex-end; gap: 12px;
    margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--pub-border);
  }
  .of-total-breakdown {
    display: flex; flex-direction: column; gap: 3px;
  }
  .of-total-line {
    font-size: 0.8rem; color: var(--pub-text-muted);
  }
  .of-total-line strong { color: var(--pub-text); font-weight: 500; }
  .of-total-right { text-align: right; }
  .of-total-label {
    display: block; font-size: 0.72rem; text-transform: uppercase;
    letter-spacing: 0.15em; color: var(--pub-text-muted); margin-bottom: 2px;
  }
  .of-total-amount { font-family: Georgia, serif; font-size: 2rem; font-weight: 300; }
  .of-total-cur { font-size: 0.8rem; color: var(--pub-text-muted); }
  .of-total-note {
    text-align: right; font-size: 0.74rem; color: var(--pub-text-subtle);
    font-style: italic; margin-top: 6px;
  }

  /* ── Fields ─────────────────────────────────────────────────── */
  .of-fields { display: flex; flex-direction: column; gap: 24px; }
  .of-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .of-field { display: flex; flex-direction: column; }
  .of-label {
    font-size: 0.75rem; letter-spacing: 0.07em; font-weight: 500;
    color: var(--pub-text); margin-bottom: 10px;
  }
  .of-required { color: var(--pub-gold-dark, #a07840); }
  .of-input {
    width: 100%; padding: 12px 0; background: transparent;
    border: none; border-bottom: 1px solid var(--pub-border);
    font-family: Georgia, serif; font-size: 1rem;
    outline: none; color: var(--pub-text); transition: border-color 0.2s;
  }
  .of-input::placeholder { color: var(--pub-text-subtle); font-style: italic; }
  .of-input:focus { border-bottom-color: var(--pub-text); }
  .of-help { font-size: 0.73rem; color: var(--pub-text-subtle); margin-top: 6px; font-style: italic; }

  /* ── Phone ──────────────────────────────────────────────────── */
  .of-phone { display: flex; align-items: flex-end; gap: 0; }
  .of-phone-code {
    flex-shrink: 0; padding: 12px 10px 12px 0;
    background: transparent; border: none;
    border-bottom: 1px solid var(--pub-border);
    font-family: inherit; font-size: 0.88rem; color: var(--pub-text);
    cursor: pointer; outline: none; transition: border-color 0.2s;
    appearance: none; -webkit-appearance: none;
    padding-right: 20px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 4px center;
    background-size: 8px;
  }
  .of-phone-code:focus { border-bottom-color: var(--pub-text); }
  .of-phone-num { flex: 1; margin-left: 12px; }

  /* ── Summary ────────────────────────────────────────────────── */
  .of-summary {
    border: 1px solid var(--pub-border); margin-bottom: 32px;
  }
  .of-summary-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 12px 20px; border-bottom: 1px solid var(--pub-border);
    gap: 16px;
  }
  .of-summary-row:last-child { border-bottom: none; }
  .of-summary-row--total { background: #fafafa; }
  .of-summary-key {
    font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--pub-text-muted); flex-shrink: 0;
  }
  .of-summary-val { font-family: Georgia, serif; font-size: 0.95rem; text-align: right; }
  .of-summary-price { font-size: 1.1rem; font-weight: 300; color: var(--pub-text); }

  /* ── Iframe ─────────────────────────────────────────────────── */
  .of-iframe-outer { margin-top: 8px; }
  .of-iframe-label {
    font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--pub-text-muted); margin-bottom: 10px;
  }
  .of-iframe-wrap {
    width: 100%; height: 640px;
    border: 1px solid var(--pub-border);
    overflow: hidden; background: #f4f4f4;
  }
  .of-iframe { width: 100%; height: 100%; border: 0; display: block; }
  .of-iframe-hint {
    font-size: 0.72rem; color: var(--pub-text-subtle);
    font-style: italic; margin-top: 8px; text-align: center;
  }

  /* ── Nav ────────────────────────────────────────────────────── */
  .of-nav {
    display: flex; justify-content: space-between; align-items: center;
    padding: 36px 0 0; margin-top: 40px;
    border-top: 1px solid var(--pub-border);
  }
  .of-nav-right { display: flex; }
  .of-btn-back {
    background: transparent; border: 1px solid var(--pub-border);
    padding: 13px 26px; font-size: 0.78rem; cursor: pointer;
    color: var(--pub-text-muted); letter-spacing: 0.1em;
    font-family: inherit; transition: all 0.2s;
  }
  .of-btn-back:hover { border-color: var(--pub-text); color: var(--pub-text); }
  .of-btn-next {
    padding: 15px 36px; background: var(--pub-text); color: #fff;
    border: none; font-size: 0.78rem; letter-spacing: 0.28em;
    text-transform: uppercase; cursor: pointer; font-family: inherit;
    transition: opacity 0.2s;
  }
  .of-btn-next:hover { opacity: 0.85; }
  .of-btn-next:disabled { opacity: 0.4; cursor: not-allowed; }
  .of-btn-submit {
    padding: 17px 44px; background: var(--pub-gold-dark, #8b6914); color: #fff;
    border: none; font-size: 0.78rem; letter-spacing: 0.28em;
    text-transform: uppercase; cursor: pointer; font-family: inherit;
    transition: opacity 0.2s;
  }
  .of-btn-submit:hover { opacity: 0.88; }
  .of-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Error ──────────────────────────────────────────────────── */
  .of-error {
    margin-top: 20px; padding: 14px 18px; background: #fee2e2;
    border-left: 3px solid #dc2626; color: #991b1b; font-size: 0.88rem;
  }

  /* ── Success ────────────────────────────────────────────────── */
  .of-success {
    max-width: 520px; margin: 0 auto; padding: 80px 28px; text-align: center;
  }
  .of-success-icon {
    width: 64px; height: 64px; margin: 0 auto 28px;
    background: var(--pub-text); color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
  }
  .of-success-title {
    font-family: Georgia, serif; font-size: 2rem; font-weight: 300; margin-bottom: 16px;
  }
  .of-success-msg {
    font-family: Georgia, serif; font-style: italic;
    font-size: 1.05rem; color: var(--pub-text-muted);
    line-height: 1.8; margin-bottom: 24px;
  }
  .of-success-ref {
    display: inline-block; padding: 8px 16px;
    background: #fafafa; border: 1px solid var(--pub-border);
    font-family: ui-monospace, monospace; font-size: 0.85rem; letter-spacing: 0.05em;
  }
  .of-btn-primary {
    display: inline-block; padding: 14px 32px;
    background: var(--pub-text); color: #fff; text-decoration: none;
    font-size: 0.75rem; letter-spacing: 0.3em;
    text-transform: uppercase; font-weight: 500;
  }

  /* ── Responsive ─────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .of-wrap { padding: 0 20px 64px; }
    .of-row { grid-template-columns: 1fr; }
    .of-ps-lbl { display: none; }
    .of-ps-line { width: 28px; margin: 0 6px; }
    .of-iframe-wrap { height: 480px; }
    .of-tpl-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  }
`
