// src/screens/AdminScreen.tsx
// Admin ekran - PIN prijava i dashboard za upravljanje

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '@context/AuthContext';
import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '@constants/colors';

// ─── PIN Login ekran ─────────────────────────────────────────────────────────

interface AdminLoginScreenProps {
  onBack: () => void;
}

export function AdminLoginScreen({ onBack }: AdminLoginScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();

  const handleLogin = () => {
    if (!pin.trim()) {
      setError('Unesite lozinku.');
      return;
    }
    const success = adminLogin(pin);
    if (!success) {
      setError('Pogrešna lozinka. Pokušajte ponovo.');
      setPin('');
    }
    // Ako je uspješno, navigator automatski prelazi na admin stack
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <View style={loginStyles.content}>
        {/* Back dugme */}
        <TouchableOpacity
          style={loginStyles.backButton}
          onPress={onBack}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Nazad"
        >
          <Text style={loginStyles.backText}>← Nazad</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={loginStyles.header}>
          <Text style={loginStyles.logo}>🔑</Text>
          <Text style={loginStyles.title} accessibilityRole="header">
            Admin pristup
          </Text>
          <Text style={loginStyles.subtitle}>Unesite administratorsku lozinku</Text>
        </View>

        {/* PIN unos */}
        <TextInput
          style={[loginStyles.pinInput, error ? loginStyles.pinInputError : null]}
          value={pin}
          onChangeText={(text) => {
            setPin(text);
            setError('');
          }}
          placeholder="Lozinka..."
          placeholderTextColor={Colors.gray400}
          secureTextEntry
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          accessibilityLabel="Admin lozinka"
        />

        {error ? <Text style={loginStyles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={loginStyles.loginButton}
          onPress={handleLogin}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Prijavi se kao admin"
        >
          <Text style={loginStyles.loginButtonText}>Prijavi se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export function AdminDashboardScreen() {
  const { userName, updateName, adminLogout, resetUser } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(userName || '');

  const handleSaveName = async () => {
    if (!newName.trim()) {
      Alert.alert('', 'Ime ne može biti prazno.');
      return;
    }
    await updateName(newName.trim());
    setEditingName(false);
    Alert.alert('✓', 'Ime je uspješno promijenjeno.');
  };

  const handleReset = () => {
    Alert.alert(
      'Resetuj korisnika',
      'Ovo će izbrisati ime korisnika i vratiti aplikaciju na početak. Jeste li sigurni?',
      [
        { text: 'Odustani', style: 'cancel' },
        {
          text: 'Resetuj',
          style: 'destructive',
          onPress: () => resetUser(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={dashStyles.container}>
      <ScrollView contentContainerStyle={dashStyles.content} showsVerticalScrollIndicator={false}>
        {/* Admin header */}
        <View style={dashStyles.header}>
          <View>
            <Text style={dashStyles.headerTitle} accessibilityRole="header">
              🛡️  Admin panel
            </Text>
            <Text style={dashStyles.headerSubtitle}>Upravljanje aplikacijom</Text>
          </View>
          <TouchableOpacity
            style={dashStyles.logoutButton}
            onPress={adminLogout}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Izaći iz admin moda"
          >
            <Text style={dashStyles.logoutText}>Izaći</Text>
          </TouchableOpacity>
        </View>

        {/* Korisničke informacije */}
        <View style={dashStyles.section}>
          <Text style={dashStyles.sectionTitle}>Korisnik</Text>

          <View style={dashStyles.card}>
            <Text style={dashStyles.cardLabel}>Ime pacijenta</Text>
            {editingName ? (
              <View style={dashStyles.editRow}>
                <TextInput
                  style={dashStyles.editInput}
                  value={newName}
                  onChangeText={setNewName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                  accessibilityLabel="Novo ime"
                />
                <TouchableOpacity style={dashStyles.saveBtn} onPress={handleSaveName}>
                  <Text style={dashStyles.saveBtnText}>Sačuvaj</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={dashStyles.cancelBtn}
                  onPress={() => {
                    setEditingName(false);
                    setNewName(userName || '');
                  }}
                >
                  <Text style={dashStyles.cancelBtnText}>Odustani</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={dashStyles.infoRow}>
                <Text style={dashStyles.infoValue}>{userName || '(nije postavljeno)'}</Text>
                <TouchableOpacity
                  style={dashStyles.editBtn}
                  onPress={() => {
                    setNewName(userName || '');
                    setEditingName(true);
                  }}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Uredi ime"
                >
                  <Text style={dashStyles.editBtnText}>✏️  Uredi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Informacije o aplikaciji */}
        <View style={dashStyles.section}>
          <Text style={dashStyles.sectionTitle}>Aplikacija</Text>

          <View style={dashStyles.card}>
            <View style={dashStyles.infoRow}>
              <Text style={dashStyles.cardLabel}>Verzija</Text>
              <Text style={dashStyles.infoValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Opasne akcije */}
        <View style={dashStyles.section}>
          <Text style={[dashStyles.sectionTitle, { color: Colors.emergency }]}>
            Opasne akcije
          </Text>

          <TouchableOpacity
            style={dashStyles.dangerButton}
            onPress={handleReset}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Resetuj korisnika"
          >
            <Text style={dashStyles.dangerButtonText}>🗑️  Resetuj korisnika</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Stilovi ─────────────────────────────────────────────────────────────────

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['3xl'],
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Spacing['2xl'],
    left: Spacing['2xl'],
    padding: Spacing.lg,
    minHeight: TouchTargets.medium,
    justifyContent: 'center',
  },
  backText: {
    ...Typography.body1,
    color: Colors.primary,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logo: {
    fontSize: 64,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.gray900,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.gray600,
    textAlign: 'center',
  },
  pinInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.xl,
    fontSize: 20,
    color: Colors.gray900,
    textAlign: 'center',
    backgroundColor: Colors.gray50,
    marginBottom: Spacing.md,
    minHeight: TouchTargets.large,
  },
  pinInputError: {
    borderColor: Colors.emergency,
  },
  errorText: {
    ...Typography.body2,
    color: Colors.emergency,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  loginButton: {
    backgroundColor: Colors.gray900,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    minHeight: TouchTargets.large,
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },
});

const dashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  content: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.gray900,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...Typography.body3,
    color: Colors.gray400,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    backgroundColor: Colors.gray700,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: TouchTargets.small,
    justifyContent: 'center',
  },
  logoutText: {
    ...Typography.body2,
    color: Colors.white,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.gray900,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    gap: Spacing.md,
  },
  cardLabel: {
    ...Typography.body2,
    color: Colors.gray500,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoValue: {
    ...Typography.h4,
    color: Colors.gray900,
    flex: 1,
  },
  editBtn: {
    backgroundColor: Colors.primaryXLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minHeight: TouchTargets.small,
    justifyContent: 'center',
  },
  editBtnText: {
    ...Typography.body2,
    color: Colors.primary,
    fontWeight: '600',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  editInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 18,
    color: Colors.gray900,
    backgroundColor: Colors.gray50,
    minHeight: TouchTargets.small,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: TouchTargets.small,
    justifyContent: 'center',
  },
  saveBtnText: {
    ...Typography.body3,
    color: Colors.white,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: TouchTargets.small,
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...Typography.body3,
    color: Colors.gray700,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: Colors.emergencyLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.emergency,
    minHeight: TouchTargets.large,
    justifyContent: 'center',
  },
  dangerButtonText: {
    ...Typography.body1,
    color: Colors.emergency,
    fontWeight: '700',
  },
});
