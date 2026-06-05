// Layout vide pour la page de prévisualisation : on ne veut PAS hériter du layout admin
// (sidebar, etc.). C'est une page client-only qui s'affiche en plein écran.

export const metadata = {
  title: 'Prévisualisation — Élégance Digitale',
  robots: { index: false, follow: false },
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}