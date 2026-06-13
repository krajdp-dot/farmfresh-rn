import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import { useCartStore } from '../stores/cartStore';
import AnimatedPressable from '../components/AnimatedPressable';
import { FarmerStory, NotifyButton, PriceDropAlert, FreshnessBadge, WeightBadge, MandiSavingsBadge } from '../components/features';
import { spacing, radius, SCREEN_WIDTH } from '../theme/tokens';

interface Product {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  mandiPrice?: number;
  unit: string;
  image: string;
}

const RELATED = [
  { id: 'r1', name: 'Onions', nameHi: 'प्याज़', price: 28, mandiPrice: 20, unit: '1kg', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400' },
  { id: 'r2', name: 'Potatoes', nameHi: 'आलू', price: 22, mandiPrice: 15, unit: '1kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400' },
  { id: 'r3', name: 'Spinach', nameHi: 'पालक', price: 18, mandiPrice: 12, unit: '500g', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
];

interface Props {
  product: Product;
  onBack: () => void;
  onCartPress: () => void;
}

const ProductDetailScreen: React.FC<Props> = ({ product, onBack, onCartPress }) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();
  const insets = useSafeAreaInsets();
  const qty = useCartStore((s) => s.getQty(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const [selectedUnit, setSelectedUnit] = useState(0);

  const boldFont = isHindi ? 'Baloo2-Bold' : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular' : 'Outfit-Regular';
  const semiBoldFont = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont = isHindi ? 'Baloo2-Medium' : 'Outfit-Medium';
  const exBoldFont = isHindi ? 'Baloo2-Bold' : 'Outfit-ExtraBold';

  const savings = product.mandiPrice ? product.mandiPrice - product.price : 0;
  const savingPct = product.mandiPrice ? Math.round((savings / product.mandiPrice) * 100) : 0;

  const UNIT_OPTIONS = [
    { label: '250g', multiplier: 0.25 },
    { label: '500g', multiplier: 0.5 },
    { label: '1 kg', multiplier: 1 },
    { label: '2 kg', multiplier: 2 },
  ];

  const effectivePrice = Math.round(product.price * UNIT_OPTIONS[selectedUnit].multiplier);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Floating back button */}
      <View style={[styles.floatingBtns, { top: insets.top + 10 }]}>
        <AnimatedPressable onPress={onBack} scale={0.9}>
          <View style={styles.floatingBtn}>
            <Text style={styles.floatingBtnText}>←</Text>
          </View>
        </AnimatedPressable>
        <AnimatedPressable onPress={onCartPress} scale={0.9}>
          <View style={styles.floatingBtn}>
            <Text style={styles.floatingBtnText}>🛒</Text>
          </View>
        </AnimatedPressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroGradient} />
          {savingPct > 0 && (
            <View style={[styles.heroBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.heroBadgeText, { fontFamily: boldFont }]}>{savingPct}% OFF</Text>
            </View>
          )}
          <FreshnessBadge freshness="morning" isHindi={isHindi} />
          <WeightBadge />
          {product.mandiPrice && <MandiSavingsBadge price={product.price} mandiPrice={product.mandiPrice} isHindi={isHindi} />}
          <View style={styles.heroFreshnessRow}>
            {[isHindi ? '🌿 ताज़ा' : '🌿 Fresh', isHindi ? '✅ चेक किया' : '✅ Checked', isHindi ? '⚡ आज का' : '⚡ Today'].map((tag, i) => (
              <View key={i} style={styles.heroTag}>
                <Text style={styles.heroTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          {/* Name + Price */}
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <View style={styles.nameBlock}>
                <Text style={[styles.productName, { color: colors.text, fontFamily: boldFont }]}>
                  {isHindi ? product.nameHi : product.name}
                </Text>
                <Text style={[styles.productNameAlt, { color: colors.textMuted, fontFamily: bodyFont }]}>
                  {isHindi ? product.name : product.nameHi}
                </Text>
              </View>
              <View style={styles.priceBlock}>
                <Text style={[styles.mainPrice, { color: colors.text, fontFamily: exBoldFont }]}>
                  ₹{effectivePrice}
                </Text>
                {product.mandiPrice && (
                  <Text style={[styles.mrpPrice, { color: colors.textMuted, fontFamily: bodyFont }]}>
                    MRP ₹{Math.round(product.mandiPrice * UNIT_OPTIONS[selectedUnit].multiplier)}
                  </Text>
                )}
              </View>
            </View>

            {/* Rating + Info pills */}
            <View style={styles.infoPills}>
              <View style={[styles.infoPill, { backgroundColor: colors.goldLight }]}>
                <Text style={styles.infoPillIcon}>⭐</Text>
                <Text style={[styles.infoPillText, { color: colors.gold, fontFamily: medFont }]}>4.8</Text>
              </View>
              <View style={[styles.infoPill, { backgroundColor: colors.primaryLight }]}>
                <Text style={styles.infoPillIcon}>🕐</Text>
                <Text style={[styles.infoPillText, { color: colors.primary, fontFamily: medFont }]}>
                  {isHindi ? '2 घंटे' : '2hr delivery'}
                </Text>
              </View>
              <View style={[styles.infoPill, { backgroundColor: colors.bgSecondary }]}>
                <Text style={styles.infoPillIcon}>📦</Text>
                <Text style={[styles.infoPillText, { color: colors.textSecondary, fontFamily: medFont }]}>
                  {isHindi ? 'स्टॉक में' : 'In Stock'}
                </Text>
              </View>
            </View>
          </View>

          {/* Unit selector */}
          <View style={[styles.unitSection, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
            <Text style={[styles.unitLabel, { color: colors.textSecondary, fontFamily: semiBoldFont }]}>
              {t('selectQuantity')}
            </Text>
            <View style={styles.unitOptions}>
              {UNIT_OPTIONS.map((opt, i) => (
                <TouchableOpacity key={i} onPress={() => setSelectedUnit(i)} activeOpacity={0.8}>
                  <View style={[
                    styles.unitOption,
                    {
                      backgroundColor: selectedUnit === i ? colors.primary : colors.card,
                      borderColor: selectedUnit === i ? colors.primary : colors.border,
                    }
                  ]}>
                    <Text style={[styles.unitOptionText, {
                      color: selectedUnit === i ? '#fff' : colors.text,
                      fontFamily: selectedUnit === i ? semiBoldFont : bodyFont,
                    }]}>
                      {opt.label}
                    </Text>
                    <Text style={[styles.unitOptionPrice, {
                      color: selectedUnit === i ? 'rgba(255,255,255,0.8)' : colors.textMuted,
                      fontFamily: bodyFont,
                    }]}>
                      ₹{Math.round(product.price * opt.multiplier)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mandi Price Comparison */}
          {product.mandiPrice && (
            <View style={[styles.mandiBlock, { backgroundColor: colors.mandiStrip, borderColor: colors.mandiBorder }]}>
              <View style={styles.mandiBlockHeader}>
                <Text style={styles.mandiBlockIcon}>📊</Text>
                <Text style={[styles.mandiBlockTitle, { color: colors.mandiText, fontFamily: boldFont }]}>
                  {t('mandiVsUs')}
                </Text>
                <View style={[styles.savingsChip, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.savingsChipText, { fontFamily: boldFont }]}>{savingPct}% OFF</Text>
                </View>
              </View>

              <View style={styles.mandiCompare}>
                <View style={styles.mandiCompareCol}>
                  <Text style={[styles.mandiCompareLabel, { color: colors.textMuted, fontFamily: bodyFont }]}>
                    {t('mandiPrice')}
                  </Text>
                  <Text style={[styles.mandiCompareVal, { color: colors.mandiText, fontFamily: boldFont }]}>
                    ₹{product.mandiPrice}/kg
                  </Text>
                  <Text style={[styles.mandiCompareNote, { color: colors.textMuted, fontFamily: bodyFont }]}>
                    {isHindi ? 'थोक बाज़ार भाव' : 'Wholesale rate'}
                  </Text>
                </View>

                <View style={styles.mandiCompareDivider}>
                  <View style={[styles.mandiCompareLine, { backgroundColor: colors.mandiBorder }]} />
                  <View style={[styles.mandiCompareArrow, { backgroundColor: colors.mandiStrip }]}>
                    <Text style={[styles.mandiCompareArrowText, { color: colors.mandiText }]}>vs</Text>
                  </View>
                  <View style={[styles.mandiCompareLine, { backgroundColor: colors.mandiBorder }]} />
                </View>

                <View style={styles.mandiCompareCol}>
                  <Text style={[styles.mandiCompareLabel, { color: colors.textMuted, fontFamily: bodyFont }]}>
                    {t('ourPrice')}
                  </Text>
                  <Text style={[styles.mandiCompareVal, { color: colors.primary, fontFamily: boldFont }]}>
                    ₹{product.price}/kg
                  </Text>
                  <Text style={[styles.mandiCompareNote, { color: colors.textMuted, fontFamily: bodyFont }]}>
                    {isHindi ? 'आपका भाव' : 'Your price'}
                  </Text>
                </View>
              </View>

              <View style={[styles.savingsSummary, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                <Text style={[styles.savingsSummaryText, { color: colors.primary, fontFamily: boldFont }]}>
                  🎉 {t('youSave')} ₹{savings}/kg = ₹{effectivePrice > product.price ? savings * UNIT_OPTIONS[selectedUnit].multiplier : savings} {isHindi ? 'इस ऑर्डर पर' : 'on this order'}
                </Text>
              </View>
            </View>
          )}

          {/* Farm Story — F16 */}
          <FarmerStory isHindi={isHindi} />

          {/* Price Drop Alert — F12 */}
          <PriceDropAlert productId={product.id} productName={isHindi ? product.nameHi : product.name} />

          {/* Nutrition info */}
          <View style={[styles.nutritionBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.nutritionTitle, { color: colors.text, fontFamily: boldFont }]}>
              {isHindi ? '🥗 पोषण जानकारी (प्रति 100g)' : '🥗 Nutrition (per 100g)'}
            </Text>
            <View style={styles.nutritionGrid}>
              {[
                { label: isHindi ? 'कैलोरी' : 'Calories', value: '18 kcal' },
                { label: isHindi ? 'प्रोटीन' : 'Protein', value: '0.9g' },
                { label: isHindi ? 'फाइबर' : 'Fiber', value: '1.2g' },
                { label: isHindi ? 'विटामिन C' : 'Vitamin C', value: '14mg' },
              ].map((n, i) => (
                <View key={i} style={[styles.nutritionItem, { backgroundColor: colors.bgSecondary }]}>
                  <Text style={[styles.nutritionVal, { color: colors.primary, fontFamily: boldFont }]}>{n.value}</Text>
                  <Text style={[styles.nutritionLabel, { color: colors.textMuted, fontFamily: bodyFont }]}>{n.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Related */}
          <View style={styles.relatedSection}>
            <Text style={[styles.relatedTitle, { color: colors.text, fontFamily: boldFont }]}>
              {isHindi ? 'यह भी देखें' : 'You might also like'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
              {RELATED.map((item) => (
                <View key={item.id} style={[styles.relatedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Image source={{ uri: item.image }} style={styles.relatedImage} resizeMode="cover" />
                  <View style={styles.relatedInfo}>
                    <Text style={[styles.relatedName, { color: colors.text, fontFamily: semiBoldFont }]} numberOfLines={1}>
                      {isHindi ? item.nameHi : item.name}
                    </Text>
                    <Text style={[styles.relatedUnit, { color: colors.textMuted, fontFamily: bodyFont }]}>{item.unit}</Text>
                    <Text style={[styles.relatedPrice, { color: colors.text, fontFamily: boldFont }]}>₹{item.price}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Notify Button — F2 */}
      <NotifyButton productId={product.id} productName={isHindi ? product.nameHi : product.name} />

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: colors.bg, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.bottomBarInner}>
          <View style={styles.bottomPriceBlock}>
            <Text style={[styles.bottomPrice, { color: colors.text, fontFamily: boldFont }]}>₹{effectivePrice}</Text>
            <Text style={[styles.bottomUnit, { color: colors.textMuted, fontFamily: bodyFont }]}>
              {UNIT_OPTIONS[selectedUnit].label}
            </Text>
          </View>

          {qty === 0 ? (
            <AnimatedPressable
              onPress={() => addItem({ id: product.id, name: product.name, nameHi: product.nameHi, price: product.price, unit: product.unit, image: product.image, mandiPrice: product.mandiPrice })}
              scale={0.96}
              style={styles.addToCartBtn}
            >
              <View style={[styles.addToCartBtnInner, { backgroundColor: colors.primary }]}>
                <Text style={[styles.addToCartText, { fontFamily: boldFont }]}>+ {t('addToCart')}</Text>
              </View>
            </AnimatedPressable>
          ) : (
            <View style={styles.qtyCartRow}>
              <View style={[styles.qtyControl, { borderColor: colors.primary }]}>
                <AnimatedPressable onPress={() => updateQty(product.id, qty - 1)} scale={0.88}>
                  <Text style={[styles.qtyBtn, { color: colors.primary, fontFamily: boldFont }]}>−</Text>
                </AnimatedPressable>
                <Text style={[styles.qtyVal, { color: colors.primary, fontFamily: boldFont }]}>{qty}</Text>
                <AnimatedPressable onPress={() => updateQty(product.id, qty + 1)} scale={0.88}>
                  <Text style={[styles.qtyBtn, { color: colors.primary, fontFamily: boldFont }]}>+</Text>
                </AnimatedPressable>
              </View>
              <AnimatedPressable onPress={onCartPress} scale={0.96} style={styles.goCartBtn}>
                <View style={[styles.goCartBtnInner, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.addToCartText, { fontFamily: boldFont }]}>{isHindi ? 'कार्ट देखें →' : 'Go to Cart →'}</Text>
                </View>
              </AnimatedPressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingBtns: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  floatingBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingBtnText: { fontSize: 18, color: '#1C1C1C' },
  heroContainer: { width: SCREEN_WIDTH, height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroBadge: {
    position: 'absolute',
    top: 90,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroBadgeText: { color: '#fff', fontSize: 13 },
  heroFreshnessRow: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    flexDirection: 'row',
    gap: 6,
  },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  heroTagText: { fontSize: 11, color: '#1C1C1C', fontFamily: 'Outfit-Medium' },
  body: { paddingHorizontal: 16, gap: 16, paddingTop: 16 },
  nameSection: { gap: 10 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameBlock: { flex: 1, gap: 2 },
  productName: { fontSize: 24, lineHeight: 30 },
  productNameAlt: { fontSize: 13 },
  priceBlock: { alignItems: 'flex-end', gap: 2 },
  mainPrice: { fontSize: 28 },
  mrpPrice: { fontSize: 13, textDecorationLine: 'line-through' },
  infoPills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  infoPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  infoPillIcon: { fontSize: 13 },
  infoPillText: { fontSize: 12 },
  unitSection: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  unitLabel: { fontSize: 13 },
  unitOptions: { flexDirection: 'row', gap: 8 },
  unitOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 3,
  },
  unitOptionText: { fontSize: 13 },
  unitOptionPrice: { fontSize: 11 },
  mandiBlock: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 12 },
  mandiBlockHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mandiBlockIcon: { fontSize: 20 },
  mandiBlockTitle: { flex: 1, fontSize: 15 },
  savingsChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  savingsChipText: { color: '#fff', fontSize: 11 },
  mandiCompare: { flexDirection: 'row', alignItems: 'center' },
  mandiCompareCol: { flex: 1, alignItems: 'center', gap: 4 },
  mandiCompareLabel: { fontSize: 12 },
  mandiCompareVal: { fontSize: 20 },
  mandiCompareNote: { fontSize: 11 },
  mandiCompareDivider: { width: 32, alignItems: 'center', gap: 2 },
  mandiCompareLine: { flex: 1, width: 1 },
  mandiCompareArrow: { paddingVertical: 4, paddingHorizontal: 2 },
  mandiCompareArrowText: { fontSize: 11 },
  savingsSummary: { padding: 10, borderRadius: 10, borderWidth: 1 },
  savingsSummaryText: { fontSize: 13, textAlign: 'center' },
  farmBlock: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 12 },
  farmBlockHeader: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  farmBlockIcon: { fontSize: 28 },
  farmBlockTitle: { fontSize: 15 },
  farmBlockSub: { fontSize: 12, marginTop: 1 },
  farmStoryText: { fontSize: 14, lineHeight: 21 },
  farmTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  farmTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  farmTagIcon: { fontSize: 13 },
  farmTagText: { fontSize: 12 },
  nutritionBlock: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 12 },
  nutritionTitle: { fontSize: 15 },
  nutritionGrid: { flexDirection: 'row', gap: 8 },
  nutritionItem: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 10, gap: 3 },
  nutritionVal: { fontSize: 15 },
  nutritionLabel: { fontSize: 11, textAlign: 'center' },
  relatedSection: { gap: 12 },
  relatedTitle: { fontSize: 16 },
  relatedScroll: { gap: 10, paddingRight: 16 },
  relatedCard: { width: 130, borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  relatedImage: { width: '100%', height: 90 },
  relatedInfo: { padding: 8, gap: 2 },
  relatedName: { fontSize: 12 },
  relatedUnit: { fontSize: 11 },
  relatedPrice: { fontSize: 14 },
  bottomBar: { borderTopWidth: 1, padding: 16 },
  bottomBarInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bottomPriceBlock: { gap: 1 },
  bottomPrice: { fontSize: 22 },
  bottomUnit: { fontSize: 12 },
  addToCartBtn: { flex: 1 },
  addToCartBtnInner: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  addToCartText: { color: '#fff', fontSize: 16 },
  qtyCartRow: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 12, height: 52 },
  qtyBtn: { fontSize: 22, paddingHorizontal: 12 },
  qtyVal: { fontSize: 18, minWidth: 30, textAlign: 'center' },
  goCartBtn: { flex: 1 },
  goCartBtnInner: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

export default ProductDetailScreen;
