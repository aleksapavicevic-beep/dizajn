// API_DOCUMENTATION.md
// API dokumentacija za servise

## Firebase Services

### Authentication Service

```typescript
// Login
await authService.loginUser({
  email: 'user@example.com',
  password: 'password123'
});

// Registration
await authService.registerUser({
  email: 'user@example.com',
  password: 'password123'
});

// Logout
await authService.signOut();

// Get current user
const user = authService.getCurrentUser();

// Watch auth changes
authService.onAuthChanged((user) => {
  if (user) {
    console.log('User logged in:', user.uid);
  }
});
```

### Firestore Service

```typescript
// Get document
const user = await firestoreService.getDocument('users', 'user123');

// Add document
await firestoreService.addDocument('users', 'user123', userData);

// Update document
await firestoreService.updateDocument('users', 'user123', { name: 'New Name' });

// Delete document
await firestoreService.deleteDocument('users', 'user123');

// Get multiple documents
const users = await firestoreService.getDocuments('users', [
  where('role', '==', 'patient')
]);

// Real-time listener
const unsubscribe = firestoreService.onDocumentsChanged('routines', 
  [where('userId', '==', 'user123')],
  (routines) => {
    console.log('Routines updated:', routines);
  }
);

// Stop listening
unsubscribe();
```

### Notification Service

```typescript
// Initialize
const token = await notificationService.initializePushNotifications();

// Send local notification
await notificationService.sendLocalNotification(
  'Reminder',
  'Time to take your medication',
  5 // trigger after 5 seconds
);

// Schedule at specific time
await notificationService.scheduleTimeNotification(
  'Good morning!',
  'Time to wake up',
  '08:00',
  true // repeat daily
);

// Cancel all
await notificationService.cancelAllNotifications();

// Cancel specific
await notificationService.cancelNotification(notificationId);
```

## Context Hooks

### useAuth Hook

```typescript
const {
  user,           // Current user object
  isLoading,      // Loading state
  error,          // Error message
  login,          // Login function
  register,       // Register function
  logout,         // Logout function
  initialize      // Initialize auth
} = useAuth();

// Usage
const handleLogin = async () => {
  try {
    await login({ email, password });
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### useTimeGreeting Hook

```typescript
const {
  greeting,      // Current greeting (e.g., "Dobro jutro")
  displayName,   // User's display name
  currentHour    // Current hour
} = useTimeGreeting('Marija');
```

### useDateFormatter Hook

```typescript
const {
  day,          // Day name (e.g., "Ponedjeljak")
  date,         // Date (e.g., "5. Siječanj")
  fullDate,     // Full date (e.g., "Ponedjeljak, 5. Siječanj 2024")
  time          // Current time (e.g., "14:30")
} = useDateFormatter();
```

## Utility Functions

### Text to Speech

```typescript
import { speakText, speakReminder, speakActivity } from '@utils/textToSpeech';

// Basic speech
await speakText('Hello world', 'hr-HR');

// Reminder speech
await speakReminder('Time to take medication');

// Activity speech
await speakActivity('Breakfast', 'Eat a healthy breakfast');

// Stop speech
import { stopSpeech } from '@utils/textToSpeech';
await stopSpeech();
```

### Async Storage

```typescript
import { 
  setStorageData, 
  getStorageData, 
  removeStorageData 
} from '@utils/asyncStorage';

// Save data
await setStorageData('key', { data: 'value' });

// Get data
const data = await getStorageData('key');

// Delete data
await removeStorageData('key');

// Clear all
import { clearAllStorage } from '@utils/asyncStorage';
await clearAllStorage();
```

## Component Props

### Button

```typescript
interface ButtonProps {
  label: string;                    // Button text
  onPress: () => void;              // Click handler
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;               // Disable button
  loading?: boolean;                // Show spinner
  icon?: string;                    // Emoji or icon
  accessibilityLabel?: string;      // For screen readers
  style?: ViewStyle;                // Custom styles
}
```

### Card

```typescript
interface CardProps {
  children: React.ReactNode;        // Content
  onPress?: () => void;             // Click handler
  variant?: 'default' | 'primary' | 'emergency';
  style?: ViewStyle;
  gradient?: boolean;               // Enable gradient
  disabled?: boolean;               // Disable card
}
```

### Input

```typescript
interface InputProps extends TextInputProps {
  label?: string;                   // Label text
  error?: string;                   // Error message
  containerStyle?: ViewStyle;       // Container style
  icon?: string;                    // Emoji or icon
}
```

### ActivityCard

```typescript
interface ActivityCardProps {
  icon: string;                     // Activity emoji
  title: string;                    // Activity title
  description: string;              // Short description
  time?: string;                    // Time (HH:MM)
  completed: boolean;               // Completion state
  onToggle: () => void;             // Toggle handler
  onPress?: () => void;             // Click handler
  style?: ViewStyle;
}
```

### ReminderCard

```typescript
interface ReminderCardProps {
  reminder: Reminder;               // Reminder object
  onPress?: () => void;             // Click handler
  style?: ViewStyle;
}
```

---

## Error Handling

```typescript
// Firebase errors
try {
  await authService.loginUser(credentials);
} catch (error: any) {
  if (error.code === 'auth/user-not-found') {
    console.error('User not found');
  } else if (error.code === 'auth/wrong-password') {
    console.error('Wrong password');
  }
}

// Firestore errors
try {
  await firestoreService.getDocument('collection', 'doc');
} catch (error: any) {
  if (error.code === 'permission-denied') {
    console.error('Permission denied');
  }
}

// Notification errors
try {
  await notificationService.sendLocalNotification('Title', 'Body');
} catch (error) {
  console.error('Notification failed:', error);
}
```

## Best Practices

1. **Always use try-catch** za async operacije
2. **Handle loading state** prije nego prikažeš podatke
3. **Validate input** prije slanja na Firebase
4. **Use constants** za collection names
5. **Optimize queries** sa where clauses
6. **Unsubscribe** od real-time listeners
7. **Cache rezultate** gdje je moguće
