export const FREE_SHIPPING_AT = 100;
export const COUPONS = {
  SAVE10: { label: '10% off your order', type: 'percent', value: 10 },
  WELCOME5: { label: '$5 off', type: 'flat', value: 5 },
  FREESHIP: { label: 'Free standard shipping', type: 'ship' },
};
export const METHODS = {
  standard: { label: 'Standard, 5 to 7 days', fee: 9.99 },
  express: { label: 'Express, 1 to 2 days', fee: 19.99 },
};

export function calcTotals(subtotal, couponCode, method = 'standard') {
  const c = COUPONS[couponCode];
  let discount = 0;
  if (c?.type === 'percent') discount = (subtotal * c.value) / 100;
  if (c?.type === 'flat') discount = Math.min(c.value, subtotal);
  const free = method === 'standard' && (c?.type === 'ship' || subtotal - discount >= FREE_SHIPPING_AT);
  const shipping = free ? 0 : METHODS[method].fee;
  return { discount, shipping, total: subtotal - discount + shipping };
}

export const money = (n) => `$${n.toFixed(2)}`;
