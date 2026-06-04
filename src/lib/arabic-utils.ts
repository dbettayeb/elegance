/**
 * Utilitaires pour les templates arabes
 * Chiffres en latin (1, 2, 3...) — seuls les mois et jours sont en arabe maghrébin
 */

// Identité : on garde les chiffres latins
export function toArabicNumerals(str: string | number): string {
  return String(str)
}

// Mois arabes orientaux (Moyen-Orient)
const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

// Mois en arabe maghrébin/tunisien
const ARABIC_MONTHS_MAGHREB = [
  'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
  'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

// Jours de la semaine
const ARABIC_DAYS = [
  'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت',
]

/**
 * Formate une date en arabe avec chiffres latins : "السبت 15 جانفي 2026"
 */
export function formatDateArabic(date: Date, useMaghreb = true): string {
  const day = ARABIC_DAYS[date.getDay()]
  const dayNum = date.getDate()
  const month = useMaghreb ? ARABIC_MONTHS_MAGHREB[date.getMonth()] : ARABIC_MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${dayNum} ${month} ${year}`
}

/**
 * Mois uniquement en arabe maghrébin
 */
export function formatMonthArabic(date: Date, useMaghreb = true): string {
  return useMaghreb ? ARABIC_MONTHS_MAGHREB[date.getMonth()] : ARABIC_MONTHS[date.getMonth()]
}

/**
 * Heure en chiffres latins : "19:00"
 */
export function formatTimeArabic(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Récupère le nom arabe d'un marié (fallback français)
 */
export function getArabicName(arabicName: string | undefined, frenchName: string): string {
  return arabicName?.trim() || frenchName
}