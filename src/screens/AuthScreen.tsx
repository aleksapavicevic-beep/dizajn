// src/screens/AuthScreen.tsx
// Login i Registration screen

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Input, Button, LoadingSpinner } from '@components/index';
import { Colors, Spacing, Typography } from '@constants/colors';
import { useAuth } from '@context/AuthContext';

interface AuthScreenProps {
  navigation?: any;
}

type AuthMode = 'login' | 'register';

/**
 * Auth Screen
 * - Login i Registration
 * - Firebase integration
 * - Role selection (patient/caregiver)
 */
export function AuthScreen({ navigation }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, isLoading } = useAuth();

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    };

    if (!email.includes('@')) {
      newErrors.email = 'Unesite validnu email adresu';
    }

    if (password.length < 6) {
      newErrors.password = 'Lozinka mora imati najmanje 6 karaktera';
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Lozinke se ne podudaraju';
      }
      if (!displayName.trim()) {
        newErrors.displayName = 'Unesite svoje ime';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login({ email, password });
      // Navigacija će biti automatska kroz AuthContext
    } catch (error) {
      Alert.alert('Greška', 'Login nije uspio. Provjerite email i lozinku.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({ email, password });
      // Navigacija će biti automatska kroz AuthContext
    } catch (error) {
      Alert.alert('Greška', 'Registracija nije uspjela. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🧠</Text>
          <Text style={styles.appName}>Dementia Companion</Text>
        </View>

        {/* Mode Tabs */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}
            onPress={() => setMode('login')}
            accessible
            accessibilityRole="tab"
            accessibilitySelected={mode === 'login'}
          >
            <Text
              style={[
                styles.modeTabText,
                mode === 'login' && styles.modeTabTextActive,
              ]}
            >
              Prijava
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, mode === 'register' && styles.modeTabActive]}
            onPress={() => setMode('register')}
            accessible
            accessibilityRole="tab"
            accessibilitySelected={mode === 'register'}
          >
            <Text
              style={[
                styles.modeTabText,
                mode === 'register' && styles.modeTabTextActive,
              ]}
            >
              Registracija
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'register' && (
            <Input
              label="Vaše ime"
              placeholder="Unesite vaše ime"
              value={displayName}
              onChangeText={setDisplayName}
              error={errors.displayName}
              icon="👤"
            />
          )}

          <Input
            label="Email adresa"
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon="✉️"
          />

          <Input
            label="Lozinka"
            placeholder="Najmanje 6 karaktera"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            icon="🔐"
          />

          {mode === 'register' && (
            <Input
              label="Potvrdite lozinku"
              placeholder="Ponovi lozinku"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={errors.confirmPassword}
              icon="🔐"
            />
          )}

          {/* Submit Button */}
          <Button
            label={mode === 'login' ? 'Prijavite se' : 'Registrujte se'}
            onPress={mode === 'login' ? handleLogin : handleRegister}
            size="large"
            variant="primary"
            loading={loading}
            accessibilityLabel={mode === 'login' ? 'Prijavite se' : 'Registrujte se'}
          />

          {/* Demo Hint */}
          <View style={styles.demoHint}>
            <Text style={styles.demoText}>
              💡 Za test: koristite bilo koji email sa demo@example.com parolom: demo123456
            </Text>
          </View>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
    marginTop: Spacing['2xl'],
  },
  logo: {
    fontSize: 60,
    marginBottom: Spacing.md,
  },
  appName: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: '700',
  },
  modeTabs: {
    flexDirection: 'row',
    marginBottom: Spacing['2xl'],
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray200,
  },
  modeTab: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  modeTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  modeTabText: {
    ...Typography.body1,
    color: Colors.gray600,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: Colors.primary,
  },
  form: {
    marginBottom: Spacing['2xl'],
  },
  demoHint: {
    backgroundColor: Colors.infoLight,
    borderRadius: 12,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  demoText: {
    ...Typography.body2,
    color: Colors.info,
    textAlign: 'center',
  },
});
