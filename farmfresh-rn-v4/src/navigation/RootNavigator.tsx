// ============================================================
// FARM FRESH RN v4 — RootNavigator
// Splash → Auth → Main  |  Uses AuthContext for state
// ============================================================

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useAuth } from '../context/AuthContext';
import { SplashScreen } from '../screens/SplashScreen';

export const RootNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.root}>
        <SplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});
