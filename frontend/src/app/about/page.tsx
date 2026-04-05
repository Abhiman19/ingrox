import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/hooks/useToast';

function AboutContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F5F4F0' }}>
      <Navbar variant="public" />
      
      <main style={{ flex: 1, padding: '32px 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card" style={{ padding: '32px 24px' }}>
            <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>About Ingrox</h1>
            <div style={{ height: 4, width: 40, background: 'var(--purple)', borderRadius: 2, marginBottom: 32 }}></div>
          
          <div style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 24 }}>
              Ingrox was built with a simple mission: to empower Direct-to-Consumer (D2C) founders with clear, actionable insights without the noise of complex dashboards.
            </p>
            <p style={{ marginBottom: 24 }}>
              We understand that running a business is hard enough. You shouldn't need a data science degree or hours of spreadsheet wrangling just to figure out why your revenue went up or down this week.
            </p>
            <p style={{ marginBottom: 24 }}>
              Our platform takes your weekly sales data, analyzes the patterns using advanced AI, and gives you 3-5 specific, easy-to-understand actions you can take today to grow your business.
            </p>
            <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: 40 }}>
              Simple. Fast. Actionable. That's the Ingrox promise.
            </p>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="public" />
    </div>
  );
}

export const metadata = {
  title: 'About Ingrox – AI Growth Platform for Founders',
  description: 'Learn how Ingrox helps founders understand their business data and grow faster.',
};

export default function AboutPage() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AboutContent />
      </ToastProvider>
    </AuthProvider>
  );
}
