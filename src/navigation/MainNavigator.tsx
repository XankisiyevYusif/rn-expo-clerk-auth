import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileScreen } from '../screens/ProfileScreen';

export type MainTabParamList = {
  Home: undefined;
  Readings: undefined;
  Compatibility: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{title}</Text>
  </View>
);

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Readings') iconName = 'moon';
          if (route.name === 'Compatibility') iconName = 'heart';
          if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        children={() => <PlaceholderScreen title="Home Screen" />}
      />
      <Tab.Screen
        name="Readings"
        children={() => <PlaceholderScreen title="Readings Screen" />}
      />
      <Tab.Screen
        name="Compatibility"
        children={() => <PlaceholderScreen title="Compatibility Screen" />}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

