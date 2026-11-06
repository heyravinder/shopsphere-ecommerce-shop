import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name || '');
  const [addr, setAddr] = useState({ street: '', city: '', zip: '', ...user.address });
  const [msg, setMsg] = useState('');

  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setMsg('Enter your name.');
    try { await updateProfile({ name: name.trim(), address: addr }); setMsg('Profile saved.'); }
    catch (err) { setMsg(err.message); }
  };

  const field = (label, value, set) => (
    <label className="mb-3 block text-sm font-semibold">{label}
      <input value={value} onChange={(e) => set(e.target.value)} className="mt-1 w-full rounded border border-ink/20 bg-surface p-2 font-normal" />
    </label>
  );

  return (
    <form onSubmit={save} className="mx-auto max-w-md rounded-lg bg-surface p-5">
      <h1 className="text-2xl font-bold">Your profile</h1>
      <p className="mb-4 text-sm text-ink/60">{user.email}{!supabase && ' (demo account, stored in this browser)'}</p>
      {field('Name', name, setName)}
      <h2 className="mb-2 font-bold">Saved delivery address</h2>
      {field('Street address', addr.street, (v) => setAddr({ ...addr, street: v }))}
      {field('City', addr.city, (v) => setAddr({ ...addr, city: v }))}
      {field('Postal code', addr.zip, (v) => setAddr({ ...addr, zip: v }))}
      <p role="status" className="min-h-5 text-sm">{msg}</p>
      <div className="mt-2 flex justify-between">
        <button className="rounded-full bg-brand px-6 py-2 font-semibold text-white">Save changes</button>
        <button type="button" onClick={async () => { await logout(); navigate('/'); }} className="underline">Sign out</button>
      </div>
    </form>
  );
}
