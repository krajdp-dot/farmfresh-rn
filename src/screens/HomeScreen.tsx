import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import MandiTicker from '../components/MandiTicker';
import ProductCard from '../components/ProductCard';
import AnimatedPressable from '../components/AnimatedPressable';
import {
  DeliveryBanner,
  SeasonalSpecials,
  SabziBasketBanner,
  WhatsAppFAB,
} from '../components/features';
import { spacing, SCREEN_WIDTH } from '../theme/tokens';

const BANNER_W = SCREEN_WIDTH - 32;

const CATEGORIES = [
  { id: '1', name: 'Vegetables',  nameHi: 'सब्ज़ियाँ',    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300', emoji: '🥦' },
  { id: '2', name: 'Fruits',      nameHi: 'फल',           image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300', emoji: '🍊' },
  { id: '3', name: 'Leafy',       nameHi: 'पत्तेदार',     image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300', emoji: '🥬' },
  { id: '4', name: 'Herbs',       nameHi: 'मसाले',        image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=300', emoji: '🌿' },
  { id: '5', name: 'Exotic',      nameHi: 'विदेशी',       image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300', emoji: '🫑' },
  { id: '6', name: 'Root Veg',    nameHi: 'जड़ सब्ज़ी',   image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300', emoji: '🥕' },
  { id: '7', name: 'Gourds',      nameHi: 'कद्दू वर्ग',  image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=300', emoji: '🎃' },
  { id: '8', name: 'Seasonal',    nameHi: 'मौसमी',        image: 'https://images.unsplash.com/photo-1506807803488-8eafc15316c7?w=300', emoji: '🌾' },
];

const FEATURED = [
  { id: 'p1', name: 'Fresh Tomatoes', nameHi: 'ताज़े टमाटर', price: 25, mandiPrice: 18, unit: '1 kg', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400' },
  { id: 'p2', name: 'Potatoes',       nameHi: 'आलू',         price: 22, mandiPrice: 15, unit: '1 kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400' },
  { id: 'p3', name: 'Onions',         nameHi: 'प्याज़',      price: 28, mandiPrice: 20, unit: '1 kg', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400' },
  { id: 'p4', name: 'Cauliflower',    nameHi: 'फूलगोभी',    price: 35, mandiPrice: 25, unit: '1 piece', image: 'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=400' },
  { id: 'p5', name: 'Spinach',        nameHi: 'पालक',        price: 18, mandiPrice: 12, unit: '500g', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
  { id: 'p6', name: 'Bitter Gourd',   nameHi: 'करेला',       price: 42, mandiPrice: 30, unit: '500g', image: 'https://images.unsplash.com/photo-1571086430599-65c4a5ad13c1?w=400' },
];

const BANNERS = [
  { id: 'b1', title: 'Mandi Direct', titleHi: 'मंडी सीधा', sub: 'Wholesale prices, home delivered', subHi: 'थोक भाव, घर डिलीवरी', bg: '#1A5C35', emoji: '🌿' },
  { id: 'b2', title: 'Free Delivery', titleHi: 'मुफ़्त डिलीवरी', sub: 'On orders above ₹299', subHi: '₹299 से ऊपर', bg: '#B02030', emoji: '🚀' },
  { id: 'b3', title: 'Gold Membership', titleHi: 'गोल्ड सदस्यता', sub: 'Unlock exclusive benefits', subHi: 'विशेष फायदे', bg: '#7A5200', emoji: '⭐' },
];

function getGreeting(isHindi: boolean) {
  const h = new Date().getHours();
  if (isHindi) {
    if (h < 12) return 'सुप्रभात 🌅';
    if (h < 17) return 'नमस्ते ☀️';
    return 'शुभ संध्या 🌙';
  }
  if (h < 12) return 'Good morning 🌅';
  if (h < 17) return 'Good afternoon ☀️';
  return 'Good evening 🌙';
}

const CAT_SIZE = (SCREEN_WIDTH - 32 - 24) / 4;

interface Props {
  onSearchPress: () => void;
  onCategoryPress: (cat: any) => void;
  onProductPress: (prod: any) => void;
  onCartPress: () => void;
  onGoldPress: () => void;
}

const HomeScreen: React.FC<Props> = ({ onSearchPress, onCategoryPress, onProductPress, onCartPress, onGoldPress }) => {
  const { colors } = useTheme();
  const { t, isHindi } = useLang();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeBanner, setActiveBanner] = useState(0);

  const boldFont = isHindi ? 'Baloo2-Bold'     : 'Outfit-Bold';
  const bodyFont = isHindi ? 'Baloo2-Regular'  : 'Outfit-Regular';
  const semiBold = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const exBold   = isHindi ? 'Baloo2-Bold'     : 'Outfit-ExtraBold';

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6, backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <View style={styles.locationBlock}>
            <Text style={[styles.deliverLabel, { color: colors.textMuted, fontFamily: bodyFont }]}>
              📍 {t('deliverTo')}
            </Text>
            <View style={[styles.locationBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.locationBadgeText, { color: colors.primary, fontFamily: 'Outfit-Medium' }]}>
                {isHindi ? 'भागलपुर' : 'Bhagalpur'} ▾
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onCartPress} activeOpacity={0.8}>
            <View style={[styles.cartBtn, { backgroundColor: colors.bgSecondary }]}>
              <Text style={styles.cartEmoji}>🛒</Text>
            </View>
          </TouchableOpacity>
        </View>
        <SearchBar onPress={onSearchPress} editable={false} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Mandi Ticker */}
        <MandiTicker />

        {/* Delivery ETA + Cutoff Banner — F1 + F8 */}
        <DeliveryBanner />

        {/* Greeting */}
        <View style={styles.greetSection}>
          <Text style={[styles.greetText, { color: colors.text, fontFamily: boldFont }]}>
            {getGreeting(isHindi)} 👋
          </Text>
          <Text style={[styles.greetSub, { color: colors.textSecondary, fontFamily: bodyFont }]}>
            {isHindi ? 'आज क्या चाहिए?' : "What would you like today?"}
          </Text>
        </View>

        {/* Banner Carousel */}
        <View style={styles.bannerSection}>
          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setActiveBanner(Math.round(e.nativeEvent.contentOffset.x / BANNER_W))}
            snapToInterval={BANNER_W + 12} decelerationRate="fast"
            contentContainerStyle={styles.bannerScroll}
          >
            {BANNERS.map(b => (
              <View key={b.id} style={[styles.banner, { backgroundColor: b.bg, width: BANNER_W }]}>
                <View style={styles.bannerText}>
                  <Text style={[styles.bannerTitle, { fontFamily: exBold }]}>{isHindi ? b.titleHi : b.title}</Text>
                  <Text style={[styles.bannerSub, { fontFamily: bodyFont }]}>{isHindi ? b.subHi : b.sub}</Text>
                </View>
                <Text style={styles.bannerEmoji}>{b.emoji}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.dotsRow}>
            {BANNERS.map((_, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: i === activeBanner ? colors.primary : colors.border, width: i === activeBanner ? 16 : 6 }]} />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: boldFont }]}>{t('categories')}</Text>
              <Text style={[styles.sectionSub, { color: colors.textMuted, fontFamily: bodyFont }]}>{CATEGORIES.length} {isHindi ? 'श्रेणियाँ' : 'categories'}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAll, { color: colors.primary, fontFamily: semiBold }]}>{t('seeAll')} →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} onPress={() => onCategoryPress(cat)} activeOpacity={0.8}>
                <View style={styles.catItem}>
                  <View style={[styles.catImageWrap, { backgroundColor: colors.bgSecondary, width: CAT_SIZE, height: CAT_SIZE }]}>
                    <Image source={{ uri: cat.image }} style={styles.catImage} resizeMode="cover" />
                    <View style={styles.catEmojiOverlay}>
                      <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    </View>
                  </View>
                  <Text style={[styles.catLabel, { color: colors.text, fontFamily: 'Outfit-Medium' }]} numberOfLines={2}>
                    {isHindi ? cat.nameHi : cat.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fresh Today */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: boldFont }]}>{t('freshToday')} 🌿</Text>
              <Text style={[styles.sectionSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
                {isHindi ? 'आज सुबह मंडी से आया' : 'Arrived from mandi this morning'}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAll, { color: colors.primary, fontFamily: semiBold }]}>{t('seeAll')} →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productGrid}>
            {FEATURED.map(p => (
              <ProductCard key={p.id} {...p} onPress={() => onProductPress(p)} />
            ))}
          </View>
        </View>

        {/* Seasonal Specials — F13 */}
        <SeasonalSpecials onProductPress={onProductPress} />

        {/* Gold banner */}
        <TouchableOpacity onPress={onGoldPress} activeOpacity={0.9} style={styles.goldWrap}>
          <View style={[styles.goldBanner, { backgroundColor: '#1A1200', borderColor: '#4A3000' }]}>
            <View style={styles.goldLeft}>
              <Text style={[styles.goldTitle, { fontFamily: boldFont }]}>⭐ {t('becomeGold')}</Text>
              <Text style={[styles.goldSub, { fontFamily: bodyFont }]}>{t('goldBenefit')}</Text>
            </View>
            <View style={styles.goldRight}>
              <Text style={styles.goldCrown}>👑</Text>
              <View style={[styles.goldBtn, { backgroundColor: '#F5A623' }]}>
                <Text style={[styles.goldBtnText, { fontFamily: boldFont }]}>{isHindi ? 'जुड़ें' : 'Join'}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Sabzi Basket Banner — F11 */}
        <SabziBasketBanner onPress={onGoldPress} />

        {/* Trust section */}
        <View style={[styles.trustSection, { backgroundColor: colors.bgSecondary }]}>
          <Text style={[styles.trustTitle, { color: colors.text, fontFamily: boldFont }]}>
            {isHindi ? 'हम क्यों बेहतर हैं?' : 'Why Farm Fresh?'}
          </Text>
          <View style={styles.trustGrid}>
            {[
              { icon: '🌿', title: isHindi ? 'रोज़ ताज़ा' : 'Daily Fresh', sub: isHindi ? 'मंडी से सुबह' : 'Morning mandi' },
              { icon: '📊', title: isHindi ? 'मंडी भाव' : 'Mandi Price', sub: isHindi ? 'थोक दर पर' : 'Wholesale rates' },
              { icon: '⚡', title: isHindi ? 'तेज़ डिलीवरी' : 'Fast Delivery', sub: isHindi ? '2 घंटे में' : 'Within 2 hours' },
              { icon: '✅', title: isHindi ? 'क्वालिटी चेक' : 'Quality Check', sub: isHindi ? '100% गारंटी' : '100% guarantee' },
            ].map((item, i) => (
              <View key={i} style={[styles.trustCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={styles.trustCardIcon}>{item.icon}</Text>
                <Text style={[styles.trustCardTitle, { color: colors.text, fontFamily: semiBold }]}>{item.title}</Text>
                <Text style={[styles.trustCardSub, { color: colors.textMuted, fontFamily: bodyFont }]}>{item.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* WhatsApp FAB — F15 */}
      <WhatsAppFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, gap: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationBlock: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deliverLabel: { fontSize: 13 },
  locationBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  locationBadgeText: { fontSize: 13 },
  cartBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  cartEmoji: { fontSize: 20 },
  scroll: { gap: 0 },
  greetSection: { padding: 16, gap: 2 },
  greetText: { fontSize: 22 },
  greetSub: { fontSize: 14 },
  bannerSection: { paddingLeft: 16, gap: 10 },
  bannerScroll: { paddingRight: 16, gap: 12 },
  banner: { height: 150, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', marginRight: 12 },
  bannerText: { flex: 1, gap: 6 },
  bannerTitle: { fontSize: 20, color: '#FFFFFF' },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  bannerEmoji: { fontSize: 48 },
  dotsRow: { flexDirection: 'row', gap: 4, paddingHorizontal: 16, alignItems: 'center' },
  dot: { height: 6, borderRadius: 999 },
  section: { paddingHorizontal: 16, paddingTop: 24, gap: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  sectionTitle: { fontSize: 18 },
  sectionSub: { fontSize: 12, marginTop: 2 },
  seeAll: { fontSize: 14, marginTop: 2 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catItem: { width: CAT_SIZE, alignItems: 'center', gap: 6 },
  catImageWrap: { borderRadius: 14, overflow: 'hidden', position: 'relative' },
  catImage: { width: '100%', height: '100%' },
  catEmojiOverlay: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: 3 },
  catEmoji: { fontSize: 14 },
  catLabel: { fontSize: 11, textAlign: 'center' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  goldWrap: { marginHorizontal: 16, marginTop: 24 },
  goldBanner: { borderRadius: 18, borderWidth: 1, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  goldLeft: { flex: 1, gap: 6 },
  goldTitle: { fontSize: 16, color: '#F5A623' },
  goldSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  goldRight: { alignItems: 'center', gap: 8 },
  goldCrown: { fontSize: 36 },
  goldBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  goldBtnText: { color: '#1A1200', fontSize: 13 },
  trustSection: { marginTop: 24, padding: 20, gap: 16 },
  trustTitle: { fontSize: 18, textAlign: 'center' },
  trustGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  trustCard: { width: (SCREEN_WIDTH - 40 - 10) / 2, borderRadius: 14, borderWidth: 1, padding: 14, gap: 5 },
  trustCardIcon: { fontSize: 26 },
  trustCardTitle: { fontSize: 14 },
  trustCardSub: { fontSize: 12 },
});

export default HomeScreen;
