import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamList } from '../navigation/OnboardingNavigator';

type SplashScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Splash'>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

export function SplashScreen({ navigation }: Props) {
  const handleContinue = () => {
    navigation.navigate('OnboardingDetails');
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.iconRow}>✨ 🌙</Text>
        <View style={styles.crystalBall} />
        <Text style={styles.title}>Mystica</Text>
        <Text style={styles.subtitle}>Discover the secrets of the universe</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.glassButton} onPress={handleContinue}>
          <Text style={styles.glassButtonText}>Continue</Text>
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
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    marginTop: verticalScale(32),
  },
  iconRow: {
    width: '100%',
    textAlign: 'center',
    color: '#7311d4',
    opacity: 0.7,
    marginBottom: verticalScale(24),
  },
  crystalBall: {
    width: scale(220),
    height: verticalScale(220),
    borderRadius: scale(110),
    backgroundColor: '#151526',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#7311d4',
    shadowOpacity: 0.6,
    shadowRadius: scale(30),
    shadowOffset: { width: 0, height: 0 },
  },
  title: {
    marginTop: verticalScale(32),
    fontSize: moderateScale(40),
    fontWeight: '700',
    color: '#F1F0FF',
  },
  subtitle: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(13),
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(148,163,184,0.9)',
  },
  footer: {
    width: '100%',
    marginBottom: verticalScale(24),
  },
  glassButton: {
    height: verticalScale(56),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassButtonText: {
    color: '#F1F0FF',
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
});

