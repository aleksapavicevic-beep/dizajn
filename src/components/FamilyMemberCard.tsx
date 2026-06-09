// src/components/FamilyMemberCard.tsx
// Komponenta za prikaz člana porodice

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Card } from './Card';
import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '@constants/colors';
import type { FamilyMember } from '@types/index';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onPress?: () => void;
  onCall?: () => void;
  style?: ViewStyle;
}

/**
 * Član porodice komponenta
 * - Velika slika/emoji
 * - Ime i odnos
 * - Call button
 */
export function FamilyMemberCard({
  member,
  onPress,
  onCall,
  style,
}: FamilyMemberCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${member.name} - ${member.relation}`}
      accessibilityHint="Dodirnite za više detalja"
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <Card variant="default" gradient style={styles.card}>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{member.profileImage || '👤'}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.relation}>{member.relation}</Text>

            {onCall && member.phone && (
              <TouchableOpacity
                style={styles.callButton}
                onPress={onCall}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Pozovi ${member.name}`}
              >
                <Text style={styles.callIcon}>☎️</Text>
                <Text style={styles.callText}>Pozovi</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: TouchTargets.xlarge * 1.2,
    margin: Spacing.md,
  },
  card: {
    margin: 0,
    marginBottom: 0,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    marginBottom: Spacing.lg,
  },
  avatar: {
    fontSize: 50,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    ...Typography.h4,
    color: Colors.gray900,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  relation: {
    ...Typography.body2,
    color: Colors.gray600,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: TouchTargets.medium,
  },
  callIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  callText: {
    ...Typography.body2,
    color: Colors.white,
    fontWeight: '600',
  },
});
