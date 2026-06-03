import axios from 'axios';
import { useAuthStore } from '../stores/stores';

// ─── Base ─────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://farmfresh-backend-cloude.onrender.com';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject auth token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  _id: string;
  name: string;
  nameHi?: string;
  description?: string;
  descriptionHi?: string;
  price: number;
  mrp?: number;
  unit: string;           // 'kg' | 'piece' | 'dozen'
  baseUnit?: string;
  quantityPresets?: number[];
  step?: number;
  minQty?: number;
  maxQty?: number;
  category: string;
  image?: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  comingSoon?: boolean;
  sortOrder?: number;
}

export interface Category {
  _id: string;
  name: string;
  nameHi?: string;
  icon?: string;
  image?: string;
  color?: string;
  sortOrder?: number;
}

export interface Order {
  _id: string;
  shortId?: string;
  user?: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  deliverySlot: 'morning' | 'evening';
  deliveryDate: string;
  address?: string;
  paymentId?: string;
  paymentMethod?: 'razorpay' | 'cod';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  price: number;
  qty: number;
  unit: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Settings {
  storeOpen: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  deliveryWaived: boolean;
}

export interface MandiRate {
  _id: string;
  name: string;
  nameHi?: string;
  price: number;
  unit: string;
  change?: number;      // % change from yesterday
  icon?: string;
  category?: string;
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const AuthAPI = {
  sendOTP: (phone: string) =>
    api.post('/api/auth/send-otp', { phone }),

  verifyOTP: (phone: string, otp: string) =>
    api.post<{ token: string; user: import('../stores/stores').User }>(
      '/api/auth/verify-otp',
      { phone, otp }
    ),
};

// ─── Product endpoints ────────────────────────────────────────────────────────

export const ProductAPI = {
  getAll: (category?: string) =>
    api.get<{ products: Product[]; total: number }>('/api/products', { params: { category } })
       .then((r) => ({ ...r, data: r.data.products })),

  getById: (id: string) =>
    api.get<{ product: Product }>(`/api/products/${id}`)
       .then((r) => ({ ...r, data: r.data.product })),

  getCategories: () => {
    const fallbackCategories: Category[] = [
      { _id: 'fruits', name: 'Fruits', nameHi: 'फल', icon: '🍉', color: '#2A1A00' },
      { _id: 'veggies', name: 'Veggies', nameHi: 'सब्जियां', icon: '🥦', color: '#0F2A12' },
      { _id: 'dryfruits', name: 'Dry Fruits', nameHi: 'सूखे मेवे', icon: '🥜', color: '#2A2200' },
    ];
    return Promise.resolve({
      data: fallbackCategories,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
  },
};

// ─── Order endpoints ──────────────────────────────────────────────────────────

export const OrderAPI = {
  create: (payload: {
    items: { product: string; name: string; price: number; qty: number; unit: string }[];
    phone: string;
    deliverySlot: string;
    deliveryDate: string;
    address?: string;
    paymentMethod: 'razorpay' | 'cod';
    paymentId?: string;
  }) => api.post<Order>('/api/orders', payload),

  getMyOrders: (phone: string) =>
    api.get<Order[]>('/api/orders/my', { params: { phone } }),

  getById: (id: string) =>
    api.get<Order>(`/api/orders/${id}`),

  createRazorpayOrder: (amount: number) =>
    api.post<{ id: string; amount: number; currency: string }>(
      '/api/payments/create-order',
      { amount }
    ),
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const SettingsAPI = {
  get: () => api.get<Settings>('/api/settings'),
};

// ─── Mandi rates ──────────────────────────────────────────────────────────────

export const MandiAPI = {
  getRates: () => {
    const fallbackMandi: MandiRate[] = [
      { _id: '1', name: 'Tomato', nameHi: 'टमाटर', price: 40, unit: 'kg', change: -5, icon: '🍅', category: 'veg' },
      { _id: '2', name: 'Potato', nameHi: 'आलू', price: 25, unit: 'kg', change: 2, icon: '🥔', category: 'veg' },
      { _id: '3', name: 'Onion', nameHi: 'प्याज़', price: 35, unit: 'kg', change: 8, icon: '🧅', category: 'veg' },
      { _id: '4', name: 'Green Chilli', nameHi: 'हरी मिर्च', price: 80, unit: 'kg', change: -12, icon: '🌶', category: 'veg' },
      { _id: '5', name: 'Lemon', nameHi: 'नींबू', price: 120, unit: 'kg', change: 0, icon: '🍋', category: 'fruit' },
      { _id: '6', name: 'Banana', nameHi: 'केला', price: 30, unit: 'dozen', change: 3, icon: '🍌', category: 'fruit' },
      { _id: '7', name: 'Mango', nameHi: 'आम', price: 80, unit: 'kg', change: -8, icon: '🥭', category: 'fruit' },
      { _id: '8', name: 'Coriander', nameHi: 'धनिया', price: 20, unit: 'bunch', change: 0, icon: '🌿', category: 'herb' },
    ];
    return Promise.resolve({
      data: fallbackMandi,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });
  },
};

// ─── Gold / subscriptions ─────────────────────────────────────────────────────

export const GoldAPI = {
  subscribe: (plan: 'monthly' | 'quarterly') =>
    api.post('/api/gold/subscribe', { plan }),

  getStatus: () =>
    api.get<{ isGold: boolean; expiry?: string }>('/api/gold/status'),
};
