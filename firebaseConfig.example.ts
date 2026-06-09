// firebaseConfig.example.ts
// Primjer Firebase konfiguracije

const firebaseConfig = {
  apiKey: "AIzaSyD_example_key_here",
  authDomain: "dementia-companion.firebaseapp.com",
  projectId: "dementia-companion",
  storageBucket: "dementia-companion.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABC123"
};

// Firestore kolekcije struktura:
// 
// users/
//   └── {uid}
//       ├── email: string
//       ├── displayName: string
//       ├── role: 'patient' | 'caregiver'
//       ├── phone: string (optional)
//       ├── profileImage: string (optional)
//       ├── createdAt: Timestamp
//       └── lastLogin: Timestamp
//
// routines/
//   └── {id}
//       ├── userId: string
//       ├── title: string
//       ├── description: string
//       ├── icon: string
//       ├── time: string (HH:MM)
//       ├── completed: boolean
//       ├── completedAt: Timestamp (optional)
//       └── order: number
//
// reminders/
//   └── {id}
//       ├── userId: string
//       ├── title: string
//       ├── description: string
//       ├── time: string (HH:MM)
//       ├── repeatPattern: 'once' | 'daily' | 'weekly' | 'custom'
//       ├── daysOfWeek: number[] (optional)
//       ├── notificationEnabled: boolean
//       ├── voiceEnabled: boolean
//       ├── voiceText: string (optional)
//       ├── isActive: boolean
//       └── createdAt: Timestamp
//
// familyMembers/
//   └── {id}
//       ├── userId: string
//       ├── name: string
//       ├── relation: string
//       ├── email: string
//       ├── phone: string (optional)
//       ├── profileImage: string (optional)
//       ├── role: 'caregiver' | 'family'
//       └── isActive: boolean
//
// emergencyContacts/
//   └── {id}
//       ├── userId: string
//       ├── name: string
//       ├── phone: string
//       ├── email: string (optional)
//       ├── relation: string
//       └── isPrimary: boolean
//
// patientProfiles/
//   └── {userId}
//       ├── userId: string
//       ├── primaryCaregiverId: string
//       ├── dateOfBirth: string (optional)
//       ├── conditions: string[] (optional)
//       ├── medications: string[] (optional)
//       ├── preferences.textSize: 'normal' | 'large' | 'xlarge'
//       ├── preferences.highContrast: boolean
//       ├── preferences.voiceEnabled: boolean
//       ├── preferences.notificationsEnabled: boolean
//       ├── preferences.darkMode: boolean
//       └── preferences.language: string
//
// activityLogs/
//   └── {id}
//       ├── userId: string
//       ├── activityId: string
//       ├── activityType: 'routine' | 'reminder' | 'call' | 'medication'
//       ├── timestamp: Timestamp
//       ├── completed: boolean
//       └── notes: string (optional)

export default firebaseConfig;
