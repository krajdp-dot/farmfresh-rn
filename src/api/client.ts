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
    api.get<Product[]>('/api/products', { params: { category } }),

  getById: (id: string) =>
    api.get<Product>(`/api/products/${id}`),

  getCategories: () =>
    api.get<Category[]>('/api/categories'),
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
  getRates: () => api.get<MandiRate[]>('/api/mandi'),
};

// ─── Gold / subscriptions ─────────────────────────────────────────────────────

export const GoldAPI = {
  subscribe: (plan: 'monthly' | 'quarterly') =>
    api.post('/api/gold/subscribe', { plan }),

  getStatus: () =>
    api.get<{ isGold: boolean; expiry?: string }>('/api/gold/status'),
};
