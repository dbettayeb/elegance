'use client'

/**
 * Éditeur du dress code : la palette de couleurs et les photos d'inspiration.
 *
 * Les deux consignes texte restent de simples champs du formulaire ; seules
 * ces deux listes, de longueur variable, demandaient un composant. Les photos
 * sont des liens — le marié les héberge lui-même, typiquement sur Supabase
 * Storage — plutôt que des fichiers embarqués dans le projet.
 */
export default function DressCodeEditor({
  colors,
  onColorsChange,
  images,
  onImagesChange,
}: {
  colors: string[]
  onColorsChange: (next: string[]) => void
  images: string[]
  onImagesChange: (next: string[]) => void
}) {
  const MAX_COLORS = 6
  const MAX_IMAGES = 8

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* ── Palette ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={label}>Palette de couleurs</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {colors.map((color, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="color"
                value={color}
                onChange={e => onColorsChange(colors.map((c, idx) => (idx === i ? e.target.value : c)))}
                aria-label={`Couleur ${i + 1}`}
                style={{
                  width: '44px', height: '32px', padding: 0, cursor: 'pointer',
                  border: '1px solid #ddd', borderRadius: '6px', background: 'none',
                }}
              />
              <button type="button" style={removeBtn}
                onClick={() => onColorsChange(colors.filter((_, idx) => idx !== i))}
                aria-label={`Retirer la couleur ${i + 1}`}>×</button>
            </div>
          ))}
          {colors.length === 0 && <span style={hint}>Aucune couleur.</span>}
        </div>
        {colors.length < MAX_COLORS && (
          <button type="button" className="admin-btn admin-btn-secondary"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => onColorsChange([...colors, '#C8A24E'])}>
            + Ajouter une couleur
          </button>
        )}
      </div>

      {/* ── Photos d'inspiration ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={label}>Photos d'inspiration</span>
        <span style={hint}>
          Liens vers des images (Supabase Storage, ou toute URL publique).
          Elles défilent horizontalement sous les consignes.
        </span>
        {images.map((url, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" style={{
                width: '40px', height: '52px', objectFit: 'cover',
                borderRadius: '4px', border: '1px solid #e5e5e5', flexShrink: 0,
              }} />
            )}
            <input
              className="admin-input"
              type="url"
              value={url}
              onChange={e => onImagesChange(images.map((u, idx) => (idx === i ? e.target.value : u)))}
              placeholder="https://...supabase.co/storage/v1/object/public/..."
            />
            <button type="button" style={removeBtn}
              onClick={() => onImagesChange(images.filter((_, idx) => idx !== i))}
              aria-label={`Retirer la photo ${i + 1}`}>×</button>
          </div>
        ))}
        {images.length === 0 && <span style={hint}>Aucune photo — la section n'affichera que les consignes et la palette.</span>}
        {images.length < MAX_IMAGES && (
          <button type="button" className="admin-btn admin-btn-secondary"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => onImagesChange([...images, ''])}>
            + Ajouter une photo
          </button>
        )}
      </div>
    </div>
  )
}

const label: React.CSSProperties = {
  fontSize: '0.8rem', fontWeight: 600, color: '#444',
  letterSpacing: '0.02em',
}
const hint: React.CSSProperties = { fontSize: '0.8rem', color: '#888' }
const removeBtn: React.CSSProperties = {
  border: '1px solid #e5e5e5', background: '#fafafa', cursor: 'pointer',
  borderRadius: '6px', width: '26px', height: '26px', lineHeight: 1,
  color: '#999', flexShrink: 0,
}
