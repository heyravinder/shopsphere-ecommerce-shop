# ShopSphere

A demo e-commerce storefront built with React, Vite, Tailwind CSS and React Router. Product data comes from the public [DummyJSON](https://dummyjson.com) API. No real payments are made.

## Run locally

```bash
npm install
npm run dev
```

## Phase 1
Home, product list with search, category filter and sorting, product detail with image gallery, cart with free-shipping progress, wishlist, 404 page. Cart and wishlist persist in localStorage.

## Phase 2
Coupons (SAVE10, WELCOME5, FREESHIP), 3-step checkout with validation, order history and detail with simulated tracking, dark mode.

## Phase 3
Filters (price, rating, brand, in stock) and an admin dashboard at /admin with stats, a Recharts sales chart, and add/edit stock/delete products (stored in localStorage).

## Phase 4
Sign in / register, profile with a saved delivery address (prefilled at checkout), and protected `/profile`, `/orders` and `/admin` routes.

Copy `.env.example` to `.env` and add Supabase keys for real auth. Without keys the app runs in demo mode: accounts live in this browser only (passwords are hashed, but this is for demos, not production). Set `VITE_ADMIN_EMAILS` to limit `/admin`. This check runs in the browser, so real protection needs Supabase row-level security once product data moves to the backend.

## Phase 5
Toast notifications, customer reviews (from DummyJSON), related products, recently viewed, and a compare page for up to 3 products.

## Next phases
Backend product data, product variants, cart sidebar, page transitions, infinite scroll.

## Deploy
Import the repo into Vercel or Netlify. Build command `npm run build`, output `dist`.
