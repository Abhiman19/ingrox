import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api', '/private', '/input'],
      },
    ],
    sitemap: 'https://ingrox.com/sitemap.xml',
  };
}
