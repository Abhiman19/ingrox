import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://ingrox.com', priority: 1, lastModified: new Date() },
    { url: 'https://ingrox.com/about', priority: 0.8, lastModified: new Date() },
    { url: 'https://ingrox.com/support', priority: 0.7, lastModified: new Date() },
    { url: 'https://ingrox.com/blog', priority: 0.8, lastModified: new Date() },
    { url: 'https://ingrox.com/blog/ecommerce-sales-drop', priority: 0.8, lastModified: new Date() },
    { url: 'https://ingrox.com/blog/increase-revenue-d2c', priority: 0.8, lastModified: new Date() },
    { url: 'https://ingrox.com/blog/analyze-sales-data-no-tech', priority: 0.8, lastModified: new Date() },
    { url: 'https://ingrox.com/privacy', priority: 0.5, lastModified: new Date() },
    { url: 'https://ingrox.com/terms', priority: 0.5, lastModified: new Date() },
  ];
}
