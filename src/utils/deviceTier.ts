import { Platform } from 'react-native';
import * as Device from 'expo-device';

export type DeviceTier = 'low' | 'mid' | 'high';

let _tier: DeviceTier | null = null;

export function getDeviceTier(): DeviceTier {
  if (_tier) return _tier;

  // On simulator/emulator → mid tier
  if (!Device.isDevice) {
    _tier = 'mid';
    return _tier;
  }

  const totalMem = Device.totalMemory ?? 0; // bytes
  const gbMem = totalMem / (1024 ** 3);

  if (Platform.OS === 'android') {
    // Android: judge by RAM
    if (gbMem < 3) {
      _tier = 'low';
    } else if (gbMem < 6) {
      _tier = 'mid';
    } else {
      _tier = 'high';
    }
  } else {
    // iOS: all modern iPhones handle 120fps — tier by RAM still
    if (gbMem < 3) {
      _tier = 'mid';
    } else {
      _tier = 'high';
    }
  }

  return _tier;
}

/** Target FPS by tier: low=60, mid=90, high=120 */
export function getTargetFPS(): 60 | 90 | 120 {
  const tier = getDeviceTier();
  if (tier === 'low') return 60;
  if (tier === 'mid') return 90;
  return 120;
}

/** Spring config by tier — heavier spring on low-end */
export function getSpringConfig(preset: 'snappy' | 'bouncy' | 'gentle') {
  const tier = getDeviceTier();

  const configs = {
    snappy: {
      low:  { mass: 1,   stiffness: 200, damping: 22 },
      mid:  { mass: 0.8, stiffness: 260, damping: 20 },
      high: { mass: 0.6, stiffness: 300, damping: 18 },
    },
    bouncy: {
      low:  { mass: 1,   stiffness: 180, damping: 15 },
      mid:  { mass: 0.8, stiffness: 220, damping: 14 },
      high: { mass: 0.6, stiffness: 260, damping: 12 },
    },
    gentle: {
      low:  { mass: 1,   stiffness: 120, damping: 20 },
      mid:  { mass: 0.8, stiffness: 150, damping: 18 },
      high: { mass: 0.6, stiffness: 180, damping: 16 },
    },
  };

  return configs[preset][tier];
}

/** Whether to run heavy effects (particles, blur, etc.) */
export function canRunHeavyEffects(): boolean {
  return getDeviceTier() !== 'low';
}

/** Whether to enable 120fps Reanimated worklets */
export function can120fps(): boolean {
  return getDeviceTier() === 'high';
}
