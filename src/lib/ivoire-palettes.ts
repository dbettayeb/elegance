export interface IvoirePalette {
  id: string
  name: string
  /** Couleur principale (or, champagne, etc.) */
  accent: string
  accentDark: string
  accentSoft: string
  /** Fond de page */
  bg: string
  /** Texte principal */
  textPrimary: string
  textSecondary: string
  textMuted: string
  /** Couleur des séparateurs/bordures */
  border: string
  /** Pastilles de prévisualisation dans l'admin */
  preview: string[]
}

export const IVOIRE_PALETTES: IvoirePalette[] = [
  {
    id: 'or_classique',
    name: 'Or classique',
    accent: '#C9A84C',
    accentDark: '#8B6914',
    accentSoft: 'rgba(201,168,76,0.12)',
    bg: '#EDE9E2',
    textPrimary: '#2C2416',
    textSecondary: '#6B5A3E',
    textMuted: '#9B8A6E',
    border: 'rgba(201,168,76,0.35)',
    preview: ['#C9A84C', '#8B6914', '#EDE9E2', '#2C2416'],
  },
  {
    id: 'champagne',
    name: 'Champagne',
    accent: '#D4AF7A',
    accentDark: '#A87D4A',
    accentSoft: 'rgba(212,175,122,0.12)',
    bg: '#F5F1E8',
    textPrimary: '#2A1F10',
    textSecondary: '#6A5030',
    textMuted: '#A08060',
    border: 'rgba(212,175,122,0.35)',
    preview: ['#D4AF7A', '#A87D4A', '#F5F1E8', '#2A1F10'],
  },
  {
    id: 'rose_dore',
    name: 'Rose & or',
    accent: '#C4876A',
    accentDark: '#8C5040',
    accentSoft: 'rgba(196,135,106,0.12)',
    bg: '#F7EDE8',
    textPrimary: '#2E1610',
    textSecondary: '#6A3A30',
    textMuted: '#A07870',
    border: 'rgba(196,135,106,0.35)',
    preview: ['#C4876A', '#8C5040', '#F7EDE8', '#2E1610'],
  },
  {
    id: 'platine',
    name: 'Platine',
    accent: '#A8A8A8',
    accentDark: '#686868',
    accentSoft: 'rgba(168,168,168,0.12)',
    bg: '#F0EEF0',
    textPrimary: '#1A1A1A',
    textSecondary: '#444444',
    textMuted: '#888888',
    border: 'rgba(168,168,168,0.35)',
    preview: ['#A8A8A8', '#686868', '#F0EEF0', '#1A1A1A'],
  },
]

export function getIvoirePalette(id?: string | null): IvoirePalette {
  return IVOIRE_PALETTES.find(p => p.id === id) ?? IVOIRE_PALETTES[0]
}

/* ─── Assets disponibles pour Ivoire Doré ─── */

export interface IvoireAsset {
  id: string
  name: string
}

export const IVOIRE_BACKGROUNDS: IvoireAsset[] = [
  { id: 'decoration7.png', name: 'Carte or & marbre' },
]

export const IVOIRE_DECORATIONS: IvoireAsset[] = [
  { id: 'none', name: 'Aucune' },
]

export type IvoireLayout = 'layout_a' | 'layout_b' | 'layout_c'

export interface IvoireLayoutMeta {
  id: IvoireLayout
  name: string
  description: string
}

export const IVOIRE_LAYOUTS: IvoireLayoutMeta[] = [
  {
    id: 'layout_a',
    name: 'Classique centré',
    description: 'Cœur → intro → noms en grand → date → lieu',
  },
  {
    id: 'layout_b',
    name: 'Noms en vedette',
    description: 'Noms très grands d\'abord → séparateur → intro → bloc date encadré',
  },
  {
    id: 'layout_c',
    name: 'Minimaliste',
    description: 'Noms & date uniquement — épuré, sans texte d\'intro',
  },
]
