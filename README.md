# Dementia-Friendly Daily Companion

Kompletna cross-platform mobilna aplikacija za osobe sa demencijom i njihove staratelje.

## Karakteristike

- 🧠 Accessibility-first design za osobe sa demencijom
- 📱 React Native + Expo za iOS i Android
- 🔐 Firebase Authentication i Firestore
- 🔔 Push notifikacije sa Expo Notifications
- 👨‍👩‍👧 Porodica i SOS pomoć
- 🎨 Soft gradients i dementia-friendly UI
- ♿ Veliki tekst, jednostavne rečenice, minimalna cognitive load

## Instalacija

### Preduvjeti

- Node.js (v18+)
- npm ili yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (za Android) ili Xcode (za iOS)

### Setup

```bash
cd dementia-companion
npm install
```

### Firebase Setup

1. Kreiraj Firebase projekt na https://console.firebase.google.com
2. Kreiraj `.env.local` datoteku:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
EXPO_PUBLIC_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

### Pokretanje

```bash
# Expo dev mode
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Folder Struktura

```
dementia-companion/
├── src/
│   ├── screens/              # Glavni ekrani aplikacije
│   ├── components/           # Reusable UI komponente
│   ├── navigation/           # Navigation struktura
│   ├── context/              # Global state (Auth, User)
│   ├── hooks/                # Custom hooks
│   ├── constants/            # App konstante i boje
│   ├── types/                # TypeScript tipovi
│   ├── services/             # Firebase i API servisi
│   └── utils/                # Utility funkcije
├── assets/                   # Icons, fonts, images
├── app.json                  # Expo konfiguracija
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md
```

## Ekrani

1. **Splash Screen** - Logo i "Započnite" dugme
2. **Auth Screen** - Login/Registration sa caregiver role
3. **Home Screen** - Glavna navigacija sa kartama
4. **Daily Routine** - Lista dnevnih aktivnosti sa checkboxes
5. **Reminders** - Podsjetnici sa voice playback
6. **Family** - Grid članova porodice
7. **Emergency SOS** - Veliki crveni SOS button
8. **Profile** - Korisnički profil

## API Integracije

- Firebase Authentication (login, registration)
- Firestore (real-time data sync)
- Expo Notifications (push notifikacije)
- Expo Linking (deep linking i phone calls)

## Accessibility Features

- ✅ Veliki tekst (24px+ za glavne naslove)
- ✅ Jednostavne rečenice (max 8-10 reči)
- ✅ Maksimalno 3-4 akcije po ekranu
- ✅ Veliki touch targets (54px+ dugmadi)
- ✅ Visok kontrast boja
- ✅ Voice support
- ✅ Minimal cognitive load
- ✅ Bez komplikovanih menija

## Design System

- **Primarne boje**: Soft blue gradients (#3B82F6 → #60A5FA)
- **Background**: Bijela sa subtilnim shadows
- **Border radius**: 24px
- **Font**: Inter Sans Serif, clean

## Development

```bash
# TypeScript type checking
npm run type-check

# Lint kod
npm run lint

# Run testove
npm run test
```

## Production Build

```bash
eas build --platform ios
eas build --platform android
```

## License

MIT
