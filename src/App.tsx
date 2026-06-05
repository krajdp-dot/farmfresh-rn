import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreenExpo from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Colors } from './theme';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthProvider } from './context/AuthContext';

SplashScreenExpo.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const navTheme = {
  dark: true,
  colors: {
    primary: Colors.accent,
    background: Colors.bg,
    card: Colors.bgCard,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.accent,
  },
  fonts: {
    regular: { fontFamily: 'Outfit-Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'Outfit-Medium', fontWeight: '500' as const },
    bold: { fontFamily: 'Outfit-Bold', fontWeight: '700' as const },
    heavy: { fontFamily: 'Outfit-Bold', fontWeight: '900' as const },
  },
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
      'Outfit-Medium': require('../assets/fonts/Outfit-Medium.ttf'),
      'Outfit-SemiBold': require('../assets/fonts/Outfit-SemiBold.ttf'),
      'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
      'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
      'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
      'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
      'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
      'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
      'Baloo2-Medium': require('../assets/fonts/Baloo2-Medium.ttf'),
      'Baloo2-SemiBold': require('../assets/fonts/Baloo2-SemiBold.ttf'),
      'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
    }).then(() => setFontsLoaded(true)).catch(() => setFontsLoaded(true));
  }, []);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreenExpo.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
              <View style={{ flex: 1, backgroundColor: Colors.bg }} onLayout={onLayout}>
                <RootNavigator />
              </View>
            </NavigationContainer>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
