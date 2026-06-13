import { useState, useEffect } from 'react';
import { settingsAPI, Settings } from '../services/api';

const DEFAULTS: Settings = {
  deliveryWaived: false,
  deliveryFee: 29,
  freeDeliveryThreshold: 299,
  supportPhone: '7480062299',
  storeOpen: true,
  announcement: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    settingsAPI.get()
      .then(s => setSettings(s))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const calcDeliveryFee = (subtotal: number): number => {
    if (settings.deliveryWaived) return 0;
    return subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  };

  return { settings, loading, calcDeliveryFee };
}
