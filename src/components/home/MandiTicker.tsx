import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { MandiAPI, type MandiRate } from '../../api/client';
import { Colors, Font, fs, wp, hp, Radius, Space } from '../../theme';
import { useLangStore } from '../../stores/stores';
import { t } from '../../i18n';

// Fallback data while loading
const FALLBACK: MandiRate[] = [
  { _id: '1', name: 'Tomato', nameHi: 'टमाटर', price: 40, unit: 'kg', change: -5, icon: '🍅', category: 'veg' },
  { _id: '2', name: 'Potato', nameHi: 'आलू', price: 25, unit: 'kg', change: 2, icon: '🥔', category: 'veg' },
  { _id: '3', name: 'Onion', nameHi: 'प्याज़', price: 35, unit: 'kg', change: 8, icon: '🧅', category: 'veg' },
  { _id: '4', name: 'Green Chilli', nameHi: 'हरी मिर्च', price: 80, unit: 'kg', change: -12, icon: '🌶', category: 'veg' },
  { _id: '5', name: 'Lemon', nameHi: 'नींबू', price: 120, unit: 'kg', change: 0, icon: '🍋', category: 'fruit' },
  { _id: '6', name: 'Banana', nameHi: 'केला', price: 30, unit: 'dozen', change: 3, icon: '🍌', category: 'fruit' },
  { _id: '7', name: 'Mango', nameHi: 'आम', price: 80, unit: 'kg', change: -8, icon: '🥭', category: 'fruit' },
  { _id: '8', name: 'Coriander', nameHi: 'धनिया', price: 20, unit: 'bunch', change: 0, icon: '🌿', category: 'herb' },
];

// Unique card background per index
const CARD_BG_GRADIENTS: [string, string][] = [
  ['#1A2A12', '#0F1A0A'],  // leafy green
  ['#2A1A08', '#1A1005'],  // warm orange
  ['#0A1E2A', '#050F15'],  // aqua blue
  ['#1E0A2A', '#120518'],  // berry purple
  ['#2A2200', '#181500'],  // citrus yellow
  ['#2A0A12', '#18060B'],  // red/tomato
  ['#0A2020', '#051212'],  // teal
  ['#201A00', '#141100'],  // golden
];

interface CardProps {
  item: MandiRate;
  index: number;
  lang: 'en' | 'hi';
}

function MandiCard({ item, index, lang }: CardProps) {
  const [bg1, bg2] = CARD_BG_GRADIENTS[index % CARD_BG_GRADIENTS.length];
  const isUp = (item.change ?? 0) > 0;
  const isDown = (item.change ?? 0) < 0;
  const absChange = Math.abs(item.change ?? 0);

  // Pulse glow for big movers
  const glow = useSharedValue(0.3);
  useEffect(() => {
    if (absChange > 10) {
      glow.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 900, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [absChange]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: absChange > 10 ? glow.value : 0.3,
  }));

  const displayName = lang === 'hi' && item.nameHi ? item.nameHi : item.name;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[bg1, bg2]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Glow circle behind icon */}
      <Animated.View style={[styles.cardGlow, glowStyle]} />

      {/* Icon */}
      <Text style={styles.cardIcon}>{item.icon ?? '🥬'}</Text>

      {/* Name */}
      <Text style={styles.cardName} numberOfLines={1}>
        {displayName}
      </Text>

      {/* Price */}
      <Text style={styles.cardPrice}>
        ₹{item.price}
        <Text style={styles.cardUnit}>/{item.unit}</Text>
      </Text>

      {/* Change badge */}
      {item.change !== 0 && item.change !== undefined && (
        <View style={[styles.changeBadge, isUp ? styles.changeBadgeUp : styles.changeBadgeDown]}>
          <Text style={[styles.changeText, isUp ? styles.changeTextUp : styles.changeTextDown]}>
            {isUp ? '▲' : '▼'} {absChange}%
          </Text>
        </View>
      )}

      {/* Border */}
      <View style={styles.cardBorder} />
    </View>
  );
}

// ─── Main Ticker ──────────────────────────────────────────────────────────────

export default function MandiTicker() {
  const { lang } = useLangStore();
  const listRef = useRef<FlatList>(null);
  const autoScrollX = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setInterval>>();

  const { data: rates = FALLBACK } = useQuery({
    queryKey: ['mandi-rates'],
    queryFn: () => MandiAPI.getRates().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    placeholderData: FALLBACK,
  });

  // Duplicate list for infinite scroll illusion
  const doubled = [...rates, ...rates];

  // Auto-scroll every 2s
  useEffect(() => {
    scrollTimer.current = setInterval(() => {
      autoScrollX.current += CARD_W + CARD_GAP;
      if (autoScrollX.current >= (rates.length * (CARD_W + CARD_GAP))) {
        autoScrollX.current = 0;
      }
      listRef.current?.scrollToOffset({
        offset: autoScrollX.current,
        animated: true,
      });
    }, 2200);
    return () => clearInterval(scrollTimer.current);
  }, [rates.length]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.liveDot} />
          <Text style={styles.headerTitle}>{t('mandiTicker', lang)}</Text>
        </View>
        <Text style={styles.headerSub}>Bhagalpur Mandi</Text>
      </View>

      {/* Cards */}
      <FlatList
        ref={listRef}
        data={doubled}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${item._id}_${i}`}
        renderItem={({ item, index }) => (
          <MandiCard item={item} index={index} lang={lang} />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        decelerationRate="fast"
        snapToInterval={CARD_W + CARD_GAP}
        onScrollBeginDrag={() => clearInterval(scrollTimer.current)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_W = wp(96);
const CARD_H = wp(108);
const CARD_GAP = wp(8);

const styles = StyleSheet.create({
  container: {
    gap: hp(10),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(16),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(6),
  },
  liveDot: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(4),
    backgroundColor: Colors.success,
  },
  headerTitle: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(14),
    color: Colors.textPrimary,
  },
  headerSub: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(12),
    color: Colors.textMuted,
  },

  listContent: {
    paddingHorizontal: wp(16),
    paddingBottom: hp(4),
  },

  // Card
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(3),
    padding: wp(8),
    position: 'relative',
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(128,239,128,0.12)',
  },
  cardGlow: {
    position: 'absolute',
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    backgroundColor: Colors.primary,
    top: hp(4),
  },

  cardIcon: {
    fontSize: fs(28),
    zIndex: 1,
  },
  cardName: {
    fontFamily: Font.outfit.medium,
    fontSize: fs(11),
    color: Colors.textSecondary,
    textAlign: 'center',
    zIndex: 1,
  },
  cardPrice: {
    fontFamily: Font.jakarta.bold,
    fontSize: fs(14),
    color: Colors.textPrimary,
    zIndex: 1,
  },
  cardUnit: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(10),
    color: Colors.textMuted,
  },

  changeBadge: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderRadius: Radius.full,
    zIndex: 1,
  },
  changeBadgeUp: { backgroundColor: 'rgba(74,222,128,0.15)' },
  changeBadgeDown: { backgroundColor: 'rgba(248,113,113,0.15)' },
  changeText: {
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(9),
  },
  changeTextUp: { color: Colors.success },
  changeTextDown: { color: Colors.error },
});
