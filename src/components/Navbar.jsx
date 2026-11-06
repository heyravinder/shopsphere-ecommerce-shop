import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Search } from 'lucide-react';
import { useState } from 'react';
import { User } from 'lucide-react';
import { isAdmin, useAuth } from '../context/AuthContext.jsx';
import { useUi } from '../context/UiContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useShop } from '../context/ShopContext.jsx';

export default function Navbar() {
  const { count, wishlist } = useShop();
  const { user } = useAuth();
  const { compare } = useUi();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : '/products');
  };

  const badge = (n) =>
    n > 0 && (
      <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-sun px-1 text-xs font-semibold text-night">
        {n}
      </span>
    );

  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-surface/90 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="font-display text-xl font-extrabold text-brand">ShopSphere</Link>
        <NavLink to="/products" className="hidden text-sm font-semibold sm:block">Shop</NavLink>
        <form onSubmit={submit} role="search" className="relative ml-auto w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink/50" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search products"
            placeholder="Search products"
            className="w-full rounded-full border border-ink/20 bg-surface py-2 pl-9 pr-3 text-sm"
          />
        </form>
        <NavLink to="/orders" className="hidden text-sm font-semibold sm:block">Orders</NavLink>
        <NavLink to="/compare" className="hidden text-sm font-semibold sm:block">Compare{compare.length > 0 && ` (${compare.length})`}</NavLink>
        {isAdmin(user) && <NavLink to="/admin" className="hidden text-sm font-semibold sm:block">Admin</NavLink>}
        <ThemeToggle />
        {user ? (
          <Link to="/profile" aria-label="Your profile"><User className="h-6 w-6" /></Link>
        ) : (
          <Link to="/login" className="text-sm font-semibold">Sign in</Link>
        )}
        <Link to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`} className="relative">
          <Heart className="h-6 w-6" />{badge(wishlist.length)}
        </Link>
        <Link to="/cart" aria-label={`Cart, ${count} items`} className="relative">
          <ShoppingBag className="h-6 w-6" />{badge(count)}
        </Link>
      </nav>
    </header>
  );
}
