'use client';
// src/app/dashboard/page.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/hooks/useToast';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';

interface DashboardData {
  currentRevenue: number;
  previousRevenue: number;
  currentOrders: number;
  previousOrders: number;
  revenueChange: number;
  ordersChange: number;
  avgOrderValue: number;
  weekLabel?: string;
}

function MetricCard({ label, value, change, suffix = '' }: { label: string; value: string; change: number; suffix?: string }) {
  const isUp = change > 0;
  const isDown = change < 0;
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className={`metric-change ${isDown ? 'metric-down' : isUp ? 'metric-up' : 'metric-neutral'}`}>
        {isDown ? '▼' : isUp ? '▲' : '—'} {Math.abs(change).toFixed(1)}%{suffix}
        <span style={{ color: 'var(--text-hint)', marginLeft: 4, fontWeight: 400 }}>vs last week</span>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { business } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const currency = business?.currency === 'USD' ? '$' : business?.currency === 'EUR' ? '€' : '₹';
  const fmt = (n: number) => `${currency}${n.toLocaleString('en-IN')}`;

  useEffect(() => {
    // Check sessionStorage for fresh data from analysis
    const cached = sessionStorage.getItem('dashboardData');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setData(parsed.dashboard);
        setLoading(false);
        return;
      } catch { /* fall through */ }
    }
    api.get('/data/latest')
      .then(({ data: d }) => setData(d.dashboard))
      .catch((err) => {
        if (err.response?.status === 404) setNoData(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <span className="spinner spinner-dark" />
      </div>
    );
  }

  if (noData || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>No data yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>Add your first week of data to see your dashboard.</p>
        <Link href="/input" className="btn btn-primary">Add data →</Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex-between-responsive" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-title">Dashboard</div>
          <div style={{ fontSize: 13, color: 'var(--text-hint)' }}>
            {data.weekLabel ? `Week of ${data.weekLabel}` : 'Latest data'}
            <span style={{ margin: '0 8px' }}>·</span>
            <span style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 500 }}>● Live</span>
          </div>
        </div>
        <Link href="/input" className="btn btn-primary btn-sm">+ Add new data</Link>
      </div>

      {/* Metric cards */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        <MetricCard label="Revenue" value={fmt(data.currentRevenue)} change={data.revenueChange} />
        <MetricCard label="Orders" value={data.currentOrders.toString()} change={data.ordersChange} />
        <MetricCard label="Avg. order value" value={fmt(data.avgOrderValue)} change={Number(((data.avgOrderValue - (data.previousRevenue / (data.previousOrders || 1))) / (data.previousRevenue / (data.previousOrders || 1)) * 100).toFixed(1))} />
      </div>

      {/* Quick comparison table */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>This week vs last week</div>
        <div className="table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 400 }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid var(--gray-border)' }}>
              {['Metric', 'Last week', 'This week', 'Change'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 0', color: 'var(--text-secondary)', fontWeight: 500, fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Revenue', prev: fmt(data.previousRevenue), curr: fmt(data.currentRevenue), change: data.revenueChange },
              { label: 'Orders', prev: data.previousOrders.toString(), curr: data.currentOrders.toString(), change: data.ordersChange },
              { label: 'Avg order value', prev: fmt(data.previousRevenue / (data.previousOrders || 1)), curr: fmt(data.avgOrderValue), change: Number(((data.avgOrderValue - (data.previousRevenue / (data.previousOrders || 1))) / (data.previousRevenue / (data.previousOrders || 1)) * 100).toFixed(1)) },
            ].map((row) => (
              <tr key={row.label} style={{ borderBottom: '0.5px solid var(--gray-border)' }}>
                <td style={{ padding: '10px 0', color: 'var(--text-primary)' }}>{row.label}</td>
                <td style={{ padding: '10px 0', color: 'var(--text-secondary)' }}>{row.prev}</td>
                <td style={{ padding: '10px 0', fontWeight: 500 }}>{row.curr}</td>
                <td style={{ padding: '10px 0' }}>
                  <span style={{ color: row.change < 0 ? 'var(--red)' : row.change > 0 ? 'var(--green)' : 'var(--text-hint)', fontWeight: 500 }}>
                    {row.change > 0 ? '+' : ''}{row.change.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* CTA to insights */}
      <div className="flex-between-responsive insights-cta">
        <div className="text-left">
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--purple-dark)', marginBottom: 2 }}>View your insights</div>
          <div style={{ fontSize: 13, color: 'var(--purple)' }}>See what changed, why it happened, and what to do next.</div>
        </div>
        <Link href="/dashboard/insights" className="btn btn-primary responsive-btn">View insights →</Link>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1, padding: '24px 0' }}>
            <div className="container" style={{ maxWidth: 900 }}>
              <DashboardContent />
            </div>
          </div>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
