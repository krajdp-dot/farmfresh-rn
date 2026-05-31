import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Lang } from '../i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  phone: string;
  name?: string;
  email?: string;
  isGold?: boolean;
  goldExpiry?: string;
  addresses?: Address[];
}

export interface Address {
  _id?: string;
  label: string;       // "Home", "Work", etc.
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
  isGuest: boolean;
  isHydrated: boolean;

  setUser: (user: User, token: string) => Promise<void>;
  setGuest: () => void;
  logout: () => Promise<void>;
  hydrateFromStorage: () => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isGuest: false,
  isHydrated: false,

  setUser: async (user, token) => {
    await AsyncStorage.multiSet([
      ['ff_user', JSON.stringify(user)],
      ['ff_token', token],
    ]);
    set({ user, token, isGuest: false });
  },

  setGuest: () => {
    set({ user: null, token: null, isGuest: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['ff_user', 'ff_token']);
    set({ user: null, token: null, isGuest: false });
  },

  updateUser: (partial) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...partial } });
  },

  hydrateFromStorage: async () => {
    try {
      const [userStr, token] = await AsyncStorage.multiGet(['ff_user', 'ff_token']);
      const user = userStr[1] ? (JSON.parse(userStr[1]) as User) : null;
      const tok = token[1] ?? null;
      set({ user, token: tok, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },
}));

// ─── Language Store ────────────────────────────────────────────────────────────

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => Promise<void>;
  hydrateLang: () => Promise<void>;
}

export const useLangStore = create<LangState>((set) => ({
  lang: 'en',

  setLang: async (lang) => {
    await AsyncStorage.setItem('ff_lang', lang);
    set({ lang });
  },

  hydrateLang: async () => {
    try {
      const stored = await AsyncStorage.getItem('ff_lang');
      if (stored === 'en' || stored === 'hi') {
        set({ lang: stored });
      }
    } catch {
      // default 'en'
    }
  },
}));

// ─── Location Store ────────────────────────────────────────────────────────────

interface LocationState {
  city: string;
  pincode: string;
  address: string;
  isSet: boolean;

  setLocation: (city: string, pincode: string, address?: string) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  city: 'Bhagalpur',
  pincode: '812001',
  address: 'Bhagalpur, Bihar',
  isSet: true,  // Farm Fresh only serves Bhagalpur for now

  setLocation: (city, pincode, address) => {
    set({ city, pincode, address: address ?? `${city}, Bihar`, isSet: true });
  },

  clearLocation: () => {
    set({ city: '', pincode: '', address: '', isSet: false });
  },
}));
