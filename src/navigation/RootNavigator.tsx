// src/navigation/RootNavigator.tsx
// Root navigator - lokalni auth flow (bez Firebase-a)

import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '@context/AuthContext';
import { LoadingSpinner } from '@components/index';

import {
  HomeScreen,
  DailyRoutineScreen,
  RemindersScreen,
  FamilyScreen,
  EmergencyScreen,
  ProfileScreen,
  NameSetupScreen,
  AdminLoginScreen,
  AdminDashboardScreen,
} from '@screens/index';

import { Colors } from '@constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Bottom Tab Navigator ─────────────────────────────────────────────────────

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray200,
          borderTopWidth: 1,
          paddingBottom: 10,
          height: 70,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Početna',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          tabBarLabel: 'Podsjetnici',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🔔</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Family"
        component={FamilyScreen}
        options={{
          tabBarLabel: 'Porodica',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>👨‍👩‍👧</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── App Stack (logovan korisnik) ─────────────────────────────────────────────

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyRoutine"
        component={DailyRoutineScreen}
        options={{ title: 'Moj dan' }}
      />
      <Stack.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{ title: 'SOS - Trebam pomoć' }}
      />
    </Stack.Navigator>
  );
}

// ─── Root Navigator ────────────────────────────────────────────────────────────

export function RootNavigator() {
  const { userName, isAdmin, isLoading } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Admin mode - pokazuje admin dashboard
  if (isAdmin) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Admin login ekran (kada korisnik klikne "Admin pristup")
  if (showAdminLogin) {
    return (
      <AdminLoginScreen onBack={() => setShowAdminLogin(false)} />
    );
  }

  // Nema postavljenog imena - pokazuje setup ekran
  if (!userName) {
    return (
      <NameSetupScreen onAdminPress={() => setShowAdminLogin(true)} />
    );
  }

  // Normalan korisnik - glavna aplikacija
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
