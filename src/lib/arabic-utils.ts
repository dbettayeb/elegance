/**
 * Utilitaires pour les templates arabes
 */

// Convertir chiffres latins vers chiffres arabes orientaux
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

export function toArabicNumerals(str: string | number): string {
  return String(str).replace(/[0-9]/g, d => ARABIC_DIGITS[parseInt(d)])
}

// Mois arabes
const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

// Mois en arabe maghrébin/tunisien (calendrier grégorien usuel)
const ARABIC_MONTHS_MAGHREB = [
  'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
  'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

// Jours de la semaine
const ARABIC_DAYS = [
  'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت',
]

/**
 * Formate une date en arabe : "السبت ١٥ يونيو ٢٠٢٥"
 */
export function formatDateArabic(date: Date, useMaghreb = true): string {
  const day = ARABIC_DAYS[date.getDay()]
  const dayNum = toArabicNumerals(date.getDate())
  const month = useMaghreb ? ARABIC_MONTHS_MAGHREB[date.getMonth()] : ARABIC_MONTHS[date.getMonth()]
  const year = toArabicNumerals(date.getFullYear())
  return `${day} ${dayNum} ${month} ${year}`
}

/**
 * Formate uniquement le mois en arabe
 */
export function formatMonthArabic(date: Date, useMaghreb = true): string {
  return useMaghreb ? ARABIC_MONTHS_MAGHREB[date.getMonth()] : ARABIC_MONTHS[date.getMonth()]
}

/**
 * Formate l'heure en chiffres arabes : "١٩:٠٠"
 */
export function formatTimeArabic(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return toArabicNumerals(`${hours}:${minutes}`)
}

/**
 * Récupère le nom arabe d'un marié (avec fallback)
 */
export function getArabicName(arabicName: string | undefined, frenchName: string): string {
  return arabicName?.trim() || frenchName
}