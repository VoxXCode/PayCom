import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { BuildProvider } from '../context/BuildContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BuildProvider>
        <AnimatedSplashOverlay />
        {/* Modul 2 - Menerapkan _layout.tsx dan <Stack.Screen> (Halaman 30-31, 35, 40) */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#131318' }
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              title: 'PayCom Studio',
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="invoice" 
            options={{ 
              title: 'Invoice Rakitan PC',
              presentation: 'modal',
              headerShown: false 
            }} 
          />
        </Stack>
      </BuildProvider>
    </ThemeProvider>
  );
}
