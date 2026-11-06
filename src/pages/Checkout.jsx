import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { METHODS, calcTotals, money } from '../pricing.js';

const STEPS = ['Shipping', 'Delivery and payment', 'Review'];
const FIELDS = [['name', 'Full name'], ['email', 'Email'], ['address', 'Street address'], ['city', 'City'], ['zip', 'Postal code']];
const PAYMENTS = { card: 'Credit card (demo)', upi: 'UPI (demo)', cod: 'Cash on delivery (demo)' };

function validate(f) {
  const e = {};
  FIELDS.forEach(([k, label]) => { if (!f[k].trim()) e[k] = `Enter your ${label.toLowerCase()}.`; });
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter an email like name@example.com.';
  if (f.zip && !/^[A-Za-z0-9 -]{4,10}$/.test(f.zip)) e.zip = 'Enter a valid postal code.';
  return e;
}

export default function Checkout() {
  const { cart, subtotal, coupon, placeOrder } = useShop();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: user?.address?.street || '', city: user?.address?.city || '', zip: user?.address?.zip || '' });
  const [errors, setErrors] = useState({});
  const [method, setMethod] = useState('standard');
  const [payment, setPayment] = useState('card');

  if (cart.length === 0) return <Navigate to="/cart" replace />;
  const totals = calcTotals(subtotal, coupon, method);

  const next = () => {
    if (step === 0) {
      const e = validate(form);
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setStep(step + 1);
  };

  const place = () => {
    const id = `SS-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    placeOrder({ id, createdAt: Date.now(), items: cart, address: form, method, payment: PAYMENTS[payment], coupon, subtotal, ...totals });
    navigate(`/order/${id}`);
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <ol className="my-4 flex gap-2 text-sm" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined} className={`rounded-full px-3 py-1 ${i === step ? 'bg-brand text-white' : 'bg-ink/10'}`}>{s}</li>
        ))}
      </ol>
      <div className="rounded-lg bg-surface p-4">
        {step === 0 && FIELDS.map(([k, label]) => (
          <div key={k} className="mb-3">
            <label htmlFor={k} className="block text-sm font-semibold">{label}</label>
            <input id={k} value={form[k]} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full rounded border border-ink/20 bg-surface p-2" />
            {errors[k] && <p id={`${k}-err`} className="text-sm text-red-600">{errors[k]}</p>}
          </div>
        ))}
        {step === 1 && (
          <>
            <fieldset className="mb-4"><legend className="font-semibold">Delivery</legend>
              {Object.entries(METHODS).map(([k, m]) => (
                <label key={k} className="mt-2 flex gap-2"><input type="radio" name="method" checked={method === k} onChange={() => setMethod(k)} />{m.label}, {money(m.fee)}</label>
              ))}
            </fieldset>
            <fieldset><legend className="font-semibold">Payment (no real charge)</legend>
              {Object.entries(PAYMENTS).map(([k, l]) => (
                <label key={k} className="mt-2 flex gap-2"><input type="radio" name="pay" checked={payment === k} onChange={() => setPayment(k)} />{l}</label>
              ))}
            </fieldset>
          </>
        )}
        {step === 2 && (
          <div className="space-y-2 text-sm">
            <p><b>Ship to:</b> {form.name}, {form.address}, {form.city} {form.zip}</p>
            <p><b>Delivery:</b> {METHODS[method].label}. <b>Payment:</b> {PAYMENTS[payment]}</p>
            <ul>{cart.map((i) => <li key={i.id}>{i.qty} x {i.title}</li>)}</ul>
            <p className="text-base font-bold">Total {money(totals.total)}</p>
          </div>
        )}
        <div className="mt-4 flex justify-between">
          {step > 0 ? <button onClick={() => setStep(step - 1)} className="underline">Back</button> : <Link to="/cart" className="underline">Back to cart</Link>}
          {step < 2
            ? <button onClick={next} className="rounded-full bg-brand px-6 py-2 font-semibold text-white">Continue</button>
            : <button onClick={place} className="rounded-full bg-brand px-6 py-2 font-semibold text-white">Place order</button>}
        </div>
      </div>
    </div>
  );
}
