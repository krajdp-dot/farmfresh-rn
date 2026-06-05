// ============================================================
// FARM FRESH RN v4 — Custom SVG Icons
// All icons hand-crafted for Farm Fresh brand identity
// No emoji. No third-party icon pack.
// Usage: <IconHome size={24} color={Colors.brandGreen} />
// ============================================================

import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Ellipse,
  Polyline,
  Line,
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// ── Navigation Icons ──────────────────────────────────────

export const IconHome = ({ size = 24, color = '#2D8A4E', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

export const IconHomeFilled = ({ size = 24, color = '#2D8A4E' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
      fill={color}
    />
  </Svg>
);

export const IconSearch = ({ size = 24, color = '#2D8A4E', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10.5" cy="10.5" r="7" stroke={color} strokeWidth={strokeWidth} />
    <Line
      x1="15.5"
      y1="15.5"
      x2="21"
      y2="21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const IconCart = ({ size = 24, color = '#2D8A4E', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const IconOrders = ({ size = 24, color = '#2D8A4E', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="2"
      width="16"
      height="20"
      rx="2"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path d="M8 7H16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M8 11H16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M8 15H12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const IconCategories = ({ size = 24, color = '#2D8A4E', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7.5" height="7.5" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="13.5" y="3" width="7.5" height="7.5" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="3" y="13.5" width="7.5" height="7.5" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const IconProfile = ({ size = 24, color = '#2D8A4E', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M4 20C4 17.24 7.58 15 12 15C16.42 15 20 17.24 20 20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ── Product / Mandi Icons ─────────────────────────────────

export const IconLeaf = ({ size = 24, color = '#2D8A4E', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C12 21 4 17 4 10C4 6.69 7.13 4 12 4C16.87 4 20 6.69 20 10C20 17 12 21 12 21Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M12 21V10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M12 14C10 12.5 8 11 8 9"
      stroke={color}
      strokeWidth={strokeWidth - 0.2}
      strokeLinecap="round"
    />
  </Svg>
);

export const IconMandi = ({ size = 24, color = '#80EF80', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9H21L19 20H5L3 9Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M8 9V7C8 5.34 9.79 4 12 4C14.21 4 16 5.34 16 7V9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path d="M3 9L2 6H22L21 9" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </Svg>
);

export const IconFresh = ({ size = 24, color = '#2D8A4E', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Droplet shape */}
    <Path
      d="M12 2C12 2 5 10 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 10 12 2 12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Shine */}
    <Path
      d="M9 15C9 13.34 10.34 12 12 12"
      stroke={color}
      strokeWidth={strokeWidth - 0.3}
      strokeLinecap="round"
    />
  </Svg>
);

export const IconTruck = ({ size = 24, color = '#2D8A4E', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="1" y="7" width="14" height="10" rx="1" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M15 10H19L22 14V17H15V10Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Circle cx="5.5" cy="18.5" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="18.5" cy="18.5" r="1.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const IconStar = ({ size = 24, color = '#FFD166', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

export const IconStarFilled = ({ size = 24, color = '#FFD166' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={color}
    />
  </Svg>
);

export const IconPlus = ({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const IconMinus = ({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const IconChevronRight = ({ size = 24, color = '#4A6741', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6L15 12L9 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IconChevronLeft = ({ size = 24, color = '#4A6741', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 6L9 12L15 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IconChevronDown = ({ size = 24, color = '#4A6741', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IconClose = ({ size = 24, color = '#4A6741', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6L18 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M18 6L6 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const IconBell = ({ size = 24, color = '#2D8A4E', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.69 2 6 4.69 6 8V14L4 16V17H20V16L18 14V8C18 4.69 15.31 2 12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M10 17C10 18.1 10.9 19 12 19C13.1 19 14 18.1 14 17"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

export const IconPhone = ({ size = 24, color = '#2D8A4E', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="18" r="1" fill={color} />
    <Path d="M9 5H15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const IconLocation = ({ size = 24, color = '#2D8A4E', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.69 2 6 4.69 6 8C6 12.5 12 22 12 22C12 22 18 12.5 18 8C18 4.69 15.31 2 12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="8" r="2.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const IconGold = ({ size = 24, color = '#FFD166', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

export const IconCheck = ({ size = 24, color = '#22C55E', strokeWidth = 2.2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12L10 17L19 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IconFilter = ({ size = 24, color = '#4A6741', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M7 12H17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M11 18H13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const IconWeight = ({ size = 24, color = '#4A6741', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Scale pan */}
    <Path
      d="M3 20H21L19 10H5L3 20Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Hook */}
    <Path
      d="M12 10V6C12 4.9 11.1 4 10 4C8.9 4 8 4.9 8 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// ── Produce Emoji Replacements (SVG) ──────────────────────

export const IconTomato = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="18" r="11" fill="#EF4444" />
    <Path d="M16 7V4" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
    <Path d="M16 7C16 7 14 5 11 5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M16 7C16 7 18 5 21 5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
    <Ellipse cx="13" cy="15" rx="2" ry="3" fill="rgba(255,255,255,0.2)" />
  </Svg>
);

export const IconCarrot = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 6L22 22L16 20L10 22L16 6Z"
      fill="#FB923C"
    />
    <Path d="M16 6C16 6 14 4 13 2" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M16 6C16 6 17 3 19 2" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M16 6C16 6 16 3 16 1" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const IconMango = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 6C16 6 8 10 8 18C8 23.52 11.58 27 16 27C20.42 27 24 23.52 24 18C24 10 16 6 16 6Z"
      fill="#FBBF24"
    />
    <Path d="M16 6V3" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
    <Ellipse cx="13" cy="16" rx="2" ry="3" fill="rgba(255,255,255,0.25)" />
  </Svg>
);

export const IconOnion = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="18" r="10" fill="#C084FC" />
    <Path
      d="M16 8C16 8 13 5 13 3"
      stroke="#22C55E"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M12 11C12 11 9 12 8 15"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Ellipse cx="13" cy="16" rx="2" ry="3" fill="rgba(255,255,255,0.2)" />
  </Svg>
);

export const IconPotato = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Ellipse cx="16" cy="18" rx="11" ry="9" fill="#A16207" />
    <Circle cx="12" cy="15" r="1.5" fill="rgba(0,0,0,0.3)" />
    <Circle cx="19" cy="19" r="1.2" fill="rgba(0,0,0,0.3)" />
    <Circle cx="14" cy="21" r="1" fill="rgba(0,0,0,0.3)" />
    <Ellipse cx="13" cy="14" rx="2" ry="2.5" fill="rgba(255,255,255,0.12)" />
  </Svg>
);

export const IconBanana = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M8 22C8 22 10 14 16 10C22 6 26 8 26 8C26 8 22 8 18 12C14 16 12 22 12 22H8Z"
      fill="#FDE047"
    />
    <Path
      d="M8 22C10 22 12 22 12 22"
      stroke="#CA8A04"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

// ── Icon map for MandiTicker ───────────────────────────────
export const ProduceIconMap: Record<string, React.FC<{ size?: number }>> = {
  tomato: IconTomato,
  carrot: IconCarrot,
  mango: IconMango,
  onion: IconOnion,
  potato: IconPotato,
  banana: IconBanana,
};

export const getProduceIcon = (name: string): React.FC<{ size?: number }> => {
  const key = name.toLowerCase();
  return ProduceIconMap[key] ?? IconLeaf;
};
