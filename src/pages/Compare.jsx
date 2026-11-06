import { Link } from 'react-router-dom';
import { useUi } from '../context/UiContext.jsx';

const ROWS = [
  ['Price', (p) => `$${p.price}`],
  ['Rating', (p) => `${p.rating?.toFixed(1)} / 5`],
  ['Brand', (p) => p.brand || 'Not listed'],
  ['Category', (p) => p.category],
  ['Availability', (p) => (p.stock > 0 ? `${p.stock} in stock` : 'Out of stock')],
];

export default function Compare() {
  const { compare, removeCompare } = useUi();
  if (compare.length === 0)
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Nothing to compare yet</h1>
        <p className="mt-2">Choose Compare on up to 3 products to see them side by side.</p>
        <Link to="/products" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white">Browse products</Link>
      </div>
    );
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Compare products</h1>
      <div className="overflow-x-auto rounded-lg bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr><th className="p-3"><span className="sr-only">Attribute</span></th>
              {compare.map((p) => (
                <th key={p.id} className="p-3 align-top">
                  <img src={p.thumbnail} alt="" className="mb-2 h-24 w-24 rounded bg-ink/5 object-contain" />
                  <Link to={`/product/${p.id}`} className="block font-semibold">{p.title}</Link>
                  <button onClick={() => removeCompare(p.id)} className="mt-1 font-normal underline">Remove</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, get]) => (
              <tr key={label} className="border-t border-ink/10">
                <th scope="row" className="p-3">{label}</th>
                {compare.map((p) => <td key={p.id} className="p-3">{get(p)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
