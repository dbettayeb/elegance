import type { MetadataRoute } from 'next'
import { TEMPLATES_META } from '@/lib/templates-meta'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://elegance-digitale.vercel.app'

  return [
    { url: base,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 1   },
    { url: `${base}/templates`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/commander`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...TEMPLATES_META.map(t => ({
      url:             `${base}/templates/${t.id}`,
      lastModified:    new Date(),
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    })),
  ]
}
