import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  unit: string;
  image: string;
  qty: number;
  mandiPrice?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getQty: (id: string) => number;
  totalItems: () => number;
  totalPrice: () => number;
  hydrate: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    let updated: CartItem[];
    if (existing) {
      updated = get().items.map((i) =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [...get().items, { ...item, qty: 1 }];
    }
    set({ items: updated });
    AsyncStorage.setItem('cart', JSON.stringify(updated));
  },

  removeItem: (id) => {
    const updated = get().items.filter((i) => i.id !== id);
    set({ items: updated });
    AsyncStorage.setItem('cart', JSON.stringify(updated));
  },

  updateQty: (id, qty) => {
    let updated: CartItem[];
    if (qty <= 0) {
      updated = get().items.filter((i) => i.id !== id);
    } else {
      updated = get().items.map((i) => (i.id === id ? { ...i, qty } : i));
    }
    set({ items: updated });
    AsyncStorage.setItem('cart', JSON.stringify(updated));
  },

  clearCart: () => {
    set({ items: [] });
    AsyncStorage.removeItem('cart');
  },

  getQty: (id) => get().items.find((i) => i.id === id)?.qty ?? 0,

  totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

  hydrate: async () => {
    try {
      const saved = await AsyncStorage.getItem('cart');
      if (saved) set({ items: JSON.parse(saved) });
    } catch {}
  },
}));
