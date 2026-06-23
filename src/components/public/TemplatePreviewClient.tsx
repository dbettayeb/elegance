'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Props {
  templateId: string
  templateName: string
}

export default function TemplatePreviewClient({ templateId, templateName }: Props) {
  const [bride, setBride] = useState('Yasmine')
  const [groom, setGroom] = useState('Mehdi')
  const [date, setDate]   = useState('')
  const [panelOpen, setPanelOpen]   = useState(false)
  const [iframeSrc, setIframeSrc]   = useState(`/templates/${templateId}/embed`)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const p = new URLSearchParams()
      if (bride.trim()) p.set('bride', bride.trim())
      if (groom.trim()) p.set('groom', groom.trim())
      if (date)         p.set('date', date)
      setIframeSrc(`/templates/${templateId}/embed?${p.toString()}`)
    }, 700)
    return () => clearTimeout(timerRef.current)
  }, [bride, groom, date, templateId])

  return (
    <>
      <style>{CSS}</style>

      <div className="ptp-bar">
        <div className="ptp-bar-inner">
          <Link href="/templates" className="ptp-back">← Tous les designs</Link>

          <div className="ptp-info">
            <span className="ptp-info-name">{templateName}</span>
            <span className="ptp-info-tag">Aperçu démo</span>
          </div>

          <div className="ptp-bar-actions">
            <button
              onClick={() => setPanelOpen(o => !o)}
              className={`ptp-personalize-btn${panelOpen ? ' ptp-personalize-active' : ''}`}
              aria-expanded={panelOpen}
            >
              <span className="ptp-btn-icon">{panelOpen ? '✕' : '✏'}</span>
              <span>Personnaliser</span>
            </button>
            <Link href={`/commander?template=${templateId}`} className="ptp-cta">
              Choisir ce design →
            </Link>
          </div>
        </div>

        {panelOpen && (
          <div className="ptp-panel">
            <div className="ptp-panel-inner">
              <div className="ptp-hint">Entrez vos prénoms pour voir l&apos;invitation à votre image.</div>
              <div className="ptp-fields">
                <div className="ptp-field">
                  <label htmlFor="ptp-bride">Prénom mariée</label>
                  <input
                    id="ptp-bride"
                    value={bride}
                    onChange={e => setBride(e.target.value)}
                    placeholder="ex : Yasmine"
                    maxLength={40}
                    autoComplete="off"
                  />
                </div>
                <div className="ptp-field">
                  <label htmlFor="ptp-groom">Prénom marié</label>
                  <input
                    id="ptp-groom"
                    value={groom}
                    onChange={e => setGroom(e.target.value)}
                    placeholder="ex : Mehdi"
                    maxLength={40}
                    autoComplete="off"
                  />
                </div>
                <div className="ptp-field">
                  <label htmlFor="ptp-date">Date du mariage</label>
                  <input
                    id="ptp-date"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
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

  .ptp-info { display: flex; align-items: center; gap: 12px; }
  .ptp-info-name { font-family: Georgia, serif; font-size: 1rem; }
  .ptp-info-tag {
    padding: 3px 9px; background: rgba(184,152,90,0.15);
    color: var(--pub-gold-dark); font-size: 0.66rem;
    letter-spacing: 0.2em; text-transform: uppercase; border-radius: 2px;
  }

  .ptp-bar-actions { display: flex; align-items: center; gap: 10px; }

  .ptp-personalize-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    background: transparent; color: var(--pub-text);
    border: 1px solid var(--pub-border);
    font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
    white-space: nowrap;
  }
  .ptp-personalize-btn:hover { border-color: var(--pub-text); }
  .ptp-personalize-active { background: var(--pub-text); color: #fff; border-color: var(--pub-text); }
  .ptp-btn-icon { font-size: 0.85rem; }

  .ptp-cta {
    padding: 9px 20px; background: var(--pub-text); color: #fff;
    text-decoration: none; font-size: 0.72rem;
    letter-spacing: 0.2em; text-transform: uppercase;
    font-weight: 500; white-space: nowrap; transition: opacity 0.2s;
  }
  .ptp-cta:hover { opacity: 0.85; }

  /* Personnalisation panel */
  .ptp-panel {
    border-top: 1px solid var(--pub-border);
    background: #fafafa;
  }
  .ptp-panel-inner {
    max-width: 1180px; margin: 0 auto; padding: 18px 28px;
  }
  .ptp-hint {
    font-size: 0.8rem; color: var(--pub-text-muted); font-style: italic;
    margin-bottom: 14px;
  }
  .ptp-fields {
    display: flex; gap: 16px; flex-wrap: wrap;
  }
  .ptp-field {
    display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 160px;
  }
  .ptp-field label {
    font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--pub-text-subtle);
  }
  .ptp-field input {
    padding: 9px 12px;
    border: 1px solid var(--pub-border);
    background: #fff;
    font-family: Georgia, serif; font-size: 0.92rem;
    color: var(--pub-text); outline: none;
    transition: border-color 0.2s;
  }
  .ptp-field input:focus { border-color: var(--pub-text); }
  .ptp-field input[type="date"] { font-family: inherit; }

  .ptp-iframe {
    display: block; border: none; width: 100%; flex: 1; min-height: 0;
  }

  @media (max-width: 720px) {
    .ptp-info { display: none; }
    .ptp-bar-inner { padding: 12px 18px; }
    .ptp-cta { padding: 7px 14px; font-size: 0.66rem; }
    .ptp-personalize-btn { padding: 7px 12px; font-size: 0.68rem; }
    .ptp-btn-icon { display: none; }
    .ptp-panel-inner { padding: 14px 18px; }
    .ptp-fields { gap: 12px; }
  }
`
