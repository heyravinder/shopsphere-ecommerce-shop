import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  if (wishlist.length === 0)
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2">Tap the heart on any product to save it here.</p>
        <Link to="/products" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white">Browse products</Link>
      </div>
    );
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Wishlist</h1>
      <ul className="divide-y divide-ink/10 rounded-lg bg-surface">
        {wishlist.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            <img src={p.thumbnail} alt="" className="h-16 w-16 rounded bg-ink/5 object-contain" />
            <Link to={`/product/${p.id}`} className="flex-1 font-semibold">{p.title}</Link>
            <span>${p.price}</span>
            <button onClick={() => addToCart(p)} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Add to cart</button>
            <button onClick={() => toggleWishlist(p)} className="text-sm underline">Remove</button>
          </li>
        ))}
      </ul>
    </>
  );
}
