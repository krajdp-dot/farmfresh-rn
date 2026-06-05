// ============================================================
// FARM FRESH RN v4 — CategoriesScreen
// Grid of category cards · Produce icon · Item count
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
import {
  IconCarrot, IconMango, IconLeaf, IconOnion,
  IconTomato, IconBanana, IconChevronRight,
} from '../components/icons';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing.base * 2 - Spacing.md) / 2;

const CATEGORIES = [
  { id: '1', label: 'Vegetables',   count: 18, Icon: IconCarrot, grad: ['#0F2318','#1A3A22'] },
  { id: '2', label: 'Fruits',       count: 12, Icon: IconMango,  grad: ['#1A1200','#2D2000'] },
  { id: '3', label: 'Leafy Greens', count: 8,  Icon: IconLeaf,   grad: ['#0A1A0F','#163320'] },
  { id: '4', label: 'Onion/Potato', count: 6,  Icon: IconOnion,  grad: ['#1A0A1F','#2D1040'] },
  { id: '5', label: 'Exotic',       count: 5,  Icon: IconTomato, grad: ['#1A0800','#2D1400'] },
  { id: '6', label: 'Bananas',      count: 4,  Icon: IconBanana, grad: ['#1A1600','#2D2500'] },
];

const CategoryCard = ({
  item, index, onPress,
}: { item: typeof CATEGORIES[0]; index: number; onPress: () => void }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 340, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(index * 80, withSpring(0, { damping: 14, stiffness: 100 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ width: CARD_W }, style]}>
      <AnimatedPressable onPress={onPress} scaleDown={0.96}>
        <LinearGradient colors={item.grad as any} style={styles.card}>
          {/* Produce icon */}
          <View style={styles.cardIconWrap}>
            <item.Icon size={44} />
          </View>

          {/* Glass overlay at bottom */}
          <View style={styles.cardFooter}>
            <Animated.Text style={styles.cardLabel}>{item.label}</Animated.Text>
            <View style={styles.cardMeta}>
              <Animated.Text style={styles.cardCount}>{item.count} items</Animated.Text>
              <IconChevronRight size={12} color={Colors.textOnDarkMuted} strokeWidth={2.5} />
            </View>
          </View>

          {/* Border overlay */}
          <View style={styles.cardBorder} pointerEvents="none" />
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
};

export const CategoriesScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-16);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 380 });
    headerY.value = withSpring(0, { damping: 14, stiffness: 100 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />

      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Text style={styles.title}>Categories</Animated.Text>
        <Animated.Text style={styles.subtitle}>Browse by produce type</Animated.Text>
      </Animated.View>

      {/* Grid */}
      <FlatList
        data={CATEGORIES}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item, index }) => (
          <CategoryCard
            item={item}
            index={index}
            onPress={() => navigation.navigate('CategoryProducts', { category: item.label })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDark },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: { fontFamily: Font.outfitBold, fontSize: 28, color: Colors.textOnDark },
  subtitle: {
    fontFamily: Font.jakartaRegular, fontSize: 14,
    color: Colors.textOnDarkMuted, marginTop: 4,
  },
  grid: { paddingHorizontal: Spacing.base, paddingBottom: 120 },
  row: { gap: Spacing.md, marginBottom: Spacing.md },
  card: {
    width: CARD_W, height: 160,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardIconWrap: {
    alignSelf: 'flex-end',
    opacity: 0.9,
  },
  cardFooter: { gap: 3 },
  cardLabel: {
    fontFamily: Font.outfitSemiBold, fontSize: 15, color: Colors.textOnDark,
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardCount: {
    fontFamily: Font.jakartaRegular, fontSize: 12, color: Colors.textOnDarkMuted,
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
});
