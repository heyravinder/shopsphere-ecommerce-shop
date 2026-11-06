import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
// With Supabase keys set, real auth is used. Without them, a browser-only demo mode runs.
export const supabase = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null;

const USERS = 'shopsphere:users';
const SESSION = 'shopsphere:session';
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const fromSb = (u) => ({ id: u.id, email: u.email, name: u.user_metadata?.name || '', address: u.user_metadata?.address || {} });
const pub = ({ pw, ...u }) => u;

async function hash(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function isAdmin(user) {
  const list = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  return !!user && (list.length === 0 || list.includes(user.email.toLowerCase()));
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) { setUser(read(SESSION, null)); setReady(true); return undefined; }
    supabase.auth.getSession().then(({ data }) => { setUser(data.session ? fromSb(data.session.user) : null); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s ? fromSb(s.user) : null));
    return () => data.subscription.unsubscribe();
  }, []);

  const startDemoSession = (u) => { write(SESSION, pub(u)); setUser(pub(u)); };

  const register = async (name, email, password) => {
    email = email.trim().toLowerCase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      if (error) throw error;
      return { needsConfirm: !data.session };
    }
    const users = read(USERS, {});
    if (users[email]) throw new Error('An account with that email already exists. Sign in instead.');
    users[email] = { id: `u-${Date.now()}`, name, email, address: {}, pw: await hash(email + password) };
    write(USERS, users);
    startDemoSession(users[email]);
    return { needsConfirm: false };
  };

  const login = async (email, password) => {
    email = email.trim().toLowerCase();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return;
    }
    const u = read(USERS, {})[email];
    if (!u || u.pw !== (await hash(email + password))) throw new Error('Email or password is incorrect.');
    startDemoSession(u);
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    else { write(SESSION, null); setUser(null); }
  };

  const updateProfile = async (patch) => {
    if (supabase) {
      const { error } = await supabase.auth.updateUser({ data: patch });
      if (error) throw error;
    } else {
      const users = read(USERS, {});
      users[user.email] = { ...users[user.email], ...patch };
      write(USERS, users);
      startDemoSession(users[user.email]);
    }
    setUser((u) => ({ ...u, ...patch }));
  };

  return <AuthContext.Provider value={{ user, ready, register, login, logout, updateProfile }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
