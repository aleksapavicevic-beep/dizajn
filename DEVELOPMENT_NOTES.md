// DEVELOPMENT_NOTES.md
// Bilješke za razvoj

## Kako Početi

### 1. Setup projekt
```bash
npm install
cp .env.local.example .env.local
# Unesi Firebase ključeve
```

### 2. Pokretanje u dev modu
```bash
npm start
# Skenira QR sa Expo Go aplikacijom
```

### 3. Dodavanje nove komponente

Primjer - Nova Button komponenta:

```typescript
// src/components/NewButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@constants/colors';

interface NewButtonProps {
  label: string;
  onPress: () => void;
}

export function NewButton({ label, onPress }: NewButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  text: {
    ...Typography.body1,
    color: Colors.white,
    fontWeight: '600',
  },
});
```

### 4. Dodavanje novog ekrana

```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { Colors, Spacing, Typography } from '@constants/colors';

export function NewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Novi Ekran</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing['2xl'],
  },
  title: {
    ...Typography.h2,
    color: Colors.gray900,
  },
});
```

### 5. Dodavanje u navigaciju

```typescript
// src/navigation/RootNavigator.tsx
<Stack.Screen
  name="NewScreen"
  component={NewScreen}
  options={{ title: 'Novi Ekran' }}
/>
```

## Accessibility Checklist

Prije nego što prijaviš komponentu:

- [ ] Svi tekst je najmanje 16px (18px+ preferirano)
- [ ] Svi buttonsi su najmanje 56x56px
- [ ] Color contrast je minimum 4.5:1
- [ ] Nema skrivenih akcija
- [ ] Accessibility label je dodan
- [ ] Voice support je testiran
- [ ] Mobile je testiran sa telefonom

## Best Practices

### Tipizacija

Uvijek koristi TypeScript tipove:

```typescript
// ✅ Dobro
interface UserProps {
  name: string;
  email: string;
  role: 'patient' | 'caregiver';
}

// ❌ Loše
const User = (props: any) => {};
```

### Komponente

```typescript
// ✅ Dobro - reusable
<Button label="Click me" onPress={handlePress} />

// ❌ Loše - hard-coded
<TouchableOpacity onPress={() => alert('Click')}>
  <Text>Click me</Text>
</TouchableOpacity>
```

### State Management

```typescript
// ✅ Dobro - centralizovano u context-u
const { user, login, logout } = useAuth();

// ❌ Loše - prop drilling
<Component user={user} onLogin={login} onLogout={logout} />
```

## Common Tasks

### Dodavanje novog mock podatka

```typescript
// src/constants/mockData.ts
export const MOCK_NEW_DATA = [
  {
    id: '1',
    title: 'Item 1',
    // ...
  },
];
```

### Promjena boje

```typescript
// src/constants/colors.ts
export const Colors = {
  myNewColor: '#3B82F6', // Dodaj ovdje
};

// Koristi
import { Colors } from '@constants/colors';
backgroundColor: Colors.myNewColor;
```

### Dodavanje novog hook-a

```typescript
// src/hooks/useMyHook.ts
export function useMyHook() {
  const [state, setState] = useState(null);
  
  return { state, setState };
}

// Koristi
export { useMyHook } from './useMyHook';
```

### Navigacija između ekrana

```typescript
// Unutar komponente
navigation.navigate('ScreenName', {
  param1: 'value1',
  param2: 'value2',
});

// Preuzmi parametre
const { param1, param2 } = route.params;
```

## Firebase Debug

### U emulator-u

```bash
# Terminal 1
firebase emulators:start

# Terminal 2 - App sa emulatora
FIREBASE_EMULATOR_HOST=localhost:9099 npm start
```

### Logging

```typescript
// Firebase debug logging
import { enableLogging } from 'firebase/firestore';
enableLogging(true);
```

## Performance Tips

1. Koristi `FlatList` umjesto `ScrollView` za dugačke liste
2. Memoriziraj komponente sa `React.memo()` ako je potrebno
3. Izbjegavaj inline funkcije - koristi `useCallback`
4. Koristi `useMemo` za skupo računanje

## Testing

### Mock servise

```typescript
// src/services/__mocks__/authService.ts
export const loginUser = jest.fn().mockResolvedValue({
  success: true,
  user: { uid: 'test-user' },
});
```

### Component test

```typescript
import { render, screen } from '@testing-library/react-native';
import { Button } from '@components/Button';

test('Button renders correctly', () => {
  render(<Button label="Test" onPress={() => {}} />);
  expect(screen.getByText('Test')).toBeTruthy();
});
```

## Debugging

### Chrome DevTools

```bash
# 1. Skenira QR kod
# 2. Stisku "d"
# 3. Stisku "j" za Chrome DevTools
```

### VS Code Debugger

U `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Expo",
  "port": 19000,
  "protocol": "lldb"
}
```

## Deployment Checklist

Prije produkcije:

- [ ] Obriši sve console.log()
- [ ] Provjeri sve tipizacije
- [ ] Testiraj na iOS i Android
- [ ] Testiraj sa slow 3G mrežom
- [ ] Testiraj offlineMode
- [ ] Provjeri app veličinu
- [ ] Testiraj accessibility
- [ ] Provjeri security rules
- [ ] Update verzije u app.json

## Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules
npm install
expo cache clear
```

### "Metro error"
```bash
npm start -- --reset-cache
```

### "Build greške"
```bash
eas build --platform android --local
# ili
eas build --platform ios --local
```

## Kontakti za Help

- Firebase: https://firebase.google.com/support
- Expo: https://expo.dev/help
- React Native: https://reactnative.dev/help
