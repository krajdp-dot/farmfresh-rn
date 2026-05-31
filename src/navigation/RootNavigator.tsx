import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useAuthStore } from '../stores/stores';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Lazy imports for perf
const SplashScreen = React.lazy(() => import('../screens/SplashScreen'));
const AuthNavigator = React.lazy(() => import('./AuthStack'));
const MainNavigator = React.lazy(() => import('./MainTabs'));

export default function RootNavigator() {
  const { isHydrated, user, isGuest } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isHydrated ? (
        // Show splash while hydrating
        <Stack.Screen name="Splash" component={SplashScreenWrapper} />
      ) : user || isGuest ? (
        // Authenticated or guest → main app
        <Stack.Screen name="Main" component={MainNavigatorWrapper} />
      ) : (
        // Not authenticated → auth flow
        <Stack.Screen name="Auth" component={AuthNavigatorWrapper} />
      )}
    </Stack.Navigator>
  );
}

// Wrappers to handle React.lazy with createNativeStackNavigator
function SplashScreenWrapper() {
  return (
    <React.Suspense fallback={null}>
      <SplashScreen />
    </React.Suspense>
  );
}

function AuthNavigatorWrapper() {
  return (
    <React.Suspense fallback={null}>
      <AuthNavigator />
    </React.Suspense>
  );
}

function MainNavigatorWrapper() {
  return (
    <React.Suspense fallback={null}>
      <MainNavigator />
    </React.Suspense>
  );
}
