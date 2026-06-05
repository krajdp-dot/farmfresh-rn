// ============================================================
// FARM FRESH RN v4 — Color Tokens
// DO NOT edit without updating theme.ts simultaneously
// ============================================================

export const Colors = {
  // ── Brand ────────────────────────────────────────────────
  brandGreen: '#2D8A4E',       // CTAs, primary actions
  brandGreenLight: '#3AA861',  // hover / pressed state
  logoGreen: '#80EF80',        // logo, accent highlights
  accentOrange: '#FF6B35',     // urgency, "Picked Today" tags
  accentYellow: '#FFD166',     // mandi price highlights

  // ── Backgrounds ──────────────────────────────────────────
  bgPrimary: '#FFFFFF',        // main white canvas
  bgSecondary: '#F5F7F2',      // subtle off-white sections
  bgDark: '#0A1A0F',           // dark mandi bar / glass surfaces
  bgDarkCard: '#0F2318',       // dark card backgrounds
  bgGlass: 'rgba(255,255,255,0.08)',  // glass layer base

  // ── Text ─────────────────────────────────────────────────
  textPrimary: '#0A1A0F',      // main body text (dark green-black)
  textSecondary: '#4A6741',    // secondary / muted text
  textMuted: '#8BA88B',        // placeholders, labels
  textOnDark: '#FFFFFF',       // text on dark surfaces
  textOnDarkMuted: 'rgba(255,255,255,0.6)',
  textOnDarkSubtle: 'rgba(255,255,255,0.35)',

  // ── Borders ───────────────────────────────────────────────
  borderLight: 'rgba(45,138,78,0.12)',   // light mode card border
  borderMedium: 'rgba(45,138,78,0.25)',
  borderGlass: 'rgba(255,255,255,0.15)', // glass border
  borderGlassStrong: 'rgba(255,255,255,0.25)',

  // ── Neomorphism (light surfaces) ─────────────────────────
  neomorphBg: '#EFF2EC',
  neomorphShadowDark: 'rgba(0,0,0,0.18)',
  neomorphShadowLight: 'rgba(255,255,255,0.85)',

  // ── Status ───────────────────────────────────────────────
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // ── MandiTicker card backgrounds (unique per card) ────────
  mandiCard: [
    '#0F2318', // deep forest
    '#1A1F0A', // dark olive
    '#0D1B2A', // dark navy
    '#1F0F0A', // dark amber
    '#0A0F1F', // dark indigo
    '#1A0A1F', // dark plum
  ],

  // ── Utility ───────────────────────────────────────────────
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.25)',
} as const;

export type ColorKey = keyof typeof Colors;
