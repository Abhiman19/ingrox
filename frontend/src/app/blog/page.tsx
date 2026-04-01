import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecommerce Growth Blog | Ingrox',
  description: 'Learn how to analyze sales data, fix revenue drops, and grow your D2C brand with expert insights from Ingrox.',
};

const posts = [
  {
    slug: 'ecommerce-sales-drop',
    title: 'Why Your Ecommerce Sales Dropped (And How to Fix It)',
    excerpt: 'Discover the hidden reasons behind sudden revenue drops and the exact steps D2C founders take to recover their sales.',
    date: 'April 2026',
  },
  {
    slug: 'increase-revenue-d2c',
    title: 'How to Increase Revenue for D2C Brands',
    excerpt: 'Practical strategies to boost your average order value, improve customer retention, and scale your ecommerce business.',
    date: 'April 2026',
  },
  {
    slug: 'analyze-sales-data-no-tech',
    title: 'How to Analyze Sales Data Without Technical Skills',
    excerpt: 'You do not need a data science degree to understand your ecommerce performance. Learn the simple metrics that actually matter.',
    date: 'March 2026',
  },
];

export default function BlogIndex() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F5F4F0' }}>
      <Navbar variant="public" />
      
      <main style={{ flex: 1, padding: '64px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>The Growth Blog</h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 48, lineHeight: 1.6 }}>
            Actionable advice, deep dives, and data-driven strategies for D2C founders looking to scale their ecommerce businesses.
          </p>

          <div style={{ display: 'grid', gap: 32 }}>
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} style={{ display: 'block', textDecoration: 'none' }}>
                <article style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '0.5px solid var(--gray-border)', transition: 'transform 0.2s, box-shadow 0.2s' }} className="card">
                  <span style={{ fontSize: 13, color: 'var(--purple)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{post.date}</span>
                  <h2 style={{ fontSize: 24, fontWeight: 600, marginTop: 12, marginBottom: 16, color: 'var(--text-primary)' }}>{post.title}</h2>
                  <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer variant="public" />
    </div>
    </AuthProvider>
  );
}
