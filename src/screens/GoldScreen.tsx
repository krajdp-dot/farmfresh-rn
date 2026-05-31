import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Font, fs, wp, hp, Radius } from '../theme';
import { useLangStore } from '../stores/stores';
import { t } from '../i18n';

const PERKS = [
  { icon: '🛵', title: 'Priority Delivery', sub: 'Your orders delivered first' },
  { icon: '💰', title: 'Member Prices', sub: 'Exclusive lower prices on all produce' },
  { icon: '🎁', title: 'Monthly Bonus', sub: '₹50 cashback every month' },
  { icon: '📞', title: 'Dedicated Support', sub: 'Priority WhatsApp support' },
];

export default function GoldScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { lang } = useLangStore();

  return (
    <View style={[s.root, { paddingTop: insets.top + hp(12) }]}>
      <Pressable style={s.back} onPress={() => nav.goBack()}><Text style={s.backText}>‹</Text></Pressable>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={s.hero}>
          <LinearGradient colors={['#2A1C00', '#1A1100', '#2A1C00']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          <View style={s.heroBorder} />
          <Text style={s.heroEmoji}>👑</Text>
          <Text style={s.heroTitle}>Farm Fresh Gold</Text>
          <Text style={s.heroSub}>The smarter way to shop fresh</Text>
        </View>

        {/* Perks */}
        <View style={s.perksSection}>
          {PERKS.map((p) => (
            <View key={p.title} style={s.perkRow}>
              <Text style={s.perkIcon}>{p.icon}</Text>
              <View>
                <Text style={s.perkTitle}>{p.title}</Text>
                <Text style={s.perkSub}>{p.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plans */}
        {[{ label: 'Monthly', price: 99, badge: null }, { label: 'Quarterly', price: 249, badge: 'Best Value' }].map((plan) => (
          <Pressable key={plan.label} style={s.planCard}>
            {plan.badge && <View style={s.planBadge}><Text style={s.planBadgeText}>{plan.badge}</Text></View>}
            <Text style={s.planLabel}>{plan.label}</Text>
            <Text style={s.planPrice}>₹{plan.price}</Text>
            <LinearGradient colors={[Colors.gold, Colors.goldDark]} style={s.planBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
              <Text style={s.planBtnText}>Subscribe</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  back: { position: 'absolute', top: hp(54), left: wp(16), zIndex: 10, width: wp(40), height: wp(40), backgroundColor: 'rgba(10,26,15,0.7)', borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: Font.outfit.bold, fontSize: fs(24), color: Colors.textPrimary, lineHeight: fs(26) },
  scroll: { padding: wp(16), gap: hp(16), paddingBottom: hp(60) },
  hero: { borderRadius: Radius.xxl, overflow: 'hidden', padding: wp(28), alignItems: 'center', gap: hp(8), marginTop: hp(40) },
  heroBorder: { ...StyleSheet.absoluteFillObject, borderRadius: Radius.xxl, borderWidth: 1, borderColor: 'rgba(245,197,66,0.3)' },
  heroEmoji: { fontSize: fs(48) },
  heroTitle: { fontFamily: Font.outfit.bold, fontSize: fs(28), color: Colors.gold, letterSpacing: -0.4 },
  heroSub: { fontFamily: Font.outfit.regular, fontSize: fs(15), color: Colors.textSecondary },
  perksSection: { backgroundColor: Colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, padding: wp(16), gap: hp(14) },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: wp(14) },
  perkIcon: { fontSize: fs(24), width: wp(32) },
  perkTitle: { fontFamily: Font.outfit.semiBold, fontSize: fs(14), color: Colors.textPrimary },
  perkSub: { fontFamily: Font.outfit.regular, fontSize: fs(12), color: Colors.textSecondary, marginTop: hp(2) },
  planCard: { backgroundColor: Colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: 'rgba(245,197,66,0.25)', padding: wp(18), alignItems: 'center', gap: hp(8), position: 'relative' },
  planBadge: { position: 'absolute', top: -hp(10), backgroundColor: Colors.gold, paddingHorizontal: wp(10), paddingVertical: hp(3), borderRadius: Radius.full },
  planBadgeText: { fontFamily: Font.outfit.bold, fontSize: fs(11), color: Colors.textInverse },
  planLabel: { fontFamily: Font.outfit.medium, fontSize: fs(15), color: Colors.textSecondary },
  planPrice: { fontFamily: Font.jakarta.bold, fontSize: fs(32), color: Colors.gold },
  planBtn: { borderRadius: Radius.full, paddingHorizontal: wp(32), paddingVertical: hp(12), marginTop: hp(4) },
  planBtnText: { fontFamily: Font.outfit.semiBold, fontSize: fs(15), color: Colors.textInverse },
});
