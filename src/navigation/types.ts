import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

// ─── Root Stack ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

// ─── Auth Stack ───────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  PhoneEntry: undefined;
  OTPVerify: { phone: string };
};

// ─── Main Tabs ────────────────────────────────────────────────────────────────

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Categories: undefined;
  Cart: undefined;
};

// ─── Home Stack (nested inside Home tab) ─────────────────────────────────────

export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetail: { productId: string };
  CategoryProducts: { categoryId: string; categoryName: string };
  Gold: undefined;
  Orders: undefined;
  OrderDetail: { orderId: string };
  Profile: undefined;
};

// ─── Combined nav prop for screens inside Home tab ───────────────────────────

export type HomeScreenNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>,
  BottomTabNavigationProp<MainTabParamList>
>;

// ─── Individual screen props ──────────────────────────────────────────────────

export type ProductDetailNavProp = NativeStackNavigationProp<HomeStackParamList, 'ProductDetail'>;
export type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

export type CategoryProductsNavProp = NativeStackNavigationProp<HomeStackParamList, 'CategoryProducts'>;
export type CategoryProductsRouteProp = RouteProp<HomeStackParamList, 'CategoryProducts'>;

export type OrderDetailNavProp = NativeStackNavigationProp<HomeStackParamList, 'OrderDetail'>;
export type OrderDetailRouteProp = RouteProp<HomeStackParamList, 'OrderDetail'>;

export type OTPVerifyRouteProp = RouteProp<AuthStackParamList, 'OTPVerify'>;
export type OTPVerifyNavProp = NativeStackNavigationProp<AuthStackParamList, 'OTPVerify'>;
