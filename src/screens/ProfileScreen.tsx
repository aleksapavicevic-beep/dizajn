// src/screens/ProfileScreen.tsx
// Korisnički profil sa postavkama i izmjenom imena

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Button, Card } from '@components/index';
import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '@constants/colors';
import { useAuth } from '@context/AuthContext';

interface ProfileScreenProps {
  navigation?: any;
}

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { userName, updateName } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(userName || '');

  const [settings, setSettings] = useState({
    largeText: true,
    highContrast: false,
    voiceEnabled: true,
    notificationsEnabled: true,
    darkMode: false,
  });

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveName = async () => {
    if (!newName.trim()) {
      Alert.alert('', 'Ime ne može biti prazno.');
      return;
    }
    await updateName(newName.trim());
    setEditingName(false);
  };

  const settingsList = [
    { id: 'largeText', label: 'Veliki tekst', icon: '📝', description: 'Prikaži tekst većim fontom' },
    { id: 'highContrast', label: 'Visok kontrast', icon: '👁️', description: 'Pojačaj kontrast za bolju vidljivost' },
    { id: 'voiceEnabled', label: 'Voice upute', icon: '🔊', description: 'Čuj glasovne upute' },
    { id: 'notificationsEnabled', label: 'Notifikacije', icon: '🔔', description: 'Primaj podsjetnike' },
    { id: 'darkMode', label: 'Dark mode', icon: '🌙', description: 'Tamniji izgled' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* User Info kartica */}
        <Card variant="primary" gradient style={styles.userCard}>
          <View style={styles.userContent}>
            <Text style={styles.userAvatar}>👤</Text>
            <View style={styles.userInfo}>
              {editingName ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.nameInput}
                    value={newName}
                    onChangeText={setNewName}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleSaveName}
                    accessibilityLabel="Novo ime"
                    placeholderTextColor={Colors.white}
                    placeholder="Unesite ime..."
                  />
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName}>
                    <Text style={styles.saveBtnText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setEditingName(false);
                      setNewName(userName || '');
                    }}
                  >
                    <Text style={styles.cancelBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setNewName(userName || '');
                    setEditingName(true);
                  }}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Uredi ime"
                  style={styles.nameRow}
                >
                  <Text style={styles.userName}>{userName || 'Korisnik'}</Text>
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.userRole}>Pacijent</Text>
            </View>
          </View>
        </Card>

        {/* Pristupačnost */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Pristupačnost
          </Text>
          <View style={styles.settingsList}>
            {settingsList.map((setting) => (
              <View
                key={setting.id}
                style={styles.settingItem}
                accessible
                accessibilityRole="switch"
                accessibilityState={{ checked: settings[setting.id as keyof typeof settings] }}
                accessibilityLabel={setting.label}
              >
                <View style={styles.settingLeft}>
                  <Text style={styles.settingIcon}>{setting.icon}</Text>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>{setting.label}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                </View>
                <Switch
                  value={settings[setting.id as keyof typeof settings]}
                  onValueChange={() => handleToggleSetting(setting.id as keyof typeof settings)}
                  trackColor={{ false: Colors.gray300, true: Colors.primaryLight }}
                  thumbColor={
                    settings[setting.id as keyof typeof settings] ? Colors.primary : Colors.gray400
                  }
                  style={styles.switch}
                />
              </View>
            ))}
          </View>
        </View>

        {/* O aplikaciji */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            O aplikaciji
          </Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Verzija</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Razvojni tim</Text>
              <Text style={styles.infoValue}>Dementia Companion</Text>
            </View>
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
  userCard: {
    marginBottom: Spacing['2xl'],
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 50,
    marginRight: Spacing.xl,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  userName: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: '700',
    marginRight: Spacing.sm,
  },
  editIcon: {
    fontSize: 16,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  nameInput: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: Colors.white,
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    paddingVertical: Spacing.xs,
  },
  saveBtn: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: BorderRadius.md,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  userRole: {
    ...Typography.body3,
    color: Colors.white,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.gray900,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  settingsList: {
    gap: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    minHeight: TouchTargets.large,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 28,
    marginRight: Spacing.lg,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    ...Typography.body1,
    color: Colors.gray900,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    ...Typography.body3,
    color: Colors.gray600,
  },
  switch: {
    marginLeft: Spacing.lg,
  },
  infoList: {
    gap: Spacing.md,
  },
  infoItem: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    ...Typography.body1,
    color: Colors.gray900,
    fontWeight: '600',
  },
  infoValue: {
    ...Typography.body2,
    color: Colors.gray600,
  },
});
