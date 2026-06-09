// src/screens/DailyRoutineScreen.tsx
// Prikaz dnevnih aktivnosti sa checkbox-ima

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
} from 'react-native';
import { ActivityCard, LoadingSpinner } from '@components/index';
import { Colors, Spacing, Typography } from '@constants/colors';
import { MOCK_DAILY_ROUTINE } from '@constants/mockData';
import type { DailyRoutineItem } from '@types/index';

interface DailyRoutineScreenProps {
  navigation?: any;
}

/**
 * Daily Routine Screen
 * - Lista dnevnih aktivnosti
 * - Checkbox za completed state
 * - Progress tracking
 * - Local persistence
 */
export function DailyRoutineScreen({ navigation }: DailyRoutineScreenProps) {
  const [activities, setActivities] = useState<DailyRoutineItem[]>(MOCK_DAILY_ROUTINE);
  const [loading, setLoading] = useState(false);

  // Simulacija dohvatanja podataka
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setActivities(MOCK_DAILY_ROUTINE);
      setLoading(false);
    }, 500);
  }, []);

  const handleToggleActivity = (activityId: string) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const completionPercentage = Math.round((completedCount / activities.length) * 100);

  const renderActivity = ({ item }: { item: DailyRoutineItem }) => (
    <ActivityCard
      icon={item.icon}
      title={item.title}
      description={item.description}
      time={item.time}
      completed={item.completed}
      onToggle={() => handleToggleActivity(item.id)}
    />
  );

  const renderHeader = () => (
    <>
      <Text
        style={styles.title}
        accessible
        accessibilityRole="header"
      >
        Moj dan
      </Text>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Napredak</Text>
          <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${completionPercentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedCount} od {activities.length} završeno
        </Text>
      </View>
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
  progressSection: {
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing['2xl'],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressLabel: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.gray900,
  },
  progressPercentage: {
    ...Typography.h3,
    color: Colors.success,
    fontWeight: '700',
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.gray300,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
  },
  progressText: {
    ...Typography.body3,
    color: Colors.gray600,
  },
});
