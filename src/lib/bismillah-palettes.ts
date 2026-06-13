export interface BismillahPalette {
  id: 'or_classique' | 'emeraude' | 'bordeaux' | 'marine_dore' | 'rose_cuivre'
  name: string
  accent: string
  accentDark: string
  accentSoft: string
  border: string
  bg: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  preview: string[]
  decorativeGold?: string
}

export const BISMILLAH_PALETTES: BismillahPalette[] = [
  {
    id: 'or_classique',
    name: 'Or classique',
    accent: '#C9A84C',
    accentDark: '#B8973F',
    accentSoft: 'rgba(201,168,76,0.12)',
    border: 'rgba(201,168,76,0.3)',
    bg: '#FAF7F0',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B5A3E',
    textMuted: '#9B8A6E',
    preview: ['#C9A84C', '#FAF7F0', '#1A1A1A', '#9B8A6E'],
  },
  {
    id: 'emeraude',
    name: 'Émeraude & or',
    accent: '#1F5F4A',
    accentDark: '#0F3D2E',
    accentSoft: 'rgba(31,95,74,0.12)',
    border: 'rgba(31,95,74,0.3)',
    bg: '#F5F1E8',
    textPrimary: '#1A2E22',
    textSecondary: '#3A5040',
    textMuted: '#7A9A88',
    preview: ['#1F5F4A', '#0F3D2E', '#F5F1E8', '#1A2E22'],
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux royal',
    accent: '#7B1E2E',
    accentDark: '#5C1422',
    accentSoft: 'rgba(123,30,46,0.12)',
    border: 'rgba(123,30,46,0.3)',
    bg: '#FAF6EE',
    textPrimary: '#2C1010',
    textSecondary: '#5C3030',
    textMuted: '#9A7070',
    preview: ['#7B1E2E', '#5C1422', '#FAF6EE', '#2C1010'],
  },
  {
    id: 'marine_dore',
    name: 'Marine & or',
    accent: '#1E3A5F',
    accentDark: '#0F1B2D',
    accentSoft: 'rgba(30,58,95,0.12)',
    border: 'rgba(30,58,95,0.3)',
    bg: '#F4EEE0',
    textPrimary: '#0A1628',
    textSecondary: '#2A4060',
    textMuted: '#7A8FA8',
    decorativeGold: '#D4AF37',
    preview: ['#1E3A5F', '#D4AF37', '#F4EEE0', '#0A1628'],
  },
  {
    id: 'rose_cuivre',
    name: 'Rose & cuivre',
    accent: '#B87333',
    accentDark: '#8C5524',
    accentSoft: 'rgba(184,115,51,0.12)',
    border: 'rgba(184,115,51,0.3)',
    bg: '#FAF0EB',
    textPrimary: '#3D2817',
    textSecondary: '#6B4530',
    textMuted: '#A07868',
    preview: ['#B87333', '#8C5524', '#FAF0EB', '#3D2817'],
  },
]

export function getBismillahPalette(id?: string | null): BismillahPalette {
  return BISMILLAH_PALETTES.find(p => p.id === id) ?? BISMILLAH_PALETTES[0]
}
