// ============================================================
// FARM FRESH RN v4 — Theme System
// Glass · Neomorph · Shadow · Typography · Spacing
// ============================================================

import { Platform } from 'react-native';
import { Colors } from './colors';

// ── Spacing Scale ─────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ── Border Radius ─────────────────────────────────────────
export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

// ── Typography ────────────────────────────────────────────
export const Font = {
  // Outfit — headlines, brand voice
  outfitRegular: 'Outfit-Regular',
  outfitMedium: 'Outfit-Medium',
  outfitSemiBold: 'Outfit-SemiBold',
  outfitBold: 'Outfit-Bold',

  // Plus Jakarta Sans — body, UI text
  jakartaRegular: 'PlusJakartaSans-Regular',
  jakartaMedium: 'PlusJakartaSans-Medium',
  jakartaSemiBold: 'PlusJakartaSans-SemiBold',
  jakartaBold: 'PlusJakartaSans-Bold',

  // Baloo 2 — Hindi text, mandi labels
  baloo2Regular: 'Baloo2-Regular',
  baloo2Medium: 'Baloo2-Medium',
  baloo2SemiBold: 'Baloo2-SemiBold',
  baloo2Bold: 'Baloo2-Bold',
} as const;

export const TextStyle = {
  // Display
  displayLg: { fontFamily: Font.outfitBold, fontSize: 32, lineHeight: 40 },
  displayMd: { fontFamily: Font.outfitBold, fontSize: 26, lineHeight: 34 },
  displaySm: { fontFamily: Font.outfitSemiBold, fontSize: 22, lineHeight: 30 },

  // Heading
  h1: { fontFamily: Font.outfitBold, fontSize: 20, lineHeight: 28 },
  h2: { fontFamily: Font.outfitSemiBold, fontSize: 18, lineHeight: 26 },
  h3: { fontFamily: Font.jakartaSemiBold, fontSize: 16, lineHeight: 24 },

  // Body
  bodyLg: { fontFamily: Font.jakartaRegular, fontSize: 16, lineHeight: 24 },
  bodyMd: { fontFamily: Font.jakartaRegular, fontSize: 14, lineHeight: 22 },
  bodySm: { fontFamily: Font.jakartaRegular, fontSize: 12, lineHeight: 18 },

  // UI
  label: { fontFamily: Font.jakartaMedium, fontSize: 13, lineHeight: 18 },
  labelSm: { fontFamily: Font.jakartaMedium, fontSize: 11, lineHeight: 16 },
  button: { fontFamily: Font.outfitSemiBold, fontSize: 15, lineHeight: 22 },
  buttonSm: { fontFamily: Font.outfitMedium, fontSize: 13, lineHeight: 18 },

  // Price / Mandi
  price: { fontFamily: Font.outfitBold, fontSize: 16, lineHeight: 22 },
  priceLg: { fontFamily: Font.outfitBold, fontSize: 20, lineHeight: 26 },
  mandi: { fontFamily: Font.baloo2Medium, fontSize: 13, lineHeight: 18 },
  mandiSm: { fontFamily: Font.baloo2Regular, fontSize: 11, lineHeight: 16 },

  // Caption
  caption: { fontFamily: Font.jakartaRegular, fontSize: 11, lineHeight: 16 },
  captionMedium: { fontFamily: Font.jakartaMedium, fontSize: 11, lineHeight: 16 },
} as const;

// ── Glass System (dark surfaces only) ────────────────────
// Usage: spread Glass.card into your StyleSheet
export const Glass = {
  // Primary glass card — for cards on dark bg
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    overflow: 'hidden' as const,
  },

  // Stronger glass — for modals, bottom sheets on dark
  panel: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    borderRadius: Radius.xl,
    overflow: 'hidden' as const,
  },

  // Subtle glass — for inner elements, chips on dark
  subtle: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.md,
  },

  // Green-tinted glass — for active / selected states on dark
  green: {
    backgroundColor: 'rgba(45,138,78,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(128,239,128,0.30)',
    borderRadius: Radius.lg,
    overflow: 'hidden' as const,
  },

  // Nav pill — liquid glass bottom nav
  navPill: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.full,
  },
} as const;

// ── Neomorphism (light surfaces only) ────────────────────
export const Neomorph = {
  // Standard product card on white/light bg
  card: {
    backgroundColor: Colors.neomorphBg,
    borderRadius: Radius.lg,
    shadowColor: Colors.neomorphShadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },

  // Pressed / inset state
  pressed: {
    backgroundColor: Colors.neomorphBg,
    borderRadius: Radius.lg,
    shadowColor: Colors.neomorphShadowDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },

  // Input field neomorph
  input: {
    backgroundColor: Colors.neomorphBg,
    borderRadius: Radius.md,
    shadowColor: Colors.neomorphShadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
} as const;

// ── Shadow Tokens ─────────────────────────────────────────
export const Shadow = {
  // Green glow — for CTAs, active tabs
  green: Platform.select({
    ios: {
      shadowColor: Colors.brandGreen,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
    },
    android: { elevation: 10 },
  }),

  // Logo green glow
  accent: Platform.select({
    ios: {
      shadowColor: Colors.logoGreen,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
    },
    android: { elevation: 12 },
  }),

  // Soft card shadow on white bg
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  }),

  // Strong shadow — bottom sheets, modals
  strong: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 20,
    },
    android: { elevation: 16 },
  }),

  // None
  none: Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }),
} as const;

// ── Gradient Presets ──────────────────────────────────────
// Pass to LinearGradient's colors prop
export const Gradient = {
  // Brand hero gradient
  brandVertical: [Colors.bgDark, '#0F2318', Colors.bgDark],

  // Card shimmer skeleton
  skeleton: ['#E8EDE6', '#D4DDD1', '#E8EDE6'],

  // Green CTA button
  greenCta: [Colors.brandGreenLight, Colors.brandGreen],

  // Dark mandi bar
  mandiBar: ['#0A1A0F', '#0F2318'],

  // Glass overlay
  glassOverlay: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'],

  // Orange urgency
  urgency: ['#FF8C55', Colors.accentOrange],
} as const;

// ── Animation Durations ───────────────────────────────────
export const Duration = {
  instant: 100,
  fast: 180,
  normal: 280,
  slow: 420,
  slower: 600,
} as const;

// ── Z-Index Stack ─────────────────────────────────────────
export const ZIndex = {
  base: 0,
  card: 10,
  sticky: 20,
  nav: 30,
  modal: 40,
  toast: 50,
  overlay: 100,
} as const;

// ── Convenience export ────────────────────────────────────
export const Theme = {
  Colors,
  Spacing,
  Radius,
  Font,
  TextStyle,
  Glass,
  Neomorph,
  Shadow,
  Gradient,
  Duration,
  ZIndex,
} as const;
