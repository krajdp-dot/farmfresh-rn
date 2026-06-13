import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';
import { useCartStore } from '../../stores/cartStore';
import AnimatedPressable from '../AnimatedPressable';

interface Props { order: any; onDone: () => void; }

export const RepeatOrderButton: React.FC<Props> = ({ order, onDone }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const clearCart = useCartStore(s => s.clearCart);
  const addItem   = useCartStore(s => s.addItem);

  const handleRepeat = () => {
    Alert.alert(
      isHindi ? 'दोबारा ऑर्डर?' : 'Repeat Order?',
      isHindi ? 'कार्ट खाली होकर इस ऑर्डर के आइटम जुड़ेंगे।' : 'This will clear your cart and add these items.',
      [
        { text: isHindi ? 'रद्द' : 'Cancel', style: 'cancel' },
        { text: isHindi ? 'हाँ' : 'Yes', onPress: () => {
          clearCart();
          (order.items || []).forEach((item: any) => {
            addItem({ id: item.productId || item.id, name: item.name, nameHi: item.nameHi || item.name, price: item.price, unit: item.unit, image: item.image || '', mandiPrice: item.mrp });
          });
          onDone();
        }},
      ]
    );
  };

  return (
    <AnimatedPressable onPress={handleRepeat} scale={0.96}>
      <View style={[styles.btn, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}>
        <Text style={styles.icon}>🔄</Text>
        <Text style={[styles.text, { color: colors.primary, fontFamily: 'Outfit-SemiBold' }]}>
          {isHindi ? 'दोबारा ऑर्डर' : 'Repeat Order'}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, alignSelf: 'flex-start' },
  icon: { fontSize: 16 },
  text: { fontSize: 13 },
});
