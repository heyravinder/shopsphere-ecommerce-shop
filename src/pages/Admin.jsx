import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getProducts } from '../api.js';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../pricing.js';

const KEY = 'shopsphere:admin';
const DEMO_SALES = [
  { m: 'Jun', v: 4200 }, { m: 'Jul', v: 5100 }, { m: 'Aug', v: 4800 },
  { m: 'Sep', v: 6300 }, { m: 'Oct', v: 7400 }, { m: 'Nov', v: 8100 },
];

function load() {
  const base = { added: [], removed: [], stock: {} };
  try { return { ...base, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return base; }
}

export default function Admin() {
  const { orders } = useShop();
  const [ov, setOv] = useState(load);
  const [api, setApi] = useState(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', price: '', stock: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    document.title = 'ShopSphere | Admin';
    getProducts(30).then((d) => { setApi(d.products); setTotal(d.total); }).catch((e) => setError(e.message));
  }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(ov)); } catch { /* ignore */ } }, [ov]);

  const products = api
    ? [...ov.added, ...api.filter((p) => !ov.removed.includes(p.id))].map((p) => ({ ...p, stock: ov.stock[p.id] ?? p.stock }))
    : [];
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  const add = (e) => {
    e.preventDefault();
    const price = Number(form.price), stock = Number(form.stock);
    if (!form.title.trim() || !(price > 0) || !Number.isInteger(stock) || stock < 0) {
      setFormError('Enter a title, a price above 0, and a whole-number stock.');
      return;
    }
    setFormError('');
    setOv((o) => ({ ...o, added: [{ id: `new-${Date.now()}`, title: form.title.trim(), price, stock }, ...o.added] }));
    setForm({ title: '', price: '', stock: '' });
  };

  const remove = (p) => {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    setOv((o) => (String(p.id).startsWith('new-')
      ? { ...o, added: o.added.filter((x) => x.id !== p.id) }
      : { ...o, removed: [...o.removed, p.id] }));
  };

  const stat = (label, value) => (
    <div className="rounded-lg bg-surface p-4"><p className="text-sm text-ink/60">{label}</p><p className="font-display text-2xl font-bold">{value}</p></div>
  );

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Admin dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {stat('Products', total ? total - ov.removed.length + ov.added.length : '-')}
        {stat('Orders', orders.length)}
        {stat('Revenue (demo)', money(revenue))}
      </div>
      <section className="mt-6 rounded-lg bg-surface p-4">
        <h2 className="mb-2 font-bold">Monthly sales (demo data)</h2>
        <div className="h-56"><ResponsiveContainer><BarChart data={DEMO_SALES}><XAxis dataKey="m" /><YAxis /><Tooltip /><Bar dataKey="v" fill="#1F8282" /></BarChart></ResponsiveContainer></div>
      </section>
      <section className="mt-6 rounded-lg bg-surface p-4">
        <h2 className="mb-2 font-bold">Add product</h2>
        <form onSubmit={add} className="flex flex-wrap gap-2">
          <input aria-label="Title" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="min-w-48 flex-1 rounded border border-ink/20 bg-surface p-2" />
          <input aria-label="Price" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-24 rounded border border-ink/20 bg-surface p-2" />
          <input aria-label="Stock" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-24 rounded border border-ink/20 bg-surface p-2" />
          <button className="rounded-full bg-brand px-5 font-semibold text-white">Add</button>
        </form>
        {formError && <p role="alert" className="mt-1 text-sm text-red-600">{formError}</p>}
        <p className="mt-2 text-xs text-ink/60">Changes are saved in this browser only and don't affect the storefront.</p>
      </section>
      <section className="mt-6 rounded-lg bg-surface p-4">
        <h2 className="mb-2 font-bold">Inventory</h2>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <ul className="divide-y divide-ink/10">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-2 text-sm">
              <span className="flex-1">{p.title}</span>
              <span>{money(p.price)}</span>
              <input type="number" min="0" aria-label={`Stock for ${p.title}`} value={p.stock} onChange={(e) => setOv((o) => ({ ...o, stock: { ...o.stock, [p.id]: Math.max(0, +e.target.value) } }))} className="w-20 rounded border border-ink/20 bg-surface p-1" />
              <button onClick={() => remove(p)} className="underline">Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
