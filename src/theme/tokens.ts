import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const fontFamily = {
  outfit: {
    regular: 'Outfit-Regular',
    medium: 'Outfit-Medium',
    semiBold: 'Outfit-SemiBold',
    bold: 'Outfit-Bold',
    extraBold: 'Outfit-ExtraBold',
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
};

export const lightColors = {
  bg: '#FFFFFF',
  bgSecondary: '#F8F8F8',
  bgTertiary: '#F0F0F0',
  card: '#FFFFFF',
  border: '#EBEBEB',
  borderLight: '#F5F5F5',
  primary: '#2D8A4E',
  primaryLight: '#E8F5EE',
  primaryDark: '#1A6B38',
  accent: '#80EF80',
  red: '#E23744',
  redLight: '#FFF0F1',
  text: '#1C1C1C',
  textSecondary: '#696969',
  textMuted: '#9B9B9B',
  textInverse: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.08)',
  shadowMd: 'rgba(0,0,0,0.12)',
  overlay: 'rgba(0,0,0,0.5)',
  mandiStrip: '#FFF8E1',
  mandiBorder: '#FFE082',
  mandiText: '#F57F17',
  tabBar: '#FFFFFF',
  tabBarBorder: '#EBEBEB',
  statusBar: 'dark-content' as const,
  inputBg: '#F8F8F8',
  inputBorder: '#E0E0E0',
  inputFocus: '#2D8A4E',
  gold: '#F5A623',
  goldLight: '#FFF8E7',
  skeleton: '#F0F0F0',
  skeletonHighlight: '#FAFAFA',
};

export const darkColors = {
  bg: '#0D0D0D',
  bgSecondary: '#1A1A1A',
  bgTertiary: '#222222',
  card: '#1A1A1A',
  border: '#2A2A2A',
  borderLight: '#222222',
  primary: '#2D8A4E',
  primaryLight: '#0D2A18',
  primaryDark: '#3DAF64',
  accent: '#80EF80',
  red: '#FF4D5A',
  redLight: '#2A0D0F',
  text: '#F5F5F5',
  textSecondary: '#A0A0A0',
  textMuted: '#606060',
  textInverse: '#0D0D0D',
  shadow: 'rgba(0,0,0,0.4)',
  shadowMd: 'rgba(0,0,0,0.6)',
  overlay: 'rgba(0,0,0,0.7)',
  mandiStrip: '#1A1500',
  mandiBorder: '#3D2E00',
  mandiText: '#FFB300',
  tabBar: '#111111',
  tabBarBorder: '#2A2A2A',
  statusBar: 'light-content' as const,
  inputBg: '#1A1A1A',
  inputBorder: '#2A2A2A',
  inputFocus: '#2D8A4E',
  gold: '#F5A623',
  goldLight: '#1A1200',
  skeleton: '#1A1A1A',
  skeletonHighlight: '#222222',
};

export type StatusBarStyle = 'dark-content' | 'light-content';
export type AppColors = Omit<typeof lightColors, 'statusBar'> & { statusBar: StatusBarStyle };
