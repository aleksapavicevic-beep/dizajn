// src/context/AuthContext.tsx
// Lokalni auth kontekst - ime iz AsyncStorage, admin PIN

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Admin lozinka - ovdje promijeni ako trebaš drugu
const ADMIN_PIN = '1234';
const STORAGE_KEY_NAME = '@user_name';

interface AuthContextType {
  userName: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  setupName: (name: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;
  resetUser: () => Promise<void>;
  // Legacy compat za komponente koje koriste user.displayName
  user: { displayName: string; email: string; role: string } | null;
  login: (c: any) => Promise<void>;
  register: (c: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY_NAME)
      .then((saved) => setUserName(saved || null))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const setupName = useCallback(async (name: string) => {
    const trimmed = name.trim();
    await AsyncStorage.setItem(STORAGE_KEY_NAME, trimmed);
    setUserName(trimmed);
  }, []);

  const updateName = useCallback(async (name: string) => {
    const trimmed = name.trim();
    await AsyncStorage.setItem(STORAGE_KEY_NAME, trimmed);
    setUserName(trimmed);
  }, []);

  const adminLogin = useCallback((pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const resetUser = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_NAME);
    setUserName(null);
    setIsAdmin(false);
  }, []);

  const logout = useCallback(async () => {
    setIsAdmin(false);
  }, []);

  const user = userName
    ? { displayName: userName, email: '', role: isAdmin ? 'admin' : 'patient' }
    : null;

  return (
    <AuthContext.Provider
      value={{
        userName,
        isAdmin,
        isLoading,
        setupName,
        updateName,
        adminLogin,
        adminLogout,
        resetUser,
        user,
        logout,
        login: async () => {},
        register: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti korišten unutar AuthProvider-a');
  }
  return context;
}
