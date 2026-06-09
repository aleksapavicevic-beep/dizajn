// src/utils/asyncStorage.ts
// Utility funkcije za local storage

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Čuvaj podatke u local storage
 */
export async function setStorageData(key: string, value: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Greška pri čuvanju ${key}:`, error);
  }
}

/**
 * Dohvati podatke iz local storage
 */
export async function getStorageData<T>(key: string, defaultValue?: T): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : defaultValue || null;
  } catch (error) {
    console.error(`Greška pri dohvatanju ${key}:`, error);
    return defaultValue || null;
  }
}

/**
 * Obriši podatke iz local storage
 */
export async function removeStorageData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Greška pri brisanju ${key}:`, error);
  }
}

/**
 * Obriši sve podatke iz local storage
 */
export async function clearAllStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Greška pri čišćenju storage-a:', error);
  }
}

// Ključevi za local storage
export const STORAGE_KEYS = {
  USER: '@user',
  ACTIVITIES: '@activities',
  REMINDERS: '@reminders',
  PREFERENCES: '@preferences',
};
