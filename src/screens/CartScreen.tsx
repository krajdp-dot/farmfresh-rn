import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import { useCartStore } from '../stores/cartStore';
import AnimatedPressable from '../components/AnimatedPressable';
import { OrderNotes, EmptyCartUpsell } from '../components/features';
import { spacing, radius, SCREEN_WIDTH } from '../theme/tokens';

interface Props {
  onCheckout: () => void;
  onShopNow: () => void;
}

const CartScreen: React.FC<Props> = ({ onCheckout, onShopNow }) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  const boldFont = isHindi ? 'Baloo2-Bold' : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular' : 'Outfit-Regular';
  const semiBoldFont = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont = isHindi ? 'Baloo2-Medium' : 'Outfit-Medium';

  const [orderNote, setOrderNote] = useState('');
  const deliveryFee = totalPrice >= 299 ? 0 : 30;
  const grandTotal = totalPrice + deliveryFee;
  const toFreeDelivery = Math.max(0, 299 - totalPrice);

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />
        <View style={[styles.header, { paddingTop: insets.top + 14, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: boldFont }]}>{t('myCart')}</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={[styles.emptyIllustration, { backgroundColor: colors.bgSecondary }]}>
            <Text style={styles.emptyEmoji}>🛒</Text>
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: boldFont }]}>{t('emptyCart')}</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted, fontFamily: bodyFont }]}>{t('emptyCartSub')}</Text>
          <EmptyCartUpsell />
          <AnimatedPressable onPress={onShopNow} scale={0.97}>
            <View style={[styles.shopNowBtn, { backgroundColor: colors.primary }]}>
              <Text style={[styles.shopNowBtnText, { fontFamily: boldFont }]}>🌿 {t('shopNow')}</Text>
            </View>
          </AnimatedPressable>
          <View style={styles.emptyTrust}>
            {[isHindi ? '🔒 सुरक्षित भुगतान' : '🔒 Safe Payment', isHindi ? '⚡ तेज़ डिलीवरी' : '⚡ Fast Delivery', isHindi ? '✅ ताज़ा गारंटी' : '✅ Fresh Guarantee'].map((t_, i) => (
              <Text key={i} style={[styles.emptyTrustText, { color: colors.textMuted, fontFamily: bodyFont }]}>{t_}</Text>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <View style={[styles.header, { paddingTop: insets.top + 14, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: boldFont }]}>{t('myCart')}</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {totalItems} {isHindi ? 'वस्तुएं' : 'items'} · ₹{totalPrice}
          </Text>
        </View>
        <TouchableOpacity onPress={() => items.forEach(i => removeItem(i.id))} activeOpacity={0.7}>
          <Text style={[styles.clearAllBtn, { color: colors.red, fontFamily: semiBoldFont }]}>
            {isHindi ? 'सब हटाएं' : 'Clear All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Free delivery progress */}
      {toFreeDelivery > 0 && (
        <View style={[styles.freeDeliveryBar, { backgroundColor: colors.goldLight, borderBottomColor: colors.mandiBorder }]}>
          <Text style={[styles.freeDeliveryText, { color: colors.mandiText, fontFamily: medFont }]}>
            🚀 {isHindi ? `₹${toFreeDelivery} और जोड़ें — मुफ़्त डिलीवरी पाएं!` : `Add ₹${toFreeDelivery} more for FREE delivery!`}
          </Text>
          <View style={[styles.freeDeliveryProgress, { backgroundColor: colors.mandiBorder }]}>
            <View style={[styles.freeDeliveryFill, { backgroundColor: colors.gold, width: `${Math.min(100, (totalPrice / 299) * 100)}%` }]} />
          </View>
        </View>
      )}
      {deliveryFee === 0 && (
        <View style={[styles.freeDeliveryBar, { backgroundColor: colors.primaryLight, borderBottomColor: colors.primary + '30' }]}>
          <Text style={[styles.freeDeliveryText, { color: colors.primary, fontFamily: medFont }]}>
            🎉 {isHindi ? 'आपको मुफ़्त डिलीवरी मिल रही है!' : "You've unlocked FREE delivery!"}
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsSection}>
          {items.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.cartItem}>
                <View style={[styles.itemImageWrap, { backgroundColor: colors.bgSecondary }]}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                </View>
                <View style={styles.itemBody}>
                  <View style={styles.itemTopRow}>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.text, fontFamily: semiBoldFont }]} numberOfLines={2}>
                        {isHindi ? item.nameHi : item.name}
                      </Text>
                      <Text style={[styles.itemUnit, { color: colors.textMuted, fontFamily: bodyFont }]}>{item.unit}</Text>
                      {item.mandiPrice && (
                        <View style={styles.itemSavingRow}>
                          <Text style={[styles.itemMRP, { color: colors.textMuted, fontFamily: bodyFont }]}>
                            MRP ₹{item.mandiPrice}
                          </Text>
                          <Text style={[styles.itemSaving, { color: colors.primary, fontFamily: medFont }]}>
                            {t('youSave')} ₹{item.mandiPrice - item.price}
                          </Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <View style={[styles.removeBtn, { backgroundColor: colors.redLight }]}>
                        <Text style={[styles.removeBtnText, { color: colors.red }]}>✕</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.itemBottomRow}>
                    <Text style={[styles.itemTotal, { color: colors.text, fontFamily: boldFont }]}>
                      ₹{item.price * item.qty}
                    </Text>
                    <View style={[styles.qtyControl, { borderColor: colors.primary }]}>
                      <AnimatedPressable onPress={() => updateQty(item.id, item.qty - 1)} scale={0.88}>
                        <Text style={[styles.qtyBtn, { color: colors.primary, fontFamily: boldFont }]}>−</Text>
                      </AnimatedPressable>
                      <Text style={[styles.qtyVal, { color: colors.primary, fontFamily: boldFont }]}>{item.qty}</Text>
                      <AnimatedPressable onPress={() => updateQty(item.id, item.qty + 1)} scale={0.88}>
                        <Text style={[styles.qtyBtn, { color: colors.primary, fontFamily: boldFont }]}>+</Text>
                      </AnimatedPressable>
                    </View>
                  </View>
                </View>
              </View>
              {idx < items.length - 1 && <View style={[styles.itemDivider, { backgroundColor: colors.borderLight }]} />}
            </View>
          ))}
        </View>

        {/* Order Notes — F14 */}
        <OrderNotes value={orderNote} onChange={setOrderNote} />

        {/* Coupon section */}
        <View style={[styles.couponSection, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
          <View style={styles.couponRow}>
            <Text style={styles.couponIcon}>🏷️</Text>
            <Text style={[styles.couponLabel, { color: colors.text, fontFamily: medFont }]}>
              {isHindi ? 'कूपन लगाएं' : 'Apply Coupon'}
            </Text>
            <Text style={[styles.couponArrow, { color: colors.primary, fontFamily: semiBoldFont }]}>Apply →</Text>
          </View>
        </View>

        {/* Bill Details */}
        <View style={[styles.billSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.billTitle, { color: colors.text, fontFamily: boldFont }]}>
            {isHindi ? '🧾 बिल विवरण' : '🧾 Bill Details'}
          </Text>

          {/* Per item breakdown */}
          {items.map((item) => (
            <View key={item.id} style={styles.billRow}>
              <Text style={[styles.billItemName, { color: colors.textSecondary, fontFamily: bodyFont }]} numberOfLines={1}>
                {isHindi ? item.nameHi : item.name} × {item.qty}
              </Text>
              <Text style={[styles.billItemPrice, { color: colors.text, fontFamily: medFont }]}>
                ₹{item.price * item.qty}
              </Text>
            </View>
          ))}

          <View style={[styles.billDivider, { backgroundColor: colors.border }]} />

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.textSecondary, fontFamily: bodyFont }]}>{t('itemTotal')}</Text>
            <Text style={[styles.billVal, { color: colors.text, fontFamily: medFont }]}>₹{totalPrice}</Text>
          </View>
          <View style={styles.billRow}>
            <View style={styles.billLabelRow}>
              <Text style={[styles.billLabel, { color: colors.textSecondary, fontFamily: bodyFont }]}>{t('deliveryFee')}</Text>
              {deliveryFee === 0 && (
                <View style={[styles.freeBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.freeBadgeText, { color: colors.primary, fontFamily: semiBoldFont }]}>FREE</Text>
                </View>
              )}
            </View>
            <Text style={[styles.billVal, { color: deliveryFee === 0 ? colors.primary : colors.text, fontFamily: medFont }]}>
              {deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}
            </Text>
          </View>

          {/* Savings row */}
          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.textSecondary, fontFamily: bodyFont }]}>
              {isHindi ? 'मंडी से बचत' : 'Mandi Savings'}
            </Text>
            <Text style={[styles.billVal, { color: colors.red, fontFamily: medFont }]}>
              −₹{items.reduce((sum, i) => sum + ((i.mandiPrice ?? i.price) - i.price) * i.qty, 0)}
            </Text>
          </View>

          <View style={[styles.billDivider, { backgroundColor: colors.border }]} />

          <View style={styles.billTotalRow}>
            <Text style={[styles.billTotalLabel, { color: colors.text, fontFamily: boldFont }]}>{t('totalAmount')}</Text>
            <Text style={[styles.billTotalVal, { color: colors.text, fontFamily: boldFont }]}>₹{grandTotal}</Text>
          </View>
        </View>

        {/* Cancellation policy */}
        <View style={[styles.policySection, { backgroundColor: colors.bgSecondary }]}>
          <Text style={[styles.policyTitle, { color: colors.text, fontFamily: semiBoldFont }]}>
            {isHindi ? 'ℹ️ रद्दीकरण नीति' : 'ℹ️ Cancellation Policy'}
          </Text>
          <Text style={[styles.policyText, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {isHindi
              ? 'ऑर्डर कन्फर्म होने के बाद रद्द नहीं किया जा सकता। ताज़गी बनाए रखने के लिए।'
              : 'Orders cannot be cancelled once confirmed to ensure freshness. Refunds apply for quality issues.'}
          </Text>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Checkout bar */}
      <View style={[styles.checkoutBar, { backgroundColor: colors.bg, borderTopColor: colors.border, paddingBottom: insets.bottom + 10 }]}>
        <AnimatedPressable onPress={onCheckout} scale={0.97} style={styles.checkoutBtn}>
          <View style={[styles.checkoutBtnInner, { backgroundColor: colors.primary }]}>
            <View>
              <Text style={[styles.checkoutBtnTotal, { fontFamily: medFont }]}>₹{grandTotal}</Text>
              <Text style={[styles.checkoutBtnSub, { fontFamily: bodyFont }]}>
                {totalItems} {isHindi ? 'वस्तुएं' : 'items'} {deliveryFee === 0 ? '· ' + t('free') + ' delivery' : ''}
              </Text>
            </View>
            <Text style={[styles.checkoutBtnLabel, { fontFamily: boldFont }]}>
              {t('proceedToCheckout')} →
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22 },
  headerSub: { fontSize: 13, marginTop: 2 },
  clearAllBtn: { fontSize: 14, marginTop: 4 },
  freeDeliveryBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 6,
  },
  freeDeliveryText: { fontSize: 13 },
  freeDeliveryProgress: { height: 4, borderRadius: 999, overflow: 'hidden' },
  freeDeliveryFill: { height: '100%', borderRadius: 999 },
  itemsSection: { backgroundColor: 'transparent' },
  cartItem: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemImageWrap: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemBody: { flex: 1, gap: 8 },
  itemTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 14, lineHeight: 19 },
  itemUnit: { fontSize: 12 },
  itemSavingRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 2 },
  itemMRP: { fontSize: 12, textDecorationLine: 'line-through' },
  itemSaving: { fontSize: 12 },
  removeBtn: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { fontSize: 11, fontFamily: 'Outfit-Bold' },
  itemBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTotal: { fontSize: 17 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 8 },
  qtyBtn: { fontSize: 18, paddingHorizontal: 10, paddingVertical: 4 },
  qtyVal: { fontSize: 14, minWidth: 24, textAlign: 'center' },
  itemDivider: { height: 1, marginHorizontal: 16 },
  couponSection: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 14,
  },
  couponRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  couponIcon: { fontSize: 20 },
  couponLabel: { flex: 1, fontSize: 15 },
  couponArrow: { fontSize: 14 },
  billSection: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  billTitle: { fontSize: 16, marginBottom: 4 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  billItemName: { flex: 1, fontSize: 13 },
  billItemPrice: { fontSize: 13 },
  billLabel: { fontSize: 14 },
  billVal: { fontSize: 14 },
  freeBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  freeBadgeText: { fontSize: 11 },
  billDivider: { height: 1, marginVertical: 4 },
  billTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  billTotalLabel: { fontSize: 17 },
  billTotalVal: { fontSize: 20 },
  policySection: { padding: 16, gap: 6 },
  policyTitle: { fontSize: 14 },
  policyText: { fontSize: 12, lineHeight: 18 },
  checkoutBar: { padding: 14, borderTopWidth: 1 },
  checkoutBtn: { width: '100%' },
  checkoutBtnInner: {
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  checkoutBtnTotal: { color: '#fff', fontSize: 17 },
  checkoutBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  checkoutBtnLabel: { color: '#fff', fontSize: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 32 },
  emptyIllustration: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 22 },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  shopNowBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, marginTop: 4 },
  shopNowBtnText: { color: '#fff', fontSize: 16 },
  emptyTrust: { gap: 6, marginTop: 8 },
  emptyTrustText: { fontSize: 13, textAlign: 'center' },
});

export default CartScreen;
