'use client';
// src/app/setup/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getErrorMessage } from '@/lib/AuthContext';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/hooks/useToast';

const BUSINESS_TYPES = ['D2C (Direct to Consumer)', 'E-commerce', 'Retail', 'Services', 'Other'];
const CURRENCIES = [{ label: 'INR (₹)', value: 'INR' }, { label: 'USD ($)', value: 'USD' }, { label: 'EUR (€)', value: 'EUR' }];

function SetupContent() {
  const { setBusiness } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', type: 'D2C (Direct to Consumer)', currency: 'INR' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Business name is required';
    if (form.name.trim().length > 100) e.name = 'Name too long (max 100 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/business/create', {
        name: form.name.trim(),
        type: form.type,
        currency: form.currency,
      });
      setBusiness(data.business);
      showToast('Business saved!', 'success');
      router.push('/input');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Account', done: true },
    { label: 'Business setup', active: true },
    { label: 'Add data', done: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 28px', borderBottom: '0.5px solid var(--gray-border)', background: 'var(--bg-primary)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Ingrox Logo" style={{ height: 24, width: 'auto' }} />
        </Link>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {steps.map((s) => (
            <span key={s.label} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: s.done ? 'var(--teal-light)' : s.active ? 'var(--purple-light)' : 'var(--gray-bg)', color: s.done ? 'var(--teal)' : s.active ? 'var(--purple)' : 'var(--text-hint)', border: '0.5px solid var(--gray-border)', whiteSpace: 'nowrap' }}>
              {s.done ? `${s.label} ✓` : s.label}
            </span>
          ))}
        </div>
      </nav>

      <div className="auth-wrapper" style={{ flex: 1 }}>
        <div className="auth-card" style={{ maxWidth: 440 }}>
          <div className="auth-title">Tell us about your business</div>
          <div className="auth-subtitle">Takes 30 seconds. Helps us personalise your insights.</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Business name</label>
              <input className="form-input" type="text" placeholder="e.g. My Store" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} maxLength={100} />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Business type</label>
              <select className="form-select" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="form-hint">D2C selected by default — most common for our users.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary currency</label>
              <select className="form-select" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
                {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" /> Saving…</> : 'Continue →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SetupContent />
      </ToastProvider>
    </AuthProvider>
  );
}
