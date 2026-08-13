/** Violation d'une contrainte CHECK côté Postgres. */
const CHECK_VIOLATION = '23514'

/**
 * Une saisie que la base refuse est une erreur de l'invité, pas du serveur.
 *
 * Le livre d'or renvoyait « Erreur serveur » à qui écrivait un mot trop court :
 * l'invité ne pouvait ni comprendre ni corriger, et rien ne signalait que son
 * message n'était pas parti. Ces violations deviennent donc un 400 avec une
 * phrase qui dit quoi faire.
 */
export function isCheckViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: string }).code === CHECK_VIOLATION
  )
}
