import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Your Ecommerce Sales Dropped (And How to Fix It) | Ingrox',
  description: 'Understand the exact reasons why your D2C ecommerce sales dropped and learn actionable strategies to get your revenue back on track.',
};

export default function BlogPost1() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Navbar variant="public" />
      
      <main style={{ flex: 1, padding: '64px 24px' }}>
        <article style={{ maxWidth: 720, margin: '0 auto' }}>
          <header style={{ marginBottom: 48 }}>
            <Link href="/blog" style={{ color: 'var(--purple)', fontSize: 14, fontWeight: 500, marginBottom: 16, display: 'inline-block' }}>← Back to Blog</Link>
            <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 24 }}>Why Your Ecommerce Sales Dropped (And How to Fix It)</h1>
            <div style={{ display: 'flex', gap: 16, color: 'var(--text-secondary)', fontSize: 14 }}>
              <span>April 2026</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </header>

          <div className="blog-content" style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text-primary)' }}>
            <p style={{ marginBottom: 24 }}>It is the nightmare scenario for any D2C founder: you log into your Shopify dashboard, check your daily revenue, and see a massive, unexplained drop. The first reaction is usually panic. Did tracking break? Are ads underperforming? Is the website down?</p>
            
            <p style={{ marginBottom: 24 }}>Before you make drastic changes to your ad spend or drastically cut prices, you need to understand <strong>why</strong> your ecommerce sales dropped. Identifying the root cause is the only way to implement an effective fix.</p>

            <h2 style={{ fontSize: 28, fontWeight: 600, marginTop: 48, marginBottom: 24 }}>1. The Average Order Value (AOV) Trap</h2>
            <p style={{ marginBottom: 24 }}>Often, founders focus entirely on total orders, missing a crucial metric: Average Order Value. If your total orders remain stable but your revenue drops, your customers are buying cheaper items. This frequently happens after a major promotion ends or if you introduce a popular low-ticket item.</p>
            <p style={{ marginBottom: 24 }}><strong>How to fix it:</strong> Implement product bundling immediately. By grouping complementary products together and offering a slight discount, you incentivize customers to spend more per transaction. <Link href="/blog/increase-revenue-d2c" style={{ color: 'var(--purple)' }}>Learn more about increasing revenue through AOV.</Link></p>

            <h2 style={{ fontSize: 28, fontWeight: 600, marginTop: 48, marginBottom: 24 }}>2. Traffic Quality vs. Traffic Quantity</h2>
            <p style={{ marginBottom: 24 }}>A drop in sales doesn't always mean a drop in traffic. Sometimes, your ads are bringing in the wrong people. If traffic is high but conversion rates are plummeting, your marketing message may be misaligned with your product, or you are targeting too broad of an audience.</p>
            <p style={{ marginBottom: 24 }}><strong>How to fix it:</strong> Review your recent ad campaigns. Are you accidentally running broad awareness campaigns instead of conversion-optimized campaigns? Tighten your targeting to focus on high-intent buyers, even if it means less overall traffic.</p>

            <h2 style={{ fontSize: 28, fontWeight: 600, marginTop: 48, marginBottom: 24 }}>3. The Out-of-Stock Killer</h2>
            <p style={{ marginBottom: 24 }}>This is the most common invisible killer of ecommerce growth. Your best-selling product goes out of stock, but you continue pointing ad traffic to the homepage or category page. Customers arrive, look for your hero product, and bounce when they cannot find it.</p>
            <p style={{ marginBottom: 24 }}><strong>How to fix it:</strong> Implement back-in-stock notifications to capture leads for lost sales. More importantly, shift your ad spend away from campaigns that feature the out-of-stock product and highlight your secondary best-sellers.</p>

            <h2 style={{ fontSize: 28, fontWeight: 600, marginTop: 48, marginBottom: 24 }}>4. Technical Checkout Friction</h2>
            <p style={{ marginBottom: 24 }}>If your add-to-cart rate is normal but your sales have dropped, your checkout flow is broken. This could be a failed payment gateway update, an expired SSL certificate, or a third-party app causing the checkout page to load too slowly.</p>
            <p style={{ marginBottom: 24 }}><strong>How to fix it:</strong> Run a test transaction on both mobile and desktop. Check your payment gateway logs for an unusual number of declined transactions. Disable non-essential apps on the checkout page to improve load speed.</p>

            <h2 style={{ fontSize: 28, fontWeight: 600, marginTop: 48, marginBottom: 24 }}>Stop Guessing, Start Knowing</h2>
            <p style={{ marginBottom: 24 }}>Diagnosing these issues manually requires diving into complex Shopify dashboards, pulling CSV files, and cross-referencing data. For most D2C founders, that is hours of wasted time.</p>
            
            <p style={{ marginBottom: 48 }}>That is exactly why we built <strong>Ingrox</strong>. Instead of staring at spreadsheets, you simply enter your weekly numbers, and our AI immediately tells you <em>why</em> your sales dropped and exactly what to do next.</p>

            <div style={{ background: 'var(--purple-light)', padding: 40, borderRadius: 12, textAlign: 'center', marginBottom: 40 }}>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--purple-dark)', marginBottom: 16 }}>Ready to fix your sales drop?</h3>
              <p style={{ fontSize: 16, color: 'var(--purple-dark)', marginBottom: 24 }}>Stop guessing what went wrong. Get clear, actionable sales insights in seconds.</p>
              <Link href="/auth/signup" className="btn btn-primary btn-lg">Try Ingrox Free</Link>
            </div>
          </div>
        </article>
      </main>

      <Footer variant="public" />
    </div>
    </AuthProvider>
  );
}
