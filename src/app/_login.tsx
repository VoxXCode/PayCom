import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="light" />
      
      {/* Header */}
      <View 
        className="absolute top-0 w-full z-50 bg-surface-container-lowest/80 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="h-16 px-gutter flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            
            <View className="flex-row items-center gap-1">
              
              <Text className="text-[20px] tracking-tight text-on-surface font-bold">
                <Text className="text-secondary">Pay</Text>Com
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity className="h-10 px-3 flex-row items-center gap-1.5 rounded-xl bg-surface-container-low">
              <MaterialIcons name="language" size={16} color="#c2c6d6" />
              <Text className="text-[12px] text-on-surface-variant font-medium">EN</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container-low">
              <MaterialIcons name="help-outline" size={20} color="#c2c6d6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 w-full bg-surface"
        contentContainerStyle={{ 
          paddingTop: Math.max(insets.top, 16) + 64, 
          paddingBottom: Math.max(insets.bottom, 24)
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col w-full px-gutter py-4 gap-6 relative overflow-hidden">
          
          {/* Dynamic Ambient Glow */}
          <View className="absolute -top-12 -left-16 w-64 h-64 bg-primary/10 rounded-full" />
          <View className="absolute top-48 -right-16 w-56 h-56 bg-secondary/10 rounded-full" />

          {/* 1. Header / Brand Intro */}
          <View className="flex-col gap-2 relative z-10">
            <View className="flex-row items-center justify-between">
              
              <View className="flex-row items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-lowest">
                <View className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <Text className="text-[11px] text-on-surface-variant font-medium leading-none">v1.0 • PayCom</Text>
              </View>
            </View>
            <View className="pt-1 flex-col">
              <Text className="text-[22px] text-on-surface tracking-tight font-bold">Akses Studio Rakitan</Text>
              <Text className="text-[13px] text-on-surface-variant pt-1 leading-relaxed">Mulai rancang PC impianmu dengan validasi hardware cerdas dan simulasi kompatibilitas real-time.</Text>
            </View>
          </View>

          {/* 2. Primary Hero Feature: Guest Mode */}
          <View className="relative z-10">
            <View className="rounded-xl p-4 bg-surface-container-high shadow-md overflow-hidden flex-col gap-2 relative">
              {/* Ambient Backing in Card */}
              <View className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/15 rounded-full" />

              <View className="flex-col relative z-10">
                <Text className="text-[18px] text-on-surface font-bold leading-snug">Lanjutkan sebagai Tamu</Text>
                <Text className="text-[13px] text-on-surface-variant pt-1 leading-relaxed">
                  Jelajahi katalog komponen, cek kompatibilitas soket & daya, serta simpan draft rakitan di memori perangkat lokal tanpa akun.
                </Text>
              </View>

              <View className="pt-2 relative z-10">
                <Link href="/(tabs)" asChild>
                  <TouchableOpacity className="w-full flex-row items-center justify-between px-4 py-3.5 rounded-xl bg-primary shadow-sm">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons name="build-circle" size={20} color="#002e6a" />
                      <Text className="text-on-primary text-[15px] font-semibold">Mulai Rakit sebagai Tamu</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={20} color="#002e6a" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

          {/* 3. Divider */}
          <View className="flex-row items-center justify-center py-1 relative">
            <View className="w-full h-[1px] bg-surface-container-highest" />
            <View className="absolute px-3 bg-surface">
              <Text className="text-[11px] text-outline font-medium">Atau Masuk ke Akun PayCom</Text>
            </View>
          </View>

          {/* 4. Account Login Form */}
          <View className="flex-col gap-4 relative z-10">
            {/* Input: Email / ID */}
            <View className="flex-col gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] text-on-surface-variant font-medium">PayCom ID / Email</Text>
              </View>
              <View className="flex-row items-center rounded-xl bg-surface-container-lowest h-12 px-3">
                <MaterialIcons name="badge" size={18} color="#c2c6d6" />
                <TextInput 
                  className="flex-1 h-full px-2 text-[14px] text-on-surface font-normal"
                  placeholder="builder@paycom.id"
                  placeholderTextColor="#8c909f"
                  autoComplete="username"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Input: Password */}
            <View className="flex-col gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] text-on-surface-variant font-medium">Kata Sandi</Text>
                <TouchableOpacity>
                  <Text className="text-[12px] text-secondary font-medium">Lupa Sandi?</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center rounded-xl bg-surface-container-lowest h-12 pl-3 pr-2">
                <MaterialIcons name="lock" size={18} color="#c2c6d6" />
                <TextInput 
                  className="flex-1 h-full px-2 text-[14px] text-on-surface font-normal"
                  placeholder="••••••••••••"
                  placeholderTextColor="#8c909f"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity 
                  className="w-10 h-10 items-center justify-center"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={18} color="#c2c6d6" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me Switch */}
            <View className="flex-row items-center justify-between pt-1">
              <TouchableOpacity 
                className="flex-row items-center gap-2"
                onPress={() => setRememberDevice(!rememberDevice)}
              >
                <View className={`w-4 h-4 rounded items-center justify-center ${rememberDevice ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                  {rememberDevice && <MaterialIcons name="check" size={12} color="#002e6a" />}
                </View>
                <Text className="text-[12px] text-on-surface font-normal">Ingat Perangkat Ini</Text>
              </TouchableOpacity>
              <Text className="text-[11px] text-outline font-medium">Sesi 30 Hari</Text>
            </View>

            {/* Standard Login Submit */}
            <View className="pt-2">
              <TouchableOpacity className="w-full py-3.5 px-4 rounded-xl bg-surface-container-high flex-row items-center justify-center gap-2 shadow-sm">
                <MaterialIcons name="login" size={18} color="#adc6ff" />
                <Text className="text-primary text-[15px] font-semibold">Masuk dengan Akun PayCom</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 6. Footer Notes & Perks */}
          <View className="flex-col gap-4 pt-2 relative z-10">
            <View className="p-3.5 rounded-xl bg-surface-container-low flex-row items-start gap-2.5 shadow-sm">
              <View className="w-7 h-7 rounded-lg bg-surface-container-high items-center justify-center shrink-0 mt-0.5">
                <MaterialIcons name="cloud-sync" size={16} color="#4cd7f6" />
              </View>
              <View className="flex-col flex-1 shrink">
                <Text className="text-[12px] font-semibold text-on-surface">Keuntungan Akun Terdaftar:</Text>
                <Text className="text-[12px] text-on-surface-variant leading-relaxed mt-0.5">
                  Simpan rakitan multi-slot ke Cloud, konsultasi langsung teknisi 24/7 & pelacakan garansi komponen per unit.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center gap-1.5">
              <Text className="text-on-surface-variant text-[12px]">Belum punya akun?</Text>
              <TouchableOpacity>
                <Text className="font-semibold text-primary text-[12px] underline" style={{ textDecorationColor: '#adc6ff80' }}>Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-col items-center justify-center text-center gap-1 pt-1 opacity-75">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="shield" size={13} color="#8c909f" />
                <Text className="text-[11px] text-outline font-medium">PayCom</Text>
              </View>
              <Text className="text-[11px] text-outline text-center">Semua benchmark TDP & soket diverifikasi secara independen.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
