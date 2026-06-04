import type { Wedding } from '@/lib/types'

export interface TemplateMeta {
  id: Wedding['template_id']
  name: string
  description: string
  tags: string[]
  palette: string[]
  ambiance: 'clair' | 'sombre' | 'pastel'
  language?: 'fr' | 'ar'
}

export const TEMPLATES_META: TemplateMeta[] = [
  // ───────── Templates français/européens ─────────
  {
    id: 'blanc_dore',
    name: 'Blanc & Doré',
    description: 'Classique intemporel. Fond crème, typographie serif, ornements dorés. Le choix le plus demandé pour les mariages traditionnels.',
    tags: ['Classique', 'Traditionnel', 'Mariage de jour'],
    palette: ['#FAF7F0', '#C9A84C', '#8B6914', '#2C2416'],
    ambiance: 'clair',
    language: 'fr',
  },
  {
    id: 'nuit_etoilee',
    name: 'Nuit Étoilée',
    description: 'Pour les soirées prestigieuses. Fond noir profond, étoiles animées, accents dorés lumineux. Effet "tapis rouge".',
    tags: ['Soirée', 'Glamour', 'Spectaculaire'],
    palette: ['#0A0A1F', '#1a1a3a', '#D4AF37', '#F5E6A8'],
    ambiance: 'sombre',
    language: 'fr',
  },
  {
    id: 'jardin_andalou',
    name: 'Jardin Andalou',
    description: 'Élégance orientale. Motifs géométriques en filigrane, tons sauge et or rosé. Inspiré des palais arabo-andalous.',
    tags: ['Oriental', 'Sophistiqué', 'Patrimoine'],
    palette: ['#F4EFE6', '#A8B5A0', '#C9A87A', '#3D4A3A'],
    ambiance: 'pastel',
    language: 'fr',
  },
  {
    id: 'minimaliste',
    name: 'Minimaliste Parisien',
    description: 'Sobriété chic. Tout blanc, typographie ultra-fine, une seule ligne dorée. Pour les couples qui préfèrent l\'épure.',
    tags: ['Moderne', 'Épuré', 'Mariage civil'],
    palette: ['#FFFFFF', '#F5F5F5', '#000000', '#B8985A'],
    ambiance: 'clair',
    language: 'fr',
  },
  {
    id: 'rose_poudre',
    name: 'Rose Poudré',
    description: 'Romantique et féminin. Tons blush, or champagne, fleurs aquarelle subtiles. Très demandé pour les mariées romantiques.',
    tags: ['Romantique', 'Féminin', 'Printemps'],
    palette: ['#FAF0EB', '#E8C5B5', '#D4A373', '#7C3F58'],
    ambiance: 'pastel',
    language: 'fr',
  },
  {
    id: 'marbre_noir',
    name: 'Marbre Noir',
    description: 'Ultra premium. Texture marbre sombre, texte blanc cassé, accents platine. Le top du luxe.',
    tags: ['Luxe', 'Premium', 'Sophistiqué'],
    palette: ['#1C1C1C', '#2A2A2A', '#E5E4E2', '#C0C0C0'],
    ambiance: 'sombre',
    language: 'fr',
  },

  // ───────── Templates arabes ─────────
  {
    id: 'bismillah',
    name: 'Bismillah ﷽',
    description: 'Template islamique. Blanc immaculé, calligraphie dorée Thuluth, versets coraniques. Pour mariages religieux traditionnels avec invocation Bismillah.',
    tags: ['Islamique', 'Religieux', 'Traditionnel', 'Coranique'],
    palette: ['#FFFFFF', '#FAF7F0', '#C9A84C', '#1A1A1A'],
    ambiance: 'clair',
    language: 'ar',
  },
  {
    id: 'al_asala',
    name: 'Al-Asala — الأصالة',
    description: 'Authenticité maghrébine. Zellige géométrique, tons terracotta et vert sauge, calligraphie Aref Ruqaa. Pour ambiance traditionnelle tunisienne.',
    tags: ['Maghrébin', 'Traditionnel', 'Zellige', 'Patrimoine'],
    palette: ['#FAF3E8', '#C97B5C', '#5C7A4A', '#3D2817'],
    ambiance: 'pastel',
    language: 'ar',
  },
  {
    id: 'al_qamar',
    name: 'Al-Qamar — القمر',
    description: 'La Lune. Nuit bleutée profonde, croissant lunaire doré, calligraphie Diwani moderne. Pour soirées prestigieuses au style oriental.',
    tags: ['Soirée', 'Oriental', 'Moderne', 'Glamour'],
    palette: ['#0F1B2D', '#1E3A5F', '#D4AF37', '#F4E5B0'],
    ambiance: 'sombre',
    language: 'ar',
  },
]