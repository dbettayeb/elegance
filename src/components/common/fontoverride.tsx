'use client'

import { getFontByName } from '@/lib/fonts'

interface Props {
  font?: string | null
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
  '.hero-names-block', '.hero-names-block *', '.closing-names',
  // Ivoire Doré
  '.iv-names', '.iv-names *', '.iv-footer-names',
].join(',\n')

export default function FontOverride({ font }: Props) {
  if (!font) return null
  const fontOption = getFontByName(font)
  if (!fontOption) return null

  return (
    <>
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${fontOption.googleFont}&display=swap`}
      />
      <style>{`
        ${NAME_SELECTORS} {
          font-family: ${fontOption.family} !important;
        }
      `}</style>
    </>
  )
}