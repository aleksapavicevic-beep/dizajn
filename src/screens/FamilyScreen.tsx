// src/screens/FamilyScreen.tsx
// Prikaz članova porodice sa mogućnošću poziva

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { FamilyMemberCard, LoadingSpinner } from '@components/index';
import { Colors, Spacing, Typography } from '@constants/colors';
import { MOCK_FAMILY_MEMBERS } from '@constants/mockData';
import type { FamilyMember } from '@types/index';

interface FamilyScreenProps {
  navigation?: any;
}

/**
 * Family Screen
 * - Grid članova porodice
 * - Call buttons
 * - Dementia-friendly design
 */
export function FamilyScreen({ navigation }: FamilyScreenProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFamilyMembers(MOCK_FAMILY_MEMBERS);
      setLoading(false);
    }, 500);
  }, []);

  const handleCall = (member: FamilyMember) => {
    if (member.phone) {
      Linking.openURL(`tel:${member.phone}`);
    }
  };

  const handleMemberPress = (member: FamilyMember) => {
    setSelectedMember(member);
  };

  const renderMember = ({ item }: { item: FamilyMember }) => (
    <FamilyMemberCard
      member={item}
      onPress={() => handleMemberPress(item)}
      onCall={() => handleCall(item)}
    />
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
        data={familyMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text
            style={styles.title}
            accessible
            accessibilityRole="header"
          >
            Porodica
          </Text>
        }
      />

      {/* Detail modal - simplifikovani prikaz */}
      {selectedMember && (
        <TouchableOpacity
          style={styles.modal}
          onPress={() => setSelectedMember(null)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalClose} onPress={() => setSelectedMember(null)}>
              ✕
            </Text>
            <Text style={styles.modalAvatar}>{selectedMember.profileImage || '👤'}</Text>
            <Text style={styles.modalName}>{selectedMember.name}</Text>
            <Text style={styles.modalRelation}>{selectedMember.relation}</Text>

            {selectedMember.phone && (
              <TouchableOpacity
                style={styles.modalCallButton}
                onPress={() => {
                  handleCall(selectedMember);
                  setSelectedMember(null);
                }}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Pozovi ${selectedMember.name}`}
              >
                <Text style={styles.modalCallText}>☎️ Pozovi</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing['2xl'],
  },
  title: {
    ...Typography.h2,
    color: Colors.gray900,
    fontWeight: '700',
    marginBottom: Spacing['2xl'],
    marginLeft: Spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    fontSize: 28,
    color: Colors.gray600,
  },
  modalAvatar: {
    fontSize: 60,
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  modalName: {
    ...Typography.h2,
    color: Colors.gray900,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  modalRelation: {
    ...Typography.body1,
    color: Colors.gray600,
    marginBottom: Spacing['2xl'],
    textAlign: 'center',
  },
  modalCallButton: {
    width: '100%',
    backgroundColor: Colors.success,
    paddingVertical: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCallText: {
    ...Typography.h4,
    color: Colors.white,
    fontWeight: '600',
  },
});
