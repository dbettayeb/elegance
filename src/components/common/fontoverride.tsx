'use client'

import { getFontByName } from '@/lib/fonts'

interface Props {
  font?: string | null
  fontSize?: number | null
  container?: string  // ignoré, gardé pour compat
}

// Tous les sélecteurs où s'affichent les noms des mariés, à travers les templates.
// `.X-names *` couvre les enfants (.X-name, .X-amp, .X-and).
const NAME_SELECTORS = [
  '.ed-names', '.ed-names *', '.ed-footer-names',
  '.ne-names', '.ne-names *', '.ne-footer-names',
  '.ja-names', '.ja-names *', '.ja-footer-names',
  '.mn-names', '.mn-names *', '.mn-footer-names',
  '.rp-names', '.rp-names *', '.rp-footer-names',
  '.mb-names', '.mb-names *', '.mb-footer-names',
  '.bs-names', '.bs-names *', '.bs-footer-names',
  '.aa-names', '.aa-names *', '.aa-footer-names',
  '.aq-names', '.aq-names *', '.aq-footer-names',
  // Alexa & Richard
  '.ar-hero-names', '.ar-hero-names *', '.ar-closing-names',
  // Viktor & Paula
  '.hero-names-block', '.hero-names-block *', '.closing-names', '.hero-wedding-day',
  // Ivoire Doré
  '.iv-names', '.iv-names *', '.iv-footer-names',
  // ToileBleue
  '.tb-names', '.tb-names *', '.tb-footer-names',
  // CarteSimple
  '.cs-names', '.cs-names *', '.cs-footer-names',
  // JardinRose
  '.jr-names', '.jr-names *', '.jr-footer-names',
  // ChateauPivoines
  '.cp-names', '.cp-names *', '.cp-footer-names',
  // CristalChampagne
  '.cc-names', '.cc-names *', '.cc-footer-names',
  // SceauRoyal
  '.sr-names', '.sr-names *', '.sr-footer-names',
  // AlNour
  '.an-names', '.an-names *', '.an-footer-names',
  // Coeurdore
  '.cd-env-reveal-names', '.cd-name', '.cd-footer-names',
  // FloralArch
  '.fa-names', '.fa-names *', '.fa-footer-names',
  // RosesIvoire
  '.ri-names', '.ri-names *', '.ri-footer-names',
  // RoseBleu
  '.rb-names-line', '.rb-names-line *', '.rb-footer-names',
  // Template7
  '.t7-name', '.t7-footer-names',
  // Template8
  '.t8-name', '.t8-footer-names',
].join(',\n')

// Sélecteurs pour les noms de famille (bloc familles en arabe).
// La TAILLE (custom_font_size) s'applique uniquement aux noms et au connecteur و.
// Les préfixes (عائلة السيد) ont une taille fixe pour ne jamais être tronqués.
const FAMILY_SELECTORS = [
  '.bs-fn', '.bs-fand',
  '.an-fn', '.an-fand',
].join(',\n')

// Tous les éléments du bloc familles — la POLICE (custom_font) s'applique à tous.
const FAMILY_FONT_SELECTORS = [
  '.bs-fn', '.bs-fp', '.bs-fand', '.bs-families-intro',
  '.an-fn', '.an-fp', '.an-fand', '.an-families-intro',
].join(',\n')

export default function FontOverride({ font, fontSize }: Props) {
  const hasFontFamily = font && getFontByName(font)
  const hasFontSize = fontSize && fontSize !== 100

  if (!hasFontFamily && !hasFontSize) return null

  const fontOption = hasFontFamily ? getFontByName(font!) : null
  const fontSizePercent = fontSize ?? 100

  return (
    <>
      {fontOption && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${fontOption.googleFont}&display=swap`}
        />
      )}
      <style>{`
        ${hasFontFamily && fontOption ? `${NAME_SELECTORS},\n${FAMILY_FONT_SELECTORS} {
          font-family: ${fontOption.family} !important;
        }` : ''}
        ${hasFontSize ? `${FAMILY_SELECTORS} {
          font-size: ${fontSizePercent}% !important;
        }` : ''}
      `}</style>
    </>
  )
}