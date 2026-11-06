import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'ShopSphere | Home';
    getProducts(40).then((d) => setItems(d.products)).catch((e) => setError(e.message));
  }, []);

  const top = items ? [...items].sort((a, b) => b.rating - a.rating).slice(0, 4) : [];

  return (
    <>
      <section className="rounded-2xl bg-brand px-6 py-14 text-white sm:px-12">
        <h1 className="max-w-xl text-4xl font-extrabold sm:text-5xl">Everyday things, picked with care.</h1>
        <p className="mt-4 max-w-md text-white/80">Browse the catalog, save favorites, and check out in a few taps. This is a demo store, so no real payments.</p>
        <Link to="/products" className="mt-6 inline-block rounded-full bg-sun px-6 py-3 font-semibold text-night">Shop all products</Link>
      </section>
      <h2 className="mb-4 mt-10 text-2xl font-bold">Top rated</h2>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{error}</p>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {!items && !error && Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-lg bg-ink/10" />)}
        {top.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
