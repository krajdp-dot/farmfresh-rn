// ============================================================
// FARM FRESH RN v4 — CategoryProductsScreen
// Filtered product grid · Sort bar · Animated header
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, StyleSheet, Dimensions, StatusBar, ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedScrollHandler,
  withSpring, withTiming, interpolate, Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Spacing, Radius, Glass } from '../theme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { ProductCard } from '../components/ProductCard';
import { IconChevronLeft, IconFilter } from '../components/icons';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing.base * 2 - Spacing.md) / 2;
const AnimatedFlatList = Animated.createAnimatedComponent(require('react-native').FlatList);

const ALL_PRODUCTS = [
  { id: '1', name: 'Fresh Tomato',   price: 28,  mandiPrice: 18, unit: '500g',    tag: 'Picked Today', category: 'Vegetables',   image: null, rating: 4.5, inStock: true  },
  { id: '7', name: 'Carrot',         price: 30,  mandiPrice: 20, unit: '500g',    tag: null,           category: 'Vegetables',   image: null, rating: 4.1, inStock: true  },
  { id: '8', name: 'Capsicum',       price: 40,  mandiPrice: 28, unit: '250g',    tag: null,           category: 'Vegetables',   image: null, rating: 4.3, inStock: true  },
  { id: '2', name: 'Alphonso Mango', price: 120, mandiPrice: 85, unit: '1kg',     tag: 'Seasonal',     category: 'Fruits',       image: null, rating: 4.8, inStock: true  },
  { id: '4', name: 'Banana',         price: 45,  mandiPrice: 30, unit: '1 dozen', tag: 'Fresh',        category: 'Fruits',       image: null, rating: 4.3, inStock: true  },
  { id: '3', name: 'Red Onion',      price: 35,  mandiPrice: 22, unit: '1kg',     tag: null,           category: 'Onion/Potato', image: null, rating: 4.2, inStock: true  },
  { id: '6', name: 'Potato',         price: 25,  mandiPrice: 15, unit: '1kg',     tag: null,           category: 'Onion/Potato', image: null, rating: 4.0, inStock: true  },
  { id: '5', name: 'Spinach',        price: 20,  mandiPrice: 12, unit: '250g',    tag: 'Picked Today', category: 'Leafy Greens', image: null, rating: 4.6, inStock: false },
];

const SORT_OPTIONS = ['Default', 'Price: Low', 'Price: High', 'Rating'];

export const CategoryProductsScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { category } = route.params;
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [sortBy, setSortBy] = useState('Default');

  const products = useMemo(() => {
    const filtered = ALL_PRODUCTS.filter(p => p.category === category);
    if (sortBy === 'Price: Low') return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High') return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === 'Rating') return [...filtered].sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [category, sortBy]);

  const scrollHandler = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });

  const headerBg = useAnimatedStyle(() => ({
    backgroundColor: `rgba(10,26,15,${interpolate(scrollY.value, [0, 60], [0, 0.97], Extrapolation.CLAMP)})`,
  }));

  const titleScale = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, [0, 60], [1, 0.88], Extrapolation.CLAMP) }],
    opacity: interpolate(scrollY.value, [0, 40], [1, 0.7], Extrapolation.CLAMP),
  }));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <LinearGradient colors={[Colors.bgDark, Colors.bgSecondary]} style={StyleSheet.absoluteFill} />

      {/* Sticky header */}
      <Animated.View style={[styles.stickyHeader, headerBg]}>
        <AnimatedPressable onPress={() => navigation.goBack()} scaleDown={0.88}>
          <View style={styles.backBtn}>
            <IconChevronLeft size={20} color={Colors.textOnDark} strokeWidth={2.2} />
          </View>
        </AnimatedPressable>
        <Animated.Text style={[styles.headerTitle, titleScale]}>{category}</Animated.Text>
        <View style={styles.countPill}>
          <Animated.Text style={styles.countText}>{products.length}</Animated.Text>
        </View>
      </Animated.View>

      {/* Sort bar */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortRow}
        style={styles.sortScroll}
      >
        {SORT_OPTIONS.map(opt => (
          <AnimatedPressable key={opt} onPress={() => setSortBy(opt)} scaleDown={0.92}>
            <View style={[styles.sortChip, sortBy === opt && styles.sortChipActive]}>
              <Animated.Text style={[styles.sortText, sortBy === opt && styles.sortTextActive]}>
                {opt}
              </Animated.Text>
            </View>
          </AnimatedPressable>
        ))}
      </ScrollView>

      {/* Grid */}
      <AnimatedFlatList
        data={products}
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }: any) => (
          <ProductCard
            product={item}
            width={CARD_W}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            index={index}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Animated.Text style={styles.emptyText}>No items in {category} yet</Animated.Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDark },
  stickyHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: Colors.borderGlass,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, fontFamily: Font.outfitBold, fontSize: 22, color: Colors.textOnDark,
  },
  countPill: {
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    backgroundColor: 'rgba(45,138,78,0.2)',
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderLight,
  },
  countText: { fontFamily: Font.outfitSemiBold, fontSize: 13, color: Colors.brandGreen },
  sortScroll: { maxHeight: 48 },
  sortRow: { paddingHorizontal: Spacing.base, gap: Spacing.sm, alignItems: 'center' },
  sortChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: Colors.borderGlass,
  },
  sortChipActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  sortText: { fontFamily: Font.jakartaMedium, fontSize: 12, color: Colors.textOnDarkMuted },
  sortTextActive: { color: Colors.white },
  grid: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: 120 },
  row: { gap: Spacing.md, marginBottom: Spacing.md },
  empty: { padding: Spacing.xxxl, alignItems: 'center' },
  emptyText: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.textOnDarkMuted },
});
