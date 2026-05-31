import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Colors, Font, fs, wp, hp, Radius } from '../theme';
import { ProductAPI, type Product } from '../api/client';
import { useLangStore } from '../stores/stores';
import { t } from '../i18n';
import ProductCard from '../components/ui/ProductCard';

const TRENDING = ['Tomato', 'Potato', 'Onion', 'Mango', 'Banana', 'Leafy Greens'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { lang } = useLangStore();
  const [query, setQuery] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['search', debouncedQ],
    queryFn: () => ProductAPI.getAll().then((r) =>
      r.data.filter((p) => {
        const q = debouncedQ.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.nameHi ?? '').includes(q);
      })
    ),
    enabled: debouncedQ.length > 1,
    staleTime: 2 * 60 * 1000,
  });

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => nav.navigate('Home', { screen: 'ProductDetail', params: { productId: item._id } })}
    />
  ), [nav]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + hp(12) }]}>
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder={t('searchPlaceholder', lang)}
            placeholderTextColor={Colors.textMuted}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {debouncedQ.length < 2 && (
        <Animated.View entering={FadeIn} style={styles.trendingSection}>
          <Text style={styles.trendingTitle}>Trending</Text>
          <View style={styles.trendingPills}>
            {TRENDING.map((item) => (
              <Pressable
                key={item}
                style={styles.trendingPill}
                onPress={() => { setQuery(item); inputRef.current?.focus(); }}
              >
                <Text style={styles.trendingPillText}>🔥 {item}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {debouncedQ.length >= 2 && (
        <View style={styles.resultsWrap}>
          {isFetching ? (
            <Text style={styles.searchingText}>Searching...</Text>
          ) : results.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsEmoji}>🔍</Text>
              <Text style={styles.noResultsText}>No results for "{debouncedQ}"</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(p) => p._id}
              numColumns={2}
              contentContainerStyle={styles.grid}
              ItemSeparatorComponent={() => <View style={{ height: wp(10) }} />}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  searchWrap: { paddingHorizontal: wp(16), marginBottom: hp(16) },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
    backgroundColor: Colors.surface1,
    borderRadius: Radius.full,
    height: hp(48),
    paddingHorizontal: wp(16),
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  searchIcon: { fontSize: fs(14) },
  input: {
    flex: 1,
    fontFamily: Font.outfit.regular,
    fontSize: fs(15),
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: { padding: wp(4) },
  clearText: { fontSize: fs(12), color: Colors.textMuted },
  trendingSection: { paddingHorizontal: wp(16), gap: hp(12) },
  trendingTitle: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(17),
    color: Colors.textPrimary,
  },
  trendingPills: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(8) },
  trendingPill: {
    paddingHorizontal: wp(12),
    paddingVertical: hp(8),
    backgroundColor: Colors.surface1,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trendingPillText: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(13),
    color: Colors.textSecondary,
  },
  resultsWrap: { flex: 1 },
  searchingText: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(14),
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: hp(40),
  },
  noResults: { alignItems: 'center', marginTop: hp(60), gap: hp(10) },
  noResultsEmoji: { fontSize: fs(40) },
  noResultsText: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(15),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  grid: { paddingHorizontal: wp(16), paddingBottom: hp(100) },
});
