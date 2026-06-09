// src/services/firestoreService.ts
// Firestore CRUD operacije

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { firestore } from './firebase';
import type { DailyRoutineItem, Reminder, FamilyMember, PatientProfile } from '@types/index';

/**
 * Dobijanje dokumenta po ID-u
 */
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(firestore, collectionName, docId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? (snapshot.data() as T) : null;
  } catch (error) {
    console.error(`Greška pri dohvatanju ${collectionName}:`, error);
    return null;
  }
}

/**
 * Dodavanje dokumenta
 */
export async function addDocument<T>(
  collectionName: string,
  docId: string,
  data: T
): Promise<boolean> {
  try {
    await setDoc(doc(firestore, collectionName, docId), data);
    return true;
  } catch (error) {
    console.error(`Greška pri dodavanju u ${collectionName}:`, error);
    return false;
  }
}

/**
 * Ažuriranje dokumenta
 */
export async function updateDocument<T>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<boolean> {
  try {
    await updateDoc(doc(firestore, collectionName, docId), data as any);
    return true;
  } catch (error) {
    console.error(`Greška pri ažuriranju ${collectionName}:`, error);
    return false;
  }
}

/**
 * Brisanje dokumenta
 */
export async function deleteDocument(collectionName: string, docId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(firestore, collectionName, docId));
    return true;
  } catch (error) {
    console.error(`Greška pri brisanju iz ${collectionName}:`, error);
    return false;
  }
}

/**
 * Dohvatanje nekoliko dokumenata sa filter-om
 */
export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<T[]> {
  try {
    const q = query(collection(firestore, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as T);
  } catch (error) {
    console.error(`Greška pri dohvatanju ${collectionName}:`, error);
    return [];
  }
}

/**
 * Real-time praćenje dokumenata
 */
export function onDocumentsChanged<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (docs: T[]) => void
) {
  const q = query(collection(firestore, collectionName), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((doc) => doc.data() as T);
    callback(docs);
  });
}

/**
 * Specifični servisi za kolekcije
 */

// Daily Routine
export async function getDailyRoutine(userId: string): Promise<DailyRoutineItem[]> {
  return getDocuments<DailyRoutineItem>('routines', [where('userId', '==', userId)]);
}

export async function updateRoutineItem(
  userId: string,
  itemId: string,
  completed: boolean
): Promise<boolean> {
  return updateDocument('routines', itemId, { completed, completedAt: new Date() });
}

// Reminders
export async function getReminders(userId: string): Promise<Reminder[]> {
  return getDocuments<Reminder>('reminders', [where('userId', '==', userId)]);
}

export function onRemindersChanged(userId: string, callback: (reminders: Reminder[]) => void) {
  return onDocumentsChanged<Reminder>('reminders', [where('userId', '==', userId)], callback);
}

// Family Members
export async function getFamilyMembers(userId: string): Promise<FamilyMember[]> {
  return getDocuments<FamilyMember>('familyMembers', [where('userId', '==', userId)]);
}

// Patient Profile
export async function getPatientProfile(userId: string) {
  return getDocument('patientProfiles', userId);
}

export async function updatePatientProfile(userId: string, data: any) {
  return updateDocument('patientProfiles', userId, data);
}
