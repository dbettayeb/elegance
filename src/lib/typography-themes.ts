/**
 * Thèmes typographiques pour les invitations arabes.
 *
 * Chaque thème définit une paire "display" (titres, prénoms) +
 * "body" (corps, versets) ainsi que la query Google Fonts pour
 * charger les fichiers nécessaires.
 *
 * Utilisé par BismillahStyle, Bismillah et AlNour via les
 * variables CSS `--ar-font-display` et `--ar-font-body`.
 */

export interface TypographyTheme {
  id: 'classic' | 'modern'
  label: string
  display: string   // CSS font-family pour titres / prénoms
  body: string      // CSS font-family pour corps / versets
  googleFonts: string  // segment "family=..." pour l'URL Google Fonts
}

export const AR_TYPOGRAPHY_THEMES: TypographyTheme[] = [
  {
    id: 'classic',
    label: 'Classique — Aref Ruqaa + Amiri',
    display: `'Aref Ruqaa', serif`,
    body:    `'Amiri', Georgia, serif`,
    googleFonts: 'Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi:wght@400;500;600',
  },
  {
    id: 'modern',
    label: 'Islamique — Scheherazade + Lateef',
    display: `'Scheherazade New', serif`,
    body:    `'Lateef', Georgia, serif`,
    googleFonts: 'Scheherazade+New:wght@400;500;600;700&family=Lateef:wght@400;700&family=Reem+Kufi:wght@400;500;600',
  },
]

export const DEFAULT_AR_THEME = AR_TYPOGRAPHY_THEMES[0]

export function getArTypographyTheme(id?: string | null): TypographyTheme {
  return AR_TYPOGRAPHY_THEMES.find(t => t.id === id) ?? DEFAULT_AR_THEME
}
