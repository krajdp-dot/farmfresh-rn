import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Lang = 'en' | 'hi';

const strings = {
  en: {
    // App
    appName: 'Farm Fresh',
    tagline: 'From mandi to your door',
    taglineSub: 'Freshest produce at wholesale prices',
    // Auth
    enterPhone: 'Enter your phone number',
    phonePlaceholder: '10-digit mobile number',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    otpSent: 'OTP sent to',
    resendOTP: 'Resend OTP',
    resendIn: 'Resend in',
    seconds: 's',
    wrongOTP: 'Invalid OTP. Try again.',
    // Home
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    deliverTo: 'Deliver to',
    searchPlaceholder: 'Search vegetables, fruits...',
    categories: 'Categories',
    freshToday: 'Fresh Today',
    seeAll: 'See all',
    mandiPrice: 'Mandi',
    ourPrice: 'Our Price',
    addToCart: 'Add',
    added: 'Added',
    inCart: 'in cart',
    // Mandi Ticker
    mandiLive: 'MANDI LIVE',
    // Cart
    myCart: 'My Cart',
    emptyCart: 'Your cart is empty',
    emptyCartSub: 'Add fresh produce to get started',
    shopNow: 'Shop Now',
    itemTotal: 'Item Total',
    deliveryFee: 'Delivery Fee',
    free: 'FREE',
    totalAmount: 'Total Amount',
    proceedToCheckout: 'Proceed to Checkout',
    remove: 'Remove',
    // Checkout
    checkout: 'Checkout',
    deliveryAddress: 'Delivery Address',
    deliverySlot: 'Delivery Slot',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',
    // Orders
    myOrders: 'My Orders',
    active: 'Active',
    past: 'Past',
    orderPlaced: 'Order Placed',
    confirmed: 'Confirmed',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    reorder: 'Reorder',
    // Profile
    myProfile: 'My Profile',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    logout: 'Logout',
    editProfile: 'Edit Profile',
    myAddresses: 'My Addresses',
    helpSupport: 'Help & Support',
    aboutApp: 'About App',
    // Search
    search: 'Search',
    recentSearches: 'Recent Searches',
    popularCategories: 'Popular Categories',
    noResults: 'No results found',
    noResultsSub: 'Try a different search term',
    // Product
    productDetails: 'Product Details',
    mandiVsUs: 'Mandi vs Our Price',
    youSave: 'You save',
    farmStory: 'Sourced From',
    selectQuantity: 'Select Quantity',
    // General
    loading: 'Loading...',
    retry: 'Retry',
    back: 'Back',
    done: 'Done',
    cancel: 'Cancel',
    confirm: 'Confirm',
    // Gold
    goldMember: 'Gold Member',
    becomeGold: 'Become Gold',
    goldBenefit: 'Free delivery + Priority support',
    // Weights
    kg: 'kg',
    g: 'g',
    dozen: 'dozen',
    piece: 'piece',
  },
  hi: {
    // App
    appName: 'फ़ार्म फ्रेश',
    tagline: 'मंडी से आपके दरवाज़े तक',
    taglineSub: 'थोक भाव में ताज़ी सब्ज़ियाँ',
    // Auth
    enterPhone: 'अपना फ़ोन नंबर दर्ज करें',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर',
    sendOTP: 'OTP भेजें',
    verifyOTP: 'OTP सत्यापित करें',
    otpSent: 'OTP भेजा गया',
    resendOTP: 'OTP दोबारा भेजें',
    resendIn: 'दोबारा भेजें',
    seconds: 'सेकंड',
    wrongOTP: 'गलत OTP। फिर से कोशिश करें।',
    // Home
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्ते',
    goodEvening: 'शुभ संध्या',
    deliverTo: 'यहाँ डिलीवर करें',
    searchPlaceholder: 'सब्ज़ी, फल खोजें...',
    categories: 'श्रेणियाँ',
    freshToday: 'आज ताज़ा',
    seeAll: 'सब देखें',
    mandiPrice: 'मंडी',
    ourPrice: 'हमारा भाव',
    addToCart: 'जोड़ें',
    added: 'जोड़ा',
    inCart: 'कार्ट में',
    // Mandi Ticker
    mandiLive: 'मंडी LIVE',
    // Cart
    myCart: 'मेरी कार्ट',
    emptyCart: 'आपकी कार्ट खाली है',
    emptyCartSub: 'ताज़ी सब्ज़ियाँ जोड़ें',
    shopNow: 'अभी खरीदें',
    itemTotal: 'वस्तु कुल',
    deliveryFee: 'डिलीवरी शुल्क',
    free: 'मुफ़्त',
    totalAmount: 'कुल राशि',
    proceedToCheckout: 'चेकआउट करें',
    remove: 'हटाएं',
    // Checkout
    checkout: 'चेकआउट',
    deliveryAddress: 'डिलीवरी पता',
    deliverySlot: 'डिलीवरी समय',
    orderSummary: 'ऑर्डर सारांश',
    placeOrder: 'ऑर्डर दें',
    // Orders
    myOrders: 'मेरे ऑर्डर',
    active: 'सक्रिय',
    past: 'पिछले',
    orderPlaced: 'ऑर्डर हुआ',
    confirmed: 'पुष्टि हुई',
    outForDelivery: 'रास्ते में',
    delivered: 'डिलीवर हुआ',
    cancelled: 'रद्द',
    reorder: 'दोबारा ऑर्डर',
    // Profile
    myProfile: 'मेरी प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    theme: 'थीम',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    logout: 'लॉग आउट',
    editProfile: 'प्रोफ़ाइल बदलें',
    myAddresses: 'मेरे पते',
    helpSupport: 'सहायता',
    aboutApp: 'ऐप के बारे में',
    // Search
    search: 'खोजें',
    recentSearches: 'हाल की खोज',
    popularCategories: 'लोकप्रिय श्रेणियाँ',
    noResults: 'कोई परिणाम नहीं',
    noResultsSub: 'अलग शब्द से खोजें',
    // Product
    productDetails: 'उत्पाद विवरण',
    mandiVsUs: 'मंडी बनाम हमारा भाव',
    youSave: 'आप बचाते हैं',
    farmStory: 'स्रोत',
    selectQuantity: 'मात्रा चुनें',
    // General
    loading: 'लोड हो रहा है...',
    retry: 'पुनः प्रयास',
    back: 'वापस',
    done: 'हो गया',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    // Gold
    goldMember: 'गोल्ड सदस्य',
    becomeGold: 'गोल्ड बनें',
    goldBenefit: 'मुफ़्त डिलीवरी + प्राथमिकता सहायता',
    // Weights
    kg: 'किग्रा',
    g: 'ग्राम',
    dozen: 'दर्जन',
    piece: 'नग',
  },
};

export type StringKeys = keyof typeof strings.en;

interface LangContextType {
  lang: Lang;
  t: (key: StringKeys) => string;
  toggleLang: () => void;
  isHindi: boolean;
  fontFamily: string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  t: (key) => key,
  toggleLang: () => {},
  isHindi: false,
  fontFamily: 'Outfit-Regular',
});

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    AsyncStorage.getItem('lang').then((saved) => {
      if (saved === 'en' || saved === 'hi') setLang(saved);
    });
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    AsyncStorage.setItem('lang', next);
  };

  const t = (key: StringKeys): string => strings[lang][key] ?? strings.en[key] ?? key;

  return (
    <LangContext.Provider
      value={{
        lang,
        t,
        toggleLang,
        isHindi: lang === 'hi',
        fontFamily: lang === 'hi' ? 'Baloo2-Regular' : 'Outfit-Regular',
      }}
    >
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
