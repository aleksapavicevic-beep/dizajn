// src/screens/RemindersScreen.tsx
// Prikaz podsjetnika sa vremenom i voice playback

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  SectionList,
} from 'react-native';
import { ReminderCard, LoadingSpinner } from '@components/index';
import { Colors, Spacing, Typography } from '@constants/colors';
import { MOCK_REMINDERS } from '@constants/mockData';
import type { Reminder } from '@types/index';

interface RemindersScreenProps {
  navigation?: any;
}

interface ReminderSection {
  title: string;
  data: Reminder[];
}

/**
 * Reminders Screen
 * - Podsjetnici po vremenu
 * - Voice playback
 * - Notification scheduling
 */
export function RemindersScreen({ navigation }: RemindersScreenProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setReminders(MOCK_REMINDERS);
      setLoading(false);
    }, 500);
  }, []);

  const groupRemindersByTime = (): ReminderSection[] => {
    const grouped = reminders.reduce((acc, reminder) => {
      const hour = parseInt(reminder.time.split(':')[0], 10);
      let period = 'Jutro';

      if (hour >= 12 && hour < 17) {
        period = 'Popodne';
      } else if (hour >= 17 && hour < 21) {
        period = 'Večer';
      } else if (hour >= 21) {
        period = 'Noć';
      }

      const existing = acc.find((s) => s.title === period);
      if (existing) {
        existing.data.push(reminder);
      } else {
        acc.push({ title: period, data: [reminder] });
      }

      return acc;
    }, [] as ReminderSection[]);

    return grouped.sort((a, b) => {
      const order = { Jutro: 0, Popodne: 1, Večer: 2, Noć: 3 };
      return (order[a.title as keyof typeof order] || 0) - (order[b.title as keyof typeof order] || 0);
    });
  };

  const handleAddReminder = () => {
    if (navigation?.navigate) {
      navigation.navigate('AddReminder');
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <ReminderCard reminder={item} />
  );

  const renderSectionHeader = ({ section }: { section: ReminderSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (reminders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>Nema podsjetnika</Text>
          <Text style={styles.emptySubtitle}>
            Kreiraj prvi podsjetnik da bude upozoren
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={groupRemindersByTime()}
        keyExtractor={(item) => item.id}
        renderItem={renderReminder}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text
            style={styles.title}
            accessible
            accessibilityRole="header"
          >
            Podsjetnici
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['2xl'],
  },
  title: {
    ...Typography.h2,
    color: Colors.gray900,
    fontWeight: '700',
    marginBottom: Spacing['2xl'],
  },
  sectionHeader: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: Colors.primaryXLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.gray900,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body1,
    color: Colors.gray600,
    textAlign: 'center',
  },
});
