import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      {user && (
        <View style={styles.card}>
          <Text style={styles.name}>
            {user.firstName || user.username || 'Mystica seeker'}
          </Text>
          <Text style={styles.email}>
            {user.primaryEmailAddress?.emailAddress ?? ''}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
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
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#F1F0FF',
    marginBottom: verticalScale(24),
  },
  card: {
    borderRadius: scale(18),
    padding: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(15,23,42,0.9)',
    marginBottom: verticalScale(32),
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#F1F0FF',
    marginBottom: verticalScale(4),
  },
  email: {
    fontSize: moderateScale(13),
    color: 'rgba(148,163,184,0.9)',
  },
  logoutButton: {
    marginTop: 'auto',
    height: verticalScale(50),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(248,113,113,0.15)',
  },
  logoutText: {
    color: '#FCA5A5',
    fontWeight: '600',
    fontSize: moderateScale(15),
  },
});

