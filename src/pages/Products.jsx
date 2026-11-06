import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getByCategory, getCategories, getProducts, searchProducts } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

const SORTS = {
  default: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export default function Products() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const [sort, setSort] = useState('default');
  const [cats, setCats] = useState([]);
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [brands, setBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);

  useEffect(() => { document.title = 'ShopSphere | Products'; getCategories().then(setCats).catch(() => {}); }, []);

  useEffect(() => {
    setItems(null); setError(''); setBrands([]); setMaxPrice(null);
    const req = q ? searchProducts(q) : category ? getByCategory(category) : getProducts(0);
    req.then((d) => setItems(d.products)).catch((e) => setError(e.message));
  }, [q, category]);

  const ceiling = useMemo(() => (items?.length ? Math.ceil(Math.max(...items.map((p) => p.price))) : 0), [items]);
  const brandList = useMemo(() => [...new Set((items || []).map((p) => p.brand).filter(Boolean))].sort(), [items]);
  const limit = maxPrice ?? ceiling;

  const shown = (items || [])
    .filter((p) => p.price <= limit && p.rating >= minRating && (!inStock || p.stock > 0) && (!brands.length || brands.includes(p.brand)))
    .sort(SORTS[sort]);

  const toggleBrand = (b) => setBrands((cur) => (cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]));
  const clear = () => { setBrands([]); setMaxPrice(null); setMinRating(0); setInStock(false); };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{q ? `Results for "${q}"` : 'All products'}</h1>
        <label className="ml-auto text-sm">Category{' '}
          <select value={category} onChange={(e) => setParams(e.target.value ? { category: e.target.value } : {})} className="rounded border border-ink/20 bg-surface p-2">
            <option value="">All</option>
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className="text-sm">Sort{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded border border-ink/20 bg-surface p-2">
            <option value="default">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <aside aria-label="Filters" className="h-fit space-y-5 rounded-lg bg-surface p-4 text-sm">
          <div>
            <label htmlFor="price" className="font-semibold">Price: up to ${limit}</label>
            <input id="price" type="range" min="0" max={ceiling} value={limit} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-brand" />
          </div>
          <div>
            <label htmlFor="rating" className="font-semibold">Rating</label>
            <select id="rating" value={minRating} onChange={(e) => setMinRating(+e.target.value)} className="mt-1 w-full rounded border border-ink/20 bg-surface p-2">
              <option value="0">Any</option><option value="3">3 and up</option><option value="4">4 and up</option><option value="4.5">4.5 and up</option>
            </select>
          </div>
          <label className="flex gap-2"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />In stock only</label>
          {brandList.length > 0 && (
            <fieldset>
              <legend className="font-semibold">Brand</legend>
              <div className="mt-1 max-h-48 space-y-1 overflow-y-auto">
                {brandList.map((b) => <label key={b} className="flex gap-2"><input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} />{b}</label>)}
              </div>
            </fieldset>
          )}
          <button onClick={clear} className="underline">Clear filters</button>
        </aside>
        <div>
          {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{error}</p>}
          {items && shown.length === 0 && <p>No products match these filters. Try clearing some.</p>}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {!items && !error && Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-lg bg-ink/10" />)}
            {shown.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </>
  );
}
