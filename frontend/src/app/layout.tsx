// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ingrox.com'),
  title: 'Ingrox – AI Growth Advisor for D2C Brands',
  description: 'Understand your sales, identify problems, and get clear actions to grow your revenue with Ingrox.',
  keywords: 'ecommerce growth, D2C analytics, sales insights, shopify growth, revenue optimization',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Ingrox – AI Growth Advisor for D2C Brands',
    description: 'Understand your sales and grow faster with clear insights.',
    url: 'https://ingrox.com',
    type: 'website',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ingrox – AI Growth Advisor',
    description: 'Get clear insights to grow your business revenue.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ingrox',
    applicationCategory: 'BusinessApplication',
    description: 'AI tool for analyzing sales data and improving business growth',
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
