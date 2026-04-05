'use client';
// src/app/dashboard/insights/page.tsx
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/hooks/useToast';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';

interface Insight {
  id: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  what_happened: string;
  why_it_happened: string;
  what_to_do: string;
  actions: string[] | string;
  feedback_type?: 'helpful' | 'not_helpful';
  created_at: string;
}

function priorityLabel(p: string) {
  if (p === 'high') return 'High priority';
  if (p === 'medium') return 'Medium priority';
  return 'Low priority';
}

function InsightCard({ insight, onFeedback }: { insight: Insight; onFeedback: (id: string, type: 'helpful' | 'not_helpful') => void }) {
  const actions: string[] = typeof insight.actions === 'string'
    ? JSON.parse(insight.actions)
    : (insight.actions || []);

  return (
    <div className="insight-card">
      <div className="insight-header">
        <div className="insight-title">{insight.what_happened}</div>
        <span className={`badge badge-${insight.priority}`}>{priorityLabel(insight.priority)}</span>
      </div>

      <div className="insight-row">
        <span className="insight-icon">📊</span>
        <span className="insight-text">{insight.what_happened}</span>
      </div>

      <div className="insight-row">
        <span className="insight-icon">🧠</span>
        <span className="insight-text">{insight.why_it_happened}</span>
      </div>

      <div className="insight-row">
        <span className="insight-icon">🎯</span>
        <span className="insight-text">{insight.what_to_do}</span>
      </div>

      {actions.length > 0 && (
        <ul className="actions-list">
          {actions.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      )}

      <div className="feedback-row">
        <button
          className={`feedback-btn ${insight.feedback_type === 'helpful' ? 'active-helpful' : ''}`}
          onClick={() => onFeedback(insight.id, 'helpful')}
        >
          👍 Helpful
        </button>
        <button
          className={`feedback-btn ${insight.feedback_type === 'not_helpful' ? 'active-not_helpful' : ''}`}
          onClick={() => onFeedback(insight.id, 'not_helpful')}
        >
          👎 Not helpful
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-hint)', alignSelf: 'center' }}>
          {new Date(insight.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  );
}

function InsightsContent() {
  const { showToast } = useToast();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const load = useCallback(() => {
    api.get('/insights/latest')
      .then(({ data }) => setInsights(data.insights))
      .catch((err) => { if (err.response?.status === 404) setNoData(true); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFeedback = async (insightId: string, type: 'helpful' | 'not_helpful') => {
    // Optimistic UI update: change the state immediately
    const prevInsights = [...insights];
    setInsights((prev) => prev.map((i) => i.id === insightId ? { ...i, feedback_type: type } : i));
    
    try {
      await api.post('/feedback', { insightId, type });
      showToast('Feedback saved', 'success');
    } catch {
      // Revert state if the API call fails
      setInsights(prevInsights);
      showToast('Could not save feedback', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <span className="spinner spinner-dark" />
      </div>
    );
  }

  if (noData || insights.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🧠</div>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>No insights yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>Add your data and we'll generate personalised insights.</p>
        <Link href="/input" className="btn btn-primary">Add data →</Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex-between-responsive" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-title">Insights</div>
          <div style={{ fontSize: 13, color: 'var(--text-hint)' }}>Based on your latest data · {insights.length} insight{insights.length !== 1 ? 's' : ''}</div>
        </div>
        <Link href="/input" className="btn btn-primary btn-sm responsive-btn">+ Add new data</Link>
      </div>

      {insights.map((ins) => (
        <InsightCard key={ins.id} insight={ins} onFeedback={handleFeedback} />
      ))}

      <div className="flex-between-responsive" style={{ marginTop: 20, padding: '20px', background: 'var(--gray-bg)', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--gray-border)' }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Come back next week with new data.</span>
        <Link href="/input" className="btn btn-outline btn-sm responsive-btn">Add next week →</Link>
      </div>
    </>
  );
}

export default function InsightsPage() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1, padding: '24px 0' }}>
            <div className="container" style={{ maxWidth: 800 }}>
              <InsightsContent />
            </div>
          </div>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
