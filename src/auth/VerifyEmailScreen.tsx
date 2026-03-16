import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSignUp } from '@clerk/clerk-expo';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

type RouteParams = {
  email?: string;
};

export function VerifyEmailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = (route.params ?? {}) as RouteParams;
  const email = useMemo(() => params.email ?? '', [params.email]);

  const { signUp, isLoaded } = useSignUp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerify = useCallback(async () => {
    if (!isLoaded || !signUp) return;
    if (!code.trim()) {
      Alert.alert('Missing code', 'Please enter the verification code from your email.');
      return;
    }

    try {
      setLoading(true);
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (result.status === 'complete') {
        Alert.alert('Email verified', 'You can now sign in.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('Not complete', 'Please try again.');
      }
    } catch (err: any) {
      console.error('Verify email error', err);
      const message =
        err?.errors?.[0]?.message ?? 'Verification failed. Please check the code and try again.';
      Alert.alert('Verification failed', message);
    } finally {
      setLoading(false);
    }
  }, [code, isLoaded, signUp, navigation]);

  const onResend = useCallback(async () => {
    if (!isLoaded || !signUp) return;
    try {
      setLoading(true);
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Code sent', 'We sent a new verification code to your email.');
    } catch (err: any) {
      console.error('Resend code error', err);
      const message =
        err?.errors?.[0]?.message ?? 'Could not resend the code. Please try again.';
      Alert.alert('Resend failed', message);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signUp]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify your email</Text>
      <Text style={styles.subheading}>
        Enter the code we sent to{email ? ` ${email}` : ' your email'}.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Verification code"
        placeholderTextColor="rgba(148,163,184,0.9)"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={onVerify} disabled={loading}>
        {loading ? <ActivityIndicator color="#F1F0FF" /> : <Text style={styles.primaryText}>Verify</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onResend} disabled={loading}>
        <Text style={styles.secondaryText}>Resend code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
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
  heading: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: '#F1F0FF',
    marginBottom: verticalScale(8),
  },
  subheading: {
    fontSize: moderateScale(13),
    color: 'rgba(148,163,184,0.9)',
    marginBottom: verticalScale(24),
  },
  input: {
    height: verticalScale(48),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    paddingHorizontal: scale(14),
    color: '#F1F0FF',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(12),
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  primaryButton: {
    height: verticalScale(52),
    borderRadius: scale(16),
    backgroundColor: '#7311d4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
  primaryText: {
    color: '#F1F0FF',
    fontWeight: '600',
    fontSize: moderateScale(15),
  },
  secondaryButton: {
    height: verticalScale(52),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(12),
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  secondaryText: {
    color: 'rgba(148,163,184,0.9)',
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  backButton: {
    marginTop: verticalScale(18),
    alignItems: 'center',
  },
  backText: {
    color: 'rgba(148,163,184,0.9)',
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
});

