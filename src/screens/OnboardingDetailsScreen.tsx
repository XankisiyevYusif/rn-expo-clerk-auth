import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useUser } from '@clerk/clerk-expo';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';

type DetailsNavProp = StackNavigationProp<OnboardingStackParamList, 'OnboardingDetails'>;

type Props = {
  navigation: DetailsNavProp;
};

export function OnboardingDetailsScreen({ navigation }: Props) {
  const { user } = useUser();
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!user) return;
    if (!fullName || !birthDate || !birthCity) {
      Alert.alert('Almost there', 'Please fill in your name, birth date, and birth city.');
      return;
    }

    try {
      setLoading(true);
      const ref = doc(firestore, 'users', user.id);
      await setDoc(
        ref,
        {
          clerkId: user.id,
          displayName: fullName,
          birthDate,
          birthTime: birthTime || null,
          birthCity,
          onboardingStep: 2,
        },
        { merge: true },
      );
      navigation.navigate('OnboardingInterests');
    } catch (error) {
      console.error('Failed to save onboarding details', error);
      Alert.alert('Error', 'Something went wrong saving your details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <View style={styles.progressDotMuted} />
        <View style={styles.progressDotActive} />
        <View style={styles.progressDotMuted} />
        <View style={styles.progressDotMuted} />
      </View>

      <Text style={styles.heading}>Tell us about you</Text>
      <Text style={styles.subheading}>Your cosmic blueprint begins with these details.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.glassField}>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="rgba(148,163,184,0.8)"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Birth Date</Text>
        <View style={styles.glassField}>
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="rgba(148,163,184,0.8)"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Birth Time</Text>
        <View style={styles.glassField}>
          <TextInput
            value={birthTime}
            onChangeText={setBirthTime}
            placeholder="HH:MM (optional)"
            placeholderTextColor="rgba(148,163,184,0.8)"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Birth City</Text>
        <View style={styles.glassField}>
          <TextInput
            value={birthCity}
            onChangeText={setBirthCity}
            placeholder="City or town"
            placeholderTextColor="rgba(148,163,184,0.8)"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          Your data is used solely to generate your astrological profile. We respect your cosmic privacy.
        </Text>
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
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  progressDotMuted: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#1f2933',
  },
  progressDotActive: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#7311d4',
    shadowColor: '#7311d4',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  heading: {
    fontSize: moderateScale(30),
    fontWeight: '700',
    color: '#F1F0FF',
    marginBottom: verticalScale(8),
  },
  subheading: {
    fontSize: moderateScale(14),
    color: 'rgba(148,163,184,0.9)',
    marginBottom: verticalScale(24),
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: moderateScale(11),
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(115,17,212,0.9)',
    marginBottom: verticalScale(6),
    marginTop: verticalScale(12),
  },
  glassField: {
    borderRadius: scale(16),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(2),
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    backgroundColor: 'rgba(15,23,42,0.7)',
  },
  input: {
    height: verticalScale(44),
    color: '#F1F0FF',
    fontSize: moderateScale(15),
  },
  footer: {
    marginTop: verticalScale(16),
  },
  primaryButton: {
    height: verticalScale(54),
    borderRadius: scale(16),
    backgroundColor: '#7311d4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7311d4',
    shadowOpacity: 0.4,
    shadowRadius: scale(10),
    shadowOffset: { width: 0, height: verticalScale(6) },
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: moderateScale(16),
  },
  disclaimer: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(11),
    color: 'rgba(148,163,184,0.9)',
    textAlign: 'center',
  },
});

