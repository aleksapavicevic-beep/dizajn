// src/services/notificationService.ts
// Expo Notifications servis

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationPayload } from '@types/index';

// Setovanje notification handler-a
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Inicijalizacija push notifikacija
 */
export async function initializePushNotifications(): Promise<string | null> {
  try {
    // Zahtjev za dozvolu
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== 'granted') {
      console.warn('Dozvola za notifikacije nije dobijena');
      return null;
    }

    // Dobijanje push tokena
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    // Konfiguracija Android kanala (obavezno)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    return token;
  } catch (error) {
    console.error('Greška pri inicijalizaciji notifikacija:', error);
    return null;
  }
}

/**
 * Slanje lokalne notifikacije
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  triggerSeconds: number = 5,
  data?: Record<string, any>
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
        vibrate: [0, 500, 250, 500],
      },
      trigger: { seconds: triggerSeconds },
    });
  } catch (error) {
    console.error('Greška pri slanju notifikacije:', error);
  }
}

/**
 * Slanje notifikacije sa specifičnim vremenom
 */
export async function scheduleTimeNotification(
  title: string,
  body: string,
  time: string, // "HH:MM" format
  repeatDaily: boolean = true
): Promise<void> {
  try {
    const [hours, minutes] = time.split(':').map(Number);
    
    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: repeatDaily,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        vibrate: [0, 500, 250, 500],
      },
      trigger: trigger as any,
    });
  } catch (error) {
    console.error('Greška pri planiranju notifikacije:', error);
  }
}

/**
 * Otkazivanje svih notifikacija
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Greška pri otkazivanju notifikacija:', error);
  }
}

/**
 * Otkazivanje specifične notifikacije
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Greška pri otkazivanju notifikacije:', error);
  }
}
