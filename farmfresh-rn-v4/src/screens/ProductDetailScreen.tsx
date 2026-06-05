// ============================================================
// FARM FRESH RN v4 — ProductDetailScreen
// Hero image · Mandi price comparison · Qty · Add to cart
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Dimensions, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedScrollHandler,
  withSpring, withTiming, withSequence, interpolate,
  Extrapolation, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Glass, Font, Spacing, Radius, Neomorph } from '../theme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import {
  IconChevronLeft, IconStar, IconLeaf, IconTruck,
  IconPlus, IconMinus, IconCart, IconCheck,
} from '../components/icons';
import { getProduceIcon } from '../components/icons';

const { width: W, height: H } = Dimensions.get('window');
const HERO_H = H * 0.40;

const WEIGHT_OPTIONS = ['250g', '500g', '1kg', '2kg'];

// ── Mandi price bar ───────────────────────────────────────
const MandiPriceBar = ({ ourPrice, mandiPrice }: { ourPrice: number; mandiPrice: number }) => {
  const savings = ourPrice - mandiPrice;
  const pct = Math.round((savings / ourPrice) * 100);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.exp) });
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * pct}%` as any,
  }));

  return (
    <View style={styles.mandiBar}>
      <View style={styles.mandiBarHeader}>
        <Animated.Text style={styles.mandiBarLabel}>Mandi to your door savings</Animated.Text>
        <Animated.Text style={styles.mandiBarPct}>{pct}% cheaper</Animated.Text>
      </View>
      <View style={styles.mandiBarTrack}>
        <Animated.View style={[styles.mandiBarFill, barStyle]} />
      </View>
      <View style={styles.mandiPriceRow}>
        <View style={styles.mandiPriceItem}>
          <Animated.Text style={styles.mandiPriceLabel}>Mandi rate</Animated.Text>
          <Animated.Text style={styles.mandiPriceValue}>₹{mandiPrice}/kg</Animated.Text>
        </View>
        <View style={styles.mandiPriceDivider} />
        <View style={styles.mandiPriceItem}>
          <Animated.Text style={styles.mandiPriceLabel}>Our price</Animated.Text>
          <Animated.Text style={[styles.mandiPriceValue, { color: Colors.brandGreen }]}>
            ₹{ourPrice}
          </Animated.Text>
        </View>
        <View style={styles.mandiPriceDivider} />
        <View style={styles.mandiPriceItem}>
          <Animated.Text style={styles.mandiPriceLabel}>You save</Animated.Text>
          <Animated.Text style={[styles.mandiPriceValue, { color: Colors.success }]}>
            ₹{savings}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
};

// ── Main Screen ───────────────────────────────────────────
export const ProductDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { product } = route.params;
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const [qty, setQty] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[1]);
  const [addedToCart, setAddedToCart] = useState(false);

  const qtyScale = useSharedValue(1);
  const ctaScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(30);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 400 });
    contentY.value = withSpring(0, { damping: 14, stiffness: 100 });
  }, []);

  const scrollHandler = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(scrollY.value, [0, HERO_H], [0, -HERO_H * 0.3], Extrapolation.CLAMP),
    }],
  }));

  const headerOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_H * 0.5, HERO_H * 0.8], [0, 1], Extrapolation.CLAMP),
    backgroundColor: `rgba(10,26,15,${interpolate(scrollY.value, [HERO_H * 0.4, HERO_H * 0.8], [0, 1], Extrapolation.CLAMP)})`,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const handleAdd = () => {
    setQty(q => q + 1);
    qtyScale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 12 })
    );
  };

  const handleRemove = () => {
    setQty(q => Math.max(1, q - 1));
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    ctaScale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1.02, { damping: 10 }),
      withSpring(1, { damping: 14 })
    );
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const qtyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyScale.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  const ProduceIcon = getProduceIcon(product.name);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Floating back + cart buttons */}
      <Animated.View style={[styles.floatingHeader, { paddingTop: insets.top + 8 }, headerOpacity]}>
        <AnimatedPressable onPress={() => navigation.goBack()} scaleDown={0.88}>
          <View style={styles.floatBtn}>
            <IconChevronLeft size={20} color={Colors.textOnDark} strokeWidth={2.2} />
          </View>
        </AnimatedPressable>
        <Animated.Text style={styles.floatTitle} numberOfLines={1}>{product.name}</Animated.Text>
        <AnimatedPressable onPress={() => navigation.navigate('Cart')} scaleDown={0.88}>
          <View style={styles.floatBtn}>
            <IconCart size={20} color={Colors.textOnDark} />
          </View>
        </AnimatedPressable>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, heroStyle]}>
          <LinearGradient colors={['#0F2318', '#1A3A22']} style={StyleSheet.absoluteFill} />
          <View style={styles.heroIcon}>
            <ProduceIcon size={130} />
          </View>

          {/* Back btn on hero */}
          <AnimatedPressable
            onPress={() => navigation.goBack()}
            style={[styles.heroBack, { top: insets.top + 8 }]}
            scaleDown={0.88}
          >
            <View style={styles.floatBtn}>
              <IconChevronLeft size={20} color={Colors.textOnDark} strokeWidth={2.2} />
            </View>
          </AnimatedPressable>

          {/* Tag */}
          {product.tag && (
            <View style={styles.heroTag}>
              <Animated.Text style={styles.heroTagText}>{product.tag}</Animated.Text>
            </View>
          )}

          {/* Gradient fade to content */}
          <LinearGradient
            colors={['transparent', Colors.bgSecondary]}
            style={styles.heroFade}
          />
        </Animated.View>

        {/* Content card */}
        <Animated.View style={[styles.content, contentStyle]}>

          {/* Name + Rating */}
          <View style={styles.nameRow}>
            <Animated.Text style={styles.name}>{product.name}</Animated.Text>
            <View style={styles.ratingBadge}>
              <IconStar size={13} color={Colors.accentYellow} />
              <Animated.Text style={styles.ratingText}>{product.rating}</Animated.Text>
            </View>
          </View>

          {/* Category pill */}
          <View style={styles.catPill}>
            <IconLeaf size={12} color={Colors.brandGreen} />
            <Animated.Text style={styles.catText}>{product.category}</Animated.Text>
          </View>

          {/* Weight options */}
          <View style={styles.section}>
            <Animated.Text style={styles.sectionLabel}>Select weight</Animated.Text>
            <View style={styles.weightRow}>
              {WEIGHT_OPTIONS.map(w => (
                <AnimatedPressable
                  key={w}
                  onPress={() => setSelectedWeight(w)}
                  scaleDown={0.92}
                >
                  <View style={[styles.weightChip, selectedWeight === w && styles.weightChipActive]}>
                    <Animated.Text style={[styles.weightText, selectedWeight === w && styles.weightTextActive]}>
                      {w}
                    </Animated.Text>
                  </View>
                </AnimatedPressable>
              ))}
            </View>
          </View>

          {/* Mandi savings bar */}
          <MandiPriceBar ourPrice={product.price} mandiPrice={product.mandiPrice} />

          {/* Delivery info */}
          <View style={styles.deliveryRow}>
            <IconTruck size={16} color={Colors.brandGreen} />
            <Animated.Text style={styles.deliveryText}>
              Same-day delivery · Picked this morning from Bhagalpur Mandi
            </Animated.Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Animated.Text style={styles.sectionLabel}>About</Animated.Text>
            <Animated.Text style={styles.description}>
              Sourced directly from Bhagalpur mandi every morning. No cold storage —
              fresh from the farm to your door within hours. Our{' '}
              <Animated.Text style={styles.descriptionBold}>direct mandi sourcing</Animated.Text>{' '}
              cuts out 2–3 middlemen, saving you up to {Math.round(((product.price - product.mandiPrice) / product.price) * 100)}% vs retail.
            </Animated.Text>
          </View>

        </Animated.View>
      </Animated.ScrollView>

      {/* Bottom CTA bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        {/* Price */}
        <View style={styles.priceBlock}>
          <Animated.Text style={styles.priceLabel}>Total</Animated.Text>
          <Animated.Text style={styles.price}>₹{product.price * qty}</Animated.Text>
        </View>

        {/* Qty control */}
        <View style={styles.qtyControl}>
          <AnimatedPressable onPress={handleRemove} scaleDown={0.88}>
            <View style={styles.qtyBtn}>
              <IconMinus size={14} color={Colors.brandGreen} strokeWidth={2.5} />
            </View>
          </AnimatedPressable>
          <Animated.View style={qtyStyle}>
            <Animated.Text style={styles.qtyText}>{qty}</Animated.Text>
          </Animated.View>
          <AnimatedPressable onPress={handleAdd} scaleDown={0.88}>
            <View style={[styles.qtyBtn, styles.qtyBtnPlus]}>
              <IconPlus size={14} color={Colors.white} strokeWidth={2.5} />
            </View>
          </AnimatedPressable>
        </View>

        {/* Add to cart */}
        <AnimatedPressable onPress={handleAddToCart} scaleDown={0.97} style={styles.ctaWrap}>
          <Animated.View style={ctaStyle}>
            <LinearGradient
              colors={addedToCart ? [Colors.success, '#16A34A'] : [Colors.brandGreenLight, Colors.brandGreen]}
              style={styles.ctaBtn}
            >
              {addedToCart
                ? <IconCheck size={20} color={Colors.white} strokeWidth={2.5} />
                : <IconCart size={18} color={Colors.white} />
              }
              <Animated.Text style={styles.ctaText}>
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </Animated.Text>
            </LinearGradient>
          </Animated.View>
        </AnimatedPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgSecondary },

  // ── Hero ────────────────────────────────────────────────
  hero: { height: HERO_H, overflow: 'hidden' },
  heroIcon: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  heroBack: { position: 'absolute', left: Spacing.base },
  heroTag: {
    position: 'absolute', bottom: 60, left: Spacing.base,
    backgroundColor: Colors.accentOrange, borderRadius: Radius.xs,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  heroTagText: { fontFamily: Font.jakartaSemiBold, fontSize: 12, color: Colors.white },
  heroFade: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
  },

  // ── Floating header ──────────────────────────────────────
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm,
    gap: Spacing.sm, zIndex: 20,
  },
  floatBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1, borderColor: Colors.borderGlass,
    alignItems: 'center', justifyContent: 'center',
  },
  floatTitle: {
    flex: 1, fontFamily: Font.outfitSemiBold,
    fontSize: 16, color: Colors.textOnDark,
  },

  // ── Content ──────────────────────────────────────────────
  content: {
    backgroundColor: Colors.bgSecondary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    minHeight: H * 0.65,
  },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  name: { flex: 1, fontFamily: Font.outfitBold, fontSize: 24, color: Colors.textPrimary, lineHeight: 32 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,209,102,0.12)',
    borderRadius: Radius.xs, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(255,209,102,0.25)',
  },
  ratingText: { fontFamily: Font.jakartaSemiBold, fontSize: 13, color: Colors.accentYellow },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    backgroundColor: 'rgba(45,138,78,0.10)',
    borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  catText: { fontFamily: Font.jakartaMedium, fontSize: 12, color: Colors.brandGreen },

  // ── Section ──────────────────────────────────────────────
  section: { gap: Spacing.sm },
  sectionLabel: { fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.textPrimary },

  // ── Weight ───────────────────────────────────────────────
  weightRow: { flexDirection: 'row', gap: Spacing.sm },
  weightChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 9,
    borderRadius: Radius.sm,
    backgroundColor: Colors.neomorphBg,
    borderWidth: 1.5, borderColor: Colors.borderLight,
  },
  weightChipActive: {
    backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen,
  },
  weightText: { fontFamily: Font.jakartaSemiBold, fontSize: 13, color: Colors.textSecondary },
  weightTextActive: { color: Colors.white },

  // ── Mandi bar ────────────────────────────────────────────
  mandiBar: {
    backgroundColor: Colors.neomorphBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  mandiBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mandiBarLabel: { fontFamily: Font.jakartaMedium, fontSize: 12, color: Colors.textSecondary },
  mandiBarPct: { fontFamily: Font.outfitBold, fontSize: 13, color: Colors.success },
  mandiBarTrack: {
    height: 6, backgroundColor: Colors.borderLight,
    borderRadius: 3, overflow: 'hidden',
  },
  mandiBarFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 3 },
  mandiPriceRow: { flexDirection: 'row', justifyContent: 'space-around' },
  mandiPriceItem: { alignItems: 'center', gap: 3 },
  mandiPriceDivider: { width: 1, backgroundColor: Colors.borderLight },
  mandiPriceLabel: { fontFamily: Font.jakartaRegular, fontSize: 11, color: Colors.textMuted },
  mandiPriceValue: { fontFamily: Font.outfitBold, fontSize: 15, color: Colors.textPrimary },

  // ── Delivery ─────────────────────────────────────────────
  deliveryRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: 'rgba(45,138,78,0.07)',
    borderRadius: Radius.sm, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  deliveryText: {
    flex: 1, fontFamily: Font.jakartaRegular,
    fontSize: 13, color: Colors.textSecondary, lineHeight: 20,
  },

  // ── Description ──────────────────────────────────────────
  description: {
    fontFamily: Font.jakartaRegular, fontSize: 14,
    color: Colors.textSecondary, lineHeight: 22,
  },
  descriptionBold: { fontFamily: Font.jakartaSemiBold, color: Colors.brandGreen },

  // ── Bottom bar ───────────────────────────────────────────
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    gap: Spacing.md,
  },
  priceBlock: { gap: 2 },
  priceLabel: { fontFamily: Font.jakartaRegular, fontSize: 11, color: Colors.textMuted },
  price: { fontFamily: Font.outfitBold, fontSize: 20, color: Colors.textPrimary },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  qtyBtn: {
    width: 32, height: 32, borderRadius: Radius.xs,
    backgroundColor: 'rgba(45,138,78,0.12)',
    borderWidth: 1, borderColor: Colors.borderMedium,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnPlus: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  qtyText: { fontFamily: Font.outfitBold, fontSize: 18, color: Colors.textPrimary, minWidth: 24, textAlign: 'center' },
  ctaWrap: { flex: 1, borderRadius: Radius.md, overflow: 'hidden' },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, height: 50, borderRadius: Radius.md,
  },
  ctaText: { fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.white },
});
