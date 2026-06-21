export interface BismillahPalette {
  id: 'or_classique' | 'emeraude' | 'bordeaux' | 'marine_dore' | 'rose_cuivre' | 'noir_elegant'
    | 'tb_ar_bleu' | 'tb_ar_marine' | 'tb_ar_sable' | 'tb_ar_noir'
    | 'jr_ar_rose' | 'jr_ar_bordeaux' | 'jr_ar_poudre' | 'jr_ar_noir'
    | 'fa_ar_vert' | 'fa_ar_foret' | 'fa_ar_sage' | 'fa_ar_noir'
    | 'ri_ar_or' | 'ri_ar_champagne' | 'ri_ar_beige' | 'ri_ar_noir'
    | 'rb_ar_bleu' | 'rb_ar_ciel' | 'rb_ar_ardoise' | 'rb_ar_noir'
    | 't7_ar_or' | 't7_ar_bordeaux' | 't7_ar_sable' | 't7_ar_noir'
    | 't8_ar_rose' | 't8_ar_framboise' | 't8_ar_poudre' | 't8_ar_noir'
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
  {
    id: 'noir_elegant',
    name: 'Noir élégant',
    accent: '#0A0A0A',
    accentDark: '#000000',
    accentSoft: 'rgba(0,0,0,0.07)',
    border: 'rgba(0,0,0,0.18)',
    bg: '#FAFAF8',
    textPrimary: '#0A0A0A',
    textSecondary: '#1C1C1C',
    textMuted: '#555555',
    decorativeGold: '#0A0A0A',
    preview: ['#0A0A0A', '#1C1C1C', '#555555', '#FAFAF8'],
  },
]

// ── Toile Bleue AR — bleu acier & crème chaude ──────────────────────────────
export const TOILE_BLEUE_AR_PALETTES: BismillahPalette[] = [
  {
    id: 'tb_ar_bleu',
    name: 'Bleu & sable',
    accent: '#3D5A8A',
    accentDark: '#2A4570',
    accentSoft: 'rgba(61,90,138,0.12)',
    border: 'rgba(61,90,138,0.25)',
    bg: '#EAE0D1',
    textPrimary: '#2C2416',
    textSecondary: '#4A3A28',
    textMuted: '#8B7A6A',
    preview: ['#3D5A8A', '#EAE0D1', '#2C2416', '#8B7A6A'],
  },
  {
    id: 'tb_ar_marine',
    name: 'Marine doré',
    accent: '#1A3553',
    accentDark: '#0F2035',
    accentSoft: 'rgba(26,53,83,0.12)',
    border: 'rgba(26,53,83,0.25)',
    bg: '#E8E0D0',
    textPrimary: '#1A1A2E',
    textSecondary: '#2A3A4A',
    textMuted: '#7A8A9A',
    decorativeGold: '#C9A84C',
    preview: ['#1A3553', '#C9A84C', '#E8E0D0', '#7A8A9A'],
  },
  {
    id: 'tb_ar_sable',
    name: 'Sable & or',
    accent: '#8A7060',
    accentDark: '#6A5040',
    accentSoft: 'rgba(138,112,96,0.12)',
    border: 'rgba(138,112,96,0.25)',
    bg: '#EDE5D5',
    textPrimary: '#2C2010',
    textSecondary: '#5A4030',
    textMuted: '#9A8070',
    preview: ['#8A7060', '#EDE5D5', '#2C2010', '#9A8070'],
  },
  {
    id: 'tb_ar_noir',
    name: 'Nuit noire',
    accent: '#8AAAD0',
    accentDark: '#3D5A8A',
    accentSoft: 'rgba(138,170,208,0.15)',
    border: 'rgba(138,170,208,0.25)',
    bg: '#111111',
    textPrimary: '#EAE0D1',
    textSecondary: '#8AAAD0',
    textMuted: '#6A7A8A',
    decorativeGold: '#8AAAD0',
    preview: ['#111111', '#8AAAD0', '#EAE0D1', '#6A7A8A'],
  },
]

// ── Jardin Rose AR — rose & bois rosé ───────────────────────────────────────
export const JARDIN_ROSE_AR_PALETTES: BismillahPalette[] = [
  {
    id: 'jr_ar_rose',
    name: 'Rose & bois',
    accent: '#B87070',
    accentDark: '#9A5858',
    accentSoft: 'rgba(184,112,112,0.12)',
    border: 'rgba(184,112,112,0.25)',
    bg: '#F0E5E3',
    textPrimary: '#3D2B2B',
    textSecondary: '#6B4F4F',
    textMuted: '#9E7F7F',
    preview: ['#B87070', '#F0E5E3', '#3D2B2B', '#9E7F7F'],
  },
  {
    id: 'jr_ar_bordeaux',
    name: 'Bordeaux rosé',
    accent: '#8B3A4A',
    accentDark: '#6A2535',
    accentSoft: 'rgba(139,58,74,0.12)',
    border: 'rgba(139,58,74,0.25)',
    bg: '#F5E8E5',
    textPrimary: '#2C1018',
    textSecondary: '#5A2030',
    textMuted: '#9A6070',
    preview: ['#8B3A4A', '#F5E8E5', '#2C1018', '#9A6070'],
  },
  {
    id: 'jr_ar_poudre',
    name: 'Rose poudré',
    accent: '#C49090',
    accentDark: '#A87070',
    accentSoft: 'rgba(196,144,144,0.12)',
    border: 'rgba(196,144,144,0.25)',
    bg: '#FDF0EE',
    textPrimary: '#3A2020',
    textSecondary: '#6A4848',
    textMuted: '#A07878',
    preview: ['#C49090', '#FDF0EE', '#3A2020', '#A07878'],
  },
  {
    id: 'jr_ar_noir',
    name: 'Nuit noire',
    accent: '#D4A0A0',
    accentDark: '#B87070',
    accentSoft: 'rgba(212,160,160,0.15)',
    border: 'rgba(212,160,160,0.25)',
    bg: '#111111',
    textPrimary: '#F5ECEA',
    textSecondary: '#D4A0A0',
    textMuted: '#7A5858',
    decorativeGold: '#D4A0A0',
    preview: ['#111111', '#D4A0A0', '#F5ECEA', '#7A5858'],
  },
]

// ── Floral Arch AR — vert & fleurs ──────────────────────────────────────────
export const FLORAL_ARCH_AR_PALETTES: BismillahPalette[] = [
  {
    id: 'fa_ar_vert',
    name: 'Vert & crème',
    accent: '#497043',
    accentDark: '#3A5934',
    accentSoft: 'rgba(73,112,67,0.12)',
    border: 'rgba(73,112,67,0.22)',
    bg: '#f8f7f7',
    textPrimary: '#1E2C1A',
    textSecondary: '#4A5A44',
    textMuted: '#7A8A78',
    preview: ['#497043', '#f8f7f7', '#1E2C1A', '#7A8A78'],
  },
  {
    id: 'fa_ar_foret',
    name: 'Forêt & or',
    accent: '#2E5030',
    accentDark: '#1E3A20',
    accentSoft: 'rgba(46,80,48,0.12)',
    border: 'rgba(46,80,48,0.25)',
    bg: '#F5F8F4',
    textPrimary: '#0D2010',
    textSecondary: '#2E4A30',
    textMuted: '#7A9A78',
    decorativeGold: '#C9A84C',
    preview: ['#2E5030', '#C9A84C', '#F5F8F4', '#7A9A78'],
  },
  {
    id: 'fa_ar_sage',
    name: 'Sauge & ivoire',
    accent: '#6B8A65',
    accentDark: '#4E6A48',
    accentSoft: 'rgba(107,138,101,0.12)',
    border: 'rgba(107,138,101,0.22)',
    bg: '#F5F5F0',
    textPrimary: '#252820',
    textSecondary: '#506050',
    textMuted: '#909885',
    preview: ['#6B8A65', '#F5F5F0', '#252820', '#909885'],
  },
  {
    id: 'fa_ar_noir',
    name: 'Nuit noire',
    accent: '#7AAA74',
    accentDark: '#497043',
    accentSoft: 'rgba(122,170,116,0.15)',
    border: 'rgba(122,170,116,0.25)',
    bg: '#111111',
    textPrimary: '#F0F5EE',
    textSecondary: '#7AAA74',
    textMuted: '#506050',
    decorativeGold: '#7AAA74',
    preview: ['#111111', '#7AAA74', '#F0F5EE', '#506050'],
  },
]

// ── Roses Ivoire AR — or & blanc ────────────────────────────────────────────
export const ROSES_IVOIRE_AR_PALETTES: BismillahPalette[] = [
  {
    id: 'ri_ar_or',
    name: 'Or & blanc',
    accent: '#82674b',
    accentDark: '#6a5238',
    accentSoft: 'rgba(130,103,75,0.12)',
    border: 'rgba(130,103,75,0.3)',
    bg: '#FFFFFF',
    textPrimary: '#2A1F14',
    textSecondary: '#6A5040',
    textMuted: '#9E8060',
    preview: ['#82674b', '#FFFFFF', '#2A1F14', '#9E8060'],
  },
  {
    id: 'ri_ar_champagne',
    name: 'Champagne',
    accent: '#A08060',
    accentDark: '#7A6040',
    accentSoft: 'rgba(160,128,96,0.12)',
    border: 'rgba(160,128,96,0.28)',
    bg: '#FFF8F2',
    textPrimary: '#2A2010',
    textSecondary: '#5A4030',
    textMuted: '#9A7A58',
    decorativeGold: '#C9A84C',
    preview: ['#A08060', '#FFF8F2', '#2A2010', '#9A7A58'],
  },
  {
    id: 'ri_ar_beige',
    name: 'Ivoire rosé',
    accent: '#9A8070',
    accentDark: '#7A6050',
    accentSoft: 'rgba(154,128,112,0.12)',
    border: 'rgba(154,128,112,0.25)',
    bg: '#FAF5EE',
    textPrimary: '#2C2018',
    textSecondary: '#5A4838',
    textMuted: '#9A8878',
    preview: ['#9A8070', '#FAF5EE', '#2C2018', '#9A8878'],
  },
  {
    id: 'ri_ar_noir',
    name: 'Nuit noire',
    accent: '#C9A84C',
    accentDark: '#B8973F',
    accentSoft: 'rgba(201,168,76,0.15)',
    border: 'rgba(201,168,76,0.25)',
    bg: '#111111',
    textPrimary: '#F5F2EC',
    textSecondary: '#C9A84C',
    textMuted: '#7A6A40',
    decorativeGold: '#C9A84C',
    preview: ['#111111', '#C9A84C', '#F5F2EC', '#7A6A40'],
  },
]

// ── Rose Bleu AR — bleu doux & pêche ────────────────────────────────────────
export const ROSE_BLEU_AR_PALETTES: BismillahPalette[] = [
  {
    id: 'rb_ar_bleu',
    name: 'Bleu & pêche',
    accent: '#6b8fa8',
    accentDark: '#4a6b82',
    accentSoft: 'rgba(107,143,168,0.12)',
    border: 'rgba(107,143,168,0.28)',
    bg: '#f5ede0',
    textPrimary: '#1A2530',
    textSecondary: '#3A5060',
    textMuted: '#8A9FAA',
    preview: ['#6b8fa8', '#f5ede0', '#1A2530', '#8A9FAA'],
  },
  {
    id: 'rb_ar_ciel',
    name: 'Bleu ciel & or',
    accent: '#4A6B87',
    accentDark: '#2E4A62',
    accentSoft: 'rgba(74,107,135,0.12)',
    border: 'rgba(74,107,135,0.25)',
    bg: '#EAE5DC',
    textPrimary: '#1A2030',
    textSecondary: '#3A4860',
    textMuted: '#7A88A0',
    decorativeGold: '#C9A84C',
    preview: ['#4A6B87', '#C9A84C', '#EAE5DC', '#7A88A0'],
  },
  {
    id: 'rb_ar_ardoise',
    name: 'Ardoise douce',
    accent: '#5A6E7A',
    accentDark: '#3A4E5A',
    accentSoft: 'rgba(90,110,122,0.12)',
    border: 'rgba(90,110,122,0.25)',
    bg: '#EDE8E0',
    textPrimary: '#202830',
    textSecondary: '#405060',
    textMuted: '#8A9298',
    preview: ['#5A6E7A', '#EDE8E0', '#202830', '#8A9298'],
  },
  {
    id: 'rb_ar_noir',
    name: 'Nuit noire',
    accent: '#8AAFC8',
    accentDark: '#6b8fa8',
    accentSoft: 'rgba(138,175,200,0.15)',
    border: 'rgba(138,175,200,0.25)',
    bg: '#111111',
    textPrimary: '#F0EBE2',
    textSecondary: '#8AAFC8',
    textMuted: '#5A6E7A',
    decorativeGold: '#8AAFC8',
    preview: ['#111111', '#8AAFC8', '#F0EBE2', '#5A6E7A'],
  },
]

// ── Template 7 AR — or & bordeaux ───────────────────────────────────────────
export const TEMPLATE_7_AR_PALETTES: BismillahPalette[] = [
  {
    id: 't7_ar_or',
    name: 'Or & beige nacré',
    accent: '#B8924A',
    accentDark: '#8B6914',
    accentSoft: 'rgba(184,146,74,0.12)',
    border: 'rgba(184,146,74,0.25)',
    bg: '#f8f3ef',
    textPrimary: '#2C1A10',
    textSecondary: '#5A3A28',
    textMuted: '#8B6A5A',
    preview: ['#B8924A', '#f8f3ef', '#2C1A10', '#8B6A5A'],
  },
  {
    id: 't7_ar_bordeaux',
    name: 'Bordeaux & or',
    accent: '#7B3A55',
    accentDark: '#5C2038',
    accentSoft: 'rgba(123,58,85,0.12)',
    border: 'rgba(123,58,85,0.25)',
    bg: '#FAF0F3',
    textPrimary: '#2C1018',
    textSecondary: '#5A2838',
    textMuted: '#9A6A78',
    decorativeGold: '#B8924A',
    preview: ['#7B3A55', '#B8924A', '#FAF0F3', '#9A6A78'],
  },
  {
    id: 't7_ar_sable',
    name: 'Sable doré',
    accent: '#9A7A4A',
    accentDark: '#7A5A30',
    accentSoft: 'rgba(154,122,74,0.12)',
    border: 'rgba(154,122,74,0.25)',
    bg: '#F5EFE5',
    textPrimary: '#2A1E10',
    textSecondary: '#5A4020',
    textMuted: '#9A8060',
    preview: ['#9A7A4A', '#F5EFE5', '#2A1E10', '#9A8060'],
  },
  {
    id: 't7_ar_noir',
    name: 'Nuit noire',
    accent: '#C9A84C',
    accentDark: '#B8924A',
    accentSoft: 'rgba(201,168,76,0.15)',
    border: 'rgba(201,168,76,0.25)',
    bg: '#111111',
    textPrimary: '#F5F0EA',
    textSecondary: '#C9A84C',
    textMuted: '#7A6A40',
    decorativeGold: '#C9A84C',
    preview: ['#111111', '#C9A84C', '#F5F0EA', '#7A6A40'],
  },
]

// ── Template 8 AR — rose & crème doux ───────────────────────────────────────
export const TEMPLATE_8_AR_PALETTES: BismillahPalette[] = [
  {
    id: 't8_ar_rose',
    name: 'Rose & crème',
    accent: '#C06080',
    accentDark: '#8B4070',
    accentSoft: 'rgba(192,96,128,0.12)',
    border: 'rgba(192,96,128,0.22)',
    bg: '#fffded',
    textPrimary: '#3A1A2A',
    textSecondary: '#7B4060',
    textMuted: '#9B6A80',
    preview: ['#C06080', '#fffded', '#3A1A2A', '#9B6A80'],
  },
  {
    id: 't8_ar_framboise',
    name: 'Framboise & ivoire',
    accent: '#A03060',
    accentDark: '#782048',
    accentSoft: 'rgba(160,48,96,0.12)',
    border: 'rgba(160,48,96,0.25)',
    bg: '#FFF5F5',
    textPrimary: '#2A0818',
    textSecondary: '#6A2040',
    textMuted: '#9A5870',
    decorativeGold: '#C9A84C',
    preview: ['#A03060', '#C9A84C', '#FFF5F5', '#9A5870'],
  },
  {
    id: 't8_ar_poudre',
    name: 'Rose poudré',
    accent: '#D48090',
    accentDark: '#B06070',
    accentSoft: 'rgba(212,128,144,0.12)',
    border: 'rgba(212,128,144,0.22)',
    bg: '#FEF9F8',
    textPrimary: '#3A1820',
    textSecondary: '#6A3848',
    textMuted: '#A07888',
    preview: ['#D48090', '#FEF9F8', '#3A1820', '#A07888'],
  },
  {
    id: 't8_ar_noir',
    name: 'Nuit noire',
    accent: '#E8A0B8',
    accentDark: '#C06080',
    accentSoft: 'rgba(232,160,184,0.15)',
    border: 'rgba(232,160,184,0.25)',
    bg: '#111111',
    textPrimary: '#F8F0F3',
    textSecondary: '#E8A0B8',
    textMuted: '#7A4860',
    decorativeGold: '#E8A0B8',
    preview: ['#111111', '#E8A0B8', '#F8F0F3', '#7A4860'],
  },
]

export const AR_STYLE_PALETTES_MAP: Record<string, BismillahPalette[]> = {
  'toile_bleue_ar':  TOILE_BLEUE_AR_PALETTES,
  'jardin_rose_ar':  JARDIN_ROSE_AR_PALETTES,
  'floral_arch_ar':  FLORAL_ARCH_AR_PALETTES,
  'roses_ivoire_ar': ROSES_IVOIRE_AR_PALETTES,
  'rose_bleu_ar':    ROSE_BLEU_AR_PALETTES,
  'template_7_ar':   TEMPLATE_7_AR_PALETTES,
  'template_8_ar':   TEMPLATE_8_AR_PALETTES,
}

export function getArStylePalettes(templateId: string): BismillahPalette[] {
  return AR_STYLE_PALETTES_MAP[templateId] ?? TOILE_BLEUE_AR_PALETTES
}

export function getBismillahPalette(id?: string | null): BismillahPalette {
  const allAr = Object.values(AR_STYLE_PALETTES_MAP).flat()
  return (
    BISMILLAH_PALETTES.find(p => p.id === id) ??
    allAr.find(p => p.id === id) ??
    BISMILLAH_PALETTES[0]
  )
}

export interface BismillahAsset {
  id: string
  name: string
}

export const BISMILLAH_BACKGROUNDS: BismillahAsset[] = [
  { id: 'bg-texture.jpg',  name: 'Texturé crème' },
  { id: 'bg-texture2.png', name: 'Ivoire doux' },
  { id: 'bg-texture4.png', name: 'Gris taupe' },
]

export const BISMILLAH_DECORATIONS: BismillahAsset[] = [
  { id: 'decoration.png',  name: 'Roses blanches' },
  { id: 'decoration2.png', name: 'Roses sculptées' },
  { id: 'decoration3.png', name: 'Arche dorée' },
  { id: 'decoration4.png', name: 'Colonnades fleuries' },
  { id: 'decoration5.png', name: 'Dentelle & pivoines' },
  { id: 'decoration6.png', name: 'Arche dorée & roses' },
]
