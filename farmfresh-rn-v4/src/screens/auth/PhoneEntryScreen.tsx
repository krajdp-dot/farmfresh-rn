import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import auth from '@react-native-firebase/auth';
import { Colors, Glass, Font, Spacing, Radius } from '../../theme';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { IconPhone, IconChevronRight, IconLeaf } from '../../components/icons';

const { width: W, height: H } = Dimensions.get('window');

const MiniLogo = () => (
  <Svg width={40} height={40} viewBox="0 0 72 72">
    <Defs>
      <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#80EF80" stopOpacity="0.25" />
        <Stop offset="100%" stopColor="#80EF80" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    <Circle cx="36" cy="36" r="36" fill="url(#glow)" />
    <Path d="M36 60C36 60 16 48 16 32C16 22.06 25.06 14 36 14C46.94 14 56 22.06 56 32C56 48 36 60 36 60Z" fill="#80EF80" />
    <Path d="M36 60V32" stroke="#2D8A4E" strokeWidth="3" strokeLinecap="round" />
    <Path d="M36 38C32 36 28 33 27 29" stroke="rgba(10,26,15,0.4)" strokeWidth="1.8" strokeLinecap="round" />
    <Ellipse cx="30" cy="27" rx="4" ry="6" fill="rgba(255,255,255,0.25)" />
  </Svg>
);

const CountryPill = () => (
  <View style={styles.countryPill}>
    <View style={styles.flagWrap}>
      <View style={[styles.flagStripe, { backgroundColor: '#FF9933' }]} />
      <View style={[styles.flagStripe, { backgroundColor: '#FFFFFF' }]} />
      <View style={[styles.flagStripe, { backgroundColor: '#138808' }]} />
    </View>
    <Animated.Text style={styles.countryCode}>+91</Animated.Text>
    <View style={styles.divider} />
  </View>
);

interface PhoneEntryScreenProps {
  navigation: any;
}

export const PhoneEntryScreen = ({ navigation }: PhoneEntryScreenProps) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const cardScale = useSharedValue(0.96);
  const cardOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-24);
  const headerOpacity = useSharedValue(0);
  const inputBorderOpacity = useSharedValue(0);
  const shakeX = useSharedValue(0);

  React.useEffect(() => {
    headerTranslateY.value = withTiming(0, { duration: 520, easing: Easing.out(Easing.exp) });
    headerOpacity.value = withTiming(1, { duration: 480 });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    cardOpacity.value = withTiming(1, { duration: 400 });
  }, []);

  const triggerShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  }, []);

  const handleSend = useCallback(async () => {
    if (phone.length !== 10) { triggerShake(); return; }
    setIsLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber('+91' + phone);
      setIsLoading(false);
      navigation.navigate('OTPScreen', { phone, confirmation });
    } catch (e: any) {
      setIsLoading(false);
      Alert.alert('Error', e.message || 'Failed to send OTP');
      triggerShake();
    }
  }, [phone, navigation, triggerShake]);

  const inputContainerStyle = useAnimatedStyle(() => ({
    borderColor: inputBorderOpacity.value > 0.5 ? Colors.borderGlassStrong : Colors.borderGlass,
    borderWidth: 1,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const isValid = phone.length === 10;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <LinearGradient colors={['#0A1A0F', '#0F2318', '#0A1A0F']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={24}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.header, headerStyle]}>
            <View style={styles.logoRow}>
              <MiniLogo />
              <Animated.Text style={styles.brandLabel}>Farm Fresh</Animated.Text>
            </View>
            <Animated.Text style={styles.headline}>Your mandi,{'\n'}at your door.</Animated.Text>
            <Animated.Text style={styles.subtext}>???? ??? ?? ???? ?? ?? - Bhagalpur, Bihar</Animated.Text>
          </Animated.View>

          <Animated.View style={[styles.card, cardStyle]}>
            <View style={styles.cardInner}>
              <View style={styles.cardLabelRow}>
                <IconPhone size={16} color={Colors.textOnDarkMuted} />
                <Animated.Text style={styles.cardLabel}>Enter mobile number</Animated.Text>
              </View>
              <Animated.View style={[styles.inputContainer, inputContainerStyle, shakeStyle]}>
                <CountryPill />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  placeholderTextColor={Colors.textOnDarkSubtle}
                  keyboardType="number-pad"
                  maxLength={10}
                  onFocus={() => { setIsFocused(true); inputBorderOpacity.value = withTiming(1, { duration: 220 }); }}
                  onBlur={() => { setIsFocused(false); inputBorderOpacity.value = withTiming(0, { duration: 220 }); }}
                  returnKeyType="done"
                  onSubmitEditing={handleSend}
                  editable={!isLoading}
                  selectionColor={Colors.logoGreen}
                />
                <Animated.Text style={styles.charCount}>{phone.length}/10</Animated.Text>
              </Animated.View>
              <Animated.Text style={styles.helperText}>We'll send a 6-digit OTP to verify your number</Animated.Text>
              <AnimatedPressable onPress={handleSend} style={styles.ctaWrap} scaleDown={0.97} disabled={isLoading}>
                <LinearGradient
                  colors={isValid ? [Colors.brandGreenLight, Colors.brandGreen] : ['rgba(45,138,78,0.35)', 'rgba(45,138,78,0.25)']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={[styles.ctaButton, isValid && styles.ctaButtonActive]}
                >
                  {isLoading ? (
                    <Animated.Text style={styles.ctaText}>Sending OTP...</Animated.Text>
                  ) : (
                    <View style={styles.ctaRow}>
                      <Animated.Text style={styles.ctaText}>Get OTP</Animated.Text>
                      <IconChevronRight size={18} color={isValid ? Colors.white : Colors.textOnDarkMuted} strokeWidth={2.5} />
                    </View>
                  )}
                </LinearGradient>
              </AnimatedPressable>
            </View>
          </Animated.View>

          <Animated.View style={[styles.trustRow, headerStyle]}>
            {['Direct mandi price', 'Same-day delivery', 'No middlemen'].map((item, i) => (
              <View key={i} style={styles.trustItem}>
                <IconLeaf size={13} color={Colors.logoGreen} strokeWidth={2} />
                <Animated.Text style={styles.trustText}>{item}</Animated.Text>
              </View>
            ))}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDark },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.base, paddingTop: H * 0.10, paddingBottom: Spacing.xxxl, alignItems: 'center' },
  header: { width: '100%', alignItems: 'flex-start', marginBottom: Spacing.xl },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  brandLabel: { fontFamily: Font.outfitBold, fontSize: 20, color: Colors.logoGreen, letterSpacing: 0.3 },
  headline: { fontFamily: Font.outfitBold, fontSize: 34, color: Colors.textOnDark, lineHeight: 42, marginBottom: Spacing.sm },
  subtext: { fontFamily: Font.baloo2Regular, fontSize: 14, color: Colors.textOnDarkMuted, lineHeight: 20 },
  card: { width: '100%', ...Glass.panel, marginBottom: Spacing.xl },
  cardInner: { padding: Spacing.lg, gap: Spacing.md },
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: 2 },
  cardLabel: { fontFamily: Font.jakartaMedium, fontSize: 12, color: Colors.textOnDarkMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: Radius.md, overflow: 'hidden', height: 56 },
  input: { flex: 1, fontFamily: Font.outfitMedium, fontSize: 22, color: Colors.textOnDark, letterSpacing: 2, paddingVertical: 0, paddingRight: Spacing.sm, height: '100%' },
  charCount: { fontFamily: Font.jakartaRegular, fontSize: 11, color: Colors.textOnDarkSubtle, paddingRight: Spacing.base, paddingTop: 2 },
  helperText: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textOnDarkSubtle, lineHeight: 18 },
  countryPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, height: '100%', gap: Spacing.sm },
  flagWrap: { width: 22, height: 15, borderRadius: 2, overflow: 'hidden', flexDirection: 'column' },
  flagStripe: { flex: 1 },
  countryCode: { fontFamily: Font.outfitMedium, fontSize: 17, color: Colors.textOnDark, letterSpacing: 0.5 },
  divider: { width: 1, height: 22, backgroundColor: Colors.borderGlass, marginLeft: Spacing.sm },
  ctaWrap: { marginTop: Spacing.xs, borderRadius: Radius.md, overflow: 'hidden' },
  ctaButton: { height: 54, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  ctaButtonActive: { shadowColor: Colors.brandGreen, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 10 },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  ctaText: { fontFamily: Font.outfitSemiBold, fontSize: 16, color: Colors.white, letterSpacing: 0.4 },
  trustRow: { flexDirection: 'row', gap: Spacing.base, marginBottom: Spacing.lg, flexWrap: 'wrap', justifyContent: 'center' },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trustText: { fontFamily: Font.jakartaMedium, fontSize: 12, color: Colors.textOnDarkMuted },
});
