'use client';
// src/components/layout/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { usePathname } from 'next/navigation';

interface Props { variant?: 'public' | 'app'; }

export default function Navbar({ variant = 'app' }: Props) {
  const { user, business, logout } = useAuth();
  const path = usePathname();

  const navStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 28px', borderBottom: '0.5px solid var(--gray-border)',
    background: 'var(--bg-primary)', position: 'sticky', top: 0, zIndex: 100,
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', fontSize: 13, borderRadius: 'var(--radius-md)',
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
    background: active ? 'var(--bg-secondary)' : 'transparent',
    fontWeight: active ? 500 : 400,
  });

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'U';

  if (variant === 'public') {
    return (
      <nav style={navStyle} className="navbar">
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Ingrox Logo" className="logo-img" style={{ height: 50, width: 'auto', objectFit: 'contain' }} />
        </Link>
        <div className="nav-links">
          <a href="#features" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Features</a>
          <a href="#how-it-works" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>How it works</a>
          <Link href="/auth/login" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Login</Link>
          <Link href="/auth/signup" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav style={navStyle} className="navbar">
      <Link href="/dashboard" className="nav-brand">
        <img src="/logo.png" alt="Ingrox Logo" className="logo-img" style={{ height: 35, width: 'auto' }} />
      </Link>
      <div className="nav-links">
        <Link href="/dashboard" style={linkStyle(path === '/dashboard')}>Dashboard</Link>
        <Link href="/dashboard/insights" style={linkStyle(path === '/dashboard/insights')}>Insights</Link>
        <Link href="/input" style={linkStyle(path === '/input')}>Add data</Link>
      </div>
      <div className="nav-user">
        {business && (
          <span className="business-name">
            {business.name}
          </span>
        )}
        <div className="user-avatar">
          {initials}
        </div>
        <button onClick={logout} className="btn btn-ghost btn-sm" style={{ border: '0.5px solid var(--gray-border)', borderRadius: 'var(--radius-md)' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
