// ============================================================
// FARM FRESH RN v4 — OTPScreen
// 6-box OTP · Auto-advance · Paste · Resend timer · Dark glass
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Clipboard,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path, Circle, Polyline, Defs, RadialGradient, Stop, Ellipse,
} from 'react-native-svg';
import { Colors, Glass, Font, Spacing, Radius } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { IconChevronLeft, IconCheck } from '../../components/icons';

const { width: W, height: H } = Dimensions.get('window');
const OTP_LENGTH = 6;
const BOX_SIZE = (W - Spacing.base * 2 - Spacing.sm * 5) / 6;
const RESEND_SECONDS = 30;

// ── Checkmark success SVG ─────────────────────────────────
const SuccessCircle = () => (
  <Svg width={64} height={64} viewBox="0 0 64 64">
    <Defs>
      <RadialGradient id="sglow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#80EF80" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#80EF80" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    <Circle cx="32" cy="32" r="32" fill="url(#sglow)" />
    <Circle cx="32" cy="32" r="26" fill="rgba(45,138,78,0.25)" stroke="#80EF80" strokeWidth="1.5" />
    <Path
      d="M20 32L28 40L44 24"
      stroke="#80EF80"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// ── OTP digit box ─────────────────────────────────────────
interface OTPBoxProps {
  value: string;
  isFocused: boolean;
  isSuccess: boolean;
  index: number;
}

const OTPBox = ({ value, isFocused, isSuccess, index }: OTPBoxProps) => {
  const scale = useSharedValue(1);
  const borderProgress = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      borderProgress.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1.06, { damping: 12, stiffness: 200 });
    } else {
      borderProgress.value = withTiming(0, { duration: 200 });
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }
  }, [isFocused]);

  useEffect(() => {
    if (value) {
      scale.value = withSequence(
        withSpring(1.12, { damping: 10, stiffness: 300 }),
        withSpring(1, { damping: 14, stiffness: 200 })
      );
    }
  }, [value]);

  useEffect(() => {
    if (isSuccess) {
      scale.value = withDelay(
        index * 60,
        withSpring(1.1, { damping: 10, stiffness: 250 })
      );
    }
  }, [isSuccess, index]);

  const boxStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderProgress.value,
      [0, 1],
      [Colors.borderGlass, Colors.logoGreen]
    );
    const bgColor = isSuccess
      ? 'rgba(45,138,78,0.30)'
      : isFocused
        ? 'rgba(255,255,255,0.12)'
        : 'rgba(255,255,255,0.06)';
    return {
      transform: [{ scale: scale.value }],
      borderColor,
      backgroundColor: bgColor,
    };
  });

  return (
    <Animated.View style={[styles.otpBox, boxStyle]}>
      <Animated.Text style={[
        styles.otpDigit,
        isSuccess && styles.otpDigitSuccess,
      ]}>
        {value ? '•' : isFocused ? '|' : ''}
      </Animated.Text>
    </Animated.View>
  );
};

// ── Resend Timer ──────────────────────────────────────────
interface ResendTimerProps {
  seconds: number;
  onResend: () => void;
}

const ResendTimer = ({ seconds, onResend }: ResendTimerProps) => {
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (seconds > 0) {
    return (
      <Animated.View style={[styles.resendRow, style]}>
        <Animated.Text style={styles.resendLabel}>
          Resend OTP in{' '}
          <Animated.Text style={styles.resendTimer}>{seconds}s</Animated.Text>
        </Animated.Text>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity onPress={onResend} activeOpacity={0.7}>
      <View style={styles.resendRow}>
        <Animated.Text style={styles.resendActive}>
          Didn't receive it?{' '}
          <Animated.Text style={styles.resendLink}>Resend OTP</Animated.Text>
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

// ── Main Screen ───────────────────────────────────────────
interface OTPScreenProps {
  route: { params: { phone: string } };
  navigation: any;
}

export const OTPScreen = ({ route, navigation }: OTPScreenProps) => {
  const { phone } = route.params;
  const { signIn } = useAuth();
  const maskedPhone = `+91 ${phone.slice(0, 2)}••••••${phone.slice(-2)}`;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // ── Animation values ────────────────────────────────────
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const boxesOpacity = useSharedValue(0);
  const boxesTranslateY = useSharedValue(24);
  const successOpacity = useSharedValue(0);
  const successScale = useSharedValue(0.5);
  const errorShakeX = useSharedValue(0);
  const errorOpacity = useSharedValue(0);

  // ── Mount ────────────────────────────────────────────────
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    headerTranslateY.value = withSpring(0, { damping: 14, stiffness: 100 });
    boxesOpacity.value = withDelay(150, withTiming(1, { duration: 380 }));
    boxesTranslateY.value = withDelay(150, withSpring(0, { damping: 14, stiffness: 100 }));

    // Auto-focus first box
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  // ── Countdown timer ──────────────────────────────────────
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ── Handle digit input ───────────────────────────────────
  const handleChange = useCallback((text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];

    if (!digit) {
      // Backspace
      newOtp[index] = '';
      setOtp(newOtp);
      setErrorMsg('');
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }
      return;
    }

    newOtp[index] = digit;
    setOtp(newOtp);
    setErrorMsg('');

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    } else {
      // Last box — blur and auto-submit
      inputRefs.current[index]?.blur();
      setFocusedIndex(-1);
      handleVerify(newOtp);
    }
  }, [otp]);

  // ── Handle paste ─────────────────────────────────────────
  const handlePaste = useCallback(async (index: number) => {
    try {
      const text = await Clipboard.getString();
      const digits = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
      if (digits.length === OTP_LENGTH) {
        const newOtp = digits.split('');
        setOtp(newOtp);
        inputRefs.current[OTP_LENGTH - 1]?.focus();
        setFocusedIndex(OTP_LENGTH - 1);
        handleVerify(newOtp);
      }
    } catch (_) {}
  }, []);

  // ── Handle key press for backspace on empty box ───────────
  const handleKeyPress = useCallback(({ nativeEvent }: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  }, [otp]);

  // ── Show error ───────────────────────────────────────────
  const showError = useCallback((msg: string) => {
    setErrorMsg(msg);
    errorOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(2000, withTiming(0, { duration: 300 }))
    );
    errorShakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  }, []);

  // ── Verify OTP ───────────────────────────────────────────
  const handleVerify = useCallback((otpArr: string[]) => {
    const code = otpArr.join('');
    if (code.length < OTP_LENGTH) return;

    setIsLoading(true);

    // TODO: Replace with real Firebase / backend OTP verification
    setTimeout(() => {
      setIsLoading(false);
      // Simulating success — replace with actual check
      const isCorrect = true;

      if (isCorrect) {
        setIsSuccess(true);
        successOpacity.value = withTiming(1, { duration: 300 });
        successScale.value = withSpring(1, { damping: 12, stiffness: 150 });

        // Navigate after success animation
        setTimeout(() => {
          signIn();
        }, 1200);
      } else {
        showError('Wrong OTP. Please try again.');
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        setFocusedIndex(0);
      }
    }, 900);
  }, [navigation, showError]);

  // ── Resend ───────────────────────────────────────────────
  const handleResend = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimer(RESEND_SECONDS);
    setErrorMsg('');
    inputRefs.current[0]?.focus();
    setFocusedIndex(0);
    // TODO: trigger resend API call
  }, []);

  // ── Animated styles ──────────────────────────────────────
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const boxesStyle = useAnimatedStyle(() => ({
    opacity: boxesOpacity.value,
    transform: [
      { translateY: boxesTranslateY.value },
      { translateX: errorShakeX.value },
    ],
  }));

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ scale: successScale.value }],
  }));

  const errorStyle = useAnimatedStyle(() => ({
    opacity: errorOpacity.value,
  }));

  const filledCount = otp.filter(Boolean).length;
  const isAllFilled = filledCount === OTP_LENGTH;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      <LinearGradient
        colors={['#0A1A0F', '#0F2318', '#0A1A0F']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Blob */}
      <View style={styles.blobTop} pointerEvents="none" />

      {/* Back button */}
      <AnimatedPressable
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        scaleDown={0.9}
      >
        <View style={styles.backBtnInner}>
          <IconChevronLeft size={20} color={Colors.textOnDark} strokeWidth={2.2} />
        </View>
      </AnimatedPressable>

      <View style={styles.content}>

        {/* ── Header ──────────────────────────────────── */}
        <Animated.View style={[styles.header, headerStyle]}>
          <Animated.Text style={styles.headline}>Verify number</Animated.Text>
          <Animated.Text style={styles.subtext}>
            OTP sent to{' '}
            <Animated.Text style={styles.phoneHighlight}>{maskedPhone}</Animated.Text>
          </Animated.Text>
        </Animated.View>

        {/* ── Glass card ──────────────────────────────── */}
        <View style={styles.card}>

          {/* Success overlay */}
          {isSuccess && (
            <Animated.View style={[styles.successOverlay, successStyle]}>
              <SuccessCircle />
              <Animated.Text style={styles.successText}>Verified!</Animated.Text>
              <Animated.Text style={styles.successSub}>Taking you in…</Animated.Text>
            </Animated.View>
          )}

          {/* OTP Boxes */}
          <Animated.View style={[styles.boxRow, boxesStyle]}>
            {otp.map((digit, i) => (
              <View key={i} style={styles.boxWrap}>
                <OTPBox
                  value={digit}
                  isFocused={focusedIndex === i}
                  isSuccess={isSuccess}
                  index={i}
                />
                {/* Hidden actual TextInput, positioned over visual box */}
                <TextInput
                  ref={(el) => { inputRefs.current[i] = el; }}
                  style={styles.hiddenInput}
                  value={digit}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => setFocusedIndex(-1)}
                  keyboardType="number-pad"
                  maxLength={1}
                  caretHidden
                  selectTextOnFocus
                  editable={!isSuccess}
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
                />
              </View>
            ))}
          </Animated.View>

          {/* Progress dots */}
          <View style={styles.progressRow}>
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i < filledCount && styles.progressDotFilled,
                ]}
              />
            ))}
          </View>

          {/* Error message */}
          {errorMsg ? (
            <Animated.Text style={[styles.errorText, errorStyle]}>
              {errorMsg}
            </Animated.Text>
          ) : null}

          {/* Resend */}
          <ResendTimer seconds={timer} onResend={handleResend} />

          {/* Verify button */}
          <AnimatedPressable
            onPress={() => handleVerify(otp)}
            style={styles.ctaWrap}
            scaleDown={0.97}
            disabled={isLoading || isSuccess || !isAllFilled}
          >
            <LinearGradient
              colors={isAllFilled && !isLoading && !isSuccess
                ? [Colors.brandGreenLight, Colors.brandGreen]
                : ['rgba(45,138,78,0.3)', 'rgba(45,138,78,0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.ctaButton, isAllFilled && styles.ctaActive]}
            >
              <Animated.Text style={styles.ctaText}>
                {isLoading ? 'Verifying…' : isSuccess ? 'Verified ✓' : 'Verify OTP'}
              </Animated.Text>
            </LinearGradient>
          </AnimatedPressable>

          {/* Paste hint */}
          <TouchableOpacity onPress={() => handlePaste(focusedIndex)} activeOpacity={0.6}>
            <Animated.Text style={styles.pasteHint}>
              Tap to paste from clipboard
            </Animated.Text>
          </TouchableOpacity>

        </View>

        {/* Change number */}
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Animated.Text style={[styles.changeNumber, headerStyle]}>
            Change number?{' '}
            <Animated.Text style={styles.changeNumberLink}>Go back</Animated.Text>
          </Animated.Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: H * 0.13,
    alignItems: 'center',
  },
  blobTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(45,138,78,0.10)',
  },

  // ── Back ────────────────────────────────────────────────
  backBtn: {
    position: 'absolute',
    top: H * 0.06,
    left: Spacing.base,
    zIndex: 10,
  },
  backBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  headline: {
    fontFamily: Font.outfitBold,
    fontSize: 30,
    color: Colors.textOnDark,
    marginBottom: Spacing.xs,
  },
  subtext: {
    fontFamily: Font.jakartaRegular,
    fontSize: 14,
    color: Colors.textOnDarkMuted,
    lineHeight: 22,
  },
  phoneHighlight: {
    fontFamily: Font.jakartaSemiBold,
    color: Colors.logoGreen,
  },

  // ── Card ────────────────────────────────────────────────
  card: {
    width: '100%',
    ...Glass.panel,
    padding: Spacing.lg,
    gap: Spacing.md,
    overflow: 'visible',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  // ── OTP Boxes ───────────────────────────────────────────
  boxRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  boxWrap: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    position: 'relative',
  },
  otpBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontFamily: Font.outfitBold,
    fontSize: 24,
    color: Colors.textOnDark,
    lineHeight: 30,
  },
  otpDigitSuccess: {
    color: Colors.logoGreen,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BOX_SIZE,
    height: BOX_SIZE,
    opacity: 0,
    fontSize: 1,
  },

  // ── Progress ────────────────────────────────────────────
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderGlass,
  },
  progressDotFilled: {
    backgroundColor: Colors.brandGreen,
  },

  // ── Error ───────────────────────────────────────────────
  errorText: {
    fontFamily: Font.jakartaMedium,
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
  },

  // ── Resend ──────────────────────────────────────────────
  resendRow: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  resendLabel: {
    fontFamily: Font.jakartaRegular,
    fontSize: 13,
    color: Colors.textOnDarkMuted,
  },
  resendTimer: {
    fontFamily: Font.jakartaSemiBold,
    color: Colors.logoGreen,
  },
  resendActive: {
    fontFamily: Font.jakartaRegular,
    fontSize: 13,
    color: Colors.textOnDarkMuted,
  },
  resendLink: {
    fontFamily: Font.jakartaSemiBold,
    color: Colors.logoGreen,
  },

  // ── CTA ─────────────────────────────────────────────────
  ctaWrap: {
    width: '100%',
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginTop: 4,
  },
  ctaButton: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaActive: {
    shadowColor: Colors.brandGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  ctaText: {
    fontFamily: Font.outfitSemiBold,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 0.3,
  },

  // ── Paste hint ──────────────────────────────────────────
  pasteHint: {
    fontFamily: Font.jakartaRegular,
    fontSize: 11,
    color: Colors.textOnDarkSubtle,
    marginTop: -4,
  },

  // ── Success overlay ─────────────────────────────────────
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,26,15,0.88)',
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    zIndex: 10,
  },
  successText: {
    fontFamily: Font.outfitBold,
    fontSize: 24,
    color: Colors.logoGreen,
  },
  successSub: {
    fontFamily: Font.jakartaRegular,
    fontSize: 14,
    color: Colors.textOnDarkMuted,
  },

  // ── Change number ────────────────────────────────────────
  changeNumber: {
    fontFamily: Font.jakartaRegular,
    fontSize: 13,
    color: Colors.textOnDarkSubtle,
  },
  changeNumberLink: {
    fontFamily: Font.jakartaMedium,
    color: Colors.logoGreen,
  },
});
