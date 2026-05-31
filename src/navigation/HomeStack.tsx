import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from './types';

// Screens — lazy loaded
const HomeScreen = React.lazy(() => import('../screens/HomeScreen'));
const ProductDetailScreen = React.lazy(() => import('../screens/ProductDetailScreen'));
const CategoryProductsScreen = React.lazy(() => import('../screens/CategoryProductsScreen'));
const GoldScreen = React.lazy(() => import('../screens/GoldScreen'));
const OrdersScreen = React.lazy(() => import('../screens/OrdersScreen'));
const OrderDetailScreen = React.lazy(() => import('../screens/OrderDetailScreen'));
const ProfileScreen = React.lazy(() => import('../screens/ProfileScreen'));

const Stack = createNativeStackNavigator<HomeStackParamList>();

const wrap = (Screen: React.LazyExoticComponent<any>) =>
  function WrappedScreen(props: any) {
    return (
      <React.Suspense fallback={null}>
        <Screen {...props} />
      </React.Suspense>
    );
  };

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A1A0F' },
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen name="HomeScreen" component={wrap(HomeScreen)} />
      <Stack.Screen name="ProductDetail" component={wrap(ProductDetailScreen)} />
      <Stack.Screen name="CategoryProducts" component={wrap(CategoryProductsScreen)} />
      <Stack.Screen name="Gold" component={wrap(GoldScreen)} />
      <Stack.Screen name="Orders" component={wrap(OrdersScreen)} />
      <Stack.Screen name="OrderDetail" component={wrap(OrderDetailScreen)} />
      <Stack.Screen name="Profile" component={wrap(ProfileScreen)} />
    </Stack.Navigator>
  );
}
