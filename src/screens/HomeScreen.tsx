// src/screens/HomeScreen.tsx
// Home screen sa glavnim kartama i navigacijom

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Header, Card, Button } from '@components/index';
import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '@constants/colors';
import { useDateFormatter } from '@hooks/useDateFormatter';
import { useAuth } from '@context/AuthContext';

interface HomeScreenProps {
  navigation?: any;
}

interface MenuCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  screen: string;
}

const MENU_CARDS: MenuCard[] = [
  {
    id: '1',
    icon: '📅',
    title: 'Moj dan',
    description: 'Pogledaj dnevne aktivnosti',
    screen: 'DailyRoutine',
  },
  {
    id: '2',
    icon: '🔔',
    title: 'Podsjetnici',
    description: 'Važni podsjetnici',
    screen: 'Reminders',
  },
  {
    id: '3',
    icon: '👨‍👩‍👧',
    title: 'Porodica',
    description: 'Moji bliski',
    screen: 'Family',
  },
  {
    id: '4',
    icon: '👤',
    title: 'Profil',
    description: 'Moji podaci',
    screen: 'Profile',
  },
];

/**
 * Home Screen
 * - Greeting sa vremenom
 * - Glavne kartice za navigaciju
 * - Najvažnije aktivnosti
 */
export function HomeScreen({ navigation }: HomeScreenProps) {
  const dateInfo = useDateFormatter();
  const { userName } = useAuth();
  const [completedToday, setCompletedToday] = useState(2);
  const totalActivities = 5;

  const handleCardPress = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    }
  };

  const renderCard = ({ item }: { item: MenuCard }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item.screen)}
      style={styles.cardWrapper}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${item.title} - ${item.description}`}
    >
      <Card variant="default" gradient>
        <View style={styles.cardContent}>
          <Text style={styles.cardIcon}>{item.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header sa vremenom */}
        <Header showGreeting showDate userName={userName || 'Korisnik'} />

        {/* Progress prikazivač */}
        <Card variant="primary" gradient style={styles.progressCard}>
          <View style={styles.progressContainer}>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{completedToday}</Text>
                <Text style={styles.statLabel}>Završeno</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalActivities}</Text>
                <Text style={styles.statLabel}>Aktivnosti</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(completedToday / totalActivities) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        </Card>

        {/* Glavne kartice */}
        <View style={styles.menuSection}>
          <FlatList
            data={MENU_CARDS}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.emergencySection}>
          <Button
            label="🆘 Trebam pomoć!"
            onPress={() => handleCardPress('Emergency')}
            variant="danger"
            size="large"
            accessibilityLabel="SOS - Trebam pomoć"
          />
        </View>
      </ScrollView>
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
  progressCard: {
    marginBottom: Spacing['2xl'],
  },
  progressContainer: {
    paddingHorizontal: Spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.white,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.body2,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  divider: {
    width: 2,
    height: 40,
    backgroundColor: Colors.white,
    opacity: 0.3,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
  },
  menuSection: {
    marginBottom: Spacing['2xl'],
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  cardWrapper: {
    width: '48%',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h4,
    color: Colors.gray900,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    ...Typography.body3,
    color: Colors.gray600,
    textAlign: 'center',
  },
  emergencySection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
});

// TypeScript fix za Text element
import { Text } from 'react-native';
