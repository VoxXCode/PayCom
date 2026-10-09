import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { useBuild } from '@/hooks/use-build';
import { PayComColors } from '@/constants/theme';
import { Header } from '@/components/paycom/header';
import { Footer } from '@/components/paycom/footer';
import { BuilderScreen } from '@/components/paycom/builder-screen';
import { SavedBuildsScreen } from '@/components/paycom/saved-builds-screen';
import { BenchmarksScreen } from '@/components/paycom/benchmarks-screen';
import { CommunityScreen } from '@/components/paycom/community-screen';
import { HomeScreen } from '@/components/paycom/home-screen';
import { SwapModal } from '@/components/paycom/swap-modal';

export default function App() {
  const { activeTab } = useBuild();

  useEffect(() => {
    // Hide splash screen when mounted
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Header />
        
        <View style={styles.content}>
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'builder' && <BuilderScreen />}
          {activeTab === 'saved-builds' && <SavedBuildsScreen />}
          {activeTab === 'benchmarks' && <BenchmarksScreen />}
          {activeTab === 'community' && <CommunityScreen />}
        </View>

        <Footer />
        <SwapModal />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(13,17,23,0.95)',
  },
  container: {
    flex: 1,
    backgroundColor: PayComColors.background,
    ...(Platform.OS === 'web'
      ? {
          // Subtle radial gradient background pattern
          backgroundImage: 'radial-gradient(#1f2937 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }
      : {}),
  },
  content: {
    flex: 1,
    ...(Platform.OS === 'web' ? { marginTop: 56 } : {}), // Compensate for fixed header on web
  },
});
