// src/screens/EmergencyScreen.tsx
// SOS pomoć screen sa velikim crvenim dugmom

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '@constants/colors';
import { MOCK_EMERGENCY_CONTACTS } from '@constants/mockData';

interface EmergencyScreenProps {
  navigation?: any;
}

/**
 * Emergency SOS Screen
 * - Veliki crveni SOS button
 * - Emergency kontakti
 * - SMS notifikacije
 */
export function EmergencyScreen({ navigation }: EmergencyScreenProps) {
  const handleSOSPress = () => {
    // Pozovi primarni emergency kontakt
    const primaryContact = MOCK_EMERGENCY_CONTACTS.find((c) => c.isPrimary);
    if (primaryContact && primaryContact.phone) {
      Alert.alert(
        'SOS - Poziv pomoći',
        `Pozivam ${primaryContact.name}...`,
        [
          {
            text: 'Otkaži',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Pozovi',
            onPress: () => {
              Linking.openURL(`tel:${primaryContact.phone}`);
            },
          },
        ]
      );
    }
  };

  const handleContactPress = (contact: typeof MOCK_EMERGENCY_CONTACTS[0]) => {
    Alert.alert(
      'Kontaktiraj pomoć',
      `Pozivam ${contact.name}...`,
      [
        {
          text: 'Otkanji',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Pozovi',
          onPress: () => {
            if (contact.phone) {
              Linking.openURL(`tel:${contact.phone}`);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* SOS Button - VELIKI */}
        <View style={styles.sosButtonContainer}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleSOSPress}
            accessible
            accessibilityRole="button"
            accessibilityLabel="SOS - Poziv pomoći"
            accessibilityHint="Dodirnite za poziv hitne pomoći"
          >
            <Text style={styles.sosIcon}>🆘</Text>
            <Text style={styles.sosText}>Trebam pomoć!</Text>
          </TouchableOpacity>
        </View>

        {/* Upustva */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            Ako trebate pomoć, dodirnite veliko crveno dugme
          </Text>
        </View>

        {/* Emergency Kontakti */}
        <View style={styles.contactsSection}>
          <Text style={styles.contactsTitle}>Važni kontakti</Text>
          <View style={styles.contactsList}>
            {MOCK_EMERGENCY_CONTACTS.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => handleContactPress(contact)}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`${contact.name} - ${contact.phone}`}
              >
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <Text style={styles.contactArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            💡 Vaši bliski su obavijesteni o vašem stanju
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'space-between',
    paddingVertical: Spacing['2xl'],
  },
  sosButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing['2xl'],
  },
  sosButton: {
    width: Math.min(screenHeight * 0.35, 200),
    height: Math.min(screenHeight * 0.35, 200),
    borderRadius: Math.min(screenHeight * 0.35, 200) / 2,
    backgroundColor: Colors.emergency,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.emergency,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  sosIcon: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  sosText: {
    ...Typography.h2,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: Colors.emergencyLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginVertical: Spacing.xl,
  },
  instructionText: {
    ...Typography.body1,
    color: Colors.emergency,
    fontWeight: '600',
    textAlign: 'center',
  },
  contactsSection: {
    marginTop: Spacing.xl,
  },
  contactsTitle: {
    ...Typography.h3,
    color: Colors.gray900,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  contactsList: {
    gap: Spacing.md,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    minHeight: TouchTargets.large,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...Typography.body1,
    color: Colors.gray900,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  contactPhone: {
    ...Typography.body2,
    color: Colors.gray600,
  },
  contactArrow: {
    fontSize: 20,
    color: Colors.primary,
  },
  infoSection: {
    backgroundColor: Colors.primaryXLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  infoText: {
    ...Typography.body1,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
