import { ImageResponse } from 'next/og'

const BG_URL =
  'https://udpjrnetdxfzdetcfljm.supabase.co/storage/v1/object/sign/assets/images/URLPreviewBackGround.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzMxY2Q0Ni03ZThkLTQ2YmItYjljMS02ZTNlYjYwNWQ2NTMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvaW1hZ2VzL1VSTFByZXZpZXdCYWNrR3JvdW5kLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0NTM5NDIsImV4cCI6MjEwMTgxMzk0Mn0.iJ8w3fozAvPNPCAqfLXh0tghi7t9LID0FsTurqNKAYs'

// 800×420 keeps WhatsApp's ~1 MB image limit (1200×630 PNG was ~1.94 MB)
export const OG_SIZE = { width: 800, height: 420 }

interface OgWeddingProps {
  brideName: string
  groomName: string
  date: string
}

export async function createOgWeddingImageResponse({ brideName, groomName, date }: OgWeddingProps) {
  const combinedLength = brideName.length + groomName.length
  const nameFontSize = combinedLength > 28 ? 38 : combinedLength > 20 ? 44 : 50

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
          background: '#faf8f5',
        }}
      >
        <img
          src={BG_URL}
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
            padding: '0 60px',
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: 4, color: '#B8985A', fontFamily: 'serif', marginBottom: 10, display: 'flex' }}>
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

          <div style={{ fontSize: 10, letterSpacing: 3, color: '#8B7355', fontFamily: 'serif', marginTop: 12, display: 'flex' }}>
            {date.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}
