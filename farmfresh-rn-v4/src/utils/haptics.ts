// ============================================================
// FARM FRESH RN v4 — Haptics Utility
// Wrapper around expo-haptics with named presets
// Usage: Haptics.tap() / Haptics.success() / Haptics.error()
// ============================================================

import * as ExpoHaptics from 'expo-haptics';
import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';

export const Haptics = {
  // Light tap — every button press, category pill, filter chip
  tap: () => {
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
  },

  // Medium — add to cart, qty change, slot select
  medium: () => {
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
  },

  // Heavy — place order, destructive action
  heavy: () => {
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy);
  },

  // Success — OTP verified, order placed, item added
  success: () => {
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
  },

  // Error — wrong OTP, invalid input, shake
  error: () => {
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
  },

  // Warning — out of stock tap, low stock
  warning: () => {
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning);
  },

  // Selection — tab switch, weight option select
  selection: () => {
    ExpoHaptics.selectionAsync();
  },
};
