// ============================================================
// FARM FRESH RN v4 — MandiTicker
// Glassmorphism square cards · Auto-scroll · Unique bg per card
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  View, ScrollView, StyleSheet, Dimensions, ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
} from 'react-native-reanimated';
import { Colors, Font, Spacing, Radius, Glass } from '../theme';
import { getProduceIcon } from './icons';

const { width: W } = Dimensions.get('window');
const CARD_W = 110;
const CARD_H = 90;
const CARD_GAP = Spacing.sm;

// ── Mock mandi prices (replace with API) ─────────────────
const MANDI_DATA = [
  { id: '1', name: 'Tomato',  mandiRate: 18, unit: 'kg', change: -2,  bg: Colors.mandiCard[0] },
  { id: '2', name: 'Onion',   mandiRate: 22, unit: 'kg', change: +1,  bg: Colors.mandiCard[1] },
  { id: '3', name: 'Mango',   mandiRate: 85, unit: 'kg', change: +5,  bg: Colors.mandiCard[2] },
  { id: '4', name: 'Potato',  mandiRate: 15, unit: 'kg', change: 0,   bg: Colors.mandiCard[3] },
  { id: '5', name: 'Banana',  mandiRate: 30, unit: 'doz', change: -1, bg: Colors.mandiCard[4] },
  { id: '6', name: 'Carrot',  mandiRate: 25, unit: 'kg', change: +3,  bg: Colors.mandiCard[5] },
  { id: '7', name: 'Tomato',  mandiRate: 18, unit: 'kg', change: -2,  bg: Colors.mandiCard[0] },
  { id: '8', name: 'Onion',   mandiRate: 22, unit: 'kg', change: +1,  bg: Colors.mandiCard[1] },
];

interface MandiCardProps {
  item: typeof MANDI_DATA[0];
  index: number;
}

const MandiCard = ({ item, index }: MandiCardProps) => {
  const ProduceIcon = getProduceIcon(item.name);
  const isUp = item.change > 0;
  const isDown = item.change < 0;

  return (
    <View style={[styles.card, { backgroundColor: item.bg }]}>
      {/* Produce icon */}
      <View style={styles.cardIcon}>
        <ProduceIcon size={30} />
      </View>

      {/* Name */}
      <Animated.Text style={styles.cardName} numberOfLines={1}>
        {item.name}
      </Animated.Text>

      {/* Price row */}
      <View style={styles.cardPriceRow}>
        <Animated.Text style={styles.cardPrice}>
          ₹{item.mandiRate}
        </Animated.Text>
        <Animated.Text style={styles.cardUnit}>/{item.unit}</Animated.Text>
      </View>

      {/* Change badge */}
      {item.change !== 0 && (
        <View style={[
          styles.changeBadge,
          isUp ? styles.changeBadgeUp : styles.changeBadgeDown,
        ]}>
          <Animated.Text style={[
            styles.changeText,
            isUp ? styles.changeTextUp : styles.changeTextDown,
          ]}>
            {isUp ? '▲' : '▼'} {Math.abs(item.change)}
          </Animated.Text>
        </View>
      )}

      {/* Glass shimmer overlay */}
      <View style={styles.cardShimmer} pointerEvents="none" />
    </View>
  );
};

interface MandiTickerProps {
  style?: ViewStyle;
}

export const MandiTicker = ({ style }: MandiTickerProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(0);
  const totalWidth = MANDI_DATA.length * (CARD_W + CARD_GAP);
  const isScrolling = useRef(true);

  // Auto-scroll using interval (simpler than Reanimated for continuous scroll)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isScrolling.current) return;
      scrollX.current += 1;
      if (scrollX.current >= totalWidth / 2) {
        scrollX.current = 0;
      }
      scrollRef.current?.scrollTo({ x: scrollX.current, animated: false });
    }, 20);

    return () => clearInterval(interval);
  }, [totalWidth]);

  return (
    <View style={[styles.root, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.liveDot} />
        <Animated.Text style={styles.headerText}>
          Bhagalpur Mandi Rates
        </Animated.Text>
        <Animated.Text style={styles.headerDate}>Today</Animated.Text>
      </View>

      {/* Scrolling cards */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={() => { isScrolling.current = false; }}
        onScrollEndDrag={() => {
          setTimeout(() => { isScrolling.current = true; }, 2000);
        }}
      >
        {/* Duplicate for seamless loop */}
        {[...MANDI_DATA, ...MANDI_DATA].map((item, i) => (
          <MandiCard key={`${item.id}-${i}`} item={item} index={i} />
        ))}
      </ScrollView>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    // Pulse handled by the parent (optional enhancement)
  },
  headerText: {
    fontFamily: Font.baloo2Medium,
    fontSize: 13,
    color: Colors.textOnDarkMuted,
    flex: 1,
  },
  headerDate: {
    fontFamily: Font.jakartaRegular,
    fontSize: 11,
    color: Colors.textOnDarkSubtle,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    gap: CARD_GAP,
    flexDirection: 'row',
  },

  // ── Card ─────────────────────────────────────────────────
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    padding: Spacing.sm,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    opacity: 0.85,
  },
  cardName: {
    fontFamily: Font.outfitMedium,
    fontSize: 13,
    color: Colors.textOnDark,
    zIndex: 1,
  },
  cardPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    zIndex: 1,
  },
  cardPrice: {
    fontFamily: Font.outfitBold,
    fontSize: 18,
    color: Colors.textOnDark,
  },
  cardUnit: {
    fontFamily: Font.jakartaRegular,
    fontSize: 10,
    color: Colors.textOnDarkMuted,
  },
  changeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    zIndex: 1,
  },
  changeBadgeUp: {
    backgroundColor: 'rgba(239,68,68,0.2)',
  },
  changeBadgeDown: {
    backgroundColor: 'rgba(34,197,94,0.2)',
  },
  changeText: {
    fontFamily: Font.jakartaSemiBold,
    fontSize: 10,
  },
  changeTextUp: {
    color: '#EF4444',
  },
  changeTextDown: {
    color: '#22C55E',
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
  },
});
