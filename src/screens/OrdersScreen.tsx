import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import AnimatedPressable from '../components/AnimatedPressable';
import { RepeatOrderButton } from '../components/features';
import { spacing, radius, SCREEN_WIDTH } from '../theme/tokens';

type OrderStatus = 'placed' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';

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

const MOCK_ORDERS: Order[] = [
  {
    id: 'FF2401', date: 'Today, 9:30 AM', dateHi: 'आज, सुबह 9:30',
    items: [
      { name: 'Fresh Tomatoes', nameHi: 'ताज़े टमाटर', qty: 2, price: 25 },
      { name: 'Onions', nameHi: 'प्याज़', qty: 1, price: 28 },
      { name: 'Spinach', nameHi: 'पालक', qty: 1, price: 18 },
    ],
    total: 96, status: 'out_for_delivery',
    deliverySlot: '10AM – 1PM', deliverySlotHi: 'सुबह 10 – दोपहर 1 बजे',
    address: 'Adampur, Bhagalpur',
  },
  {
    id: 'FF2398', date: 'Yesterday, 8:00 AM', dateHi: 'कल, सुबह 8:00',
    items: [
      { name: 'Potatoes', nameHi: 'आलू', qty: 3, price: 22 },
      { name: 'Cauliflower', nameHi: 'फूलगोभी', qty: 1, price: 35 },
    ],
    total: 101, status: 'delivered',
    deliverySlot: '7AM – 10AM', deliverySlotHi: 'सुबह 7–10 बजे',
    address: 'Tatarpur, Bhagalpur',
  },
  {
    id: 'FF2385', date: '3 days ago', dateHi: '3 दिन पहले',
    items: [
      { name: 'Bitter Gourd', nameHi: 'करेला', qty: 2, price: 42 },
      { name: 'Ginger', nameHi: 'अदरक', qty: 1, price: 80 },
    ],
    total: 164, status: 'delivered',
    deliverySlot: '4PM – 7PM', deliverySlotHi: 'शाम 4–7 बजे',
    address: 'Adampur, Bhagalpur',
  },
  {
    id: 'FF2370', date: '1 week ago', dateHi: '1 हफ्ते पहले',
    items: [
      { name: 'Garlic', nameHi: 'लहसुन', qty: 1, price: 100 },
    ],
    total: 100, status: 'cancelled',
    deliverySlot: '7AM – 10AM', deliverySlotHi: 'सुबह 7–10 बजे',
    address: 'Adampur, Bhagalpur',
  },
];

const STATUS_MAP: Record<OrderStatus, { label: string; labelHi: string; icon: string; color: string; bg: string }> = {
  placed:           { label: 'Order Placed',      labelHi: 'ऑर्डर दिया',     icon: '📦', color: '#9B9B9B', bg: '#F5F5F5' },
  confirmed:        { label: 'Confirmed',          labelHi: 'पुष्टि हुई',      icon: '✅', color: '#2D8A4E', bg: '#E8F5EE' },
  out_for_delivery: { label: 'Out for Delivery',   labelHi: 'रास्ते में है',   icon: '🛵', color: '#F5A623', bg: '#FFF8E7' },
  delivered:        { label: 'Delivered',          labelHi: 'डिलीवर हुआ',     icon: '🎉', color: '#2D8A4E', bg: '#E8F5EE' },
  cancelled:        { label: 'Cancelled',          labelHi: 'रद्द हुआ',       icon: '✕',  color: '#E23744', bg: '#FFF0F1' },
};

const STEPS: OrderStatus[] = ['placed', 'confirmed', 'out_for_delivery', 'delivered'];

interface Props {
  onOrderPress: (order: Order) => void;
}

const OrdersScreen: React.FC<Props> = ({ onOrderPress }) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'active' | 'past'>('active');

  const boldFont = isHindi ? 'Baloo2-Bold' : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular' : 'Outfit-Regular';
  const semiBoldFont = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont = isHindi ? 'Baloo2-Medium' : 'Outfit-Medium';

  const active = MOCK_ORDERS.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const past   = MOCK_ORDERS.filter(o => o.status === 'delivered' || o.status === 'cancelled');
  const data   = tab === 'active' ? active : past;

  const renderItem = ({ item }: { item: Order }) => {
    const cfg = STATUS_MAP[item.status];
    const stepIdx = STEPS.indexOf(item.status);
    const isActive = tab === 'active';

    return (
      <AnimatedPressable onPress={() => onOrderPress(item)} scale={0.985}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

          {/* Status bar at top */}
          <View style={[styles.cardStatusBar, { backgroundColor: cfg.bg }]}>
            <Text style={styles.cardStatusIcon}>{cfg.icon}</Text>
            <Text style={[styles.cardStatusLabel, { color: cfg.color, fontFamily: semiBoldFont }]}>
              {isHindi ? cfg.labelHi : cfg.label}
            </Text>
            {item.status === 'out_for_delivery' && (
              <View style={[styles.liveDot, { backgroundColor: cfg.color }]} />
            )}
            <Text style={[styles.cardDate, { color: colors.textMuted, fontFamily: bodyFont }]}>
              {isHindi ? item.dateHi : item.date}
            </Text>
          </View>

          <View style={styles.cardBody}>
            {/* Order ID + slot */}
            <View style={styles.cardTopRow}>
              <View>
                <Text style={[styles.orderId, { color: colors.text, fontFamily: boldFont }]}>#{item.id}</Text>
                <View style={styles.slotRow}>
                  <Text style={[styles.slotIcon]}>🕐</Text>
                  <Text style={[styles.slotText, { color: colors.textMuted, fontFamily: bodyFont }]}>
                    {isHindi ? item.deliverySlotHi : item.deliverySlot}
                  </Text>
                </View>
              </View>
              <Text style={[styles.orderTotal, { color: colors.text, fontFamily: boldFont }]}>₹{item.total}</Text>
            </View>

            {/* Items list */}
            <View style={[styles.itemsList, { backgroundColor: colors.bgSecondary, borderColor: colors.borderLight }]}>
              {item.items.slice(0, 3).map((it, i) => (
                <View key={i} style={styles.itemRow}>
                  <Text style={[styles.itemBullet, { color: colors.primary }]}>•</Text>
                  <Text style={[styles.itemText, { color: colors.textSecondary, fontFamily: bodyFont }]} numberOfLines={1}>
                    {isHindi ? it.nameHi : it.name} × {it.qty}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.text, fontFamily: medFont }]}>₹{it.price * it.qty}</Text>
                </View>
              ))}
              {item.items.length > 3 && (
                <Text style={[styles.moreItems, { color: colors.textMuted, fontFamily: bodyFont }]}>
                  +{item.items.length - 3} {isHindi ? 'और' : 'more items'}
                </Text>
              )}
            </View>

            {/* Stepper for active orders */}
            {isActive && stepIdx >= 0 && (
              <View style={styles.stepperRow}>
                {STEPS.map((step, i) => {
                  const done = i <= stepIdx;
                  const curr = i === stepIdx;
                  return (
                    <React.Fragment key={step}>
                      <View style={styles.stepItem}>
                        <View style={[
                          styles.stepCircle,
                          {
                            backgroundColor: done ? colors.primary : colors.bgTertiary,
                            width: curr ? 14 : 10,
                            height: curr ? 14 : 10,
                            borderRadius: curr ? 7 : 5,
                            borderWidth: curr ? 2 : 0,
                            borderColor: curr ? colors.primary : 'transparent',
                          }
                        ]} />
                        <Text style={[styles.stepLabel, { color: curr ? colors.primary : colors.textMuted, fontFamily: curr ? semiBoldFont : bodyFont }]}>
                          {isHindi
                            ? ['दिया', 'कन्फर्म', 'रास्ते में', 'पहुंचा'][i]
                            : ['Placed', 'Confirmed', 'On way', 'Delivered'][i]}
                        </Text>
                      </View>
                      {i < STEPS.length - 1 && (
                        <View style={[styles.stepLine, { backgroundColor: i < stepIdx ? colors.primary : colors.bgTertiary }]} />
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
            )}

            {/* Footer row */}
            <View style={styles.cardFooter}>
              <View style={styles.addressRow}>
                <Text style={[styles.addressIcon]}>📍</Text>
                <Text style={[styles.addressText, { color: colors.textMuted, fontFamily: bodyFont }]} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
              <View style={styles.footerActions}>
                {(item.status === 'delivered' || item.status === 'cancelled') && (
                  <RepeatOrderButton order={item} onDone={() => {}} />
                )}
                <TouchableOpacity activeOpacity={0.7} onPress={() => onOrderPress(item)}>
                  <View style={[styles.detailBtn, { backgroundColor: colors.bgSecondary }]}>
                    <Text style={[styles.detailBtnText, { color: colors.textSecondary, fontFamily: medFont }]}>
                      {isHindi ? 'विवरण' : 'Details'} →
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: boldFont }]}>{t('myOrders')}</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {isHindi ? `${active.length} सक्रिय · ${past.length} पुराने` : `${active.length} active · ${past.length} past`}
          </Text>
        </View>

        {/* Tab switcher */}
        <View style={[styles.tabWrap, { backgroundColor: colors.bgSecondary }]}>
          {(['active', 'past'] as const).map((tab_) => (
            <TouchableOpacity key={tab_} onPress={() => setTab(tab_)} activeOpacity={0.8}>
              <View style={[styles.tabItem, tab === tab_ && { backgroundColor: colors.primary }]}>
                <Text style={[styles.tabText, {
                  color: tab === tab_ ? '#fff' : colors.textSecondary,
                  fontFamily: tab === tab_ ? semiBoldFont : bodyFont,
                }]}>
                  {tab_ === 'active' ? (isHindi ? `सक्रिय (${active.length})` : `Active (${active.length})`) : (isHindi ? `पुराने (${past.length})` : `Past (${past.length})`)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: boldFont }]}>
              {isHindi ? 'कोई ऑर्डर नहीं' : 'No orders yet'}
            </Text>
            <Text style={[styles.emptySub, { color: colors.textMuted, fontFamily: bodyFont }]}>
              {isHindi ? 'ताज़ी सब्ज़ियाँ ऑर्डर करें!' : 'Order fresh vegetables!'}
            </Text>
          </View>
        }
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTitle: { fontSize: 22 },
  headerSub: { fontSize: 12, marginTop: 2 },
  tabWrap: { flexDirection: 'row', borderRadius: 12, padding: 3, alignSelf: 'flex-start' },
  tabItem: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  tabText: { fontSize: 13 },
  list: { padding: 16, gap: 14, paddingBottom: 32 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cardStatusIcon: { fontSize: 14 },
  cardStatusLabel: { flex: 1, fontSize: 13 },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  cardDate: { fontSize: 12 },
  cardBody: { padding: 14, gap: 12 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: 16 },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  slotIcon: { fontSize: 12 },
  slotText: { fontSize: 12 },
  orderTotal: { fontSize: 20 },
  itemsList: { borderRadius: 10, borderWidth: 1, padding: 10, gap: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemBullet: { fontSize: 16, lineHeight: 18 },
  itemText: { flex: 1, fontSize: 13 },
  itemPrice: { fontSize: 13 },
  moreItems: { fontSize: 12, marginTop: 2, marginLeft: 14 },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  stepItem: { alignItems: 'center', gap: 4, minWidth: 50 },
  stepCircle: {},
  stepLabel: { fontSize: 9, textAlign: 'center', lineHeight: 12 },
  stepLine: { flex: 1, height: 2, marginBottom: 14 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  addressIcon: { fontSize: 12 },
  addressText: { fontSize: 12, flex: 1 },
  footerActions: { flexDirection: 'row', gap: 8 },
  reorderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  reorderText: { fontSize: 12 },
  detailBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  detailBtnText: { fontSize: 12 },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 20 },
  emptySub: { fontSize: 14 },
});

export default OrdersScreen;
