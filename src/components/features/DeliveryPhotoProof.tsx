import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';

interface Props { order: any; }

export const DeliveryPhotoProof: React.FC<Props> = ({ order }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  if (!order?.deliveryPhoto) return null;

  return (
    <View style={[styles.section, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text, fontFamily: 'Outfit-Bold' }]}>
        📸 {isHindi ? 'डिलीवरी फ़ोटो' : 'Delivery Photo'}
      </Text>
      <Image source={{ uri: order.deliveryPhoto }} style={styles.photo} resizeMode="cover" />
      <Text style={[styles.sub, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>
        {isHindi ? 'आपके दरवाज़े पर डिलीवर किया गया' : 'Delivered at your doorstep'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { margin: 16, borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  title: { fontSize: 15 },
  photo: { width: '100%', height: 200, borderRadius: 10 },
  sub: { fontSize: 12, textAlign: 'center' },
});
