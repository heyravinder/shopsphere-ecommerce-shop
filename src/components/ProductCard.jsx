import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useUi } from '../context/UiContext.jsx';
import { useShop } from '../context/ShopContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const { toast, toggleCompare, inCompare } = useUi();
  const liked = inWishlist(product.id);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-surface shadow-sm">
      <Link to={`/product/${product.id}`} className="relative block bg-ink/5">
        <img src={product.thumbnail} alt={product.title} loading="lazy" className="aspect-square w-full object-contain" />
        {product.discountPercentage > 8 && (
          <span className="absolute left-2 top-2 rounded bg-sun px-2 py-0.5 text-xs font-semibold text-night">
            {Math.round(product.discountPercentage)}% off
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={`/product/${product.id}`} className="line-clamp-2 font-semibold">{product.title}</Link>
        <p className="text-sm text-ink/60">{product.rating?.toFixed(1)} rating</p>
        <button onClick={() => toggleCompare(product)} aria-pressed={inCompare(product.id)} className="self-start text-sm underline">{inCompare(product.id) ? 'Remove from compare' : 'Compare'}</button>
        <div className="mt-auto flex items-center gap-2">
          <span className="font-display text-lg font-bold">${product.price}</span>
          <button
            onClick={() => { toggleWishlist(product); toast(liked ? 'Removed from wishlist' : 'Added to wishlist'); }}
            aria-pressed={liked}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
            className="ml-auto rounded-full p-2 hover:bg-ink/5"
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-brand text-brand' : ''}`} />
          </button>
          <button onClick={() => { addToCart(product); toast(`${product.title} added to cart`); }} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
