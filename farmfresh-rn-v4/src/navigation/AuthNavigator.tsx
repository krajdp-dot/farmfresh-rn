// ============================================================
// FARM FRESH RN v4 — AuthNavigator
// Stack: PhoneEntry → OTP
// ============================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhoneEntryScreen } from '../screens/auth/PhoneEntryScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';

export type AuthStackParamList = {
  PhoneEntryScreen: undefined;
  OTPScreen: { phone: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="PhoneEntryScreen" component={PhoneEntryScreen} />
    <Stack.Screen name="OTPScreen" component={OTPScreen} />
  </Stack.Navigator>
);
