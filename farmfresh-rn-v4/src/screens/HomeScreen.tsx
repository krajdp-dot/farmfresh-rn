// ============================================================
// FARM FRESH RN v4 — HomeScreen
// MandiTicker · Category pills · Product grid · Neomorph cards
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors, Glass, Neomorph, Shadow, Font, Spacing, Radius, TextStyle,
} from '../theme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import {
  IconSearch, IconBell, IconLeaf, IconStar, IconCart,
  IconChevronRight, IconTomato, IconCarrot, IconMango,
  IconOnion, IconPotato, IconBanana, getProduceIcon,
} from '../components/icons';
import { MandiTicker } from '../components/MandiTicker';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/ProductCard';

const { width: W } = Dimensions.get('window');
const CARD_WIDTH = (W - Spacing.base * 2 - Spacing.md) / 2;

// ── Mock data (replace with API) ──────────────────────────
const CATEGORIES = [
  { id: '1', label: 'All', icon: null },
  { id: '2', label: 'Vegetables', icon: IconCarrot },
  { id: '3', label: 'Fruits', icon: IconMango },
  { id: '4', label: 'Leafy', icon: IconLeaf },
  { id: '5', label: 'Onion/Potato', icon: IconOnion },
  { id: '6', label: 'Exotic', icon: IconTomato },
];

const MOCK_PRODUCTS = [
  { id: '1', name: 'Fresh Tomato', price: 28, mandiPrice: 18, unit: '500g', tag: 'Picked Today', category: 'Vegetables', image: null, rating: 4.5, inStock: true },
  { id: '2', name: 'Alphonso Mango', price: 120, mandiPrice: 85, unit: '1kg', tag: 'Seasonal', category: 'Fruits', image: null, rating: 4.8, inStock: true },
  { id: '3', name: 'Red Onion', price: 35, mandiPrice: 22, unit: '1kg', tag: null, category: 'Onion/Potato', image: null, rating: 4.2, inStock: true },
  { id: '4', name: 'Banana', price: 45, mandiPrice: 30, unit: '1 dozen', tag: 'Fresh', category: 'Fruits', image: null, rating: 4.3, inStock: true },
  { id: '5', name: 'Spinach', price: 20, mandiPrice: 12, unit: '250g', tag: 'Picked Today', category: 'Leafy', image: null, rating: 4.6, inStock: false },
  { id: '6', name: 'Potato', price: 25, mandiPrice: 15, unit: '1kg', tag: null, category: 'Onion/Potato', image: null, rating: 4.0, inStock: true },
];

// ── Animated header ───────────────────────────────────────
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// ── Category Pill ─────────────────────────────────────────
interface CategoryPillProps {
  label: string;
  Icon: any;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryPill = ({ label, Icon, isSelected, onPress }: CategoryPillProps) => {
  return (
    <AnimatedPressable onPress={onPress} scaleDown={0.93}>
      <View style={[styles.categoryPill, isSelected && styles.categoryPillActive]}>
        {Icon && <Icon size={14} color={isSelected ? Colors.white : Colors.textSecondary} />}
        <Animated.Text style={[styles.categoryLabel, isSelected && styles.categoryLabelActive]}>
          {label}
        </Animated.Text>
      </View>
    </AnimatedPressable>
  );
};

// ── Hero greeting ─────────────────────────────────────────
const HeroGreeting = ({ scrollY }: { scrollY: Animated.SharedValue<number> }) => {
  const insets = useSafeAreaInsets();

  const heroStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [1, 0], Extrapolation.CLAMP),
    transform: [{
      translateY: interpolate(scrollY.value, [0, 80], [0, -20], Extrapolation.CLAMP),
    }],
  }));

  return (
    <Animated.View style={[styles.hero, { paddingTop: insets.top + Spacing.sm }, heroStyle]}>
      <View style={styles.heroLeft}>
        <Animated.Text style={styles.heroGreeting}>Good morning 🌱</Animated.Text>
        <Animated.Text style={styles.heroTitle}>What's fresh{'\n'}from mandi today?</Animated.Text>
      </View>
      <View style={styles.heroActions}>
        <AnimatedPressable scaleDown={0.9} style={styles.iconBtn}>
          <View style={styles.iconBtnInner}>
            <IconBell size={20} color={Colors.textOnDark} />
          </View>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
};

// ── Sticky search bar ─────────────────────────────────────
const StickySearch = ({
  scrollY,
  onPress,
}: {
  scrollY: Animated.SharedValue<number>;
  onPress: () => void;
}) => {
  const insets = useSafeAreaInsets();

  const stickyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [60, 100], [0, 1], Extrapolation.CLAMP),
    transform: [{
      translateY: interpolate(scrollY.value, [60, 100], [-10, 0], Extrapolation.CLAMP),
    }],
  }));

  return (
    <Animated.View style={[styles.stickyBar, { top: insets.top }, stickyStyle]}>
      <AnimatedPressable onPress={onPress} style={styles.searchBarSticky} scaleDown={0.98}>
        <IconSearch size={16} color={Colors.textMuted} />
        <Animated.Text style={styles.searchPlaceholder}>Search produce…</Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
};

// ── Section header ────────────────────────────────────────
const SectionHeader = ({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Animated.Text style={styles.sectionTitle}>{title}</Animated.Text>
    {onSeeAll && (
      <AnimatedPressable onPress={onSeeAll} scaleDown={0.92}>
        <View style={styles.seeAllRow}>
          <Animated.Text style={styles.seeAll}>See all</Animated.Text>
          <IconChevronRight size={14} color={Colors.brandGreen} strokeWidth={2.5} />
        </View>
      </AnimatedPressable>
    )}
  </View>
);

// ── Gold banner ───────────────────────────────────────────
const GoldBanner = ({ onPress }: { onPress: () => void }) => (
  <AnimatedPressable onPress={onPress} style={styles.goldBannerWrap} scaleDown={0.97}>
    <LinearGradient
      colors={['#1A1200', '#2D2000', '#1A1200']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.goldBanner}
    >
      <View style={styles.goldLeft}>
        <Animated.Text style={styles.goldTitle}>🌟 Farm Fresh Gold</Animated.Text>
        <Animated.Text style={styles.goldSub}>Free delivery · Priority stock · ₹39/month</Animated.Text>
      </View>
      <View style={styles.goldPill}>
        <Animated.Text style={styles.goldPillText}>Try</Animated.Text>
      </View>
    </LinearGradient>
  </AnimatedPressable>
);

// ── Main Screen ───────────────────────────────────────────
interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const filteredProducts = selectedCategory === '1'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => {
        const cat = CATEGORIES.find(c => c.id === selectedCategory);
        return cat ? p.category === cat.label : true;
      });

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  }, []);

  const renderProduct = useCallback(({ item, index }: { item: any; index: number }) => (
    <ProductCard
      product={item}
      width={CARD_WIDTH}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      index={index}
    />
  ), [navigation]);

  const ListHeader = useCallback(() => (
    <View>
      {/* Hero */}
      <HeroGreeting scrollY={scrollY} />

      {/* Search bar (inline, collapses to sticky) */}
      <AnimatedPressable
        onPress={() => navigation.navigate('Search')}
        style={styles.searchBarWrap}
        scaleDown={0.98}
      >
        <View style={styles.searchBar}>
          <IconSearch size={18} color={Colors.textMuted} />
          <Animated.Text style={styles.searchPlaceholder}>
            Search tomatoes, mangoes…
          </Animated.Text>
          <View style={styles.searchKbd}>
            <Animated.Text style={styles.searchKbdText}>⌕</Animated.Text>
          </View>
        </View>
      </AnimatedPressable>

      {/* Mandi Ticker */}
      <MandiTicker style={styles.ticker} />

      {/* Gold Banner */}
      <GoldBanner onPress={() => navigation.navigate('Gold')} />

      {/* Category pills */}
      <SectionHeader title="Browse" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.id}
            label={cat.label}
            Icon={cat.icon}
            isSelected={selectedCategory === cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* Products header */}
      <SectionHeader
        title={selectedCategory === '1' ? 'All Produce' : CATEGORIES.find(c => c.id === selectedCategory)?.label ?? ''}
        onSeeAll={() => navigation.navigate('Categories')}
      />
    </View>
  ), [scrollY, selectedCategory, navigation]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      {/* Dark top zone for hero */}
      <LinearGradient
        colors={[Colors.bgDark, Colors.bgDark, Colors.bgSecondary]}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Sticky search (appears on scroll) */}
      <StickySearch scrollY={scrollY} onPress={() => navigation.navigate('Search')} />

      {/* Main list */}
      <AnimatedFlatList
        data={filteredProducts}
        keyExtractor={(item: any) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Animated.Text style={styles.emptyText}>No produce in this category yet</Animated.Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.logoGreen}
            colors={[Colors.brandGreen]}
          />
        }
      />
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  listContent: {
    paddingBottom: 120, // space for bottom nav
  },

  // ── Hero ────────────────────────────────────────────────
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
  },
  heroLeft: { flex: 1 },
  heroGreeting: {
    fontFamily: Font.jakartaMedium,
    fontSize: 13,
    color: Colors.textOnDarkMuted,
    marginBottom: 6,
  },
  heroTitle: {
    fontFamily: Font.outfitBold,
    fontSize: 26,
    color: Colors.textOnDark,
    lineHeight: 34,
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: 4,
  },
  iconBtn: {},
  iconBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    ...Glass.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Search ──────────────────────────────────────────────
  searchBarWrap: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    height: 46,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: Font.jakartaRegular,
    fontSize: 14,
    color: Colors.textOnDarkSubtle,
  },
  searchKbd: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchKbdText: {
    fontFamily: Font.jakartaRegular,
    fontSize: 16,
    color: Colors.textOnDarkSubtle,
  },

  // ── Sticky search ────────────────────────────────────────
  stickyBar: {
    position: 'absolute',
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 20,
    paddingBottom: Spacing.sm,
  },
  searchBarSticky: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(10,26,15,0.92)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    height: 44,
  },

  // ── Ticker ──────────────────────────────────────────────
  ticker: {
    marginBottom: Spacing.md,
  },

  // ── Gold Banner ─────────────────────────────────────────
  goldBannerWrap: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,200,0,0.2)',
  },
  goldBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  goldLeft: { flex: 1 },
  goldTitle: {
    fontFamily: Font.outfitSemiBold,
    fontSize: 15,
    color: '#FFD166',
    marginBottom: 3,
  },
  goldSub: {
    fontFamily: Font.jakartaRegular,
    fontSize: 12,
    color: 'rgba(255,209,102,0.6)',
  },
  goldPill: {
    backgroundColor: '#FFD166',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  goldPillText: {
    fontFamily: Font.outfitSemiBold,
    fontSize: 13,
    color: '#1A1200',
  },

  // ── Categories ──────────────────────────────────────────
  categoryScroll: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  categoryPillActive: {
    backgroundColor: Colors.brandGreen,
    borderColor: Colors.brandGreen,
  },
  categoryLabel: {
    fontFamily: Font.jakartaMedium,
    fontSize: 13,
    color: Colors.textOnDarkMuted,
  },
  categoryLabelActive: {
    color: Colors.white,
  },

  // ── Section header ───────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontFamily: Font.outfitSemiBold,
    fontSize: 18,
    color: Colors.textOnDark,
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAll: {
    fontFamily: Font.jakartaMedium,
    fontSize: 13,
    color: Colors.brandGreen,
  },

  // ── Product grid ────────────────────────────────────────
  row: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  emptyWrap: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Font.jakartaRegular,
    fontSize: 14,
    color: Colors.textOnDarkMuted,
  },
});
