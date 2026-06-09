// INDEX.md
// Master index svih datoteka i resursa

# 📑 DEMENTIA-FRIENDLY DAILY COMPANION - MASTER INDEX

## 🚀 Početak

**Novi korisnik?** Kreni odavdje:
1. Procitaj [QUICKSTART.md](./QUICKSTART.md) - 5 minuta
2. Procitaj [README.md](./README.md) - Overview
3. Procitaj [INSTALLATION.md](./INSTALLATION.md) - Detaljne korake
4. Kreni sa `npm install` i `npm start`

## 📂 Glavne Dokumentacijske Datoteke

### Setup i Instalacija
- [QUICKSTART.md](./QUICKSTART.md) ⚡ - 5-minute quick start
- [INSTALLATION.md](./INSTALLATION.md) 📦 - Detaljne instalacijske instrukcije
- [README.md](./README.md) 📘 - Projekt overview
- [.env.local.example](./.env.local.example) - Firebase template

### Razvoj i Arhitektura
- [ARCHITECTURE.md](./ARCHITECTURE.md) 🏗️ - Pregled arhitekture
- [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md) 💡 - Best practices
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) 🔌 - API reference
- [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) 🗺️ - Future features

### Specijalizovane Vodiče
- [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md) ♿ - Dementia-friendly
- [firebaseConfig.example.ts](./firebaseConfig.example.ts) 🔥 - Firebase setup
- [FIRESTORE_SECURITY_RULES.txt](./FIRESTORE_SECURITY_RULES.txt) 🔒 - Security

### Ova Datoteka
- [FINAL_SUMMARY.txt](./FINAL_SUMMARY.txt) 📊 - Detaljna statistika
- [INDEX.md](./INDEX.md) 📑 - Ova datoteka

## 🎯 Source Code Struktura

### Ekrani (8 datoteke, src/screens/)
```
SplashScreen.tsx        → Logo i "Započnite"
AuthScreen.tsx          → Login/Registration
HomeScreen.tsx          → Glavna navigacija
DailyRoutineScreen.tsx  → Dnevne aktivnosti
RemindersScreen.tsx     → Podsjetnici
FamilyScreen.tsx        → Članovi porodice
EmergencyScreen.tsx     → SOS pomoć
ProfileScreen.tsx       → Profil i postavke
```

### Komponente (8 datoteke, src/components/)
```
Button.tsx              → Reusable button
Card.tsx                → Card sa gradientom
Input.tsx               → Text input sa labellom
Header.tsx              → Header sa vremenom
ActivityCard.tsx        → Prikaz aktivnosti
ReminderCard.tsx        → Prikaz podsjetnika
FamilyMemberCard.tsx    → Prikaz člana porodice
LoadingSpinner.tsx      → Loading indikator
```

### State Management (src/context/)
```
AuthContext.tsx         → Global auth state
```

### Custom Hooks (src/hooks/)
```
useTimeGreeting.ts      → Dobijanje pozdrava
useDateFormatter.ts     → Formatiranje datuma
```

### Servisi (src/services/)
```
firebase.ts             → Firebase inicijalizacija
authService.ts          → Auth operacije
firestoreService.ts     → Database operacije
notificationService.ts  → Push notifications
```

### Konstante (src/constants/)
```
colors.ts               → Design system (boje, tipografija, spacing)
mockData.ts             → Dummy podaci za testiranje
```

### TypeScript Tipovi (src/types/)
```
index.ts                → Svi tipovi aplikacije
```

### Utility Funkcije (src/utils/)
```
asyncStorage.ts         → Local storage
textToSpeech.ts         → Text-to-speech
```

### Navigation (src/navigation/)
```
RootNavigator.tsx       → Glavna navigacijska struktura
```

## 📦 Root Datoteke

```
App.tsx                 → Entry point aplikacije
app.json                → Expo konfiguracija
package.json            → Dependencies
tsconfig.json           → TypeScript konfiguracija
metro.config.js         → Metro bundler
babel.config.js         → Babel transpiler
jest.config.js          → Test framework
setupTests.ts           → Test setup
.eslintrc.js            → Linting rules
.gitignore              → Git ignore lista
```

## 🎮 Testni Podaci

Korisnik: `demo@example.com`
Lozinka: `demo123456`

Dostupno:
- 5 dnevnih aktivnosti
- 3 podsjetnika
- 4 člana porodice
- 2 emergency kontakta

## 🔧 Česti Zadaci

### Dodavanje nove komponente
[Vidi DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md#3-dodavanje-nove-komponente)

### Dodavanje novog ekrana
[Vidi DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md#4-dodavanje-novog-ekrana)

### Firebase konfiguracija
[Vidi INSTALLATION.md](./INSTALLATION.md#korak-3-firebase-setup)

### Deployment na App Store / Play Store
[Vidi INSTALLATION.md](./INSTALLATION.md#production-deployment)

### Testiranje accessibility-ja
[Vidi ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md#testing)

## 🚀 Brze Komande

```bash
# Instalacija
npm install

# Development
npm start

# Testing
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser

# Production
eas build --platform ios
eas build --platform android

# Quality
npm run type-check
npm run lint
npm run test
```

## 📊 Project Statistics

| Kategorija | Broj |
|-----------|------|
| Datoteke | 45+ |
| Komponenti | 8 |
| Ekrani | 8 |
| Servisi | 4 |
| Hooks | 2 |
| Linije koda | ~5000+ |
| TypeScript tipovi | 20+ |
| Test datoteke | Ready |

## 🎓 Learning Paths

### Za Početnike
1. Procitaj [README.md](./README.md)
2. Slijedi [QUICKSTART.md](./QUICKSTART.md)
3. Pogledaj [ARCHITECTURE.md](./ARCHITECTURE.md)
4. Eksperimentiraj sa mock podacima

### Za Intermediate
1. Provjeri [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Provjeri [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md)
3. Dodaj novu komponentu
4. Dodaj novi ekran

### Za Advanced
1. Provjeri [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md)
2. Implementiraj novu funkcionalnost
3. Optimiziraj performance
4. Deploy na production

## 📞 Frequently Asked Questions

### P: Gdje početi?
O: [QUICKSTART.md](./QUICKSTART.md) - 5 minuta do pokretanja

### P: Kako da dodam novu komponentu?
O: [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md#3-dodavanje-nove-komponente)

### P: Kako da setam Firebase?
O: [INSTALLATION.md](./INSTALLATION.md#korak-3-firebase-setup)

### P: Gdje su testni podaci?
O: MockData koristi `src/constants/mockData.ts` i test korisnike

### P: Kako da deployam?
O: [INSTALLATION.md](./INSTALLATION.md#production-deployment)

### P: Kako da testiram accessibility?
O: [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md#testing)

## 🌐 Vanjski Resursi

### Dokumentacija
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase](https://firebase.google.com/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript](https://www.typescriptlang.org/)

### Alati
- [VS Code](https://code.visualstudio.com/)
- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)
- [Firebase Console](https://console.firebase.google.com/)

### Community
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [GitHub Issues](https://github.com/facebook/react-native/issues)
- [Expo Community](https://forums.expo.dev/)

## ✅ Pre-Launch Checklist

Prije produkcije:

- [ ] Procitaj [QUICKSTART.md](./QUICKSTART.md)
- [ ] Provjeri [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md)
- [ ] Testiraj sa [testnim podacima](#testni-podaci)
- [ ] Sljeedi [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md)
- [ ] Slijedi [Deployment Checklist](./DEVELOPMENT_NOTES.md#deployment-checklist)
- [ ] Postavi [Firebase Security Rules](./FIRESTORE_SECURITY_RULES.txt)
- [ ] Build na [iOS i Android](./INSTALLATION.md#production-deployment)

## 🎉 Gotovo!

Sveobuhvatan vodiči su dostupni. Sretan razvoj! 🚀

---

**Zadnja ažuriranja:** 2024
**Verzija:** 1.0.0
**Status:** Production-ready ✅
