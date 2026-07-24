import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://zcards.in';
  
  const routes = [
    '',
    '/features',
    '/pricing',
    '/about',
    '/contact',
    '/demo',
    '/faq',
    '/blog',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/cookies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
