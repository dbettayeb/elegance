import { readFileSync } from 'fs'
import { join } from 'path'

function getBgDataUrl(): string | null {
  try {
    const data = readFileSync(join(process.cwd(), 'public', 'og-background.jpg'))
    return `data:image/jpeg;base64,${data.toString('base64')}`
  } catch {
    return null
  }
}

interface OgWeddingProps {
  brideName: string
  groomName: string
  date: string
}

export function buildOgWeddingImage({ brideName, groomName, date }: OgWeddingProps) {
  const bg = getBgDataUrl()
  const combinedLength = brideName.length + groomName.length
  const nameFontSize = combinedLength > 28 ? 58 : combinedLength > 20 ? 66 : 76

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg ? 'transparent' : '#faf8f5',
        position: 'relative',
      }}
    >
      {/* Background image */}
      {bg && (
        <img
          src={bg}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Fallback: black overlay when no bg */}
      {!bg && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: '#0a0a0a', display: 'flex',
        }} />
      )}

      {/* Text content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
          padding: '0 80px',
        }}
      >
        {/* "INVITATION AU MARIAGE DE" */}
        <div
          style={{
            fontSize: 15,
            letterSpacing: 6,
            color: bg ? '#B8985A' : '#C9A84C',
            fontFamily: 'Georgia, serif',
            marginBottom: 20,
            display: 'flex',
          }}
        >
          INVITATION AU MARIAGE DE
        </div>

        {/* Bride name */}
        <div
          style={{
            fontSize: nameFontSize,
            fontWeight: 400,
            color: bg ? '#2D2926' : '#FFFFFF',
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            lineHeight: 1.1,
            display: 'flex',
          }}
        >
          {brideName}
        </div>

        {/* Ampersand */}
        <div
          style={{
            fontSize: Math.round(nameFontSize * 0.6),
            fontWeight: 400,
            color: bg ? '#B8985A' : '#C9A84C',
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            marginTop: 4,
            marginBottom: 4,
            display: 'flex',
          }}
        >
          &
        </div>

        {/* Groom name */}
        <div
          style={{
            fontSize: nameFontSize,
            fontWeight: 400,
            color: bg ? '#2D2926' : '#FFFFFF',
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            lineHeight: 1.1,
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
            color: bg ? '#8B7355' : '#888888',
            fontFamily: 'Georgia, serif',
            marginTop: 24,
            display: 'flex',
          }}
        >
          {date.toUpperCase()}
        </div>
      </div>
    </div>
  )
}
