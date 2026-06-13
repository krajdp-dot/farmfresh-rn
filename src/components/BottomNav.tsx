import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import { useCartStore } from '../stores/cartStore';
import { fontFamily, spacing, fontSize } from '../theme/tokens';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

type TabName = 'Home' | 'Search' | 'Cart' | 'Profile';

interface Props {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
      fill={color}
    />
  </Svg>
);

const SearchIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2" />
    <Path d="M15.5 15.5L20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CartIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M3 6H21" stroke={color} strokeWidth="2" />
    <Path
      d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" fill={color} />
    <Path
      d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const TABS: { name: TabName; labelEn: string; labelHi: string }[] = [
  { name: 'Home', labelEn: 'Home', labelHi: 'होम' },
  { name: 'Search', labelEn: 'Search', labelHi: 'खोजें' },
  { name: 'Cart', labelEn: 'Cart', labelHi: 'कार्ट' },
  { name: 'Profile', labelEn: 'Profile', labelHi: 'प्रोफ़ाइल' },
];

const TabIcon = ({
  name,
  color,
  size,
}: {
  name: TabName;
  color: string;
  size: number;
}) => {
  switch (name) {
    case 'Home': return <HomeIcon color={color} size={size} />;
    case 'Search': return <SearchIcon color={color} size={size} />;
    case 'Cart': return <CartIcon color={color} size={size} />;
    case 'Profile': return <ProfileIcon color={color} size={size} />;
  }
};

const BottomNav: React.FC<Props> = ({ activeTab, onTabPress }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const insets = useSafeAreaInsets();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: insets.bottom + 4,
        },
        Platform.OS === 'ios' && styles.iosShadow,
        Platform.OS === 'android' && { elevation: 12 },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.name;
        const color = isActive ? colors.primary : colors.textMuted;
        const label = isHindi ? tab.labelHi : tab.labelEn;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              {isActive && (
                <View
                  style={[styles.activePill, { backgroundColor: colors.primaryLight }]}
                />
              )}
              <TabIcon name={tab.name} color={color} size={22} />
              {tab.name === 'Cart' && totalItems > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.red }]}>
                  <Text style={styles.badgeText}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color,
                  fontFamily: isActive
                    ? (isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold')
                    : (isHindi ? 'Baloo2-Regular' : 'Outfit-Regular'),
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 44,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    width: 40,
    height: 24,
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Outfit-Bold',
  },
  label: {
    fontSize: 11,
  },
});

export default BottomNav;
