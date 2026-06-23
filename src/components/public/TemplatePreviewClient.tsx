'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Props {
  templateId: string
  templateName: string
}

const DEFAULTS = {
  bride_name: 'Yasmine', groom_name: 'Mehdi',
  bride_name_ar: 'ياسمين', groom_name_ar: 'مهدي',
  venue_name: '',
}

function buildSrc(id: string, fields: Record<string, string>, date: string) {
  const p = new URLSearchParams({ mode: 'edit' })
  if (fields.bride_name)   p.set('bride',    fields.bride_name)
  if (fields.groom_name)   p.set('groom',    fields.groom_name)
  if (fields.bride_name_ar) p.set('bride_ar', fields.bride_name_ar)
  if (fields.groom_name_ar) p.set('groom_ar', fields.groom_name_ar)
  if (fields.venue_name)   p.set('venue',    fields.venue_name)
  if (date)                p.set('date',     date)
  return `/templates/${id}/embed?${p.toString()}`
}

export default function TemplatePreviewClient({ templateId, templateName }: Props) {
  const [date, setDate] = useState('')
  // fieldsRef tracks inline edits received via postMessage without causing re-renders
  const fieldsRef = useRef<Record<string, string>>(DEFAULTS)
  const [iframeSrc, setIframeSrc] = useState(() => buildSrc(templateId, DEFAULTS, ''))
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Receive inline field edits from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== 'EF_CHANGE') return
      fieldsRef.current = { ...fieldsRef.current, [e.data.field]: e.data.value }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Reload iframe (with latest field values) only when date changes
  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIframeSrc(buildSrc(templateId, fieldsRef.current, date))
    }, 400)
    return () => clearTimeout(timerRef.current)
  }, [date, templateId])

  return (
    <>
      <style>{CSS}</style>

      <div className="ptp-bar">
        <div className="ptp-bar-inner">
          <Link href="/templates" className="ptp-back">← Tous les designs</Link>

          <div className="ptp-info">
            <span className="ptp-info-name">{templateName}</span>
            <span className="ptp-info-hint">✏ Cliquez sur les prénoms pour modifier</span>
          </div>

          <div className="ptp-bar-actions">
            <div className="ptp-date-wrap">
              <label htmlFor="ptp-date" className="ptp-date-lbl">Date du mariage</label>
              <input
                id="ptp-date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="ptp-date-input"
              />
            </div>
            <Link href={`/commander?template=${templateId}`} className="ptp-cta">
              Choisir ce design →
            </Link>
          </div>
        </div>
      </div>

      <iframe
        key={iframeSrc}
        src={iframeSrc}
        title={`Aperçu ${templateName}`}
        allow="autoplay"
        className="ptp-iframe"
      />
    </>
  )
}

const CSS = `
  .ptp-bar {
    flex-shrink: 0;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--pub-border);
    z-index: 10;
  }
  .ptp-bar-inner {
    max-width: 1180px; margin: 0 auto; padding: 14px 28px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .ptp-back { color: var(--pub-text-muted); text-decoration: none; font-size: 0.82rem; }
  .ptp-back:hover { color: var(--pub-text); }

  .ptp-info { display: flex; align-items: center; gap: 14px; }
  .ptp-info-name { font-family: Georgia, serif; font-size: 1rem; }
  .ptp-info-hint {
    font-size: 0.72rem; color: var(--pub-text-muted); font-style: italic;
    letter-spacing: 0.02em;
  }

  .ptp-bar-actions { display: flex; align-items: center; gap: 14px; }

  .ptp-date-wrap { display: flex; flex-direction: column; gap: 3px; }
  .ptp-date-lbl {
    font-size: 0.64rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--pub-text-subtle);
  }
  .ptp-date-input {
    padding: 7px 10px; border: 1px solid var(--pub-border);
    background: #fff; font-family: inherit; font-size: 0.84rem;
    color: var(--pub-text); outline: none; cursor: pointer;
    transition: border-color 0.2s;
  }
  .ptp-date-input:focus { border-color: var(--pub-text); }

  .ptp-cta {
    padding: 9px 20px; background: var(--pub-text); color: #fff;
    text-decoration: none; font-size: 0.72rem;
    letter-spacing: 0.2em; text-transform: uppercase;
    font-weight: 500; white-space: nowrap; transition: opacity 0.2s;
  }
  .ptp-cta:hover { opacity: 0.85; }

  .ptp-iframe {
    display: block; border: none; width: 100%; flex: 1; min-height: 0;
  }

  @media (max-width: 720px) {
    .ptp-info { display: none; }
    .ptp-bar-inner { padding: 12px 18px; gap: 10px; }
    .ptp-cta { padding: 7px 14px; font-size: 0.66rem; }
    .ptp-date-wrap { flex-direction: row; align-items: center; gap: 8px; }
    .ptp-date-lbl { display: none; }
    .ptp-date-input { font-size: 0.78rem; padding: 6px 8px; }
  }
`
