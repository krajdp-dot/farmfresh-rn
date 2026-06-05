// ============================================================
// FARM FRESH RN v4 — OrdersScreen
// Order history list · Status badges · Track CTA
// ============================================================

import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList, Dimensions, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withDelay, withTiming, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Font, Spacing, Radius, Glass } from '../theme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { IconChevronRight, IconLeaf, IconTruck, IconCheck } from '../components/icons';

const STATUS_COLOR: Record<string, string> = {
  Delivered:  Colors.success,
  'On the way': Colors.brandGreen,
  Preparing: Colors.accentYellow,
  Cancelled: Colors.error,
};

const STATUS_BG: Record<string, string> = {
  Delivered:    'rgba(34,197,94,0.12)',
  'On the way': 'rgba(45,138,78,0.15)',
  Preparing:    'rgba(245,158,11,0.12)',
  Cancelled:    'rgba(239,68,68,0.10)',
};

const MOCK_ORDERS = [
  {
    id: 'FF2401',
    date: 'Today, 7:30 AM',
    status: 'On the way',
    items: ['Fresh Tomato ×2', 'Red Onion ×1'],
    total: 91,
    slot: '5 PM – 7 PM',
  },
  {
    id: 'FF2398',
    date: 'Yesterday',
    status: 'Delivered',
    items: ['Alphonso Mango ×1', 'Banana ×2'],
    total: 210,
    slot: '7 AM – 9 AM',
  },
  {
    id: 'FF2385',
    date: '2 days ago',
    status: 'Delivered',
    items: ['Spinach ×1', 'Carrot ×2', 'Potato ×1'],
    total: 105,
    slot: '8 AM – 10 AM',
  },
  {
    id: 'FF2370',
    date: '5 days ago',
    status: 'Cancelled',
    items: ['Capsicum ×2'],
    total: 80,
    slot: '—',
  },
];

const OrderCard = ({
  order, index, onPress,
}: { order: typeof MOCK_ORDERS[0]; index: number; onPress: () => void }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 340, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(index * 80, withSpring(0, { damping: 14, stiffness: 100 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value, transform: [{ translateY: translateY.value }],
  }));

  const isActive = order.status === 'On the way' || order.status === 'Preparing';

  return (
    <Animated.View style={style}>
      <AnimatedPressable onPress={onPress} scaleDown={0.97}>
        <View style={[styles.card, isActive && styles.cardActive]}>
          {/* Active order glow border */}
          {isActive && <View style={styles.activeBorder} pointerEvents="none" />}

          {/* Top row */}
          <View style={styles.cardTop}>
            <View style={styles.orderIdRow}>
              <Animated.Text style={styles.orderId}>#{order.id}</Animated.Text>
              <Animated.Text style={styles.orderDate}>{order.date}</Animated.Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[order.status] }]}>
              <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[order.status] }]} />
              <Animated.Text style={[styles.statusText, { color: STATUS_COLOR[order.status] }]}>
                {order.status}
              </Animated.Text>
            </View>
          </View>

          {/* Items */}
          <View style={styles.itemsList}>
            {order.items.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <IconLeaf size={11} color={Colors.brandGreen} />
                <Animated.Text style={styles.itemText}>{item}</Animated.Text>
              </View>
            ))}
          </View>

          {/* Bottom row */}
          <View style={styles.cardBottom}>
            <View style={styles.slotRow}>
              <IconTruck size={13} color={Colors.textMuted} />
              <Animated.Text style={styles.slotText}>{order.slot}</Animated.Text>
            </View>
            <View style={styles.totalRow}>
              <Animated.Text style={styles.totalText}>₹{order.total}</Animated.Text>
              <IconChevronRight size={14} color={Colors.brandGreen} strokeWidth={2.5} />
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

export const OrdersScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-16);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 360 });
    headerY.value = withSpring(0, { damping: 14, stiffness: 100 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <LinearGradient colors={[Colors.bgDark, Colors.bgSecondary]} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Text style={styles.title}>Orders</Animated.Text>
        <Animated.Text style={styles.subtitle}>Your order history</Animated.Text>
      </Animated.View>

      <FlatList
        data={MOCK_ORDERS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <OrderCard
            order={item}
            index={index}
            onPress={() => navigation.navigate('OrderDetail', { order: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconCheck size={40} color={Colors.borderGlass} />
            <Animated.Text style={styles.emptyTitle}>No orders yet</Animated.Text>
            <Animated.Text style={styles.emptySub}>Your orders will appear here</Animated.Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDark },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md, paddingBottom: Spacing.lg,
  },
  title: { fontFamily: Font.outfitBold, fontSize: 28, color: Colors.textOnDark },
  subtitle: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.textOnDarkMuted, marginTop: 4 },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 120, gap: Spacing.md },

  card: {
    backgroundColor: Colors.bgSecondary, borderRadius: Radius.lg,
    padding: Spacing.md, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  cardActive: { backgroundColor: '#F0F7F2' },
  activeBorder: {
    ...StyleSheet.absoluteFillObject, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.brandGreen,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderIdRow: { gap: 3 },
  orderId: { fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.textPrimary },
  orderDate: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textMuted },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: Font.jakartaSemiBold, fontSize: 12 },
  itemsList: { gap: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemText: { fontFamily: Font.jakartaRegular, fontSize: 13, color: Colors.textSecondary },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  slotText: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textMuted },
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  totalText: { fontFamily: Font.outfitBold, fontSize: 16, color: Colors.textPrimary },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingTop: 80 },
  emptyTitle: { fontFamily: Font.outfitBold, fontSize: 20, color: Colors.textOnDark },
  emptySub: { fontFamily: Font.jakartaRegular, fontSize: 14, color: Colors.textOnDarkMuted },
});
