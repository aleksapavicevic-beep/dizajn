// src/services/authService.ts
// Autentifikacija servis sa Firebase-om

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}

/**
 * Registracija novog korisnika
 */
export async function registerUser(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Registracija nije uspjela',
    };
  }
}

/**
 * Login korisnika
 */
export async function loginUser(credentials: AuthCredentials): Promise<AuthResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Login nije uspio',
    };
  }
}

/**
 * Logout korisnika
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Logout nije uspio',
    };
  }
}

/**
 * Praćenje auth stanja
 */
export function onAuthChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Dobijanje trenutnog korisnika
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
