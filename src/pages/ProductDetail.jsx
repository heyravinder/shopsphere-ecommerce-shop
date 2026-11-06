import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getByCategory, getProduct } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { useUi } from '../context/UiContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const { toast, recent, pushRecent } = useUi();
  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [img, setImg] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setP(null); setError(''); setImg(0); setRelated([]);
    getProduct(id)
      .then((d) => {
        setP(d);
        document.title = `${d.title} | ShopSphere`;
        pushRecent(d);
        getByCategory(d.category).then((r) => setRelated(r.products.filter((x) => x.id !== d.id).slice(0, 4))).catch(() => {});
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{error}</p>;
  if (!p) return <div className="h-96 animate-pulse rounded-lg bg-ink/10" />;

  const liked = inWishlist(p.id);
  const seen = recent.filter((r) => r.id !== p.id).slice(0, 4);

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img src={p.images?.[img] || p.thumbnail} alt={p.title} className="aspect-square w-full rounded-lg bg-surface object-contain" />
          <div className="mt-3 flex gap-2">
            {p.images?.map((src, i) => (
              <button key={src} onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`} className={`h-16 w-16 overflow-hidden rounded border-2 bg-surface ${i === img ? 'border-brand' : 'border-transparent'}`}>
                <img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">{p.title}</h1>
          <p className="mt-1 text-ink/60">{p.brand ? `${p.brand} · ` : ''}{p.rating} rating</p>
          <p className="mt-4 font-display text-3xl font-bold">${p.price}</p>
          <p className="mt-1 text-sm">{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>
          <p className="mt-4 max-w-prose">{p.description}</p>
          <div className="mt-6 flex gap-3">
            <button disabled={p.stock === 0} onClick={() => { addToCart(p); toast(`${p.title} added to cart`); }} className="rounded-full bg-brand px-6 py-3 font-semibold text-white disabled:opacity-50">Add to cart</button>
            <button onClick={() => { toggleWishlist(p); toast(liked ? 'Removed from wishlist' : 'Added to wishlist'); }} aria-pressed={liked} className="rounded-full border border-ink/20 px-6 py-3 font-semibold">{liked ? 'Remove from wishlist' : 'Add to wishlist'}</button>
          </div>
        </div>
      </div>

      {p.reviews?.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold">Customer reviews</h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {p.reviews.map((r, i) => (
              <li key={i} className="rounded-lg bg-surface p-3 text-sm">
                <p className="font-semibold">{r.rating} / 5 · {r.reviewerName}</p>
                <p className="mt-1">{r.comment}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}

      {seen.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold">Recently viewed</h2>
          <ul className="flex gap-3 overflow-x-auto">
            {seen.map((r) => (
              <li key={r.id} className="w-32 shrink-0 text-sm">
                <Link to={`/product/${r.id}`}>
                  <img src={r.thumbnail} alt="" loading="lazy" className="aspect-square w-full rounded bg-surface object-contain" />
                  <span className="mt-1 line-clamp-2 block">{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
