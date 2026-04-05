'use client';
// src/app/input/page.tsx
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/hooks/useToast';
import { useAuth, getErrorMessage } from '@/lib/AuthContext';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';

type Tab = 'manual' | 'csv' | 'paste';

interface FormData {
  currentRevenue: string;
  currentOrders: string;
  previousRevenue: string;
  previousOrders: string;
}

function InputContent() {
  const { business } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('manual');
  const [form, setForm] = useState<FormData>({ currentRevenue: '', currentOrders: '', previousRevenue: '', previousOrders: '' });
  const [pasteText, setPasteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const currency = business?.currency === 'USD' ? '$' : business?.currency === 'EUR' ? '€' : '₹';

  const validate = () => {
    const e: Record<string, string> = {};
    const cr = parseFloat(form.currentRevenue);
    const co = parseInt(form.currentOrders);
    if (isNaN(cr) || cr < 0) e.currentRevenue = 'Enter a valid revenue amount';
    if (isNaN(co) || co < 0) e.currentOrders = 'Enter a valid order count';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => {
    const payload: Record<string, number> = {
      currentRevenue: parseFloat(form.currentRevenue),
      currentOrders: parseInt(form.currentOrders),
    };
    if (form.previousRevenue) payload.previousRevenue = parseFloat(form.previousRevenue);
    if (form.previousOrders) payload.previousOrders = parseInt(form.previousOrders);
    return payload;
  };

  const parsePaste = (text: string) => {
    const lines = text.trim().split('\n');
    const nums: number[] = [];
    lines.forEach((l) => {
      const cleaned = l.replace(/[₹$€,\s]/g, '').split(/[\t,|]/);
      cleaned.forEach((v) => {
        const n = parseFloat(v);
        if (!isNaN(n) && n >= 0) nums.push(n);
      });
    });
    return nums;
  };

  const handlePasteAnalyze = () => {
    const nums = parsePaste(pasteText);
    if (nums.length < 2) { showToast('Could not parse data — please check format', 'error'); return; }
    setForm({ currentRevenue: String(nums[0]), currentOrders: String(Math.round(nums[1])), previousRevenue: nums[2] ? String(nums[2]) : '', previousOrders: nums[3] ? String(Math.round(nums[3])) : '' });
    setTab('manual');
    showToast('Data parsed — review and click Analyze', 'info');
  };

  const handleCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { showToast('Please upload a .csv file', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split('\n');
      const data = lines[lines.length - 1].split(',');
      const cr = parseFloat(data[0]);
      const co = parseInt(data[1]);
      if (!isNaN(cr) && !isNaN(co)) {
        setForm((p) => ({ ...p, currentRevenue: String(cr), currentOrders: String(co) }));
        setTab('manual');
        showToast('CSV data loaded — review and click Analyze', 'info');
      } else {
        showToast('Could not read CSV — expected: revenue,orders per row', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/data/add', buildPayload());
      sessionStorage.setItem('dashboardData', JSON.stringify(data));
      showToast('Analysis complete!', 'success');
      router.push('/dashboard');
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.includes('last week')) {
        setErrors({ previousRevenue: 'Required for first entry', previousOrders: 'Required for first entry' });
      }
      showToast(msg, 'error');
      setLoading(false);
    }
  };

  const setF = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '7px 18px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 500, border: '0.5px solid var(--gray-border)',
    background: tab === t ? 'var(--purple-light)' : 'var(--bg-primary)',
    color: tab === t ? 'var(--purple)' : 'var(--text-secondary)',
    borderColor: tab === t ? 'var(--purple-mid)' : 'var(--gray-border)',
    cursor: 'pointer',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '28px 0' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="page-title">Enter your weekly data</div>
          <div className="page-subtitle">Add numbers for this week — we'll handle the comparison automatically.</div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 8, msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="no-scrollbar">
            <button style={tabStyle('manual')} onClick={() => setTab('manual')}>Manual entry</button>
            <button style={tabStyle('csv')} onClick={() => setTab('csv')}>Upload CSV</button>
            <button style={tabStyle('paste')} onClick={() => setTab('paste')}>Paste data</button>
          </div>

          {/* CSV tab */}
          {tab === 'csv' && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Upload a CSV file</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                Expected format: <code style={{ background: 'var(--gray-bg)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>revenue,orders</code> — one row per week (latest row used).
              </p>
              <input ref={fileRef} type="file" accept=".csv" onChange={handleCsv} style={{ display: 'none' }} />
              <button className="btn btn-outline" onClick={() => fileRef.current?.click()}>↑ Choose CSV file</button>
            </div>
          )}

          {/* Paste tab */}
          {tab === 'paste' && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Paste your data</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Paste from a spreadsheet. Numbers will be extracted automatically.</p>
              <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)}
                style={{ width: '100%', height: 100, padding: 10, borderRadius: 'var(--radius-md)', border: '0.5px solid var(--gray-border)', fontSize: 13, fontFamily: 'monospace', resize: 'vertical' }}
                placeholder="e.g.  50000  120&#10;     57000  111" />
              <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={handlePasteAnalyze}>Parse data →</button>
            </div>
          )}

          {/* Manual form (always shown, prefilled by csv/paste) */}
          {tab === 'manual' && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="responsive-grid-2" style={{ gap: 16, marginBottom: 20 }}>
                {/* Current week */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Current week</span>
                    <span style={{ background: 'var(--teal-light)', color: 'var(--teal)', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500 }}>This week</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Revenue ({currency})</label>
                    <input className="form-input" type="number" min="0" step="any" placeholder={`e.g. ${currency}50000`} value={form.currentRevenue} onChange={setF('currentRevenue')} />
                    {errors.currentRevenue && <div className="form-error">{errors.currentRevenue}</div>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Total orders</label>
                    <input className="form-input" type="number" min="0" step="1" placeholder="e.g. 120" value={form.currentOrders} onChange={setF('currentOrders')} />
                    {errors.currentOrders && <div className="form-error">{errors.currentOrders}</div>}
                  </div>
                </div>

                {/* Last week */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Last week</span>
                    <span style={{ background: 'var(--gray-bg)', color: 'var(--text-hint)', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500, border: '0.5px solid var(--gray-border)' }}>Previous</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Revenue ({currency})</label>
                    <input className="form-input" type="number" min="0" step="any" placeholder={`e.g. ${currency}57000`} value={form.previousRevenue} onChange={setF('previousRevenue')} />
                    {errors.previousRevenue && <div className="form-error">{errors.previousRevenue}</div>}
                    <div className="form-hint">Required for first entry. Auto-filled after.</div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Total orders</label>
                    <input className="form-input" type="number" min="0" step="1" placeholder="e.g. 111" value={form.previousOrders} onChange={setF('previousOrders')} />
                    {errors.previousOrders && <div className="form-error">{errors.previousOrders}</div>}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? <><span className="spinner" /> Analyzing…</> : 'Analyze data →'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function InputPage() {
  return (
    <AuthProvider>
      <ToastProvider>
        <InputContent />
      </ToastProvider>
    </AuthProvider>
  );
}
