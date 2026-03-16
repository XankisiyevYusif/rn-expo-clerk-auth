import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';
import { useUser } from '@clerk/clerk-expo';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';

type InterestsNavProp = StackNavigationProp<OnboardingStackParamList, 'OnboardingInterests'>;

type Props = {
  navigation: InterestsNavProp;
};

const INTEREST_OPTIONS = [
  { id: 'love', label: 'Love & Relationships' },
  { id: 'career', label: 'Career & Money' },
  { id: 'health', label: 'Health & Energy' },
  { id: 'family', label: 'Family & Friends' },
  { id: 'growth', label: 'Personal Growth' },
  { id: 'spirituality', label: 'Spiritual Path' },
] as const;

export function OnboardingInterestsScreen({ navigation }: Props) {
  const { user } = useUser();
  const [selected, setSelected] = useState<string[]>(['love']);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleContinue = async () => {
    if (!user) return;
    if (selected.length === 0) {
      Alert.alert('Choose at least one', 'Select at least one area you are curious about.');
      return;
    }

    try {
      setLoading(true);
      const ref = doc(firestore, 'users', user.id);
      await setDoc(
        ref,
        {
          interests: selected,
          onboardingStep: 3,
        },
        { merge: true },
      );
      navigation.navigate('OnboardingNotifications');
    } catch (error) {
      console.error('Failed to save interests', error);
      Alert.alert('Error', 'Something went wrong saving your interests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.backSpacer} />
        <View style={styles.progressBarGroup}>
          <View style={[styles.progressBarSegment, styles.progressBarSegmentActive]} />
          <View style={[styles.progressBarSegment, styles.progressBarSegmentActive]} />
          <View style={styles.progressBarSegment} />
        </View>
        <View style={styles.backSpacer} />
      </View>

      <Text style={styles.heading}>What are you curious about?</Text>
      <Text style={styles.subheading}>Select all that apply to personalize your journey.</Text>

      <FlatList
        data={INTEREST_OPTIONS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingTop: 16 }}
        renderItem={({ item }) => {
          const isActive = selected.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => toggleInterest(item.id)}
            >
              <Text style={[styles.cardLabel, isActive && styles.cardLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Continue</Text>
          )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(24),
  },
  backSpacer: {
    width: scale(40),
  },
  progressBarGroup: {
    flexDirection: 'row',
    gap: scale(6),
    alignItems: 'center',
  },
  progressBarSegment: {
    width: scale(20),
    height: verticalScale(4),
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.4)',
  },
  progressBarSegmentActive: {
    backgroundColor: '#7311d4',
  },
  heading: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: '#F1F0FF',
    marginBottom: verticalScale(8),
  },
  subheading: {
    fontSize: moderateScale(14),
    color: 'rgba(148,163,184,0.9)',
  },
  card: {
    flex: 1,
    minHeight: verticalScale(120),
    borderRadius: scale(18),
    padding: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(15,23,42,0.7)',
    justifyContent: 'flex-end',
  },
  cardActive: {
    backgroundColor: 'rgba(115,17,212,0.18)',
    borderColor: '#7311d4',
    shadowColor: '#7311d4',
    shadowOpacity: 0.4,
    shadowRadius: scale(10),
    shadowOffset: { width: 0, height: 0 },
  },
  cardLabel: {
    fontSize: moderateScale(14),
    color: 'rgba(248,250,252,0.8)',
    fontWeight: '500',
  },
  cardLabelActive: {
    color: '#F9FAFB',
  },
  footer: {
    marginTop: verticalScale(24),
  },
  primaryButton: {
    height: verticalScale(56),
    borderRadius: scale(16),
    backgroundColor: '#7311d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});

