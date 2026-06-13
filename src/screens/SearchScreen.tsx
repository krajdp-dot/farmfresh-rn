import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import AnimatedPressable from '../components/AnimatedPressable';
import ProductCard from '../components/ProductCard';
import { spacing, radius, SCREEN_WIDTH } from '../theme/tokens';

const ALL_PRODUCTS = [
  { id: 'p1', name: 'Fresh Tomatoes',  nameHi: 'ताज़े टमाटर', price: 25, mandiPrice: 18, unit: '1 kg',  image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400' },
  { id: 'p2', name: 'Potatoes',        nameHi: 'आलू',         price: 22, mandiPrice: 15, unit: '1 kg',  image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400' },
  { id: 'p3', name: 'Onions',          nameHi: 'प्याज़',      price: 28, mandiPrice: 20, unit: '1 kg',  image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400' },
  { id: 'p4', name: 'Cauliflower',     nameHi: 'फूलगोभी',    price: 35, mandiPrice: 25, unit: '1 piece',image: 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=400' },
  { id: 'p5', name: 'Spinach',         nameHi: 'पालक',        price: 18, mandiPrice: 12, unit: '500g',  image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
  { id: 'p6', name: 'Bitter Gourd',    nameHi: 'करेला',       price: 42, mandiPrice: 30, unit: '500g',  image: 'https://images.unsplash.com/photo-1571086430599-65c4a5ad13c1?w=400' },
  { id: 'p7', name: 'Ginger',          nameHi: 'अदरक',        price: 80, mandiPrice: 60, unit: '250g',  image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400' },
  { id: 'p8', name: 'Garlic',          nameHi: 'लहसुन',       price: 100,mandiPrice: 80, unit: '250g',  image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400' },
  { id: 'p9', name: 'Green Chili',     nameHi: 'हरी मिर्च',  price: 30, mandiPrice: 20, unit: '250g',  image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400' },
  { id: 'p10',name: 'Capsicum',        nameHi: 'शिमला मिर्च', price: 40, mandiPrice: 30, unit: '500g',  image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400' },
];

const RECENT_SEARCHES = ['Tomatoes', 'Onions', 'Spinach', 'Potato'];

const POPULAR_TAGS = [
  { label: 'Vegetables', labelHi: 'सब्ज़ियाँ', emoji: '🥦' },
  { label: 'Fruits', labelHi: 'फल', emoji: '🍊' },
  { label: 'Leafy', labelHi: 'पत्तेदार', emoji: '🥬' },
  { label: 'Herbs', labelHi: 'मसाले', emoji: '🌿' },
  { label: 'Root', labelHi: 'जड़', emoji: '🥕' },
  { label: 'Seasonal', labelHi: 'मौसमी', emoji: '🌾' },
];

const TRENDING = [
  { label: 'Tomatoes', labelHi: 'टमाटर', emoji: '🍅', count: '240+ orders' },
  { label: 'Potatoes', labelHi: 'आलू', emoji: '🥔', count: '180+ orders' },
  { label: 'Onions', labelHi: 'प्याज़', emoji: '🧅', count: '160+ orders' },
];

interface Props {
  onProductPress: (p: any) => void;
  onBack: () => void;
}

const SearchScreen: React.FC<Props> = ({ onProductPress, onBack }) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const inputRef = useRef<TextInput>(null);

  const boldFont   = isHindi ? 'Baloo2-Bold'     : 'Outfit-Bold';
  const bodyFont   = isHindi ? 'Baloo2-Regular'  : 'Outfit-Regular';
  const semiBold   = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont    = isHindi ? 'Baloo2-Medium'   : 'Outfit-Medium';

  const results = query.length > 1
    ? ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.nameHi.includes(query)
      )
    : [];

  const handleSearch = (term: string) => {
    setQuery(term);
    if (term && !recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev].slice(0, 6));
    }
  };

  const EmptySearch = () => (
    <View style={styles.suggestions}>
      {/* Trending now */}
      <View style={styles.sugSection}>
        <Text style={[styles.sugTitle, { color: colors.text, fontFamily: boldFont }]}>
          🔥 {isHindi ? 'ट्रेंडिंग' : 'Trending Now'}
        </Text>
        {TRENDING.map((t_, i) => (
          <TouchableOpacity key={i} onPress={() => handleSearch(t_.label)} activeOpacity={0.8}>
            <View style={[styles.trendingRow, { borderBottomColor: colors.borderLight }]}>
              <Text style={styles.trendingEmoji}>{t_.emoji}</Text>
              <View style={styles.trendingInfo}>
                <Text style={[styles.trendingName, { color: colors.text, fontFamily: medFont }]}>
                  {isHindi ? t_.labelHi : t_.label}
                </Text>
                <Text style={[styles.trendingCount, { color: colors.textMuted, fontFamily: bodyFont }]}>
                  {t_.count}
                </Text>
              </View>
              <Text style={[styles.trendingArrow, { color: colors.textMuted }]}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <View style={styles.sugSection}>
          <View style={styles.sugTitleRow}>
            <Text style={[styles.sugTitle, { color: colors.text, fontFamily: boldFont }]}>
              🕐 {t('recentSearches')}
            </Text>
            <TouchableOpacity onPress={() => setRecentSearches([])} activeOpacity={0.7}>
              <Text style={[styles.clearText, { color: colors.textMuted, fontFamily: bodyFont }]}>
                {isHindi ? 'सब हटाएं' : 'Clear all'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipsWrap}>
            {recentSearches.map((r, i) => (
              <TouchableOpacity key={i} onPress={() => handleSearch(r)} activeOpacity={0.8}>
                <View style={[styles.chip, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                  <Text style={styles.chipEmoji}>🕐</Text>
                  <Text style={[styles.chipText, { color: colors.textSecondary, fontFamily: bodyFont }]}>{r}</Text>
                  <TouchableOpacity onPress={() => setRecentSearches(prev => prev.filter((_, j) => j !== i))} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                    <Text style={[styles.chipRemove, { color: colors.textMuted }]}>✕</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Categories */}
      <View style={styles.sugSection}>
        <Text style={[styles.sugTitle, { color: colors.text, fontFamily: boldFont }]}>
          {t('popularCategories')}
        </Text>
        <View style={styles.chipsWrap}>
          {POPULAR_TAGS.map((tag, i) => (
            <TouchableOpacity key={i} onPress={() => handleSearch(tag.label)} activeOpacity={0.8}>
              <View style={[styles.catChip, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                <Text style={styles.catChipEmoji}>{tag.emoji}</Text>
                <Text style={[styles.catChipText, { color: colors.primary, fontFamily: medFont }]}>
                  {isHindi ? tag.labelHi : tag.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Mandi price highlight */}
      <View style={[styles.mandiHint, { backgroundColor: colors.mandiStrip, borderColor: colors.mandiBorder }]}>
        <Text style={styles.mandiHintIcon}>📊</Text>
        <Text style={[styles.mandiHintText, { color: colors.mandiText, fontFamily: medFont }]}>
          {isHindi
            ? 'सभी प्रोडक्ट पर मंडी भाव दिखाया जाता है — असली बचत देखें!'
            : 'All products show Mandi price — see your real savings!'}
        </Text>
      </View>
    </View>
  );

  const NoResults = () => (
    <View style={styles.noResults}>
      <Text style={styles.noResultsEmoji}>🔍</Text>
      <Text style={[styles.noResultsTitle, { color: colors.text, fontFamily: boldFont }]}>{t('noResults')}</Text>
      <Text style={[styles.noResultsSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
        "{query}" {isHindi ? 'के लिए कोई उत्पाद नहीं मिला' : 'not found'}
      </Text>
      <Text style={[styles.noResultsTip, { color: colors.textSecondary, fontFamily: bodyFont }]}>
        {t('noResultsSub')}
      </Text>
      <View style={styles.chipsWrap}>
        {['Tomatoes', 'Onions', 'Potatoes'].map((s, i) => (
          <TouchableOpacity key={i} onPress={() => handleSearch(s)} activeOpacity={0.8}>
            <View style={[styles.catChip, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
              <Text style={[styles.catChipText, { color: colors.primary, fontFamily: medFont }]}>{s}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* Header with search */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <AnimatedPressable onPress={onBack} scale={0.9}>
          <View style={[styles.backBtn, { backgroundColor: colors.bgSecondary }]}>
            <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
          </View>
        </AnimatedPressable>

        <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: query ? colors.primary : colors.inputBorder }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: colors.text, fontFamily: bodyFont }]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <View style={[styles.clearBtn, { backgroundColor: colors.bgTertiary }]}>
                <Text style={[styles.clearBtnText, { color: colors.textMuted }]}>✕</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results count */}
      {query.length > 1 && (
        <View style={[styles.resultsBar, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
          <Text style={[styles.resultsText, { color: colors.textSecondary, fontFamily: bodyFont }]}>
            {results.length > 0
              ? `${results.length} ${isHindi ? 'उत्पाद मिले' : 'results for'} "${query}"`
              : `"${query}" ${isHindi ? 'के लिए' : 'for'} 0 ${isHindi ? 'उत्पाद' : 'results'}`}
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={i => i.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrap}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          query.length === 0 ? <EmptySearch /> :
          results.length === 0 && query.length > 1 ? <NoResults /> : null
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  clearBtn: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  clearBtnText: { fontSize: 10 },
  resultsBar: { paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1 },
  resultsText: { fontSize: 13 },
  listContent: { padding: 16, paddingBottom: 32 },
  columnWrap: { gap: 12 },
  suggestions: { gap: 24, paddingBottom: 20 },
  sugSection: { gap: 12 },
  sugTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sugTitle: { fontSize: 16 },
  clearText: { fontSize: 13 },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  trendingEmoji: { fontSize: 22, width: 32 },
  trendingInfo: { flex: 1, gap: 2 },
  trendingName: { fontSize: 15 },
  trendingCount: { fontSize: 12 },
  trendingArrow: { fontSize: 20 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipEmoji: { fontSize: 13 },
  chipText: { fontSize: 13 },
  chipRemove: { fontSize: 10, marginLeft: 2 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  catChipEmoji: { fontSize: 14 },
  catChipText: { fontSize: 13 },
  mandiHint: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  mandiHintIcon: { fontSize: 20 },
  mandiHintText: { flex: 1, fontSize: 13, lineHeight: 18 },
  noResults: { alignItems: 'center', paddingTop: 50, gap: 10, paddingBottom: 20 },
  noResultsEmoji: { fontSize: 52 },
  noResultsTitle: { fontSize: 20 },
  noResultsSub: { fontSize: 14 },
  noResultsTip: { fontSize: 13 },
});

export default SearchScreen;
