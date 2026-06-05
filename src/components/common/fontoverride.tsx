'use client'

import { getFontByName } from '@/lib/fonts'

interface Props {
  /** Nom de la police (ex: "Great Vibes"). Si vide, ne rend rien. */
  font?: string | null
  /** Sélecteur CSS du conteneur racine du template (ex: ".bs-container") */
  container: string
}

/**
 * Composant à inclure dans chaque template d'invitation.
 * Si `font` est défini, injecte :
 *   1. Le <link> Google Fonts correspondant
 *   2. Un override CSS avec !important sur tout le conteneur et ses descendants
 *
 * Utilisation :
 *   <FontOverride font={wedding.custom_font} container=".bs-container" />
 */
export default function FontOverride({ font, container }: Props) {
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
        ${container},
        ${container} *,
        ${container} *::before,
        ${container} *::after {
          font-family: ${fontOption.family} !important;
        }
      `}</style>
    </>
  )
}