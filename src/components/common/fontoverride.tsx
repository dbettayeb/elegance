'use client'

import { getFontByName } from '@/lib/fonts'

interface Props {
  font?: string | null
  container?: string  // ignoré, gardé pour compat
}

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
        body,
        body * {
          font-family: ${fontOption.family} !important;
        }
      `}</style>
    </>
  )
}