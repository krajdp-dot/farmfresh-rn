import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ordersAPI, BackendOrder, CreateOrderPayload } from '../services/api';

// Map backend status → UI status
export function mapStatus(s: BackendOrder['status']): 'placed' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled' {
  if (s === 'packing')    return 'confirmed';
  if (s === 'dispatched') return 'out_for_delivery';
  return s as any;
}

export function useOrders() {
  const [orders, setOrders]   = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) { setOrders([]); return; }
      const { orders: data } = await ordersAPI.getMyOrders();
      setOrders(data);
    } catch (e: any) {
      setError(e.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

export function usePlaceOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const placeOrder = async (payload: CreateOrderPayload): Promise<BackendOrder | null> => {
    setLoading(true);
    setError(null);
    try {
      const { order } = await ordersAPI.create(payload);
      return order;
    } catch (e: any) {
      setError(e.message || 'Failed to place order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
}
