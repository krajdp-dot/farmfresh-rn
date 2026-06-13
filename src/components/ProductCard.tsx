import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import { useCartStore } from '../stores/cartStore';
import AnimatedPressable from './AnimatedPressable';
import { spacing, radius, fontSize, fontFamily, SCREEN_WIDTH } from '../theme/tokens';

interface ProductCardProps {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  mandiPrice?: number;
  unit: string;
  image: string;
  onPress?: () => void;
}

const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2;

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  nameHi,
  price,
  mandiPrice,
  unit,
  image,
  onPress,
}) => {
  const { colors } = useTheme();
  const { isHindi, t } = useLang();
  const qty = useCartStore((s) => s.getQty(id));
  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQty);

  const displayName = isHindi ? nameHi : name;
  const savings = mandiPrice ? mandiPrice - price : 0;

  return (
    <AnimatedPressable onPress={onPress} style={[styles.card, { width: CARD_WIDTH }]}>
      <View style={[styles.inner, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Image */}
        <View style={[styles.imageWrap, { backgroundColor: colors.bgSecondary }]}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          {savings > 0 && (
            <View style={[styles.savingsBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.savingsText}>
                {t('youSave')} ₹{savings}
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              {
                color: colors.text,
                fontFamily: isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold',
              },
            ]}
            numberOfLines={2}
          >
            {displayName}
          </Text>

          <Text
            style={[
              styles.unit,
              { color: colors.textMuted, fontFamily: 'Outfit-Regular' },
            ]}
          >
            {unit}
          </Text>

          {/* Mandi price */}
          {mandiPrice && (
            <View style={styles.mandiRow}>
              <Text style={[styles.mandiLabel, { color: colors.mandiText, fontFamily: 'Outfit-Medium' }]}>
                {t('mandiPrice')}
              </Text>
              <Text style={[styles.mandiVal, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>
                ₹{mandiPrice}
              </Text>
            </View>
          )}

          {/* Price + Add */}
          <View style={styles.priceRow}>
            <Text
              style={[
                styles.price,
                { color: colors.text, fontFamily: 'Outfit-Bold' },
              ]}
            >
              ₹{price}
            </Text>

            {qty === 0 ? (
              <AnimatedPressable
                onPress={() =>
                  addItem({ id, name, nameHi, price, unit, image, mandiPrice })
                }
                scale={0.92}
              >
                <View style={[styles.addBtn, { borderColor: colors.primary }]}>
                  <Text style={[styles.addBtnText, { color: colors.primary, fontFamily: 'Outfit-Bold' }]}>
                    {t('addToCart')}
                  </Text>
                </View>
              </AnimatedPressable>
            ) : (
              <View style={[styles.qtyControl, { borderColor: colors.primary }]}>
                <AnimatedPressable
                  onPress={() => updateQty(id, qty - 1)}
                  scale={0.88}
                >
                  <Text style={[styles.qtyBtn, { color: colors.primary, fontFamily: 'Outfit-Bold' }]}>−</Text>
                </AnimatedPressable>
                <Text style={[styles.qtyVal, { color: colors.primary, fontFamily: 'Outfit-Bold' }]}>
                  {qty}
                </Text>
                <AnimatedPressable
                  onPress={() => updateQty(id, qty + 1)}
                  scale={0.88}
                >
                  <Text style={[styles.qtyBtn, { color: colors.primary, fontFamily: 'Outfit-Bold' }]}>+</Text>
                </AnimatedPressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  inner: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  imageWrap: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  savingsBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  savingsText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Outfit-SemiBold',
  },
  info: {
    padding: spacing.sm + 2,
    gap: 3,
  },
  name: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  unit: {
    fontSize: 11,
  },
  mandiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  mandiLabel: {
    fontSize: 10,
  },
  mandiVal: {
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: fontSize.md,
  },
  addBtn: {
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  addBtnText: {
    fontSize: 12,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  qtyBtn: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  qtyVal: {
    fontSize: 13,
    minWidth: 20,
    textAlign: 'center',
  },
});

export default ProductCard;
