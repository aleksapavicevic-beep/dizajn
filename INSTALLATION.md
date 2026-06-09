# DEMENTIA-FRIENDLY DAILY COMPANION - INSTALLATION GUIDE

## Brza Instalacija

### Korak 1: Preduvjeti

```bash
# Instalacija Node.js (v18+)
# https://nodejs.org/

# Instalacija Expo CLI
npm install -g expo-cli

# Android: Instalacija Android Studio
# https://developer.android.com/studio

# iOS: Xcode (samo na macOS)
# https://developer.apple.com/xcode/
```

### Korak 2: Kloniranje i Setup

```bash
cd c:\Users\User\Desktop\DEMENTIA
cd dementia-companion

# Instalacija dependencies
npm install

# ili sa yarn
yarn install
```

### Korak 3: Firebase Setup

1. Kreiraj Firebase projekt:
   - Idi na https://console.firebase.google.com
   - Klikni "Create Project"
   - Unesi naziv: "Dementia Companion"
   - Klikni "Create Project"

2. Aktiviraj Authentication:
   - U Firebase Console -> Authentication
   - Klikni "Get started"
   - Aktiviraj "Email/Password"

3. Kreiraj Firestore Database:
   - Database -> Create Database
   - Odaberi "Start in test mode"
   - Odaberi lokaciju

4. Preuzmi API ključeve:
   - Project Settings -> General
   - Preuzmi "web" config
   - Copy vrijednosti u `.env.local`

### Korak 4: Environment Setup

```bash
# Kreiraj .env.local iz template-a
cp .env.local.example .env.local

# Unesi Firebase ključeve u .env.local
# Primjer:
# EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
# EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=dementia-companion.firebaseapp.com
# ...
```

### Korak 5: Pokretanje

```bash
# Expo dev mode (pristupačno sa QR code-om)
npm start

# iOS simulator (samo macOS)
npm run ios

# Android emulator
npm run android

# Web (za testiranje u browser-u)
npm run web
```

## Mobilna Aplikacija

### Testiranje sa Expo Go

1. Instalira Expo Go aplikaciju:
   - iOS: App Store
   - Android: Google Play Store

2. Skeniraj QR kod iz terminala

3. Aplikacija će se učitati na telefonu

## Testni Korisnički Podaci

```
Email: demo@example.com
Lozinka: demo123456
```

## Struktura Koda

```
dementia-companion/
├── src/
│   ├── screens/          # 8 ekrana
│   │   ├── SplashScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DailyRoutineScreen.tsx
│   │   ├── RemindersScreen.tsx
│   │   ├── FamilyScreen.tsx
│   │   ├── EmergencyScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   ├── components/       # Reusable UI komponente
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Header.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── ReminderCard.tsx
│   │   ├── FamilyMemberCard.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   ├── navigation/       # React Navigation
│   │   └── RootNavigator.tsx
│   │
│   ├── context/          # Global State
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/            # Custom Hooks
│   │   ├── useTimeGreeting.ts
│   │   └── useDateFormatter.ts
│   │
│   ├── services/         # Firebase + API
│   │   ├── firebase.ts
│   │   ├── authService.ts
│   │   ├── firestoreService.ts
│   │   └── notificationService.ts
│   │
│   ├── constants/        # Design system + Mock data
│   │   ├── colors.ts
│   │   └── mockData.ts
│   │
│   ├── types/            # TypeScript tipovi
│   │   └── index.ts
│   │
│   └── utils/            # Utility funkcije
│       ├── asyncStorage.ts
│       └── textToSpeech.ts
│
├── App.tsx               # Root komponenta
├── app.json              # Expo konfiguracija
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
└── README.md
```

## Dostupni Scripts

```bash
# Pokretanje sa toplog reload-om
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Web
npm run web

# Type checking
npm run type-check

# Linting
npm run lint

# Production build (EAS)
eas build --platform ios
eas build --platform android
```

## Accessibility Features

✅ Veliki tekst (24px+)
✅ Jednostavne rečenice
✅ Veliki touch targets (56px+)
✅ Visok kontrast
✅ Voice support
✅ Minimal cognitive load
✅ Bez skrivenih menija
✅ Clear navigation
✅ Emotionalna boja

## Dementia-Friendly Design

- **Soft gradients** - Umjesto oštrih boja
- **Rounded corners** - Friendly izgled
- **Large buttons** - Laka za dodir
- **Clear labels** - Jednostavno razumijevanje
- **Emotional colors** - Mirujući plavi
- **Minimal navigation** - 3-4 akcije po ekranu
- **Large typography** - Laka za čitanje

## Firebase Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users
    match /users/{userId=**} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /routines/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /reminders/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /familyMembers/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Production Deployment

### iOS

```bash
# Generiši iOS build
eas build --platform ios

# Uploadi na App Store
eas submit --platform ios
```

### Android

```bash
# Generiši Android build
eas build --platform android

# Uploadi na Google Play
eas submit --platform android
```

## Troubleshooting

### Build greške

```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install

# Clear Expo cache
expo cache clear
```

### Firebase nije konfiguriran

Provjeri `.env.local` datoteku i Firebase Console credentials

### Notifikacije ne rade

Provjeri Android/iOS dozvole u app.json

## Licence

MIT - Besplatan za korištenje

## Kontakt

Za pitanja ili probleme, kreiraj issue na GitHub-u

## Napomente

- Aplikacija koristi mock podatke za testiranje
- Svi prikazi su dementia-friendly optimizovani
- Kod je u potpunosti TypeScript tipiziran
- Firebase je opciono - app radi sa mock podacima
- Production verzija trebala bi caregiver dashboard
