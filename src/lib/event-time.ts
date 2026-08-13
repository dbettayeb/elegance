import { Wedding } from '@/lib/types'

/**
 * Construit l'instant de fin de la fête à partir des champs du formulaire.
 *
 * La bascule au lendemain se décide ici, en heure locale : une réception qui
 * commence à 19h et se termine à 2h finit le jour suivant. Comparer les deux
 * heures après passage en UTC donnerait un résultat faux dès que le décalage
 * horaire fait changer les dates de place.
 *
 * Renvoie une chaîne ISO en UTC, ou null si aucune fin n'est renseignée.
 */
export function buildEndDate(
  dateStr: string,
  startTime: string,
  endTime: string,
): string | null {
  if (!dateStr || !endTime) return null
  const start = new Date(`${dateStr}T${startTime || '00:00'}:00`)
  const end = new Date(`${dateStr}T${endTime}:00`)
  if (Number.isNaN(end.getTime()) || Number.isNaN(start.getTime())) return null
  if (end <= start) end.setDate(end.getDate() + 1)
  return end.toISOString()
}

/** Heure locale « HH:MM » d'un instant stocké, pour repeupler un champ du formulaire. */
export function toLocalTimeInput(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/**
 * Fin de la fête, ou null si le marié ne l'a pas renseignée — auquel cas les
 * templates n'affichent rien de plus et gardent leur mise en page d'origine.
 */
export function getEventEnd(wedding: Wedding): Date | null {
  if (!wedding.event_end_date) return null
  const d = new Date(wedding.event_end_date)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * « 19:00 » ou « 19:00 – 02:00 » selon que la fin est renseignée.
 *
 * Chaque template garde son propre formatage — locale, 12h ou 24h, chiffres
 * arabes ou occidentaux — en le passant ici : la fin est écrite exactement
 * comme le début, et rien ne change tant que le marié ne remplit pas le champ.
 */
export function timeRange(
  wedding: Wedding,
  start: Date,
  format: (d: Date) => string,
): string {
  const startLabel = format(start)
  const end = getEventEnd(wedding)
  if (!end) return startLabel
  // Isolat directionnel gauche-à-droite : sans lui, l'algorithme bidirectionnel
  // intervertit les deux heures dans une phrase arabe, et « 19:00 – 02:00 »
  // s'affiche « 02:00 – 19:00 ». Les deux caractères sont invisibles et sans
  // effet sur les templates latins.
  return `\u2066${startLabel} – ${format(end)}\u2069`
}
