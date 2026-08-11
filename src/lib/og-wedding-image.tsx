import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const INK = '#2E2A26'
const GOLD = '#B8985A'
const GOLD_SOFT = 'rgba(184, 152, 90, 0.5)'
const MUTED = '#8A7A66'

// Read once per lambda instance — the files ship in assets/ so there is no
// network call during rendering.
let fontsPromise: Promise<{ regular: Buffer; italic: Buffer }> | null = null

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(join(process.cwd(), 'assets/CormorantGaramond-Regular.ttf')),
      readFile(join(process.cwd(), 'assets/CormorantGaramond-Italic.ttf')),
    ]).then(([regular, italic]) => ({ regular, italic }))
  }
  return fontsPromise
}

/** Soft watercolour-like wash. Satori has no blur filter, so the fade comes
 *  from the radial gradient itself. */
function Blob({ color, size, top, left, right, bottom }: {
  color: string
  size: number
  top?: number
  left?: number
  right?: number
  bottom?: number
}) {
  // Satori chokes on style properties set to undefined, so only pass the sides
  // that were actually given.
  const offsets: Record<string, number> = {}
  if (top !== undefined) offsets.top = top
  if (left !== undefined) offsets.left = left
  if (right !== undefined) offsets.right = right
  if (bottom !== undefined) offsets.bottom = bottom

  return (
    <div
      style={{
        position: 'absolute',
        ...offsets,
        width: size,
        height: size,
        borderRadius: size,
        background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`,
      }}
    />
  )
}

/** Botanical sprig drawn as inline SVG: a curved stem with paired leaves and a
 *  few blossoms. Vector, so it costs almost nothing in the final PNG. */
function Sprig({ rotate, scale = 1, leaf, blossom, top, left, right, bottom }: {
  rotate: number
  scale?: number
  leaf: string
  blossom: string
  top?: number
  left?: number
  right?: number
  bottom?: number
}) {
  const offsets: Record<string, number> = {}
  if (top !== undefined) offsets.top = top
  if (left !== undefined) offsets.left = left
  if (right !== undefined) offsets.right = right
  if (bottom !== undefined) offsets.bottom = bottom

  // Anchor points down the stem, from base to tip.
  const nodes = [
    { x: 49, y: 82, r: 10 },
    { x: 47.5, y: 68, r: 9 },
    { x: 46, y: 54, r: 8 },
    { x: 45, y: 40, r: 6.5 },
    { x: 44.5, y: 27, r: 5 },
  ]

  return (
    <div style={{ position: 'absolute', ...offsets, display: 'flex', transform: `rotate(${rotate}deg) scale(${scale})` }}>
      <svg width="240" height="240" viewBox="0 0 100 100">
        <path d="M50 96 C 47 76, 44 50, 44 14" stroke={leaf} strokeWidth="1.1" fill="none" />
        {nodes.map((n, i) => (
          <g key={i}>
            <ellipse cx={n.x - n.r} cy={n.y} rx={n.r} ry={n.r * 0.38} fill={leaf} transform={`rotate(-32 ${n.x} ${n.y})`} />
            <ellipse cx={n.x + n.r} cy={n.y} rx={n.r} ry={n.r * 0.38} fill={leaf} transform={`rotate(32 ${n.x} ${n.y})`} />
          </g>
        ))}
        <circle cx="41" cy="16" r="4.2" fill={blossom} />
        <circle cx="53" cy="30" r="3.4" fill={blossom} />
        <circle cx="38" cy="45" r="2.8" fill={blossom} />
      </svg>
    </div>
  )
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
}

export async function createOgWeddingImageResponse({ brideName, groomName, date }: OgWeddingProps) {
  const { regular, italic } = await loadFonts()

  // Names stack vertically, so the longer of the two drives the size.
  const longest = Math.max(brideName.length, groomName.length)
  const nameFontSize = longest > 18 ? 58 : longest > 13 ? 70 : longest > 9 ? 82 : 94

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
          background: 'linear-gradient(135deg, #FEFCF9 0%, #F8F2E9 100%)',
          fontFamily: 'Cormorant',
        }}
      >
        {/* Colour washes in the corners */}
        <Blob color="rgba(232, 156, 156, 0.62)" size={600} top={-210} left={-190} />
        <Blob color="rgba(222, 186, 108, 0.52)" size={500} top={-170} right={-150} />
        <Blob color="rgba(140, 172, 138, 0.58)" size={600} bottom={-220} right={-180} />
        <Blob color="rgba(240, 184, 150, 0.50)" size={460} bottom={-160} left={-140} />

        {/* Botanical corners */}
        <Sprig rotate={-24} scale={1} leaf="rgba(139, 166, 136, 0.75)" blossom="rgba(226, 152, 152, 0.72)" top={-36} left={-30} />
        <Sprig rotate={205} scale={0.92} leaf="rgba(150, 174, 145, 0.68)" blossom="rgba(230, 168, 150, 0.66)" bottom={-30} right={-26} />

        {/* Double frame */}
        <div style={{ position: 'absolute', top: 26, left: 26, right: 26, bottom: 26, border: `1px solid ${GOLD_SOFT}` }} />
        <div style={{ position: 'absolute', top: 34, left: 34, right: 34, bottom: 34, border: `1px solid rgba(184, 152, 90, 0.22)` }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 110px' }}>
          {/* Top ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
            <Diamond size={5} color={GOLD_SOFT} />
            <Diamond size={8} />
            <Diamond size={5} color={GOLD_SOFT} />
          </div>

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
        { name: 'Cormorant', data: regular, weight: 400, style: 'normal' },
        { name: 'Cormorant', data: italic, weight: 400, style: 'italic' },
      ],
    }
  )
}
