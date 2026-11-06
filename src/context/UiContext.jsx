import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
const read = (k) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch { return []; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const pick = (p) => ({ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, rating: p.rating, brand: p.brand, stock: p.stock, category: p.category });

export function UiProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [compare, setCompare] = useState(() => read('shopsphere:compare'));
  const [recent, setRecent] = useState(() => read('shopsphere:recent'));
  useEffect(() => write('shopsphere:compare', compare), [compare]);
  useEffect(() => write('shopsphere:recent', recent), [recent]);

  const toast = (msg) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500);
  };

  const toggleCompare = (p) => {
    if (compare.some((x) => x.id === p.id)) setCompare(compare.filter((x) => x.id !== p.id));
    else if (compare.length >= 3) toast('You can compare up to 3 products. Remove one first.');
    else setCompare([...compare, pick(p)]);
  };

  const value = {
    toast, compare, toggleCompare, recent,
    inCompare: (id) => compare.some((x) => x.id === id),
    removeCompare: (id) => setCompare((c) => c.filter((x) => x.id !== id)),
    pushRecent: (p) => setRecent((r) => [pick(p), ...r.filter((x) => x.id !== p.id)].slice(0, 8)),
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 space-y-2">
        {toasts.map((t) => <div key={t.id} className="rounded-full bg-ink px-4 py-2 text-sm text-paper shadow">{t.msg}</div>)}
      </div>
    </Ctx.Provider>
  );
}

export const useUi = () => useContext(Ctx);
