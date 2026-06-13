import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useQtyMemory() {
  const rememberQty = useCallback(async (productId: string, qty: number) => {
    try { await AsyncStorage.setItem('lastQty_' + productId, String(qty)); } catch {}
  }, []);

  const getLastQty = useCallback(async (productId: string): Promise<number> => {
    try {
      const saved = await AsyncStorage.getItem('lastQty_' + productId);
      return saved ? parseInt(saved, 10) : 1;
    } catch { return 1; }
  }, []);

  return { rememberQty, getLastQty };
}
