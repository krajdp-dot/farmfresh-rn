import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Scale helpers ────────────────────────────────────────────────────────────
const BASE_W = 390; // iPhone 15 Pro base
export const wp = (px: number) => (SCREEN_W / BASE_W) * px;
export const hp = (px: number) => (SCREEN_H / 844) * px;
export const fs = (px: number) =>
  px * (1 / PixelRatio.getFontScale()) * (SCREEN_W / BASE_W);

// ─── Colors ───────────────────────────────────────────────────────────────────
export const Colors = {
  // Brand
  primary: '#2D8A4E',       // deep forest green — CTAs, icons
  primaryLight: '#3DA563',  // hover / pressed state
  accent: '#80EF80',        // logo, badges, highlights  (bright mint)
  accentDim: '#5ED47A',     // secondary accent

  // Backgrounds
  bg: '#0A1A0F',            // deep night green — main bg
  bgCard: '#0F2416',        // card bg
  bgElevated: '#142B1A',    // bottom sheet, modals
  bgGlass: 'rgba(20,43,26,0.72)',   // glassmorphism panels
  bgGlassLight: 'rgba(45,138,78,0.12)', // soft tinted glass

  // Surface
  surface0: '#0A1A0F',
  surface1: '#0F2416',
  surface2: '#162D1D',
  surface3: '#1C3824',

  // Mandi ticker card bgs (unique per product type)
  mandiCards: [
    '#1A2A12',  // leafy
    '#2A1A08',  // root/orange
    '#0A1E2A',  // aqua
    '#1E0A2A',  // berry/purple
    '#2A2200',  // citrus/yellow
    '#2A0A12',  // red/tomato
  ],

  // Text
  textPrimary: '#F0FAF4',
  textSecondary: '#8BAF95',
  textMuted: '#4D7259',
  textInverse: '#0A1A0F',
  textAccent: '#80EF80',

  // Utility
  border: 'rgba(128,239,128,0.10)',
  borderStrong: 'rgba(128,239,128,0.22)',
  divider: 'rgba(255,255,255,0.06)',
  white: '#FFFFFF',
  black: '#000000',

  // Semantic
  success: '#4ADE80',
  warning: '#FACC15',
  error: '#F87171',
  info: '#60A5FA',

  // Cart badge
  badge: '#80EF80',
  badgeText: '#0A1A0F',

  // Gold / premium
  gold: '#F5C542',
  goldLight: '#FFE08A',
  goldDark: '#C49A1A',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const Font = {
  outfit: {
    regular: 'Outfit-Regular',
    medium: 'Outfit-Medium',
    semiBold: 'Outfit-SemiBold',
    bold: 'Outfit-Bold',
  },
  jakarta: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    semiBold: 'PlusJakartaSans-SemiBold',
    bold: 'PlusJakartaSans-Bold',
  },
  baloo: {
    regular: 'Baloo2-Regular',
    medium: 'Baloo2-Medium',
    semiBold: 'Baloo2-SemiBold',
    bold: 'Baloo2-Bold',
  },
} as const;

// Type scale (Outfit primary, Jakarta numbers, Baloo Hindi)
export const Type = {
  displayXL: { fontSize: fs(36), lineHeight: fs(42), letterSpacing: -0.8, fontFamily: Font.outfit.bold },
  displayL:  { fontSize: fs(30), lineHeight: fs(36), letterSpacing: -0.6, fontFamily: Font.outfit.bold },
  displayM:  { fontSize: fs(24), lineHeight: fs(30), letterSpacing: -0.4, fontFamily: Font.outfit.bold },
  h1:        { fontSize: fs(22), lineHeight: fs(28), letterSpacing: -0.3, fontFamily: Font.outfit.bold },
  h2:        { fontSize: fs(18), lineHeight: fs(24), letterSpacing: -0.2, fontFamily: Font.outfit.semiBold },
  h3:        { fontSize: fs(16), lineHeight: fs(22), letterSpacing: -0.1, fontFamily: Font.outfit.semiBold },
  bodyL:     { fontSize: fs(15), lineHeight: fs(22), fontFamily: Font.outfit.regular },
  bodyM:     { fontSize: fs(14), lineHeight: fs(20), fontFamily: Font.outfit.regular },
  bodyS:     { fontSize: fs(13), lineHeight: fs(18), fontFamily: Font.outfit.regular },
  label:     { fontSize: fs(12), lineHeight: fs(16), letterSpacing: 0.2, fontFamily: Font.outfit.medium },
  labelS:    { fontSize: fs(11), lineHeight: fs(14), letterSpacing: 0.3, fontFamily: Font.outfit.medium },
  caption:   { fontSize: fs(10), lineHeight: fs(13), letterSpacing: 0.4, fontFamily: Font.outfit.regular },
  price:     { fontSize: fs(15), lineHeight: fs(20), fontFamily: Font.jakarta.semiBold },
  priceL:    { fontSize: fs(18), lineHeight: fs(24), fontFamily: Font.jakarta.bold },
  hindi:     { fontSize: fs(14), lineHeight: fs(20), fontFamily: Font.baloo.medium },
  hindiS:    { fontSize: fs(12), lineHeight: fs(16), fontFamily: Font.baloo.regular },
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Space = {
  xs: wp(4),
  sm: wp(8),
  md: wp(12),
  lg: wp(16),
  xl: wp(20),
  xxl: wp(24),
  xxxl: wp(32),
  section: wp(40),
  screenH: hp(20),
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  full: 999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const Shadow = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
    },
    android: { elevation: 5 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 20,
    },
    android: { elevation: 10 },
  }),
  green: Platform.select({
    ios: {
      shadowColor: '#2D8A4E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
  }),
  accent: Platform.select({
    ios: {
      shadowColor: '#80EF80',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
    },
    android: { elevation: 6 },
  }),
} as const;

// ─── Layout constants ─────────────────────────────────────────────────────────
export const Layout = {
  screenW: SCREEN_W,
  screenH: SCREEN_H,
  isSmall: SCREEN_W < 375,
  isLarge: SCREEN_W >= 414,
  cardW: (SCREEN_W - wp(16) * 2 - wp(10)) / 2,  // 2-col grid
  tabBarH: hp(68),
  headerH: hp(56),
  statusBarH: Platform.OS === 'ios' ? hp(54) : hp(28),
  bottomInset: Platform.OS === 'ios' ? hp(34) : hp(16),
} as const;

// ─── Animation durations ──────────────────────────────────────────────────────
export const Timing = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 450,
  splash: 2200,
} as const;

// ─── Neomorphic card helper ───────────────────────────────────────────────────
export const Neomorph = {
  base: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lightSource: Platform.select({
    ios: {
      shadowColor: '#1E4A2A',
      shadowOffset: { width: -3, height: -3 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
    },
    android: {},
  }),
} as const;

// ─── Glassmorphism helper ────────────────────────────────────────────────────
export const Glass = {
  panel: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    overflow: 'hidden' as const,
  },
  card: {
    backgroundColor: Colors.bgGlassLight,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden' as const,
  },
} as const;
