import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://elegance-digitale.vercel.app'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/couple/', '/i/', '/ig/', '/preview', '/test-animation'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
