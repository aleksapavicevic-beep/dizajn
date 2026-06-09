// src/components/ActivityCard.tsx
// Komponenta za prikaz dnevnih aktivnosti sa checkbox-om

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { Card } from './Card';
import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '@constants/colors';

interface ActivityCardProps {
  icon: string;
  title: string;
  description: string;
  time?: string;
  completed: boolean;
  onToggle: () => void;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Aktivnost komponenta
 * - Velika ikona
 * - Clear title i description
 * - Checkbox za completed state
 * - Dementia-friendly
 */
export function ActivityCard({
  icon,
  title,
  description,
  time,
  completed,
  onToggle,
  onPress,
  style,
}: ActivityCardProps) {
  return (
    <Card
      onPress={onPress}
      variant="default"
      gradient={!completed}
      style={[styles.card, style]}
      disabled={completed}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {time && <Text style={styles.time}>{time}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.checkbox, completed && styles.checkboxCompleted]}
          onPress={onToggle}
          accessible
          accessibilityRole="checkbox"
          accessibilityChecked={completed}
          accessibilityLabel={`${title} - ${completed ? 'Završeno' : 'Nije završeno'}`}
          accessibilityHint="Dodirnite da označite kao završeno"
        >
          {completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: TouchTargets.large,
  },
  iconContainer: {
    marginRight: Spacing.lg,
  },
  icon: {
    fontSize: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h4,
    color: Colors.gray900,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body2,
    color: Colors.gray600,
    marginBottom: Spacing.sm,
  },
  time: {
    ...Typography.body3,
    color: Colors.primary,
    fontWeight: '600',
  },
  checkbox: {
    width: TouchTargets.medium,
    height: TouchTargets.medium,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  checkboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
