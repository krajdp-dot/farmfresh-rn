import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNav from '../components/BottomNav';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../theme/ThemeContext';

type Tab = 'Home' | 'Search' | 'Cart' | 'Profile';

type Screen =
  | { name: 'Home' }
  | { name: 'Search' }
  | { name: 'Categories' }
  | { name: 'CategoryProducts'; category: any }
  | { name: 'ProductDetail'; product: any }
  | { name: 'Cart' }
  | { name: 'Checkout' }
  | { name: 'Orders' }
  | { name: 'OrderDetail'; order: any }
  | { name: 'Profile' };

const MainNavigator: React.FC = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [stack, setStack] = useState<Screen[]>([{ name: 'Home' }]);

  const current = stack[stack.length - 1];
  const push = (screen: Screen) => setStack(s => [...s, screen]);
  const pop  = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);

  const goTab = (tab: Tab) => {
    setActiveTab(tab);
    const map: Record<Tab, Screen> = {
      Home:    { name: 'Home' },
      Search:  { name: 'Search' },
      Cart:    { name: 'Cart' },
      Profile: { name: 'Profile' },
    };
    setStack([map[tab]]);
  };

  const renderScreen = () => {
    switch (current.name) {
      case 'Home':
        return (
          <HomeScreen
            onSearchPress={() => push({ name: 'Search' })}
            onCategoryPress={cat => push({ name: 'CategoryProducts', category: cat })}
            onProductPress={prod => push({ name: 'ProductDetail', product: prod })}
            onCartPress={() => goTab('Cart')}
            onGoldPress={() => {}}
          />
        );
      case 'Search':
        return (
          <SearchScreen
            onProductPress={prod => push({ name: 'ProductDetail', product: prod })}
            onBack={pop}
          />
        );
      case 'Categories':
        return (
          <CategoriesScreen
            onCategoryPress={cat => push({ name: 'CategoryProducts', category: cat })}
          />
        );
      case 'CategoryProducts':
        return (
          <CategoryProductsScreen
            category={current.category}
            onProductPress={prod => push({ name: 'ProductDetail', product: prod })}
            onBack={pop}
          />
        );
      case 'ProductDetail':
        return (
          <ProductDetailScreen
            product={current.product}
            onBack={pop}
            onCartPress={() => goTab('Cart')}
          />
        );
      case 'Cart':
        return (
          <CartScreen
            onCheckout={() => push({ name: 'Checkout' })}
            onShopNow={() => goTab('Home')}
          />
        );
      case 'Checkout':
        return (
          <CheckoutScreen
            onOrderPlaced={(orderId) => {
              goTab('Profile');
              setTimeout(() => push({ name: 'Orders' }), 100);
            }}
            onBack={pop}
          />
        );
      case 'Orders':
        return (
          <OrdersScreen
            onOrderPress={order => push({ name: 'OrderDetail', order })}
          />
        );
      case 'OrderDetail':
        return <OrderDetailScreen order={current.order} onBack={pop} />;
      case 'Profile':
        return (
          <ProfileScreen
            onOrdersPress={() => push({ name: 'Orders' })}
          />
        );
      default:
        return null;
    }
  };

  const tabForScreen: Record<string, Tab> = {
    Home: 'Home', Search: 'Search', Categories: 'Home',
    CategoryProducts: 'Home', ProductDetail: 'Home',
    Cart: 'Cart', Checkout: 'Cart',
    Orders: 'Profile', OrderDetail: 'Profile', Profile: 'Profile',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.screen}>{renderScreen()}</View>
      <BottomNav activeTab={tabForScreen[current.name] ?? activeTab} onTabPress={goTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  screen: { flex: 1 },
});

export default MainNavigator;
