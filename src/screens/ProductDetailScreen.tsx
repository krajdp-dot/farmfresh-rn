import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Font, fs, wp, hp, Radius } from '../theme';
import { ProductAPI } from '../api/client';
import { useCartStore } from '../stores/cartStore';
import { useLangStore } from '../stores/stores';
import { formatPrice, savingsPct } from '../utils/currency';
import type { ProductDetailRouteProp } from '../navigation/types';

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const { lang } = useLangStore();
  const cartQty = useCartStore((s) => s.getQty(productId));
  const { addItem, incrementQty, decrementQty } = useCartStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => ProductAPI.getById(productId).then((r) => r.data),
  });

  if (isLoading || !product) {
    return (
      <View style={[s.root, { paddingTop: insets.top }]}>
        <View style={s.skeleton} />
      </View>
    );
  }

  const name = lang === 'hi' && product.nameHi ? product.nameHi : product.name;
  const savings = product.mrp ? savingsPct(product.mrp, product.price) : 0;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <Pressable style={s.back} onPress={() => nav.goBack()}>
        <Text style={s.backText}>‹</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(120) }}>
        {/* Image */}
        <View style={s.imgWrap}>
          {product.image
            ? <Image source={{ uri: product.image }} style={s.img} contentFit="cover" />
            : <View style={[s.img, { alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontSize: fs(72) }}>🥬</Text></View>
          }
          {savings > 0 && (
            <View style={s.savingsBadge}>
              <Text style={s.savingsText}>{savings}% off</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={s.info}>
          <Text style={s.name}>{name}</Text>
          <View style={s.priceRow}>
            <Text style={s.price}>{formatPrice(product.price)}/{product.unit}</Text>
            {product.mrp && product.mrp > product.price && (
              <Text style={s.mrp}>MRP {formatPrice(product.mrp)}</Text>
            )}
          </View>
          {product.description && (
            <Text style={s.desc}>{product.description}</Text>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[s.footer, { paddingBottom: insets.bottom + hp(16) }]}>
        {cartQty === 0 ? (
          <Pressable style={s.addBtn} onPress={() => addItem({
            productId: product._id, name: product.name, nameHi: product.nameHi,
            price: product.price, mrp: product.mrp, unit: product.unit,
            step: product.step ?? 1, minQty: product.minQty ?? 1, maxQty: product.maxQty ?? 20,
            image: product.image, category: product.category,
          })}>
            <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={s.addBtnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={s.addBtnText}>Add to Cart</Text>
            </LinearGradient>
          </Pressable>
        ) : (
          <View style={s.stepper}>
            <Pressable style={s.stepBtn} onPress={() => decrementQty(product._id)}>
              <Text style={s.stepTxt}>−</Text>
            </Pressable>
            <Text style={s.stepQty}>{cartQty} {product.unit}</Text>
            <Pressable style={s.stepBtn} onPress={() => incrementQty(product._id)}>
              <Text style={s.stepTxt}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  skeleton: { height: wp(300), backgroundColor: Colors.surface1, margin: wp(16), borderRadius: Radius.xl },
  back: { position: 'absolute', top: hp(54), left: wp(16), zIndex: 10, width: wp(40), height: wp(40), backgroundColor: 'rgba(10,26,15,0.7)', borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: Font.outfit.bold, fontSize: fs(24), color: Colors.textPrimary, lineHeight: fs(26) },
  imgWrap: { width: '100%', height: wp(300), backgroundColor: Colors.surface1, position: 'relative' },
  img: { width: '100%', height: '100%' },
  savingsBadge: { position: 'absolute', top: hp(16), right: wp(16), backgroundColor: Colors.primary, paddingHorizontal: wp(10), paddingVertical: hp(4), borderRadius: Radius.full },
  savingsText: { fontFamily: Font.outfit.bold, fontSize: fs(12), color: Colors.white },
  info: { padding: wp(20), gap: hp(10) },
  name: { fontFamily: Font.outfit.bold, fontSize: fs(24), color: Colors.textPrimary, letterSpacing: -0.3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: wp(10) },
  price: { fontFamily: Font.jakarta.bold, fontSize: fs(22), color: Colors.accent },
  mrp: { fontFamily: Font.jakarta.regular, fontSize: fs(14), color: Colors.textMuted, textDecorationLine: 'line-through' },
  desc: { fontFamily: Font.outfit.regular, fontSize: fs(14), color: Colors.textSecondary, lineHeight: fs(22) },
  footer: { paddingHorizontal: wp(16), paddingTop: hp(12), borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.bg },
  addBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  addBtnGrad: { height: hp(54), alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontFamily: Font.outfit.semiBold, fontSize: fs(16), color: Colors.white },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: Radius.lg, height: hp(54) },
  stepBtn: { width: hp(54), height: hp(54), alignItems: 'center', justifyContent: 'center' },
  stepTxt: { fontFamily: Font.outfit.bold, fontSize: fs(22), color: Colors.white },
  stepQty: { flex: 1, textAlign: 'center', fontFamily: Font.jakarta.bold, fontSize: fs(16), color: Colors.white },
});
