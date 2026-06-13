import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface Props { isHindi: boolean; }

export const FarmerStory: React.FC<Props> = ({ isHindi }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.block, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
          <Text style={styles.avatarText}>🧑‍🌾</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text, fontFamily: 'Outfit-Bold' }]}>
            {isHindi ? 'रामलाल गुप्ता — भागलपुर मंडी' : 'Ramlal Gupta — Bhagalpur Mandi'}
          </Text>
          <Text style={[styles.sub, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>
            {isHindi ? '15+ साल का अनुभव · ट्रेडर' : '15+ years · Verified Mandi Trader'}
          </Text>
          <View style={[styles.verifiedRow, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.verified, { color: colors.primary }]}>✓ {isHindi ? 'सत्यापित सप्लायर' : 'Verified Supplier'}</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.story, { color: colors.textSecondary, fontFamily: 'Outfit-Regular' }]}>
        {isHindi
          ? 'रामलाल जी भागलपुर मंडी के सबसे भरोसेमंद व्यापारी हैं। हर सुबह 4 बजे मंडी पहुंचते हैं और सबसे ताज़ी सब्ज़ियाँ हमें देते हैं।'
          : 'Ramlal arrives at Bhagalpur Mandi every morning at 4 AM. He hand-selects the freshest produce for Farm Fresh before 6 AM — no cold storage, straight to your home.'}
      </Text>
      <View style={styles.tags}>
        {['🌿 Fresh Supply', '✅ Quality Tested', '🚫 No Chemicals', '⚡ Daily 6AM'].map((tag, i) => (
          <View key={i} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  block: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 12 },
  header: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28 },
  name: { fontSize: 14 },
  sub: { fontSize: 12, marginTop: 1 },
  verifiedRow: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 3 },
  verified: { fontSize: 11, fontFamily: 'Outfit-Medium' },
  story: { fontSize: 14, lineHeight: 21 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  tagText: { fontSize: 12, fontFamily: 'Outfit-Medium' },
});
