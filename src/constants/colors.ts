// src/constants/colors.ts
// Design system sa soft gradients i dementia-friendly bojama

export const Colors = {
  // Primarne boje
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryXLight: '#DBEAFE',

  // Sekundarne boje
  secondary: '#10B981',
  secondaryLight: '#6EE7B7',

  // Alarm/SOS
  emergency: '#EF4444',
  emergencyLight: '#FCA5A5',

  // Warning
  warning: '#F59E0B',
  warningLight: '#FED7AA',

  // Neutralne
  white: '#FFFFFF',
  black: '#1F2937',
  gray900: '#111827',
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  gray50: '#F9FAFB',

  // Success
  success: '#10B981',
  successLight: '#D1FAE5',

  // Info
  info: '#0EA5E9',
  infoLight: '#CFFAFE',

  // Gradients za kartice
  cardGradient: ['#F0F9FF', '#F8FAFC'],
  primaryGradient: ['#3B82F6', '#60A5FA'],
  emergencyGradient: ['#EF4444', '#FCA5A5'],
};

export const Shadows = {
  // Subtle shadows za dementia-friendly UI
  sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0px 4px 6px rgba(0, 0, 0, 0.07)',
  lg: '0px 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0px 20px 25px rgba(0, 0, 0, 0.1)',
};

export const Typography = {
  // Font size hierarchy (accessibility-first)
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  
  // Body
  body1: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  body2: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body3: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },

  // Caption
  caption1: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  caption2: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24, // Glavni radius za kartice
  full: 9999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

export const TouchTargets = {
  // Minimalno 54x54 za demenciju
  small: 48,
  medium: 56,
  large: 64,
  xlarge: 80,
};
