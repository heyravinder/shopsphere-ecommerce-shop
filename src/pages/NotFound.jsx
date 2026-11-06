import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2">That address doesn't exist in the store.</p>
      <Link to="/" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white">Back to home</Link>
    </div>
  );
}
