export default function ExpiredPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAF7F0',
      fontFamily: 'Georgia, serif',
      textAlign: 'center',
      padding: '24px',
    }}>
      <div style={{ color: '#C9A84C', fontSize: '2rem', marginBottom: '24px' }}>
        ✦
      </div>
      <h1 style={{
        fontSize: '2rem', fontWeight: 300,
        color: '#2C2416', marginBottom: '16px'
      }}>
        Cet événement est terminé
      </h1>
      <p style={{
        color: '#9B8A6E', fontSize: '1.1rem',
        fontStyle: 'italic', maxWidth: '400px', lineHeight: 1.8
      }}>
        Cette invitation n'est plus active.<br />
        Nous espérons que vous avez partagé de beaux moments.
      </p>
      <div style={{ color: '#C9A84C', fontSize: '1.5rem', marginTop: '32px', letterSpacing: '0.5em' }}>
        ✦ ✦ ✦
      </div>
    </main>
  )
}
