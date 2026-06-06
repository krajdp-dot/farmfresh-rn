import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Font, Spacing, Radius, Glass } from '../theme';

const PERKS = [
  { icon: 'star', title: 'Priority Delivery', sub: 'Your orders delivered first' },
  { icon: 'tag',  title: 'Member Prices',     sub: 'Exclusive lower prices on all produce' },
  { icon: 'gift', title: 'Monthly Bonus',     sub: 'Rs.50 cashback every month' },
  { icon: 'phone',title: 'Dedicated Support', sub: 'Priority WhatsApp support' },
];

const PLANS = [
  { label: 'Monthly',   price: 99,  badge: null },
  { label: 'Quarterly', price: 249, badge: 'Best Value' },
];

export default function GoldScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <Pressable style={s.back} onPress={() => nav.goBack()}>
        <Text style={s.backText}>{'<'} Back</Text>
      </Pressable>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.hero}>
          <LinearGradient
            colors={['#2A1C00', '#1A1100', '#2A1C00']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={s.heroTitle}>Farm Fresh Gold</Text>
          <Text style={s.heroSub}>The smarter way to shop fresh</Text>
        </View>

        {/* Perks */}
        <View style={s.perksSection}>
          {PERKS.map((p) => (
            <View key={p.title} style={s.perkRow}>
              <View style={s.perkIconBox}>
                <Text style={s.perkIconText}>{p.icon[0].toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.perkTitle}>{p.title}</Text>
                <Text style={s.perkSub}>{p.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plans */}
        {PLANS.map((plan) => (
          <View key={plan.label} style={s.planCard}>
            {plan.badge && (
              <View style={s.planBadge}>
                <Text style={s.planBadgeText}>{plan.badge}</Text>
              </View>
            )}
            <Text style={s.planLabel}>{plan.label}</Text>
            <Text style={s.planPrice}>Rs.{plan.price}</Text>
            <Pressable style={s.planBtn}>
              <LinearGradient
                colors={[Colors.accentYellow, '#C9A227']}
                style={s.planBtnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={s.planBtnText}>Subscribe</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDark },
  back: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  backText: { fontFamily: Font.outfitMedium, fontSize: 15, color: Colors.logoGreen },
  scroll: { padding: Spacing.base, gap: Spacing.lg, paddingBottom: 80 },

  hero: {
    borderRadius: Radius.xxl,
    overflow: 'hidden',
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(245,197,66,0.3)',
  },
  heroTitle: { fontFamily: Font.outfitBold, fontSize: 28, color: Colors.accentYellow, letterSpacing: -0.4 },
  heroSub: { fontFamily: Font.outfitRegular, fontSize: 15, color: Colors.textOnDarkMuted },

  perksSection: {
    ...Glass.card,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  perkIconBox: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: 'rgba(45,138,78,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  perkIconText: { fontFamily: Font.outfitBold, fontSize: 14, color: Colors.logoGreen },
  perkTitle: { fontFamily: Font.outfitSemiBold, fontSize: 14, color: Colors.textOnDark },
  perkSub: { fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textOnDarkMuted, marginTop: 2 },

  planCard: {
    ...Glass.card,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planBadge: {
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: Spacing.xs,
  },
  planBadgeText: { fontFamily: Font.outfitBold, fontSize: 11, color: Colors.bgDark },
  planLabel: { fontFamily: Font.outfitMedium, fontSize: 15, color: Colors.textOnDarkMuted },
  planPrice: { fontFamily: Font.outfitBold, fontSize: 32, color: Colors.accentYellow },
  planBtn: { width: '100%', borderRadius: Radius.full, overflow: 'hidden', marginTop: Spacing.xs },
  planBtnGrad: { paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.full },
  planBtnText: { fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.bgDark },
});
