import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  nameHi?: string;
  price: number;         // price per unit
  mrp?: number;
  unit: string;          // 'kg' | 'piece' | 'dozen'
  qty: number;           // qty in cart (in units)
  step: number;          // increment step (0.5 for half-kg, 1 for piece)
  minQty: number;
  maxQty: number;
  image?: string;
  category?: string;
}

export interface CartState {
  items: Record<string, CartItem>;  // keyed by productId
  deliverySlot: 'morning' | 'evening';
  deliveryDate: 'today' | 'tomorrow';
  isCartOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (productId: string) => void;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;

  // Slot
  setSlot: (slot: 'morning' | 'evening') => void;
  setDate: (date: 'today' | 'tomorrow') => void;

  // Drawer
  openCart: () => void;
  closeCart: () => void;

  // Computed (selectors)
  getQty: (productId: string) => number;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryFee: (freeThreshold?: number, deliveryFee?: number) => number;
  getTotal: (freeThreshold?: number, deliveryFee?: number) => number;
  isEmpty: () => boolean;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>((set, get) => ({
  items: {},
  deliverySlot: 'morning',
  deliveryDate: 'today',
  isCartOpen: false,

  addItem: (itemData) => {
    const { items } = get();
    const existing = items[itemData.productId];
    if (existing) {
      // increment if already in cart
      const newQty = Math.min(existing.qty + existing.step, existing.maxQty);
      set({ items: { ...items, [itemData.productId]: { ...existing, qty: newQty } } });
    } else {
      set({
        items: {
          ...items,
          [itemData.productId]: { ...itemData, qty: itemData.minQty },
        },
      });
    }
  },

  removeItem: (productId) => {
    const { items } = get();
    const next = { ...items };
    delete next[productId];
    set({ items: next });
  },

  incrementQty: (productId) => {
    const { items } = get();
    const item = items[productId];
    if (!item) return;
    const newQty = Math.min(item.qty + item.step, item.maxQty);
    set({ items: { ...items, [productId]: { ...item, qty: newQty } } });
  },

  decrementQty: (productId) => {
    const { items } = get();
    const item = items[productId];
    if (!item) return;
    const newQty = item.qty - item.step;
    if (newQty < item.minQty) {
      // Remove from cart
      const next = { ...items };
      delete next[productId];
      set({ items: next });
    } else {
      set({ items: { ...items, [productId]: { ...item, qty: newQty } } });
    }
  },

  setQty: (productId, qty) => {
    const { items } = get();
    const item = items[productId];
    if (!item) return;
    if (qty <= 0) {
      const next = { ...items };
      delete next[productId];
      set({ items: next });
    } else {
      const clamped = Math.max(item.minQty, Math.min(qty, item.maxQty));
      set({ items: { ...items, [productId]: { ...item, qty: clamped } } });
    }
  },

  clearCart: () => set({ items: {} }),

  setSlot: (slot) => set({ deliverySlot: slot }),
  setDate: (date) => set({ deliveryDate: date }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  // ─── Selectors ──────────────────────────────────────────────────────────────

  getQty: (productId) => get().items[productId]?.qty ?? 0,

  getItemCount: () =>
    Object.values(get().items).reduce((sum, item) => sum + 1, 0),  // count unique items

  getSubtotal: () =>
    Object.values(get().items).reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    ),

  getDeliveryFee: (freeThreshold = 299, deliveryFee = 29) => {
    const subtotal = get().getSubtotal();
    return subtotal >= freeThreshold ? 0 : deliveryFee;
  },

  getTotal: (freeThreshold = 299, deliveryFee = 29) => {
    return get().getSubtotal() + get().getDeliveryFee(freeThreshold, deliveryFee);
  },

  isEmpty: () => Object.keys(get().items).length === 0,
}));
