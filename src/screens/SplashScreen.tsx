// src/screens/SplashScreen.tsx
// Splash screen sa logom i "Započnite" dugmom

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Button } from '@components/Button';
import { Colors, Spacing, Typography, BorderRadius } from '@constants/colors';

interface SplashScreenProps {
  navigation?: any;
  onStart?: () => void;
}

/**
 * Splash Screen
 * - Logo sa mozgom
 * - Naziv aplikacije
 * - Subtitle
 * - "Započnite" dugme
 */
export function SplashScreen({ navigation, onStart }: SplashScreenProps) {
  const handleStart = () => {
    if (onStart) {
      onStart();
    } else if (navigation?.navigate) {
      navigation.navigate('Auth');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo sa mozgom */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🧠</Text>
        </View>

        {/* Naziv */}
        <Text
          style={styles.title}
          accessible
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
        >
          Dementia-Friendly
        </Text>
        <Text
          style={styles.titleSecond}
          accessible
          accessibilityRole="header"
        >
          Daily Companion
        </Text>

        {/* Subtitle */}
        <Text
          style={styles.subtitle}
          accessible
          accessibilityRole="text"
        >
          Vaš digitalni pomoćnik za svakodnevni život
        </Text>

        {/* Features preview */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📝</Text>
            <Text style={styles.featureText}>Dnevni podsjetnici</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>👨‍👩‍👧</Text>
            <Text style={styles.featureText}>Povezana porodica</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🆘</Text>
            <Text style={styles.featureText}>SOS pomoć</Text>
          </View>
        </View>
      </View>

      {/* Start button */}
      <View style={styles.buttonContainer}>
        <Button
          label="Započnite"
          onPress={handleStart}
          size="xlarge"
          variant="primary"
          icon="👉"
          accessibilityLabel="Započnite aplikaciju"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing['3xl'],
  },
  logo: {
    fontSize: 80,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  titleSecond: {
    ...Typography.h1,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  subtitle: {
    ...Typography.h4,
    color: Colors.gray700,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  features: {
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: Spacing.lg,
  },
  featureText: {
    ...Typography.body1,
    color: Colors.gray900,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['2xl'],
  },
});
