// ============================================================
// FARM FRESH RN v4 — CartScreen
// Cart items · Slot picker · Price summary · Checkout CTA
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, Dimensions, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, withDelay, withSequence, Easing,
  FadeIn, FadeOut, Layout,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Spacing, Radius, Glass, Neomorph } from '../theme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import {
  IconPlus, IconMinus, IconClose, IconTruck,
  IconLeaf, IconCart, IconChevronRight,
} from '../components/icons';
import { getProduceIcon } from '../components/icons';

const { width: W } = Dimensions.get('window');

// ── Mock cart (replace with global store) ────────────────
const MOCK_CART = [
  { id: '1', name: 'Fresh Tomato',   price: 28,  unit: '500g',    qty: 2, mandiPrice: 18 },
  { id: '2', name: 'Alphonso Mango', price: 120, unit: '1kg',     qty: 1, mandiPrice: 85 },
  { id: '3', name: 'Red Onion',      price: 35,  unit: '1kg',     qty: 1, mandiPrice: 22 },
];

const DELIVERY_SLOTS = [
  { id: '1', label: '7 AM – 9 AM',   sub: 'Tomorrow morning' },
  { id: '2', label: '5 PM – 7 PM',   sub: 'Today evening'    },
  { id: '3', label: '8 AM – 10 AM',  sub: 'Day after'        },
];

// ── Cart Item ─────────────────────────────────────────────
const CartItem = ({
  item, onAdd, onRemove, onDelete,
}: {
  item: typeof MOCK_CART[0];
  onAdd: () => void;
  onRemove: () => void;
  onDelete: () => void;
}) => {
  const ProduceIcon = getProduceIcon(item.name);
  const scale = useSharedValue(1);

  const handleQtyChange = (fn: () => void) => {
    scale.value = withSequence(
      withSpring(1.08, { damping: 10, stiffness: 300 }),
      withSpring(1, { damping: 12 })
    );
    fn();
  };

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeIn.springify().damping(14)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify()}
      style={styles.cartItem}
    >
      {/* Icon */}
      <View style={styles.itemIcon}>
        <ProduceIcon size={44} />
      </View>

      {/* Info */}
      <View style={styles.itemInfo}>
        <Animated.Text style={styles.itemName} numberOfLines={1}>{item.name}</Animated.Text>
        <Animated.Text style={styles.itemUnit}>{item.unit}</Animated.Text>
        <Animated.Text style={styles.itemPrice}>₹{item.price * item.qty}</Animated.Text>
      </View>

      {/* Qty */}
      <View style={styles.itemQty}>
        <AnimatedPressable onPress={() => handleQtyChange(onRemove)} scaleDown={0.88}>
          <View style={styles.qtyBtn}>
            <IconMinus size={12} color={Colors.brandGreen} strokeWidth={2.5} />
          </View>
        </AnimatedPressable>
        <Animated.View style={style}>
          <Animated.Text style={styles.qtyText}>{item.qty}</Animated.Text>
        </Animated.View>
        <AnimatedPressable onPress={() => handleQtyChange(onAdd)} scaleDown={0.88}>
          <View style={[styles.qtyBtn, styles.qtyBtnPlus]}>
            <IconPlus size={12} color={Colors.white} strokeWidth={2.5} />
          </View>
        </AnimatedPressable>
      </View>

      {/* Delete */}
      <AnimatedPressable onPress={onDelete} scaleDown={0.88} style={styles.deleteBtn}>
        <IconClose size={14} color={Colors.textMuted} strokeWidth={2} />
      </AnimatedPressable>
    </Animated.View>
  );
};

// ── Delivery Slot ─────────────────────────────────────────
const SlotOption = ({
  slot, isSelected, onPress,
}: {
  slot: typeof DELIVERY_SLOTS[0];
  isSelected: boolean;
  onPress: () => void;
}) => (
  <AnimatedPressable onPress={onPress} scaleDown={0.95}>
    <View style={[styles.slot, isSelected && styles.slotActive]}>
      <View style={[styles.slotRadio, isSelected && styles.slotRadioActive]}>
        {isSelected && <View style={styles.slotRadioDot} />}
      </View>
      <View style={{ gap: 2 }}>
        <Animated.Text style={[styles.slotLabel, isSelected && styles.slotLabelActive]}>
          {slot.label}
        </Animated.Text>
        <Animated.Text style={styles.slotSub}>{slot.sub}</Animated.Text>
      </View>
    </View>
  </AnimatedPressable>
);

// ── Main Screen ───────────────────────────────────────────
export const CartScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState(MOCK_CART);
  const [selectedSlot, setSelectedSlot] = useState(DELIVERY_SLOTS[0].id);
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-16);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 360 });
    headerY.value = withSpring(0, { damping: 14, stiffness: 100 });
  }, []);

  const handleAdd = (id: string) =>
    setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const handleRemove = (id: string) =>
    setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
  const handleDelete = (id: string) =>
    setCart(c => c.filter(i => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const mandiSavings = cart.reduce((s, i) => s + (i.price - i.mandiPrice) * i.qty, 0);
  const deliveryFee = subtotal >= 300 ? 0 : 20;
  const total = subtotal + deliveryFee;

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const isEmpty = cart.length === 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <LinearGradient colors={[Colors.bgDark, Colors.bgSecondary]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Text style={styles.title}>Your Cart</Animated.Text>
        {!isEmpty && (
          <View style={styles.itemCountPill}>
            <Animated.Text style={styles.itemCountText}>{cart.length} items</Animated.Text>
          </View>
        )}
      </Animated.View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <IconCart size={48} color={Colors.borderGlass} />
          <Animated.Text style={styles.emptyTitle}>Your cart is empty</Animated.Text>
          <Animated.Text style={styles.emptySub}>Add some fresh produce to get started</Animated.Text>
          <AnimatedPressable onPress={() => navigation.navigate('Home')} scaleDown={0.96}>
            <LinearGradient colors={[Colors.brandGreenLight, Colors.brandGreen]} style={styles.shopBtn}>
              <Animated.Text style={styles.shopBtnText}>Browse Produce</Animated.Text>
            </LinearGradient>
          </AnimatedPressable>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onAdd={() => handleAdd(item.id)}
              onRemove={() => handleRemove(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListFooterComponent={
            <View style={styles.footer}>

              {/* Delivery slot picker */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <IconTruck size={16} color={Colors.brandGreen} />
                  <Animated.Text style={styles.cardTitle}>Delivery Slot</Animated.Text>
                </View>
                <View style={styles.slots}>
                  {DELIVERY_SLOTS.map(slot => (
                    <SlotOption
                      key={slot.id}
                      slot={slot}
                      isSelected={selectedSlot === slot.id}
                      onPress={() => setSelectedSlot(slot.id)}
                    />
                  ))}
                </View>
              </View>

              {/* Price summary */}
              <View style={styles.card}>
                <Animated.Text style={styles.cardTitle}>Price Details</Animated.Text>
                <View style={styles.priceLines}>
                  <View style={styles.priceLine}>
                    <Animated.Text style={styles.priceLineLabel}>Subtotal</Animated.Text>
                    <Animated.Text style={styles.priceLineValue}>₹{subtotal}</Animated.Text>
                  </View>
                  <View style={styles.priceLine}>
                    <Animated.Text style={styles.priceLineLabel}>Delivery</Animated.Text>
                    <Animated.Text style={[styles.priceLineValue, deliveryFee === 0 && { color: Colors.success }]}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </Animated.Text>
                  </View>
                  <View style={styles.priceLine}>
                    <View style={styles.savingsRow}>
                      <IconLeaf size={12} color={Colors.success} />
                      <Animated.Text style={styles.savingsLabel}>Mandi savings</Animated.Text>
                    </View>
                    <Animated.Text style={styles.savingsValue}>-₹{mandiSavings}</Animated.Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.priceLine}>
                    <Animated.Text style={styles.totalLabel}>Total</Animated.Text>
                    <Animated.Text style={styles.totalValue}>₹{total}</Animated.Text>
                  </View>
                </View>
              </View>

              {deliveryFee > 0 && (
                <View style={styles.freeDeliveryBanner}>
                  <IconTruck size={14} color={Colors.brandGreen} />
                  <Animated.Text style={styles.freeDeliveryText}>
                    Add ₹{300 - subtotal} more for free delivery
                  </Animated.Text>
                </View>
              )}

            </View>
          }
        />
      )}

      {/* Checkout CTA */}
      {!isEmpty && (
        <View style={[styles.checkoutBar, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={styles.totalQuick}>
            <Animated.Text style={styles.totalQuickLabel}>Total</Animated.Text>
            <Animated.Text style={styles.totalQuickValue}>₹{total}</Animated.Text>
          </View>
          <AnimatedPressable
            onPress={() => navigation.navigate('Orders')}
            style={styles.checkoutBtnWrap}
            scaleDown={0.97}
          >
            <LinearGradient
              colors={[Colors.brandGreenLight, Colors.brandGreen]}
              style={styles.checkoutBtn}
            >
              <Animated.Text style={styles.checkoutText}>Place Order</Animated.Text>
              <IconChevronRight size={18} color={Colors.white} strokeWidth={2.5} />
            </LinearGradient>
          </AnimatedPressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDark },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.lg,
  },
  title: { fontFamily: Font.outfitBold, fontSize: 28, color: Colors.textOnDark, flex: 1 },
  itemCountPill: {
    backgroundColor: 'rgba(45,138,78,0.2)', borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  itemCountText: { fontFamily: Font.outfitSemiBold, fontSize: 13, color: Colors.brandGreen },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 120, gap: Spacing.sm },

  // ── Cart item ────────────────────────────────────────────
  cartItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  itemIcon: {
    width: 56, height: 56, borderRadius: Radius.sm,
    backgroundColor: '#E8EDE6',
    alignItems: 'center', justifyContent: 'center',
  },
  itemInfo: { flex: 1, gap: 3 },
  itemName: { fontFamily: Font.outfitMedium, fontSize: 14, color: Colors.textPrimary },
  itemUnit: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textMuted },
  itemPrice: { fontFamily: Font.outfitBold, fontSize: 15, color: Colors.textPrimary },
  itemQty: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: Radius.xs,
    backgroundColor: 'rgba(45,138,78,0.12)',
    borderWidth: 1, borderColor: Colors.borderMedium,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnPlus: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  qtyText: { fontFamily: Font.outfitBold, fontSize: 15, color: Colors.textPrimary, minWidth: 20, textAlign: 'center' },
  deleteBtn: { padding: 4 },

  // ── Footer ───────────────────────────────────────────────
  footer: { gap: Spacing.md, marginTop: Spacing.sm },
  card: {
    backgroundColor: Colors.bgSecondary, borderRadius: Radius.md,
    padding: Spacing.md, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardTitle: { fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.textPrimary },

  // ── Slots ─────────────────────────────────────────────────
  slots: { gap: Spacing.sm },
  slot: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.sm, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
    backgroundColor: 'rgba(45,138,78,0.04)',
  },
  slotActive: {
    borderColor: Colors.brandGreen,
    backgroundColor: 'rgba(45,138,78,0.10)',
  },
  slotRadio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.borderMedium,
    alignItems: 'center', justifyContent: 'center',
  },
  slotRadioActive: { borderColor: Colors.brandGreen },
  slotRadioDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.brandGreen,
  },
  slotLabel: { fontFamily: Font.jakartaSemiBold, fontSize: 14, color: Colors.textSecondary },
  slotLabelActive: { color: Colors.textPrimary },
  slotSub: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textMuted },

  // ── Price lines ──────────────────────────────────────────
  priceLines: { gap: Spacing.sm },
  priceLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLineLabel: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.textSecondary },
  priceLineValue: { fontFamily: Font.jakartaSemiBold, fontSize: 14, color: Colors.textPrimary },
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  savingsLabel: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.success },
  savingsValue: { fontFamily: Font.jakartaSemiBold, fontSize: 14, color: Colors.success },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 4 },
  totalLabel: { fontFamily: Font.outfitSemiBold, fontSize: 16, color: Colors.textPrimary },
  totalValue: { fontFamily: Font.outfitBold, fontSize: 18, color: Colors.textPrimary },

  // ── Free delivery banner ─────────────────────────────────
  freeDeliveryBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: 'rgba(45,138,78,0.08)',
    borderRadius: Radius.sm, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  freeDeliveryText: { fontFamily: Font.jakartaMedium, fontSize: 13, color: Colors.brandGreen },

  // ── Empty ─────────────────────────────────────────────────
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  emptyTitle: { fontFamily: Font.outfitBold, fontSize: 22, color: Colors.textOnDark },
  emptySub: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.textOnDarkMuted, textAlign: 'center' },
  shopBtn: {
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderRadius: Radius.md, marginTop: Spacing.sm,
  },
  shopBtnText: { fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.white },

  // ── Checkout bar ─────────────────────────────────────────
  checkoutBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    gap: Spacing.md,
  },
  totalQuick: { gap: 2 },
  totalQuickLabel: { fontFamily: Font.jakartaRegular, fontSize: 11, color: Colors.textMuted },
  totalQuickValue: { fontFamily: Font.outfitBold, fontSize: 20, color: Colors.textPrimary },
  checkoutBtnWrap: { flex: 1, borderRadius: Radius.md, overflow: 'hidden' },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, height: 50, borderRadius: Radius.md,
  },
  checkoutText: { fontFamily: Font.outfitSemiBold, fontSize: 16, color: Colors.white },
});
