// src/components/Input.tsx
// Reusable input field sa dementia accessibility

import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: string;
}

/**
 * Dementia-friendly input komponenta
 * - Veliki tekst
 * - Jasan label
 * - Error handling
 * - Touch friendly
 */
export function Input({
  label,
  error,
  containerStyle,
  icon,
  ...textInputProps
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={styles.label}
          accessibilityRole="text"
          accessible
          accessibilityLiveRegion="polite"
        >
          {label}
        </Text>
      )}

      <View style={[styles.inputContainer, error && styles.errorBorder]}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          {...textInputProps}
          style={styles.input}
          placeholderTextColor={Colors.gray400}
          accessible
          accessibilityLabel={label || textInputProps.placeholder}
          accessibilityHint={error ? `Greška: ${error}` : undefined}
        />
      </View>

      {error && (
        <Text
          style={styles.errorText}
          accessible
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  label: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gray300,
    paddingHorizontal: Spacing.lg,
    minHeight: 56, // Touch target minimum
  },
  errorBorder: {
    borderColor: Colors.emergency,
  },
  input: {
    flex: 1,
    ...Typography.body1,
    color: Colors.gray900,
    padding: Spacing.lg,
    outlineWidth: 0, // Remove web outline
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  errorText: {
    ...Typography.body3,
    color: Colors.emergency,
    marginTop: Spacing.md,
  },
});
