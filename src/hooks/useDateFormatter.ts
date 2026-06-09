// src/hooks/useDateFormatter.ts
// Hook za formatiranje datuma

import { useState, useEffect } from 'react';
import { DAYS_OF_WEEK, MONTHS } from '@constants/mockData';

export interface FormattedDate {
  day: string;
  date: string;
  fullDate: string;
  time: string;
}

/**
 * Hook koji vraća formatiranu datumu i vrijeme
 */
export function useDateFormatter(): FormattedDate {
  const [dateInfo, setDateInfo] = useState<FormattedDate>({
    day: '',
    date: '',
    fullDate: '',
    time: '',
  });

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      
      const dayName = DAYS_OF_WEEK[now.getDay()];
      const monthName = MONTHS[now.getMonth()];
      const dateNumber = now.getDate();
      const year = now.getFullYear();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      setDateInfo({
        day: dayName,
        date: `${dateNumber}. ${monthName}`,
        fullDate: `${dayName}, ${dateNumber}. ${monthName} ${year}`,
        time: `${hours}:${minutes}`,
      });
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  return dateInfo;
}
