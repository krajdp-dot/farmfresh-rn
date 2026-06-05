// ============================================================
// FARM FRESH RN v4 — MainNavigator
// Tab state + BottomNav floats over stack
// Tab press uses navigationRef to imperatively navigate
// ============================================================

import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { HomeScreen }             from '../screens/HomeScreen';
import { SearchScreen }           from '../screens/SearchScreen';
import { CategoriesScreen }       from '../screens/CategoriesScreen';
import { CategoryProductsScreen } from '../screens/CategoryProductsScreen';
import { ProductDetailScreen }    from '../screens/ProductDetailScreen';
import { CartScreen }             from '../screens/CartScreen';
import { OrdersScreen }           from '../screens/OrdersScreen';
import { OrderDetailScreen }      from '../screens/OrderDetailScreen';
import { ProfileScreen }          from '../screens/ProfileScreen';
import { BottomNav, BottomTabName } from '../components/BottomNav';

export type MainStackParamList = {
  Home: undefined;
  Search: undefined;
  Categories: undefined;
  CategoryProducts: { category: string };
  ProductDetail: { product: any };
  Cart: undefined;
  Orders: undefined;
  OrderDetail: { order: any };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const HIDE_NAV = ['ProductDetail', 'OrderDetail', 'CategoryProducts'];

export const MainNavigator = () => {
  const [activeTab, setActiveTab]   = useState<BottomTabName>('Home');
  const [currentRoute, setCurrentRoute] = useState('Home');
  const [cartCount] = useState(3);
  const navRef = useRef<any>(null);

  const handleTabPress = useCallback((tab: BottomTabName) => {
    setActiveTab(tab);
    navRef.current?.navigate(tab);
  }, []);

  const handleOrdersPress = useCallback(() => {
    navRef.current?.navigate('Orders');
  }, []);

  const showNav = !HIDE_NAV.includes(currentRoute);

  return (
    <View style={styles.root}>
      <Stack.Navigator
        ref={navRef}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: 'transparent' },
        }}
        screenListeners={{
          state: (e) => {
            const routes = (e.data as any)?.state?.routes;
            if (routes?.length) {
              const name = routes[routes.length - 1].name;
              setCurrentRoute(name);
              if (['Home','Search','Cart'].includes(name)) {
                setActiveTab(name as BottomTabName);
              }
            }
          },
        }}
      >
        <Stack.Screen name="Home"               component={HomeScreen}             />
        <Stack.Screen name="Search"             component={SearchScreen}           options={{ animation: 'fade' }} />
        <Stack.Screen name="Cart"               component={CartScreen}             />
        <Stack.Screen name="Categories"         component={CategoriesScreen}       />
        <Stack.Screen name="CategoryProducts"   component={CategoryProductsScreen} />
        <Stack.Screen name="ProductDetail"      component={ProductDetailScreen}    />
        <Stack.Screen name="Orders"             component={OrdersScreen}           />
        <Stack.Screen name="OrderDetail"        component={OrderDetailScreen}      />
        <Stack.Screen name="Profile"            component={ProfileScreen}          />
      </Stack.Navigator>

      {showNav && (
        <BottomNav
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onOrdersPress={handleOrdersPress}
          cartCount={cartCount}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});
