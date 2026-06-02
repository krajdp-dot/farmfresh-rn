import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { MainTabParamList } from './types';
import { Colors, Font, Layout, Radius, wp, hp, fs } from '../theme';
import { useCartStore } from '../stores/cartStore';
import HomeStack from './HomeStack';
import SearchScreen from '../screens/SearchScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconEmoji, active && styles.iconActive]}>🌿</Text>
    </View>
  );
}
function SearchIcon({ active }: { active: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconEmoji, active && styles.iconActive]}>🔍</Text>
    </View>
  );
}
function CatIcon({ active }: { active: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconEmoji, active && styles.iconActive]}>🗂</Text>
    </View>
  );
}
function CartIcon({ active, count }: { active: boolean; count: number }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconEmoji, active && styles.iconActive]}>🛒</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Pill Tab Bar ─────────────────────────────────────────────────────────────

interface PillTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function PillTabBar({ state, descriptors, navigation }: PillTabBarProps) {
  const insets = useSafeAreaInsets();
  const getItemCount = useCartStore((s) => s.getItemCount);
  const cartCount = getItemCount();
  const appNav = useNavigation<any>();

  // ── Hooks MUST be outside map ─────────────────────────────────────────────
  const scale0 = useSharedValue(1);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const scales = [scale0, scale1, scale2, scale3];

  const anim0 = useAnimatedStyle(() => ({ transform: [{ scale: scale0.value }] }));
  const anim1 = useAnimatedStyle(() => ({ transform: [{ scale: scale1.value }] }));
  const anim2 = useAnimatedStyle(() => ({ transform: [{ scale: scale2.value }] }));
  const anim3 = useAnimatedStyle(() => ({ transform: [{ scale: scale3.value }] }));
  const anims = [anim0, anim1, anim2, anim3];

  const tabs = [
    { name: 'Home',       label: 'Shop',   Icon: HomeIcon   },
    { name: 'Search',     label: 'Search', Icon: SearchIcon },
    { name: 'Categories', label: 'Browse', Icon: CatIcon    },
    { name: 'Cart',       label: 'Cart',   Icon: CartIcon   },
  ];

  return (
    <View style={[styles.outerWrap, { paddingBottom: insets.bottom + hp(8) }]}>
      {/* Orders strip */}
      <Pressable
        style={styles.ordersStrip}
        onPress={() => appNav.navigate('Home', { screen: 'Orders' })}
      >
        <Text style={styles.ordersStripText}>📦  My Orders</Text>
        <Text style={styles.ordersStripArrow}>›</Text>
      </Pressable>

      {/* Liquid glass pill */}
      <View style={styles.pillOuter}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.pillInner}>
          {tabs.map((tab, index) => {
            const isFocused = state.index === index;
            const scale = scales[index];
            const animStyle = anims[index];

            const onPress = () => {
              scale.value = withSpring(0.88, { stiffness: 400, damping: 15 }, () => {
                scale.value = withSpring(1, { stiffness: 300, damping: 14 });
              });
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[index].key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(state.routes[index].name);
              }
            };

            return (
              <Pressable
                key={tab.name}
                onPress={onPress}
                style={styles.tabItem}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <Animated.View style={[styles.tabContent, animStyle]}>
                  {isFocused && <View style={styles.activePill} />}
                  <tab.Icon
                    active={isFocused}
                    count={tab.name === 'Cart' ? cartCount : 0}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ─── Main Navigator ───────────────────────────────────────────────────────────

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"       component={HomeStack}        />
      <Tab.Screen name="Search"     component={SearchScreen}     />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Cart"       component={CartScreen}       />
    </Tab.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PILL_H = hp(62);

const styles = StyleSheet.create({
  outerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(16),
    gap: hp(6),
  },

  // Orders strip
  ordersStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.full,
    paddingHorizontal: wp(18),
    paddingVertical: hp(8),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ordersStripText: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(13),
    color: Colors.textSecondary,
    letterSpacing: 0.1,
  },
  ordersStripArrow: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(18),
    color: Colors.textMuted,
    lineHeight: fs(20),
  },

  // Glass pill
  pillOuter: {
    height: PILL_H,
    borderRadius: Radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },
  pillInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(8),
    backgroundColor: 'rgba(10,26,15,0.40)',
  },

  // Tab item
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(6),
    paddingHorizontal: wp(10),
    borderRadius: Radius.full,
    minWidth: wp(60),
  },
  activePill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    opacity: 0.9,
  },

  // Icon
  iconWrap: {
    width: wp(24),
    height: wp(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: fs(18),
    opacity: 0.55,
  },
  iconActive: {
    opacity: 1,
  },

  // Badge
  badge: {
    position: 'absolute',
    top: -hp(4),
    right: -wp(4),
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: wp(16),
    height: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(9),
    color: Colors.textInverse,
    lineHeight: fs(12),
  },

  // Labels
  tabLabel: {
    fontSize: fs(10),
    letterSpacing: 0.2,
    marginTop: hp(2),
  },
  tabLabelActive: {
    fontFamily: Font.outfit.semiBold,
    color: Colors.white,
  },
  tabLabelInactive: {
    fontFamily: Font.outfit.regular,
    color: Colors.textMuted,
  },
});
