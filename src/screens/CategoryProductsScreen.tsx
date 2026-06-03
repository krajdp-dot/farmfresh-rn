import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Colors, Font, fs, wp, hp, Layout } from '../theme';
import { ProductAPI } from '../api/client';
import { useLangStore } from '../stores/stores';
import ProductCard from '../components/ui/ProductCard';
import type { CategoryProductsRouteProp } from '../navigation/types';

export default function CategoryProductsScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const route = useRoute<CategoryProductsRouteProp>();
  const { categoryId, categoryName } = route.params;
  const { lang } = useLangStore();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => ProductAPI.getAll(categoryId).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <View style={[s.root, { paddingTop: insets.top + hp(12) }]}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => nav.goBack()}>
          <Text style={s.backText}>‹</Text>
        </Pressable>
        <Text style={s.title}>{categoryName}</Text>
        <View style={{ width: wp(32) }} />
      </View>
      <FlatList
        data={isLoading ? Array(6).fill(null) : products}
        keyExtractor={(item, i) => item?._id ?? String(i)}
        numColumns={2}
        contentContainerStyle={s.grid}
        renderItem={({ item }) =>
          item
            ? <ProductCard product={item} onPress={() => nav.navigate('ProductDetail', { productId: item._id })} />
            : <View style={{ width: Layout.cardW, height: 220, backgroundColor: Colors.surface1, borderRadius: 20, opacity: 0.5 }} />
        }
        ItemSeparatorComponent={() => <View style={{ height: wp(10) }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(16), marginBottom: hp(12) },
  back: { width: wp(32), height: wp(32), alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: Font.outfit.bold, fontSize: fs(26), color: Colors.textPrimary },
  title: { flex: 1, fontFamily: Font.outfit.bold, fontSize: fs(20), color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.3 },
  grid: { paddingHorizontal: wp(16), paddingBottom: hp(100) },
});
