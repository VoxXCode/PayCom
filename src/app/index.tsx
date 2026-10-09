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
            <TouchableOpacity 
              className="w-11 h-11 items-center justify-center rounded-xl"
              onPress={() => router.canGoBack() && router.back()}
            >
              <MaterialIcons name="arrow-back" size={20} color="#c2c6d6" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-1">
              <View className="w-7 h-7 rounded-lg bg-surface-container-high items-center justify-center shadow-sm">
                <MaterialIcons name="payments" size={18} color="#adc6ff" />
              </View>
              <Text className="font-headline-md text-[20px] tracking-tight text-on-surface font-bold">
                Pay<Text className="text-secondary">Com</Text>
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity className="h-11 px-2 flex-row items-center gap-1 rounded-xl">
              <MaterialIcons name="language" size={16} color="#c2c6d6" />
              <Text className="font-label-mono-sm text-[11px] uppercase text-on-surface-variant font-medium">EN</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-xl">
              <MaterialIcons name="help-outline" size={20} color="#c2c6d6" />
            </TouchableOpacity>
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center ml-1 shadow-sm">
              <MaterialIcons name="person" size={18} color="#002e6a" />
            </View>
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
              <View className="flex-row items-center gap-1.5 px-2 py-1 rounded-full bg-surface-container-high shadow-sm">
                <MaterialIcons name="memory" size={14} color="#4cd7f6" />
                <Text className="font-label-mono-sm text-[11px] text-secondary tracking-wider uppercase font-semibold">PayCom Studio</Text>
              </View>
              <View className="flex-row items-center gap-1.5 px-1.5 py-0.5 rounded bg-surface-container-lowest">
                <View className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <Text className="font-label-mono-sm text-[10px] text-on-surface-variant leading-none">v3.8 • Cloud Ready</Text>
              </View>
            </View>
            <View className="pt-1 flex-col">
              <Text className="font-headline-lg-mobile text-[22px] text-on-surface tracking-tight font-bold">Akses Studio Rakitan</Text>
              <Text className="font-body-sm text-[12px] text-on-surface-variant pt-1 leading-relaxed">Mulai rancang PC impianmu dengan validasi hardware cerdas dan simulasi kompatibilitas real-time.</Text>
            </View>

            {/* Mini Visual Banner */}
            <ImageBackground 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW3_9-nPbOV6-er4hjlP-lD0CLgIsguRK8SIukR-_o176jmbZv36Nn7vGWHwyMtV8j7XFINd5rjakM6XKt9LTFAe4xzBaQImgVBbq2GpEpFImQcTnvXmb1alJWVMNT5FZsY5qwLNbCC7XxT_AqtTTCvlClhTgvyrXQTmc1P5-Q-_1AcKjdK4lBAXB7XvlTZincJ5LucYzIFkRHWpBenr6oXQpX4iEyHA5VX2HmNCotVOqRscEWbA' }}
              className="w-full h-24 rounded-xl overflow-hidden relative shadow-md bg-surface-container-low mt-2"
              imageStyle={{ resizeMode: 'cover' }}
            >
              <View className="absolute inset-0 flex-col justify-center px-4 bg-surface-container-lowest/60">
                <Text className="font-label-mono-sm text-[10px] uppercase text-primary font-semibold tracking-wider">AI Component Advisor</Text>
                <Text className="font-body-sm text-[12px] text-on-surface font-medium">Validasi Botol Leher & Daya PSU</Text>
              </View>
            </ImageBackground>
          </View>

          {/* 2. Primary Hero Feature: Guest Mode */}
          <View className="relative z-10">
            <View className="rounded-xl p-4 bg-surface-container-high shadow-md overflow-hidden flex-col gap-2 relative">
              {/* Glow Accent Line */}
              <View className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              {/* Ambient Backing in Card */}
              <View className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/15 rounded-full" />
              
              <View className="flex-row items-center gap-1.5 relative z-10">
                <View className="px-2 py-0.5 rounded bg-secondary-container">
                  <Text className="text-on-secondary-container font-label-mono-sm text-[10px] font-bold uppercase tracking-wide">Tanpa Registrasi • Akses Cepat</Text>
                </View>
                <MaterialIcons name="bolt" size={16} color="#4cd7f6" />
              </View>

              <View className="flex-col relative z-10">
                <Text className="font-headline-md text-[20px] text-on-surface font-bold leading-snug">Lanjutkan sebagai Tamu</Text>
                <Text className="font-body-sm text-[12px] text-on-surface-variant pt-1 leading-relaxed">
                  Jelajahi katalog komponen, cek kompatibilitas soket & daya, serta simpan draft rakitan di memori perangkat lokal tanpa akun.
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-1.5 pt-1 relative z-10">
                <View className="flex-row items-center gap-1 px-2 py-1 rounded bg-surface-container-lowest">
                  <MaterialIcons name="check-circle" size={14} color="#4cd7f6" />
                  <Text className="text-secondary font-label-mono-sm text-[11px]">Simulasi Kompatibel</Text>
                </View>
                <View className="flex-row items-center gap-1 px-2 py-1 rounded bg-surface-container-lowest">
                  <MaterialIcons name="picture-as-pdf" size={14} color="#adc6ff" />
                  <Text className="text-on-surface font-label-mono-sm text-[11px]">Export Invoice</Text>
                </View>
                <View className="flex-row items-center gap-1 px-2 py-1 rounded bg-surface-container-lowest">
                  <MaterialIcons name="save" size={14} color="#c2c6d6" />
                  <Text className="text-on-surface-variant font-label-mono-sm text-[11px]">Draft Lokal</Text>
                </View>
              </View>

              <View className="pt-2 relative z-10">
                <Link href="/(tabs)" asChild>
                  <TouchableOpacity className="w-full flex-row items-center justify-between px-4 py-3.5 rounded-xl bg-primary shadow-sm">
                    <View className="flex-row items-center gap-1.5">
                      <MaterialIcons name="build-circle" size={20} color="#002e6a" />
                      <Text className="text-on-primary font-headline-md text-[16px] font-semibold tracking-tight">Mulai Rakit sebagai Tamu</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={20} color="#002e6a" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

          {/* 3. Divider: Cybernetic Style */}
          <View className="flex-row items-center justify-center py-1 relative">
            <View className="w-full h-[1px] bg-surface-container-highest" />
            <View className="absolute px-3 bg-surface">
              <Text className="font-label-mono-sm text-[10px] tracking-widest uppercase text-outline font-semibold">Atau Masuk ke Akun PayCom</Text>
            </View>
          </View>

          {/* 4. Account Login Form */}
          <View className="flex-col gap-4 relative z-10">
            {/* Input: Email / ID */}
            <View className="flex-col gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-label-mono-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-medium">PayCom ID / Email</Text>
                <Text className="text-outline text-[10px]">Wajib</Text>
              </View>
              <View className="flex-row items-center rounded-xl bg-surface-container-lowest h-12 px-3">
                <MaterialIcons name="badge" size={18} color="#c2c6d6" />
                <TextInput 
                  className="flex-1 h-full px-2 font-body-md text-[14px] text-on-surface"
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
                <Text className="font-label-mono-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-medium">Kata Sandi</Text>
                <TouchableOpacity>
                  <Text className="font-body-sm text-[12px] text-secondary">Lupa Sandi?</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center rounded-xl bg-surface-container-lowest h-12 pl-3 pr-2">
                <MaterialIcons name="lock" size={18} color="#c2c6d6" />
                <TextInput 
                  className="flex-1 h-full px-2 font-body-md text-[14px] text-on-surface"
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
                className="flex-row items-center gap-1.5"
                onPress={() => setRememberDevice(!rememberDevice)}
              >
                <View className={`w-4 h-4 rounded items-center justify-center ${rememberDevice ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                  {rememberDevice && <MaterialIcons name="check" size={12} color="#002e6a" />}
                </View>
                <Text className="font-body-sm text-[12px] text-on-surface">Ingat Perangkat Ini</Text>
              </TouchableOpacity>
              <Text className="font-label-mono-sm text-[10px] text-outline">Sesi 30 Hari</Text>
            </View>

            {/* Standard Login Submit */}
            <View className="pt-2">
              <TouchableOpacity className="w-full py-3 px-4 rounded-xl bg-surface-container-high flex-row items-center justify-center gap-2 shadow-sm">
                <MaterialIcons name="login" size={18} color="#adc6ff" />
                <Text className="text-primary font-headline-md text-[15px] font-semibold">Masuk dengan Akun PayCom</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 5. Social & Gamer Logins */}
          <View className="flex-col gap-1 relative z-10">
            <View className="items-center">
              <Text className="font-label-mono-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Atau Autentikasi via Platform:</Text>
            </View>
            <View className="flex-row gap-1 pt-1">
              <TouchableOpacity className="flex-1 flex-col items-center justify-center py-2.5 rounded-xl bg-surface-container-low shadow-sm gap-1">
                <View className="w-8 h-8 rounded-full bg-surface-container-lowest items-center justify-center">
                  <MaterialIcons name="sports-esports" size={18} color="#dfe2f1" />
                </View>
                <Text className="font-label-mono-sm text-[10px] text-on-surface font-medium tracking-tight">Steam</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-col items-center justify-center py-2.5 rounded-xl bg-surface-container-low shadow-sm gap-1">
                <View className="w-8 h-8 rounded-full bg-surface-container-lowest items-center justify-center">
                  <MaterialIcons name="forum" size={18} color="#4cd7f6" />
                </View>
                <Text className="font-label-mono-sm text-[10px] text-on-surface font-medium tracking-tight">Discord</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-col items-center justify-center py-2.5 rounded-xl bg-surface-container-low shadow-sm gap-1">
                <View className="w-8 h-8 rounded-full bg-surface-container-lowest items-center justify-center">
                  <MaterialIcons name="stadia-controller" size={18} color="#adc6ff" />
                </View>
                <Text className="font-label-mono-sm text-[10px] text-on-surface font-medium tracking-tight">Google ID</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 6. Footer Notes & Perks */}
          <View className="flex-col gap-4 pt-2 relative z-10">
            <View className="p-3 rounded-xl bg-surface-container-low flex-row items-start gap-2 shadow-sm">
              <View className="w-7 h-7 rounded-lg bg-surface-container-high items-center justify-center shrink-0 mt-0.5">
                <MaterialIcons name="cloud-sync" size={16} color="#4cd7f6" />
              </View>
              <View className="flex-col flex-1 shrink">
                <Text className="font-body-sm text-[11px] font-semibold text-on-surface">Keuntungan Akun Terdaftar:</Text>
                <Text className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                  Simpan rakitan multi-slot ke Cloud, konsultasi langsung teknisi 24/7 & pelacakan garansi komponen per unit.
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center gap-1.5">
              <Text className="text-on-surface-variant font-body-sm text-[12px]">Belum punya akun?</Text>
              <TouchableOpacity>
                <Text className="font-semibold text-primary font-body-sm text-[12px] underline" style={{ textDecorationColor: '#adc6ff80' }}>Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-col items-center justify-center text-center gap-1 pt-1 opacity-75">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="shield" size={13} color="#8c909f" />
                <Text className="font-label-mono-sm text-[10px] text-outline">256-bit Encrypted Telemetry • PayCom Studio ID</Text>
              </View>
              <Text className="font-label-mono-sm text-[9px] text-outline text-center">Semua benchmark TDP & soket diverifikasi secara independen.</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
