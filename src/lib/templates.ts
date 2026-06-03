import BlancDore from '@/components/templates/BlancDore'
import NuitEtoilee from '@/components/templates/NuitEtoilee'
import JardinAndalou from '@/components/templates/JardinAndalou'
import Minimaliste from '@/components/templates/Minimaliste'
import RosePoudre from '@/components/templates/RosePoudre'
import MarbreNoir from '@/components/templates/MarbreNoir'
import { Wedding } from '@/lib/types'
import { TEMPLATES_META, TemplateMeta } from '@/lib/templates-meta'

// Re-export pour rétro-compatibilité
export type { TemplateMeta }
export { TEMPLATES_META }

// Registre complet avec les composants React (Server-only)
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
}

export const TEMPLATES: TemplateFull[] = TEMPLATES_META.map(meta => ({
  ...meta,
  component: COMPONENTS[meta.id],
}))

export function getTemplate(id: string): TemplateFull {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0]
}