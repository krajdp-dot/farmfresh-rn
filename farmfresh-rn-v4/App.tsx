// ============================================================
// FARM FRESH RN v4 — App.tsx
// Root entry · Providers · Font loading · GestureHandler
// ============================================================

import 'react-native-gesture-handler'; // MUST be first import
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
} from '@expo-google-fonts/baloo-2';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';

// Suppress known non-critical warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate`',
]);

// Keep native splash until fonts ready
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Outfit-Regular':      Outfit_400Regular,
    'Outfit-Medium':       Outfit_500Medium,
    'Outfit-SemiBold':     Outfit_600SemiBold,
    'Outfit-Bold':         Outfit_700Bold,

    'PlusJakartaSans-Regular':   PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium':    PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold':  PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold':      PlusJakartaSans_700Bold,

    'Baloo2-Regular':   Baloo2_400Regular,
    'Baloo2-Medium':    Baloo2_500Medium,
    'Baloo2-SemiBold':  Baloo2_600SemiBold,
    'Baloo2-Bold':      Baloo2_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <View style={styles.root} onLayout={onLayoutRootView}>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
