import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Image, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import AnimatedPressable from '../components/AnimatedPressable';
import { spacing, radius, SCREEN_WIDTH } from '../theme/tokens';

const CATEGORIES = [
  { id: '1',  name: 'Vegetables',      nameHi: 'सब्ज़ियाँ',      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', count: 24, emoji: '🥦', color: '#E8F5EE' },
  { id: '2',  name: 'Fruits',          nameHi: 'फल',              image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400', count: 18, emoji: '🍊', color: '#FFF8E7' },
  { id: '3',  name: 'Leafy Greens',    nameHi: 'पत्तेदार',        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', count: 12, emoji: '🥬', color: '#E8F5EE' },
  { id: '4',  name: 'Herbs & Spices',  nameHi: 'मसाले',           image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400', count: 15, emoji: '🌿', color: '#E8F5EE' },
  { id: '5',  name: 'Exotic Vegs',     nameHi: 'विदेशी सब्ज़ी',  image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', count: 8,  emoji: '🫑', color: '#FFF0F1' },
  { id: '6',  name: 'Root Vegetables', nameHi: 'जड़ सब्ज़ियाँ',  image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', count: 10, emoji: '🥕', color: '#FFF8E7' },
  { id: '7',  name: 'Gourds',          nameHi: 'कद्दू वर्ग',     image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400', count: 9,  emoji: '🎃', color: '#FFF8E7' },
  { id: '8',  name: 'Seasonal',        nameHi: 'मौसमी',           image: 'https://images.unsplash.com/photo-1506807803488-8eafc15316c7?w=400', count: 6,  emoji: '🌾', color: '#E8F5EE' },
  { id: '9',  name: 'Beans & Legumes', nameHi: 'फलियाँ',         image: 'https://images.unsplash.com/photo-1564834024788-11cf3f66e97d?w=400', count: 11, emoji: '🫘', color: '#E8F5EE' },
  { id: '10', name: 'Mushrooms',       nameHi: 'मशरूम',           image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400', count: 5,  emoji: '🍄', color: '#F8F8F8' },
];

const CARD_W = (SCREEN_WIDTH - 32 - 12) / 2;

interface Props {
  onCategoryPress: (cat: any) => void;
}

const CategoriesScreen: React.FC<Props> = ({ onCategoryPress }) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();
  const insets = useSafeAreaInsets();

  const boldFont = isHindi ? 'Baloo2-Bold' : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular' : 'Outfit-Regular';
  const semiBold = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont  = isHindi ? 'Baloo2-Medium' : 'Outfit-Medium';

  const totalItems = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

  const renderItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <AnimatedPressable onPress={() => onCategoryPress(item)} scale={0.96}>
      <View style={[styles.card, { width: CARD_W, backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Image with emoji overlay */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          {/* Gradient overlay */}
          <View style={styles.imageOverlay} />
          {/* Emoji badge */}
          <View style={[styles.emojiBadge, { backgroundColor: item.color }]}>
            <Text style={styles.emojiText}>{item.emoji}</Text>
          </View>
          {/* Item count badge */}
          <View style={[styles.countBadge, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <Text style={styles.countText}>{item.count} {isHindi ? 'आइटम' : 'items'}</Text>
          </View>
        </View>

        {/* Card footer */}
        <View style={styles.cardFooter}>
          <View style={styles.cardTextBlock}>
            <Text style={[styles.cardName, { color: colors.text, fontFamily: boldFont }]} numberOfLines={1}>
              {isHindi ? item.nameHi : item.name}
            </Text>
            <Text style={[styles.cardSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
              {isHindi ? `${item.count} उत्पाद` : `${item.count} products`}
            </Text>
          </View>
          <View style={[styles.arrowCircle, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.arrow, { color: colors.primary }]}>→</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.text, fontFamily: boldFont }]}>
            {t('categories')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {isHindi
              ? `${CATEGORIES.length} श्रेणियाँ · ${totalItems}+ उत्पाद`
              : `${CATEGORIES.length} categories · ${totalItems}+ products`}
          </Text>
        </View>
        {/* Mandi badge */}
        <View style={[styles.mandiBadge, { backgroundColor: colors.mandiStrip, borderColor: colors.mandiBorder }]}>
          <Text style={styles.mandiBadgeIcon}>📊</Text>
          <Text style={[styles.mandiBadgeText, { color: colors.mandiText, fontFamily: semiBold }]}>
            {isHindi ? 'मंडी भाव' : 'Mandi Price'}
          </Text>
        </View>
      </View>

      {/* All categories strip */}
      <View style={[styles.allStrip, { backgroundColor: colors.primaryLight, borderBottomColor: colors.primary }]}>
        <Text style={[styles.allStripText, { color: colors.primary, fontFamily: medFont }]}>
          🌿 {isHindi ? 'सभी उत्पाद भागलपुर मंडी से सीधे — रोज़ ताज़ा' : 'All produce sourced directly from Bhagalpur Mandi — fresh daily'}
        </Text>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={i => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={[styles.footer, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
            <Text style={styles.footerEmoji}>🌾</Text>
            <Text style={[styles.footerTitle, { color: colors.text, fontFamily: boldFont }]}>
              {isHindi ? 'और श्रेणियाँ जल्द ही' : 'More categories coming soon'}
            </Text>
            <Text style={[styles.footerSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
              {isHindi ? 'नई श्रेणियाँ जोड़ी जा रही हैं' : 'We\'re adding more categories'}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 22 },
  subtitle: { fontSize: 13, marginTop: 2 },
  mandiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  mandiBadgeIcon: { fontSize: 14 },
  mandiBadgeText: { fontSize: 12 },
  allStrip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  allStripText: { fontSize: 12 },
  list: { padding: 16, paddingBottom: 32, gap: 12 },
  row: { gap: 12 },
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
  imageWrap: { width: '100%', height: 120, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  emojiBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 17 },
  countBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countText: { color: '#fff', fontSize: 10, fontFamily: 'Outfit-Medium' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  cardTextBlock: { flex: 1 },
  cardName: { fontSize: 14 },
  cardSub: { fontSize: 11, marginTop: 2 },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: { fontSize: 14 },
  footer: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  footerEmoji: { fontSize: 32 },
  footerTitle: { fontSize: 15 },
  footerSub: { fontSize: 13 },
});

export default CategoriesScreen;
