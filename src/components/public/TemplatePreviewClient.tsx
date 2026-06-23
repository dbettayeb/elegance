'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TEMPLATES_META } from '@/lib/templates-meta'

interface Props {
  templateId: string
  templateName: string
}

interface Fields {
  bride_name: string; groom_name: string
  bride_name_ar: string; groom_name_ar: string
  event_date: string; venue_name: string
  intro_text: string
  gps_google: string; gps_apple: string
}

const EMPTY: Fields = {
  bride_name: '', groom_name: '',
  bride_name_ar: '', groom_name_ar: '',
  event_date: '', venue_name: '',
  intro_text: '',
  gps_google: '', gps_apple: '',
}

function buildSrc(id: string, f: Fields) {
  const p = new URLSearchParams({ mode: 'card' })
  if (f.bride_name)    p.set('bride',       f.bride_name)
  if (f.groom_name)    p.set('groom',       f.groom_name)
  if (f.bride_name_ar) p.set('bride_ar',    f.bride_name_ar)
  if (f.groom_name_ar) p.set('groom_ar',    f.groom_name_ar)
  if (f.venue_name)    p.set('venue',       f.venue_name)
  if (f.event_date)    p.set('date',        f.event_date)
  if (f.intro_text)    p.set('intro',       f.intro_text)
  if (f.gps_google)    p.set('maps_google', f.gps_google)
  if (f.gps_apple)     p.set('maps_apple',  f.gps_apple)
  return `/templates/${id}/embed?${p.toString()}`
}

export default function TemplatePreviewClient({ templateId, templateName }: Props) {
  const router   = useRouter()
  const isArabic = TEMPLATES_META.find(t => t.id === templateId)?.language === 'ar'

  const [fields, setFields]     = useState<Fields>(EMPTY)
  const [panelOpen, setPanelOpen] = useState(true)
  const [iframeSrc, setIframeSrc] = useState(() => buildSrc(templateId, EMPTY))
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  function upd<K extends keyof Fields>(key: K, value: string) {
    setFields(f => ({ ...f, [key]: value }))
  }

  // Debounced reload on any field change
  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIframeSrc(buildSrc(templateId, fields))
    }, 450)
    return () => clearTimeout(timerRef.current)
  }, [fields, templateId])

  function handleChoose() {
    const p = new URLSearchParams({ template: templateId })
    if (fields.bride_name)    p.set('bride',    fields.bride_name)
    if (fields.groom_name)    p.set('groom',    fields.groom_name)
    if (fields.bride_name_ar) p.set('bride_ar', fields.bride_name_ar)
    if (fields.groom_name_ar) p.set('groom_ar', fields.groom_name_ar)
    if (fields.venue_name)    p.set('venue',    fields.venue_name)
    if (fields.event_date)    p.set('date',     fields.event_date)
    router.push(`/commander?${p.toString()}`)
  }

  return (
    <>
      <style>{CSS}</style>

      {/* ── BARRE TOP ── */}
      <div className="ptp-bar">
        <Link href="/templates" className="ptp-back">← Tous les designs</Link>
        <span className="ptp-name">{templateName}</span>
        <div className="ptp-bar-right">
          <button
            className="ptp-toggle-btn"
            onClick={() => setPanelOpen(o => !o)}
            title={panelOpen ? 'Voir en plein écran' : 'Modifier'}
          >
            {panelOpen ? '⛶ Plein écran' : '✏ Modifier'}
          </button>
          <button onClick={handleChoose} className="ptp-cta">
            Choisir ce design →
          </button>
        </div>
      </div>

      {/* ── CORPS SPLIT ── */}
      <div className={`ptp-body${panelOpen ? '' : ' ptp-body--full'}`}>

        {/* Aperçu */}
        <div className="ptp-preview">
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title={`Aperçu ${templateName}`}
            allow="autoplay"
            className="ptp-iframe"
          />
          {!panelOpen && (
            <button className="ptp-float-btn" onClick={() => setPanelOpen(true)}>
              ✏ Modifier
            </button>
          )}
        </div>

        {/* Panel */}
        {panelOpen && (
          <div className="ptp-panel">
            <div className="ptp-panel-inner">

              <Group title="Les prénoms">
                <Field label="Prénom de la mariée">
                  <input value={fields.bride_name} onChange={e => upd('bride_name', e.target.value)} placeholder="Yasmine" />
                </Field>
                <Field label="Prénom du marié">
                  <input value={fields.groom_name} onChange={e => upd('groom_name', e.target.value)} placeholder="Mehdi" />
                </Field>
                {isArabic && <>
                  <Field label="اسم العروس">
                    <input dir="rtl" value={fields.bride_name_ar} onChange={e => upd('bride_name_ar', e.target.value)} placeholder="ياسمين" />
                  </Field>
                  <Field label="اسم العريس">
                    <input dir="rtl" value={fields.groom_name_ar} onChange={e => upd('groom_name_ar', e.target.value)} placeholder="مهدي" />
                  </Field>
                </>}
              </Group>

              <Group title="La date & le lieu">
                <Field label="Date du mariage">
                  <input type="date" value={fields.event_date} onChange={e => upd('event_date', e.target.value)} />
                </Field>
                <Field label="Lieu de réception">
                  <input value={fields.venue_name} onChange={e => upd('venue_name', e.target.value)} placeholder="Dar El Jeld" />
                </Field>
              </Group>

              <Group title="Texte d'accueil">
                <Field label="Message d'introduction">
                  <textarea
                    rows={3}
                    value={fields.intro_text}
                    onChange={e => upd('intro_text', e.target.value)}
                    placeholder="Vous êtes cordialement invités au mariage de"
                  />
                </Field>
              </Group>

              <Group title="Liens Maps">
                <Field label="Google Maps" help="Collez le lien de partage Google Maps">
                  <input value={fields.gps_google} onChange={e => upd('gps_google', e.target.value)} placeholder="https://maps.google.com/…" />
                </Field>
                <Field label="Apple Maps" help="Collez le lien Apple Plans">
                  <input value={fields.gps_apple} onChange={e => upd('gps_apple', e.target.value)} placeholder="https://maps.apple.com/…" />
                </Field>
              </Group>

              <button onClick={handleChoose} className="ptp-panel-cta">
                Choisir ce design →
              </button>

            </div>
          </div>
        )}
      </div>
    </>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ptp-group">
      <div className="ptp-group-title">{title}</div>
      {children}
    </div>
  )
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="ptp-field">
      <label>{label}</label>
      {children}
      {help && <p className="ptp-help">{help}</p>}
    </div>
  )
}

const CSS = `
  /* ── Bar ── */
  .ptp-bar {
    flex-shrink: 0; display: flex; align-items: center; gap: 16px;
    padding: 12px 24px;
    background: rgba(255,255,255,0.97); backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--pub-border); z-index: 10;
  }
  .ptp-back { color: var(--pub-text-muted); text-decoration: none; font-size: 0.8rem; white-space: nowrap; }
  .ptp-back:hover { color: var(--pub-text); }
  .ptp-name { font-family: Georgia, serif; font-size: 0.95rem; flex: 1; }
  .ptp-bar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  .ptp-toggle-btn {
    padding: 7px 14px; background: transparent; color: var(--pub-text);
    border: 1px solid var(--pub-border); font-size: 0.7rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; font-family: inherit; white-space: nowrap;
    transition: all 0.2s;
  }
  .ptp-toggle-btn:hover { border-color: var(--pub-text); }

  .ptp-cta {
    padding: 8px 18px; background: var(--pub-text); color: #fff;
    border: none; font-size: 0.7rem; letter-spacing: 0.2em;
    text-transform: uppercase; font-weight: 500;
    cursor: pointer; font-family: inherit; white-space: nowrap;
    transition: opacity 0.2s;
  }
  .ptp-cta:hover { opacity: 0.85; }

  /* ── Body ── */
  .ptp-body {
    flex: 1; display: flex; flex-direction: row; min-height: 0; overflow: hidden;
  }

  /* ── Preview ── */
  .ptp-preview { flex: 1; position: relative; min-width: 0; }
  .ptp-iframe  { display: block; border: none; width: 100%; height: 100%; }

  /* Floating "Modifier" button in fullscreen */
  .ptp-float-btn {
    position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
    padding: 10px 24px; background: rgba(20,20,20,0.82); color: #fff;
    border: none; border-radius: 30px; font-size: 0.78rem;
    letter-spacing: 0.1em; cursor: pointer; font-family: inherit;
    backdrop-filter: blur(6px); transition: opacity 0.2s;
  }
  .ptp-float-btn:hover { opacity: 0.85; }

  /* ── Panel ── */
  .ptp-panel {
    width: 360px; flex-shrink: 0;
    border-left: 1px solid var(--pub-border);
    background: #fafafa; overflow-y: auto;
  }
  .ptp-panel-inner { padding: 24px 20px 40px; display: flex; flex-direction: column; gap: 28px; }

  .ptp-group { display: flex; flex-direction: column; gap: 14px; }
  .ptp-group-title {
    font-size: 0.62rem; letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--pub-gold-dark); padding-bottom: 8px;
    border-bottom: 1px solid var(--pub-border);
  }
  .ptp-field { display: flex; flex-direction: column; gap: 5px; }
  .ptp-field label {
    font-size: 0.72rem; letter-spacing: 0.08em; color: var(--pub-text-muted);
  }
  .ptp-field input, .ptp-field textarea {
    padding: 9px 0; background: transparent;
    border: none; border-bottom: 1px solid var(--pub-border);
    font-family: Georgia, serif; font-size: 0.92rem;
    color: var(--pub-text); outline: none; width: 100%;
    transition: border-color 0.2s; resize: vertical;
  }
  .ptp-field input:focus,
  .ptp-field textarea:focus { border-bottom-color: var(--pub-text); }
  .ptp-field input[type="date"] { font-family: inherit; font-size: 0.88rem; }
  .ptp-help {
    font-size: 0.68rem; color: var(--pub-text-subtle); font-style: italic; margin: 0;
  }

  .ptp-panel-cta {
    width: 100%; padding: 14px; margin-top: 4px;
    background: var(--pub-text); color: #fff; border: none;
    font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase;
    font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity 0.2s;
  }
  .ptp-panel-cta:hover { opacity: 0.85; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ptp-bar { padding: 10px 16px; }
    .ptp-name { display: none; }
    .ptp-toggle-btn { font-size: 0.65rem; padding: 6px 10px; }
    .ptp-cta { font-size: 0.65rem; padding: 7px 12px; }

    .ptp-body { flex-direction: column; }
    .ptp-preview { flex: 1; min-height: 0; }
    .ptp-panel {
      width: 100%; border-left: none;
      border-top: 1px solid var(--pub-border);
      max-height: 50vh; flex-shrink: 0;
    }
  }
`
