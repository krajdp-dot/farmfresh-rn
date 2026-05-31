import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { Colors, Font, fs, wp, hp, Radius, Layout } from '../theme';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore, useLangStore } from '../stores/stores';
import { OrderAPI, SettingsAPI, type Settings } from '../api/client';
import { t } from '../i18n';
import { formatPrice } from '../utils/currency';
import type { CartItem } from '../stores/cartStore';

// ─── Cart Item Row ────────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { incrementQty, decrementQty } = useCartStore();
  const { lang } = useLangStore();
  const name = lang === 'hi' && item.nameHi ? item.nameHi : item.name;
  const lineTotal = item.price * item.qty;

  return (
    <View style={styles.itemRow}>
      {/* Image */}
      <View style={styles.itemImg}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <Text style={{ fontSize: fs(22) }}>🥬</Text>
        )}
      </View>

      {/* Name + price */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}/{item.unit}</Text>
      </View>

      {/* Stepper */}
      <View style={styles.itemRight}>
        <View style={styles.stepper}>
          <Pressable style={styles.stepBtn} onPress={() => decrementQty(item.productId)}>
            <Text style={styles.stepIcon}>{item.qty <= item.minQty ? '🗑' : '−'}</Text>
          </Pressable>
          <Text style={styles.stepQty}>{item.qty}</Text>
          <Pressable style={styles.stepBtn} onPress={() => incrementQty(item.productId)}>
            <Text style={styles.stepIcon}>+</Text>
          </Pressable>
        </View>
        <Text style={styles.itemTotal}>{formatPrice(lineTotal)}</Text>
      </View>
    </View>
  );
}

// ─── Slot Picker ─────────────────────────────────────────────────────────────

function SlotPicker() {
  const { deliverySlot, deliveryDate, setSlot, setDate } = useCartStore();
  const { lang } = useLangStore();

  return (
    <View style={styles.slotSection}>
      <Text style={styles.slotTitle}>{t('deliverySlot', lang)}</Text>

      {/* Date */}
      <View style={styles.slotRow}>
        {(['today', 'tomorrow'] as const).map((d) => (
          <Pressable
            key={d}
            style={[styles.slotChip, deliveryDate === d && styles.slotChipActive]}
            onPress={() => setDate(d)}
          >
            <Text style={[styles.slotChipText, deliveryDate === d && styles.slotChipTextActive]}>
              {d === 'today' ? t('today', lang) : t('tomorrow', lang)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Time */}
      <View style={styles.slotRow}>
        {([
          { key: 'morning', label: '☀️  7am – 11am' },
          { key: 'evening', label: '🌙  4pm – 8pm' },
        ] as const).map((s) => (
          <Pressable
            key={s.key}
            style={[styles.slotChip, styles.slotChipWide, deliverySlot === s.key && styles.slotChipActive]}
            onPress={() => setSlot(s.key)}
          >
            <Text style={[styles.slotChipText, deliverySlot === s.key && styles.slotChipTextActive]}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Main CartScreen ──────────────────────────────────────────────────────────

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { lang } = useLangStore();
  const { user, isGuest } = useAuthStore();
  const {
    items,
    deliverySlot,
    deliveryDate,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    isEmpty,
    clearCart,
  } = useCartStore();

  const [placing, setPlacing] = useState(false);

  const { data: settings } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: () => SettingsAPI.get().then((r) => r.data),
  });

  const fee = settings?.deliveryWaived ? 0 : getDeliveryFee(settings?.freeDeliveryThreshold, settings?.deliveryFee);
  const subtotal = getSubtotal();
  const total = subtotal + fee;
  const itemList = Object.values(items);

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handlePlaceOrder = async () => {
    if (!user && !isGuest) {
      nav.navigate('Auth');
      return;
    }
    if (!user) {
      Alert.alert(t('loginToOrder', lang), '', [
        { text: t('cancel', lang), style: 'cancel' },
        { text: 'Login', onPress: () => nav.navigate('Auth') },
      ]);
      return;
    }
    if (!settings?.storeOpen) {
      Alert.alert(t('storeClosed', lang), t('storeClosedMsg', lang));
      return;
    }

    btnScale.value = withSpring(0.95, { stiffness: 400 }, () => {
      btnScale.value = withSpring(1);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setPlacing(true);
    try {
      const payload = {
        items: itemList.map((i) => ({
          product: i.productId,
          name: i.name,
          price: i.price,
          qty: i.qty,
          unit: i.unit,
        })),
        phone: user.phone,
        deliverySlot,
        deliveryDate,
        paymentMethod: 'cod' as const,
        address: 'Bhagalpur, Bihar',
      };
      const { data: order } = await OrderAPI.create(payload);
      clearCart();
      nav.navigate('Home', { screen: 'OrderDetail', params: { orderId: order._id } });
    } catch (e: any) {
      Alert.alert('Order failed', e?.response?.data?.message ?? 'Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // Empty state
  if (isEmpty()) {
    return (
      <View style={[styles.root, styles.empty, { paddingTop: insets.top }]}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>{t('emptyCart', lang)}</Text>
        <Text style={styles.emptySub}>{t('emptyCartSub', lang)}</Text>
        <Pressable
          style={styles.shopBtn}
          onPress={() => nav.navigate('Home')}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={styles.shopBtnGradient}
          >
            <Text style={styles.shopBtnText}>{t('shopNow', lang)}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('yourCart', lang)}</Text>
        <Text style={styles.headerCount}>{itemList.length} {itemList.length === 1 ? t('item', lang) : t('items', lang)}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Items */}
        <View style={styles.itemsCard}>
          {itemList.map((item, i) => (
            <React.Fragment key={item.productId}>
              <CartItemRow item={item} />
              {i < itemList.length - 1 && <View style={styles.itemDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Slot */}
        <SlotPicker />

        {/* Bill */}
        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>{t('subtotal', lang)}</Text>
            <Text style={styles.billValue}>{formatPrice(subtotal)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>{t('deliveryFee', lang)}</Text>
            {fee === 0 ? (
              <Text style={[styles.billValue, styles.freeText]}>{t('freeDelivery', lang)}</Text>
            ) : (
              <Text style={styles.billValue}>{formatPrice(fee)}</Text>
            )}
          </View>

          {fee > 0 && (
            <Text style={styles.freeThresholdNote}>
              Add ₹{Math.max(0, (settings?.freeDeliveryThreshold ?? 299) - subtotal)} more for free delivery
            </Text>
          )}

          <View style={[styles.billRow, styles.billTotalRow]}>
            <Text style={styles.billTotalLabel}>{t('total', lang)}</Text>
            <Text style={styles.billTotalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        <View style={{ height: hp(100) }} />
      </ScrollView>

      {/* Place Order */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + hp(16) }]}>
        <Animated.View style={[{ flex: 1 }, btnStyle]}>
          <Pressable style={styles.orderBtn} onPress={handlePlaceOrder} disabled={placing}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              style={styles.orderBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {placing ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.orderBtnText}>{t('placeOrder', lang)}</Text>
                  <Text style={styles.orderBtnTotal}>{formatPrice(total)}</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  // Empty
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(12),
    paddingHorizontal: wp(40),
  },
  emptyEmoji: { fontSize: fs(56) },
  emptyTitle: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(22),
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(14),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: fs(20),
  },
  shopBtn: { borderRadius: Radius.lg, overflow: 'hidden', marginTop: hp(8), width: wp(160) },
  shopBtnGradient: { height: hp(48), alignItems: 'center', justifyContent: 'center' },
  shopBtnText: { fontFamily: Font.outfit.semiBold, fontSize: fs(15), color: Colors.white },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(16),
    paddingVertical: hp(14),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(20),
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerCount: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(13),
    color: Colors.textMuted,
  },

  scrollContent: {
    gap: hp(12),
    padding: wp(16),
  },

  // Items card
  itemsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(14),
    gap: wp(12),
  },
  itemImg: {
    width: wp(52),
    height: wp(52),
    borderRadius: Radius.md,
    backgroundColor: Colors.surface2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1, gap: hp(3) },
  itemName: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(14),
    color: Colors.textPrimary,
    lineHeight: fs(19),
  },
  itemPrice: {
    fontFamily: Font.jakarta.regular,
    fontSize: fs(12),
    color: Colors.textSecondary,
  },
  itemRight: { alignItems: 'flex-end', gap: hp(6) },
  itemTotal: {
    fontFamily: Font.jakarta.semiBold,
    fontSize: fs(14),
    color: Colors.accent,
  },
  itemDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: wp(14),
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  stepBtn: {
    width: wp(32),
    height: wp(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: { fontSize: fs(15) },
  stepQty: {
    width: wp(28),
    textAlign: 'center',
    fontFamily: Font.jakarta.bold,
    fontSize: fs(14),
    color: Colors.textPrimary,
  },

  // Slot section
  slotSection: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: wp(16),
    gap: hp(10),
  },
  slotTitle: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(15),
    color: Colors.textPrimary,
  },
  slotRow: {
    flexDirection: 'row',
    gap: wp(8),
  },
  slotChip: {
    paddingHorizontal: wp(14),
    paddingVertical: hp(8),
    borderRadius: Radius.full,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotChipWide: { flex: 1, alignItems: 'center' },
  slotChipActive: {
    backgroundColor: Colors.bgGlassLight,
    borderColor: Colors.primary,
  },
  slotChipText: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(13),
    color: Colors.textSecondary,
  },
  slotChipTextActive: {
    color: Colors.textPrimary,
    fontFamily: Font.outfit.semiBold,
  },

  // Bill card
  billCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: wp(16),
    gap: hp(10),
  },
  billTitle: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(15),
    color: Colors.textPrimary,
    marginBottom: hp(2),
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(14),
    color: Colors.textSecondary,
  },
  billValue: {
    fontFamily: Font.jakarta.medium,
    fontSize: fs(14),
    color: Colors.textPrimary,
  },
  freeText: { color: Colors.success, fontFamily: Font.outfit.semiBold },
  freeThresholdNote: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(11),
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  billTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: hp(10),
    marginTop: hp(2),
  },
  billTotalLabel: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(16),
    color: Colors.textPrimary,
  },
  billTotalValue: {
    fontFamily: Font.jakarta.bold,
    fontSize: fs(18),
    color: Colors.accent,
  },

  // Footer
  footer: {
    paddingHorizontal: wp(16),
    paddingTop: hp(12),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  orderBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  orderBtnGradient: {
    height: hp(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(24),
  },
  orderBtnText: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(16),
    color: Colors.white,
  },
  orderBtnTotal: {
    fontFamily: Font.jakarta.bold,
    fontSize: fs(16),
    color: Colors.white,
  },
});
