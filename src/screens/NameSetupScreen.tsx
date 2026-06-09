// src/screens/NameSetupScreen.tsx
// Ekran za postavljanje imena pri prvom pokretanju

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '@context/AuthContext';
import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '@constants/colors';

interface NameSetupScreenProps {
  onAdminPress: () => void;
}

export function NameSetupScreen({ onAdminPress }: NameSetupScreenProps) {
  const [name, setName] = useState('');
  const { setupName } = useAuth();

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert('', 'Unesite vaše ime da biste nastavili.');
      return;
    }
    await setupName(name.trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.main}>
          {/* Logo */}
          <Text style={styles.logo}>🧠</Text>

          <Text style={styles.title} accessibilityRole="header">
            Dobrodošli!
          </Text>
          <Text style={styles.subtitle}>Kako se zovete?</Text>

          {/* Unos imena */}
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Vaše ime..."
            placeholderTextColor={Colors.gray400}
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            accessibilityLabel="Unesite vaše ime"
          />

          {/* Dugme nastavi */}
          <TouchableOpacity
            style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled]}
            onPress={handleContinue}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Nastavi"
          >
            <Text style={styles.continueButtonText}>Nastavi  →</Text>
          </TouchableOpacity>
        </View>

        {/* Admin link - diskretan, sasvim dole */}
        <TouchableOpacity
          style={styles.adminLink}
          onPress={onAdminPress}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Admin pristup"
        >
          <Text style={styles.adminLinkText}>🔑  Admin pristup</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: Spacing['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: Spacing['3xl'],
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.h3,
    color: Colors.gray700,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  nameInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.xl,
    fontSize: 24,
    color: Colors.gray900,
    textAlign: 'center',
    backgroundColor: Colors.gray50,
    marginBottom: Spacing['2xl'],
    minHeight: TouchTargets.xlarge,
  },
  continueButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    minHeight: TouchTargets.xlarge,
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  continueButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  adminLink: {
    paddingVertical: Spacing['2xl'],
    alignItems: 'center',
  },
  adminLinkText: {
    ...Typography.body3,
    color: Colors.gray400,
  },
});
