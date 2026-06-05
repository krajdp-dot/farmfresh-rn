// ============================================================
// FARM FRESH RN v4 — ProductCard
// Neomorph on light bg · Weight pills · Mandi price · +/- qty
// ============================================================

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Colors, Neomorph, Shadow, Font, Spacing, Radius,
} from '../theme';
import { AnimatedPressable } from './AnimatedPressable';
import {
  IconPlus, IconMinus, IconStar, IconLeaf, IconTomato,
  IconCarrot, IconMango, IconOnion, IconPotato, IconBanana,
  getProduceIcon,
} from './icons';

interface Product {
  id: string;
  name: string;
  price: number;
  mandiPrice: number;
  unit: string;
  tag: string | null;
  category: string;
  image: string | null;
  rating: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  width: number;
  onPress: () => void;
  index?: number;
}

export const ProductCard = ({ product, width, onPress, index = 0 }: ProductCardProps) => {
  const [qty, setQty] = useState(0);

  // ── Entry animation ──────────────────────────────────────
  const entryOpacity = useSharedValue(0);
  const entryTranslateY = useSharedValue(20);

  React.useEffect(() => {
    entryOpacity.value = withDelay(
      index * 60,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) })
    );
    entryTranslateY.value = withDelay(
      index * 60,
      withSpring(0, { damping: 14, stiffness: 100 })
    );
  }, []);

  // ── Qty button scale ─────────────────────────────────────
  const plusScale = useSharedValue(1);
  const minusScale = useSharedValue(1);
  const qtyBadgeScale = useSharedValue(1);

  const handleAdd = useCallback(() => {
    setQty(q => q + 1);
    plusScale.value = withSpring(1.2, { damping: 10 }, () => {
      plusScale.value = withSpring(1, { damping: 12 });
    });
    qtyBadgeScale.value = withSpring(1.15, { damping: 10 }, () => {
      qtyBadgeScale.value = withSpring(1, { damping: 12 });
    });
  }, []);

  const handleRemove = useCallback(() => {
    setQty(q => Math.max(0, q - 1));
    minusScale.value = withSpring(1.2, { damping: 10 }, () => {
      minusScale.value = withSpring(1, { damping: 12 });
    });
  }, []);

  const entryStyle = useAnimatedStyle(() => ({
    opacity: entryOpacity.value,
    transform: [{ translateY: entryTranslateY.value }],
  }));

  const plusStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  const minusStyle = useAnimatedStyle(() => ({
    transform: [{ scale: minusScale.value }],
  }));

  const qtyBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyBadgeScale.value }],
  }));

  const savings = product.price - product.mandiPrice;
  const savingsPct = Math.round((savings / product.price) * 100);
  const ProduceIcon = getProduceIcon(product.name);

  return (
    <Animated.View style={[{ width }, entryStyle]}>
      <AnimatedPressable onPress={onPress} scaleDown={0.97}>
        <View style={[styles.card, { width }]}>

          {/* ── Image area ──────────────────────────── */}
          <View style={styles.imageWrap}>
            {/* Placeholder with produce SVG */}
            <LinearGradient
              colors={['#E8EDE6', '#D4DDD1']}
              style={styles.imagePlaceholder}
            >
              <ProduceIcon size={52} />
            </LinearGradient>

            {/* Out of stock overlay */}
            {!product.inStock && (
              <View style={styles.outOfStockOverlay}>
                <Animated.Text style={styles.outOfStockText}>Out of stock</Animated.Text>
              </View>
            )}

            {/* Tag badge */}
            {product.tag && (
              <View style={styles.tagBadge}>
                <Animated.Text style={styles.tagText}>{product.tag}</Animated.Text>
              </View>
            )}

            {/* Mandi savings badge */}
            {savingsPct > 0 && (
              <View style={styles.savingsBadge}>
                <Animated.Text style={styles.savingsText}>{savingsPct}% off MRP</Animated.Text>
              </View>
            )}
          </View>

          {/* ── Info ────────────────────────────────── */}
          <View style={styles.info}>
            <Animated.Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Animated.Text>

            {/* Unit pill */}
            <View style={styles.unitPill}>
              <Animated.Text style={styles.unitText}>{product.unit}</Animated.Text>
            </View>

            {/* Price row */}
            <View style={styles.priceRow}>
              <Animated.Text style={styles.price}>₹{product.price}</Animated.Text>
              <Animated.Text style={styles.mandiPrice}>
                Mandi ₹{product.mandiPrice}
              </Animated.Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <IconStar size={11} color={Colors.accentYellow} />
              <Animated.Text style={styles.ratingText}>{product.rating}</Animated.Text>
            </View>
          </View>

          {/* ── Qty control ─────────────────────────── */}
          {product.inStock && (
            <View style={styles.qtyRow}>
              {qty === 0 ? (
                <AnimatedPressable onPress={handleAdd} style={styles.addBtnWrap} scaleDown={0.93}>
                  <LinearGradient
                    colors={[Colors.brandGreenLight, Colors.brandGreen]}
                    style={styles.addBtn}
                  >
                    <IconPlus size={16} color={Colors.white} strokeWidth={2.5} />
                  </LinearGradient>
                </AnimatedPressable>
              ) : (
                <View style={styles.qtyControl}>
                  <AnimatedPressable onPress={handleRemove} scaleDown={0.88}>
                    <Animated.View style={[styles.qtyBtn, minusStyle]}>
                      <IconMinus size={14} color={Colors.brandGreen} strokeWidth={2.5} />
                    </Animated.View>
                  </AnimatedPressable>

                  <Animated.View style={[styles.qtyBadge, qtyBadgeStyle]}>
                    <Animated.Text style={styles.qtyText}>{qty}</Animated.Text>
                  </Animated.View>

                  <AnimatedPressable onPress={handleAdd} scaleDown={0.88}>
                    <Animated.View style={[styles.qtyBtn, styles.qtyBtnAdd, plusStyle]}>
                      <IconPlus size={14} color={Colors.white} strokeWidth={2.5} />
                    </Animated.View>
                  </AnimatedPressable>
                </View>
              )}
            </View>
          )}

        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

// ── SkeletonCard (same file for convenience) ──────────────
export const SkeletonCard = ({ width }: { width: number }) => {
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + shimmer.value * 0.4,
  }));

  return (
    <Animated.View style={[styles.card, { width }, shimmerStyle]}>
      <View style={[styles.imagePlaceholder, { backgroundColor: Colors.neomorphShadowLight }]} />
      <View style={styles.info}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '60%' }]} />
        <View style={[styles.skeletonLine, { width: '40%' }]} />
      </View>
    </Animated.View>
  );
};


// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    ...Neomorph.card,
    overflow: 'hidden',
    backgroundColor: Colors.bgSecondary,
  },

  // ── Image ────────────────────────────────────────────────
  imageWrap: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    fontFamily: Font.jakartaSemiBold,
    fontSize: 12,
    color: Colors.white,
  },
  tagBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accentOrange,
    borderRadius: Radius.xs,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: Font.jakartaSemiBold,
    fontSize: 10,
    color: Colors.white,
  },
  savingsBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    borderRadius: Radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  savingsText: {
    fontFamily: Font.jakartaSemiBold,
    fontSize: 9,
    color: Colors.success,
  },

  // ── Info ─────────────────────────────────────────────────
  info: {
    padding: Spacing.sm,
    gap: 4,
  },
  name: {
    fontFamily: Font.outfitMedium,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  unitPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(45,138,78,0.10)',
    borderRadius: Radius.xs,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  unitText: {
    fontFamily: Font.jakartaMedium,
    fontSize: 10,
    color: Colors.brandGreen,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
    marginTop: 2,
  },
  price: {
    fontFamily: Font.outfitBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  mandiPrice: {
    fontFamily: Font.jakartaRegular,
    fontSize: 10,
    color: Colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: Font.jakartaMedium,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  // ── Qty ──────────────────────────────────────────────────
  qtyRow: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    alignItems: 'flex-end',
  },
  addBtnWrap: {
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(45,138,78,0.12)',
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnAdd: {
    backgroundColor: Colors.brandGreen,
    borderColor: Colors.brandGreen,
  },
  qtyBadge: {
    minWidth: 28,
    alignItems: 'center',
  },
  qtyText: {
    fontFamily: Font.outfitBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },

  // ── Skeleton ─────────────────────────────────────────────
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D4DDD1',
    marginBottom: 6,
  },
});
