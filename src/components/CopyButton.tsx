'use client'

export default function CopyButton({ text }: { text: string }) {
  const copy = async () => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <button
      onClick={copy}
      style={{
        padding: '7px 14px',
        background: 'transparent',
        border: '1px solid rgba(201,168,76,0.4)',
        color: '#8B6914',
        fontSize: '0.56rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      Copier
    </button>
  )
}