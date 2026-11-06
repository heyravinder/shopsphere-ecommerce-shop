import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext.jsx';
import { COUPONS, FREE_SHIPPING_AT, calcTotals, money } from '../pricing.js';

export default function Cart() {
  const { cart, subtotal, coupon, setQty, removeFromCart, applyCoupon } = useShop();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');

  if (cart.length === 0)
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link to="/products" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white">Find something to buy</Link>
      </div>
    );

  const { discount, shipping, total } = calcTotals(subtotal, coupon);
  const after = subtotal - discount;
  const pct = Math.min(100, (after / FREE_SHIPPING_AT) * 100);

  const submit = (e) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    setMsg(applyCoupon(c) ? `${c} applied.` : 'That code isn\'t valid. Try SAVE10, WELCOME5 or FREESHIP.');
    setCode('');
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <section>
        <h1 className="mb-4 text-2xl font-bold">Cart</h1>
        <ul className="divide-y divide-ink/10 rounded-lg bg-surface">
          {cart.map((i) => (
            <li key={i.id} className="flex items-center gap-3 p-3">
              <img src={i.thumbnail} alt="" className="h-16 w-16 rounded bg-ink/5 object-contain" />
              <div className="flex-1">
                <Link to={`/product/${i.id}`} className="font-semibold">{i.title}</Link>
                <p className="text-sm text-ink/60">${i.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Decrease quantity" onClick={() => setQty(i.id, i.qty - 1)}><Minus className="h-4 w-4" /></button>
                <span aria-live="polite" className="w-6 text-center">{i.qty}</span>
                <button aria-label="Increase quantity" onClick={() => setQty(i.id, i.qty + 1)}><Plus className="h-4 w-4" /></button>
              </div>
              <button aria-label={`Remove ${i.title}`} onClick={() => removeFromCart(i.id)}><Trash2 className="h-5 w-5" /></button>
            </li>
          ))}
        </ul>
      </section>
      <aside className="h-fit rounded-lg bg-surface p-4">
        <h2 className="text-lg font-bold">Order summary</h2>
        <p className="mt-3 text-sm">{shipping === 0 ? 'You get free shipping.' : `Add ${money(FREE_SHIPPING_AT - after)} more for free shipping.`}</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-ink/10"><div className="h-full bg-brand" style={{ width: `${pct}%` }} /></div>
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} aria-label="Coupon code" placeholder="Coupon code" className="w-full rounded border border-ink/20 bg-surface p-2 text-sm" />
          <button className="rounded bg-ink px-3 text-sm font-semibold text-paper">Apply</button>
        </form>
        <p aria-live="polite" className="mt-1 min-h-5 text-sm">{msg}</p>
        {coupon && <p className="text-sm">{COUPONS[coupon].label} <button onClick={() => { applyCoupon(null); setMsg(''); }} className="underline">Remove</button></p>}
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
          {discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>-{money(discount)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
          <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-bold"><dt>Total</dt><dd>{money(total)}</dd></div>
        </dl>
        <Link to="/checkout" className="mt-4 block rounded-full bg-brand py-3 text-center font-semibold text-white">Checkout</Link>
      </aside>
    </div>
  );
}
