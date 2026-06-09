// setupTests.ts
// Jest setup datoteka

import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock Firebase
jest.mock('@services/firebase', () => ({
  auth: {},
  firestore: {},
  app: {},
}));

// Mock notifikacije
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
}));

// Suppress console warnings u testovima
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ViewPropTypes') ||
        args[0].includes('Non-serializable') ||
        args[0].includes('Animated'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
