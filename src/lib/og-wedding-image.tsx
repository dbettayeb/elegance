import { ImageResponse } from 'next/og'

const BG_URL =
  'https://udpjrnetdxfzdetcfljm.supabase.co/storage/v1/object/sign/assets/images/URLPreviewBackGround.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzMxY2Q0Ni03ZThkLTQ2YmItYjljMS02ZTNlYjYwNWQ2NTMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvaW1hZ2VzL1VSTFByZXZpZXdCYWNrR3JvdW5kLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0MDg4MDgsImV4cCI6MjEwMTc2ODgwOH0.AquDTy-h9ssz7Ar8reobpm0ffyzqmX6II66UxyHdFn8'

// Loads Cormorant Garamond Italic from Google Fonts at runtime on Vercel
async function loadCormorantItalic(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NextJS/og)' } }
    ).then(r => r.text())

    const match = css.match(/src:\s*url\(([^)]+\.woff2)\)/)
    if (!match) return null

    return fetch(match[1]).then(r => r.arrayBuffer())
  } catch {
    return null
  }
}

export const OG_SIZE = { width: 1200, height: 630 }

interface OgWeddingProps {
  brideName: string
  groomName: string
  date: string
}

export async function createOgWeddingImageResponse({ brideName, groomName, date }: OgWeddingProps) {
  const fontData = await loadCormorantItalic()

  const combinedLength = brideName.length + groomName.length
  const nameFontSize = combinedLength > 28 ? 58 : combinedLength > 20 ? 66 : 76
  const nameFont = fontData ? "'Cormorant'" : 'Georgia, serif'

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
          position: 'relative',
          background: '#faf8f5',
        }}
      >
        {/* Floral background */}
        <img
          src={BG_URL}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Text overlay */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            padding: '0 100px',
          }}
        >
          {/* "INVITATION AU MARIAGE DE" */}
          <div
            style={{
              fontSize: 15,
              letterSpacing: 6,
              color: '#B8985A',
              fontFamily: 'Georgia, serif',
              marginBottom: 16,
              display: 'flex',
            }}
          >
            INVITATION AU MARIAGE DE
          </div>

          {/* Bride name */}
          <div
            style={{
              fontSize: nameFontSize,
              fontWeight: 600,
              color: '#2D2926',
              fontStyle: 'italic',
              fontFamily: nameFont,
              lineHeight: 1.05,
              display: 'flex',
            }}
          >
            {brideName}
          </div>

          {/* Ampersand */}
          <div
            style={{
              fontSize: Math.round(nameFontSize * 0.55),
              fontWeight: 600,
              color: '#B8985A',
              fontStyle: 'italic',
              fontFamily: nameFont,
              marginTop: 0,
              marginBottom: 0,
              display: 'flex',
            }}
          >
            &
          </div>

          {/* Groom name */}
          <div
            style={{
              fontSize: nameFontSize,
              fontWeight: 600,
              color: '#2D2926',
              fontStyle: 'italic',
              fontFamily: nameFont,
              lineHeight: 1.05,
              display: 'flex',
            }}
          >
            {groomName}
          </div>

          {/* Date */}
          <div
            style={{
              fontSize: 15,
              letterSpacing: 5,
              color: '#8B7355',
              fontFamily: 'Georgia, serif',
              marginTop: 20,
              display: 'flex',
            }}
          >
            {date.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: fontData
        ? [{ name: 'Cormorant', data: fontData, style: 'italic', weight: 600 }]
        : [],
    }
  )
}
