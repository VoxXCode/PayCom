import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

function CustomTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const isTabActive = (paths: string[]) => paths.includes(pathname);

  return (
    <View 
      className="absolute bottom-0 w-full z-50 bg-surface-container-lowest/95 border-t border-surface-container-low shadow-sm"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <View className="flex-row justify-around items-center h-16 px-space-xs">
        <TouchableOpacity 
          className="flex-col items-center justify-center min-w-[56px] h-12 gap-1"
          onPress={() => router.push('/(tabs)')}
        >
          <MaterialIcons name="grid-view" size={22} color={pathname === '/' || pathname === '/(tabs)' ? '#4cd7f6' : '#c2c6d6'} />
          <Text className={`text-[11px] ${pathname === '/' || pathname === '/(tabs)' ? 'text-secondary font-semibold' : 'text-on-surface-variant font-medium'}`}>Komponen</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-col items-center justify-center min-w-[56px] h-12 gap-1"
          onPress={() => router.push('/(tabs)/explore')}
        >
          <MaterialIcons name="analytics" size={22} color={pathname.includes('explore') ? '#4cd7f6' : '#c2c6d6'} />
          <Text className={`text-[11px] ${pathname.includes('explore') ? 'text-secondary font-semibold' : 'text-on-surface-variant font-medium'}`}>Ringkasan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-col items-center justify-center min-w-[56px] h-12 gap-1"
          onPress={() => {}}
        >
          <MaterialIcons name="speed" size={22} color="#c2c6d6" />
          <Text className="text-[11px] font-medium text-on-surface-variant">Simulasi</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-col items-center justify-center min-w-[56px] h-12 gap-1"
          onPress={() => {}}
        >
          <MaterialIcons name="tune" size={22} color="#c2c6d6" />
          <Text className="text-[11px] font-medium text-on-surface-variant">Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={() => <CustomTabBar />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Komponen" }} />
      <Tabs.Screen name="explore" options={{ title: "Ringkasan" }} />
    </Tabs>
  );
}
