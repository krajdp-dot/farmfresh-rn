import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Colors, Font, fs, wp, hp, Radius, Layout } from '../theme';
import { ProductAPI, type Category } from '../api/client';
import { useLangStore } from '../stores/stores';
import { t } from '../i18n';

const CAT_COLORS: [string, string][] = [
  ['#0F2A12', '#061509'],
  ['#2A1A00', '#180F00'],
  ['#0A1F2A', '#050F15'],
  ['#1F0A2A', '#100518'],
  ['#2A2400', '#181400'],
  ['#2A0A0A', '#180505'],
  ['#0A2020', '#051212'],
  ['#1A1A2A', '#0E0E18'],
];

const CAT_ICONS: Record<string, string> = {
  vegetables: '🥦',
  fruits: '🍉',
  leafy: '🥬',
  herbs: '🌿',
  roots: '🥕',
  exotic: '🫛',
  seasonal: '🌽',
  daily: '🧅',
};

function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const nav = useNavigation<any>();
  const { lang } = useLangStore();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const [c1, c2] = CAT_COLORS[index % CAT_COLORS.length];
  const name = lang === 'hi' && cat.nameHi ? cat.nameHi : cat.name;
  const icon = CAT_ICONS[cat.name.toLowerCase()] ?? cat.icon ?? '🌿';

  return (
    <Animated.View style={[animStyle, { width: (Layout.screenW - wp(16) * 2 - wp(10)) / 2 }]}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.95, { stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { stiffness: 300 }); }}
        onPress={() => nav.navigate('Home', {
          screen: 'CategoryProducts',
          params: { categoryId: cat._id, categoryName: cat.name },
        })}
        style={styles.card}
      >
        <LinearGradient colors={[c1, c2]} style={StyleSheet.absoluteFill} />
        <View style={styles.cardBorder} />
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardName}>{name}</Text>
        <Text style={styles.cardArrow}>›</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { lang } = useLangStore();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => ProductAPI.getCategories().then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top + hp(12) }]}>
      <Text style={styles.screenTitle}>{t('allCategories', lang)}</Text>
      <FlatList
        data={isLoading ? Array(6).fill(null) : categories}
        keyExtractor={(item, i) => item?._id ?? String(i)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>
          item ? (
            <CategoryCard cat={item} index={index} />
          ) : (
            <View style={[styles.skeleton, { width: (Layout.screenW - wp(16) * 2 - wp(10)) / 2 }]} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  screenTitle: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(22),
    color: Colors.textPrimary,
    paddingHorizontal: wp(16),
    marginBottom: hp(16),
    letterSpacing: -0.3,
  },
  list: { paddingHorizontal: wp(16), paddingBottom: hp(120) },
  row: { gap: wp(10), marginBottom: wp(10) },

  card: {
    height: hp(90),
    borderRadius: Radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(14),
    gap: wp(10),
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIcon: { fontSize: fs(28) },
  cardName: {
    flex: 1,
    fontFamily: Font.outfit.semiBold,
    fontSize: fs(14),
    color: Colors.textPrimary,
  },
  cardArrow: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(20),
    color: Colors.textMuted,
  },
  skeleton: {
    height: hp(90),
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface1,
    opacity: 0.5,
  },
});
