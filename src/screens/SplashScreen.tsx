import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../stores/stores';
import { useLangStore } from '../stores/stores';
import { Colors, Font, fs, wp, hp } from '../theme';

const { width: W, height: H } = Dimensions.get('window');

// Produce that rains from top
const PRODUCE = ['🍅', '🥕', '🌽', '🥬', '🍋', '🫚', '🧅', '🫛', '🍇', '🥭'];

interface ParticleProps {
  emoji: string;
  delay: number;
  x: number;
  size: number;
}

function Particle({ emoji, delay, x, size }: ParticleProps) {
  const y = useSharedValue(-60);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withTiming(H + 80, { duration: 2800, easing: Easing.in(Easing.quad) })
    );
    opacity.value = withDelay(delay, withSequence(
      withTiming(0.85, { duration: 200 }),
      withDelay(2200, withTiming(0, { duration: 400 }))
    ));
    rotate.value = withDelay(
      delay,
      withTiming(Math.random() > 0.5 ? 360 : -360, { duration: 2800, easing: Easing.linear })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: 0 }, style]}>
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SplashScreen() {
  const { hydrateFromStorage } = useAuthStore();
  const { hydrateLang } = useLangStore();

  // Animation values
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(30);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(16);
  const lineW = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  // Particles
  const particles = PRODUCE.map((emoji, i) => ({
    emoji,
    delay: 300 + i * 120,
    x: (W / PRODUCE.length) * i + Math.random() * 20 - 10,
    size: 22 + Math.random() * 16,
  }));

  useEffect(() => {
    // Hydrate stores in parallel
    Promise.all([hydrateFromStorage(), hydrateLang()]);

    // Logo entrance
    logoScale.value = withDelay(200, withSpring(1, { stiffness: 180, damping: 16 }));
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    logoY.value = withDelay(200, withSpring(0, { stiffness: 160, damping: 18 }));

    // Divider line
    lineW.value = withDelay(700, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));

    // Tagline
    taglineOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));
    taglineY.value = withDelay(900, withSpring(0, { stiffness: 160, damping: 18 }));

    // Subtitle
    subtitleOpacity.value = withDelay(1300, withTiming(1, { duration: 400 }));

    // Fade out
    overlayOpacity.value = withDelay(
      2000,
      withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) })
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { translateY: logoY.value }],
    opacity: logoOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: taglineY.value }],
    opacity: taglineOpacity.value,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: interpolate(lineW.value, [0, 1], [0, wp(120)]),
    opacity: lineW.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Deep gradient background */}
      <LinearGradient
        colors={['#020A04', '#051409', '#0A1A0F', '#071610']}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial glow centre */}
      <View style={styles.glow} />

      {/* Falling produce particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Logo block */}
      <View style={styles.centerBlock}>
        <Animated.View style={logoStyle}>
          {/* Logo mark — leaf + wordmark */}
          <View style={styles.logoRow}>
            <Text style={styles.logoLeaf}>🌿</Text>
            <View style={styles.logoTextWrap}>
              <Text style={styles.logoTop}>FARM</Text>
              <Text style={styles.logoBottom}>FRESH</Text>
            </View>
          </View>
        </Animated.View>

        {/* Divider */}
        <Animated.View style={[styles.divider, lineStyle]} />

        {/* Tagline */}
        <Animated.View style={taglineStyle}>
          <Text style={styles.tagline}>Mandi Awakens</Text>
        </Animated.View>

        {/* Hindi subtitle */}
        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>मंडी से सीधे आपके दरवाज़े</Text>
        </Animated.View>
      </View>

      {/* Location pill */}
      <Animated.View style={[styles.locationPill, subtitleStyle]}>
        <Text style={styles.locationText}>📍 Bhagalpur, Bihar</Text>
      </Animated.View>

      {/* Fade-out overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: '#020A04' }, overlayStyle]}
        pointerEvents="none"
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A1A0F',
    overflow: 'hidden',
  },

  glow: {
    position: 'absolute',
    width: W * 0.8,
    height: W * 0.8,
    borderRadius: W * 0.4,
    backgroundColor: Colors.primary,
    opacity: 0.06,
    top: H * 0.25,
    alignSelf: 'center',
  },

  centerBlock: {
    alignItems: 'center',
    gap: hp(12),
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
  },
  logoLeaf: {
    fontSize: fs(42),
  },
  logoTextWrap: {
    gap: -hp(4),
  },
  logoTop: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(34),
    color: Colors.accent,
    letterSpacing: wp(5),
    lineHeight: fs(38),
  },
  logoBottom: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(34),
    color: Colors.white,
    letterSpacing: wp(3),
    lineHeight: fs(38),
  },

  divider: {
    height: 1,
    backgroundColor: Colors.accent,
    opacity: 0.4,
    alignSelf: 'center',
  },

  tagline: {
    fontFamily: Font.jakarta.semiBold,
    fontSize: fs(15),
    color: Colors.textSecondary,
    letterSpacing: wp(2),
    textTransform: 'uppercase',
  },

  subtitle: {
    fontFamily: Font.baloo.regular,
    fontSize: fs(14),
    color: Colors.textMuted,
    marginTop: hp(4),
  },

  locationPill: {
    position: 'absolute',
    bottom: hp(60),
    backgroundColor: Colors.surface2,
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationText: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(12),
    color: Colors.textSecondary,
  },
});
