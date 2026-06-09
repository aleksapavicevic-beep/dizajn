// src/constants/mockData.ts
// Mock podaci za development

import { DailyRoutineItem, Reminder, FamilyMember, EmergencyContact } from '@types/index';

export const MOCK_DAILY_ROUTINE: DailyRoutineItem[] = [
  {
    id: '1',
    userId: 'user123',
    title: 'Doručak',
    description: 'Pojedи zdrav doručak',
    icon: '🥞',
    time: '08:00',
    completed: false,
    order: 1,
  },
  {
    id: '2',
    userId: 'user123',
    title: 'Ručak',
    description: 'Pojedи ručak sa voćem',
    icon: '🍽️',
    time: '12:30',
    completed: false,
    order: 2,
  },
  {
    id: '3',
    userId: 'user123',
    title: 'Popij vodu',
    description: 'Hidratacija je važna',
    icon: '💧',
    time: '15:00',
    completed: false,
    order: 3,
  },
  {
    id: '4',
    userId: 'user123',
    title: 'Uzmi večernji lijek',
    description: 'Uzmi propisane liekove',
    icon: '💊',
    time: '19:00',
    completed: false,
    order: 4,
  },
  {
    id: '5',
    userId: 'user123',
    title: 'Vrijeme za spavanje',
    description: 'Odlazak na spavanje',
    icon: '😴',
    time: '22:00',
    completed: false,
    order: 5,
  },
];

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'rem1',
    userId: 'user123',
    title: 'Vrijeme za ručak',
    description: 'Vrijeme je za ručak',
    time: '12:00',
    repeatPattern: 'daily',
    notificationEnabled: true,
    voiceEnabled: true,
    voiceText: 'Vrijeme je za ručak. Molimo vas da jedete.',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'rem2',
    userId: 'user123',
    title: 'Popij vodu',
    description: 'Važno je piti vodu tokom dana',
    time: '15:00',
    repeatPattern: 'daily',
    notificationEnabled: true,
    voiceEnabled: true,
    voiceText: 'Popijte čašu vode.',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'rem3',
    userId: 'user123',
    title: 'Uzmi večernji lijek',
    description: 'Vrijeme za večernje liekove',
    time: '20:00',
    repeatPattern: 'daily',
    notificationEnabled: true,
    voiceEnabled: true,
    voiceText: 'Vrijeme je za večernje liekove. Molimo vas da ih uzmete.',
    isActive: true,
    createdAt: new Date(),
  },
];

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam1',
    userId: 'user123',
    name: 'Ana',
    relation: 'Tvoja kćerka',
    email: 'ana@example.com',
    phone: '+387 61 123 456',
    profileImage: '👩‍🦰',
    role: 'caregiver',
    isActive: true,
  },
  {
    id: 'fam2',
    userId: 'user123',
    name: 'Marko',
    relation: 'Tvoj sin',
    email: 'marko@example.com',
    phone: '+387 61 234 567',
    profileImage: '👨‍🦱',
    role: 'caregiver',
    isActive: true,
  },
  {
    id: 'fam3',
    userId: 'user123',
    name: 'Lana i Dino',
    relation: 'Tvoji unuci',
    email: 'unuci@example.com',
    profileImage: '👶👧',
    role: 'family',
    isActive: true,
  },
  {
    id: 'fam4',
    userId: 'user123',
    name: 'Jelena',
    relation: 'Tvoja jatica',
    email: 'jelena@example.com',
    phone: '+387 61 345 678',
    profileImage: '👵',
    role: 'family',
    isActive: true,
  },
];

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'emerg1',
    name: 'Ana',
    phone: '+387 61 123 456',
    email: 'ana@example.com',
    relation: 'Kćerka',
    isPrimary: true,
  },
  {
    id: 'emerg2',
    name: 'Hitna pomoć',
    phone: '112',
    relation: 'Hitna',
    isPrimary: false,
  },
];

export const GREETING_MESSAGES = {
  morning: 'Dobro jutro',
  afternoon: 'Dobar dan',
  evening: 'Dobar večer',
  night: 'Laku noć',
};

export const DAYS_OF_WEEK = [
  'Ponedjeljak',
  'Utorak',
  'Srijeda',
  'Četvrtak',
  'Petak',
  'Subota',
  'Nedjelja',
];

export const MONTHS = [
  'Siječanj',
  'Veljača',
  'Ožujak',
  'Travanj',
  'Maj',
  'Lipanj',
  'Srpanj',
  'Kolovoz',
  'Rujan',
  'Listopad',
  'Studeni',
  'Prosinac',
];
