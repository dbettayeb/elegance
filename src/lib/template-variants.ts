export interface TemplateAssetOption {
  id: string   // chemin relatif au dossier public/
  name: string
}

// ─────────────────────────────────────────────────────
// TOILE BLEUE
// ─────────────────────────────────────────────────────
export interface ToileBleueVariant {
  id: string; name: string; preview: string[]
  bg: string; textPrimary: string; textSecondary: string
  textMuted: string; accent: string; accentDark: string
  accentSoft: string; border: string
}

export const TOILE_BLEUE_PALETTES: ToileBleueVariant[] = [
  {
    id: 'bleu_marine',
    name: 'Bleu marine',
    preview: ['#EAE0D1', '#3D5A8A', '#2C2416', '#8AAAD0'],
    bg: '#EAE0D1', textPrimary: '#2C2416', textSecondary: '#4A3A28',
    textMuted: '#8B7A6A', accent: '#3D5A8A', accentDark: '#2A4570',
    accentSoft: '#8AAAD0', border: 'rgba(61,90,138,0.25)',
  },
  {
    id: 'vert_sauge',
    name: 'Vert sauge',
    preview: ['#E8EDE6', '#4A7A6A', '#2A3A2A', '#8AAAA0'],
    bg: '#E8EDE6', textPrimary: '#2A3A2A', textSecondary: '#3A5A4A',
    textMuted: '#7A9A8A', accent: '#4A7A6A', accentDark: '#2A5A4A',
    accentSoft: '#8AAAA0', border: 'rgba(74,122,106,0.25)',
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    preview: ['#EDE1E8', '#7A3D5A', '#3A1A28', '#B08AA0'],
    bg: '#EDE1E8', textPrimary: '#3A1A28', textSecondary: '#5A3A48',
    textMuted: '#9A7A88', accent: '#7A3D5A', accentDark: '#5A2A40',
    accentSoft: '#B08AA0', border: 'rgba(122,61,90,0.25)',
  },
]

export const TOILE_BLEUE_DECORATIONS: TemplateAssetOption[] = [
  { id: 'assets/template1/deco1.png', name: 'Cadre floral bleu' },
]

export function getToileBleueVariant(id?: string | null): ToileBleueVariant {
  return TOILE_BLEUE_PALETTES.find(p => p.id === id) ?? TOILE_BLEUE_PALETTES[0]
}

// ─────────────────────────────────────────────────────
// JARDIN ROSE
// ─────────────────────────────────────────────────────
export interface JardinRoseVariant {
  id: string; name: string; preview: string[]
  openingBg: string; accent: string; accentDark: string
  textPrimary: string; textSecondary: string; textMuted: string
  border: string
}

export const JARDIN_ROSE_PALETTES: JardinRoseVariant[] = [
  {
    id: 'rose_poudre',
    name: 'Rose poudré',
    preview: ['#F0E5E3', '#B87070', '#9A5858', '#3D2B2B'],
    openingBg: '#F0E5E3', accent: '#B87070', accentDark: '#9A5858',
    textPrimary: '#3D2B2B', textSecondary: '#6B4F4F', textMuted: '#9E7F7F',
    border: 'rgba(184,112,112,0.25)',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    preview: ['#F0E8E2', '#B86048', '#9A4830', '#3D2A1A'],
    openingBg: '#F0E8E2', accent: '#B86048', accentDark: '#9A4830',
    textPrimary: '#3D2A1A', textSecondary: '#6B4832', textMuted: '#9E7A60',
    border: 'rgba(184,96,72,0.25)',
  },
  {
    id: 'prune_dore',
    name: 'Prune & or',
    preview: ['#EDE3EB', '#8A5A78', '#6A3A58', '#2C1A28'],
    openingBg: '#EDE3EB', accent: '#8A5A78', accentDark: '#6A3A58',
    textPrimary: '#2C1A28', textSecondary: '#5A3A50', textMuted: '#9A7A88',
    border: 'rgba(138,90,120,0.25)',
  },
]

export const JARDIN_ROSE_BACKGROUNDS: TemplateAssetOption[] = [
  { id: 'assets/template2/back2.png', name: 'Fond rose blush' },
]

export const JARDIN_ROSE_DECORATIONS: TemplateAssetOption[] = [
  { id: 'assets/template2/deco2.png', name: 'Cadre floral rose' },
]

export function getJardinRoseVariant(id?: string | null): JardinRoseVariant {
  return JARDIN_ROSE_PALETTES.find(p => p.id === id) ?? JARDIN_ROSE_PALETTES[0]
}

// ─────────────────────────────────────────────────────
// FLORAL ARCH
// ─────────────────────────────────────────────────────
export interface FloralArchVariant {
  id: string; name: string; preview: string[]
  bg: string; green: string; greenDark: string; coral: string
  coralDark: string; muted: string; mutedLight: string; border: string
}

export const FLORAL_ARCH_PALETTES: FloralArchVariant[] = [
  {
    id: 'vert_corail',
    name: 'Vert & corail',
    preview: ['#f8f7f7', '#497043', '#e38080', '#7b7872'],
    bg: '#f8f7f7', green: '#497043', greenDark: '#3a5934', coral: '#e38080',
    coralDark: '#c86060', muted: '#7b7872', mutedLight: '#a09c96',
    border: 'rgba(73,112,67,0.18)',
  },
  {
    id: 'bleu_lavande',
    name: 'Bleu & lavande',
    preview: ['#f5f5fa', '#4A6A8A', '#9080c8', '#7a7a8a'],
    bg: '#f5f5fa', green: '#4A6A8A', greenDark: '#2A4A6A', coral: '#9080c8',
    coralDark: '#7060a8', muted: '#7a7a8a', mutedLight: '#a0a0b0',
    border: 'rgba(74,106,138,0.18)',
  },
  {
    id: 'sage_peche',
    name: 'Sauge & pêche',
    preview: ['#f7f5f0', '#6A8A6A', '#e0a080', '#8a8070'],
    bg: '#f7f5f0', green: '#6A8A6A', greenDark: '#4A6A4A', coral: '#e0a080',
    coralDark: '#c08060', muted: '#8a8070', mutedLight: '#b0a898',
    border: 'rgba(106,138,106,0.18)',
  },
]

export const FLORAL_ARCH_DECORATIONS: TemplateAssetOption[] = [
  { id: 'assets/template3/deco3.png', name: 'Arche florale' },
]

export function getFloralArchVariant(id?: string | null): FloralArchVariant {
  return FLORAL_ARCH_PALETTES.find(p => p.id === id) ?? FLORAL_ARCH_PALETTES[0]
}

// ─────────────────────────────────────────────────────
// ROSE BLEU
// ─────────────────────────────────────────────────────
export interface RoseBleuVariant {
  id: string; name: string; preview: string[]
  bg: string; blue: string; blueDark: string; blueLight: string
  border: string; borderSoft: string
}

export const ROSE_BLEU_PALETTES: RoseBleuVariant[] = [
  {
    id: 'bleu_ardoise',
    name: 'Bleu ardoise',
    preview: ['#f5ede0', '#6b8fa8', '#8aafc8', '#4a6b82'],
    bg: '#f5ede0', blue: '#6b8fa8', blueDark: '#4a6b82', blueLight: '#8aafc8',
    border: 'rgba(107,143,168,0.28)', borderSoft: 'rgba(107,143,168,0.15)',
  },
  {
    id: 'gris_perle',
    name: 'Gris perle',
    preview: ['#f0eef0', '#8A9A9A', '#aab8b8', '#6a7a7a'],
    bg: '#f0eef0', blue: '#8A9A9A', blueDark: '#6a7a7a', blueLight: '#aab8b8',
    border: 'rgba(138,154,154,0.28)', borderSoft: 'rgba(138,154,154,0.15)',
  },
  {
    id: 'vert_eau',
    name: "Vert d'eau",
    preview: ['#edf0ee', '#6A9A8A', '#8ab8a8', '#4a7a6a'],
    bg: '#edf0ee', blue: '#6A9A8A', blueDark: '#4a7a6a', blueLight: '#8ab8a8',
    border: 'rgba(106,154,138,0.28)', borderSoft: 'rgba(106,154,138,0.15)',
  },
]

export const ROSE_BLEU_BACKGROUNDS: TemplateAssetOption[] = [
  { id: 'assets/template5/back5.png', name: 'Fond beige naturel' },
]

export const ROSE_BLEU_DECORATIONS: TemplateAssetOption[] = [
  { id: 'assets/template5/deco5.png', name: 'Cadre délicat' },
]

export function getRoseBleuVariant(id?: string | null): RoseBleuVariant {
  return ROSE_BLEU_PALETTES.find(p => p.id === id) ?? ROSE_BLEU_PALETTES[0]
}

// ─────────────────────────────────────────────────────
// ROSES IVOIRE
// ─────────────────────────────────────────────────────
export interface RosesIvoireVariant {
  id: string; name: string; preview: string[]
  bg: string; gold: string; goldMid: string; goldPale: string
  goldDark: string; border: string; borderSoft: string
}

export const ROSES_IVOIRE_PALETTES: RosesIvoireVariant[] = [
  {
    id: 'ivoire_or',
    name: 'Ivoire & or',
    preview: ['#FFFFFF', '#82674b', '#9e8060', '#c4a882'],
    bg: '#FFFFFF', gold: '#82674b', goldMid: '#9e8060', goldPale: '#c4a882',
    goldDark: '#6a5238', border: 'rgba(130,103,75,0.38)',
    borderSoft: 'rgba(130,103,75,0.18)',
  },
  {
    id: 'champagne_rose',
    name: 'Champagne rosé',
    preview: ['#FFF8F5', '#9A7860', '#b8988a', '#d8b8a8'],
    bg: '#FFF8F5', gold: '#9A7860', goldMid: '#b8988a', goldPale: '#d8b8a8',
    goldDark: '#7A5840', border: 'rgba(154,120,96,0.38)',
    borderSoft: 'rgba(154,120,96,0.18)',
  },
  {
    id: 'bronze_sable',
    name: 'Bronze & sable',
    preview: ['#FAF5EF', '#7A6045', '#98805A', '#C0A070'],
    bg: '#FAF5EF', gold: '#7A6045', goldMid: '#98805A', goldPale: '#C0A070',
    goldDark: '#5A4030', border: 'rgba(122,96,69,0.38)',
    borderSoft: 'rgba(122,96,69,0.18)',
  },
]

export const ROSES_IVOIRE_DECORATIONS: TemplateAssetOption[] = [
  { id: 'assets/template4/deco4.png', name: 'Cadre roses sculptées' },
]

export function getRosesIvoireVariant(id?: string | null): RosesIvoireVariant {
  return ROSES_IVOIRE_PALETTES.find(p => p.id === id) ?? ROSES_IVOIRE_PALETTES[0]
}
