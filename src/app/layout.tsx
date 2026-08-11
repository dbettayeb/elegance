import type { Metadata } from 'next'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://elegance-digitale.vercel.app'),
  title: 'Élégance Digitale',
  description: 'Invitations de mariage digitales haut de gamme',
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

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
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`,
            }} />
          </>
        )}
      </body>
    </html>
  )
}
