import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Font, fs, wp, hp, Radius, Layout, Shadow } from '../../theme';
import { useCartStore } from '../../stores/cartStore';
import { useLangStore } from '../../stores/stores';
import type { Product } from '../../api/client';
import { formatPrice, savingsPct } from '../../utils/currency';

interface Props {
  product: Product;
  onPress?: () => void;
}

export default function ProductCard({ product, onPress }: Props) {
  const { lang } = useLangStore();
  const cartQty = useCartStore((s) => s.getQty(product._id));
  const { addItem, incrementQty, decrementQty } = useCartStore();

  const cardScale = useSharedValue(1);
  const addBtnScale = useSharedValue(1);
  const qtyScale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const addBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addBtnScale.value }],
  }));

  const qtyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyScale.value }],
  }));

  const handlePress = useCallback(() => {
    cardScale.value = withSequence(
      withSpring(0.96, { stiffness: 400, damping: 15 }),
      withSpring(1, { stiffness: 280, damping: 14 })
    );
    onPress?.();
  }, [onPress]);

  const handleAdd = useCallback(() => {
    addBtnScale.value = withSequence(
      withSpring(0.80, { stiffness: 500, damping: 12 }),
      withSpring(1, { stiffness: 300, damping: 14 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addItem({
      productId: product._id,
      name: product.name,
      nameHi: product.nameHi,
      price: product.price,
      mrp: product.mrp,
      unit: product.unit,
      step: product.step ?? 1,
      minQty: product.minQty ?? 1,
      maxQty: product.maxQty ?? 20,
      image: product.image,
      category: product.category,
    });
  }, [product]);

  const handleIncrement = useCallback(() => {
    qtyScale.value = withSequence(
      withSpring(1.15, { stiffness: 500, damping: 12 }),
      withSpring(1, { stiffness: 300 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    incrementQty(product._id);
  }, [product._id]);

  const handleDecrement = useCallback(() => {
    qtyScale.value = withSequence(
      withSpring(0.85, { stiffness: 500, damping: 12 }),
      withSpring(1, { stiffness: 300 })
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    decrementQty(product._id);
  }, [product._id]);

  const displayName = lang === 'hi' && product.nameHi ? product.nameHi : product.name;
  const savings = product.mrp ? savingsPct(product.mrp, product.price) : 0;
  const isOutOfStock = !product.inStock || product.comingSoon;

  return (
    <Animated.View style={[styles.cardWrap, cardStyle]}>
      <Pressable
        onPress={handlePress}
        disabled={isOutOfStock}
        style={styles.card}
        android_ripple={null}
      >
        {/* Neomorphic inner shadow top-left */}
        <View style={styles.neoHighlight} />

        {/* Image area */}
        <View style={styles.imageWrap}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderEmoji}>🥬</Text>
            </View>
          )}

          {/* Badges */}
          <View style={styles.badges}>
            {product.isNew && (
              <View style={[styles.badge, styles.badgeNew]}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {product.isBestseller && (
              <View style={[styles.badge, styles.badgeBestseller]}>
                <Text style={styles.badgeText}>⭐</Text>
              </View>
            )}
          </View>

          {/* Savings badge */}
          {savings > 0 && (
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>{savings}% off</Text>
            </View>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>
                {product.comingSoon ? 'Coming\nSoon' : 'Out of\nStock'}
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{displayName}</Text>

          {/* Price row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.unit}>/{product.unit}</Text>
            {product.mrp && product.mrp > product.price && (
              <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text>
            )}
          </View>

          {/* Add / Stepper */}
          {!isOutOfStock && (
            <View style={styles.actionRow}>
              {cartQty === 0 ? (
                <Animated.View style={[styles.addBtnWrap, addBtnStyle]}>
                  <Pressable style={styles.addBtn} onPress={handleAdd}>
                    <LinearGradient
                      colors={[Colors.primary, Colors.primaryLight]}
                      style={styles.addBtnGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.addBtnText}>+ Add</Text>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              ) : (
                <View style={styles.stepper}>
                  <Pressable style={styles.stepBtn} onPress={handleDecrement}>
                    <Text style={styles.stepBtnText}>−</Text>
                  </Pressable>
                  <Animated.View style={qtyStyle}>
                    <Text style={styles.stepQty}>{cartQty}</Text>
                  </Animated.View>
                  <Pressable style={styles.stepBtn} onPress={handleIncrement}>
                    <Text style={styles.stepBtnText}>+</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_W = Layout.cardW;

const styles = StyleSheet.create({
  cardWrap: {
    width: CARD_W,
  },
  card: {
    width: CARD_W,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },

  // Neomorphic top-left highlight
  neoHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: 'rgba(255,255,255,0.025)',
    zIndex: 0,
  },

  imageWrap: {
    width: '100%',
    height: CARD_W * 0.85,
    backgroundColor: Colors.surface2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface2,
  },
  placeholderEmoji: {
    fontSize: fs(36),
    opacity: 0.5,
  },

  badges: {
    position: 'absolute',
    top: hp(6),
    left: wp(6),
    flexDirection: 'row',
    gap: wp(4),
  },
  badge: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderRadius: Radius.sm,
  },
  badgeNew: { backgroundColor: Colors.primary },
  badgeBestseller: { backgroundColor: '#1A1A00' },
  badgeText: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(8),
    color: Colors.white,
    letterSpacing: 0.5,
  },

  savingsBadge: {
    position: 'absolute',
    bottom: hp(6),
    right: wp(6),
    backgroundColor: 'rgba(45,138,78,0.85)',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderRadius: Radius.sm,
  },
  savingsText: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(9),
    color: Colors.white,
  },

  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,26,15,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(12),
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  info: {
    padding: wp(10),
    gap: hp(4),
  },
  name: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(13),
    color: Colors.textPrimary,
    lineHeight: fs(18),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: wp(3),
  },
  price: {
    fontFamily: Font.jakarta.bold,
    fontSize: fs(15),
    color: Colors.accent,
  },
  unit: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(11),
    color: Colors.textMuted,
  },
  mrp: {
    fontFamily: Font.jakarta.regular,
    fontSize: fs(11),
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },

  actionRow: {
    marginTop: hp(4),
  },
  addBtnWrap: { overflow: 'hidden', borderRadius: Radius.md },
  addBtn: { borderRadius: Radius.md, overflow: 'hidden' },
  addBtnGradient: {
    height: hp(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  addBtnText: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(13),
    color: Colors.white,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: hp(32),
    overflow: 'hidden',
  },
  stepBtn: {
    width: hp(32),
    height: hp(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(18),
    color: Colors.white,
    lineHeight: fs(20),
  },
  stepQty: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Font.jakarta.bold,
    fontSize: fs(14),
    color: Colors.white,
  },
});
