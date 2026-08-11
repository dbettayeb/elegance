// Background image hosted on Supabase storage (expires 2101)
const BG_URL =
  'https://udpjrnetdxfzdetcfljm.supabase.co/storage/v1/object/sign/assets/images/URLPreviewBackGround.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYzMxY2Q0Ni03ZThkLTQ2YmItYjljMS02ZTNlYjYwNWQ2NTMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvaW1hZ2VzL1VSTFByZXZpZXdCYWNrR3JvdW5kLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0MDg4MDgsImV4cCI6MjEwMTc2ODgwOH0.AquDTy-h9ssz7Ar8reobpm0ffyzqmX6II66UxyHdFn8'

interface OgWeddingProps {
  brideName: string
  groomName: string
  date: string
}

export function buildOgWeddingImage({ brideName, groomName, date }: OgWeddingProps) {
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
            marginBottom: 18,
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
            color: '#2D2926',
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
            color: '#B8985A',
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
            marginTop: 2,
            marginBottom: 2,
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
            color: '#2D2926',
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
            color: '#8B7355',
            fontFamily: 'Georgia, serif',
            marginTop: 22,
            display: 'flex',
          }}
        >
          {date.toUpperCase()}
        </div>
      </div>
    </div>
  )
}
