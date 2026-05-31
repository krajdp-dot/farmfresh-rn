import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { OTPVerifyNavProp, OTPVerifyRouteProp } from '../../navigation/types';
import { Colors, Font, fs, wp, hp, Radius } from '../../theme';
import { useAuthStore } from '../../stores/stores';
import { AuthAPI } from '../../api/client';

const OTP_LEN = 6;

export default function OTPVerifyScreen() {
  const nav = useNavigation<OTPVerifyNavProp>();
  const route = useRoute<OTPVerifyRouteProp>();
  const insets = useSafeAreaInsets();
  const { phone } = route.params;
  const { setUser } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const refs = useRef<(TextInput | null)[]>([]);
  const shakeX = useSharedValue(0);
  const btnScale = useSharedValue(1);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);

    if (digit && idx < OTP_LEN - 1) {
      refs.current[idx + 1]?.focus();
    }
    // Auto-verify when last digit filled
    if (digit && idx === OTP_LEN - 1) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const finalOtp = code ?? otp.join('');
    if (finalOtp.length !== OTP_LEN) {
      shake();
      return;
    }

    btnScale.value = withSequence(
      withSpring(0.94, { stiffness: 400 }),
      withSpring(1, { stiffness: 300 })
    );

    setLoading(true);
    try {
      const { data } = await AuthAPI.verifyOTP(phone, finalOtp);
      await setUser(data.user, data.token);
      // Navigation handled by RootNavigator watching auth state
    } catch (e: any) {
      shake();
      setOtp(Array(OTP_LEN).fill(''));
      refs.current[0]?.focus();
      Alert.alert('Invalid OTP', e?.response?.data?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await AuthAPI.sendOTP(phone);
      setResendTimer(30);
      setOtp(Array(OTP_LEN).fill(''));
      refs.current[0]?.focus();
    } catch {
      Alert.alert('Error', 'Could not resend OTP');
    }
  };

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const isFilled = otp.every(Boolean);
  const maskedPhone = `+91 ••••• ${phone.slice(-5)}`;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#020A04', '#0A1A0F', '#0F2416']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.container, { paddingTop: insets.top + hp(48) }]}>

        {/* Back */}
        <Pressable style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headline}>Verify OTP</Text>
          <Text style={styles.sub}>
            6-digit code sent to{'\n'}
            <Text style={styles.phoneHighlight}>{maskedPhone}</Text>
          </Text>
        </View>

        {/* OTP boxes */}
        <Animated.View style={[styles.otpRow, shakeStyle]}>
          {otp.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.box,
                digit ? styles.boxFilled : null,
                i === otp.findIndex((d) => !d) && styles.boxActive,
              ]}
            >
              <TextInput
                ref={(r) => { refs.current[i] = r; }}
                style={styles.boxInput}
                value={digit}
                onChangeText={(v) => handleChange(v, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                caretHidden
              />
            </View>
          ))}
        </Animated.View>

        {/* Verify button */}
        <Animated.View style={btnStyle}>
          <Pressable
            style={[styles.btn, !isFilled && styles.btnDisabled]}
            onPress={() => handleVerify()}
            disabled={!isFilled || loading}
          >
            <LinearGradient
              colors={isFilled ? [Colors.primary, Colors.primaryLight] : [Colors.surface2, Colors.surface2]}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={[styles.btnText, !isFilled && styles.btnTextDisabled]}>
                  Verify & Continue
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Resend */}
        <Pressable onPress={handleResend} disabled={resendTimer > 0} style={styles.resendWrap}>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>Resend OTP in {resendTimer}s</Text>
          ) : (
            <Text style={styles.resendActive}>Resend OTP</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: wp(24),
    gap: hp(24),
  },
  backBtn: { alignSelf: 'flex-start' },
  backText: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(14),
    color: Colors.textSecondary,
  },

  header: { gap: hp(8) },
  headline: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(30),
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  sub: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(15),
    color: Colors.textSecondary,
    lineHeight: fs(22),
  },
  phoneHighlight: {
    fontFamily: Font.jakarta.semiBold,
    color: Colors.accent,
  },

  otpRow: {
    flexDirection: 'row',
    gap: wp(10),
    justifyContent: 'center',
    marginVertical: hp(8),
  },
  box: {
    width: wp(46),
    height: wp(54),
    backgroundColor: Colors.surface1,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.bgGlassLight,
  },
  boxActive: {
    borderColor: Colors.accent,
  },
  boxInput: {
    fontFamily: Font.jakarta.bold,
    fontSize: fs(22),
    color: Colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },

  btn: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  btnDisabled: { opacity: 0.6 },
  btnGradient: {
    height: hp(54),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(16),
    color: Colors.white,
  },
  btnTextDisabled: { color: Colors.textMuted },

  resendWrap: { alignItems: 'center', paddingVertical: hp(4) },
  resendTimer: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(14),
    color: Colors.textMuted,
  },
  resendActive: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(14),
    color: Colors.accent,
    textDecorationLine: 'underline',
  },
});
