import React, { useState, useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Colors, Font, fs, wp, hp, Radius, Space } from '../../theme';
import { useAuthStore } from '../../stores/stores';
import { AuthAPI } from '../../api/client';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'PhoneEntry'>;

export default function PhoneEntryScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { setGuest } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const btnScale = useSharedValue(1);
  const inputBorder = useSharedValue(0);
  const shakeX = useSharedValue(0);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const inputStyle = useAnimatedStyle(() => ({
    borderColor: inputBorder.value === 1
      ? Colors.accent
      : `rgba(128,239,128,${0.1 + inputBorder.value * 0.2})`,
    transform: [{ translateX: shakeX.value }],
  }));

  const handleFocus = () => {
    inputBorder.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    inputBorder.value = withTiming(0, { duration: 200 });
  };

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-6, { duration: 60 }),
      withTiming(6, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  const handleSend = async () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) {
      shake();
      return;
    }

    btnScale.value = withSequence(
      withSpring(0.94, { stiffness: 400, damping: 15 }),
      withSpring(1, { stiffness: 300, damping: 14 })
    );

    setLoading(true);
    try {
      await AuthAPI.sendOTP(clean);
      nav.navigate('OTPVerify', { phone: clean });
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = phone.replace(/\D/g, '').length === 10;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#020A04', '#0A1A0F', '#0F2416']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.container, { paddingTop: insets.top + hp(60) }]}>

        {/* Logo + headline */}
        <View style={styles.header}>
          <Text style={styles.logoMark}>🌿</Text>
          <Text style={styles.headline}>Enter your{'\n'}phone number</Text>
          <Text style={styles.sub}>We'll send a 6-digit OTP to verify</Text>
        </View>

        {/* Phone input */}
        <View style={styles.inputSection}>
          <Animated.View style={[styles.inputWrap, inputStyle]}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.dialCode}>+91</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              placeholder="10-digit mobile number"
              placeholderTextColor={Colors.textMuted}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              maxLength={10}
              autoFocus
            />
          </Animated.View>
        </View>

        {/* Send OTP button */}
        <Animated.View style={btnStyle}>
          <Pressable
            style={[styles.btn, !isValid && styles.btnDisabled]}
            onPress={handleSend}
            disabled={!isValid || loading}
          >
            <LinearGradient
              colors={isValid ? [Colors.primary, Colors.primaryLight] : [Colors.surface2, Colors.surface2]}
              style={styles.btnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={[styles.btnText, !isValid && styles.btnTextDisabled]}>
                  Send OTP →
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Guest */}
        <Pressable style={styles.guestBtn} onPress={() => setGuest()}>
          <Text style={styles.guestText}>Continue as guest</Text>
        </Pressable>

        {/* Terms */}
        <Text style={[styles.terms, { marginBottom: insets.bottom + hp(16) }]}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms</Text> &{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: wp(24),
    gap: hp(20),
  },
  header: {
    gap: hp(8),
    marginBottom: hp(12),
  },
  logoMark: { fontSize: fs(36) },
  headline: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(30),
    color: Colors.textPrimary,
    lineHeight: fs(38),
    letterSpacing: -0.5,
  },
  sub: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(15),
    color: Colors.textSecondary,
  },

  inputSection: {},
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface1,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    height: hp(56),
    paddingHorizontal: wp(16),
    gap: wp(12),
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  flag: { fontSize: fs(18) },
  dialCode: {
    fontFamily: Font.jakarta.semiBold,
    fontSize: fs(15),
    color: Colors.textPrimary,
  },
  divider: {
    width: 1,
    height: hp(22),
    backgroundColor: Colors.border,
  },
  input: {
    flex: 1,
    fontFamily: Font.jakarta.medium,
    fontSize: fs(18),
    color: Colors.textPrimary,
    letterSpacing: wp(1.5),
    paddingVertical: 0,
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
    letterSpacing: 0.3,
  },
  btnTextDisabled: { color: Colors.textMuted },

  guestBtn: {
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  guestText: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(14),
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },

  terms: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(12),
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 'auto',
  },
  link: { color: Colors.accent },
});
