import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://musafir.codes'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/fittrack', '/fittrack/', '/fit', '/fit/', '/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
