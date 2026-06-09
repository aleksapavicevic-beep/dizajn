// src/types/index.ts
// Centralizirani TypeScript tipovi za aplikaciju

export type UserRole = 'patient' | 'caregiver';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface PatientProfile {
  userId: string;
  primaryCaregiverId: string;
  dateOfBirth?: string;
  conditions?: string[];
  medications?: string[];
  emergencyContacts: EmergencyContact[];
  preferences: PatientPreferences;
}

export interface PatientPreferences {
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  language: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relation: string;
  isPrimary: boolean;
}

export interface DailyRoutineItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  time?: string;
  completed: boolean;
  completedAt?: Date;
  order: number;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: string;
  repeatPattern: 'once' | 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[];
  notificationEnabled: boolean;
  voiceEnabled: boolean;
  voiceText?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relation: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: 'caregiver' | 'family';
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  activityId: string;
  activityType: 'routine' | 'reminder' | 'call' | 'medication';
  timestamp: Date;
  completed: boolean;
  notes?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  vibrate?: boolean;
}
