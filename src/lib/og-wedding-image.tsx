import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const INK = '#2E2A26'
const GOLD = '#B8985A'
const GOLD_SOFT = 'rgba(184, 152, 90, 0.5)'
const GOLD_FAINT = 'rgba(184, 152, 90, 0.22)'
const MUTED = '#8A7A66'

// Read once per lambda instance — the files ship in assets/ so there is no
// network call during rendering.
let fontsPromise: Promise<{ bold: Buffer; boldItalic: Buffer; arabic: Buffer }> | null = null

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(join(process.cwd(), 'assets/CormorantGaramond-Bold.ttf')),
      readFile(join(process.cwd(), 'assets/CormorantGaramond-BoldItalic.ttf')),
      // Cormorant n'a aucun glyphe arabe : sans elle, un titre en arabe
      // donnerait une image vide. Cairo plutôt qu'Amiri, plus calligraphique :
      // ses substitutions contextuelles font échouer le moteur de rendu.
      readFile(join(process.cwd(), 'assets/Cairo-Bold-Arabic.woff')),
    ]).then(([bold, boldItalic, arabic]) => ({ bold, boldItalic, arabic }))
  }
  return fontsPromise
}

const ARABIC = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/

/**
 * Remet les mots dans l'ordre visuel d'une ligne à base arabe.
 *
 * Le moteur de rendu ne fait aucun réordonnancement bidirectionnel : il pose
 * les mots de gauche à droite dans l'ordre où ils arrivent. Sur une ligne
 * arabe il faut donc les lui donner déjà retournés — mais pas n'importe
 * comment : une suite de mots latins garde son propre sens de lecture. Sans
 * cette nuance, « ليلة Amal et Karim » ressortait « Karim et Amal ليلة ».
 *
 * On inverse donc l'ensemble, puis on remet à l'endroit chaque suite latine.
 */
function reorderForArabicLine(text: string): string {
  const words = text.trim().split(/\s+/).reverse()
  const out: string[] = []
  let latinRun: string[] = []

  const flush = () => {
    if (latinRun.length) { out.push(...latinRun.reverse()); latinRun = [] }
  }

  for (const word of words) {
    if (ARABIC.test(word)) { flush(); out.push(word) }
    else latinRun.push(word)
  }
  flush()
  return out.join(' ')
}

/** Small gold lozenge used in the ornaments. */
function Diamond({ size, color = GOLD }: { size: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        transform: 'rotate(45deg)',
      }}
    />
  )
}

interface OgWeddingProps {
  brideName: string
  groomName: string
  date: string
  /**
   * Titre de la soirée. Renseigné, il remplace les prénoms : une soirée de
   * henné ou de fiançailles n'est pas un mariage, et annoncer « invitation au
   * mariage de » avec deux prénoms y serait faux.
   */
  title?: string
}

export async function createOgWeddingImageResponse({ brideName, groomName, date, title }: OgWeddingProps) {
  const { bold, boldItalic, arabic } = await loadFonts()

  // Names stack vertically, so the longer of the two drives the size.
  const longest = Math.max(brideName.length, groomName.length)
  const nameFontSize = longest > 18 ? 58 : longest > 13 ? 70 : longest > 9 ? 82 : 94

  // Le titre tient sur une seule ligne : il rétrécit quand il s'allonge.
  const titleIsArabic = !!title && ARABIC.test(title)
  // Le moteur de rendu ne réordonne pas les mots pour l'arabe : il pose le
  // premier à gauche, si bien que « المحفل الجربي » se lit à l'envers. Les
  // lettres, elles, sont bien liées — seule la séquence est à inverser.
  const titleText = titleIsArabic && title ? reorderForArabicLine(title) : title
  const titleLength = title?.length ?? 0
  const titleFontSize = titleLength > 30 ? 56 : titleLength > 20 ? 70 : titleLength > 12 ? 84 : 96

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDFBF7',
          fontFamily: 'Cormorant',
          fontWeight: 700,
        }}
      >
        {/* Double frame */}
        <div style={{ position: 'absolute', top: 26, left: 26, right: 26, bottom: 26, border: `1px solid ${GOLD_SOFT}` }} />
        <div style={{ position: 'absolute', top: 34, left: 34, right: 34, bottom: 34, border: `1px solid ${GOLD_FAINT}` }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 110px' }}>
          {/* Top ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
            <Diamond size={5} color={GOLD_SOFT} />
            <Diamond size={8} />
            <Diamond size={5} color={GOLD_SOFT} />
          </div>

          {title ? (
            <div
              style={{
                display: 'flex',
                fontSize: titleFontSize,
                fontFamily: titleIsArabic ? 'Cairo' : 'Cormorant',
                color: INK,
                lineHeight: 1.3,
                textAlign: 'center',
                direction: titleIsArabic ? 'rtl' : 'ltr',
              }}
            >
              {titleText}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', fontSize: 21, letterSpacing: 9, color: GOLD, marginBottom: 26 }}>
                INVITATION AU MARIAGE DE
              </div>

              <div style={{ display: 'flex', fontSize: nameFontSize, color: INK, lineHeight: 1.1 }}>
                {brideName}
              </div>

              <div style={{ display: 'flex', fontSize: Math.round(nameFontSize * 0.5), color: GOLD, fontStyle: 'italic', margin: '2px 0' }}>
                &
              </div>

              <div style={{ display: 'flex', fontSize: nameFontSize, color: INK, lineHeight: 1.1 }}>
                {groomName}
              </div>
            </>
          )}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30, marginBottom: 18 }}>
            <div style={{ width: 110, height: 1, background: GOLD_SOFT }} />
            <Diamond size={7} />
            <div style={{ width: 110, height: 1, background: GOLD_SOFT }} />
          </div>

          <div style={{ display: 'flex', fontSize: 24, letterSpacing: 8, color: MUTED }}>
            {date.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Cormorant', data: bold, weight: 700, style: 'normal' },
        { name: 'Cormorant', data: boldItalic, weight: 700, style: 'italic' },
        { name: 'Cairo', data: arabic, weight: 700, style: 'normal' },
      ],
    }
  )
}
