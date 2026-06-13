import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { price: number; mandiPrice: number; isHindi?: boolean; }

export const MandiSavingsBadge: React.FC<Props> = ({ price, mandiPrice, isHindi = false }) => {
  if (!mandiPrice || mandiPrice <= price) return null;
  const saving = mandiPrice - price;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>↓ ₹{saving} {isHindi ? 'बचत' : 'off MRP'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(45,138,78,0.85)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  text: { color: '#fff', fontSize: 9, fontFamily: 'Outfit-SemiBold' },
});
