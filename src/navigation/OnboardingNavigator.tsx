import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingDetailsScreen } from '../screens/OnboardingDetailsScreen';
import { OnboardingInterestsScreen } from '../screens/OnboardingInterestsScreen';
import { OnboardingNotificationsScreen } from '../screens/OnboardingNotificationsScreen';

export type OnboardingStackParamList = {
  Splash: undefined;
  EmailSignup: undefined;
  OnboardingDetails: undefined;
  OnboardingInterests: undefined;
  OnboardingNotifications: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="OnboardingDetails"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="OnboardingDetails" component={OnboardingDetailsScreen} />
      <Stack.Screen name="OnboardingInterests" component={OnboardingInterestsScreen} />
      <Stack.Screen name="OnboardingNotifications" component={OnboardingNotificationsScreen} />
    </Stack.Navigator>
  );
}

