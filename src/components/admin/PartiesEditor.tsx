'use client'
import { useState } from 'react'

export interface Party {
  title: string
  date: string
  time: string
  venue_name: string
  venue_address?: string
  gps_google?: string
  gps_apple?: string
}

export default function PartiesEditor({
  initial,
  onChange,
}: {
  initial: Party[]
  onChange: (items: Party[]) => void
}) {
  const [items, setItems] = useState<Party[]>(initial.length ? initial : [])

  function update(next: Party[]) {
    setItems(next)
    onChange(next)
  }

  function addItem() {
    update([...items, { title: '', date: '', time: '19:00', venue_name: '', venue_address: '', gps_google: '', gps_apple: '' }])
  }

  function removeItem(index: number) {
    update(items.filter((_, i) => i !== index))
  }

  function updateField(index: number, field: keyof Party, value: string) {
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
    <div className="party-editor">
      <style>{CSS}</style>

      <div className="party-hint">
        Ajoutez ici les fêtes <strong>en plus</strong> de la réception principale
        (saisie dans « Date &amp; lieu »). Chaque fête peut avoir sa propre date,
        heure et lieu. La réception principale reste mise en avant automatiquement.
      </div>

      {items.length === 0 ? (
        <div className="party-empty">
          <p>Aucune fête additionnelle</p>
          <button type="button" onClick={addItem} className="admin-btn admin-btn-secondary">
            + Ajouter une fête
          </button>
        </div>
      ) : (
        <>
          <div className="party-list">
            {items.map((item, i) => (
              <div key={i} className="party-item">
                <div className="party-item-num">{i + 1}</div>

                <div className="party-item-fields">
                  <div>
                    <label className="party-mini-label">Intitulé de la fête</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => updateField(i, 'title', e.target.value)}
                      placeholder="Ex : Soirée de la mariée (Outia)"
                      className="admin-input"
                    />
                  </div>
                  <div className="party-row">
                    <div style={{ flex: 1 }}>
                      <label className="party-mini-label">Date</label>
                      <input
                        type="date"
                        value={item.date}
                        onChange={e => updateField(i, 'date', e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div style={{ flex: '0 0 120px' }}>
                      <label className="party-mini-label">Heure</label>
                      <input
                        type="time"
                        value={item.time}
                        onChange={e => updateField(i, 'time', e.target.value)}
                        className="admin-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="party-mini-label">Nom du lieu</label>
                    <input
                      type="text"
                      value={item.venue_name}
                      onChange={e => updateField(i, 'venue_name', e.target.value)}
                      placeholder="Ex : Salle des fêtes Al Moulouk, Makthar"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="party-mini-label">Adresse (optionnel)</label>
                    <input
                      type="text"
                      value={item.venue_address ?? ''}
                      onChange={e => updateField(i, 'venue_address', e.target.value)}
                      placeholder="Ex : Avenue de l'Indépendance, Makthar"
                      className="admin-input"
                    />
                  </div>
                  <div className="party-row">
                    <div style={{ flex: 1 }}>
                      <label className="party-mini-label">Lien Google Maps (optionnel)</label>
                      <input
                        type="url"
                        value={item.gps_google ?? ''}
                        onChange={e => updateField(i, 'gps_google', e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="admin-input"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="party-mini-label">Lien Apple Maps (optionnel)</label>
                      <input
                        type="url"
                        value={item.gps_apple ?? ''}
                        onChange={e => updateField(i, 'gps_apple', e.target.value)}
                        placeholder="https://maps.apple.com/..."
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="party-item-actions">
                  <button type="button" onClick={() => moveUp(i)} disabled={i === 0}
                    className="party-icon-btn" title="Monter">↑</button>
                  <button type="button" onClick={() => moveDown(i)} disabled={i === items.length - 1}
                    className="party-icon-btn" title="Descendre">↓</button>
                  <button type="button" onClick={() => removeItem(i)}
                    className="party-icon-btn party-icon-btn-danger" title="Supprimer">×</button>
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
            + Ajouter une fête
          </button>
        </>
      )}
    </div>
  )
}

const CSS = `
  .party-hint {
    padding: 10px 12px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: var(--admin-radius);
    font-size: 0.8rem;
    color: #92400e;
    margin-bottom: 14px;
    line-height: 1.5;
  }

  .party-empty {
    text-align: center;
    padding: 32px 20px;
    background: #fafafa;
    border: 1px dashed var(--admin-border-strong);
    border-radius: var(--admin-radius);
  }
  .party-empty p {
    color: var(--admin-text-muted);
    font-size: 0.88rem;
    margin: 0 0 12px;
  }

  .party-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .party-item {
    display: grid;
    grid-template-columns: 36px 1fr auto;
    gap: 12px;
    align-items: flex-start;
    padding: 14px;
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
  }

  .party-item-num {
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
    margin-top: 20px;
  }

  .party-item-fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .party-row {
    display: flex;
    gap: 10px;
  }

  .party-mini-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--admin-text-muted);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .party-item-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 20px;
  }

  .party-icon-btn {
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
  .party-icon-btn:hover:not(:disabled) {
    background: #f5f5f5;
    color: var(--admin-text);
  }
  .party-icon-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .party-icon-btn-danger:hover:not(:disabled) {
    background: #fee2e2;
    color: var(--admin-danger);
    border-color: #fecaca;
  }

  @media (max-width: 640px) {
    .party-row {
      flex-direction: column;
    }
    .party-row > div {
      flex: 1 !important;
    }
  }
`
