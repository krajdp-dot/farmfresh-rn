// ============================================================
// FARM FRESH RN v4 — SplashScreen
// "Mandi Awakens" — SVG produce physics + logo reveal
// ⚠️  Math.random() NEVER inside worklets — all random values
//     computed in JS thread and passed as props/useMemo
// ============================================================

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors, Glass, Shadow, Font } from '../theme';

const { width: W, height: H } = Dimensions.get('window');

// ── Types ─────────────────────────────────────────────────
interface ProduceItem {
  id: number;
  x: number;       // final resting X (pre-computed in JS)
  startY: number;  // off-screen start Y (pre-computed in JS)
  finalY: number;  // final Y position
  rotation: number;
  size: number;
  delay: number;
  type: 'tomato' | 'carrot' | 'mango' | 'onion' | 'potato' | 'leafy';
}

// ── SVG Produce Shapes (inline, no import needed) ─────────
const ProduceSVG = {
  tomato: (size: number) => (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx="20" cy="24" r="14" fill="#EF4444" />
      <Path d="M20 10V7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M20 10C20 10 17 7 14 7" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      <Path d="M20 10C20 10 23 7 26 7" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      <Ellipse cx="16" cy="20" rx="3" ry="4.5" fill="rgba(255,255,255,0.18)" />
    </Svg>
  ),
  carrot: (size: number) => (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M20 8L27 30L20 27L13 30L20 8Z" fill="#FB923C" />
      <Path d="M20 8C20 8 18 5 17 3" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      <Path d="M20 8C20 8 22 4 24 3" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      <Path d="M20 8C20 8 20 4 20 2" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  mango: (size: number) => (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path
        d="M20 8C20 8 10 14 10 24C10 30.63 14.48 36 20 36C25.52 36 30 30.63 30 24C30 14 20 8 20 8Z"
        fill="#FBBF24"
      />
      <Path d="M20 8V5" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M20 8C20 8 22 5 25 5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      <Ellipse cx="16" cy="22" rx="3" ry="4.5" fill="rgba(255,255,255,0.22)" />
    </Svg>
  ),
  onion: (size: number) => (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx="20" cy="24" r="13" fill="#C084FC" />
      <Path d="M20 11V8" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M20 11C18 9 16 8 14 9" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      <Path d="M15 15C13 16 11 19 11 22" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      <Ellipse cx="16" cy="21" rx="2.5" ry="4" fill="rgba(255,255,255,0.18)" />
    </Svg>
  ),
  potato: (size: number) => (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="24" rx="13" ry="11" fill="#92400E" />
      <Circle cx="15" cy="20" r="2" fill="rgba(0,0,0,0.35)" />
      <Circle cx="24" cy="25" r="1.5" fill="rgba(0,0,0,0.35)" />
      <Circle cx="17" cy="28" r="1.2" fill="rgba(0,0,0,0.35)" />
      <Ellipse cx="16" cy="19" rx="2.5" ry="3.5" fill="rgba(255,255,255,0.12)" />
    </Svg>
  ),
  leafy: (size: number) => (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path
        d="M20 36C20 36 8 28 8 18C8 11.37 13.37 6 20 6C26.63 6 32 11.37 32 18C32 28 20 36 20 36Z"
        fill="#16A34A"
      />
      <Path d="M20 36V18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M20 22C17 20 14 18 13 15" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M20 27C23 25 26 22 27 19" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
};

const PRODUCE_TYPES: ProduceItem['type'][] = ['tomato', 'carrot', 'mango', 'onion', 'potato', 'leafy'];

// ── FarmFresh Logo SVG ────────────────────────────────────
const FarmFreshLogo = () => (
  <Svg width={72} height={72} viewBox="0 0 72 72">
    <Defs>
      <RadialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#80EF80" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#80EF80" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    {/* Glow bg */}
    <Circle cx="36" cy="36" r="36" fill="url(#logoGlow)" />
    {/* Leaf shape */}
    <Path
      d="M36 60C36 60 16 48 16 32C16 22.06 25.06 14 36 14C46.94 14 56 22.06 56 32C56 48 36 60 36 60Z"
      fill="#80EF80"
    />
    {/* Stem */}
    <Path d="M36 60V32" stroke="#2D8A4E" strokeWidth="3" strokeLinecap="round" />
    {/* Left vein */}
    <Path d="M36 38C32 36 28 33 27 29" stroke="rgba(10,26,15,0.4)" strokeWidth="1.8" strokeLinecap="round" />
    {/* Right vein */}
    <Path d="M36 44C40 42 44 38 45 34" stroke="rgba(10,26,15,0.3)" strokeWidth="1.8" strokeLinecap="round" />
    {/* Shine */}
    <Ellipse cx="30" cy="27" rx="4" ry="6" fill="rgba(255,255,255,0.25)" />
  </Svg>
);

// ── Floating Particle (single produce item) ───────────────
interface ParticleProps {
  item: ProduceItem;
}

const ProduceParticle = ({ item }: ParticleProps) => {
  const translateY = useSharedValue(item.startY);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      item.delay,
      withSpring(item.finalY, {
        damping: 14,
        stiffness: 80,
        mass: 1.2,
      })
    );
    opacity.value = withDelay(
      item.delay,
      withTiming(0.75, { duration: 400, easing: Easing.out(Easing.ease) })
    );
    rotate.value = withDelay(
      item.delay,
      withSpring(item.rotation, { damping: 10, stiffness: 60 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const ProduceFn = ProduceSVG[item.type];

  return (
    <Animated.View
      style={[
        styles.particle,
        { left: item.x - item.size / 2 },
        style,
      ]}
    >
      {ProduceFn(item.size)}
    </Animated.View>
  );
};

// ── Main SplashScreen ─────────────────────────────────────
interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  // ⚠️  All Math.random() calls here — JS thread only, never in worklet
  const produceItems = useMemo<ProduceItem[]>(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * (W - 60),
      startY: -80 - Math.random() * 120,
      finalY: H * 0.12 + Math.random() * (H * 0.55),
      rotation: (Math.random() - 0.5) * 50,
      size: 36 + Math.round(Math.random() * 22),
      delay: 100 + Math.round(Math.random() * 600),
      type: PRODUCE_TYPES[i % PRODUCE_TYPES.length],
    }));
  }, []);

  // Logo animation values
  const logoScale = useSharedValue(0.4);
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);

  // Title animation
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(16);

  // Subtitle animation
  const subtitleOpacity = useSharedValue(0);

  // Overall fade-out before leaving
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo appears at 600ms
    logoScale.value = withDelay(
      600,
      withSpring(1, { damping: 12, stiffness: 120 })
    );
    logoOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) })
    );
    logoTranslateY.value = withDelay(
      600,
      withSpring(0, { damping: 14, stiffness: 100 })
    );

    // "Farm Fresh" title at 950ms
    titleOpacity.value = withDelay(
      950,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.ease) })
    );
    titleTranslateY.value = withDelay(
      950,
      withSpring(0, { damping: 16, stiffness: 120 })
    );

    // "Mandi Awakens" subtitle at 1200ms
    subtitleOpacity.value = withDelay(
      1200,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
    );

    // Fade out + navigate at 2600ms
    screenOpacity.value = withDelay(
      2600,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) }, (finished) => {
        if (finished) runOnJS(onFinish)();
      })
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      {/* Scattered produce particles */}
      {produceItems.map((item) => (
        <ProduceParticle key={item.id} item={item} />
      ))}

      {/* Dark gradient overlay so logo pops */}
      <View style={styles.centerOverlay} pointerEvents="none" />

      {/* Logo + Text center block */}
      <View style={styles.centerBlock}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <FarmFreshLogo />
        </Animated.View>

        <Animated.Text style={[styles.brandName, titleStyle]}>
          Farm Fresh
        </Animated.Text>

        <Animated.Text style={[styles.mandiTagline, subtitleStyle]}>
          मंडी जाग रही है · Mandi Awakens
        </Animated.Text>
      </View>

      {/* Bottom mandi bar strip */}
      <Animated.View style={[styles.mandiStrip, subtitleStyle]}>
        <Animated.Text style={styles.mandiStripText}>
          🌱 Direct from mandi · Picked today · Bhagalpur Bihar
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  particle: {
    position: 'absolute',
    top: 0,
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,26,15,0.45)',
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoWrap: {
    marginBottom: 8,
    // iOS shadow for glow effect
    shadowColor: Colors.logoGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 16,
  },
  brandName: {
    fontFamily: Font.outfitBold,
    fontSize: 36,
    color: Colors.textOnDark,
    letterSpacing: 0.5,
  },
  mandiTagline: {
    fontFamily: Font.baloo2Medium,
    fontSize: 14,
    color: Colors.textOnDarkMuted,
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  mandiStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  mandiStripText: {
    fontFamily: Font.jakartaMedium,
    fontSize: 12,
    color: Colors.textOnDarkSubtle,
    letterSpacing: 0.2,
  },
});
