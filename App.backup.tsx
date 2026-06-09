// App.tsx
// Glavna app komponenta sa svim provajderima

import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@context/AuthContext';
import { RootNavigator } from '@navigation/index';
import { initializePushNotifications } from '@services/notificationService';

// Hide specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'Non-serializable values',
]);

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

/**
 * Root App komponenta
 * - Auth context provider
 * - Navigation
 * - Push notifications inicijalizacija
 * - Font loading
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Inicijalizacija push notifikacija
        await initializePushNotifications();

        if (isMounted && fontsLoaded) {
          // Sakrij splash screen nakon što su svi resursi učitani
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Greška pri inicijalizaciji app-a:', error);
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
