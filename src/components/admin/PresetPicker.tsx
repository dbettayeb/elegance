'use client'
import { useState, useRef, useEffect } from 'react'

interface Preset { label: string; value: string }

interface Props {
  presets: Preset[]
  onSelect: (value: string) => void
  triggerLabel?: string
}

export default function PresetPicker({ presets, onSelect, triggerLabel = 'Choisir un modèle' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <>
      <style>{CSS}</style>
      <div ref={ref} className="adm-pk">
        <button type="button" className={`adm-pk-btn${open ? ' adm-pk-btn--open' : ''}`}
          onClick={() => setOpen(o => !o)}>
          <span className="adm-pk-icon">✦</span>
          {triggerLabel}
          <span className="adm-pk-arrow">{open ? '▲' : '▾'}</span>
        </button>
        {open && (
          <div className="adm-pk-drop">
            {presets.map((p, i) => {
              const [line1, line2] = p.value.split('\n')
              return (
                <button type="button" key={i} className="adm-pk-card" dir="rtl"
                  onClick={() => { onSelect(p.value); setOpen(false) }}>
                  <span className="adm-pk-line1">{line1}</span>
                  {line2 && <span className="adm-pk-line2">{line2}</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

const CSS = `
  .adm-pk { position: relative; margin-bottom: 8px; }

  .adm-pk-btn {
    display: flex; align-items: center; gap: 7px;
    width: 100%; padding: 8px 12px;
    background: #fafaf8; border: 1px solid #e5e5e5;
    color: #737373; font-family: inherit; font-size: 0.7rem;
    letter-spacing: 0.08em; cursor: pointer; transition: all 0.18s;
    text-align: left; border-radius: 4px;
  }
  .adm-pk-btn:hover,
  .adm-pk-btn--open {
    border-color: #C9A84C; color: #8B6914;
    background: #fffdf6;
  }
  .adm-pk-icon { font-size: 0.6rem; opacity: 0.7; flex-shrink: 0; }
  .adm-pk-arrow { margin-left: auto; font-size: 0.55rem; flex-shrink: 0; }

  .adm-pk-drop {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 50;
    background: #fff; border: 1px solid #e8e2d6;
    box-shadow: 0 12px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
    border-radius: 4px; overflow: hidden;
    animation: admPkIn 0.15s ease;
  }
  @keyframes admPkIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .adm-pk-card {
    display: flex; flex-direction: column; gap: 2px;
    width: 100%; padding: 11px 14px;
    background: transparent; border: none;
    border-bottom: 1px solid #f0ece4;
    cursor: pointer; text-align: right;
    transition: background 0.12s, border-left 0.12s;
    border-left: 3px solid transparent;
  }
  .adm-pk-card:last-child { border-bottom: none; }
  .adm-pk-card:hover {
    background: #fdfaf3; border-left-color: #C9A84C;
  }
  .adm-pk-line1 {
    font-family: 'Amiri', Georgia, serif; font-size: 0.9rem;
    color: #171717; line-height: 1.6;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    display: block;
  }
  .adm-pk-line2 {
    font-family: 'Amiri', Georgia, serif; font-size: 0.82rem;
    color: #737373; line-height: 1.4;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    display: block; font-style: italic;
  }
`
