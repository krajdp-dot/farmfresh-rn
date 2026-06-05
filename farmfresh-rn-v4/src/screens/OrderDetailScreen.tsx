// ============================================================
// FARM FRESH RN v4 — OrderDetailScreen
// Live tracking steps · Item list · Invoice summary
// ============================================================

import React, { useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Dimensions, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Spacing, Radius } from '../theme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { IconChevronLeft, IconCheck, IconTruck, IconLeaf } from '../components/icons';

const TRACKING_STEPS = [
  { id: 1, label: 'Order Placed',      sub: 'Your order is confirmed',        done: true  },
  { id: 2, label: 'Picked from Mandi', sub: 'Sourced from Bhagalpur mandi',  done: true  },
  { id: 3, label: 'Out for Delivery',  sub: 'On the way to your address',     done: true  },
  { id: 4, label: 'Delivered',         sub: 'Estimated 5 PM – 7 PM today',   done: false },
];

const TrackingStep = ({
  step, index, isLast,
}: { step: typeof TRACKING_STEPS[0]; index: number; isLast: boolean }) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-16);
  const lineHeight = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(index * 150, withTiming(1, { duration: 340 }));
    translateX.value = withDelay(index * 150, withSpring(0, { damping: 14, stiffness: 100 }));
    if (!isLast && step.done) {
      lineHeight.value = withDelay(index * 150 + 200, withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }));
    }
  }, []);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: opacity.value, transform: [{ translateX: translateX.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: lineHeight.value }],
  }));

  return (
    <Animated.View style={[styles.trackStep, rowStyle]}>
      {/* Icon column */}
      <View style={styles.trackIconCol}>
        <View style={[
          styles.trackDot,
          step.done ? styles.trackDotDone : styles.trackDotPending,
        ]}>
          {step.done
            ? <IconCheck size={12} color={Colors.white} strokeWidth={2.5} />
            : <View style={styles.trackDotInner} />
          }
        </View>
        {!isLast && (
          <View style={styles.trackLineTrack}>
            <Animated.View style={[styles.trackLineFill, step.done && lineStyle]} />
          </View>
        )}
      </View>

      {/* Text */}
      <View style={styles.trackText}>
        <Animated.Text style={[
          styles.trackLabel,
          !step.done && styles.trackLabelPending,
        ]}>
          {step.label}
        </Animated.Text>
        <Animated.Text style={styles.trackSub}>{step.sub}</Animated.Text>
      </View>
    </Animated.View>
  );
};

export const OrderDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { order } = route.params;
  const insets = useSafeAreaInsets();
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(20);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 380 });
    contentY.value = withSpring(0, { damping: 14, stiffness: 100 });
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const isActive = order.status === 'On the way' || order.status === 'Preparing';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <LinearGradient colors={[Colors.bgDark, Colors.bgSecondary]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={() => navigation.goBack()} scaleDown={0.88}>
          <View style={styles.backBtn}>
            <IconChevronLeft size={20} color={Colors.textOnDark} strokeWidth={2.2} />
          </View>
        </AnimatedPressable>
        <View style={{ flex: 1 }}>
          <Animated.Text style={styles.title}>Order #{order.id}</Animated.Text>
          <Animated.Text style={styles.date}>{order.date}</Animated.Text>
        </View>
      </View>

      <Animated.ScrollView
        style={contentStyle}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Status banner */}
        <View style={[
          styles.statusBanner,
          { backgroundColor: isActive ? 'rgba(45,138,78,0.12)' : Colors.bgSecondary },
        ]}>
          <View style={styles.statusLeft}>
            <IconTruck size={20} color={isActive ? Colors.brandGreen : Colors.textMuted} />
            <View>
              <Animated.Text style={[styles.statusLabel, isActive && { color: Colors.brandGreen }]}>
                {order.status}
              </Animated.Text>
              {isActive && (
                <Animated.Text style={styles.statusSlot}>Slot: {order.slot}</Animated.Text>
              )}
            </View>
          </View>
          <Animated.Text style={styles.totalBadge}>₹{order.total}</Animated.Text>
        </View>

        {/* Tracking */}
        {isActive && (
          <View style={styles.section}>
            <Animated.Text style={styles.sectionTitle}>Live Tracking</Animated.Text>
            <View style={styles.trackCard}>
              {TRACKING_STEPS.map((step, i) => (
                <TrackingStep
                  key={step.id}
                  step={step}
                  index={i}
                  isLast={i === TRACKING_STEPS.length - 1}
                />
              ))}
            </View>
          </View>
        )}

        {/* Items */}
        <View style={styles.section}>
          <Animated.Text style={styles.sectionTitle}>Items</Animated.Text>
          <View style={styles.card}>
            {order.items.map((item: string, i: number) => (
              <View key={i} style={styles.itemRow}>
                <IconLeaf size={14} color={Colors.brandGreen} />
                <Animated.Text style={styles.itemText}>{item}</Animated.Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Animated.Text style={styles.sectionTitle}>Invoice</Animated.Text>
          <View style={styles.card}>
            <View style={styles.invoiceLine}>
              <Animated.Text style={styles.invoiceLabel}>Items total</Animated.Text>
              <Animated.Text style={styles.invoiceValue}>₹{order.total - 20}</Animated.Text>
            </View>
            <View style={styles.invoiceLine}>
              <Animated.Text style={styles.invoiceLabel}>Delivery</Animated.Text>
              <Animated.Text style={[styles.invoiceValue, { color: Colors.success }]}>FREE</Animated.Text>
            </View>
            <View style={styles.invoiceDivider} />
            <View style={styles.invoiceLine}>
              <Animated.Text style={styles.invoiceTotalLabel}>Total paid</Animated.Text>
              <Animated.Text style={styles.invoiceTotalValue}>₹{order.total}</Animated.Text>
            </View>
          </View>
        </View>

        {/* Delivery address */}
        <View style={styles.section}>
          <Animated.Text style={styles.sectionTitle}>Delivery address</Animated.Text>
          <View style={styles.card}>
            <Animated.Text style={styles.addressText}>
              Farm Fresh, Bhagalpur, Bihar 812001
            </Animated.Text>
          </View>
        </View>

      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDark },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md,
    paddingBottom: Spacing.md, gap: Spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: Colors.borderGlass,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: Font.outfitBold, fontSize: 20, color: Colors.textOnDark },
  date: { fontFamily: Font.jakartaRegular, fontSize: 13, color: Colors.textOnDarkMuted },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: 100, gap: Spacing.md },

  // ── Status banner ────────────────────────────────────────
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  statusLabel: { fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.textPrimary },
  statusSlot: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  totalBadge: { fontFamily: Font.outfitBold, fontSize: 18, color: Colors.textPrimary },

  // ── Section ──────────────────────────────────────────────
  section: { gap: Spacing.sm },
  sectionTitle: { fontFamily: Font.outfitSemiBold, fontSize: 16, color: Colors.textOnDark },
  card: {
    backgroundColor: Colors.bgSecondary, borderRadius: Radius.md,
    padding: Spacing.md, gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
  },

  // ── Tracking ─────────────────────────────────────────────
  trackCard: {
    backgroundColor: Colors.bgSecondary, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderLight,
  },
  trackStep: { flexDirection: 'row', gap: Spacing.md },
  trackIconCol: { alignItems: 'center', width: 28 },
  trackDot: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  trackDotDone: { backgroundColor: Colors.brandGreen },
  trackDotPending: {
    backgroundColor: Colors.neomorphBg,
    borderWidth: 2, borderColor: Colors.borderMedium,
  },
  trackDotInner: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.borderMedium,
  },
  trackLineTrack: {
    flex: 1, width: 2, backgroundColor: Colors.borderLight,
    marginVertical: 4, borderRadius: 1, overflow: 'hidden',
  },
  trackLineFill: {
    width: '100%', height: '100%',
    backgroundColor: Colors.brandGreen,
    transformOrigin: 'top',
  },
  trackText: { flex: 1, paddingBottom: Spacing.lg, gap: 3 },
  trackLabel: { fontFamily: Font.jakartaSemiBold, fontSize: 14, color: Colors.textPrimary },
  trackLabelPending: { color: Colors.textMuted },
  trackSub: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textMuted },

  // ── Items ─────────────────────────────────────────────────
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  itemText: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.textSecondary },

  // ── Invoice ──────────────────────────────────────────────
  invoiceLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoiceLabel: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.textSecondary },
  invoiceValue: { fontFamily: Font.jakartaSemiBold, fontSize: 14, color: Colors.textPrimary },
  invoiceDivider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 4 },
  invoiceTotalLabel: { fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.textPrimary },
  invoiceTotalValue: { fontFamily: Font.outfitBold, fontSize: 17, color: Colors.textPrimary },

  // ── Address ──────────────────────────────────────────────
  addressText: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
});
