'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TEMPLATES_META } from '@/lib/templates-meta'
import { PACKS } from '@/lib/packs'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function OrderForm() {
  const searchParams = useSearchParams()
  const initialTemplate = searchParams.get('template') ?? ''
  const initialPack     = searchParams.get('pack')      ?? 'prestige'
  const fromPreview = !!(
    searchParams.get('bride') || searchParams.get('groom') ||
    searchParams.get('venue') || searchParams.get('date')
  )

  const [form, setForm] = useState({
    template_id:  initialTemplate,
    pack:         initialPack,
    bride_name:   searchParams.get('bride')    ?? '',
    groom_name:   searchParams.get('groom')    ?? '',
    bride_name_ar: searchParams.get('bride_ar') ?? '',
    groom_name_ar: searchParams.get('groom_ar') ?? '',
    couple_email: '',
    couple_phone: '',
    event_date:   searchParams.get('date')     ?? '',
    venue_name:   searchParams.get('venue')    ?? '',
    custom_message: '',
  })

  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')

  const selectedTemplate = TEMPLATES_META.find(t => t.id === form.template_id)
  const isArabicTemplate = selectedTemplate?.language === 'ar'

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.template_id || !form.pack) {
      setError('Veuillez choisir un design et un pack.')
      return
    }

    setStatus('loading')
    setError('')

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
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

  if (status === 'success') {
    return (
      <div className="of-success">
        <style>{CSS}</style>
        <div className="of-success-icon">✓</div>
        <h2 className="of-success-title">Demande envoyée</h2>
        <p className="of-success-msg">
          Merci ! Votre demande a bien été reçue.<br />
          Nous vous contactons sous 24h pour finaliser votre invitation.
        </p>
        <div className="of-success-ref">
          Référence : <strong>{reference}</strong>
        </div>
        <Link href="/" className="of-btn-primary" style={{ marginTop: 28 }}>
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="of-form">
      <style>{CSS}</style>

      <section className="of-section">
        <div className="of-section-head">
          <span className="of-num">01</span>
          <div>
            <h2 className="of-h">Votre design</h2>
            <p className="of-h-sub">
              {form.template_id
                ? 'Vous pouvez encore changer si vous hésitez.'
                : 'Choisissez l\'univers qui vous ressemble.'}
            </p>
          </div>
        </div>

        <div className="of-tpl-grid">
          {TEMPLATES_META.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => set('template_id', t.id)}
              className={`of-tpl${form.template_id === t.id ? ' of-tpl-on' : ''}`}
            >
              <div className="of-tpl-visual" style={{ background: t.palette[0] }}>
                <div className="of-tpl-name" style={{ color: t.palette[2] || t.palette[1] }}>
                  {t.name}
                </div>
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
            </button>
          ))}
        </div>
      </section>

      <section className="of-section">
        <div className="of-section-head">
          <span className="of-num">02</span>
          <div>
            <h2 className="of-h">Votre pack</h2>
            <p className="of-h-sub">Trois formules selon votre besoin.</p>
          </div>
        </div>

        <div className="of-pack-grid">
          {PACKS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => set('pack', p.id)}
              className={`of-pack${form.pack === p.id ? ' of-pack-on' : ''}`}
            >
              {p.highlight && <div className="of-pack-badge">Populaire</div>}
              <div className="of-pack-name">{p.name}</div>
              <div className="of-pack-price">
                {p.price} <span>{p.currency}</span>
              </div>
              <div className="of-pack-tagline">{p.tagline}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="of-section">
        <div className="of-section-head">
          <span className="of-num">03</span>
          <div>
            <h2 className="of-h">Vous</h2>
            <p className="of-h-sub">Parlez-nous un peu de vous.</p>
          </div>
        </div>

        <div className="of-fields">
          {fromPreview && (
            <div className="of-preview-banner">
              ✏ Vos modifications de l&apos;aperçu ont été reportées — vérifiez et complétez.
            </div>
          )}
          <div className="of-row">
            <Field label="Prénom de la mariée" required>
              <input className="of-input" value={form.bride_name} onChange={e => set('bride_name', e.target.value)} required />
            </Field>
            <Field label="Prénom du marié" required>
              <input className="of-input" value={form.groom_name} onChange={e => set('groom_name', e.target.value)} required />
            </Field>
          </div>

          {isArabicTemplate && (
            <>
              <div className="of-info-box">
                Vous avez choisi un design en arabe. Renseignez les prénoms dans les deux langues.
              </div>
              <div className="of-row">
                <Field label="Prénom de la mariée en arabe">
                  <input
                    className="of-input" dir="rtl"
                    value={form.bride_name_ar}
                    onChange={e => set('bride_name_ar', e.target.value)}
                    placeholder="ياسمين"
                    style={{ fontFamily: "'Amiri', serif", fontSize: '1.05rem' }}
                  />
                </Field>
                <Field label="Prénom du marié en arabe">
                  <input
                    className="of-input" dir="rtl"
                    value={form.groom_name_ar}
                    onChange={e => set('groom_name_ar', e.target.value)}
                    placeholder="مهدي"
                    style={{ fontFamily: "'Amiri', serif", fontSize: '1.05rem' }}
                  />
                </Field>
              </div>
            </>
          )}

          <div className="of-row">
            <Field label="Email" required help="Pour vous envoyer les liens.">
              <input className="of-input" type="email" value={form.couple_email} onChange={e => set('couple_email', e.target.value)} required />
            </Field>
            <Field label="Téléphone / WhatsApp" required help="Pour vous rappeler.">
              <input
                className="of-input" type="tel"
                value={form.couple_phone}
                onChange={e => set('couple_phone', e.target.value)}
                placeholder="+216 XX XXX XXX" required
              />
            </Field>
          </div>

          <div className="of-row">
            <Field label="Date du mariage" required help="Approximative si pas encore confirmée.">
              <input className="of-input" type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} required />
            </Field>
            <Field label="Lieu" help="Optionnel — vous pouvez compléter plus tard.">
              <input className="of-input" value={form.venue_name} onChange={e => set('venue_name', e.target.value)} placeholder="Ex : Dar El Jeld" />
            </Field>
          </div>

          <Field label="Un message pour nous ?" help="Demande particulière, contexte…">
            <textarea
              className="of-input of-textarea" rows={3}
              value={form.custom_message}
              onChange={e => set('custom_message', e.target.value)}
              placeholder="Optionnel"
            />
          </Field>
        </div>
      </section>

      {error && <div className="of-error">{error}</div>}

      <div className="of-actions">
        <button type="submit" disabled={status === 'loading'} className="of-btn-submit">
          {status === 'loading' ? 'Envoi…' : 'Envoyer ma demande'}
        </button>
        <p className="of-actions-note">Vous recevrez un retour sous 24h. Aucun paiement à ce stade.</p>
      </div>
    </form>
  )
}

function Field({ label, required, help, children }: {
  label: string; required?: boolean; help?: string; children: React.ReactNode
}) {
  return (
    <div className="of-field">
      <label className="of-label">
        {label}
        {required && <span className="of-required">*</span>}
      </label>
      {children}
      {help && <div className="of-help">{help}</div>}
    </div>
  )
}

const CSS = `
  .of-form {
    max-width: 920px; margin: 0 auto;
    padding: 48px 28px 96px;
    display: flex; flex-direction: column; gap: 56px;
  }
  .of-section-head {
    display: flex; align-items: flex-start; gap: 18px;
    margin-bottom: 28px; padding-bottom: 18px;
    border-bottom: 1px solid var(--pub-border);
  }
  .of-num {
    font-family: Georgia, serif; font-size: 1rem;
    color: var(--pub-gold); padding-top: 6px; letter-spacing: 0.1em;
  }
  .of-h { font-family: Georgia, serif; font-size: 1.6rem; font-weight: 300; margin-bottom: 4px; }
  .of-h-sub { color: var(--pub-text-muted); font-size: 0.92rem; font-style: italic; }

  .of-tpl-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px;
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
    font-family: Georgia, serif; font-size: 0.85rem;
    text-align: center; padding: 0 8px; line-height: 1.2;
  }
  .of-tpl-palette { position: absolute; bottom: 6px; left: 6px; display: flex; gap: 2px; }
  .of-tpl-swatch {
    width: 8px; height: 8px; border-radius: 50%;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .of-tpl-label { margin-top: 10px; font-size: 0.78rem; font-weight: 500; }
  .of-tpl-ar { color: var(--pub-text-muted); font-family: 'Amiri', serif; }

  .of-pack-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;
  }
  .of-pack {
    background: #fff; border: 2px solid var(--pub-border);
    padding: 22px 18px; cursor: pointer; text-align: left;
    transition: all 0.2s; position: relative; font-family: inherit;
  }
  .of-pack:hover { border-color: var(--pub-text-muted); }
  .of-pack-on { border-color: var(--pub-text); background: #fafafa; }
  .of-pack-badge {
    position: absolute; top: -10px; left: 16px;
    padding: 3px 10px; background: var(--pub-text); color: #fff;
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
  }
  .of-pack-name { font-family: Georgia, serif; font-size: 1.2rem; margin-bottom: 8px; }
  .of-pack-price { font-family: Georgia, serif; font-size: 2rem; font-weight: 300; margin-bottom: 4px; }
  .of-pack-price span { font-size: 0.8rem; color: var(--pub-text-muted); letter-spacing: 0.1em; }
  .of-pack-tagline { font-size: 0.78rem; color: var(--pub-text-muted); font-style: italic; }

  .of-fields { display: flex; flex-direction: column; gap: 22px; }
  .of-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .of-label {
    display: block; font-size: 0.8rem; letter-spacing: 0.05em;
    color: var(--pub-text); margin-bottom: 8px; font-weight: 500;
  }
  .of-required { color: var(--pub-gold-dark); margin-left: 4px; }
  .of-input {
    width: 100%; padding: 13px 0; background: transparent;
    border: none; border-bottom: 1px solid var(--pub-border);
    font-family: Georgia, serif; font-size: 1rem;
    outline: none; color: var(--pub-text);
    transition: border-color 0.2s;
  }
  .of-input::placeholder { color: var(--pub-text-subtle); font-style: italic; }
  .of-input:focus { border-bottom-color: var(--pub-text); }
  .of-textarea {
    resize: vertical; min-height: 60px;
    border: 1px solid var(--pub-border); padding: 13px 16px;
  }
  .of-textarea:focus { border-color: var(--pub-text); }
  .of-help {
    font-size: 0.74rem; color: var(--pub-text-subtle);
    margin-top: 6px; font-style: italic;
  }
  .of-info-box {
    padding: 12px 16px; background: rgba(184,152,90,0.08);
    border-left: 2px solid var(--pub-gold);
    font-size: 0.85rem; color: var(--pub-text-muted);
  }
  .of-preview-banner {
    padding: 12px 16px; background: rgba(184,152,90,0.08);
    border-left: 2px solid var(--pub-gold);
    font-size: 0.84rem; color: var(--pub-text-muted); font-style: italic;
  }
  .of-actions { text-align: center; padding-top: 32px; border-top: 1px solid var(--pub-border); }
  .of-btn-submit {
    padding: 18px 48px; background: var(--pub-text); color: #fff;
    border: none; font-size: 0.78rem; letter-spacing: 0.32em;
    text-transform: uppercase; font-weight: 500;
    cursor: pointer; transition: opacity 0.2s; font-family: inherit;
  }
  .of-btn-submit:hover { opacity: 0.88; }
  .of-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .of-actions-note {
    margin-top: 14px; font-size: 0.78rem;
    color: var(--pub-text-muted); font-style: italic;
  }
  .of-error {
    padding: 14px 18px; background: #fee2e2;
    border-left: 3px solid #dc2626; color: #991b1b; font-size: 0.9rem;
  }
  .of-success {
    max-width: 540px; margin: 0 auto;
    padding: 80px 28px; text-align: center;
  }
  .of-success-icon {
    width: 64px; height: 64px; margin: 0 auto 28px;
    background: var(--pub-text); color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
  }
  .of-success-title {
    font-family: Georgia, serif; font-size: 2rem;
    font-weight: 300; margin-bottom: 16px;
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
  @media (max-width: 640px) {
    .of-row { grid-template-columns: 1fr; }
    .of-form { padding: 32px 20px 64px; gap: 40px; }
  }
`