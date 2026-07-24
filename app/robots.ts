import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/server/', '/api/', '/credits/', '/payment/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://zcards.in'}/sitemap.xml`,
  };
}
