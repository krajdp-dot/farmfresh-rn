// ============================================================
// FARM FRESH RN v4 — Notifications Utility
// expo-notifications · Permission · Order status triggers
// ============================================================

import * as ExpoNotifications from 'expo-notifications';
import { Platform } from 'react-native';

// ── Global handler — shows alert when app is foregrounded ─
ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ── Request permission ────────────────────────────────────
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status: existing } = await ExpoNotifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await ExpoNotifications.requestPermissionsAsync();
  return status === 'granted';
};

// ── Get Expo push token (for backend to send push) ────────
export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return null;

    const token = await ExpoNotifications.getExpoPushTokenAsync({
      projectId: 'e584507d-3c69-4f7f-a761-bff19b7dd5a7', // EAS project ID
    });
    return token.data;
  } catch (e) {
    console.warn('Push token error:', e);
    return null;
  }
};

// ── Local notification triggers ───────────────────────────
// Call these from your order flow

export const notify = {
  // Order confirmed — right after place order
  orderConfirmed: async (orderId: string) => {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: '✅ Order Confirmed',
        body: `Your order #${orderId} is confirmed. We're picking from mandi now.`,
        sound: true,
        data: { type: 'order_confirmed', orderId },
      },
      trigger: null, // immediate
    });
  },

  // Picked from mandi
  pickedFromMandi: async (orderId: string) => {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: '🌱 Picked from Mandi',
        body: `Fresh produce for #${orderId} sourced from Bhagalpur mandi. Out for delivery soon!`,
        sound: true,
        data: { type: 'picked', orderId },
      },
      trigger: null,
    });
  },

  // Out for delivery
  outForDelivery: async (orderId: string, slot: string) => {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: '🚚 Out for Delivery',
        body: `Order #${orderId} is on the way! Expected: ${slot}`,
        sound: true,
        data: { type: 'out_for_delivery', orderId },
      },
      trigger: null,
    });
  },

  // Delivered
  delivered: async (orderId: string) => {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Delivered!',
        body: `Order #${orderId} delivered. Enjoy your fresh produce!`,
        sound: true,
        data: { type: 'delivered', orderId },
      },
      trigger: null,
    });
  },

  // Mandi price alert (optional)
  mandiPriceAlert: async (item: string, price: number) => {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: '📊 Mandi Price Update',
        body: `${item} is now ₹${price}/kg at Bhagalpur mandi`,
        sound: false,
        data: { type: 'mandi_price', item },
      },
      trigger: null,
    });
  },
};

// ── Notification tap handler — use in App.tsx ─────────────
// Navigates to correct screen when user taps a notification
export const useNotificationNavigation = (navigationRef: any) => {
  ExpoNotifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as any;
    if (!navigationRef?.current) return;

    switch (data?.type) {
      case 'order_confirmed':
      case 'picked':
      case 'out_for_delivery':
      case 'delivered':
        navigationRef.current.navigate('MainNavigator', {
          screen: 'OrderDetail',
          params: { order: { id: data.orderId } },
        });
        break;
      case 'mandi_price':
        navigationRef.current.navigate('MainNavigator', { screen: 'Home' });
        break;
    }
  });
};

// ── Android channel (required for Android 8+) ────────────
export const setupAndroidChannel = async () => {
  if (Platform.OS === 'android') {
    await ExpoNotifications.setNotificationChannelAsync('orders', {
      name: 'Order Updates',
      importance: ExpoNotifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#80EF80',
      sound: 'default',
    });
    await ExpoNotifications.setNotificationChannelAsync('mandi', {
      name: 'Mandi Prices',
      importance: ExpoNotifications.AndroidImportance.DEFAULT,
      sound: null,
    });
  }
};
