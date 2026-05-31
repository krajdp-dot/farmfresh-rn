import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Font, fs, wp, hp, Radius } from '../theme';
import { OrderAPI, type OrderStatus } from '../api/client';
import { useLangStore } from '../stores/stores';
import { formatPrice } from '../utils/currency';
import type { OrderDetailRouteProp } from '../navigation/types';

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'out_for_delivery', 'delivered'];
const STEP_LABELS: Record<OrderStatus, string> = {
  pending: 'Placed', confirmed: 'Confirmed',
  out_for_delivery: 'On the way', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const route = useRoute<OrderDetailRouteProp>();
  const { orderId } = route.params;
  const { lang } = useLangStore();

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => OrderAPI.getById(orderId).then((r) => r.data),
    refetchInterval: 30_000,
  });

  if (!order) return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <Pressable onPress={() => nav.goBack()} style={s.back}><Text style={s.backText}>‹</Text></Pressable>
    </View>
  );

  const currentStep = STEPS.indexOf(order.status as OrderStatus);

  return (
    <View style={[s.root, { paddingTop: insets.top + hp(12) }]}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => nav.goBack()}><Text style={s.backText}>‹</Text></Pressable>
        <Text style={s.title}>Order #{order.shortId ?? order._id.slice(-6).toUpperCase()}</Text>
        <View style={{ width: wp(32) }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress tracker */}
        {order.status !== 'cancelled' && (
          <View style={s.tracker}>
            {STEPS.map((step, i) => {
              const done = i <= currentStep;
              return (
                <React.Fragment key={step}>
                  <View style={s.trackerStep}>
                    <View style={[s.trackerDot, done && s.trackerDotDone]}>
                      {done && <Text style={{ fontSize: fs(12) }}>✓</Text>}
                    </View>
                    <Text style={[s.trackerLabel, done && s.trackerLabelDone]}>{STEP_LABELS[step]}</Text>
                  </View>
                  {i < STEPS.length - 1 && (
                    <View style={[s.trackerLine, i < currentStep && s.trackerLineDone]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        )}

        {/* Items */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Items</Text>
          {order.items.map((item, i) => (
            <View key={i} style={s.itemRow}>
              <Text style={s.itemName}>{item.name}</Text>
              <Text style={s.itemDetail}>{item.qty} {item.unit} · {formatPrice(item.price * item.qty)}</Text>
            </View>
          ))}
        </View>

        {/* Bill */}
        <View style={s.card}>
          <View style={s.billRow}><Text style={s.billLabel}>Subtotal</Text><Text style={s.billVal}>{formatPrice(order.subtotal)}</Text></View>
          <View style={s.billRow}><Text style={s.billLabel}>Delivery</Text><Text style={s.billVal}>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</Text></View>
          <View style={[s.billRow, s.totalRow]}><Text style={s.totalLabel}>Total</Text><Text style={s.totalVal}>{formatPrice(order.total)}</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(16), marginBottom: hp(12) },
  back: { width: wp(32), height: wp(32), alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: Font.outfit.bold, fontSize: fs(26), color: Colors.textPrimary },
  title: { flex: 1, fontFamily: Font.outfit.bold, fontSize: fs(18), color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.2 },
  scroll: { padding: wp(16), gap: hp(12), paddingBottom: hp(80) },
  tracker: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.bgCard, borderRadius: Radius.xl, padding: wp(16), borderWidth: 1, borderColor: Colors.border },
  trackerStep: { alignItems: 'center', gap: hp(4), flex: 1 },
  trackerDot: { width: wp(28), height: wp(28), borderRadius: Radius.full, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.border },
  trackerDotDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  trackerLabel: { fontFamily: Font.outfit.regular, fontSize: fs(10), color: Colors.textMuted, textAlign: 'center' },
  trackerLabelDone: { color: Colors.textPrimary, fontFamily: Font.outfit.medium },
  trackerLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginTop: wp(13) },
  trackerLineDone: { backgroundColor: Colors.primary },
  card: { backgroundColor: Colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, padding: wp(14), gap: hp(8) },
  cardTitle: { fontFamily: Font.outfit.semiBold, fontSize: fs(15), color: Colors.textPrimary, marginBottom: hp(4) },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { fontFamily: Font.outfit.regular, fontSize: fs(14), color: Colors.textSecondary },
  itemDetail: { fontFamily: Font.jakarta.medium, fontSize: fs(13), color: Colors.textPrimary },
  billRow: { flexDirection: 'row', justifyContent: 'space-between' },
  billLabel: { fontFamily: Font.outfit.regular, fontSize: fs(14), color: Colors.textSecondary },
  billVal: { fontFamily: Font.jakarta.medium, fontSize: fs(14), color: Colors.textPrimary },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.divider, paddingTop: hp(8), marginTop: hp(2) },
  totalLabel: { fontFamily: Font.outfit.bold, fontSize: fs(16), color: Colors.textPrimary },
  totalVal: { fontFamily: Font.jakarta.bold, fontSize: fs(18), color: Colors.accent },
});
