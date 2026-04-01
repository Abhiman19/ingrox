// src/app/privacy/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy – Ingrox',
  description: 'Learn how we securely handle and protect your data.',
};

export default function PrivacyPage() {
  const s = { fontSize: 14, color: '#555', lineHeight: 1.75, marginBottom: 16 };
  const h2: React.CSSProperties = { fontSize: 16, fontWeight: 500, marginBottom: 8, marginTop: 28, color: '#1a1a1a' };
  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F0' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 40px', borderBottom: '0.5px solid rgba(0,0,0,0.1)', background: '#fff' }}>
        <Link href="/" style={{ fontSize: 16, fontWeight: 600 }}>Ing<span style={{ color: '#534AB7' }}>rox</span></Link>
        <Link href="/" style={{ fontSize: 13, color: '#555' }}>← Back to home</Link>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: '36px 40px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>Privacy Policy</h1>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 28 }}>Last updated: January 2025</p>

          <p style={s}>Ingrox ("we", "us") is committed to protecting your privacy. This policy explains how we collect, use, and protect your data.</p>

          <h2 style={h2}>What data we collect</h2>
          <p style={s}>We collect your email address, hashed password, business name and type, and the sales data (revenue and orders) you manually enter. We do not collect payment information.</p>

          <h2 style={h2}>How we use your data</h2>
          <p style={s}>Your data is used exclusively to generate insights for your business. We do not sell your data, share it with third parties for marketing, or use it for advertising.</p>

          <h2 style={h2}>Data storage and security</h2>
          <p style={s}>Data is stored in a secure PostgreSQL database with encryption at rest. All API communication is over HTTPS. Passwords are hashed with bcrypt and never stored in plaintext.</p>

          <h2 style={h2}>AI processing</h2>
          <p style={s}>Anonymised, aggregated data about your business performance (e.g. "revenue changed by -12%") may be sent to OpenAI to generate insight text. No personally identifiable information (email, name) is included in these prompts.</p>

          <h2 style={h2}>Your rights</h2>
          <p style={s}>You may request deletion of your account and all associated data at any time by emailing <a href="mailto:info.growlytic@gmail.com" style={{ color: '#534AB7' }}>info.growlytic@gmail.com</a>. We will process requests within 30 days.</p>

          <h2 style={h2}>Cookies</h2>
          <p style={s}>We use a single authentication cookie (JWT token) that is strictly necessary for you to use the application. We do not use tracking or advertising cookies.</p>

          <h2 style={h2}>Contact</h2>
          <p style={s}>For any privacy questions, email <a href="mailto:info.growlytic@gmail.com" style={{ color: '#534AB7' }}>info.growlytic@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
