# QUICK START GUIDE

## 5 Minute Setup

### 1. Kloniranje Repo-a
```bash
git clone <repo-url>
cd dementia-companion
```

### 2. Instalacija Dependencies
```bash
npm install
```

### 3. Firebase Setup
```bash
# Kopiraj template env datoteku
cp .env.local.example .env.local

# Unesi Firebase ključeve iz Firebase Console
# https://console.firebase.google.com
```

### 4. Pokretanje
```bash
npm start
```

### 5. Testiranje
```bash
# Option 1: Skenira QR kod sa Expo Go aplikacijom
# Option 2: Stisku 'i' za iOS simulator
# Option 3: Stisku 'a' za Android emulator
```

## Testni Korisnički Podaci

```
Email: demo@example.com
Lozinka: demo123456
```

## Struktura Projekta

```
src/
├── screens/          # Svi ekrani (8 total)
├── components/       # UI komponente
├── navigation/       # Navigation setup
├── context/          # Global state
├── services/         # Firebase & API
└── constants/        # Colors, fonts, mockData
```

## Ključne Datoteke

- `App.tsx` - Entry point
- `src/navigation/RootNavigator.tsx` - Navigation struktura
- `src/context/AuthContext.tsx` - Auth state
- `src/constants/colors.ts` - Design system

## Development Commands

```bash
# Start dev server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
eas build --platform ios
eas build --platform android
```

## Troubleshooting

### Firebase nije konfiguriran
→ Provjeri `.env.local` datoteku

### Build error
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Notifikacije ne rade
→ Provjeri Android/iOS dozvole u `app.json`

## Next Steps

1. Provjeri [INSTALLATION.md](./INSTALLATION.md) za detaljnu uputu
2. Provjeri [ARCHITECTURE.md](./ARCHITECTURE.md) za pregled koda
3. Provjeri [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md) za best practices
4. Provjeri [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) za API reference

## Resources

- 📚 [React Native Docs](https://reactnative.dev/)
- 🚀 [Expo Docs](https://docs.expo.dev/)
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- 🧭 [React Navigation](https://reactnavigation.org/)
- ♿ [Accessibility Guide](./ACCESSIBILITY_GUIDE.md)

## Support

Za pitanja ili probleme:
1. Provjeri dokumentaciju
2. Provjeri GitHub issues
3. Provjeri Stack Overflow sa `react-native` tagom

---

Happy coding! 🚀
