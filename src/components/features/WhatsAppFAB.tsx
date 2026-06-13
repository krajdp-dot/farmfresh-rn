import React from 'react';
import { StyleSheet, Linking, TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const WhatsAppFAB: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: insets.bottom + 88 }]}
      onPress={() => Linking.openURL('https://wa.me/917480062299?text=Hi%20Farm%20Fresh%2C%20I%20need%20help')}
      activeOpacity={0.85}
    >
      <View style={styles.inner}>
        <Text style={styles.icon}>💬</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 16, zIndex: 100 },
  inner: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#25D366', alignItems: 'center', justifyContent: 'center', shadowColor: '#25D366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  icon: { fontSize: 26 },
});
