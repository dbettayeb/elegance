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
  toile_bleue: {
    pageBg: '#EAE0D1',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #2A4570 0%, #3D5A8A 100%)',
    textPrimary: '#2C2416',
    textSecondary: '#4A3A28',
    textMuted: '#8B7A6A',
    accent: '#3D5A8A',
    accentSoft: 'rgba(61, 90, 138, 0.12)',
    accentText: '#2A4570',
    success: '#2d6a4f',
    warning: '#8B6914',
    danger: '#c0392b',
    border: 'rgba(61, 90, 138, 0.25)',
    borderStrong: 'rgba(61, 90, 138, 0.45)',
    headingFont: '"EB Garamond", Garamond, Georgia, serif',
    bodyFont: '"EB Garamond", Garamond, Georgia, serif',
    cardShadow: '0 2px 8px rgba(61, 90, 138, 0.08)',
    radius: '2px',
  },
  jardin_rose: {
    pageBg: '#F0E5E3',
    cardBg: '#FDF7F5',
    headerBg: 'linear-gradient(135deg, #9A5858 0%, #B87070 100%)',
    textPrimary: '#3D2B2B',
    textSecondary: '#6B4F4F',
    textMuted: '#9E7F7F',
    accent: '#B87070',
    accentSoft: 'rgba(184, 112, 112, 0.12)',
    accentText: '#9A5858',
    success: '#5A7A60',
    warning: '#B8885A',
    danger: '#B83030',
    border: 'rgba(184, 112, 112, 0.25)',
    borderStrong: 'rgba(184, 112, 112, 0.45)',
    headingFont: '"EB Garamond", Garamond, Georgia, serif',
    bodyFont: '"EB Garamond", Garamond, Georgia, serif',
    cardShadow: '0 2px 8px rgba(184, 112, 112, 0.08)',
    radius: '2px',
  },
  floral_arch: {
    pageBg: '#f8f7f7',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #3a5934 0%, #497043 100%)',
    textPrimary: '#497043',
    textSecondary: '#7b7872',
    textMuted: '#a09c96',
    accent: '#e38080',
    accentSoft: 'rgba(227, 128, 128, 0.12)',
    accentText: '#c86060',
    success: '#497043',
    warning: '#e38080',
    danger: '#c86060',
    border: 'rgba(73, 112, 67, 0.2)',
    borderStrong: 'rgba(73, 112, 67, 0.4)',
    headingFont: '"Great Vibes", cursive',
    bodyFont: '"Raleway", sans-serif',
    cardShadow: '0 2px 8px rgba(73, 112, 67, 0.08)',
    radius: '4px',
  },
  carte_simple: {
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
  rose_bleu: {
    pageBg: '#f5ede0',
    cardBg: 'rgba(255,255,255,0.55)',
    headerBg: 'linear-gradient(135deg, #4a6b82 0%, #6b8fa8 100%)',
    textPrimary: '#6b8fa8',
    textSecondary: '#8aafc8',
    textMuted: '#a8c8e0',
    accent: '#6b8fa8',
    accentSoft: 'rgba(107, 143, 168, 0.12)',
    accentText: '#4a6b82',
    success: '#5C7A4A',
    warning: '#9e8060',
    danger: '#c0392b',
    border: 'rgba(107, 143, 168, 0.28)',
    borderStrong: 'rgba(107, 143, 168, 0.5)',
    headingFont: '"Tangerine", cursive',
    bodyFont: '"Raleway", sans-serif',
    cardShadow: '0 2px 8px rgba(107, 143, 168, 0.1)',
    radius: '4px',
  },
  roses_ivoire: {
    pageBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #f5ede3 0%, #ede0d0 100%)',
    textPrimary: '#82674b',
    textSecondary: '#9e8060',
    textMuted: '#c4a882',
    accent: '#82674b',
    accentSoft: 'rgba(130, 103, 75, 0.12)',
    accentText: '#6a5238',
    success: '#5C7A4A',
    warning: '#9e8060',
    danger: '#c0392b',
    border: 'rgba(130, 103, 75, 0.25)',
    borderStrong: 'rgba(130, 103, 75, 0.45)',
    headingFont: '"Parisienne", cursive',
    bodyFont: '"Raleway", sans-serif',
    cardShadow: '0 2px 8px rgba(130, 103, 75, 0.08)',
    radius: '4px',
  },

  template_7: {
    pageBg: '#f8f3ef',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #8B6914 0%, #B8924A 100%)',
    textPrimary: '#2C1A10',
    textSecondary: '#5A3A28',
    textMuted: '#8B6A5A',
    accent: '#B8924A',
    accentSoft: 'rgba(184,146,74,0.12)',
    accentText: '#8B6914',
    success: '#5C7A4A',
    warning: '#B8924A',
    danger: '#7B1E2E',
    border: 'rgba(184,146,74,0.25)',
    borderStrong: 'rgba(184,146,74,0.5)',
    headingFont: '"Alex Brush", cursive',
    bodyFont: '"Raleway", sans-serif',
    cardShadow: '0 2px 8px rgba(184,146,74,0.08)',
    radius: '2px',
  },
  template_8: {
    pageBg: '#fffded',
    cardBg: '#FFFFFF',
    headerBg: 'linear-gradient(135deg, #8B4070 0%, #C06080 100%)',
    textPrimary: '#3A1A2A',
    textSecondary: '#7B4060',
    textMuted: '#9B6A80',
    accent: '#C06080',
    accentSoft: 'rgba(192,96,128,0.12)',
    accentText: '#8B4070',
    success: '#5C7A4A',
    warning: '#B87A50',
    danger: '#8B1A2A',
    border: 'rgba(192,96,128,0.25)',
    borderStrong: 'rgba(192,96,128,0.5)',
    headingFont: '"Great Vibes", cursive',
    bodyFont: '"Raleway", sans-serif',
    cardShadow: '0 2px 8px rgba(192,96,128,0.08)',
    radius: '4px',
  },

  toile_bleue_ar: {
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
  jardin_rose_ar: {
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
  floral_arch_ar: {
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
  roses_ivoire_ar: {
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
  rose_bleu_ar: {
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
}

export function getTheme(templateId: Wedding['template_id']): CoupleTheme {
  return THEMES[templateId] ?? THEMES.coeur_dore
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