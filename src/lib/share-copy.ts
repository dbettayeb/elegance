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
/**
 * Nom sous lequel l'invitation se présente : le titre de la soirée sur les
 * templates Soirée, les deux prénoms partout ailleurs.
 *
 * Le formulaire exige toujours les deux noms — ils servent au dossier, aux
 * emails, à l'adresse de l'invitation. Mais une soirée de henné ou de
 * fiançailles ne se présente pas sous « X & Y » : ce n'est pas leur mariage.
 */
export function invitationHeading({
  templateId,
  weddingDayText,
  brideName,
  groomName,
}: {
  templateId?: string | null
  weddingDayText?: string | null
  brideName: string
  groomName: string
}): string {
  const strings =
    templateId === 'soiree_ar' ? SOIREE_AR :
    templateId === 'soiree_fr' ? SOIREE_FR : null
  if (strings) return weddingDayText?.trim() || strings.heroTitleDefault
  return `${brideName} & ${groomName}`
}

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
    const eveningTitle = invitationHeading({ templateId, weddingDayText, brideName, groomName })
    return {
      /** Titre passé au générateur d'image ; absent, il retombe sur les prénoms. */
      imageTitle: eveningTitle,
      // Isolats directionnels. Un titre arabe impose sinon sa direction à toute
      // la ligne, et « 22 août 2026 » s'y réordonne en « août 2026 · 22 ».
      // U+2068 laisse le titre choisir son sens, U+2066 fige la date de gauche
      // à droite, U+2069 referme : chaque bloc est mis en forme sans influencer
      // l'autre.
      title: `\u2068${eveningTitle}\u2069 · \u2066${date}\u2069`,
      description: strings.shareDescription,
    }
  }

  return {
    imageTitle: undefined,
    title: `${brideName} & ${groomName} · ${date}`,
    description: `Vous êtes cordialement invités au mariage de ${brideName} et ${groomName}.`,
  }
}
