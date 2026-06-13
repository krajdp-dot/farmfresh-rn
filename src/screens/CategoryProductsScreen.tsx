import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import AnimatedPressable from '../components/AnimatedPressable';
import ProductCard from '../components/ProductCard';
import { spacing, radius, SCREEN_WIDTH } from '../theme/tokens';

const ALL_PRODUCTS = [
  { id: 'p1',  name: 'Fresh Tomatoes',  nameHi: 'ताज़े टमाटर',  price: 25, mandiPrice: 18, unit: '1 kg',   image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400' },
  { id: 'p2',  name: 'Potatoes',        nameHi: 'आलू',           price: 22, mandiPrice: 15, unit: '1 kg',   image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400' },
  { id: 'p3',  name: 'Onions',          nameHi: 'प्याज़',        price: 28, mandiPrice: 20, unit: '1 kg',   image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400' },
  { id: 'p4',  name: 'Cauliflower',     nameHi: 'फूलगोभी',      price: 35, mandiPrice: 25, unit: '1 piece',image: 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=400' },
  { id: 'p5',  name: 'Spinach',         nameHi: 'पालक',          price: 18, mandiPrice: 12, unit: '500g',   image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
  { id: 'p6',  name: 'Bitter Gourd',    nameHi: 'करेला',         price: 42, mandiPrice: 30, unit: '500g',   image: 'https://images.unsplash.com/photo-1571086430599-65c4a5ad13c1?w=400' },
  { id: 'p7',  name: 'Ginger',          nameHi: 'अदरक',          price: 80, mandiPrice: 60, unit: '250g',   image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400' },
  { id: 'p8',  name: 'Garlic',          nameHi: 'लहसुन',         price: 100,mandiPrice: 80, unit: '250g',   image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400' },
];

type SortKey = 'default' | 'price_low' | 'price_high' | 'savings' | 'new';

const SORT_OPTIONS: { key: SortKey; label: string; labelHi: string; icon: string }[] = [
  { key: 'default',    label: 'Default',     labelHi: 'डिफ़ॉल्ट',  icon: '⚡' },
  { key: 'price_low',  label: 'Price ↑',     labelHi: 'कम भाव',    icon: '📉' },
  { key: 'price_high', label: 'Price ↓',     labelHi: 'ज़्यादा भाव',icon: '📈' },
  { key: 'savings',    label: 'Best Savings', labelHi: 'बेस्ट बचत', icon: '💰' },
];

interface Props {
  category: { name: string; nameHi: string; image?: string; emoji?: string; count?: number };
  onProductPress: (p: any) => void;
  onBack: () => void;
}

const CategoryProductsScreen: React.FC<Props> = ({ category, onProductPress, onBack }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const insets = useSafeAreaInsets();
  const [sort, setSort] = useState<SortKey>('default');
  const [showMandi, setShowMandi] = useState(true);

  const boldFont = isHindi ? 'Baloo2-Bold' : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular' : 'Outfit-Regular';
  const semiBold = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont  = isHindi ? 'Baloo2-Medium' : 'Outfit-Medium';

  const getSorted = () => {
    const list = [...ALL_PRODUCTS];
    if (sort === 'price_low')  return list.sort((a, b) => a.price - b.price);
    if (sort === 'price_high') return list.sort((a, b) => b.price - a.price);
    if (sort === 'savings')    return list.sort((a, b) => (b.mandiPrice! - b.price) - (a.mandiPrice! - a.price));
    return list;
  };

  const totalSavings = ALL_PRODUCTS.reduce((sum, p) => sum + (p.mandiPrice - p.price), 0);
  const avgSavings = Math.round(totalSavings / ALL_PRODUCTS.length);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <AnimatedPressable onPress={onBack} scale={0.9}>
            <View style={[styles.backBtn, { backgroundColor: colors.bgSecondary }]}>
              <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
            </View>
          </AnimatedPressable>
          <View style={styles.headerText}>
            <Text style={[styles.catName, { color: colors.text, fontFamily: boldFont }]}>
              {category.emoji ? `${category.emoji} ` : ''}
              {isHindi ? category.nameHi : category.name}
            </Text>
            <Text style={[styles.catCount, { color: colors.textMuted, fontFamily: bodyFont }]}>
              {ALL_PRODUCTS.length} {isHindi ? 'उत्पाद' : 'products'} · {isHindi ? `औसत ₹${avgSavings} बचत` : `avg ₹${avgSavings} savings`}
            </Text>
          </View>
          {/* Mandi toggle */}
          <TouchableOpacity
            onPress={() => setShowMandi(!showMandi)}
            activeOpacity={0.8}
          >
            <View style={[styles.mandiToggle, {
              backgroundColor: showMandi ? colors.mandiStrip : colors.bgSecondary,
              borderColor: showMandi ? colors.mandiBorder : colors.border,
            }]}>
              <Text style={styles.mandiToggleIcon}>📊</Text>
              <Text style={[styles.mandiToggleText, {
                color: showMandi ? colors.mandiText : colors.textMuted,
                fontFamily: semiBold,
              }]}>
                {isHindi ? 'मंडी' : 'Mandi'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sort chips */}
        <FlatList
          data={SORT_OPTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.key}
          contentContainerStyle={styles.sortList}
          renderItem={({ item }) => {
            const active = sort === item.key;
            return (
              <TouchableOpacity onPress={() => setSort(item.key)} activeOpacity={0.8}>
                <View style={[
                  styles.sortChip,
                  {
                    backgroundColor: active ? colors.primary : colors.bgSecondary,
                    borderColor: active ? colors.primary : colors.border,
                  }
                ]}>
                  <Text style={styles.sortChipIcon}>{item.icon}</Text>
                  <Text style={[styles.sortChipText, {
                    color: active ? '#fff' : colors.textSecondary,
                    fontFamily: active ? semiBold : bodyFont,
                  }]}>
                    {isHindi ? item.labelHi : item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Savings banner */}
      {showMandi && (
        <View style={[styles.savingsBanner, { backgroundColor: colors.mandiStrip, borderBottomColor: colors.mandiBorder }]}>
          <Text style={[styles.savingsBannerText, { color: colors.mandiText, fontFamily: medFont }]}>
            💰 {isHindi
              ? `${category.nameHi} में मंडी भाव से औसत ₹${avgSavings}/kg बचत`
              : `Avg ₹${avgSavings}/kg savings vs Mandi in ${category.name}`}
          </Text>
        </View>
      )}

      <FlatList
        data={getSorted()}
        keyExtractor={i => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={[styles.allLoaded, { borderColor: colors.border }]}>
            <Text style={[styles.allLoadedText, { color: colors.textMuted, fontFamily: bodyFont }]}>
              ✓ {isHindi ? 'सभी उत्पाद दिखाए गए' : 'All products shown'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard {...item} onPress={() => onProductPress(item)} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1, gap: 0 },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20 },
  headerText: { flex: 1 },
  catName: { fontSize: 18 },
  catCount: { fontSize: 12, marginTop: 1 },
  mandiToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  mandiToggleIcon: { fontSize: 13 },
  mandiToggleText: { fontSize: 12 },
  sortList: { paddingHorizontal: 16, paddingBottom: 10, paddingTop: 2, gap: 8 },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  sortChipIcon: { fontSize: 13 },
  sortChipText: { fontSize: 13 },
  savingsBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  savingsBannerText: { fontSize: 12 },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  row: { gap: 12 },
  allLoaded: {
    borderTopWidth: 1,
    paddingTop: 16,
    alignItems: 'center',
  },
  allLoadedText: { fontSize: 13 },
});

export default CategoryProductsScreen;
