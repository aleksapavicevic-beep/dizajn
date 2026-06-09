# DEMENTIA-FRIENDLY DAILY COMPANION

Kompletna cross-platform mobilna aplikacija za osobe sa demencijom i njihove staratelje.

## ✨ Karakteristike

### 🎨 Dementia-Friendly Design
- Soft blue gradients
- Rounded corners (24px)
- Veliki tekst (24px+)
- Jednostavne rečenice
- Minimalna navigacija

### 📱 Tehnologija
- React Native + Expo
- TypeScript
- Firebase Authentication + Firestore
- React Navigation
- Expo Notifications
- Text-to-Speech

### 🎯 Funkcionalnosti
- ✅ Dnevni podsjetnici
- ✅ Aktivnosti sa progress tracking-om
- ✅ Članova porodice sa call buttons
- ✅ SOS pomoć sa emergency kontaktima
- ✅ Voice support
- ✅ Push notifikacije
- ✅ Accessibility settings

## 🚀 Quick Start

### Instalacija

```bash
# 1. Instalacija dependencies
npm install

# 2. Setup .env.local sa Firebase ključevima
cp .env.local.example .env.local
# Unesi Firebase credentials

# 3. Pokretanje
npm start

# 4. Skeniranje QR code-a sa Expo Go aplikacijom
```

### Testni Podaci

```
Email: demo@example.com
Lozinka: demo123456
```

## 📁 Folder Struktura

```
src/
├── screens/              # 8 glavnih ekrana
├── components/           # Reusable UI komponente
├── navigation/           # React Navigation setup
├── context/              # Global state (Auth)
├── hooks/                # Custom hooks
├── services/             # Firebase + API servisi
├── constants/            # Colors, mockData
├── types/                # TypeScript tipovi
└── utils/                # Helper funkcije
```

## 🔐 Ekrani

1. **Splash Screen** - Logo i "Započnite"
2. **Auth Screen** - Login/Registration
3. **Home Screen** - Glavna navigacija
4. **Daily Routine** - Dnevne aktivnosti
5. **Reminders** - Podsjetnici sa voice
6. **Family** - Članovi porodice
7. **Emergency SOS** - Veliki crveni button
8. **Profile** - Korisnički podaci i postavke

## 🎯 Accessibility Features

- ✅ Large text (min 24px za headings)
- ✅ High contrast boje
- ✅ Large touch targets (min 54x54px)
- ✅ Simple language
- ✅ Voice playback
- ✅ Clear navigation
- ✅ Minimal cognitive load
- ✅ Accessibility labels

## 🔧 Konfiguracija

### Firebase Setup

1. Kreiraj projekt: https://console.firebase.google.com
2. Aktiviraj Authentication (Email/Password)
3. Kreiraj Firestore Database
4. Copy API ključeve u `.env.local`

### Environment Variables

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_MEASUREMENT_ID=...
```

## 📦 Dependencies

### Core
- `react-native` - UI framework
- `expo` - Development platform
- `react-navigation` - Navigation
- `firebase` - Backend

### UI/UX
- `expo-linear-gradient` - Gradients
- `expo-notifications` - Push notifications
- `expo-linking` - Deep linking & calls
- `expo-av` - Audio/Video
- `expo-speech` - Text-to-speech

### State Management
- `zustand` - Optional state management

## 🎨 Design System

### Colors
- Primary: `#3B82F6` (Dementia-friendly blue)
- Success: `#10B981`
- Emergency: `#EF4444`
- Neutral: Gray palette

### Typography
- Headings: 28-32px
- Body: 16-18px
- Small: 12-14px

### Spacing
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px

## 🧪 Testing

### Demo Podaci

Sve komponente koriste mock podatke za testiranje:
- MOCK_DAILY_ROUTINE - 5 aktivnosti
- MOCK_REMINDERS - 3 podsjetnika
- MOCK_FAMILY_MEMBERS - 4 člana porodice
- MOCK_EMERGENCY_CONTACTS - 2 kontakta

## 📱 Deployment

### iOS

```bash
eas build --platform ios
eas submit --platform ios
```

### Android

```bash
eas build --platform android
eas submit --platform android
```

## 🐛 Troubleshooting

### Problem: "Firebase nije inicijaliziran"
- Provjeri `.env.local` datoteku
- Provjeri Firebase Console credentials

### Problem: "Notifikacije ne rade"
- Provjeri dozvole u `app.json`
- Provjeri platform-specifične postavke

### Problem: "Build greške"
```bash
npm cache clean --force
rm -rf node_modules
npm install
expo cache clear
```

## 📚 Dokumentacija

- [Installation Guide](./INSTALLATION.md)
- [React Navigation Docs](https://reactnavigation.org/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Expo Docs](https://docs.expo.dev/)

## 💡 Best Practices

1. **Accessibility First** - Svaka komponenta mora biti dostupna
2. **Simple Language** - Jednostavne, jasne rečenice
3. **Emotional Design** - Mirujuće boje i friendly izgled
4. **Large Touch Targets** - Minimalno 54x54px
5. **Clear Feedback** - Korisnik mora znati što se desilo
6. **Minimal Cognitive Load** - Max 3-4 akcije po ekranu

## 🤝 Contributing

Sve komponente trebaju biti:
- TypeScript tipizovane
- Accessible (WCAG 2.1 AA)
- Dementia-friendly
- Dokumentovane sa komentarima

## 📄 License

MIT - Besplatno za korištenje

## 👥 Tim

Kreiran za osobe sa demencijom i njihove staratelje.

---

**VAŽNO**: Ova aplikacija je namenjena samo za demonstracije i edukacijske svrhe. Za produkciju trebalo bi dodatne sigurnosne mjere i medicinsku konzultaciju.
