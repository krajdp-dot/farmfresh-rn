# ============================================================
# FARM FRESH RN v4 — Full Setup Script
# Run this once from the project folder:
# cd "C:\Users\blogw\OneDrive\Desktop\farmfresh-rn-v4"
# .\setup.ps1
# ============================================================

Write-Host ""
Write-Host "🌱 Farm Fresh RN v4 — Setup Starting..." -ForegroundColor Green
Write-Host ""

# ── Step 1: Create all folders ───────────────────────────
Write-Host "📁 Creating folder structure..." -ForegroundColor Cyan

$folders = @(
  "src\theme",
  "src\utils",
  "src\components\icons",
  "src\screens\auth",
  "src\navigation",
  "assets\fonts"
)

foreach ($folder in $folders) {
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  Write-Host "  ✅ $folder"
}

Write-Host ""

# ── Step 2: Write babel.config.js ────────────────────────
Write-Host "⚙️  Writing babel.config.js..." -ForegroundColor Cyan

@'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
'@ | Set-Content -Path "babel.config.js" -Encoding UTF8

Write-Host "  ✅ babel.config.js"

# ── Step 3: Write app.json ────────────────────────────────
Write-Host ""
Write-Host "⚙️  Writing app.json..." -ForegroundColor Cyan

@'
{
  "expo": {
    "name": "Farm Fresh",
    "slug": "farmfresh-rn",
    "version": "4.0.0",
    "orientation": "portrait",
    "androidStatusBar": {
      "barStyle": "light-content",
      "backgroundColor": "#0A1A0F"
    },
    "android": {
      "package": "in.lovefarmfresh.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#0A1A0F"
      }
    },
    "plugins": [
      "expo-font",
      "expo-updates",
      "expo-notifications",
      ["expo-splash-screen", { "backgroundColor": "#0A1A0F" }]
    ],
    "updates": {
      "url": "https://u.expo.dev/e584507d-3c69-4f7f-a761-bff19b7dd5a7"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
'@ | Set-Content -Path "app.json" -Encoding UTF8

Write-Host "  ✅ app.json"

# ── Step 4: Install Expo packages ─────────────────────────
Write-Host ""
Write-Host "📦 Installing Expo packages (this takes a few minutes)..." -ForegroundColor Cyan

npx expo install `
  react-native-gesture-handler `
  react-native-reanimated `
  react-native-screens `
  react-native-safe-area-context `
  react-native-svg `
  expo-linear-gradient `
  expo-blur `
  expo-font `
  expo-splash-screen `
  expo-updates `
  expo-haptics `
  expo-notifications `
  @react-native-async-storage/async-storage

Write-Host "  ✅ Expo packages installed"

# ── Step 5: Install yarn packages ─────────────────────────
Write-Host ""
Write-Host "📦 Installing yarn packages..." -ForegroundColor Cyan

yarn add `
  @react-navigation/native `
  @react-navigation/native-stack `
  moti `
  @expo-google-fonts/outfit `
  @expo-google-fonts/plus-jakarta-sans `
  @expo-google-fonts/baloo-2

Write-Host "  ✅ Yarn packages installed"

# ── Step 6: Remind about files ───────────────────────────
Write-Host ""
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host "✅ ALL DONE! Now copy your downloaded files:" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  App.tsx                    → root folder"
Write-Host ""
Write-Host "  colors.ts                  → src\theme\"
Write-Host "  theme.ts                   → src\theme\"
Write-Host "  index.ts  (theme)          → src\theme\"
Write-Host ""
Write-Host "  haptics.ts                 → src\utils\"
Write-Host "  notifications.ts           → src\utils\"
Write-Host ""
Write-Host "  index.tsx (icons)          → src\components\icons\"
Write-Host "  AnimatedPressable.tsx      → src\components\"
Write-Host "  BottomNav.tsx              → src\components\"
Write-Host "  MandiTicker.tsx            → src\components\"
Write-Host "  ProductCard.tsx            → src\components\"
Write-Host ""
Write-Host "  SplashScreen.tsx           → src\screens\"
Write-Host "  HomeScreen.tsx             → src\screens\"
Write-Host "  SearchScreen.tsx           → src\screens\"
Write-Host "  CategoriesScreen.tsx       → src\screens\"
Write-Host "  CategoryProductsScreen.tsx → src\screens\"
Write-Host "  ProductDetailScreen.tsx    → src\screens\"
Write-Host "  CartScreen.tsx             → src\screens\"
Write-Host "  OrdersScreen.tsx           → src\screens\"
Write-Host "  OrderDetailScreen.tsx      → src\screens\"
Write-Host "  ProfileScreen.tsx          → src\screens\"
Write-Host ""
Write-Host "  PhoneEntryScreen.tsx       → src\screens\auth\"
Write-Host "  OTPScreen.tsx              → src\screens\auth\"
Write-Host ""
Write-Host "  AuthNavigator.tsx          → src\navigation\"
Write-Host "  MainNavigator.tsx          → src\navigation\"
Write-Host "  RootNavigator.tsx          → src\navigation\"
Write-Host ""
Write-Host "Then run:  yarn start" -ForegroundColor Green
Write-Host ""
