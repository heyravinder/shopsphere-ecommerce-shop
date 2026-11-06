const BASE = 'https://dummyjson.com';

async function get(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`Request failed (${res.status}). Check your connection and try again.`);
  return res.json();
}

export const getProducts = (limit = 30) => get(`/products?limit=${limit}`);
export const searchProducts = (q) => get(`/products/search?q=${encodeURIComponent(q)}`);
export const getProduct = (id) => get(`/products/${id}`);
export const getCategories = () => get('/products/categories');
export const getByCategory = (slug) => get(`/products/category/${slug}`);
