import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import OTPInput from '../components/OTPInput';
import AnimatedPressable from '../components/AnimatedPressable';

interface Props {
  phone: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
  error?: string;
}

const OTPScreen: React.FC<Props> = ({ phone, onVerify, onBack, error }) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();
  const insets = useSafeAreaInsets();
  const [timer, setTimer]       = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const boldFont = isHindi ? 'Baloo2-Bold'    : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular' : 'Outfit-Regular';
  const semiBold = isHindi ? 'Baloo2-SemiBold': 'Outfit-SemiBold';
  const medFont  = isHindi ? 'Baloo2-Medium'  : 'Outfit-Medium';

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0, duration: 30000, useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const id = setTimeout(() => setTimer(p => p - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0, duration: 30000, useNativeDriver: false,
    }).start();
    onBack(); // go back to re-send OTP
  };

  const handleComplete = async (otp: string) => {
    setVerifying(true);
    await onVerify(otp);
    setVerifying(false);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '100%'],
  });

  const maskedPhone = `+91 ${phone.slice(0, 2)}XXXXX${phone.slice(-3)}`;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}>
        <AnimatedPressable onPress={onBack} scale={0.9}>
          <View style={[styles.backBtn, { backgroundColor: colors.bgSecondary }]}>
            <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
          </View>
        </AnimatedPressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: boldFont }]}>
          {t('verifyOTP')}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Phone card */}
        <View style={[styles.phoneCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
          <View style={styles.phoneCardLeft}>
            <Text style={styles.phoneCardIcon}>📱</Text>
            <View>
              <Text style={[styles.phoneCardLabel, { color: colors.textMuted, fontFamily: bodyFont }]}>
                {t('otpSent')}
              </Text>
              <Text style={[styles.phoneCardNumber, { color: colors.primary, fontFamily: boldFont }]}>
                {maskedPhone}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Text style={[styles.changeBtn, { color: colors.primary, fontFamily: semiBold }]}>
              {isHindi ? 'बदलें' : 'Change'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timer bar */}
        <View style={styles.timerSection}>
          <View style={[styles.timerBar, { backgroundColor: colors.bgTertiary }]}>
            <Animated.View style={[styles.timerFill, { backgroundColor: colors.primary, width: progressWidth }]} />
          </View>
          <Text style={[styles.timerText, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {canResend
              ? (isHindi ? 'OTP एक्सपायर हो गया' : 'OTP expired')
              : `${isHindi ? 'एक्सपायर होगा' : 'Expires in'} ${timer}s`}
          </Text>
        </View>

        {/* OTP boxes */}
        <View style={styles.otpSection}>
          <Text style={[styles.otpLabel, { color: colors.textSecondary, fontFamily: bodyFont }]}>
            {isHindi ? '6 अंकों का OTP दर्ज करें' : 'Enter the 6-digit OTP'}
          </Text>
          <OTPInput onComplete={handleComplete} />
        </View>

        {/* Status */}
        {verifying && (
          <View style={[styles.statusPill, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.statusText, { color: colors.primary, fontFamily: medFont }]}>
              ⏳ {isHindi ? 'सत्यापित हो रहा है...' : 'Verifying...'}
            </Text>
          </View>
        )}
        {error ? (
          <View style={[styles.statusPill, { backgroundColor: colors.redLight }]}>
            <Text style={[styles.statusText, { color: colors.red, fontFamily: medFont }]}>
              ❌ {error}
            </Text>
          </View>
        ) : null}

        {/* Resend */}
        <View style={styles.resendSection}>
          <Text style={[styles.resendLabel, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {isHindi ? 'OTP नहीं मिला? ' : "Didn't receive the OTP? "}
          </Text>
          {canResend ? (
            <AnimatedPressable onPress={handleResend} scale={0.95}>
              <View style={[styles.resendBtn, { backgroundColor: colors.primary }]}>
                <Text style={[styles.resendBtnText, { fontFamily: boldFont }]}>{t('resendOTP')}</Text>
              </View>
            </AnimatedPressable>
          ) : (
            <Text style={[styles.resendTimer, { color: colors.textMuted, fontFamily: semiBold }]}>
              {t('resendIn')} {timer}s
            </Text>
          )}
        </View>

        {/* Demo hint */}
        <View style={[styles.demoCard, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
          <Text style={styles.demoIcon}>💡</Text>
          <View style={styles.demoText}>
            <Text style={[styles.demoTitle, { color: colors.text, fontFamily: semiBold }]}>
              {isHindi ? 'डेमो मोड' : 'Demo Mode'}
            </Text>
            <Text style={[styles.demoSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
              {isHindi ? 'Firebase बंद हो तो कोई भी 6 अंक डालें' : 'If Firebase is unavailable, enter any 6 digits'}
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20 },
  headerTitle: { fontSize: 18 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 28, gap: 22 },
  phoneCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, borderWidth: 1 },
  phoneCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  phoneCardIcon: { fontSize: 28 },
  phoneCardLabel: { fontSize: 12, marginBottom: 2 },
  phoneCardNumber: { fontSize: 16 },
  changeBtn: { fontSize: 14 },
  timerSection: { gap: 8 },
  timerBar: { height: 4, borderRadius: 999, overflow: 'hidden' },
  timerFill: { height: '100%', borderRadius: 999 },
  timerText: { fontSize: 12, textAlign: 'right' },
  otpSection: { gap: 14, alignItems: 'center' },
  otpLabel: { fontSize: 14 },
  statusPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: 'center' },
  statusText: { fontSize: 14 },
  resendSection: { alignItems: 'center', gap: 10 },
  resendLabel: { fontSize: 14 },
  resendBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  resendBtnText: { color: '#fff', fontSize: 15 },
  resendTimer: { fontSize: 14 },
  demoCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 14, borderRadius: 12, borderWidth: 1 },
  demoIcon: { fontSize: 20 },
  demoText: { flex: 1, gap: 2 },
  demoTitle: { fontSize: 14 },
  demoSub: { fontSize: 13, lineHeight: 18 },
});

export default OTPScreen;
