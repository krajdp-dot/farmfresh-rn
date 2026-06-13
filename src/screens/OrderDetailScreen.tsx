import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import AnimatedPressable from '../components/AnimatedPressable';
import { DeliveryBoyCard, DeliveryPhotoProof } from '../components/features';
import { spacing, radius } from '../theme/tokens';

type OrderStatus = 'placed' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';

const STEPS: { key: OrderStatus; label: string; labelHi: string; icon: string; desc: string; descHi: string }[] = [
  { key: 'placed',           label: 'Order Placed',      labelHi: 'ऑर्डर दिया',     icon: '📦', desc: 'Your order has been received',      descHi: 'आपका ऑर्डर मिल गया' },
  { key: 'confirmed',        label: 'Confirmed',          labelHi: 'पुष्टि हुई',      icon: '✅', desc: 'Order is being prepared',           descHi: 'ऑर्डर तैयार हो रहा है' },
  { key: 'out_for_delivery', label: 'Out for Delivery',   labelHi: 'रास्ते में है',   icon: '🛵', desc: 'Your order is on the way',          descHi: 'डिलीवरी बॉय रास्ते में' },
  { key: 'delivered',        label: 'Delivered',          labelHi: 'डिलीवर हुआ',     icon: '🎉', desc: 'Order delivered successfully',       descHi: 'ऑर्डर सफलतापूर्वक पहुंचा' },
];

interface Order {
  id: string;
  date: string;
  dateHi: string;
  items: { name: string; nameHi: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  deliverySlot: string;
  deliverySlotHi: string;
  address: string;
}

interface Props {
  order: Order;
  onBack: () => void;
}

const OrderDetailScreen: React.FC<Props> = ({ order, onBack }) => {
  const { colors } = useTheme();
  const { isHindi } = useLang();
  const insets = useSafeAreaInsets();

  const boldFont   = isHindi ? 'Baloo2-Bold' : 'Outfit-Bold';
  const bodyFont   = isHindi ? 'Baloo2-Regular' : 'Outfit-Regular';
  const semiBold   = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont    = isHindi ? 'Baloo2-Medium' : 'Outfit-Medium';

  const currentIdx = STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';
  const deliveryFee = order.total >= 299 ? 0 : 30;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}>
        <AnimatedPressable onPress={onBack} scale={0.9}>
          <View style={[styles.backBtn, { backgroundColor: colors.bgSecondary }]}>
            <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
          </View>
        </AnimatedPressable>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: boldFont }]}>#{order.id}</Text>
          <Text style={[styles.headerDate, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {isHindi ? order.dateHi : order.date}
          </Text>
        </View>
        {!isCancelled && (
          <TouchableOpacity activeOpacity={0.7}>
            <View style={[styles.helpBtn, { backgroundColor: colors.bgSecondary }]}>
              <Text style={[styles.helpBtnText, { color: colors.textSecondary, fontFamily: medFont }]}>
                {isHindi ? 'सहायता' : 'Help'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Cancelled state */}
        {isCancelled && (
          <View style={[styles.cancelledCard, { backgroundColor: colors.redLight, borderColor: colors.red }]}>
            <Text style={styles.cancelledIcon}>✕</Text>
            <View style={styles.cancelledText}>
              <Text style={[styles.cancelledTitle, { color: colors.red, fontFamily: boldFont }]}>
                {isHindi ? 'ऑर्डर रद्द हुआ' : 'Order Cancelled'}
              </Text>
              <Text style={[styles.cancelledSub, { color: colors.textSecondary, fontFamily: bodyFont }]}>
                {isHindi ? 'रिफंड 3-5 दिन में मिलेगा' : 'Refund will be processed in 3-5 days'}
              </Text>
            </View>
          </View>
        )}

        {/* Tracking stepper */}
        {!isCancelled && (
          <View style={[styles.trackCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.trackHeader}>
              <Text style={[styles.trackTitle, { color: colors.text, fontFamily: boldFont }]}>
                {isHindi ? '📍 ऑर्डर ट्रैकिंग' : '📍 Order Tracking'}
              </Text>
              {order.status === 'out_for_delivery' && (
                <View style={[styles.liveChip, { backgroundColor: '#E8F5EE' }]}>
                  <View style={[styles.livePulse, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.liveText, { color: colors.primary, fontFamily: semiBold }]}>LIVE</Text>
                </View>
              )}
            </View>

            {STEPS.map((step, i) => {
              const done = i <= currentIdx;
              const curr = i === currentIdx;
              const pending = i > currentIdx;
              return (
                <View key={step.key} style={styles.stepRow}>
                  <View style={styles.stepLeft}>
                    <View style={[
                      styles.stepCircle,
                      {
                        backgroundColor: done ? colors.primary : colors.bgTertiary,
                        borderWidth: curr ? 3 : 0,
                        borderColor: curr ? colors.primary : 'transparent',
                      }
                    ]}>
                      {done && <Text style={styles.stepCircleIcon}>{step.icon}</Text>}
                    </View>
                    {i < STEPS.length - 1 && (
                      <View style={[styles.stepConnector, { backgroundColor: i < currentIdx ? colors.primary : colors.bgTertiary }]} />
                    )}
                  </View>
                  <View style={[styles.stepContent, { opacity: pending ? 0.45 : 1 }]}>
                    <Text style={[styles.stepLabel, { color: done ? colors.text : colors.textMuted, fontFamily: curr ? boldFont : medFont }]}>
                      {isHindi ? step.labelHi : step.label}
                    </Text>
                    <Text style={[styles.stepDesc, { color: colors.textMuted, fontFamily: bodyFont }]}>
                      {isHindi ? step.descHi : step.desc}
                    </Text>
                    {curr && (
                      <View style={[styles.currBadge, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[styles.currBadgeText, { color: colors.primary, fontFamily: semiBold }]}>
                          {isHindi ? '← अभी यहाँ है' : '← Current status'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Estimated delivery */}
            {!isCancelled && order.status !== 'delivered' && (
              <View style={[styles.etaBox, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                <Text style={styles.etaIcon}>🕐</Text>
                <View>
                  <Text style={[styles.etaLabel, { color: colors.textMuted, fontFamily: bodyFont }]}>
                    {isHindi ? 'अनुमानित डिलीवरी' : 'Expected Delivery'}
                  </Text>
                  <Text style={[styles.etaTime, { color: colors.primary, fontFamily: boldFont }]}>
                    {isHindi ? order.deliverySlotHi : order.deliverySlot}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Delivery Boy Card — F17 */}
        <DeliveryBoyCard order={order} />

        {/* Items ordered */}
        <View style={[styles.itemsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: boldFont }]}>
            {isHindi ? '🛒 ऑर्डर किए आइटम' : '🛒 Items Ordered'}
          </Text>
          {order.items.map((item, i) => (
            <View key={i} style={[styles.itemRow, { borderBottomColor: colors.borderLight }]}>
              <View style={[styles.itemQtyBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.itemQtyText, { color: colors.primary, fontFamily: boldFont }]}>{item.qty}×</Text>
              </View>
              <Text style={[styles.itemName, { color: colors.text, fontFamily: medFont }]} numberOfLines={1}>
                {isHindi ? item.nameHi : item.name}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.text, fontFamily: boldFont }]}>₹{item.price * item.qty}</Text>
            </View>
          ))}

          <View style={[styles.billDivider, { backgroundColor: colors.border }]} />

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.textSecondary, fontFamily: bodyFont }]}>
              {isHindi ? 'वस्तु कुल' : 'Item Total'}
            </Text>
            <Text style={[styles.billVal, { color: colors.text, fontFamily: medFont }]}>₹{order.total}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.textSecondary, fontFamily: bodyFont }]}>
              {isHindi ? 'डिलीवरी शुल्क' : 'Delivery Fee'}
            </Text>
            <Text style={[styles.billVal, { color: deliveryFee === 0 ? colors.primary : colors.text, fontFamily: medFont }]}>
              {deliveryFee === 0 ? (isHindi ? 'मुफ़्त' : 'FREE') : `₹${deliveryFee}`}
            </Text>
          </View>
          <View style={[styles.billDivider, { backgroundColor: colors.border }]} />
          <View style={styles.billRow}>
            <Text style={[styles.billTotalLabel, { color: colors.text, fontFamily: boldFont }]}>
              {isHindi ? 'कुल राशि' : 'Total Amount'}
            </Text>
            <Text style={[styles.billTotalVal, { color: colors.text, fontFamily: boldFont }]}>
              ₹{order.total + deliveryFee}
            </Text>
          </View>
        </View>

        {/* Delivery info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: boldFont }]}>
            {isHindi ? '📋 डिलीवरी जानकारी' : '📋 Delivery Info'}
          </Text>
          {[
            { icon: '📍', label: isHindi ? 'पता' : 'Address', value: order.address },
            { icon: '🕐', label: isHindi ? 'समय' : 'Slot', value: isHindi ? order.deliverySlotHi : order.deliverySlot },
            { icon: '💵', label: isHindi ? 'भुगतान' : 'Payment', value: isHindi ? 'कैश ऑन डिलीवरी' : 'Cash on Delivery' },
          ].map((row, i) => (
            <View key={i} style={[styles.infoRow, { borderBottomColor: colors.borderLight }]}>
              <Text style={styles.infoIcon}>{row.icon}</Text>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textMuted, fontFamily: bodyFont }]}>{row.label}</Text>
                <Text style={[styles.infoValue, { color: colors.text, fontFamily: medFont }]}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <View style={[styles.actionBtnInner, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
              <Text style={styles.actionIcon}>↺</Text>
              <Text style={[styles.actionLabel, { color: colors.text, fontFamily: semiBold }]}>
                {isHindi ? 'दोबारा ऑर्डर' : 'Reorder'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <View style={[styles.actionBtnInner, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={[styles.actionLabel, { color: colors.text, fontFamily: semiBold }]}>
                {isHindi ? 'समस्या' : 'Issue?'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <View style={[styles.actionBtnInner, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
              <Text style={styles.actionIcon}>⭐</Text>
              <Text style={[styles.actionLabel, { color: colors.text, fontFamily: semiBold }]}>
                {isHindi ? 'रेटिंग' : 'Rate'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18 },
  headerDate: { fontSize: 12, marginTop: 2 },
  helpBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  helpBtnText: { fontSize: 13 },
  scroll: { padding: 16, gap: 14 },
  cancelledCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelledIcon: { fontSize: 28, color: '#E23744' },
  cancelledText: { flex: 1, gap: 3 },
  cancelledTitle: { fontSize: 16 },
  cancelledSub: { fontSize: 13 },
  trackCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 4 },
  trackHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  trackTitle: { fontSize: 16 },
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  livePulse: { width: 7, height: 7, borderRadius: 4 },
  liveText: { fontSize: 11 },
  stepRow: { flexDirection: 'row', gap: 14, minHeight: 60 },
  stepLeft: { alignItems: 'center', width: 40 },
  stepCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleIcon: { fontSize: 18 },
  stepConnector: { width: 2, flex: 1, marginVertical: 2 },
  stepContent: { flex: 1, paddingTop: 8, gap: 2, paddingBottom: 8 },
  stepLabel: { fontSize: 15 },
  stepDesc: { fontSize: 12, lineHeight: 17 },
  currBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  currBadgeText: { fontSize: 11 },
  etaBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  etaIcon: { fontSize: 22 },
  etaLabel: { fontSize: 12 },
  etaTime: { fontSize: 15 },
  deliveryBoyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  deliveryBoyAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  deliveryBoyEmoji: { fontSize: 28 },
  deliveryBoyInfo: { flex: 1, gap: 2 },
  deliveryBoyName: { fontSize: 15 },
  deliveryBoySub: { fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingIcon: { fontSize: 13 },
  ratingText: { fontSize: 13 },
  ratingCount: { fontSize: 11 },
  callBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  callBtnText: { fontSize: 22 },
  itemsCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  cardTitle: { fontSize: 16, marginBottom: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1 },
  itemQtyBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  itemQtyText: { fontSize: 13 },
  itemName: { flex: 1, fontSize: 14 },
  itemPrice: { fontSize: 15 },
  billDivider: { height: 1, marginVertical: 4 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billLabel: { fontSize: 14 },
  billVal: { fontSize: 14 },
  billTotalLabel: { fontSize: 17 },
  billTotalVal: { fontSize: 20 },
  infoCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 0 },
  infoRow: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  infoIcon: { fontSize: 18, width: 26 },
  infoContent: { flex: 1, gap: 1 },
  infoLabel: { fontSize: 11 },
  infoValue: { fontSize: 14 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1 },
  actionBtnInner: { borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center', gap: 5 },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: 12 },
});

export default OrderDetailScreen;
