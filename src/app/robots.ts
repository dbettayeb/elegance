import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://elegance-digitale.vercel.app'
  return {
    rules: [
      // Social crawlers need /i/ and /ig/ to generate link previews
      {
        userAgent: ['facebookexternalhit', 'Twitterbot', 'WhatsApp', 'LinkedInBot', 'Slackbot', 'TelegramBot'],
        allow: ['/i/', '/ig/'],
      },
      // Block everything sensitive from Google and general crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/couple/', '/i/', '/ig/', '/preview', '/test-animation'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
