import type { Wedding } from '@/lib/types'

export interface CoupleTheme {
  // Backgrounds
  pageBg: string
  cardBg: string
  headerBg: string

  // Texts
  textPrimary: string
  textSecondary: string
  textMuted: string

  // Accents
  accent: string
  accentSoft: string
  accentText: string

  // Status colors (gardent leur signification universelle mais teintées du thème)
  success: string
  warning: string
  danger: string

  // Borders
  border: string
  borderStrong: string

  // Typography
  headingFont: string
  bodyFont: string

  // Other
  cardShadow: string
  radius: string
}

const THEMES: Record<Wedding['template_id'], CoupleTheme> = {
  blanc_dore: {
    pageBg: '#FAF7F0',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #2C2416 0%, #3d2e18 100%)',
    textPrimary: '#2C2416',
    textSecondary: '#6B5A3E',
    textMuted: '#9B8A6E',
    accent: '#C9A84C',
    accentSoft: 'rgba(201, 168, 76, 0.12)',
    accentText: '#8B6914',
    success: '#2d6a4f',
    warning: '#8B6914',
    danger: '#c0392b',
    border: 'rgba(201, 168, 76, 0.2)',
    borderStrong: 'rgba(201, 168, 76, 0.4)',
    headingFont: 'Georgia, serif',
    bodyFont: '"Montserrat", -apple-system, sans-serif',
    cardShadow: '0 1px 3px rgba(139, 105, 20, 0.05)',
    radius: '2px',
  },

  nuit_etoilee: {
    pageBg: '#0A0A1F',
    cardBg: '#161628',
    headerBg: 'radial-gradient(ellipse at top, #1a1a3a 0%, #0A0A1F 70%)',
    textPrimary: '#F5E6A8',
    textSecondary: '#C5B47E',
    textMuted: '#9B9B85',
    accent: '#D4AF37',
    accentSoft: 'rgba(212, 175, 55, 0.12)',
    accentText: '#D4AF37',
    success: '#7ABB8C',
    warning: '#D4AF37',
    danger: '#E58A8A',
    border: 'rgba(212, 175, 55, 0.18)',
    borderStrong: 'rgba(212, 175, 55, 0.4)',
    headingFont: 'Georgia, serif',
    bodyFont: '"Montserrat", -apple-system, sans-serif',
    cardShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    radius: '2px',
  },

  jardin_andalou: {
    pageBg: '#F4EFE6',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #3D4A3A 0%, #2D372A 100%)',
    textPrimary: '#3D4A3A',
    textSecondary: '#6B7460',
    textMuted: '#A8B5A0',
    accent: '#C9A87A',
    accentSoft: 'rgba(201, 168, 122, 0.15)',
    accentText: '#8B6F47',
    success: '#4A6741',
    warning: '#C9A87A',
    danger: '#A85B5B',
    border: 'rgba(168, 181, 160, 0.3)',
    borderStrong: 'rgba(168, 181, 160, 0.5)',
    headingFont: 'Georgia, serif',
    bodyFont: '"Montserrat", -apple-system, sans-serif',
    cardShadow: '0 1px 3px rgba(61, 74, 58, 0.06)',
    radius: '2px',
  },

  minimaliste: {
    pageBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    headerBg: '#FAFAFA',
    textPrimary: '#000000',
    textSecondary: '#404040',
    textMuted: '#888888',
    accent: '#B8985A',
    accentSoft: 'rgba(184, 152, 90, 0.1)',
    accentText: '#8C7042',
    success: '#16a34a',
    warning: '#B8985A',
    danger: '#dc2626',
    border: '#F0F0F0',
    borderStrong: '#D4D4D4',
    headingFont: 'Georgia, serif',
    bodyFont: '"Montserrat", -apple-system, sans-serif',
    cardShadow: 'none',
    radius: '0px',
  },

  rose_poudre: {
    pageBg: '#FAF0EB',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #7C3F58 0%, #9B6478 100%)',
    textPrimary: '#7C3F58',
    textSecondary: '#9B6478',
    textMuted: '#B58A99',
    accent: '#D4A373',
    accentSoft: 'rgba(212, 163, 115, 0.15)',
    accentText: '#A87844',
    success: '#5A8A6F',
    warning: '#D4A373',
    danger: '#C0392B',
    border: 'rgba(212, 163, 115, 0.25)',
    borderStrong: 'rgba(212, 163, 115, 0.5)',
    headingFont: 'Georgia, serif',
    bodyFont: '"Montserrat", -apple-system, sans-serif',
    cardShadow: '0 2px 8px rgba(124, 63, 88, 0.08)',
    radius: '12px',
  },

  marbre_noir: {
    pageBg: '#1C1C1C',
    cardBg: '#2A2A2A',
    headerBg: 'radial-gradient(ellipse at center, #2A2A2A 0%, #1C1C1C 70%, #0A0A0A 100%)',
    textPrimary: '#E5E4E2',
    textSecondary: '#B8B8B6',
    textMuted: '#888887',
    accent: '#C0C0C0',
    accentSoft: 'rgba(192, 192, 192, 0.1)',
    accentText: '#E5E4E2',
    success: '#8FCB94',
    warning: '#E5C77B',
    danger: '#E58A8A',
    border: 'rgba(192, 192, 192, 0.15)',
    borderStrong: 'rgba(192, 192, 192, 0.35)',
    headingFont: 'Georgia, serif',
    bodyFont: '"Montserrat", -apple-system, sans-serif',
    cardShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
    radius: '0px',
  },

  bismillah: {
    pageBg: '#FFFFFF',
    cardBg: '#FAF7F0',
    headerBg: 'linear-gradient(135deg, #FAF7F0 0%, #FFFFFF 100%)',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A3E2A',
    textMuted: '#9B8A6E',
    accent: '#C9A84C',
    accentSoft: 'rgba(201, 168, 76, 0.1)',
    accentText: '#8B6914',
    success: '#5C7A4A',
    warning: '#D97706',
    danger: '#B91C1C',
    border: 'rgba(201, 168, 76, 0.25)',
    borderStrong: 'rgba(201, 168, 76, 0.5)',
    headingFont: "'Aref Ruqaa', Georgia, serif",
    bodyFont: "'Amiri', Georgia, serif",
    cardShadow: '0 4px 16px rgba(201, 168, 76, 0.12)',
    radius: '0px',
  },

  // ────────── Al-Asala (maghrébin terracotta + sauge) ──────────
  al_asala: {
    pageBg: '#FAF3E8',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #5C7A4A 0%, #4A6638 100%)',
    textPrimary: '#3D2817',
    textSecondary: '#5C4A33',
    textMuted: '#7A6549',
    accent: '#C97B5C',
    accentSoft: 'rgba(201, 123, 92, 0.12)',
    accentText: '#A85B3F',
    success: '#5C7A4A',
    warning: '#D97706',
    danger: '#B91C1C',
    border: 'rgba(92, 122, 74, 0.25)',
    borderStrong: 'rgba(92, 122, 74, 0.5)',
    headingFont: "'Aref Ruqaa', Georgia, serif",
    bodyFont: "'Amiri', Georgia, serif",
    cardShadow: '0 4px 16px rgba(201, 123, 92, 0.15)',
    radius: '0px',
  },

  // ────────── Al-Qamar (nuit bleutée + or lunaire) ──────────
  al_qamar: {
    pageBg: '#0F1B2D',
    cardBg: '#152843',
    headerBg: 'radial-gradient(ellipse at top, #1E3A5F 0%, #0F1B2D 70%)',
    textPrimary: '#F4E5B0',
    textSecondary: '#C5B47E',
    textMuted: '#9B9B85',
    accent: '#D4AF37',
    accentSoft: 'rgba(212, 175, 55, 0.15)',
    accentText: '#D4AF37',
    success: '#7ABB8C',
    warning: '#D4AF37',
    danger: '#E58A8A',
    border: 'rgba(212, 175, 55, 0.25)',
    borderStrong: 'rgba(212, 175, 55, 0.5)',
    headingFont: "'Aref Ruqaa', Georgia, serif",
    bodyFont: "'Amiri', Georgia, serif",
    cardShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    radius: '0px',
  },
  sceau_royal: {
    pageBg: '#F4EDE0',
    cardBg: '#FBF7EE',
    headerBg: 'linear-gradient(135deg, #1A1A1A 0%, #2A2620 100%)',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A3F2A',
    textMuted: '#8B7A5C',
    accent: '#7B1E1E',
    accentSoft: 'rgba(123, 30, 30, 0.10)',
    accentText: '#7B1E1E',
    success: '#2d6a4f',
    warning: '#B8985A',
    danger: '#7B1E1E',
    border: 'rgba(184, 152, 90, 0.25)',
    borderStrong: 'rgba(184, 152, 90, 0.5)',
    headingFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    cardShadow: '0 1px 3px rgba(74, 15, 15, 0.06)',
    radius: '2px',
  },
  cristal_champagne: {
    pageBg: '#F7F1E5',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
    textPrimary: '#0A0A0A',
    textSecondary: '#5C5043',
    textMuted: '#8B7A5C',
    accent: '#D4AF7A',
    accentSoft: 'rgba(212, 175, 122, 0.12)',
    accentText: '#A88547',
    success: '#2d6a4f',
    warning: '#A88547',
    danger: '#7B1E1E',
    border: 'rgba(212, 175, 122, 0.25)',
    borderStrong: 'rgba(212, 175, 122, 0.5)',
    headingFont: '"Bodoni Moda", Georgia, serif',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    cardShadow: '0 1px 3px rgba(10, 10, 10, 0.06)',
    radius: '2px',
  },
  coeur_dore: {
    pageBg: '#F7ECD5',
    cardBg: '#FBF6EA',
    headerBg: 'linear-gradient(135deg, #FAF3E2 0%, #EFE3CB 100%)',
    textPrimary: '#4A3A20',
    textSecondary: '#5C4418',
    textMuted: '#8B7A5C',
    accent: '#B8924A',
    accentSoft: 'rgba(184, 146, 74, 0.12)',
    accentText: '#8C6A2A',
    success: '#2d6a4f',
    warning: '#B8924A',
    danger: '#7B1E2E',
    border: 'rgba(184, 146, 74, 0.25)',
    borderStrong: 'rgba(184, 146, 74, 0.5)',
    headingFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    cardShadow: '0 4px 14px rgba(140, 106, 42, 0.08)',
    radius: '2px',
  },
  chateau_pivoines: {
    pageBg: '#FAF6EE',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #7B1E2E 0%, #5C1422 100%)',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textMuted: '#8B7A5C',
    accent: '#7B1E2E',
    accentSoft: 'rgba(123, 30, 46, 0.10)',
    accentText: '#5C1422',
    success: '#2d6a4f',
    warning: '#A88547',
    danger: '#7B1E2E',
    border: 'rgba(123, 30, 46, 0.18)',
    borderStrong: 'rgba(123, 30, 46, 0.4)',
    headingFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    cardShadow: '0 2px 8px rgba(60, 20, 30, 0.06)',
    radius: '2px',
  },
  alexa_richard: {
    pageBg: '#fffdfb',
    cardBg: '#ffffff',
    headerBg: 'linear-gradient(135deg, #52839c 0%, #64a0bd 100%)',
    textPrimary: '#3a3a3a',
    textSecondary: '#4a4a4a',
    textMuted: '#7a9aaa',
    accent: '#64a0bd',
    accentSoft: 'rgba(100, 160, 189, 0.12)',
    accentText: '#52839c',
    success: '#2d6a4f',
    warning: '#9bc9e1',
    danger: '#c0392b',
    border: 'rgba(100, 160, 189, 0.2)',
    borderStrong: 'rgba(100, 160, 189, 0.4)',
    headingFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    cardShadow: '0 2px 8px rgba(100, 160, 189, 0.10)',
    radius: '12px',
  },
  viktor_paula: {
    pageBg: '#66021f',
    cardBg: '#fffaf8',
    headerBg: 'linear-gradient(135deg, #7a0226 0%, #66021f 100%)',
    textPrimary: '#fffaf8',
    textSecondary: '#f5ece9',
    textMuted: 'rgba(255,250,248,0.55)',
    accent: '#c4294d',
    accentSoft: 'rgba(102,1,32,0.12)',
    accentText: '#4a0116',
    success: '#2d6a4f',
    warning: '#c4294d',
    danger: '#8b0130',
    border: 'rgba(255,250,248,0.18)',
    borderStrong: 'rgba(255,250,248,0.4)',
    headingFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    cardShadow: '0 4px 14px rgba(0,0,0,0.4)',
    radius: '2px',
  },
  ivoire_dore: {
    pageBg: '#EDE9E2',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #2C2416 0%, #3d2e18 100%)',
    textPrimary: '#2C2416',
    textSecondary: '#6B5A3E',
    textMuted: '#9B8A6E',
    accent: '#C9A84C',
    accentSoft: 'rgba(201, 168, 76, 0.12)',
    accentText: '#8B6914',
    success: '#2d6a4f',
    warning: '#8B6914',
    danger: '#c0392b',
    border: 'rgba(201, 168, 76, 0.25)',
    borderStrong: 'rgba(201, 168, 76, 0.45)',
    headingFont: '"Great Vibes", "Cormorant Garamond", Georgia, serif',
    bodyFont: '"Cormorant Garamond", Georgia, serif',
    cardShadow: '0 2px 8px rgba(139, 105, 20, 0.08)',
    radius: '2px',
  },
  al_nour: {
    pageBg: '#FAFAF6',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #FAF7F0 0%, #FFFFFF 100%)',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A3E2A',
    textMuted: '#9B8A6E',
    accent: '#C9A84C',
    accentSoft: 'rgba(201, 168, 76, 0.1)',
    accentText: '#8B6914',
    success: '#5C7A4A',
    warning: '#D97706',
    danger: '#B91C1C',
    border: 'rgba(201, 168, 76, 0.25)',
    borderStrong: 'rgba(201, 168, 76, 0.5)',
    headingFont: "'Aref Ruqaa', Georgia, serif",
    bodyFont: "'Amiri', Georgia, serif",
    cardShadow: '0 4px 16px rgba(201, 168, 76, 0.12)',
    radius: '0px',
  },
}

export function getTheme(templateId: Wedding['template_id']): CoupleTheme {
  return THEMES[templateId] ?? THEMES.blanc_dore
}

// Helper pour générer le style CSS d'une page entière à partir d'un thème
export function themeToCSS(theme: CoupleTheme): string {
  return `
    --cp-page-bg: ${theme.pageBg};
    --cp-card-bg: ${theme.cardBg};
    --cp-text-primary: ${theme.textPrimary};
    --cp-text-secondary: ${theme.textSecondary};
    --cp-text-muted: ${theme.textMuted};
    --cp-accent: ${theme.accent};
    --cp-accent-soft: ${theme.accentSoft};
    --cp-accent-text: ${theme.accentText};
    --cp-success: ${theme.success};
    --cp-warning: ${theme.warning};
    --cp-danger: ${theme.danger};
    --cp-border: ${theme.border};
    --cp-border-strong: ${theme.borderStrong};
    --cp-heading-font: ${theme.headingFont};
    --cp-body-font: ${theme.bodyFont};
    --cp-card-shadow: ${theme.cardShadow};
    --cp-radius: ${theme.radius};
  `
}