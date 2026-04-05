// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer({ variant = 'app' }: { variant?: 'public' | 'app' }) {
  const s: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 28px', borderTop: '0.5px solid var(--gray-border)',
    background: 'var(--bg-primary)', marginTop: 'auto',
  };
  const links = [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms & conditions', href: '/terms' },
    { label: 'Support', href: '/support' },
  ];
  if (variant === 'public') {
    links.unshift({ label: 'About', href: '/about' }, { label: 'Contact', href: 'mailto:info.growlytic@gmail.com' });
  }
  return (
    <footer style={s} className="footer">
      <div className="footer-links">
        {links.map((l) => (
          <Link key={l.label} href={l.href} style={{ fontSize: 12, color: 'var(--text-hint)' }}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="footer-brand">
        <img src="/logo.png" alt="Ingrox" className="logo-img" style={{ height: 32, width: 'auto', opacity: 0.95 }} />
        <span style={{ fontSize: 13, color: 'var(--text-hint)' }}>© 2025 Ingrox</span>
      </div>
    </footer>
  );
}
