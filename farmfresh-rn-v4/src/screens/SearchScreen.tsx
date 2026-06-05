// ============================================================
// FARM FRESH RN v4 — SearchScreen
// Live filter · Recent searches · Empty state · Dark glass
// ============================================================

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Glass, Font, Spacing, Radius } from '../theme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { ProductCard } from '../components/ProductCard';
import {
  IconSearch, IconClose, IconChevronRight, IconLeaf,
  IconFilter,
} from '../components/icons';

const { width: W } = Dimensions.get('window');
const CARD_WIDTH = (W - Spacing.base * 2 - Spacing.md) / 2;

// ── Mock data ─────────────────────────────────────────────
const ALL_PRODUCTS = [
  { id: '1', name: 'Fresh Tomato',    price: 28,  mandiPrice: 18, unit: '500g',   tag: 'Picked Today', category: 'Vegetables',   image: null, rating: 4.5, inStock: true  },
  { id: '2', name: 'Alphonso Mango',  price: 120, mandiPrice: 85, unit: '1kg',    tag: 'Seasonal',     category: 'Fruits',       image: null, rating: 4.8, inStock: true  },
  { id: '3', name: 'Red Onion',       price: 35,  mandiPrice: 22, unit: '1kg',    tag: null,           category: 'Onion/Potato', image: null, rating: 4.2, inStock: true  },
  { id: '4', name: 'Banana',          price: 45,  mandiPrice: 30, unit: '1 dozen',tag: 'Fresh',        category: 'Fruits',       image: null, rating: 4.3, inStock: true  },
  { id: '5', name: 'Spinach',         price: 20,  mandiPrice: 12, unit: '250g',   tag: 'Picked Today', category: 'Leafy',        image: null, rating: 4.6, inStock: false },
  { id: '6', name: 'Potato',          price: 25,  mandiPrice: 15, unit: '1kg',    tag: null,           category: 'Onion/Potato', image: null, rating: 4.0, inStock: true  },
  { id: '7', name: 'Carrot',          price: 30,  mandiPrice: 20, unit: '500g',   tag: null,           category: 'Vegetables',   image: null, rating: 4.1, inStock: true  },
  { id: '8', name: 'Capsicum',        price: 40,  mandiPrice: 28, unit: '250g',   tag: null,           category: 'Vegetables',   image: null, rating: 4.3, inStock: true  },
];

const RECENT_SEARCHES = ['Tomato', 'Mango', 'Leafy greens', 'Onion'];

const QUICK_CHIPS = ['Vegetables', 'Fruits', 'Leafy', 'Picked Today', 'In Stock'];

// ── Recent search chip ────────────────────────────────────
const RecentChip = ({
  label,
  onPress,
  onRemove,
}: {
  label: string;
  onPress: () => void;
  onRemove: () => void;
}) => (
  <Animated.View
    entering={FadeIn.duration(200)}
    exiting={FadeOut.duration(150)}
    layout={Layout.springify()}
    style={styles.recentChip}
  >
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.recentChipLabel}>
      <IconSearch size={12} color={Colors.textOnDarkMuted} />
      <Animated.Text style={styles.recentChipText}>{label}</Animated.Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={styles.recentChipRemove}>
      <IconClose size={12} color={Colors.textOnDarkSubtle} strokeWidth={2} />
    </TouchableOpacity>
  </Animated.View>
);

// ── Quick filter chip ─────────────────────────────────────
const QuickChip = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <AnimatedPressable onPress={onPress} scaleDown={0.93}>
    <View style={[styles.quickChip, isActive && styles.quickChipActive]}>
      <Animated.Text style={[styles.quickChipText, isActive && styles.quickChipTextActive]}>
        {label}
      </Animated.Text>
    </View>
  </AnimatedPressable>
);

// ── Empty state ───────────────────────────────────────────
const EmptyState = ({ query }: { query: string }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { damping: 14, stiffness: 100 });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.emptyState, style]}>
      <IconLeaf size={40} color={Colors.borderGlass} strokeWidth={1.5} />
      <Animated.Text style={styles.emptyTitle}>
        Nothing found for "{query}"
      </Animated.Text>
      <Animated.Text style={styles.emptySubtext}>
        Try a different name or browse categories
      </Animated.Text>
    </Animated.View>
  );
};

// ── Main Screen ───────────────────────────────────────────
interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen = ({ navigation }: SearchScreenProps) => {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof ALL_PRODUCTS>([]);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // ── Animation values ────────────────────────────────────
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-12);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 320 });
    headerTranslateY.value = withSpring(0, { damping: 16, stiffness: 120 });
    contentOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    // Auto-focus
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  // ── Live search ──────────────────────────────────────────
  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    const q = text.toLowerCase();
    const filtered = ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    const withFilter = activeFilter
      ? filtered.filter(p =>
          activeFilter === 'In Stock' ? p.inStock :
          activeFilter === 'Picked Today' ? p.tag === 'Picked Today' :
          p.category === activeFilter
        )
      : filtered;
    setResults(withFilter);
  }, [activeFilter]);

  const handleFilterToggle = useCallback((label: string) => {
    const next = activeFilter === label ? null : label;
    setActiveFilter(next);
    if (query.trim()) {
      const q = query.toLowerCase();
      const filtered = ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
      const withFilter = next
        ? filtered.filter(p =>
            next === 'In Stock' ? p.inStock :
            next === 'Picked Today' ? p.tag === 'Picked Today' :
            p.category === next
          )
        : filtered;
      setResults(withFilter);
    }
  }, [activeFilter, query]);

  const handleRecentTap = useCallback((term: string) => {
    setQuery(term);
    handleSearch(term);
  }, [handleSearch]);

  const handleRemoveRecent = useCallback((term: string) => {
    setRecentSearches(prev => prev.filter(r => r !== term));
  }, []);

  const handleSubmit = useCallback(() => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev].slice(0, 6));
    }
    Keyboard.dismiss();
  }, [query, recentSearches]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  }, []);

  // ── Animated styles ──────────────────────────────────────
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const showEmpty = hasSearched && results.length === 0;
  const showResults = hasSearched && results.length > 0;
  const showIdle = !hasSearched;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      {/* ── Search bar ──────────────────────────────── */}
      <Animated.View style={[styles.searchRow, headerStyle]}>
        <AnimatedPressable onPress={() => navigation.goBack()} scaleDown={0.88}>
          <View style={styles.backBtn}>
            <IconClose size={18} color={Colors.textOnDark} strokeWidth={2} />
          </View>
        </AnimatedPressable>

        <View style={styles.inputWrap}>
          <IconSearch size={16} color={Colors.textMuted} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={handleSearch}
            onSubmitEditing={handleSubmit}
            placeholder="Search produce, category…"
            placeholderTextColor={Colors.textOnDarkSubtle}
            returnKeyType="search"
            selectionColor={Colors.logoGreen}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
              <IconClose size={14} color={Colors.textOnDarkMuted} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {/* Result count badge */}
        {showResults && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={styles.countBadge}
          >
            <Animated.Text style={styles.countText}>{results.length}</Animated.Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* ── Quick filters ────────────────────────────── */}
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={[styles.filtersScroll, headerStyle]}
      >
        {QUICK_CHIPS.map(chip => (
          <QuickChip
            key={chip}
            label={chip}
            isActive={activeFilter === chip}
            onPress={() => handleFilterToggle(chip)}
          />
        ))}
      </Animated.ScrollView>

      {/* ── Body ─────────────────────────────────────── */}
      <Animated.View style={[styles.body, contentStyle]}>

        {/* Idle state — recent searches */}
        {showIdle && (
          <View style={styles.section}>
            {recentSearches.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Animated.Text style={styles.sectionTitle}>Recent</Animated.Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Animated.Text style={styles.clearAll}>Clear all</Animated.Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.chipWrap}>
                  {recentSearches.map(term => (
                    <RecentChip
                      key={term}
                      label={term}
                      onPress={() => handleRecentTap(term)}
                      onRemove={() => handleRemoveRecent(term)}
                    />
                  ))}
                </View>
              </>
            )}

            <View style={styles.sectionHeader}>
              <Animated.Text style={styles.sectionTitle}>Popular</Animated.Text>
            </View>
            <View style={styles.chipWrap}>
              {['Tomato', 'Mango', 'Onion', 'Spinach', 'Banana', 'Carrot'].map(term => (
                <TouchableOpacity
                  key={term}
                  onPress={() => handleRecentTap(term)}
                  activeOpacity={0.7}
                  style={styles.popularChip}
                >
                  <Animated.Text style={styles.popularChipText}>{term}</Animated.Text>
                  <IconChevronRight size={12} color={Colors.brandGreen} strokeWidth={2.5} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Empty state */}
        {showEmpty && <EmptyState query={query} />}

        {/* Results grid */}
        {showResults && (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <ProductCard
                product={item}
                width={CARD_WIDTH}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                index={index}
              />
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },

  // ── Search bar ──────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
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
  input: {
    flex: 1,
    fontFamily: Font.jakartaMedium,
    fontSize: 15,
    color: Colors.textOnDark,
    paddingVertical: 0,
    height: '100%',
  },
  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: Font.outfitBold,
    fontSize: 13,
    color: Colors.white,
  },

  // ── Filters ──────────────────────────────────────────────
  filtersScroll: {
    maxHeight: 44,
    marginBottom: Spacing.sm,
  },
  filtersRow: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  quickChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  quickChipActive: {
    backgroundColor: Colors.brandGreen,
    borderColor: Colors.brandGreen,
  },
  quickChipText: {
    fontFamily: Font.jakartaMedium,
    fontSize: 12,
    color: Colors.textOnDarkMuted,
  },
  quickChipTextActive: {
    color: Colors.white,
  },

  // ── Body ─────────────────────────────────────────────────
  body: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Font.outfitSemiBold,
    fontSize: 16,
    color: Colors.textOnDark,
  },
  clearAll: {
    fontFamily: Font.jakartaMedium,
    fontSize: 12,
    color: Colors.error,
  },

  // ── Chips ─────────────────────────────────────────────────
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  recentChipLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
  },
  recentChipText: {
    fontFamily: Font.jakartaMedium,
    fontSize: 13,
    color: Colors.textOnDarkMuted,
  },
  recentChipRemove: {
    paddingVertical: 7,
    paddingHorizontal: Spacing.sm,
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(45,138,78,0.10)',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Radius.sm,
  },
  popularChipText: {
    fontFamily: Font.jakartaMedium,
    fontSize: 13,
    color: Colors.brandGreen,
  },

  // ── Grid ─────────────────────────────────────────────────
  gridContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 120,
    paddingTop: Spacing.sm,
  },
  row: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  // ── Empty ─────────────────────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: Font.outfitSemiBold,
    fontSize: 18,
    color: Colors.textOnDark,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: Font.jakartaRegular,
    fontSize: 14,
    color: Colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
