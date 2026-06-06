import BlancDore from '@/components/templates/BlancDore'
import NuitEtoilee from '@/components/templates/NuitEtoilee'
import JardinAndalou from '@/components/templates/JardinAndalou'
import Minimaliste from '@/components/templates/Minimaliste'
import RosePoudre from '@/components/templates/RosePoudre'
import MarbreNoir from '@/components/templates/MarbreNoir'
import Bismillah from '@/components/templates/Bismillah'
import AlAsala from '@/components/templates/AlAsala'
import AlQamar from '@/components/templates/AlQamar'
import SceauRoyal from '@/components/templates/SceauRoyal'
import CristalChampagne from '@/components/templates/CristalChampagne'
import ChateauPivoines from '@/components/templates/Chateaupivoines'
import CoeurDore from '@/components/templates/Coeurdore'
import { Wedding } from '@/lib/types'
import { TEMPLATES_META, TemplateMeta } from '@/lib/templates-meta'

export type { TemplateMeta }
export { TEMPLATES_META }

export interface TemplateFull extends TemplateMeta {
  component: React.ComponentType<{ wedding: Wedding }>
}

const COMPONENTS: Record<Wedding['template_id'], React.ComponentType<{ wedding: Wedding }>> = {
  blanc_dore: BlancDore,
  nuit_etoilee: NuitEtoilee,
  jardin_andalou: JardinAndalou,
  minimaliste: Minimaliste,
  rose_poudre: RosePoudre,
  marbre_noir: MarbreNoir,
  bismillah: Bismillah,
  al_asala: AlAsala,
  al_qamar: AlQamar,
  sceau_royal: SceauRoyal,
  cristal_champagne: CristalChampagne,
  chateau_pivoines: ChateauPivoines,
  coeur_dore: CoeurDore,
}

export const TEMPLATES: TemplateFull[] = TEMPLATES_META.map(meta => ({
  ...meta,
  component: COMPONENTS[meta.id],
}))

export function getTemplate(id: string): TemplateFull {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0]
}