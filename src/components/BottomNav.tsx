// ============================================================
// FARM FRESH RN v4 — BottomNav
// Liquid glass pill · 3 tabs (Search / Home / Cart)
// Orders strip outside pill
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, interpolate, Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Spacing, Radius, Glass, Shadow } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';
import {
  IconSearch, IconHome, IconHomeFilled,
  IconCart, IconOrders,
} from './icons';

const { width: W } = Dimensions.get('window');
const PILL_W = W * 0.72;
const TAB_COUNT = 3;

export type BottomTabName = 'Home' | 'Search' | 'Cart';

interface BottomNavProps {
  activeTab: BottomTabName;
  onTabPress: (tab: BottomTabName) => void;
  onOrdersPress: () => void;
  cartCount?: number;
}

// ── Tab config ────────────────────────────────────────────
const TABS: { name: BottomTabName; IconDefault: any; IconActive: any; label: string }[] = [
  { name: 'Search', IconDefault: IconSearch,     IconActive: IconSearch,     label: 'Search'  },
  { name: 'Home',   IconDefault: IconHome,        IconActive: IconHomeFilled, label: 'Home'    },
  { name: 'Cart',   IconDefault: IconCart,        IconActive: IconCart,       label: 'Cart'    },
];

// ── Individual Tab ────────────────────────────────────────
const NavTab = ({
  tab, isActive, onPress, cartCount,
}: {
  tab: typeof TABS[0];
  isActive: boolean;
  onPress: () => void;
  cartCount?: number;
}) => {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);
  const labelOpacity = useSharedValue(isActive ? 1 : 0);
  const labelWidth = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    if (isActive) {
      iconScale.value = withSpring(1.12, { damping: 10, stiffness: 200 });
      labelOpacity.value = withTiming(1, { duration: 200 });
      labelWidth.value = withSpring(1, { damping: 14, stiffness: 120 });
    } else {
      iconScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      labelOpacity.value = withTiming(0, { duration: 150 });
      labelWidth.value = withSpring(0, { damping: 14, stiffness: 120 });
    }
  }, [isActive]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    maxWidth: interpolate(labelWidth.value, [0, 1], [0, 60], Extrapolation.CLAMP),
    marginLeft: interpolate(labelWidth.value, [0, 1], [0, 6], Extrapolation.CLAMP),
    overflow: 'hidden',
  }));

  const Icon = isActive ? tab.IconActive : tab.IconDefault;
  const iconColor = isActive ? Colors.logoGreen : Colors.textOnDarkMuted;

  return (
    <AnimatedPressable
      onPress={onPress}
      scaleDown={0.88}
      style={styles.tabWrap}
    >
      <View style={[styles.tab, isActive && styles.tabActive]}>
        <Animated.View style={iconStyle}>
          <Icon size={22} color={iconColor} strokeWidth={isActive ? 2.5 : 1.8} />
        </Animated.View>

        <Animated.Text style={[styles.tabLabel, { color: iconColor }, labelStyle]}>
          {tab.label}
        </Animated.Text>

        {/* Cart badge */}
        {tab.name === 'Cart' && cartCount && cartCount > 0 ? (
          <View style={styles.cartBadge}>
            <Animated.Text style={styles.cartBadgeText}>
              {cartCount > 9 ? '9+' : cartCount}
            </Animated.Text>
          </View>
        ) : null}
      </View>
    </AnimatedPressable>
  );
};

// ── Main BottomNav ────────────────────────────────────────
export const BottomNav = ({
  activeTab, onTabPress, onOrdersPress, cartCount = 0,
}: BottomNavProps) => {
  const insets = useSafeAreaInsets();

  const navOpacity = useSharedValue(0);
  const navTranslateY = useSharedValue(30);

  useEffect(() => {
    navOpacity.value = withTiming(1, { duration: 400 });
    navTranslateY.value = withSpring(0, { damping: 14, stiffness: 100 });
  }, []);

  const navStyle = useAnimatedStyle(() => ({
    opacity: navOpacity.value,
    transform: [{ translateY: navTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + Spacing.sm },
        navStyle,
      ]}
      pointerEvents="box-none"
    >
      {/* Orders strip — above pill, outside */}
      <AnimatedPressable onPress={onOrdersPress} scaleDown={0.95} style={styles.ordersStripWrap}>
        <View style={styles.ordersStrip}>
          <IconOrders size={14} color={Colors.textOnDarkMuted} />
          <Animated.Text style={styles.ordersStripText}>Your Orders</Animated.Text>
          <View style={styles.ordersActiveDot} />
        </View>
      </AnimatedPressable>

      {/* Liquid glass pill */}
      <View style={styles.pillShadowWrap}>
        <View style={styles.pill}>
          {/* Blur background */}
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

          {/* Glass overlay */}
          <View style={styles.pillGlass} pointerEvents="none" />

          {/* Tabs */}
          <View style={styles.pillInner}>
            {TABS.map(tab => (
              <NavTab
                key={tab.name}
                tab={tab}
                isActive={activeTab === tab.name}
                onPress={() => onTabPress(tab.name)}
                cartCount={tab.name === 'Cart' ? cartCount : 0}
              />
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },

  // ── Orders strip ─────────────────────────────────────────
  ordersStripWrap: {
    alignSelf: 'center',
  },
  ordersStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
  },
  ordersStripText: {
    fontFamily: Font.jakartaMedium,
    fontSize: 12,
    color: Colors.textOnDarkMuted,
  },
  ordersActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brandGreen,
  },

  // ── Pill ─────────────────────────────────────────────────
  pillShadowWrap: {
    borderRadius: Radius.full,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
  pill: {
    width: PILL_W,
    height: 62,
    borderRadius: Radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderGlassStrong,
  },
  pillGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pillInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.sm,
  },

  // ── Tab ──────────────────────────────────────────────────
  tabWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: Radius.full,
    minWidth: 44,
    height: 44,
  },
  tabActive: {
    backgroundColor: 'rgba(128,239,128,0.12)',
  },
  tabLabel: {
    fontFamily: Font.outfitMedium,
    fontSize: 13,
  },

  // ── Cart badge ───────────────────────────────────────────
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontFamily: Font.outfitBold,
    fontSize: 9,
    color: Colors.white,
  },
});
