import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, StatusBar, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import AnimatedPressable from '../components/AnimatedPressable';

interface Props {
  onSubmit: (phone: string) => void;
}

const PhoneEntryScreen: React.FC<Props> = ({ onSubmit }) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();
  const insets = useSafeAreaInsets();
  const [phone, setPhone]   = useState('');
  const [focused, setFocused] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const boldFont = isHindi ? 'Baloo2-Bold'    : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular' : 'Outfit-Regular';
  const semiBold = isHindi ? 'Baloo2-SemiBold': 'Outfit-SemiBold';
  const medFont  = isHindi ? 'Baloo2-Medium'  : 'Outfit-Medium';

  const isValid = phone.length === 10 && /^[6-9]\d{9}$/.test(phone);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 7,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const handleNext = () => {
    if (!isValid) { shake(); return; }
    onSubmit(phone);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* Veggie strip */}
      <View style={[styles.topStrip, { backgroundColor: colors.primary }]}>
        <View style={styles.stripRow}>
          {['🥕','🍅','🥬','🧅','🌽','🥦','🫑','🥒'].map((e, i) => (
            <Text key={i} style={styles.stripEmoji}>{e}</Text>
          ))}
        </View>
      </View>

      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>

        {/* Brand pill */}
        <View style={styles.headingBlock}>
          <View style={[styles.brandPill, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.brandLeaf}>🌿</Text>
            <Text style={[styles.brandText, { color: colors.primary, fontFamily: semiBold }]}>
              Farm Fresh · Bhagalpur
            </Text>
          </View>
          <Text style={[styles.heading, { color: colors.text, fontFamily: boldFont }]}>
            {t('enterPhone')}
          </Text>
          <Text style={[styles.sub, { color: colors.textSecondary, fontFamily: bodyFont }]}>
            {isHindi ? 'OTP आपके नंबर पर SMS से आएगा' : 'OTP will be sent via SMS to your number'}
          </Text>
        </View>

        {/* Phone input */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={[styles.inputCard, {
            backgroundColor: colors.card,
            borderColor: focused ? colors.primary : colors.border,
          }]}>
            <View style={[styles.countryBadge, { backgroundColor: colors.bgSecondary }]}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={[styles.countryCode, { color: colors.text, fontFamily: boldFont }]}>+91</Text>
            </View>
            <View style={[styles.inputDivider, { backgroundColor: colors.border }]} />
            <TextInput
              style={[styles.phoneInput, { color: colors.text, fontFamily: boldFont }]}
              placeholder={isHindi ? '10 अंकों का नंबर' : '10-digit number'}
              placeholderTextColor={colors.textMuted}
              value={phone.replace(/(\d{5})(\d{0,5})/, '$1 $2').trim()}
              onChangeText={v => setPhone(v.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              maxLength={11}
              autoFocus
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {phone.length > 0 && (
              <TouchableOpacity onPress={() => setPhone('')} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <View style={[styles.clearBtn, { backgroundColor: colors.bgTertiary }]}>
                  <Text style={[styles.clearBtnText, { color: colors.textMuted }]}>✕</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Hints */}
          <View style={styles.hintRow}>
            {phone.length > 0 && phone.length < 10 && (
              <Text style={[styles.hint, { color: colors.textMuted, fontFamily: bodyFont }]}>
                {10 - phone.length} {isHindi ? 'अंक और' : 'more digits needed'}
              </Text>
            )}
            {isValid && (
              <Text style={[styles.hint, { color: colors.primary, fontFamily: medFont }]}>
                ✓ {isHindi ? 'नंबर सही है' : 'Valid number'}
              </Text>
            )}
            {phone.length === 10 && !isValid && (
              <Text style={[styles.hint, { color: colors.red, fontFamily: bodyFont }]}>
                {isHindi ? 'गलत — 6-9 से शुरू होना चाहिए' : 'Must start with 6-9'}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* CTA */}
        <AnimatedPressable onPress={handleNext} scale={0.97}>
          <View style={[styles.ctaBtn, { backgroundColor: isValid ? colors.primary : colors.bgTertiary }]}>
            <Text style={[styles.ctaBtnText, { color: isValid ? '#fff' : colors.textMuted, fontFamily: boldFont }]}>
              {t('sendOTP')} →
            </Text>
          </View>
        </AnimatedPressable>

        {/* Trust row */}
        <View style={[styles.trustRow, { borderColor: colors.border }]}>
          {[
            { icon: '🔒', text: isHindi ? 'सुरक्षित' : 'Secure' },
            { icon: '⚡', text: isHindi ? 'तेज़' : 'Fast' },
            { icon: '📵', text: isHindi ? 'स्पैम नहीं' : 'No Spam' },
          ].map((item, i) => (
            <View key={i} style={styles.trustItem}>
              <Text style={styles.trustIcon}>{item.icon}</Text>
              <Text style={[styles.trustText, { color: colors.textMuted, fontFamily: bodyFont }]}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Offer card */}
        <View style={[styles.offerCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <Text style={styles.offerEmoji}>🎁</Text>
          <View style={styles.offerText}>
            <Text style={[styles.offerTitle, { color: colors.primary, fontFamily: boldFont }]}>
              {isHindi ? 'नए यूज़र ऑफर' : 'New User Offer'}
            </Text>
            <Text style={[styles.offerSub, { color: colors.textSecondary, fontFamily: bodyFont }]}>
              {isHindi ? 'KISAN80 कोड से ₹80 छूट पहले ऑर्डर पर' : 'Use KISAN80 for ₹80 off on first order'}
            </Text>
          </View>
        </View>

        <Text style={[styles.terms, { color: colors.textMuted, fontFamily: bodyFont }]}>
          {isHindi ? 'जारी रखने पर आप हमारी शर्तें मानते हैं' : 'By continuing, you agree to our Terms & Privacy Policy'}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topStrip: { paddingVertical: 10, overflow: 'hidden' },
  stripRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 8 },
  stripEmoji: { fontSize: 20 },
  content: { flex: 1, paddingHorizontal: 24, gap: 18 },
  headingBlock: { gap: 8 },
  brandPill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  brandLeaf: { fontSize: 14 },
  brandText: { fontSize: 13 },
  heading: { fontSize: 26, lineHeight: 32 },
  sub: { fontSize: 14, lineHeight: 20 },
  inputCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1.5,
    height: 58, paddingHorizontal: 14, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 4,
  },
  countryBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  flag: { fontSize: 18 },
  countryCode: { fontSize: 16 },
  inputDivider: { width: 1, height: 26 },
  phoneInput: { flex: 1, fontSize: 22, letterSpacing: 2, padding: 0 },
  clearBtn: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  clearBtnText: { fontSize: 10 },
  hintRow: { minHeight: 18, paddingTop: 5, paddingLeft: 2 },
  hint: { fontSize: 13 },
  ctaBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ctaBtnText: { fontSize: 17 },
  trustRow: { flexDirection: 'row', justifyContent: 'space-around', borderWidth: 1, borderRadius: 12, paddingVertical: 12 },
  trustItem: { alignItems: 'center', gap: 4 },
  trustIcon: { fontSize: 20 },
  trustText: { fontSize: 11 },
  offerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  offerEmoji: { fontSize: 26 },
  offerText: { flex: 1, gap: 2 },
  offerTitle: { fontSize: 14 },
  offerSub: { fontSize: 12, lineHeight: 17 },
  terms: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
});

export default PhoneEntryScreen;
