import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/stores';
import { useLangStore } from '../stores/stores';
import { Colors, Font, fs } from '../theme';

export default function SplashScreen() {
  const { hydrateFromStorage } = useAuthStore();
  const { hydrateLang } = useLangStore();

  useEffect(() => {
    Promise.all([hydrateFromStorage(), hydrateLang()]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌿</Text>
      <Text style={styles.top}>FARM</Text>
      <Text style={styles.bottom}>FRESH</Text>
      <Text style={styles.sub}>Mandi Awakens</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logo: { fontSize: fs(48) },
  top: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(34),
    color: Colors.accent,
    letterSpacing: 5,
  },
  bottom: {
    fontFamily: Font.outfit.bold,
    fontSize: fs(34),
    color: Colors.white,
    letterSpacing: 3,
  },
  sub: {
    fontFamily: Font.outfit.regular,
    fontSize: fs(14),
    color: Colors.textSecondary,
    marginTop: 8,
  },
});