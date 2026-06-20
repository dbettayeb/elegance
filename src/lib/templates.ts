import Bismillah from '@/components/templates/Bismillah'
import CoeurDore from '@/components/templates/Coeurdore'
import ViktorPaula from '@/components/templates/Viktorpaula'
import AlexaRichard from '@/components/templates/AlexaRichard'
import AlNour from '@/components/templates/AlNour'
import CarteSimple from '@/components/templates/CarteSimple'
import ToileBleue from '@/components/templates/ToileBleue'
import JardinRose from '@/components/templates/JardinRose'
import FloralArch from '@/components/templates/FloralArch'
import RosesIvoire from '@/components/templates/RosesIvoire'
import RoseBleu from '@/components/templates/RoseBleu'
import ToileBleueAr from '@/components/templates/ToileBleueAr'
import JardinRoseAr from '@/components/templates/JardinRoseAr'
import FloralArchAr from '@/components/templates/FloralArchAr'
import RosesIvoireAr from '@/components/templates/RosesIvoireAr'
import RoseBleuAr from '@/components/templates/RoseBleuAr'
import { Wedding } from '@/lib/types'
import { TEMPLATES_META, TemplateMeta } from '@/lib/templates-meta'

export type { TemplateMeta }
export { TEMPLATES_META }

export interface TemplateFull extends TemplateMeta {
  component: React.ComponentType<{ wedding: Wedding }>
}

const COMPONENTS: Record<Wedding['template_id'], React.ComponentType<{ wedding: Wedding }>> = {
  bismillah: Bismillah,
  coeur_dore: CoeurDore,
  viktor_paula: ViktorPaula,
  alexa_richard: AlexaRichard,
  al_nour: AlNour,
  carte_simple: CarteSimple,
  toile_bleue: ToileBleue,
  jardin_rose: JardinRose,
  floral_arch: FloralArch,
  roses_ivoire: RosesIvoire,
  rose_bleu: RoseBleu,
  toile_bleue_ar: ToileBleueAr,
  jardin_rose_ar: JardinRoseAr,
  floral_arch_ar: FloralArchAr,
  roses_ivoire_ar: RosesIvoireAr,
  rose_bleu_ar: RoseBleuAr,
}

export const TEMPLATES: TemplateFull[] = TEMPLATES_META.map(meta => ({
  ...meta,
  component: COMPONENTS[meta.id],
}))

export function getTemplate(id: string): TemplateFull {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0]
}