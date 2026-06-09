// src/components/ReminderCard.tsx
// Komponenta za prikaz podsjetnika sa voice playback

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Audio } from 'expo-av';
import { Card } from './Card';
import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '@constants/colors';
import type { Reminder } from '@types/index';

interface ReminderCardProps {
  reminder: Reminder;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Podsjetnik komponenta
 * - Vrijeme prominentno prikazano
 * - Voice playback button
 * - Clear title i description
 */
export function ReminderCard({ reminder, onPress, style }: ReminderCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVoicePlayback = async () => {
    try {
      setIsPlaying(true);
      
      // Mock text-to-speech
      // U produkciji bi se koristio expo-speech ili sličan paket
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setIsPlaying(false);
    } catch (error) {
      console.error('Greška pri playback-u:', error);
      setIsPlaying(false);
    }
  };

  return (
    <Card
      onPress={onPress}
      variant="primary"
      gradient
      style={[styles.card, style]}
    >
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{reminder.time}</Text>
          <Text style={styles.repeatPattern}>{getReminderFrequency(reminder.repeatPattern)}</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{reminder.title}</Text>
          <Text style={styles.description}>{reminder.description}</Text>
        </View>

        {reminder.voiceEnabled && (
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={handleVoicePlayback}
            disabled={isPlaying}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`Čitaj: ${reminder.title}`}
            accessibilityHint="Dodirnite da čujete podsjetnik"
          >
            <Text style={styles.voiceIcon}>{isPlaying ? '⏸️' : '🔊'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}

function getReminderFrequency(pattern: string): string {
  const patterns = {
    once: 'Jednom',
    daily: 'Svaki dan',
    weekly: 'Svaki tjedan',
    custom: 'Prilagođeno',
  };
  return patterns[pattern as keyof typeof patterns] || 'Nepoznato';
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TouchTargets.large,
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xl,
    minWidth: 70,
  },
  time: {
    ...Typography.h2,
    color: Colors.white,
    fontWeight: '700',
  },
  repeatPattern: {
    ...Typography.body3,
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    ...Typography.h4,
    color: Colors.white,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body2,
    color: Colors.white,
  },
  voiceButton: {
    width: TouchTargets.medium,
    height: TouchTargets.medium,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  voiceIcon: {
    fontSize: 24,
  },
});
