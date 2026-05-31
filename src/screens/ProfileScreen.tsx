import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Font, fs, wp, hp, Radius } from '../theme';
import { useAuthStore, useLangStore } from '../stores/stores';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const { lang, setLang } = useLangStore();

  return (
    <View style={[s.root, { paddingTop: insets.top + hp(12) }]}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => nav.goBack()}><Text style={s.backText}>‹</Text></Pressable>
        <Text style={s.title}>Profile</Text>
        <View style={{ width: wp(32) }} />
      </View>

      {user && (
        <View style={s.userCard}>
          <View style={s.avatar}><Text style={{ fontSize: fs(28) }}>👤</Text></View>
          <View>
            <Text style={s.userName}>{user.name ?? 'Customer'}</Text>
            <Text style={s.userPhone}>+91 {user.phone}</Text>
          </View>
        </View>
      )}

      <View style={s.section}>
        <Pressable style={s.row} onPress={() => setLang(lang === 'en' ? 'hi' : 'en')}>
          <Text style={s.rowText}>🌐  Language</Text>
          <Text style={s.rowValue}>{lang === 'en' ? 'English' : 'हिंदी'}</Text>
        </Pressable>
        <Pressable style={s.row} onPress={() => nav.navigate('Orders')}>
          <Text style={s.rowText}>📦  My Orders</Text>
          <Text style={s.rowArrow}>›</Text>
        </Pressable>
        <Pressable style={s.row} onPress={() => nav.navigate('Gold')}>
          <Text style={s.rowText}>👑  Farm Fresh Gold</Text>
          <Text style={s.rowArrow}>›</Text>
        </Pressable>
      </View>

      {user && (
        <Pressable style={s.logoutBtn} onPress={logout}>
          <Text style={s.logoutText}>Logout</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(16), marginBottom: hp(16) },
  back: { width: wp(32), height: wp(32), alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: Font.outfit.bold, fontSize: fs(26), color: Colors.textPrimary },
  title: { flex: 1, fontFamily: Font.outfit.bold, fontSize: fs(20), color: Colors.textPrimary, textAlign: 'center' },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: wp(14), backgroundColor: Colors.bgCard, marginHorizontal: wp(16), padding: wp(16), borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, marginBottom: hp(16) },
  avatar: { width: wp(52), height: wp(52), borderRadius: Radius.full, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center' },
  userName: { fontFamily: Font.outfit.semiBold, fontSize: fs(16), color: Colors.textPrimary },
  userPhone: { fontFamily: Font.jakarta.regular, fontSize: fs(13), color: Colors.textSecondary, marginTop: hp(2) },
  section: { backgroundColor: Colors.bgCard, marginHorizontal: wp(16), borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: wp(16), borderBottomWidth: 1, borderBottomColor: Colors.divider },
  rowText: { fontFamily: Font.outfit.medium, fontSize: fs(15), color: Colors.textPrimary },
  rowValue: { fontFamily: Font.outfit.regular, fontSize: fs(14), color: Colors.textSecondary },
  rowArrow: { fontFamily: Font.outfit.bold, fontSize: fs(20), color: Colors.textMuted },
  logoutBtn: { margin: wp(16), padding: wp(14), borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)', alignItems: 'center', marginTop: hp(24) },
  logoutText: { fontFamily: Font.outfit.semiBold, fontSize: fs(15), color: Colors.error },
});
