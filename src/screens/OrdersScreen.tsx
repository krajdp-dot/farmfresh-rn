import React from 'react';
import {
  View, Text, StyleSheet, Pressable,
  FlatList, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Colors, Font, fs, wp, hp, Radius } from '../theme';
import { useAuthStore, useLangStore } from '../stores/stores';
import { OrderAPI, type Order, type OrderStatus } from '../api/client';
import { t } from '../i18n';
import { formatPrice } from '../utils/currency';

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; emoji: string }> = {
  pending:          { label: 'Pending',          color: Colors.warning, bg: 'rgba(250,204,21,0.12)',  emoji: '⏳' },
  confirmed:        { label: 'Confirmed',         color: Colors.info,    bg: 'rgba(96,165,250,0.12)',  emoji: '✅' },
  out_for_delivery: { label: 'Out for Delivery',  color: Colors.accent,  bg: 'rgba(128,239,128,0.12)', emoji: '🛵' },
  delivered:        { label: 'Delivered',         color: Colors.success, bg: 'rgba(74,222,128,0.12)',  emoji: '📦' },
  cancelled:        { label: 'Cancelled',         color: Colors.error,   bg: 'rgba(248,113,113,0.12)', emoji: '✕' },
};

function OrderCard({ order }: { order: Order }) {
  const nav = useNavigation<any>();
  const meta = STATUS_META[order.status];
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Pressable
      style={styles.card}
      onPress={() => nav.navigate('OrderDetail', { orderId: order._id })}
    >
      {/* Top */}
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderId}>#{order.shortId ?? order._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Text style={styles.statusEmoji}>{meta.emoji}</Text>
          <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>

      {/* Items preview */}
      <Text style={styles.itemsPreview} numberOfLines={1}>
        {order.items.map((i) => i.name).join(', ')}
      </Text>

      {/* Bottom */}
      <View style={styles.cardBottom}>
        <Text style={styles.totalLabel}>{order.items.length} items · {formatPrice(order.total)}</Text>
        <Text style={styles.trackLink}>View details ›</Text>
      </View>
    </Pressable>
  );
}

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { user } = useAuthStore();
  const { lang } = useLangStore();

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['orders', user?.phone],
    queryFn: () => OrderAPI.getMyOrders(user!.phone).then((r) => r.data),
    enabled: !!user?.phone,
    staleTime: 60_000,
  });

  if (!user) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.noOrdersEmoji}>📦</Text>
        <Text style={styles.noOrdersTitle}>{t('loginToOrder', lang)}</Text>
        <Pressable style={styles.loginBtn} onPress={() => nav.navigate('Auth')}>
          <Text style={styles.loginBtnText}>Login / Sign Up</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + hp(12) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => nav.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.screenTitle}>{t('myOrders', lang)}</Text>
        <View style={{ width: wp(32) }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(o) => o._id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.accent} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.center}>
              <Text style={styles.noOrdersEmoji}>📦</Text>
              <Text style={styles.noOrdersTitle}>{t('noOrders', lang)}</Text>
              <Text style={styles.noOrdersSub}>{t('noOrdersSub', lang)}</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: hp(12), padding: wp(40) },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
    marginBottom: hp(12),
  },
  backBtn: { width: wp(32), height: wp(32), alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: Font.outfit.bold, fontSize: fs(26), color: Colors.textPrimary, lineHeight: fs(28) },
  screenTitle: {
    flex: 1,
    fontFamily: Font.outfit.bold,
    fontSize: fs(20),
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },

  list: { paddingHorizontal: wp(16), gap: hp(10), paddingBottom: hp(100) },

  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: wp(14),
    gap: hp(8),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  orderId: { fontFamily: Font.jakarta.bold, fontSize: fs(15), color: Colors.textPrimary },
  orderDate: { fontFamily: Font.outfit.regular, fontSize: fs(12), color: Colors.textMuted, marginTop: hp(2) },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    borderRadius: Radius.full,
  },
  statusEmoji: { fontSize: fs(11) },
  statusText: { fontFamily: Font.outfit.semiBold, fontSize: fs(12) },

  itemsPreview: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(13),
    color: Colors.textSecondary,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: hp(8),
    marginTop: hp(2),
  },
  totalLabel: { fontFamily: Font.outfit.medium, fontSize: fs(13), color: Colors.textSecondary },
  trackLink: { fontFamily: Font.outfit.semiBold, fontSize: fs(13), color: Colors.accent },

  noOrdersEmoji: { fontSize: fs(48) },
  noOrdersTitle: { fontFamily: Font.outfit.bold, fontSize: fs(20), color: Colors.textPrimary, textAlign: 'center' },
  noOrdersSub: { fontFamily: Font.outfit.regular, fontSize: fs(14), color: Colors.textSecondary, textAlign: 'center', lineHeight: fs(20) },

  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingHorizontal: wp(28),
    paddingVertical: hp(12),
    marginTop: hp(8),
  },
  loginBtnText: { fontFamily: Font.outfit.semiBold, fontSize: fs(15), color: Colors.white },
});
