import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { ActivityIndicator, View } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { doc, onSnapshot } from 'firebase/firestore';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { LoginScreen } from '../auth/LoginScreen';
import { RegisterScreen } from '../auth/RegisterScreen';
import { VerifyEmailScreen } from '../auth/VerifyEmailScreen';
import { firestore } from '../firebase/firebaseConfig';
import { MysticaLoader } from '../components/MysticaLoader';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: { email?: string } | undefined;
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      if (!user) {
        setOnboardingCompleted(null);
        return;
      }

      const ref = doc(firestore, 'users', user.id);
      const unsubscribe = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as { onboardingCompleted?: boolean };
            setOnboardingCompleted(Boolean(data.onboardingCompleted));
          } else {
            setOnboardingCompleted(false);
          }
        },
        (error) => {
          console.error('Failed to listen to onboarding status', error);
          setOnboardingCompleted(false);
        },
      );

      return () => {
        unsubscribe();
      };
    } else {
      setOnboardingCompleted(null);
    }
  }, [isSignedIn, user]);

  if (!isLoaded || (isSignedIn && onboardingCompleted === null)) {
    return (
//      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//        <ActivityIndicator size="large" />
//      </View>
      <MysticaLoader />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isSignedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          </>
        ) : onboardingCompleted ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


