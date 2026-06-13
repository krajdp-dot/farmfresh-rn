import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props { onPress: () => void; }

export const SabziBasketBanner: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.wrap}>
    <View style={styles.banner}>
      <View style={styles.left}>
        <Text style={[styles.title, { fontFamily: 'Outfit-Bold' }]}>🧺 Weekly Sabzi Basket</Text>
        <Text style={[styles.sub, { fontFamily: 'Outfit-Regular' }]}>Fresh veggies weekly — set it & forget it</Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>From ₹199/week</Text>
        </View>
      </View>
      <Text style={styles.emoji}>🧺</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 16 },
  banner: { backgroundColor: '#0A2A15', borderRadius: 16, borderWidth: 1, borderColor: '#1A5C35', padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flex: 1, gap: 6 },
  title: { fontSize: 16, color: '#80EF80' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
  chip: { alignSelf: 'flex-start', backgroundColor: '#1A5C35', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  chipText: { color: '#80EF80', fontSize: 12, fontFamily: 'Outfit-SemiBold' },
  emoji: { fontSize: 44 },
});
