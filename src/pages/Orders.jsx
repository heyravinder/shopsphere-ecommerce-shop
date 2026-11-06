import { Link, useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { money } from '../pricing.js';

const STATUSES = ['Processing', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
// Demo tracking: advances one status per minute since the order was placed.
const statusOf = (o) => Math.min(STATUSES.length - 1, Math.floor((Date.now() - o.createdAt) / 60000));

export function Orders() {
  const { orders } = useShop();
  if (orders.length === 0)
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <Link to="/products" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white">Start shopping</Link>
      </div>
    );
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Your orders</h1>
      <ul className="divide-y divide-ink/10 rounded-lg bg-surface">
        {orders.map((o) => (
          <li key={o.id} className="flex items-center gap-3 p-3">
            <Link to={`/order/${o.id}`} className="flex-1 font-semibold">{o.id}</Link>
            <span className="text-sm">{new Date(o.createdAt).toLocaleDateString()}</span>
            <span className="text-sm">{STATUSES[statusOf(o)]}</span>
            <span className="font-semibold">{money(o.total)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const { orders } = useShop();
  const o = orders.find((x) => x.id === id);
  if (!o) return <p>We couldn't find that order. <Link to="/orders" className="underline">See all orders</Link></p>;
  const s = statusOf(o);
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Thanks, your order is placed</h1>
      <p className="mt-1">Order {o.id}. This is a demo, so nothing was charged.</p>
      <ol className="my-5 grid grid-cols-5 gap-1 text-center text-xs">
        {STATUSES.map((t, i) => (
          <li key={t} aria-current={i === s ? 'step' : undefined}>
            <div className={`mb-1 h-2 rounded ${i <= s ? 'bg-brand' : 'bg-ink/10'}`} />{t}
          </li>
        ))}
      </ol>
      <div className="rounded-lg bg-surface p-4 text-sm">
        <ul>{o.items.map((i) => <li key={i.id} className="flex justify-between"><span>{i.qty} x {i.title}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
        <p className="mt-3 border-t border-ink/10 pt-2 font-bold">Total {money(o.total)}</p>
        <p className="mt-2">Ship to {o.address.name}, {o.address.address}, {o.address.city} {o.address.zip}</p>
      </div>
    </div>
  );
}
