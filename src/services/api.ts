import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://farmfresh-backend-cloude.onrender.com';

// ─── Core fetch ──────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (auth) {
    const token = await AsyncStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res  = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────
// Backend requires phone + email for OTP
// RN app uses phone only — we derive a dummy email for OTP flow
// Firebase token path is also available

export const authAPI = {
  // Send OTP to email derived from phone (backend requires both)
  sendOTP: (phone: string, email: string) =>
    request<{ success: boolean; message: string }>('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, email }),
    }),

  // Verify OTP — returns JWT token + user
  verifyOTP: (phone: string, email: string, otp: string) =>
    request<{ success: boolean; token: string; user: BackendUser }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, email, otp }),
    }),

  // Firebase token auth (if Firebase Phone Auth enabled)
  verifyFirebaseToken: (idToken: string) =>
    request<{ success: boolean; token: string; user: BackendUser; isNew: boolean }>(
      '/api/auth/verify-firebase-token',
      { method: 'POST', body: JSON.stringify({ idToken }) }
    ),

  updateProfile: (name: string, email: string) =>
    request<{ user: BackendUser }>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name, email }),
    }, true),
};

// ─── Types ───────────────────────────────────────────────────
export interface BackendUser {
  _id: string;
  phone: string;
  name?: string;
  email?: string;
  addresses?: { label: string; fullAddress: string; pincode?: string }[];
  wallet: number;
  referralCode?: string;
  totalOrders: number;
  isBlocked: boolean;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  nameHi?: string;                    // not in schema — we add client-side
  category: 'fruits' | 'veggies' | 'dryfruits' | 'spices';
  emoji?: string;
  images?: string[];
  unit: string;
  price: number;
  mrp: number;                        // backend uses mrp not mandiPrice
  mandiPrice?: number;                // alias — we map mrp → mandiPrice
  stock: number;
  isAvailable: boolean;
  comingSoon: boolean;
  availableIn?: string;
  quantityPresets?: string[];
  baseUnit?: string;
  tags?: string[];
  rating: number;
  totalSold: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  mrp?: number;
  unit: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  address: { fullAddress: string; pincode?: string };
  phone: string;
  customerName?: string;
  notes?: string;
  deliverySlot?: string;
  paymentMethod: 'upi' | 'card' | 'cod' | 'wallet';
  couponCode?: string;
}

export interface BackendOrder {
  _id: string;
  customerName?: string;
  phone: string;
  items: { productId: string; name: string; qty: number; price: number; mrp: number; unit: string }[];
  address: { fullAddress: string; pincode?: string };
  notes?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  status: 'placed' | 'confirmed' | 'packing' | 'dispatched' | 'delivered' | 'cancelled';
  deliverySlot?: string;
  timeline: { status: string; note: string; timestamp: string }[];
  createdAt: string;
}

export interface Settings {
  deliveryWaived: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  supportPhone: string;
  storeOpen: boolean;
  announcement: string;
}

// ─── Products ────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params?: { category?: string; search?: string; sort?: string; limit?: number }) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.fromEntries(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          )
        )
      : '';
    // Returns { products, total }
    return request<{ products: Product[]; total: number }>(`/api/products${qs}`);
  },

  getById: (id: string) =>
    // Returns { product }
    request<{ product: Product }>(`/api/products/${id}`),
};

// ─── Orders ──────────────────────────────────────────────────
export const ordersAPI = {
  // POST /api/orders — no auth required, just phone
  create: (payload: CreateOrderPayload) =>
    request<{ success: boolean; order: BackendOrder; razorpayOrderId?: string; total: number }>(
      '/api/orders',
      { method: 'POST', body: JSON.stringify(payload) }
    ),

  // GET /api/orders — requires JWT auth
  getMyOrders: () =>
    request<{ orders: BackendOrder[] }>('/api/orders', {}, true),

  // GET /api/orders/:id — no auth, by _id or shortId suffix
  getById: (id: string) =>
    request<{ order: BackendOrder }>(`/api/orders/${id}`),
};

// ─── Settings ────────────────────────────────────────────────
export const settingsAPI = {
  get: () => request<Settings>('/api/settings'),
};

// ─── Payments ────────────────────────────────────────────────
export const paymentsAPI = {
  createOrder: (amount: number) =>
    request<{ id: string; amount: number; currency: string }>(
      '/api/payments/create-order',
      { method: 'POST', body: JSON.stringify({ amount }) }
    ),

  verify: (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) =>
    request<{ success: boolean }>('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
    }),
};

// ─── Subscriptions ───────────────────────────────────────────
export const subscriptionsAPI = {
  create: (data: {
    customerName: string; phone: string; email?: string;
    address: { fullAddress: string; pincode?: string };
    basketItems: { itemId: string; name: string; emoji?: string; qty: number; unit: string; price: number }[];
    frequency: 'weekly' | 'monthly'; deliveryDay: string;
    payType: 'upfront' | 'per_delivery';
    basketTotal: number; upfrontTotal: number;
    razorpayPaymentId?: string;
  }) =>
    request<{ success: boolean; subscription: any }>(
      '/api/subscriptions',
      { method: 'POST', body: JSON.stringify(data) }
    ),

  getByPhone: (phone: string) =>
    request<{ subscriptions: any[] }>(`/api/subscriptions/${phone}`),

  pause:  (id: string) => request<{ success: boolean }>(`/api/subscriptions/${id}/pause`,  { method: 'PATCH' }),
  resume: (id: string) => request<{ success: boolean }>(`/api/subscriptions/${id}/resume`, { method: 'PATCH' }),
  cancel: (id: string) => request<{ success: boolean }>(`/api/subscriptions/${id}`,        { method: 'DELETE' }),
};

// ─── Analytics ───────────────────────────────────────────────
export const analyticsAPI = {
  event: (event: string, data?: { sessionId?: string; path?: string; device?: 'mobile' | 'desktop'; name?: string; total?: string }) =>
    request<{ ok: boolean }>('/api/analytics/event', {
      method: 'POST',
      body: JSON.stringify({ event, device: 'mobile', ...data }),
    }).catch(() => null), // fire-and-forget, never throw
};
