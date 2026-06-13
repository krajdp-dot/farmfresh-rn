import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Clipboard } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLang } from '../../theme/LangContext';
import { useAuth } from '../../context/AuthContext';

export const ReferralCard: React.FC = () => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const { user } = useAuth();
  const code = user?.referralCode || ('FF' + (user?.phone?.slice(-4) ?? 'FARM'));

  const handleCopy = () => {
    Clipboard.setString(code);
    Alert.alert(isHindi ? 'कॉपी हो गया!' : 'Copied!', code);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' }]}>
      <Text style={[styles.title, { color: colors.primary, fontFamily: 'Outfit-Bold' }]}>
        🎁 {isHindi ? 'दोस्त को बुलाएं, ₹30 पाएं' : 'Refer a friend, earn ₹30'}
      </Text>
      <Text style={[styles.sub, { color: colors.textSecondary, fontFamily: 'Outfit-Regular' }]}>
        {isHindi ? 'आपका दोस्त भी ₹30 पाएगा' : 'Your friend also gets ₹30 off first order'}
      </Text>
      <TouchableOpacity onPress={handleCopy} activeOpacity={0.8}>
        <View style={[styles.codeBox, { borderColor: colors.primary, backgroundColor: colors.bg }]}>
          <Text style={[styles.code, { color: colors.primary, fontFamily: 'Outfit-Bold' }]}>{code}</Text>
          <Text style={[styles.hint, { color: colors.textMuted, fontFamily: 'Outfit-Regular' }]}>
            {isHindi ? 'कॉपी करें' : 'Tap to copy'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { margin: 16, borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  title: { fontSize: 16 },
  sub: { fontSize: 13 },
  codeBox: { borderWidth: 1.5, borderRadius: 10, borderStyle: 'dashed', padding: 14, alignItems: 'center', gap: 4 },
  code: { fontSize: 22, letterSpacing: 4 },
  hint: { fontSize: 11 },
});
