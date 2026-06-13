import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch, StatusBar, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useLang } from '../theme/LangContext';
import { useAuth } from '../context/AuthContext';
import { spacing, radius, SCREEN_WIDTH } from '../theme/tokens';
import { ReferralCard } from '../components/features';

interface Props {
  onOrdersPress: () => void;
}

const ProfileScreen: React.FC<Props> = ({ onOrdersPress }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { t, isHindi, toggleLang, lang } = useLang();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);

  const boldFont   = isHindi ? 'Baloo2-Bold'     : 'Outfit-Bold';
  const bodyFont   = isHindi ? 'Baloo2-Regular'  : 'Outfit-Regular';
  const semiBold   = isHindi ? 'Baloo2-SemiBold' : 'Outfit-SemiBold';
  const medFont    = isHindi ? 'Baloo2-Medium'   : 'Outfit-Medium';
  const exBold     = isHindi ? 'Baloo2-Bold'     : 'Outfit-ExtraBold';

  const handleLogout = () => {
    Alert.alert(
      isHindi ? 'लॉग आउट' : 'Logout',
      isHindi ? 'क्या आप वाकई लॉग आउट करना चाहते हैं?' : 'Are you sure you want to logout?',
      [
        { text: isHindi ? 'रद्द करें' : 'Cancel', style: 'cancel' },
        { text: isHindi ? 'हाँ, लॉग आउट' : 'Yes, Logout', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const Row = ({
    icon, label, sublabel, onPress, right, destructive = false, noBorder = false,
  }: {
    icon: string; label: string; sublabel?: string;
    onPress?: () => void; right?: React.ReactNode;
    destructive?: boolean; noBorder?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.row, !noBorder && { borderBottomWidth: 1, borderBottomColor: colors.borderLight }]}
    >
      <View style={[styles.rowIconWrap, { backgroundColor: destructive ? colors.redLight : colors.bgSecondary }]}>
        <Text style={styles.rowIconText}>{icon}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, {
          color: destructive ? colors.red : colors.text,
          fontFamily: medFont,
        }]}>
          {label}
        </Text>
        {sublabel && (
          <Text style={[styles.rowSublabel, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {sublabel}
          </Text>
        )}
      </View>
      {right ?? (onPress && <Text style={[styles.rowArrow, { color: colors.textMuted }]}>›</Text>)}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={[styles.sectionHeader, { color: colors.textMuted, fontFamily: semiBold }]}>
      {title}
    </Text>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.bg} />

      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: boldFont }]}>
          {t('myProfile')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile card */}
        <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
          <View style={styles.profileBgBlob} />
          <View style={styles.profileBgBlob2} />

          <View style={styles.profileMain}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.avatarText}>{user?.phone?.slice(-2) ?? '👤'}</Text>
              </View>
              <View style={[styles.avatarOnline, { backgroundColor: '#4CAF50' }]} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { fontFamily: boldFont }]}>
                {user?.name ?? (isHindi ? 'मेरा अकाउंट' : 'My Account')}
              </Text>
              <Text style={[styles.profilePhone, { fontFamily: bodyFont }]}>
                +91 {user?.phone}
              </Text>
              <View style={styles.memberRow}>
                <View style={[styles.memberBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={[styles.memberBadgeText, { fontFamily: semiBold }]}>
                    🌿 {isHindi ? 'नियमित सदस्य' : 'Regular Member'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={[styles.editBtn, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                <Text style={styles.editBtnText}>✏️</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, { backgroundColor: 'rgba(0,0,0,0.15)', borderTopColor: 'rgba(255,255,255,0.12)' }]}>
            {[
              { val: '12', label: isHindi ? 'ऑर्डर' : 'Orders' },
              { val: '₹340', label: isHindi ? 'बचत' : 'Saved' },
              { val: '4.9★', label: isHindi ? 'रेटिंग' : 'Rating' },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <View style={styles.statItem}>
                  <Text style={[styles.statVal, { fontFamily: exBold }]}>{stat.val}</Text>
                  <Text style={[styles.statLabel, { fontFamily: bodyFont }]}>{stat.label}</Text>
                </View>
                {i < 2 && <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Orders quick access */}
        <View style={styles.section}>
          <TouchableOpacity onPress={onOrdersPress} activeOpacity={0.85}>
            <View style={[styles.ordersCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
              <View style={styles.ordersCardLeft}>
                <Text style={styles.ordersCardEmoji}>📦</Text>
                <View>
                  <Text style={[styles.ordersCardTitle, { color: colors.primary, fontFamily: boldFont }]}>
                    {t('myOrders')}
                  </Text>
                  <Text style={[styles.ordersCardSub, { color: colors.textSecondary, fontFamily: bodyFont }]}>
                    {isHindi ? '3 पिछले · 1 सक्रिय ऑर्डर' : '3 past · 1 active order'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.ordersCardArrow, { color: colors.primary }]}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Referral Card — F10 */}
        <ReferralCard />

        {/* Gold upgrade */}
        <View style={styles.section}>
          <TouchableOpacity activeOpacity={0.9}>
            <View style={[styles.goldCard, { backgroundColor: '#1A1200', borderColor: '#4A3000' }]}>
              <View style={styles.goldCardBg} />
              <View style={styles.goldCardContent}>
                <View>
                  <Text style={[styles.goldCardTitle, { fontFamily: boldFont }]}>
                    ⭐ {isHindi ? 'गोल्ड सदस्यता पाएं' : 'Become Gold Member'}
                  </Text>
                  <Text style={[styles.goldCardSub, { fontFamily: bodyFont }]}>
                    {isHindi ? 'मुफ़्त डिलीवरी + विशेष छूट + प्राथमिकता' : 'Free delivery + Exclusive deals + Priority'}
                  </Text>
                  <View style={styles.goldFeatures}>
                    {[isHindi ? '✓ ₹49/सप्ताह' : '✓ ₹49/week', isHindi ? '✓ पहला सप्ताह मुफ़्त' : '✓ First week free'].map((f, i) => (
                      <Text key={i} style={[styles.goldFeatureText, { fontFamily: medFont }]}>{f}</Text>
                    ))}
                  </View>
                </View>
                <View style={styles.goldCardRight}>
                  <Text style={styles.goldCrown}>👑</Text>
                  <View style={[styles.goldUpgradeBtn, { backgroundColor: '#F5A623' }]}>
                    <Text style={[styles.goldUpgradeText, { fontFamily: boldFont }]}>
                      {isHindi ? 'जुड़ें' : 'Join'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings section */}
        <View style={styles.section}>
          <SectionHeader title={isHindi ? '⚙️ सेटिंग्स' : '⚙️ SETTINGS'} />
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Dark / Light mode */}
            <Row
              icon={isDark ? '🌙' : '☀️'}
              label={isDark ? t('darkMode') : t('lightMode')}
              sublabel={isHindi ? 'ऐप की थीम बदलें' : 'Change app appearance'}
              right={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor={colors.border}
                />
              }
            />

            {/* Language toggle */}
            <Row
              icon="🌐"
              label={t('language')}
              sublabel={isHindi ? 'English / हिन्दी' : 'English / Hindi'}
              right={
                <View style={[styles.langToggle, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                  <TouchableOpacity onPress={() => lang !== 'en' && toggleLang()} activeOpacity={0.8}>
                    <View style={[styles.langOption, lang === 'en' && { backgroundColor: colors.primary, borderRadius: 8 }]}>
                      <Text style={[styles.langOptionText, {
                        color: lang === 'en' ? '#fff' : colors.textMuted,
                        fontFamily: lang === 'en' ? semiBold : bodyFont,
                      }]}>EN</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => lang !== 'hi' && toggleLang()} activeOpacity={0.8}>
                    <View style={[styles.langOption, lang === 'hi' && { backgroundColor: colors.primary, borderRadius: 8 }]}>
                      <Text style={[styles.langOptionText, {
                        color: lang === 'hi' ? '#fff' : colors.textMuted,
                        fontFamily: lang === 'hi' ? semiBold : bodyFont,
                      }]}>हि</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
            />

            {/* Notifications */}
            <Row
              icon="🔔"
              label={isHindi ? 'नोटिफिकेशन' : 'Notifications'}
              sublabel={isHindi ? 'ऑर्डर अपडेट, ऑफर' : 'Order updates, offers'}
              noBorder
              right={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor={colors.border}
                />
              }
            />
          </View>
        </View>

        {/* Account section */}
        <View style={styles.section}>
          <SectionHeader title={isHindi ? '👤 अकाउंट' : '👤 ACCOUNT'} />
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Row
              icon="✏️"
              label={t('editProfile')}
              sublabel={isHindi ? 'नाम, फोटो बदलें' : 'Change name, photo'}
              onPress={() => {}}
            />
            <Row
              icon="📍"
              label={t('myAddresses')}
              sublabel={isHindi ? '2 पते सेव हैं' : '2 saved addresses'}
              onPress={() => {}}
            />
            <Row
              icon="💳"
              label={isHindi ? 'भुगतान विधि' : 'Payment Methods'}
              sublabel={isHindi ? 'UPI, COD' : 'UPI, Cash on Delivery'}
              onPress={() => {}}
              noBorder
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <SectionHeader title={isHindi ? '💬 सहायता' : '💬 SUPPORT'} />
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Row
              icon="💬"
              label={t('helpSupport')}
              sublabel={isHindi ? 'WhatsApp, कॉल' : 'WhatsApp, Call us'}
              onPress={() => {}}
            />
            <Row
              icon="⭐"
              label={isHindi ? 'ऐप रेट करें' : 'Rate the App'}
              sublabel={isHindi ? 'हमें बेहतर बनाएं' : 'Help us improve'}
              onPress={() => {}}
            />
            <Row
              icon="📜"
              label={isHindi ? 'नियम & शर्तें' : 'Terms & Privacy'}
              sublabel={isHindi ? 'गोपनीयता नीति' : 'Privacy policy'}
              onPress={() => {}}
              noBorder
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <SectionHeader title={isHindi ? 'ℹ️ ऐप के बारे में' : 'ℹ️ ABOUT'} />
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Row
              icon="🌿"
              label={isHindi ? 'हमारे बारे में' : 'About Farm Fresh'}
              sublabel={isHindi ? 'भागलपुर, बिहार से' : 'From Bhagalpur, Bihar'}
              onPress={() => {}}
            />
            <Row
              icon="🔄"
              label={isHindi ? 'अपडेट जांचें' : 'Check for Updates'}
              sublabel={isHindi ? 'वर्तमान: v4.0' : 'Current: v4.0'}
              onPress={() => {}}
              noBorder
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Row
              icon="🚪"
              label={t('logout')}
              sublabel={isHindi ? `+91 ${user?.phone} से लॉग आउट करें` : `Logout from +91 ${user?.phone}`}
              onPress={handleLogout}
              destructive
              noBorder
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerBlock}>
          <Text style={styles.footerEmoji}>🌿</Text>
          <Text style={[styles.footerTitle, { color: colors.text, fontFamily: boldFont }]}>Farm Fresh</Text>
          <Text style={[styles.footerSub, { color: colors.textMuted, fontFamily: bodyFont }]}>
            {isHindi ? 'भागलपुर, बिहार में बना' : 'Made in Bhagalpur, Bihar'}
          </Text>
          <Text style={[styles.footerVersion, { color: colors.textMuted, fontFamily: bodyFont }]}>
            v4.0.0 · lovefarmfresh.in
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22 },
  scroll: { gap: 0 },

  // Profile card
  profileCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  profileBgBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -80,
    right: -60,
  },
  profileBgBlob2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -40,
    left: -20,
  },
  profileMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 18,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, color: '#FFFFFF' },
  avatarOnline: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#2D8A4E',
  },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: 18, color: '#FFFFFF' },
  profilePhone: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  memberRow: { flexDirection: 'row', marginTop: 2 },
  memberBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  memberBadgeText: { color: '#FFFFFF', fontSize: 12 },
  editBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  editBtnText: { fontSize: 18 },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontSize: 18, color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  statDivider: { width: 1, height: '80%', alignSelf: 'center' },

  // Section
  section: { paddingHorizontal: 16, paddingBottom: 16 },
  sectionHeader: { fontSize: 11, letterSpacing: 0.8, marginBottom: 8 },

  // Orders card
  ordersCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  ordersCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ordersCardEmoji: { fontSize: 28 },
  ordersCardTitle: { fontSize: 15 },
  ordersCardSub: { fontSize: 12, marginTop: 2 },
  ordersCardArrow: { fontSize: 24 },

  // Gold card
  goldCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  goldCardBg: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F5A623',
    opacity: 0.08,
  },
  goldCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  goldCardTitle: { fontSize: 15, color: '#F5A623', marginBottom: 4 },
  goldCardSub: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 17, marginBottom: 8 },
  goldFeatures: { gap: 2 },
  goldFeatureText: { color: '#F5A623', fontSize: 12 },
  goldCardRight: { alignItems: 'center', gap: 8 },
  goldCrown: { fontSize: 34 },
  goldUpgradeBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10 },
  goldUpgradeText: { color: '#1A1200', fontSize: 13 },

  // Card
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconText: { fontSize: 19 },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 15 },
  rowSublabel: { fontSize: 12, marginTop: 1 },
  rowArrow: { fontSize: 22 },

  // Lang toggle
  langToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  langOption: { paddingHorizontal: 11, paddingVertical: 5 },
  langOptionText: { fontSize: 13 },

  // Footer
  footerBlock: { alignItems: 'center', paddingVertical: 24, gap: 4 },
  footerEmoji: { fontSize: 32 },
  footerTitle: { fontSize: 18 },
  footerSub: { fontSize: 13 },
  footerVersion: { fontSize: 11, marginTop: 4 },
});

export default ProfileScreen;
