import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';
import { useCartStore } from '../../stores/cartStore';
import AnimatedPressable from '../AnimatedPressable';

const POPULAR = [
  { id: 'p1', name: 'Tomatoes',  nameHi: 'टमाटर', price: 25, unit: '1kg', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200', mandiPrice: 18 },
  { id: 'p2', name: 'Potatoes',  nameHi: 'आलू',   price: 22, unit: '1kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200', mandiPrice: 15 },
  { id: 'p3', name: 'Onions',    nameHi: 'प्याज़', price: 28, unit: '1kg', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=200', mandiPrice: 20 },
  { id: 'p4', name: 'Spinach',   nameHi: 'पालक',  price: 18, unit: '500g', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200', mandiPrice: 12 },
];

export const EmptyCartUpsell: React.FC = () => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const addItem = useCartStore(s => s.addItem);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.text, fontFamily: 'Outfit-Bold' }]}>
        🌿 {isHindi ? 'लोकप्रिय अभी' : 'Popular Right Now'}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {POPULAR.map(item => (
          <View key={item.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image source={{ uri: item.image }} style={styles.img} resizeMode="cover" />
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.text, fontFamily: 'Outfit-SemiBold' }]} numberOfLines={1}>
                {isHindi ? item.nameHi : item.name}
              </Text>
              <Text style={[styles.unit, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>{item.unit}</Text>
              <Text style={[styles.price, { color: colors.primary, fontFamily: 'Outfit-Bold' }]}>₹{item.price}</Text>
            </View>
            <AnimatedPressable onPress={() => addItem({ id: item.id, name: item.name, nameHi: item.nameHi, price: item.price, unit: item.unit, image: item.image, mandiPrice: item.mandiPrice })} scale={0.9}>
              <View style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.addBtnText}>+</Text>
              </View>
            </AnimatedPressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 10, marginTop: 8 },
  title: { fontSize: 15, textAlign: 'center' },
  row: { gap: 10, paddingHorizontal: 4 },
  card: { width: 110, borderRadius: 12, borderWidth: 1, overflow: 'hidden', alignItems: 'center', paddingBottom: 10 },
  img: { width: '100%', height: 80 },
  info: { padding: 6, alignItems: 'center', gap: 2 },
  name: { fontSize: 12 },
  unit: { fontSize: 11 },
  price: { fontSize: 14 },
  addBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 20, fontFamily: 'Outfit-Bold', lineHeight: 24 },
});
