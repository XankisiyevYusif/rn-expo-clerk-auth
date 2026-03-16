import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { MysticaClerkProvider } from './src/auth/clerkProvider';

export default function App() {
  return (
    <MysticaClerkProvider>
      <RootNavigator />
      <StatusBar style="light" />
    </MysticaClerkProvider>
  );
}
