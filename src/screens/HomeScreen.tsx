import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { Colors, Font, fs, wp, hp, Radius, Layout, Space } from '../theme';
import { useAuthStore, useLangStore } from '../stores/stores';
import { useCartStore } from '../stores/cartStore';
import { ProductAPI, SettingsAPI, type Product, type Category } from '../api/client';
import { t } from '../i18n';
import type { HomeScreenNavProp } from '../navigation/types';

import MandiTicker from '../components/home/MandiTicker';
import ProductCard from '../components/ui/ProductCard';

// ─── Greeting ─────────────────────────────────────────────────────────────────

function getGreeting(lang: 'en' | 'hi'): string {
  const h = new Date().getHours();
  if (h < 12) return t('greeting_morning', lang);
  if (h < 17) return t('greeting_afternoon', lang);
  return t('greeting_evening', lang);
}

// ─── Category Pill ────────────────────────────────────────────────────────────

interface CatPillProps {
  cat: Category | { _id: 'all'; name: 'All'; nameHi: 'सभी' };
  selected: boolean;
  lang: 'en' | 'hi';
  onPress: () => void;
}

function CategoryPill({ cat, selected, lang, onPress }: CatPillProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const name = lang === 'hi' && 'nameHi' in cat && cat.nameHi ? cat.nameHi : cat.name;

  return (
    <Pressable
      onPressIn={() => { scale.value = 0.92; }}
      onPressOut={() => { scale.value = 1; }}
      onPress={onPress}
    >
      <Animated.View style={[styles.pill, selected && styles.pillActive, animStyle]}>
        {selected && (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        )}
        <Text style={[styles.pillText, selected && styles.pillTextActive]}>{name}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Store Closed Banner ──────────────────────────────────────────────────────

function StoreClosedBanner({ lang }: { lang: 'en' | 'hi' }) {
  return (
    <View style={styles.closedBanner}>
      <Text style={styles.closedIcon}>🌙</Text>
      <View>
        <Text style={styles.closedTitle}>{t('storeClosed', lang)}</Text>
        <Text style={styles.closedSub}>{t('storeClosedMsg', lang)}</Text>
      </View>
    </View>
  );
}

// ─── Main HomeScreen ──────────────────────────────────────────────────────────

export default function HomeScreen() {
  const nav = useNavigation<HomeScreenNavProp>();
  const insets = useSafeAreaInsets();
  const { user, isGuest } = useAuthStore();
  const { lang } = useLangStore();
  const getItemCount = useCartStore((s) => s.getItemCount);
  const openCart = useCartStore((s) => s.openCart);
  const cartCount = getItemCount();

  const [selectedCat, setSelectedCat] = React.useState<string>('all');
  const scrollY = useSharedValue(0);

  // Queries
  const { data: products = [], isLoading: productsLoading, refetch } = useQuery({
    queryKey: ['products', selectedCat],
    queryFn: () =>
      ProductAPI.getAll(selectedCat === 'all' ? undefined : selectedCat).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => ProductAPI.getCategories().then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => SettingsAPI.get().then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });

  
  const allCats: Array<Category | { _id: 'all'; name: string; nameHi: string }> = [
    { _id: 'all', name: 'All', nameHi: 'सभी' },
    ...categories,
  ];

  // Animated header
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => { scrollY.value = e.contentOffset.y; },
  });

  const headerBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [0, 1], Extrapolation.CLAMP),
  }));

  const greeting = getGreeting(lang);
  const displayName = user?.name?.split(' ')[0];

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={() => nav.navigate('ProductDetail', { productId: item._id })}
      />
    ),
    [nav]
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Sticky header bg (appears on scroll) */}
      <Animated.View
        style={[styles.headerBg, { paddingTop: insets.top }, headerBgStyle]}
        pointerEvents="none"
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + hp(16), paddingBottom: Layout.tabBarH + hp(80) },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={productsLoading}
            onRefresh={refetch}
            tintColor={Colors.accent}
            colors={[Colors.primary]}
          />
        }
      >
        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetText}>
              {greeting}{displayName ? `, ${displayName}` : ''}
            </Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>Bhagalpur, Bihar</Text>
            </View>
          </View>

          {/* Cart button */}
          <Pressable style={styles.cartBtn} onPress={openCart}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ── Search bar ───────────────────────────────────────────────────── */}
        <Pressable
          style={styles.searchBar}
          onPress={() => nav.navigate('Search' as any)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>{t('searchPlaceholder', lang)}</Text>
        </Pressable>

        {/* ── Store closed banner ──────────────────────────────────────────── */}
        {settings && !settings.storeOpen && <StoreClosedBanner lang={lang} />}

        {/* ── Mandi ticker ─────────────────────────────────────────────────── */}
        <MandiTicker />

        {/* ── Gold promo strip ─────────────────────────────────────────────── */}
        <Pressable
          style={styles.goldStrip}
          onPress={() => nav.navigate('Gold')}
        >
          <LinearGradient
            colors={['#2A1C00', '#1A1100', '#2A1C00']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.goldStripBorder} />
          <Text style={styles.goldStripEmoji}>👑</Text>
          <View style={styles.goldStripText}>
            <Text style={styles.goldStripTitle}>Farm Fresh Gold</Text>
            <Text style={styles.goldStripSub}>Priority delivery · Better prices</Text>
          </View>
          <Text style={styles.goldStripArrow}>›</Text>
        </Pressable>

        {/* ── Category pills ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {allCats.map((c) => (
              <CategoryPill
                key={c._id}
                cat={c as any}
                selected={selectedCat === c._id}
                lang={lang}
                onPress={() => setSelectedCat(c._id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Products grid ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCat === 'all' ? t('featuredTitle', lang) : categories.find((c) => c._id === selectedCat)?.name ?? ''}
            </Text>
            <Text style={styles.productCount}>{products.length} items</Text>
          </View>

          {productsLoading ? (
            <View style={styles.loadingGrid}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.skeletonCard} />
              ))}
            </View>
          ) : (
            <View style={styles.grid}>
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPress={() => nav.navigate('ProductDetail', { productId: product._id })}
                />
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* ── Floating cart bar (when items in cart) ────────────────────────── */}
      {cartCount > 0 && <FloatingCartBar count={cartCount} onPress={openCart} lang={lang} />}
    </View>
  );
}

// ─── Floating Cart Bar ────────────────────────────────────────────────────────

function FloatingCartBar({
  count,
  onPress,
  lang,
}: {
  count: number;
  onPress: () => void;
  lang: 'en' | 'hi';
}) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.floatingBar,
        { bottom: Layout.tabBarH + hp(60) + insets.bottom },
        animStyle,
      ]}
    >
      <Pressable
        style={styles.floatingBarInner}
        onPressIn={() => { scale.value = 0.96; }}
        onPressOut={() => { scale.value = 1; }}
        onPress={onPress}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <Text style={styles.floatingBarText}>🛒 {count} {count === 1 ? t('item', lang) : t('items', lang)}</Text>
        <Text style={styles.floatingBarAction}>{t('yourCart', lang)} →</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hp(90),
    backgroundColor: Colors.bg,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  scrollContent: {
    gap: hp(20),
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(16),
  },
  greetText: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(18),
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    marginTop: hp(2),
  },
  locationPin: { fontSize: fs(12) },
  locationText: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(12),
    color: Colors.textSecondary,
  },
  cartBtn: {
    width: wp(42),
    height: wp(42),
    backgroundColor: Colors.surface2,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cartIcon: { fontSize: fs(18) },
  cartBadge: {
    position: 'absolute',
    top: -hp(2),
    right: -wp(2),
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: wp(16),
    height: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(9),
    color: Colors.textInverse,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
    marginHorizontal: wp(16),
    backgroundColor: Colors.surface1,
    borderRadius: Radius.full,
    height: hp(44),
    paddingHorizontal: wp(16),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: fs(14), opacity: 0.6 },
  searchPlaceholder: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(14),
    color: Colors.textMuted,
  },

  // Closed banner
  closedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(12),
    marginHorizontal: wp(16),
    backgroundColor: Colors.surface2,
    borderRadius: Radius.lg,
    padding: wp(14),
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.2)',
  },
  closedIcon: { fontSize: fs(24) },
  closedTitle: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(14),
    color: Colors.error,
  },
  closedSub: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(12),
    color: Colors.textMuted,
    marginTop: hp(2),
  },

  // Gold strip
  goldStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(12),
    marginHorizontal: wp(16),
    borderRadius: Radius.lg,
    padding: wp(14),
    overflow: 'hidden',
  },
  goldStripBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(245,197,66,0.25)',
  },
  goldStripEmoji: { fontSize: fs(22) },
  goldStripText: { flex: 1 },
  goldStripTitle: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(14),
    color: Colors.gold,
  },
  goldStripSub: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(12),
    color: Colors.textMuted,
    marginTop: hp(2),
  },
  goldStripArrow: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(22),
    color: Colors.gold,
    opacity: 0.7,
  },

  // Section
  section: { gap: hp(12) },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(16),
  },
  sectionTitle: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(18),
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  productCount: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(12),
    color: Colors.textMuted,
  },

  // Category pills
  pillsRow: {
    paddingHorizontal: wp(16),
    gap: wp(8),
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(8),
    borderRadius: Radius.full,
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  pillActive: {
    borderColor: Colors.primary,
  },
  pillText: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(13),
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
    fontFamily: Font.outfit.semiBold,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: wp(16),
    gap: wp(10),
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: wp(16),
    gap: wp(10),
  },
  skeletonCard: {
    width: Layout.cardW,
    height: wp(200),
    backgroundColor: Colors.surface1,
    borderRadius: Radius.xl,
    opacity: 0.5,
  },

  // Floating cart bar
  floatingBar: {
    position: 'absolute',
    left: wp(16),
    right: wp(16),
    borderRadius: Radius.full,
    overflow: 'hidden',
    ...{
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
  },
  floatingBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp(52),
    paddingHorizontal: wp(20),
    borderRadius: Radius.full,
  },
  floatingBarText: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(14),
    color: Colors.white,
  },
  floatingBarAction: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(14),
    color: 'rgba(255,255,255,0.8)',
  },
});
