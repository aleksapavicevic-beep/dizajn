// ACCESSIBILITY_GUIDE.md
// Dementia-friendly accessibility vodič

## Principi

### 1. Jednostavnost
- Max 3-4 akcije po ekranu
- Jasne, jednostavne naslove
- Bez skrivenih mogućnosti
- Jednostavna navigacija

### 2. Vidljivost
- Veliki tekst (min 24px za naslove)
- Visok kontrast (4.5:1 minimum)
- Jasne ikone sa emojijima
- Bez sitnog teksta

### 3. Čitljivost
- Kratke, jednostavne rečenice
- Max 8-10 reči po rečenici
- Jasniji jezik, bez žargona
- Ponavljanje ključnih informacija

### 4. Praktičnost
- Velike touch targets (56x56px+)
- Lagani animacije
- Jasan feedback
- Jednostavna akcija za glavne opcije

## Implementacija

### Tekst

```typescript
// ✅ Dobro
<Text style={{ fontSize: 24, fontWeight: '600' }}>
  Dobro jutro, Marija
</Text>

// ❌ Loše
<Text style={{ fontSize: 12 }}>
  Korisnikovo svedenjeaktualizovano
</Text>
```

### Touch Targets

```typescript
// ✅ Dobro - min 56px
<TouchableOpacity style={{ 
  minHeight: 56, 
  minWidth: 56,
  padding: 16 
}}>
  <Text>Klikni</Text>
</TouchableOpacity>

// ❌ Loše - premalo
<TouchableOpacity style={{ height: 30 }}>
  <Text>Klikni</Text>
</TouchableOpacity>
```

### Boje

```typescript
// ✅ Dobro - visok kontrast
backgroundColor: Colors.primary,      // #3B82F6
color: Colors.white,                  // #FFFFFF

// ❌ Loše - nizak kontrast
backgroundColor: Colors.primaryXLight,  // #DBEAFE
color: Colors.gray500,                  // #6B7280
```

### Navigacija

```typescript
// ✅ Dobro - minimalna navigacija
Bottom Tabs: Home, Reminders, Family, Profile

// ❌ Loše - previše opcija
Drawer: Home, Reminders, Family, Profile, Settings, 
        Help, About, Feedback, Logout
```

### Ikone

```typescript
// ✅ Dobro - jasne emoji ikone
🏠 Home
🔔 Reminders
👨‍👩‍👧 Family
🆘 Emergency

// ❌ Loše - apstraktne ikone
[Abstract icon] Home
[Abstract icon] Reminders
```

## Accessibility Checklist

### Za svaku komponentu

- [ ] Tekst je najmanje 18px
- [ ] Touch target je najmanje 56x56px
- [ ] Color contrast je 4.5:1+
- [ ] Label je jasna i jednostavna
- [ ] Nema skrivenih akcija
- [ ] Navigation je logična
- [ ] Voice support je testiran
- [ ] Animacije su lagane
- [ ] No flickering (2Hz+)

### Za svaki ekran

- [ ] Max 3-4 glavne akcije
- [ ] Clear heading
- [ ] Logical flow
- [ ] Back button (ako je potreban)
- [ ] No infinite scroll
- [ ] Clear empty states
- [ ] Error messages su jasne
- [ ] Loading state je vidljiv

## WCAG 2.1 Level AA Compliance

### Perceivable (Vidljivo)
- [x] Text contrast 4.5:1
- [x] Text size min 18px
- [x] Images have alt text
- [x] Color is not sole differentiator

### Operable (Upravaljivo)
- [x] Keyboard navigable
- [x] Touch targets 56x56px+
- [x] No flashing (2Hz+)
- [x] Skip links (ako je potrebno)

### Understandable (Razumljivo)
- [x] Simple language
- [x] Clear labeling
- [x] Predictable navigation
- [x] Error prevention

### Robust (Čvrsto)
- [x] Valid HTML
- [x] Accessible attributes
- [x] Screen reader support
- [x] Mobile friendly

## Testing

### Manual Testing

1. Testiraj sa prigušenim ekranom
2. Testiraj sa većim tekstom
3. Testiraj sa ekranskim čitačem
4. Testiraj navigaciju sa samo dve ruke
5. Testiraj na različitim veličinama ekrana

### Automated Testing

```typescript
// Test accessibility
import { render, screen } from '@testing-library/react-native';

test('Button is accessible', () => {
  render(<Button label="Click me" onPress={() => {}} />);
  
  const button = screen.getByRole('button');
  expect(button).toHaveAccessibilityLabel('Click me');
});
```

### Screen Reader Testing

- iOS: VoiceOver
- Android: TalkBack

## Common Mistakes

❌ Previše informacija
❌ Premalo kontrasta
❌ Premale touch targets
❌ Kompleksna navigacija
❌ Brze animacije
❌ Skriveni elementi
❌ Nejasan tekst
❌ Bez alt teksta
❌ Bez labela
❌ Color only differentiator

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Dementia-Friendly Design](https://www.dementia.org.uk/)
- [Apple Accessibility](https://www.apple.com/accessibility/)
- [Google Accessibility](https://www.google.com/accessibility/)
