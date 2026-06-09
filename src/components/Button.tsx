// src/components/Button.tsx
// Reusable button komponenta - accessibility first

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '@constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

/**
 * Dementia-friendly button komponenta
 * - Veliki touch targets (min 54x54)
 * - Clear labels
 * - Visual feedback
 * - Accessibility support
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const containerStyle = getContainerStyle(variant, size, disabled);
  const textStyle = getTextStyle(size);

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessible
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
      accessibilityHint={`Dugme: ${label}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? Colors.primary : Colors.white} />
      ) : (
        <>
          {icon && <Text style={{ fontSize: 24, marginRight: Spacing.md }}>{icon}</Text>}
          <Text style={textStyle}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

/**
 * Izračun container stila na osnovu varijante i veličine
 */
function getContainerStyle(
  variant: ButtonProps['variant'],
  size: ButtonProps['size'],
  disabled: boolean
): ViewStyle {
  const baseStyle: ViewStyle = {
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: disabled ? 0.6 : 1,
  };

  const sizeStyles = {
    small: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, minHeight: TouchTargets.small },
    medium: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl, minHeight: TouchTargets.medium },
    large: { paddingVertical: Spacing.xl, paddingHorizontal: Spacing['2xl'], minHeight: TouchTargets.large },
    xlarge: { paddingVertical: Spacing['2xl'], paddingHorizontal: Spacing['3xl'], minHeight: TouchTargets.xlarge },
  };

  const variantStyles = {
    primary: {
      backgroundColor: Colors.primary,
    },
    secondary: {
      backgroundColor: Colors.secondary,
    },
    danger: {
      backgroundColor: Colors.emergency,
    },
    ghost: {
      backgroundColor: Colors.white,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
}

/**
 * Izračun text stila na osnovu veličine
 */
function getTextStyle(size: ButtonProps['size']): TextStyle {
  const sizeTexts = {
    small: Typography.body2,
    medium: Typography.body1,
    large: Typography.h4,
    xlarge: Typography.h3,
  };

  return {
    ...sizeTexts[size],
    color: size !== undefined ? Colors.white : Colors.primary,
    fontWeight: '600',
  };
}
