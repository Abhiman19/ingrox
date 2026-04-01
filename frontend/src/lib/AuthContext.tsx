'use client';
// src/lib/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { api, getErrorMessage } from './api';

interface User { id: string; email: string; }
interface Business { id: string; name: string; type: string; currency: string; }

interface AuthCtx {
  user: User | null;
  business: Business | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setBusiness: (b: Business) => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saveSession = useCallback((tok: string, u: User, biz: Business | null) => {
    Cookies.set('token', tok, { expires: 7, secure: true, sameSite: 'strict' });
    setToken(tok);
    setUser(u);
    setBusiness(biz);
  }, []);

  useEffect(() => {
    const tok = Cookies.get('token');
    if (!tok) { setLoading(false); return; }
    api.get('/auth/me')
      .then(({ data }) => { setToken(tok); setUser(data.user); setBusiness(data.business); })
      .catch(() => { Cookies.remove('token'); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data.token, data.user, data.business);
  };

  const signup = async (email: string, password: string) => {
    const { data } = await api.post('/auth/signup', { email, password });
    saveSession(data.token, data.user, null);
  };

  const logout = () => {
    Cookies.remove('token');
    setToken(null); setUser(null); setBusiness(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, business, token, loading, login, signup, logout, setBusiness }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export { getErrorMessage };
