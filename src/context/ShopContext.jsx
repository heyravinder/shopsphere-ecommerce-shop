import { createContext, useContext, useEffect, useReducer } from 'react';

import { COUPONS } from '../pricing.js';

const KEY = 'shopsphere:v1';
const ShopContext = createContext(null);

const slim = (p) => ({ id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail });

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Array.isArray(saved.cart) && Array.isArray(saved.wishlist))
      return { ...saved, orders: saved.orders || [], coupon: saved.coupon || null };
  } catch { /* storage unavailable or corrupt: start fresh */ }
  return { cart: [], wishlist: [], orders: [], coupon: null };
}

function reducer(state, a) {
  switch (a.type) {
    case 'ADD_CART': {
      const found = state.cart.find((i) => i.id === a.product.id);
      const cart = found
        ? state.cart.map((i) => (i.id === found.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.cart, { ...slim(a.product), qty: 1 }];
      return { ...state, cart };
    }
    case 'SET_QTY':
      return {
        ...state,
        cart: state.cart
          .map((i) => (i.id === a.id ? { ...i, qty: a.qty } : i))
          .filter((i) => i.qty > 0),
      };
    case 'REMOVE_CART':
      return { ...state, cart: state.cart.filter((i) => i.id !== a.id) };
    case 'TOGGLE_WISH': {
      const has = state.wishlist.some((i) => i.id === a.product.id);
      return {
        ...state,
        wishlist: has
          ? state.wishlist.filter((i) => i.id !== a.product.id)
          : [...state.wishlist, slim(a.product)],
      };
    }
    case 'COUPON':
      return { ...state, coupon: a.code };
    case 'PLACE_ORDER':
      return { ...state, orders: [a.order, ...state.orders], cart: [], coupon: null };
    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = state.cart.reduce((s, i) => s + i.qty, 0);

  const value = {
    ...state,
    subtotal,
    count,
    addToCart: (product) => dispatch({ type: 'ADD_CART', product }),
    setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE_CART', id }),
    applyCoupon: (code) => {
      const ok = !code || code in COUPONS;
      if (ok) dispatch({ type: 'COUPON', code: code || null });
      return ok;
    },
    placeOrder: (order) => dispatch({ type: 'PLACE_ORDER', order }),
    toggleWishlist: (product) => dispatch({ type: 'TOGGLE_WISH', product }),
    inWishlist: (id) => state.wishlist.some((i) => i.id === id),
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
