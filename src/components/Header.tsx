// src/components/Header.tsx
// Reusable header sa vremenom i pozdravom

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@constants/colors';
import { useDateFormatter } from '@hooks/useDateFormatter';
import { useTimeGreeting } from '@hooks/useTimeGreeting';

interface HeaderProps {
  showGreeting?: boolean;
  userName?: string;
  showDate?: boolean;
}

/**
 * Header komponenta sa vremenom i pozdravom
 */
export function Header({
  showGreeting = true,
  userName = 'Marija',
  showDate = true,
}: HeaderProps) {
  const dateInfo = useDateFormatter();
  const greetingInfo = useTimeGreeting(userName);

  return (
    <View style={styles.container}>
      {showDate && (
        <Text style={styles.time} accessible accessibilityRole="text">
          {dateInfo.time}
        </Text>
      )}

      {showGreeting && (
        <View style={styles.greetingContainer}>
          <Text
            style={styles.greeting}
            accessible
            accessibilityRole="text"
            accessibilityLiveRegion="polite"
          >
            {greetingInfo.greeting}, {greetingInfo.displayName}
          </Text>
          {showDate && (
            <Text style={styles.date} accessible accessibilityRole="text">
              {dateInfo.date}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing['2xl'],
  },
  time: {
    ...Typography.h1,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  greetingContainer: {
    marginTop: Spacing.lg,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.gray900,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  date: {
    ...Typography.body2,
    color: Colors.gray600,
  },
});
