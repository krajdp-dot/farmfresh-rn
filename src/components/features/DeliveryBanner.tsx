import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';

export const DeliveryBanner: React.FC = () => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(20, 0, 0, 0);
      if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
      const diff = cutoff.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.wrap}>
      <View style={[styles.etaBar, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '40' }]}>
        <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.etaText, { color: colors.primary, fontFamily: 'Outfit-Medium' }]}>
          {isHindi ? 'अगली डिलीवरी: आज शाम 5–7 बजे' : 'Next delivery: Today 5–7 PM'}
        </Text>
        <View style={[styles.liveBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
      </View>
      <View style={[styles.cutoffBar, { backgroundColor: colors.goldLight, borderColor: colors.gold + '40' }]}>
        <Text style={styles.cutoffIcon}>⏰</Text>
        <Text style={[styles.cutoffText, { color: colors.gold, fontFamily: 'Outfit-Regular' }]}>
          {isHindi ? 'ऑर्डर बंद होने में: ' : 'Order cutoff in: '}
          <Text style={{ fontFamily: 'Outfit-Bold' }}>{timeLeft}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, gap: 8, marginVertical: 8 },
  etaBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  etaText: { flex: 1, fontSize: 13 },
  liveBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  liveBadgeText: { color: '#fff', fontSize: 10, fontFamily: 'Outfit-Bold' },
  cutoffBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  cutoffIcon: { fontSize: 16 },
  cutoffText: { fontSize: 13 },
});
