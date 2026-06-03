import type { Wedding } from '@/lib/types'

export interface TemplateMeta {
  id: Wedding['template_id']
  name: string
  description: string
  tags: string[]
  palette: string[]      // 3-4 couleurs principales pour la preview
  ambiance: 'clair' | 'sombre' | 'pastel'
}

export const TEMPLATES_META: TemplateMeta[] = [
  {
    id: 'blanc_dore',
    name: 'Blanc & Doré',
    description: 'Classique intemporel. Fond crème, typographie serif, ornements dorés. Le choix le plus demandé pour les mariages traditionnels.',
    tags: ['Classique', 'Traditionnel', 'Mariage de jour'],
    palette: ['#FAF7F0', '#C9A84C', '#8B6914', '#2C2416'],
    ambiance: 'clair',
  },
  {
    id: 'nuit_etoilee',
    name: 'Nuit Étoilée',
    description: 'Pour les soirées prestigieuses. Fond noir profond, étoiles animées, accents dorés lumineux. Effet "tapis rouge".',
    tags: ['Soirée', 'Glamour', 'Spectaculaire'],
    palette: ['#0A0A1F', '#1a1a3a', '#D4AF37', '#F5E6A8'],
    ambiance: 'sombre',
  },
  {
    id: 'jardin_andalou',
    name: 'Jardin Andalou',
    description: 'Élégance orientale. Motifs géométriques en filigrane, tons sauge et or rosé. Inspiré des palais arabo-andalous.',
    tags: ['Oriental', 'Sophistiqué', 'Patrimoine'],
    palette: ['#F4EFE6', '#A8B5A0', '#C9A87A', '#3D4A3A'],
    ambiance: 'pastel',
  },
  {
    id: 'minimaliste',
    name: 'Minimaliste Parisien',
    description: 'Sobriété chic. Tout blanc, typographie ultra-fine, une seule ligne dorée. Pour les couples qui préfèrent l\'épure.',
    tags: ['Moderne', 'Épuré', 'Mariage civil'],
    palette: ['#FFFFFF', '#F5F5F5', '#000000', '#B8985A'],
    ambiance: 'clair',
  },
  {
    id: 'rose_poudre',
    name: 'Rose Poudré',
    description: 'Romantique et féminin. Tons blush, or champagne, fleurs aquarelle subtiles. Très demandé pour les mariées romantiques.',
    tags: ['Romantique', 'Féminin', 'Printemps'],
    palette: ['#FAF0EB', '#E8C5B5', '#D4A373', '#7C3F58'],
    ambiance: 'pastel',
  },
  {
    id: 'marbre_noir',
    name: 'Marbre Noir',
    description: 'Ultra premium. Texture marbre sombre, texte blanc cassé, accents platine. Le top du luxe.',
    tags: ['Luxe', 'Premium', 'Sophistiqué'],
    palette: ['#1C1C1C', '#2A2A2A', '#E5E4E2', '#C0C0C0'],
    ambiance: 'sombre',
  },
]