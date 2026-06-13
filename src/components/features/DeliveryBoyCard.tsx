import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';

interface Props { order: any; }

export const DeliveryBoyCard: React.FC<Props> = ({ order }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  if (!order?.deliveryBoy) return null;
  const db = order.deliveryBoy;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.left}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
          {db.photo
            ? <Image source={{ uri: db.photo }} style={styles.photo} />
            : <Text style={styles.avatarIcon}>🛵</Text>}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text, fontFamily: 'Outfit-Bold' }]}>{db.name}</Text>
          <Text style={[styles.sub, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>
            {isHindi ? 'आपका डिलीवरी पार्टनर' : 'Your delivery partner'}
          </Text>
          <View style={[styles.ratingBadge, { backgroundColor: colors.goldLight }]}>
            <Text style={[styles.rating, { color: colors.gold, fontFamily: 'Outfit-SemiBold' }]}>⭐ {db.rating ?? '4.8'}</Text>
          </View>
        </View>
      </View>
      {db.phone && (
        <TouchableOpacity onPress={() => Linking.openURL('tel:' + db.phone)} activeOpacity={0.8}>
          <View style={[styles.callBtn, { backgroundColor: colors.primary }]}>
            <Text style={styles.callIcon}>📞</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { margin: 16, borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  avatarIcon: { fontSize: 26 },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 15 },
  sub: { fontSize: 12 },
  ratingBadge: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  rating: { fontSize: 11 },
  callBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  callIcon: { fontSize: 20 },
});
