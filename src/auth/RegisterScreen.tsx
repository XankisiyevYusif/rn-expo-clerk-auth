import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSignUp } from '@clerk/clerk-expo';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { signUp, isLoaded } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return false;
    }
    return true;
  };

  const onRegister = useCallback(async () => {
    if (!isLoaded || !signUp) return;
    if (!validate()) return;
  
    try {
      setLoading(true);
  
      await signUp.create({
        emailAddress: email.trim(),
        password,
      });
  
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
  
      Alert.alert(
        "Verification required",
        "We sent a verification code to your email."
      );
  
      navigation.navigate("VerifyEmail", {
        email: email.trim(),
      });
  
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message ??
        "We could not create your account.";
  
      Alert.alert("Registration failed", message);
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, isLoaded, signUp]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create your account</Text>
      <Text style={styles.subheading}>Join Mystica and begin your cosmic journey.</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(148,163,184,0.9)"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 6 characters)"
          placeholderTextColor="rgba(148,163,184,0.9)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="rgba(148,163,184,0.9)"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerButton} onPress={onRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#F1F0FF" />
          ) : (
            <Text style={styles.registerText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
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
  form: {
    marginTop: verticalScale(8),
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
  registerButton: {
    height: verticalScale(52),
    borderRadius: scale(16),
    backgroundColor: '#7311d4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
  registerText: {
    color: '#F1F0FF',
    fontWeight: '600',
    fontSize: moderateScale(15),
  },
  backToLogin: {
    marginTop: verticalScale(16),
    alignItems: 'center',
  },
  backToLoginText: {
    color: 'rgba(148,163,184,0.9)',
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
});

