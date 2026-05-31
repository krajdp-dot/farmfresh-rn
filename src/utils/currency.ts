/** Format price as ₹XX or ₹XX.XX */
export function formatPrice(amount: number, showDecimal = false): string {
  if (showDecimal) {
    return `₹${amount.toFixed(2)}`;
  }
  return `₹${Math.round(amount)}`;
}

/** Format weight: 500 → "500g", 1000 → "1 kg", 1500 → "1.5 kg" */
export function formatWeight(grams: number): string {
  if (grams < 1000) return `${grams}g`;
  const kg = grams / 1000;
  return kg % 1 === 0 ? `${kg} kg` : `${kg} kg`;
}

/** Format quantity with unit */
export function formatQty(qty: number, unit: string): string {
  if (unit === 'kg') {
    if (qty < 1) return `${qty * 1000}g`;
    return `${qty} kg`;
  }
  if (unit === 'dozen') {
    return qty === 1 ? '1 dozen' : `${qty} dozen`;
  }
  return `${qty} ${unit}`;
}

/** Savings percentage */
export function savingsPct(mrp: number, price: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/** Format Indian number: 1234567 → "12,34,567" */
export function formatIndian(n: number): string {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
}
