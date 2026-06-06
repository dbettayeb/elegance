'use client'
import { useState } from 'react'

export interface ProgramItem  {
  time: string
  event: string
  venue?: string
}

export default function ProgramEditor({
  initial,
  onChange,
}: {
  initial: ProgramItem []
  onChange: (items: ProgramItem []) => void
}) {
  const [items, setItems] = useState<ProgramItem []>(initial.length ? initial : [])

  function update(next: ProgramItem []) {
    setItems(next)
    onChange(next)
  }

  function addItem() {
    update([...items, { time: '19:00', event: '', venue: '' }])
  }

  function removeItem(index: number) {
    update(items.filter((_, i) => i !== index))
  }

  function updateField(index: number, field: keyof ProgramItem , value: string) {
    update(items.map((it, i) => (i === index ? { ...it, [field]: value } : it)))
  }

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...items]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    update(next)
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return
    const next = [...items]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    update(next)
  }

  return (
    <div className="prog-editor">
      <style>{CSS}</style>

      {items.length === 0 ? (
        <div className="prog-empty">
          <p>Aucune étape ajoutée au programme</p>
          <button type="button" onClick={addItem} className="admin-btn admin-btn-secondary">
            + Ajouter la première étape
          </button>
        </div>
      ) : (
        <>
          <div className="prog-list">
            {items.map((item, i) => (
              <div key={i} className="prog-item">
                <div className="prog-item-num">{i + 1}</div>

                <div className="prog-item-fields">
                  <div className="prog-row">
                    <div style={{ flex: '0 0 110px' }}>
                      <label className="prog-mini-label">Heure</label>
                      <input
                        type="time"
                        value={item.time}
                        onChange={e => updateField(i, 'time', e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="prog-mini-label">Événement</label>
                      <input
                        type="text"
                        value={item.event}
                        onChange={e => updateField(i, 'event', e.target.value)}
                        placeholder="Ex: Cérémonie religieuse"
                        className="admin-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="prog-mini-label">Lieu (optionnel)</label>
                    <input
                      type="text"
                      value={item.venue ?? ''}
                      onChange={e => updateField(i, 'venue', e.target.value)}
                      placeholder="Ex: Dar El Jeld"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="prog-item-actions">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="prog-icon-btn"
                    title="Monter"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === items.length - 1}
                    className="prog-icon-btn"
                    title="Descendre"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="prog-icon-btn prog-icon-btn-danger"
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="admin-btn admin-btn-secondary"
            style={{ marginTop: '12px' }}
          >
            + Ajouter une étape
          </button>
        </>
      )}
    </div>
  )
}

const CSS = `
  .prog-editor {}

  .prog-empty {
    text-align: center;
    padding: 32px 20px;
    background: #fafafa;
    border: 1px dashed var(--admin-border-strong);
    border-radius: var(--admin-radius);
  }
  .prog-empty p {
    color: var(--admin-text-muted);
    font-size: 0.88rem;
    margin: 0 0 12px;
  }

  .prog-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .prog-item {
    display: grid;
    grid-template-columns: 36px 1fr auto;
    gap: 12px;
    align-items: flex-start;
    padding: 14px;
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
  }

  .prog-item-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #f3f4f6;
    color: var(--admin-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: 18px;
  }

  .prog-item-fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .prog-row {
    display: flex;
    gap: 10px;
  }

  .prog-mini-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--admin-text-muted);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .prog-item-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 18px;
  }

  .prog-icon-btn {
    width: 28px;
    height: 28px;
    border: 1px solid var(--admin-border);
    background: var(--admin-surface);
    color: var(--admin-text-muted);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .prog-icon-btn:hover:not(:disabled) {
    background: #f5f5f5;
    color: var(--admin-text);
  }
  .prog-icon-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .prog-icon-btn-danger:hover:not(:disabled) {
    background: #fee2e2;
    color: var(--admin-danger);
    border-color: #fecaca;
  }

  @media (max-width: 640px) {
    .prog-row {
      flex-direction: column;
    }
    .prog-row > div {
      flex: 1 !important;
    }
  }
`