import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useUser } from '@clerk/clerk-expo';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import * as Notifications from 'expo-notifications';

type NotificationsNavProp = StackNavigationProp<OnboardingStackParamList, 'OnboardingNotifications'>;

type Props = {
  navigation: NotificationsNavProp;
};

export function OnboardingNotificationsScreen({ navigation }: Props) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const registerForPushNotificationsAsync = async () => {
    try {
      // Expo Go on Android does not support remote push notifications.
      // Skip all expo-notifications calls there to avoid runtime errors.
      if (Platform.OS === 'android') {
        return null;
      }

      if (!user) return null;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      return tokenData.data;
    } catch (error) {
      console.error('Failed to register for push notifications', error);
      return null;
    }
  };

  const completeOnboarding = async (askForNotifications: boolean) => {
    if (!user) return;

    try {
      setLoading(true);
      let expoPushToken: string | null = null;

      if (askForNotifications && Platform.OS !== 'web') {
        expoPushToken = await registerForPushNotificationsAsync();
      }

      const ref = doc(firestore, 'users', user.id);
      await setDoc(
        ref,
        {
          onboardingCompleted: true,
          onboardingStep: 4,
          ...(expoPushToken ? { expoPushToken } : {}),
        },
        { merge: true },
      );
      // RootNavigator will pick up onboardingCompleted and route to Main
    } catch (error) {
      console.error('Failed to complete onboarding', error);
      Alert.alert('Error', 'Something went wrong finishing onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
      </View>

      <Text style={styles.heading}>Stay in sync with the stars</Text>
      <Text style={styles.subheading}>
        Turn on notifications for daily horoscopes, important transits, and gentle reminders from the universe.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>You'll receive</Text>
        <Text style={styles.cardItem}>• Daily horoscope highlights</Text>
        <Text style={styles.cardItem}>• Retrograde and moon phase alerts</Text>
        <Text style={styles.cardItem}>• Guidance when your key transits peak</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => completeOnboarding(true)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Finish onboarding</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => completeOnboarding(false)}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(32),
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(8),
    marginBottom: verticalScale(32),
  },
  progressDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: 'rgba(148,163,184,0.5)',
  },
  progressDotActive: {
    backgroundColor: '#7311d4',
  },
  heading: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: '#F1F0FF',
    marginBottom: verticalScale(8),
  },
  subheading: {
    fontSize: moderateScale(14),
    color: 'rgba(148,163,184,0.9)',
    marginBottom: verticalScale(24),
  },
  card: {
    borderRadius: scale(18),
    padding: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(15,23,42,0.8)',
    marginBottom: verticalScale(32),
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#F1F0FF',
    marginBottom: verticalScale(8),
  },
  cardItem: {
    fontSize: moderateScale(13),
    color: 'rgba(191,219,254,0.9)',
    marginBottom: verticalScale(4),
  },
  footer: {
    marginTop: 'auto',
  },
  primaryButton: {
    height: verticalScale(54),
    borderRadius: scale(16),
    backgroundColor: '#7311d4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: moderateScale(16),
  },
  secondaryButton: {
    height: verticalScale(54),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: 'rgba(148,163,184,0.9)',
    fontWeight: '600',
    fontSize: 14,
  },
});

