import { SOIREE_AR, SOIREE_FR } from '@/lib/soiree-strings'

/**
 * Textes de l'aperçu partagé — titre d'onglet, titre et description Open Graph.
 *
 * Soirée couvre un henné, des fiançailles, une réception. Annoncer
 * « invitation au mariage de » avec deux prénoms y est faux : le formulaire
 * exige bien deux noms, mais ce n'est pas ce que la soirée célèbre ce soir-là.
 * Ces templates partagent donc sous le titre de la soirée. Partout ailleurs les
 * prénoms restent, puisqu'il s'agit bien d'un mariage.
 */
export function buildShareCopy({
  templateId,
  weddingDayText,
  brideName,
  groomName,
  date,
}: {
  templateId?: string | null
  weddingDayText?: string | null
  brideName: string
  groomName: string
  date: string
}) {
  const strings =
    templateId === 'soiree_ar' ? SOIREE_AR :
    templateId === 'soiree_fr' ? SOIREE_FR : null

  if (strings) {
    const eveningTitle = weddingDayText?.trim() || strings.heroTitleDefault
    return {
      /** Titre passé au générateur d'image ; absent, il retombe sur les prénoms. */
      imageTitle: eveningTitle,
      title: `${eveningTitle} · ${date}`,
      description: strings.shareDescription,
    }
  }

  return {
    imageTitle: undefined,
    title: `${brideName} & ${groomName} · ${date}`,
    description: `Vous êtes cordialement invités au mariage de ${brideName} et ${groomName}.`,
  }
}
