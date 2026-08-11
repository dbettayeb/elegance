import { ImageResponse } from 'next/og'
import sharp from 'sharp'

const BG_URL =
  'https://udpjrnetdxfzdetcfljm.supabase.co/storage/v1/object/sign/assets/images/URLPreviewBackGround.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzMxY2Q0Ni03ZThkLTQ2YmItYjljMS02ZTNlYjYwNWQ2NTMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvaW1hZ2VzL1VSTFByZXZpZXdCYWNrR3JvdW5kLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0NTM5NDIsImV4cCI6MjEwMTgxMzk0Mn0.iJ8w3fozAvPNPCAqfLXh0tghi7t9LID0FsTurqNKAYs'

// Cached in-process so warm invocations skip the fetch entirely
let bgDataUrl: string | null = null

async function getBgDataUrl(): Promise<string> {
  if (bgDataUrl) return bgDataUrl
  try {
    const res = await fetch(BG_URL, { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer())
      bgDataUrl = `data:image/png;base64,${buf.toString('base64')}`
      return bgDataUrl
    }
  } catch { /* fall back to remote URL */ }
  return BG_URL
}

export const OG_SIZE = { width: 1200, height: 630 }

// JPEG, not PNG: next/og only emits PNG, and a PNG of a watercolor floral
// weighs ~1.9 MB — far above what WhatsApp accepts for a link preview.
// The same image as JPEG lands around 100 KB.
export const OG_CONTENT_TYPE = 'image/jpeg'

interface OgWeddingProps {
  brideName: string
  groomName: string
  date: string
}

export async function createOgWeddingImageResponse({ brideName, groomName, date }: OgWeddingProps) {
  const combinedLength = brideName.length + groomName.length
  const nameFontSize = combinedLength > 28 ? 58 : combinedLength > 20 ? 66 : 76
  const bg = await getBgDataUrl()

  const png = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#faf8f5',
        }}
      >
        <img
          src={bg}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 100px',
          }}
        >
          <div style={{ fontSize: 15, letterSpacing: 6, color: '#B8985A', fontFamily: 'serif', marginBottom: 16, display: 'flex' }}>
            INVITATION AU MARIAGE DE
          </div>

          <div style={{ fontSize: nameFontSize, fontWeight: 400, color: '#2D2926', fontStyle: 'italic', fontFamily: 'serif', lineHeight: 1.05, display: 'flex' }}>
            {brideName}
          </div>

          <div style={{ fontSize: Math.round(nameFontSize * 0.55), fontWeight: 400, color: '#B8985A', fontStyle: 'italic', fontFamily: 'serif', display: 'flex' }}>
            &
          </div>

          <div style={{ fontSize: nameFontSize, fontWeight: 400, color: '#2D2926', fontStyle: 'italic', fontFamily: 'serif', lineHeight: 1.05, display: 'flex' }}>
            {groomName}
          </div>

          <div style={{ fontSize: 15, letterSpacing: 5, color: '#8B7355', fontFamily: 'serif', marginTop: 20, display: 'flex' }}>
            {date.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )

  try {
    const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
      .jpeg({ quality: 80 })
      .toBuffer()

    // Crawlers need an explicit Content-Length; ImageResponse streams without one.
    return new Response(new Uint8Array(jpeg), {
      headers: {
        'Content-Type': OG_CONTENT_TYPE,
        'Content-Length': String(jpeg.byteLength),
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch {
    return png
  }
}
