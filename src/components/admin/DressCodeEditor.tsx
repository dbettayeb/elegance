'use client'

/**
 * Éditeur des pastilles de couleur du dress code.
 *
 * Le marié compose la palette que ses invités devront suivre ; les deux
 * consignes texte (femmes, hommes) restent de simples champs dans le
 * formulaire, seule la liste de couleurs demandait un composant.
 */
export default function DressCodeEditor({
  colors,
  onChange,
}: {
  colors: string[]
  onChange: (next: string[]) => void
}) {
  const MAX = 6

  const update = (i: number, value: string) =>
    onChange(colors.map((c, idx) => (idx === i ? value : c)))

  const remove = (i: number) => onChange(colors.filter((_, idx) => idx !== i))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {colors.map((color, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="color"
              value={color}
              onChange={e => update(i, e.target.value)}
              aria-label={`Couleur ${i + 1}`}
              style={{
                width: '44px', height: '32px', padding: 0, cursor: 'pointer',
                border: '1px solid #ddd', borderRadius: '6px', background: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Retirer la couleur ${i + 1}`}
              style={{
                border: '1px solid #e5e5e5', background: '#fafafa', cursor: 'pointer',
                borderRadius: '6px', width: '26px', height: '26px', lineHeight: 1, color: '#999',
              }}
            >
              ×
            </button>
          </div>
        ))}
        {colors.length === 0 && (
          <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}>
            Aucune couleur — la section n'affichera que les consignes écrites.
          </p>
        )}
      </div>

      {colors.length < MAX && (
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => onChange([...colors, '#C8A24E'])}
        >
          + Ajouter une couleur
        </button>
      )}
    </div>
  )
}
