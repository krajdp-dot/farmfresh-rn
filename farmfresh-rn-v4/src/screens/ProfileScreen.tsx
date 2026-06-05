// ============================================================
// FARM FRESH RN v4 — ProfileScreen
// User info · Stats · Settings rows · Logout
// ============================================================

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  View, StyleSheet, ScrollView, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withDelay, withTiming, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Spacing, Radius, Glass } from '../theme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import {
  IconChevronRight, IconLeaf, IconTruck, IconBell,
  IconLocation, IconGold, IconPhone,
} from '../components/icons';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';

// ── Avatar initials ───────────────────────────────────────
const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={styles.avatar}>
      <LinearGradient colors={[Colors.brandGreenLight, Colors.brandGreen]} style={styles.avatarGrad}>
        <Animated.Text style={styles.avatarText}>{initials}</Animated.Text>
      </LinearGradient>
    </View>
  );
};

// ── Stat card ─────────────────────────────────────────────
const StatCard = ({
  label, value, sub, index,
}: { label: string; value: string; sub: string; index: number }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withDelay(200 + index * 80, withTiming(1, { duration: 300 }));
    scale.value = withDelay(200 + index * 80, withSpring(1, { damping: 14, stiffness: 150 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value, transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.statCard, style]}>
      <Animated.Text style={styles.statValue}>{value}</Animated.Text>
      <Animated.Text style={styles.statLabel}>{label}</Animated.Text>
      <Animated.Text style={styles.statSub}>{sub}</Animated.Text>
    </Animated.View>
  );
};

// ── Settings row ──────────────────────────────────────────
const SettingsRow = ({
  Icon, label, sub, onPress, isDestructive, index,
}: {
  Icon: any; label: string; sub?: string;
  onPress: () => void; isDestructive?: boolean; index: number;
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-12);

  useEffect(() => {
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 300 }));
    translateX.value = withDelay(index * 60, withSpring(0, { damping: 14, stiffness: 100 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value, transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={style}>
      <AnimatedPressable onPress={onPress} scaleDown={0.98}>
        <View style={styles.settingsRow}>
          <View style={[styles.settingsIcon, isDestructive && styles.settingsIconDestructive]}>
            <Icon size={18} color={isDestructive ? Colors.error : Colors.brandGreen} />
          </View>
          <View style={styles.settingsText}>
            <Animated.Text style={[styles.settingsLabel, isDestructive && { color: Colors.error }]}>
              {label}
            </Animated.Text>
            {sub && <Animated.Text style={styles.settingsSub}>{sub}</Animated.Text>}
          </View>
          {!isDestructive && (
            <IconChevronRight size={16} color={Colors.textMuted} strokeWidth={2} />
          )}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

// ── Main Screen ───────────────────────────────────────────
export const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 380 });
    headerY.value = withSpring(0, { damping: 14, stiffness: 100 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const { signOut } = useAuth();
  // Mock user data — replace with auth context
  const user = { name: 'Rajdeep Kumar', phone: '+91 74800 62299' };

  const SETTINGS = [
    { Icon: IconLocation, label: 'Delivery Address',   sub: 'Bhagalpur, Bihar 812001', route: null     },
    { Icon: IconBell,     label: 'Notifications',      sub: 'Order updates, offers',   route: null     },
    { Icon: IconGold,     label: 'Farm Fresh Gold',    sub: 'Free delivery + more',    route: 'Gold'   },
    { Icon: IconTruck,    label: 'Order History',      sub: 'All your orders',         route: 'Orders' },
    { Icon: IconPhone,    label: 'Change Number',      sub: user.phone,                route: null     },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <LinearGradient colors={[Colors.bgDark, Colors.bgSecondary]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <Animated.View style={[styles.hero, headerStyle]}>
          <Avatar name={user.name} />
          <View style={styles.heroText}>
            <Animated.Text style={styles.userName}>{user.name}</Animated.Text>
            <View style={styles.phoneRow}>
              <IconPhone size={13} color={Colors.textOnDarkMuted} />
              <Animated.Text style={styles.userPhone}>{user.phone}</Animated.Text>
            </View>
          </View>
          <View style={styles.goldBadge}>
            <IconLeaf size={12} color={Colors.logoGreen} />
            <Animated.Text style={styles.goldBadgeText}>Member</Animated.Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Orders"   value="12"   sub="Total"       index={0} />
          <StatCard label="Saved"    value="₹340" sub="vs retail"   index={1} />
          <StatCard label="Since"    value="Apr"  sub="2025"        index={2} />
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Animated.Text style={[styles.sectionTitle, headerStyle]}>Account</Animated.Text>
          <View style={styles.settingsCard}>
            {SETTINGS.map((item, i) => (
              <View key={i}>
                <SettingsRow
                  Icon={item.Icon}
                  label={item.label}
                  sub={item.sub}
                  index={i}
                  onPress={() => item.route ? navigation.navigate(item.route) : null}
                />
                {i < SETTINGS.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.settingsCard}>
            <SettingsRow
              Icon={IconPhone}
              label="Sign Out"
              isDestructive
              index={0}
              onPress={signOut}
            />
          </View>
        </View>

        {/* Version */}
        <Animated.Text style={[styles.version, headerStyle]}>
          Farm Fresh v4.0 · lovefarmfresh.in
        </Animated.Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDark },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: 120, gap: Spacing.lg },

  // ── Hero ────────────────────────────────────────────────
  hero: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: Spacing.lg, gap: Spacing.md,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32, overflow: 'hidden',
    shadowColor: Colors.brandGreen, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
  avatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Font.outfitBold, fontSize: 22, color: Colors.white },
  heroText: { flex: 1, gap: 5 },
  userName: { fontFamily: Font.outfitBold, fontSize: 20, color: Colors.textOnDark },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  userPhone: { fontFamily: Font.jakartaRegular, fontSize: 13, color: Colors.textOnDarkMuted },
  goldBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(128,239,128,0.12)',
    borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(128,239,128,0.25)',
  },
  goldBadgeText: { fontFamily: Font.jakartaSemiBold, fontSize: 11, color: Colors.logoGreen },

  // ── Stats ────────────────────────────────────────────────
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1, backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.md, padding: Spacing.md,
    alignItems: 'center', gap: 3,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  statValue: { fontFamily: Font.outfitBold, fontSize: 20, color: Colors.textPrimary },
  statLabel: { fontFamily: Font.jakartaSemiBold, fontSize: 12, color: Colors.textSecondary },
  statSub: { fontFamily: Font.jakartaRegular, fontSize: 11, color: Colors.textMuted },

  // ── Section ──────────────────────────────────────────────
  section: { gap: Spacing.sm },
  sectionTitle: { fontFamily: Font.outfitSemiBold, fontSize: 16, color: Colors.textOnDark },
  settingsCard: {
    backgroundColor: Colors.bgSecondary, borderRadius: Radius.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight,
  },
  settingsRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.md,
  },
  settingsIcon: {
    width: 38, height: 38, borderRadius: Radius.sm,
    backgroundColor: 'rgba(45,138,78,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  settingsIconDestructive: { backgroundColor: 'rgba(239,68,68,0.08)' },
  settingsText: { flex: 1, gap: 2 },
  settingsLabel: { fontFamily: Font.jakartaSemiBold, fontSize: 15, color: Colors.textPrimary },
  settingsSub: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textMuted },
  separator: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 70 },

  version: {
    fontFamily: Font.jakartaRegular, fontSize: 12,
    color: Colors.textOnDarkSubtle, textAlign: 'center', paddingBottom: Spacing.md,
  },
});
