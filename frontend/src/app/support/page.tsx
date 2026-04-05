import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/hooks/useToast';

function SupportContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F5F4F0' }}>
      <Navbar variant="public" />
      
      <main style={{ flex: 1, padding: '32px 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card" style={{ padding: '32px 24px' }}>
            <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>Support</h1>
            <div style={{ height: 4, width: 40, background: 'var(--purple)', borderRadius: 2, marginBottom: 32 }}></div>
          
          <div style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 24 }}>
              Need help understanding your insights? Have a question about how Ingrox works? We're here for you.
            </p>
            
            <div style={{ background: 'var(--purple-light)', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--purple-dark)', marginBottom: 8 }}>Contact Us</h2>
              <p style={{ color: 'var(--purple-dark)', marginBottom: 16 }}>
                The fastest way to reach us is via email. We typically respond within 24 hours.
              </p>
              <a href="mailto:info.growlytic@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: 'var(--purple)' }}>
                ✉️ info.growlytic@gmail.com
              </a>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: '40px 0 16px' }}>Frequently Asked Questions</h2>
            
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>How does Ingrox calculate insights?</h3>
              <p>We use a combination of predefined business rules and AI analysis to compare your current week's revenue and orders against your previous week, identifying key trends and suggesting actionable steps.</p>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Is my data secure?</h3>
              <p>Yes. Your financial data is stored securely and is only used to generate insights specifically for your account. We never sell your data.</p>
            </div>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="public" />
    </div>
  );
}

export const metadata = {
  title: 'Support – Ingrox Help Center',
  description: 'Get help and support for using Ingrox effectively.',
};

export default function SupportPage() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SupportContent />
      </ToastProvider>
    </AuthProvider>
  );
}
