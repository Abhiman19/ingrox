'use client';
// src/app/auth/login/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getErrorMessage } from '@/lib/AuthContext';
import { useToast } from '@/hooks/useToast';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      setLoading(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Ingrox Logo" className="logo-img" style={{ height: 75, width: 'auto' }} />
          </Link>
        </div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">Log in to see your latest insights.</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <a href="mailto:info.growlytic@gmail.com?subject=Password reset" style={{ fontSize: 12, color: 'var(--purple)' }}>Forgot password?</a>
            </div>
            <input className="form-input" type="password" placeholder="Your password" value={form.password} onChange={set('password')} autoComplete="current-password" />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><span className="spinner" /> Logging in…</> : 'Login'}
          </button>
        </form>

        <div className="divider"><div className="divider-line" /><span className="divider-text">or</span><div className="divider-line" /></div>
        <div className="auth-footer">
          Don't have an account? <Link href="/auth/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
