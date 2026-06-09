// src/hooks/useTimeGreeting.ts
// Custom hook za dobijanje odgovarajuće poruke na osnovu vremena

import { useState, useEffect } from 'react';
import { GREETING_MESSAGES } from '@constants/mockData';

export interface TimeGreeting {
  greeting: string;
  displayName: string;
  currentHour: number;
}

/**
 * Hook koji vraća odgovarajuću poruku na osnovu vremena dana
 */
export function useTimeGreeting(displayName: string = 'Marija'): TimeGreeting {
  const [greeting, setGreeting] = useState('');
  const [hour, setHour] = useState(0);

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const currentHour = now.getHours();
      setHour(currentHour);

      let greetingMessage = GREETING_MESSAGES.afternoon;

      if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = GREETING_MESSAGES.morning;
      } else if (currentHour >= 12 && currentHour < 17) {
        greetingMessage = GREETING_MESSAGES.afternoon;
      } else if (currentHour >= 17 && currentHour < 21) {
        greetingMessage = GREETING_MESSAGES.evening;
      } else {
        greetingMessage = GREETING_MESSAGES.night;
      }

      setGreeting(greetingMessage);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update svakih 60 sekundi

    return () => clearInterval(interval);
  }, []);

  return {
    greeting,
    displayName,
    currentHour: hour,
  };
}
