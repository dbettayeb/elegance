// Caractères de contrôle invisibles, en préservant \t \n \r
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter('fr', { granularity: 'grapheme' })
    : null

/**
 * Découpe en caractères tels qu'un humain les perçoit.
 * `'❤️'.length` vaut 2 (le cœur + un sélecteur de variante invisible) et un
 * emoji hors du plan de base en vaut 2 aussi : compter en `.length` amputerait
 * le budget de l'invité sans qu'il comprenne pourquoi.
 */
function graphemes(input: string): string[] {
  if (segmenter) return Array.from(segmenter.segment(input), s => s.segment)
  return [...input] // repli par points de code : ne coupe pas une paire de substitution
}

/** Longueur perçue par un humain, emojis comptés pour 1. */
export function countChars(input: string): number {
  return graphemes(input).length
}

/**
 * Nettoie un texte saisi par un invité avant stockage.
 *
 * Volontairement, aucun échappement HTML n'est appliqué ici : le texte est
 * stocké tel qu'il a été écrit, et c'est à l'affichage que l'échappement doit
 * se faire. React le fait déjà pour tout `{texte}` ; pour les chaînes HTML
 * construites à la main (emails), utiliser `escapeHtml` au moment du rendu.
 * Échapper au stockage produisait des `J&#x27;espère` visibles à l'écran, une
 * apostrophe consommant 6 caractères du quota au lieu d'un seul.
 */
export function sanitizeText(input: string, maxLength = 500): string {
  const cleaned = input.trim().replace(CONTROL_CHARS, '')
  const chars = graphemes(cleaned)
  return chars.length <= maxLength ? cleaned : chars.slice(0, maxLength).join('')
}

export function sanitizeName(input: string): string {
  return sanitizeText(input, 80)
}

export function sanitizePhone(input: string): string {
  return input.replace(/[^0-9+\s\-]/g, '').slice(0, 20)
}

/**
 * Échappe un texte destiné à être inséré dans une chaîne HTML construite à la
 * main (emails). L'esperluette passe en premier, sinon les entités produites
 * juste après seraient ré-échappées.
 */
export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
