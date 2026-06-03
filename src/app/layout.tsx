import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Élégance Digitale',
  description: 'Invitations de mariage digitales haut de gamme',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}