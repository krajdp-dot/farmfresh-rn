import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../stores/cartStore';
import { useSettings } from '../hooks/useSettings';
import { usePlaceOrder } from '../hooks/useOrders';
import AnimatedPressable from '../components/AnimatedPressable';
import { radius } from '../theme/tokens';

const SLOTS = [
  { id: 's1', time: '7AM – 10AM',  timeHi: 'सुबह 7–10 बजे',         icon: '🌅', note: 'Most popular', noteHi: 'सबसे लोकप्रिय' },
  { id: 's2', time: '10AM – 1PM',  timeHi: 'सुबह 10–दोपहर 1 बजे',   icon: '☀️', note: 'Recommended',  noteHi: 'सुझाया गया' },
  { id: 's3', time: '4PM – 7PM',   timeHi: 'शाम 4–7 बजे',            icon: '🌆', note: 'Evening slot',  noteHi: 'शाम की डिलीवरी' },
];

const PAYMENT_METHODS = [
  { id: 'cod',    icon: '💵', label: 'Cash on Delivery', labelHi: 'कैश ऑन डिलीवरी',    sub: 'Pay when delivered',   subHi: 'डिलीवरी पर भुगतान' },
  { id: 'upi',    icon: '📱', label: 'UPI / QR Code',   labelHi: 'UPI / QR कोड',       sub: 'PhonePe, GPay, Paytm', subHi: 'फोनपे, गूगल पे' },
  { id: 'card',   icon: '💳', label: 'Card / Net Banking',labelHi: 'कार्ड / नेट बैंकिंग',sub: 'All cards accepted',   subHi: 'सभी कार्ड' },
];

const SAVED_ADDRESSES = [
  { id: 'a1', tag: 'Home', tagHi: 'घर',   address: 'Adampur, Near Civil Court, Bhagalpur - 812001' },
  { id: 'a2', tag: 'Work', tagHi: 'ऑफिस', address: 'Tatarpur, Main Road, Bhagalpur - 812002' },
];

interface Props {
  onOrderPlaced: (shortId: string) => void;
  onBack: () => void;
}

const CheckoutScreen: React.FC<Props> = ({ onOrderPlaced, onBack }) => {
  const { colors }   = useTheme();
  const { t, isHindi } = useLang();
  const { user }     = useAuth();
  const insets       = useSafeAreaInsets();
  const items        = useCartStore(s => s.items);
  const totalPrice   = useCartStore(s => s.totalPrice());
  const clearCart    = useCartStore(s => s.clearCart);
  const { calcDeliveryFee } = useSettings();
  const { placeOrder, loading: placing, error: orderError } = usePlaceOrder();

  const [selAddr,      setSelAddr]      = useState('a1');
  const [customAddr,   setCustomAddr]   = useState('');
  const [useCustom,    setUseCustom]    = useState(false);
  const [slot,         setSlot]         = useState('s1');
  const [payment,      setPayment]      = useState<'cod'|'upi'|'card'>('cod');
  const [note,         setNote]         = useState('');
  const [coupon,       setCoupon]       = useState('');

  const boldFont = isHindi ? 'Baloo2-Bold'     : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular'  : 'Outfit-Regular';
  const semiBold = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont  = isHindi ? 'Baloo2-Medium'   : 'Outfit-Medium';

  const deliveryFee = calcDeliveryFee(totalPrice);
  const grandTotal  = totalPrice + deliveryFee;

  const addressText = useCustom
    ? customAddr.trim()
    : SAVED_ADDRESSES.find(a => a.id === selAddr)?.address ?? '';
  const canPlace = addressText.length > 5 && !!user?.phone;

  const handlePlaceOrder = async () => {
    if (!canPlace || placing) return;
    const slotObj = SLOTS.find(s => s.id === slot);

    // Backend expects: items[].productId, address.fullAddress, phone, customerName, notes, deliverySlot, paymentMethod, couponCode
    const order = await placeOrder({
      items: items.map(i => ({
        productId: i.id,
        name:      i.name,
        qty:       i.qty,
        price:     i.price,
        mrp:       i.mandiPrice ?? i.price,
        unit:      i.unit,
      })),
      address:       { fullAddress: addressText },
      phone:         user!.phone,
      customerName:  user?.name || undefined,
      notes:         note.trim() || undefined,
      deliverySlot:  isHindi ? slotObj?.timeHi : slotObj?.time,
      paymentMethod: payment,
      couponCode:    coupon.trim().toUpperCase() || undefined,
    });

    if (order) {
      clearCart();
      const shortId = 'FF' + order._id.toString().slice(-6).toUpperCase();
      onOrderPlaced(shortId);
    }
  };

  const SectionTitle = ({ icon, title }: { icon: string; title: string }) => (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitleIcon}>{icon}</Text>
      <Text style={[styles.sectionTitleText, { color: colors.text, fontFamily: boldFont }]}>{title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}>
        <AnimatedPressable onPress={onBack} scale={0.9}>
          <View style={[styles.backBtn, { backgroundColor: colors.bgSecondary }]}>
            <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
          </View>
        </AnimatedPressable>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: boldFont }]}>{t('checkout')}</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {items.length} {isHindi ? 'वस्तुएं' : 'items'} · ₹{grandTotal}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Address */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionTitle icon="📍" title={isHindi ? 'डिलीवरी पता' : 'Delivery Address'} />
          {SAVED_ADDRESSES.map(addr => (
            <TouchableOpacity key={addr.id} onPress={() => { setSelAddr(addr.id); setUseCustom(false); }} activeOpacity={0.8}>
              <View style={[styles.addrCard, {
                backgroundColor: (!useCustom && selAddr === addr.id) ? colors.primaryLight : colors.bgSecondary,
                borderColor: (!useCustom && selAddr === addr.id) ? colors.primary : colors.border,
              }]}>
                <View style={[styles.radio, { borderColor: (!useCustom && selAddr === addr.id) ? colors.primary : colors.border }]}>
                  {!useCustom && selAddr === addr.id && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                </View>
                <View style={styles.addrInfo}>
                  <View style={[styles.addrTag, { backgroundColor: (!useCustom && selAddr === addr.id) ? colors.primary : colors.bgTertiary }]}>
                    <Text style={[styles.addrTagText, { color: (!useCustom && selAddr === addr.id) ? '#fff' : colors.textSecondary, fontFamily: semiBold }]}>
                      {isHindi ? addr.tagHi : addr.tag}
                    </Text>
                  </View>
                  <Text style={[styles.addrText, { color: colors.text, fontFamily: bodyFont }]} numberOfLines={2}>{addr.address}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setUseCustom(true)} activeOpacity={0.8}>
            <View style={[styles.addrCard, {
              backgroundColor: useCustom ? colors.primaryLight : colors.bgSecondary,
              borderColor: useCustom ? colors.primary : colors.border,
              borderStyle: 'dashed',
            }]}>
              <View style={[styles.radio, { borderColor: useCustom ? colors.primary : colors.border }]}>
                {useCustom && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
              </View>
              <Text style={[styles.addAddrText, { color: useCustom ? colors.primary : colors.textMuted, fontFamily: medFont }]}>
                + {isHindi ? 'नया पता जोड़ें' : 'Add new address'}
              </Text>
            </View>
          </TouchableOpacity>
          {useCustom && (
            <TextInput
              style={[styles.addrInput, {
                backgroundColor: colors.inputBg, color: colors.text, fontFamily: bodyFont,
                borderColor: customAddr.length > 5 ? colors.primary : colors.inputBorder,
              }]}
              placeholder={isHindi ? 'पूरा पता — गली, मोहल्ला, शहर...' : 'Full address — street, area, landmark...'}
              placeholderTextColor={colors.textMuted}
              value={customAddr} onChangeText={setCustomAddr}
              multiline numberOfLines={3} textAlignVertical="top"
            />
          )}
        </View>

        {/* Slot */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionTitle icon="🕐" title={isHindi ? 'डिलीवरी समय' : 'Delivery Slot'} />
          <View style={styles.slotsRow}>
            {SLOTS.map(s => {
              const active = slot === s.id;
              return (
                <TouchableOpacity key={s.id} onPress={() => setSlot(s.id)} activeOpacity={0.8} style={styles.slotBtn}>
                  <View style={[styles.slotCard, {
                    backgroundColor: active ? colors.primaryLight : colors.bgSecondary,
                    borderColor: active ? colors.primary : colors.border,
                  }]}>
                    <Text style={styles.slotIcon}>{s.icon}</Text>
                    <Text style={[styles.slotTime, { color: active ? colors.primary : colors.text, fontFamily: active ? boldFont : medFont }]}>
                      {isHindi ? s.timeHi : s.time}
                    </Text>
                    <Text style={[styles.slotNote, { color: active ? colors.primary : colors.textMuted, fontFamily: bodyFont }]}>
                      {isHindi ? s.noteHi : s.note}
                    </Text>
                    {active && <View style={[styles.slotCheck, { backgroundColor: colors.primary }]}><Text style={styles.slotCheckText}>✓</Text></View>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Payment */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionTitle icon="💳" title={isHindi ? 'भुगतान विधि' : 'Payment Method'} />
          {PAYMENT_METHODS.map(pm => {
            const active = payment === pm.id;
            return (
              <TouchableOpacity key={pm.id} onPress={() => setPayment(pm.id as any)} activeOpacity={0.8}>
                <View style={[styles.pmCard, {
                  backgroundColor: active ? colors.primaryLight : colors.bgSecondary,
                  borderColor: active ? colors.primary : colors.border,
                }]}>
                  <View style={[styles.radio, { borderColor: active ? colors.primary : colors.border }]}>
                    {active && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Text style={styles.pmIcon}>{pm.icon}</Text>
                  <View style={styles.pmInfo}>
                    <Text style={[styles.pmLabel, { color: colors.text, fontFamily: active ? semiBold : medFont }]}>
                      {isHindi ? pm.labelHi : pm.label}
                    </Text>
                    <Text style={[styles.pmSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
                      {isHindi ? pm.subHi : pm.sub}
                    </Text>
                  </View>
                  {pm.id === 'cod' && (
                    <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.popularText}>{isHindi ? 'लोकप्रिय' : 'Popular'}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Coupon */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionTitle icon="🏷️" title={isHindi ? 'कूपन कोड' : 'Coupon Code'} />
          <View style={[styles.couponRow, { backgroundColor: colors.inputBg, borderColor: coupon ? colors.primary : colors.inputBorder }]}>
            <TextInput
              style={[styles.couponInput, { color: colors.text, fontFamily: boldFont }]}
              placeholder={isHindi ? 'KISAN80' : 'Enter coupon code'}
              placeholderTextColor={colors.textMuted}
              value={coupon}
              onChangeText={v => setCoupon(v.toUpperCase())}
              autoCapitalize="characters"
            />
            {coupon.length > 0 && (
              <View style={[styles.appliedBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.appliedText, { color: colors.primary, fontFamily: semiBold }]}>
                  {isHindi ? 'लागू' : 'Applied'}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.couponHint, { color: colors.textMuted, fontFamily: bodyFont }]}>
            💡 {isHindi ? 'नए यूज़र: KISAN80 = ₹80 छूट (₹199+)' : 'New users: KISAN80 = ₹80 off on orders ₹199+'}
          </Text>
        </View>

        {/* Note */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionTitle icon="📝" title={isHindi ? 'नोट (वैकल्पिक)' : 'Order Note (Optional)'} />
          <TextInput
            style={[styles.noteInput, {
              backgroundColor: colors.inputBg, color: colors.text, fontFamily: bodyFont,
              borderColor: note ? colors.primary : colors.inputBorder,
            }]}
            placeholder={isHindi ? 'कोई विशेष निर्देश...' : 'Any special instructions...'}
            placeholderTextColor={colors.textMuted}
            value={note} onChangeText={setNote}
            multiline numberOfLines={2} textAlignVertical="top"
          />
        </View>

        {/* Summary */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SectionTitle icon="📋" title={isHindi ? 'बिल सारांश' : 'Bill Summary'} />
          {items.map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={[styles.summaryName, { color: colors.textSecondary, fontFamily: bodyFont }]} numberOfLines={1}>
                {isHindi ? item.nameHi : item.name} × {item.qty}
              </Text>
              <Text style={[styles.summaryPrice, { color: colors.text, fontFamily: medFont }]}>₹{item.price * item.qty}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: bodyFont }]}>{t('itemTotal')}</Text>
            <Text style={[styles.summaryVal, { color: colors.text, fontFamily: medFont }]}>₹{totalPrice}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: bodyFont }]}>{t('deliveryFee')}</Text>
            <Text style={[styles.summaryVal, { color: deliveryFee === 0 ? colors.primary : colors.text, fontFamily: medFont }]}>
              {deliveryFee === 0 ? '🎉 FREE' : `₹${deliveryFee}`}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.text, fontFamily: boldFont }]}>{t('totalAmount')}</Text>
            <Text style={[styles.totalVal, { color: colors.text, fontFamily: boldFont }]}>₹{grandTotal}</Text>
          </View>
        </View>

        {orderError && (
          <View style={[styles.errorCard, { backgroundColor: colors.redLight, borderColor: colors.red }]}>
            <Text style={[styles.errorText, { color: colors.red, fontFamily: bodyFont }]}>⚠️ {orderError}</Text>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Place Order Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.bg, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <AnimatedPressable onPress={handlePlaceOrder} disabled={!canPlace || placing} scale={0.97} style={{ width: '100%' }}>
          <View style={[styles.placeBtn, { backgroundColor: canPlace ? colors.primary : colors.bgTertiary }]}>
            {placing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <View>
                  <Text style={[styles.placeBtnAmount, { color: canPlace ? '#fff' : colors.textMuted, fontFamily: boldFont }]}>₹{grandTotal}</Text>
                  <Text style={[styles.placeBtnSub, { color: 'rgba(255,255,255,0.7)', fontFamily: bodyFont }]}>
                    {PAYMENT_METHODS.find(p => p.id === payment)?.[isHindi ? 'labelHi' : 'label']}
                  </Text>
                </View>
                <Text style={[styles.placeBtnLabel, { color: canPlace ? '#fff' : colors.textMuted, fontFamily: boldFont }]}>
                  {t('placeOrder')} →
                </Text>
              </>
            )}
          </View>
        </AnimatedPressable>
        {!canPlace && (
          <Text style={[styles.warning, { color: colors.red, fontFamily: bodyFont }]}>
            ⚠️ {isHindi ? 'पहले पता दर्ज करें' : 'Please enter delivery address first'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20 },
  headerTitle: { fontSize: 20 },
  headerSub: { fontSize: 13, marginTop: 1 },
  scroll: { padding: 16, gap: 14 },
  section: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  sectionTitleIcon: { fontSize: 18 },
  sectionTitleText: { fontSize: 16 },
  addrCard: { borderRadius: 12, borderWidth: 1.5, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  addrInfo: { flex: 1, gap: 5 },
  addrTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  addrTagText: { fontSize: 11 },
  addrText: { fontSize: 13, lineHeight: 18 },
  addAddrText: { fontSize: 14 },
  addrInput: { borderWidth: 1.5, borderRadius: 12, padding: 12, fontSize: 14, minHeight: 75, marginTop: 4 },
  slotsRow: { flexDirection: 'row', gap: 8 },
  slotBtn: { flex: 1 },
  slotCard: { borderRadius: 12, borderWidth: 1.5, padding: 10, alignItems: 'center', gap: 4, position: 'relative' },
  slotIcon: { fontSize: 22 },
  slotTime: { fontSize: 11, textAlign: 'center', lineHeight: 15 },
  slotNote: { fontSize: 10, textAlign: 'center' },
  slotCheck: { position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  slotCheckText: { color: '#fff', fontSize: 10, fontFamily: 'Outfit-Bold' },
  pmCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1.5 },
  pmIcon: { fontSize: 24 },
  pmInfo: { flex: 1, gap: 2 },
  pmLabel: { fontSize: 14 },
  pmSub: { fontSize: 12 },
  popularBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  popularText: { color: '#fff', fontSize: 10, fontFamily: 'Outfit-SemiBold' },
  couponRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 50 },
  couponInput: { flex: 1, fontSize: 16, letterSpacing: 1, padding: 0 },
  appliedBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  appliedText: { fontSize: 12 },
  couponHint: { fontSize: 12 },
  noteInput: { borderWidth: 1.5, borderRadius: 12, padding: 12, fontSize: 14, minHeight: 65 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryName: { flex: 1, fontSize: 13, marginRight: 8 },
  summaryPrice: { fontSize: 13 },
  summaryLabel: { fontSize: 14 },
  summaryVal: { fontSize: 14 },
  divider: { height: 1, marginVertical: 4 },
  totalLabel: { fontSize: 17 },
  totalVal: { fontSize: 20 },
  errorCard: { borderRadius: 12, borderWidth: 1, padding: 12 },
  errorText: { fontSize: 13 },
  bottomBar: { padding: 16, borderTopWidth: 1, gap: 8 },
  placeBtn: { height: 56, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  placeBtnAmount: { fontSize: 18 },
  placeBtnSub: { fontSize: 11 },
  placeBtnLabel: { fontSize: 16 },
  warning: { fontSize: 12, textAlign: 'center' },
});

export default CheckoutScreen;
