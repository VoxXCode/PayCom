import '../global.css';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { BuildProvider } from '../context/BuildContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthScreen = segments[0] === 'login' || segments[0] === 'register';

    if (!session && !inAuthScreen) {
      router.replace('/login');
    } else if (session && inAuthScreen) {
      router.replace('/(tabs)');
    }
  }, [session, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center gap-3">
        <ActivityIndicator size="large" color="#4cd7f6" />
        <Text className="text-[12px] text-on-surface-variant font-medium">
          Memulihkan sesi akun PayCom...
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#131318' },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          title: 'PayCom Studio',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="invoice"
        options={{
          title: 'Invoice Rakitan PC',
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Masuk Akun PayCom',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Daftar Akun PayCom',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <BuildProvider>
          <AnimatedSplashOverlay />
          <RootLayoutNav />
        </BuildProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
