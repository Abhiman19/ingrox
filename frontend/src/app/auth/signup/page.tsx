'use client';
// src/app/auth/signup/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getErrorMessage } from '@/lib/AuthContext';
import { useToast } from '@/hooks/useToast';

export default function SignupPage() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Include an uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Include a number';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form.email, form.password);
      showToast('Account created! Setting up your business.', 'success');
      router.push('/setup');
    } catch (err: any) {
      const msg = getErrorMessage(err);
      if (msg.includes('Network Error') || msg.includes('404')) {
        showToast('Network Error: Please check your NEXT_PUBLIC_API_URL settings in Vercel.', 'error');
      } else {
        showToast(msg, 'error');
      }
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
        <div className="auth-title">Create your account</div>
        <div className="auth-subtitle">Start getting insights in minutes — free.</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min. 8 chars, 1 uppercase, 1 number" value={form.password} onChange={set('password')} autoComplete="new-password" />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input className="form-input" type="password" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
            {errors.confirm && <div className="form-error">{errors.confirm}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><span className="spinner" /> Creating account…</> : 'Create account'}
          </button>
        </form>

        <div className="divider"><div className="divider-line" /><span className="divider-text">or</span><div className="divider-line" /></div>
        <div className="auth-footer">
          Already have an account? <Link href="/auth/login">Login</Link>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-hint)', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          By signing up you agree to our <Link href="/terms" style={{ color: 'var(--purple)' }}>Terms</Link> and <Link href="/privacy" style={{ color: 'var(--purple)' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
