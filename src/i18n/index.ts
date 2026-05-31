export type Lang = 'en' | 'hi';

export type TranslationKey = keyof typeof en;

const en = {
  // App
  appName: 'Farm Fresh',
  tagline: 'Fresh from the mandi, at your door',

  // Navigation
  tabHome: 'Shop',
  tabCategories: 'Categories',
  tabCart: 'Cart',
  tabOrders: 'Orders',

  // Home
  greeting_morning: 'Good morning',
  greeting_afternoon: 'Good afternoon',
  greeting_evening: 'Good evening',
  searchPlaceholder: 'Search vegetables, fruits...',
  mandiTicker: "Today's Mandi Rates",
  featuredTitle: 'Fresh Picks',
  allCategories: 'All Categories',
  seeAll: 'See all',
  trending: 'Trending',
  newArrival: 'New',
  bestseller: 'Bestseller',
  outOfStock: 'Out of stock',
  comingSoon: 'Coming Soon',

  // Product
  addToCart: 'Add',
  added: 'Added',
  inCart: 'in cart',
  perKg: '/kg',
  perPiece: '/piece',
  perDozen: '/dozen',
  mrp: 'MRP',
  youSave: 'You save',
  weight: 'Weight',
  halfKg: '½ kg',
  oneKg: '1 kg',
  twoKg: '2 kg',

  // Cart
  yourCart: 'Your Cart',
  emptyCart: 'Your cart is empty',
  emptyCartSub: 'Add fresh produce and\nwe\'ll deliver it to your door',
  shopNow: 'Shop Now',
  subtotal: 'Subtotal',
  deliveryFee: 'Delivery fee',
  freeDelivery: 'FREE',
  freeDeliveryOn: 'Free delivery on orders above',
  total: 'Total',
  placeOrder: 'Place Order',
  addMore: 'Add more items',
  items: 'items',
  item: 'item',

  // Auth
  enterPhone: 'Enter your phone number',
  phonePlaceholder: '10-digit mobile number',
  sendOTP: 'Send OTP',
  enterOTP: 'Enter OTP',
  otpSentTo: 'OTP sent to',
  verify: 'Verify',
  resendOTP: 'Resend OTP',
  continueAsGuest: 'Continue as guest',
  loginToOrder: 'Login to place order',

  // Orders
  myOrders: 'My Orders',
  noOrders: 'No orders yet',
  noOrdersSub: 'Your order history will appear here',
  orderPlaced: 'Order Placed',
  confirmed: 'Confirmed',
  outForDelivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  trackOrder: 'Track Order',
  orderId: 'Order ID',
  orderDate: 'Order Date',
  reorder: 'Reorder',

  // Gold
  goldMembership: 'Gold Membership',
  goldTagline: 'Priority delivery. Better prices.',
  subscribe: 'Subscribe',
  monthly: 'Monthly',
  quarterly: 'Quarterly',

  // Misc
  loading: 'Loading...',
  error: 'Something went wrong',
  retry: 'Retry',
  close: 'Close',
  cancel: 'Cancel',
  confirm: 'Confirm',
  done: 'Done',
  save: 'Save',
  edit: 'Edit',
  delete: 'Delete',
  share: 'Share',
  back: 'Back',
  next: 'Next',
  skip: 'Skip',
  today: 'Today',
  tomorrow: 'Tomorrow',

  // Delivery slots
  deliverySlot: 'Delivery Slot',
  morning: 'Morning',
  evening: 'Evening',
  '7am_11am': '7am – 11am',
  '4pm_8pm': '4pm – 8pm',

  // Store closed
  storeClosed: 'Store Closed',
  storeClosedMsg: 'We\'re closed right now.\nOrders open daily at 6 AM.',
  sundayClosed: 'Closed on Sundays',
} as const;

const hi: typeof en = {
  appName: 'फार्म फ्रेश',
  tagline: 'मंडी से सीधे आपके दरवाज़े',

  tabHome: 'शॉप',
  tabCategories: 'श्रेणियाँ',
  tabCart: 'कार्ट',
  tabOrders: 'ऑर्डर',

  greeting_morning: 'शुभ प्रभात',
  greeting_afternoon: 'नमस्ते',
  greeting_evening: 'शुभ संध्या',
  searchPlaceholder: 'सब्ज़ी, फल खोजें...',
  mandiTicker: 'आज के मंडी भाव',
  featuredTitle: 'ताज़ा चुनाव',
  allCategories: 'सभी श्रेणियाँ',
  seeAll: 'सब देखें',
  trending: 'ट्रेंडिंग',
  newArrival: 'नया',
  bestseller: 'बेस्टसेलर',
  outOfStock: 'स्टॉक खत्म',
  comingSoon: 'जल्द आ रहा है',

  addToCart: 'जोड़ें',
  added: 'जोड़ा',
  inCart: 'कार्ट में',
  perKg: '/किलो',
  perPiece: '/पीस',
  perDozen: '/दर्जन',
  mrp: 'एमआरपी',
  youSave: 'आप बचाते हैं',
  weight: 'वजन',
  halfKg: '½ किलो',
  oneKg: '1 किलो',
  twoKg: '2 किलो',

  yourCart: 'आपकी कार्ट',
  emptyCart: 'कार्ट खाली है',
  emptyCartSub: 'ताज़ी सब्ज़ियाँ जोड़ें\nहम आपके दरवाज़े पर पहुँचाएंगे',
  shopNow: 'अभी खरीदें',
  subtotal: 'उप-कुल',
  deliveryFee: 'डिलीवरी शुल्क',
  freeDelivery: 'मुफ़्त',
  freeDeliveryOn: 'इससे अधिक पर मुफ़्त डिलीवरी',
  total: 'कुल',
  placeOrder: 'ऑर्डर दें',
  addMore: 'और जोड़ें',
  items: 'वस्तुएँ',
  item: 'वस्तु',

  enterPhone: 'फ़ोन नंबर दर्ज करें',
  phonePlaceholder: '10 अंकों का नंबर',
  sendOTP: 'OTP भेजें',
  enterOTP: 'OTP दर्ज करें',
  otpSentTo: 'OTP भेजा गया',
  verify: 'सत्यापित करें',
  resendOTP: 'OTP दोबारा भेजें',
  continueAsGuest: 'मेहमान के रूप में जारी रखें',
  loginToOrder: 'ऑर्डर देने के लिए लॉगिन करें',

  myOrders: 'मेरे ऑर्डर',
  noOrders: 'अभी तक कोई ऑर्डर नहीं',
  noOrdersSub: 'आपका ऑर्डर इतिहास यहाँ दिखेगा',
  orderPlaced: 'ऑर्डर दिया',
  confirmed: 'कन्फर्म',
  outForDelivery: 'डिलीवरी पर',
  delivered: 'डिलीवर हो गया',
  cancelled: 'रद्द',
  trackOrder: 'ट्रैक करें',
  orderId: 'ऑर्डर ID',
  orderDate: 'ऑर्डर दिनांक',
  reorder: 'दोबारा ऑर्डर',

  goldMembership: 'गोल्ड सदस्यता',
  goldTagline: 'प्राथमिकता डिलीवरी। बेहतर कीमतें।',
  subscribe: 'सब्सक्राइब',
  monthly: 'मासिक',
  quarterly: 'त्रैमासिक',

  loading: 'लोड हो रहा है...',
  error: 'कुछ गलत हुआ',
  retry: 'दोबारा कोशिश',
  close: 'बंद करें',
  cancel: 'रद्द करें',
  confirm: 'कन्फर्म',
  done: 'हो गया',
  save: 'सहेजें',
  edit: 'संपादित करें',
  delete: 'हटाएं',
  share: 'शेयर',
  back: 'वापस',
  next: 'आगे',
  skip: 'छोड़ें',
  today: 'आज',
  tomorrow: 'कल',

  deliverySlot: 'डिलीवरी स्लॉट',
  morning: 'सुबह',
  evening: 'शाम',
  '7am_11am': 'सुबह 7 – 11',
  '4pm_8pm': 'शाम 4 – 8',

  storeClosed: 'स्टोर बंद है',
  storeClosedMsg: 'अभी बंद है।\nरोज़ सुबह 6 बजे खुलता है।',
  sundayClosed: 'रविवार को बंद',
} as const;

const translations: Record<Lang, typeof en> = { en, hi };

/** Hook-free translate function; call from stores or utils */
export function t(key: TranslationKey, lang: Lang = 'en'): string {
  return translations[lang][key] ?? translations['en'][key] ?? key;
}

export { translations };
export default translations;
