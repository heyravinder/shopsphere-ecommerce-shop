import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/profile';
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (mode === 'register' && !f.name.trim()) return setError('Enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError('Enter an email like name@example.com.');
    if (f.password.length < 8) return setError('Use a password with at least 8 characters.');
    setBusy(true);
    try {
      if (mode === 'login') await login(f.email, f.password);
      else {
        const r = await register(f.name.trim(), f.email, f.password);
        if (r.needsConfirm) setInfo('Check your email to confirm your account, then sign in.');
        else navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const input = (id, label, type = 'text') => (
    <div className="mb-3">
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      <input id={id} type={type} value={f[id]} onChange={(e) => setF({ ...f, [id]: e.target.value })} autoComplete={id === 'password' ? (mode === 'login' ? 'current-password' : 'new-password') : id} className="w-full rounded border border-ink/20 bg-surface p-2" />
    </div>
  );

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm rounded-lg bg-surface p-5">
      <h1 className="mb-4 text-2xl font-bold">{mode === 'login' ? 'Sign in' : 'Create your account'}</h1>
      {mode === 'register' && input('name', 'Name')}
      {input('email', 'Email', 'email')}
      {input('password', 'Password', 'password')}
      {error && <p role="alert" className="mb-2 text-sm text-red-600">{error}</p>}
      {info && <p role="status" className="mb-2 text-sm">{info}</p>}
      <button disabled={busy} className="w-full rounded-full bg-brand py-2 font-semibold text-white disabled:opacity-60">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
      <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="mt-3 text-sm underline">
        {mode === 'login' ? 'New here? Create an account' : 'Have an account? Sign in'}
      </button>
    </form>
  );
}
