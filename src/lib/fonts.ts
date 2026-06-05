// Catalogue de polices Google Fonts curatées pour invitations de mariage.
// Le champ `googleFont` est le nom URL-friendly utilisé pour construire l'URL Google Fonts.
// Le champ `family` est la CSS font-family complète.

export type FontLanguage = 'fr' | 'ar'
export type FontCategory = 'script' | 'serif' | 'sans' | 'display'

export interface FontOption {
  id: string           // identifiant unique
  name: string         // nom affiché (ex: "Great Vibes")
  family: string       // CSS font-family (ex: "'Great Vibes', cursive")
  googleFont: string   // pour l'URL Google Fonts (ex: "Great+Vibes")
  language: FontLanguage
  category: FontCategory
  sample: string       // exemple d'aperçu
}

export const FONTS: FontOption[] = [
  // ───── Latin / Français ─────

  // Scripts calligraphiques (très wedding)
  { id: 'great_vibes',   name: 'Great Vibes',    family: "'Great Vibes', cursive",    googleFont: 'Great+Vibes',                    language: 'fr', category: 'script',  sample: 'Sarah & Ahmed' },
  { id: 'allura',        name: 'Allura',         family: "'Allura', cursive",         googleFont: 'Allura',                          language: 'fr', category: 'script',  sample: 'Sarah & Ahmed' },
  { id: 'sacramento',    name: 'Sacramento',     family: "'Sacramento', cursive",     googleFont: 'Sacramento',                      language: 'fr', category: 'script',  sample: 'Sarah & Ahmed' },
  { id: 'parisienne',    name: 'Parisienne',     family: "'Parisienne', cursive",     googleFont: 'Parisienne',                      language: 'fr', category: 'script',  sample: 'Sarah & Ahmed' },
  { id: 'pinyon_script', name: 'Pinyon Script',  family: "'Pinyon Script', cursive",  googleFont: 'Pinyon+Script',                   language: 'fr', category: 'script',  sample: 'Sarah & Ahmed' },
  { id: 'tangerine',     name: 'Tangerine',      family: "'Tangerine', cursive",      googleFont: 'Tangerine:wght@400;700',          language: 'fr', category: 'script',  sample: 'Sarah & Ahmed' },

  // Serifs élégants (très lisibles partout)
  { id: 'cormorant',     name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", googleFont: 'Cormorant+Garamond:wght@300;400;500;600;700', language: 'fr', category: 'serif', sample: 'Sarah & Ahmed' },
  { id: 'playfair',      name: 'Playfair Display',   family: "'Playfair Display', serif",   googleFont: 'Playfair+Display:wght@400;500;600;700',       language: 'fr', category: 'serif', sample: 'Sarah & Ahmed' },
  { id: 'cinzel',        name: 'Cinzel',             family: "'Cinzel', serif",             googleFont: 'Cinzel:wght@400;500;600;700',                 language: 'fr', category: 'display', sample: 'Sarah & Ahmed' },
  { id: 'italiana',      name: 'Italiana',           family: "'Italiana', serif",           googleFont: 'Italiana',                                     language: 'fr', category: 'serif', sample: 'Sarah & Ahmed' },
  { id: 'eb_garamond',   name: 'EB Garamond',        family: "'EB Garamond', serif",        googleFont: 'EB+Garamond:wght@400;500;600;700',            language: 'fr', category: 'serif', sample: 'Sarah & Ahmed' },
  { id: 'cardo',         name: 'Cardo',              family: "'Cardo', serif",              googleFont: 'Cardo:wght@400;700',                          language: 'fr', category: 'serif', sample: 'Sarah & Ahmed' },

  // ───── Arabe / Maghrébin ─────

  // Calligraphiques traditionnels
  { id: 'aref_ruqaa',    name: 'Aref Ruqaa',         family: "'Aref Ruqaa', serif",         googleFont: 'Aref+Ruqaa:wght@400;700',                     language: 'ar', category: 'script', sample: 'سارة و أحمد' },
  { id: 'amiri',         name: 'Amiri',              family: "'Amiri', serif",              googleFont: 'Amiri:wght@400;700',                          language: 'ar', category: 'serif',  sample: 'سارة و أحمد' },
  { id: 'scheherazade',  name: 'Scheherazade New',   family: "'Scheherazade New', serif",   googleFont: 'Scheherazade+New:wght@400;700',               language: 'ar', category: 'serif',  sample: 'سارة و أحمد' },
  { id: 'lateef',        name: 'Lateef',             family: "'Lateef', serif",             googleFont: 'Lateef:wght@400;700',                          language: 'ar', category: 'serif',  sample: 'سارة و أحمد' },
  { id: 'markazi',       name: 'Markazi Text',       family: "'Markazi Text', serif",       googleFont: 'Markazi+Text:wght@400;500;600;700',           language: 'ar', category: 'serif',  sample: 'سارة و أحمد' },

  // Modernes
  { id: 'reem_kufi',     name: 'Reem Kufi',          family: "'Reem Kufi', sans-serif",     googleFont: 'Reem+Kufi:wght@400;500;600;700',              language: 'ar', category: 'display', sample: 'سارة و أحمد' },
  { id: 'cairo',         name: 'Cairo',              family: "'Cairo', sans-serif",         googleFont: 'Cairo:wght@400;500;600;700',                   language: 'ar', category: 'sans',    sample: 'سارة و أحمد' },
  { id: 'tajawal',       name: 'Tajawal',            family: "'Tajawal', sans-serif",       googleFont: 'Tajawal:wght@400;500;700',                     language: 'ar', category: 'sans',    sample: 'سارة و أحمد' },
]

// Helper : retourne les polices pour une langue donnée
export function getFontsForLanguage(language: FontLanguage): FontOption[] {
  return FONTS.filter(f => f.language === language)
}

// Helper : retourne une police par son nom (utilisé pour la sauvegarde en DB)
export function getFontByName(name: string | null | undefined): FontOption | null {
  if (!name) return null
  return FONTS.find(f => f.name === name) ?? null
}

// Catégories affichables en UI
export const CATEGORY_LABELS: Record<FontCategory, string> = {
  script: 'Calligraphique',
  serif: 'Serif élégant',
  sans: 'Sans-serif moderne',
  display: 'Display',
}