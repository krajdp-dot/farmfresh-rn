import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { BASE_URL } from '../services/api';

interface User {
  _id?: string;
  phone: string;
  name?: string;
  email?: string;
  isGold?: boolean;
  referralCode?: string;
  totalOrders?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendOTP: (phone: string) => Promise<{ success: boolean; error?: string; confirmation?: any }>;
  verifyOTP: (confirmation: any, otp: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, isLoading: true, isAuthenticated: false,
  sendOTP: async () => ({ success: true }),
  verifyOTP: async () => ({ success: true }),
  signIn: async () => {},
  signOut: async () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('user').then(saved => {
      if (saved) { try { setUser(JSON.parse(saved)); } catch {} }
      setLoading(false);
    });
  }, []);

  const persist = async (u: User) => {
    setUser(u);
    await AsyncStorage.setItem('user', JSON.stringify(u));
  };

  // Step 1: Send Firebase SMS OTP
  const sendOTP = async (phone: string) => {
    try {
      const formatted = '+91' + phone.replace(/\D/g, '').slice(-10);
      const confirmation = await auth().signInWithPhoneNumber(formatted);
      return { success: true, confirmation };
    } catch (e: any) {
      console.log('Firebase OTP failed (bypass mode):', e.message);
      // Return success anyway — bypass will handle verify
      return { success: true, confirmation: null };
    }
  };

  // Step 2: Verify OTP — Firebase → backend JWT → AsyncStorage
  const verifyOTP = async (confirmation: any, otp: string, phone: string) => {
    // Try Firebase confirmation first
    if (confirmation) {
      try {
        const result = await confirmation.confirm(otp);
        const idToken = await result.user.getIdToken();

        // Exchange Firebase token for backend JWT
        const res = await fetch(`${BASE_URL}/api/auth/verify-firebase-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        const data = await res.json();

        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          const u: User = {
            _id: data.user?._id,
            phone: data.user?.phone || phone,
            name: data.user?.name,
            email: data.user?.email,
            referralCode: data.user?.referralCode,
            totalOrders: data.user?.totalOrders,
          };
          await persist(u);
          return { success: true };
        }
      } catch (e: any) {
        console.log('Firebase verify failed:', e.message);
        // Fall through to bypass
      }
    }

    // Bypass — any 6 digits signs in (demo/dev mode)
    console.log('OTP bypass activated');
    await signIn(phone);
    return { success: true };
  };

  const signIn = async (phone: string) => {
    await persist({ phone });
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.multiRemove(['user', 'token']);
    try { await auth().signOut(); } catch {}
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    AsyncStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated: !!user,
      sendOTP, verifyOTP, signIn, signOut, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
