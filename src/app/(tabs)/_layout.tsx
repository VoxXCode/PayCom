import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

function CustomTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Komponen',
      route: '/(tabs)',
      match: pathname === '/' || pathname === '/(tabs)',
      icon: 'grid-view' as const,
    },
    {
      name: 'Ringkasan',
      route: '/(tabs)/explore',
      match: pathname.includes('explore'),
      icon: 'layers' as const,
    },
    {
      name: 'Simulasi',
      route: '/(tabs)/simulation',
      match: pathname.includes('simulation'),
      icon: 'speed' as const,
    },
    {
      name: 'Profil',
      route: '/(tabs)/profile',
      match: pathname.includes('profile'),
      icon: 'person' as const,
    },
  ];

  return (
    <View 
      className="absolute bottom-0 w-full z-50 bg-[#0f1422]/95 border-t border-[#1e293b]"
      style={{ 
        paddingBottom: Math.max(insets.bottom, 12),
        backdropFilter: Platform.OS === 'web' ? 'blur(16px)' : undefined,
      }}
    >
      <View className="flex-row justify-around items-center h-16 px-3">
        {tabs.map((tab) => {
          const isActive = tab.match;
          return (
            <TouchableOpacity 
              key={tab.name}
              activeOpacity={0.7}
              className="flex-col items-center justify-center min-w-[64px] py-1"
              onPress={() => router.push(tab.route as any)}
            >
              <View className={`items-center justify-center w-10 h-7 rounded-full mb-0.5 ${isActive ? 'bg-blue-500/15' : 'bg-transparent'}`}>
                <MaterialIcons 
                  name={tab.icon} 
                  size={22} 
                  color={isActive ? '#38bdf8' : '#64748b'} 
                />
              </View>
              <Text 
                className={`text-[10px] tracking-tight ${
                  isActive 
                    ? 'text-[#38bdf8] font-bold' 
                    : 'text-[#64748b] font-medium'
                }`}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={() => <CustomTabBar />} 
      screenOptions={{ 
        headerShown: false,
        sceneStyle: { backgroundColor: '#0b0f19' }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Komponen" }} />
      <Tabs.Screen name="explore" options={{ title: "Ringkasan" }} />
      <Tabs.Screen name="simulation" options={{ title: "Simulasi" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
