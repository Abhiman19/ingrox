// src/app/page.tsx — Landing Page
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Grow Your Ecommerce Sales | Ingrox',
  description: 'Struggling with sales? Get clear insights and actions to grow your ecommerce business using Ingrox.',
};
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/hooks/useToast';

function LandingContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Navbar variant="public" />

      {/* Hero */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: '64px 80px 56px', alignItems: 'center', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div>
          <div style={{ display: 'inline-block', background: 'var(--purple-light)', color: 'var(--purple-dark)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, marginBottom: 16 }}>
            Built for D2C founders
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.25, marginBottom: 16, color: 'var(--text-primary)' }}>
            Understand your sales.<br />Grow your revenue.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28, maxWidth: 420 }}>
            Get clear insights from your business data — no complex dashboards, no spreadsheets. Just answers.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/auth/signup" className="btn btn-primary btn-lg">Get started — it's free</Link>
            <a href="#how-it-works" className="btn btn-outline btn-lg">See how it works</a>
          </div>
        </div>

        {/* Hero preview card */}
        <div style={{ background: 'var(--gray-bg)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--gray-border)', padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {[
              { label: 'Revenue', value: '₹50,000', change: '▼ -12% vs last week', down: true },
              { label: 'Orders', value: '120', change: '▲ +8% vs last week', down: false },
            ].map((c) => (
              <div key={c.label} style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--gray-border)', padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-hint)', marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{c.value}</div>
                <div style={{ fontSize: 11, color: c.down ? 'var(--red)' : 'var(--green)' }}>{c.change}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--purple-light)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--purple-dark)', marginBottom: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span>🧠</span> Latest insight
            </div>
            <p style={{ fontSize: 12, color: 'var(--purple-dark)', lineHeight: 1.55 }}>
              Revenue dropped despite more orders — your average order value fell 18%. Run product bundles to fix this.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '48px 80px', background: 'var(--gray-bg)', borderTop: '0.5px solid var(--gray-border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Features</div>
          <h2 style={{ fontSize: 26, fontWeight: 500, marginBottom: 32 }}>Everything you need, nothing you don't</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: '📊', bg: '#E6F1FB', title: 'See what changed', desc: 'Track revenue and orders week over week at a glance. No setup required.' },
              { icon: '🧠', bg: 'var(--purple-light)', title: 'Know why', desc: 'Understand the reason behind every change — not just the numbers.' },
              { icon: '🎯', bg: 'var(--teal-light)', title: 'Take action', desc: 'Get 3–5 clear, specific steps you can act on today.' },
            ].map((f) => (
              <div key={f.title} className="card" style={{ background: '#fff' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '64px 80px', background: '#fff', borderTop: '0.5px solid var(--gray-border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, color: 'var(--purple-dark)', background: 'var(--purple-light)', padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 48, color: 'var(--text-primary)' }}>Three steps to clarity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { n: '1', title: 'Enter your data', desc: 'Add revenue and orders for this week. First time? Also add last week.', icon: '📝' },
              { n: '2', title: 'We analyze it', desc: 'Our engine compares this week vs last, finds patterns, and generates insights.', icon: '⚙️' },
              { n: '3', title: 'Get clear actions', desc: 'Read your 3–5 personalized insights and know exactly what to do next.', icon: '🚀' },
            ].map((s) => (
              <div key={s.n} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-15px', right: '-15px', fontSize: 120, fontWeight: 800, color: 'var(--gray-bg)', opacity: 0.5, zIndex: 0, lineHeight: 1 }}>{s.n}</div>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--purple-light)', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, zIndex: 1, boxShadow: '0 4px 12px rgba(83, 74, 183, 0.15)' }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, zIndex: 1, color: 'var(--text-primary)' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, zIndex: 1 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div style={{ background: 'var(--purple-dark)', color: '#fff', padding: '18px 80px', display: 'flex', gap: 48, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['Built for D2C founders', 'Simple. Fast. Actionable.', 'No spreadsheets required', 'Free to start'].map((t) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-light)', flexShrink: 0 }} />
            {t}
          </div>
        ))}
      </div>

      {/* CTA */}
      <section style={{ padding: '56px 80px', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 12 }}>Ready to understand your sales?</h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 28 }}>Takes 2 minutes. No credit card required.</p>
        <Link href="/auth/signup" className="btn btn-primary btn-lg">Start for free →</Link>
      </section>

      <Footer variant="public" />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LandingContent />
      </ToastProvider>
    </AuthProvider>
  );
}
