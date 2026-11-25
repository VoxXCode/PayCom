import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  const [isRegistering, setIsRegistering] = useState(false);
  const [builderName, setBuilderName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAuth = async () => {
    if (isSubmitting) return;

    const cleanEmail = email.trim();
    const cleanName = builderName.trim();
    const cleanNim = nim.trim();

    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Konfigurasi Supabase belum diisi. Silakan lengkapi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env terlebih dahulu.'
      );
      return;
    }

    if (!cleanEmail || !password) {
      setErrorMessage('Email dan kata sandi wajib diisi.');
      return;
    }

    if (isRegistering && !cleanName) {
      setErrorMessage('Nama builder wajib diisi saat mendaftar.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              nim: cleanNim || '-',
              role: 'builder',
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data.session) {
          Alert.alert('Pendaftaran Berhasil', `Selamat datang di PayCom Studio, ${cleanName}!`);
        } else {
          Alert.alert(
            'Akun Terdaftar',
            'Akun berhasil dibuat. Jika konfirmasi email aktif di Supabase, cek inbox atau langsung masuk jika sudah dinonaktifkan.'
          );
          setIsRegistering(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan koneksi saat menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setErrorMessage(null);
    setIsRegistering((prev) => !prev);
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="light" />

      <View
        className="absolute top-0 w-full z-50 bg-surface-container-lowest/80 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="h-16 px-gutter flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-[20px] tracking-tight text-on-surface font-bold">
              <Text className="text-secondary">Pay</Text>Com
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="h-8 px-2.5 flex-row items-center gap-1 rounded-lg bg-surface-container-low">
              <MaterialIcons name="lock-outline" size={14} color="#4cd7f6" />
              <Text className="text-[11px] text-secondary font-medium">SecureStore</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Bantuan Autentikasi',
                  'Masuk atau daftar akun PayCom untuk menyimpan rakitan PC ke cloud Supabase dengan keamanan terenkripsi.'
                )
              }
              className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container-low"
            >
              <MaterialIcons name="help-outline" size={20} color="#c2c6d6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 w-full bg-surface"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 64,
          paddingBottom: Math.max(insets.bottom, 24),
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-col w-full px-gutter py-4 gap-5 relative overflow-hidden">
          <View className="absolute -top-12 -left-16 w-64 h-64 bg-primary/10 rounded-full" />
          <View className="absolute top-48 -right-16 w-56 h-56 bg-secondary/10 rounded-full" />

          <View className="flex-col gap-2 relative z-10">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-lowest">
                <View className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <Text className="text-[11px] text-on-surface-variant font-medium leading-none">
                  Supabase Auth • JWT Session
                </Text>
              </View>
            </View>
            <View className="pt-1 flex-col">
              <Text className="text-[22px] text-on-surface tracking-tight font-bold">
                {isRegistering ? 'Daftar Akun Builder' : 'Masuk ke Studio PayCom'}
              </Text>
              <Text className="text-[13px] text-on-surface-variant pt-1 leading-relaxed">
                {isRegistering
                  ? 'Buat akun baru untuk menyimpan draft rakitan PC secara aman ke database cloud.'
                  : 'Autentikasi akun PayCom untuk mengakses komponen, simulasi benchmark, dan draft cloud.'}
              </Text>
            </View>
          </View>

          {!isSupabaseConfigured && (
            <View className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex-row items-start gap-2.5 relative z-10">
              <MaterialIcons name="warning-amber" size={18} color="#fbbf24" />
              <View className="flex-1">
                <Text className="text-[12px] font-bold text-amber-300">
                  Supabase URL Belum Diatur
                </Text>
                <Text className="text-[11px] text-amber-200/80 mt-0.5 leading-relaxed">
                  Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env lalu muat ulang aplikasi.
                </Text>
              </View>
            </View>
          )}

          {errorMessage && (
            <View className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex-row items-start gap-2.5 relative z-10">
              <MaterialIcons name="error-outline" size={18} color="#f87171" />
              <Text className="flex-1 text-[12px] text-red-200 leading-relaxed">
                {errorMessage}
              </Text>
            </View>
          )}

          <View className="flex-col gap-4 relative z-10">
            {isRegistering && (
              <>
                <View className="flex-col gap-1">
                  <Text className="text-[12px] text-on-surface-variant font-medium">
                    Nama Lengkap Builder
                  </Text>
                  <View className="flex-row items-center rounded-xl bg-surface-container-lowest h-12 px-3">
                    <MaterialIcons name="person" size={18} color="#c2c6d6" />
                    <TextInput
                      value={builderName}
                      onChangeText={setBuilderName}
                      editable={!isSubmitting}
                      className="flex-1 h-full px-2 text-[14px] text-on-surface font-normal"
                      placeholder="Contoh: Ahmad Builder"
                      placeholderTextColor="#8c909f"
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View className="flex-col gap-1">
                  <Text className="text-[12px] text-on-surface-variant font-medium">
                    NIM / ID Praktikan (Opsional)
                  </Text>
                  <View className="flex-row items-center rounded-xl bg-surface-container-lowest h-12 px-3">
                    <MaterialIcons name="badge" size={18} color="#c2c6d6" />
                    <TextInput
                      value={nim}
                      onChangeText={setNim}
                      editable={!isSubmitting}
                      className="flex-1 h-full px-2 text-[14px] text-on-surface font-normal"
                      placeholder="202210370311xxx"
                      placeholderTextColor="#8c909f"
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </>
            )}

            <View className="flex-col gap-1">
              <Text className="text-[12px] text-on-surface-variant font-medium">Email</Text>
              <View className="flex-row items-center rounded-xl bg-surface-container-lowest h-12 px-3">
                <MaterialIcons name="alternate-email" size={18} color="#c2c6d6" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  editable={!isSubmitting}
                  className="flex-1 h-full px-2 text-[14px] text-on-surface font-normal"
                  placeholder="builder@paycom.id"
                  placeholderTextColor="#8c909f"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />
              </View>
            </View>

            <View className="flex-col gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] text-on-surface-variant font-medium">
                  Kata Sandi
                </Text>
                <Text className="text-[11px] text-outline">Min. 6 karakter</Text>
              </View>
              <View className="flex-row items-center rounded-xl bg-surface-container-lowest h-12 pl-3 pr-2">
                <MaterialIcons name="lock" size={18} color="#c2c6d6" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  editable={!isSubmitting}
                  className="flex-1 h-full px-2 text-[14px] text-on-surface font-normal"
                  placeholder="••••••••••••"
                  placeholderTextColor="#8c909f"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                />
                <TouchableOpacity
                  className="w-10 h-10 items-center justify-center"
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={18}
                    color="#c2c6d6"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="pt-2">
              <TouchableOpacity
                onPress={handleAuth}
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl flex-row items-center justify-center gap-2 shadow-sm ${
                  isSubmitting ? 'bg-primary/60' : 'bg-primary active:opacity-85'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <ActivityIndicator size="small" color="#002e6a" />
                    <Text className="text-on-primary text-[15px] font-bold">
                      {isRegistering ? 'Mendaftarkan...' : 'Memverifikasi...'}
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons
                      name={isRegistering ? 'person-add' : 'login'}
                      size={18}
                      color="#002e6a"
                    />
                    <Text className="text-on-primary text-[15px] font-bold">
                      {isRegistering ? 'Daftar Akun PayCom' : 'Masuk ke PayCom'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-col gap-4 pt-1 relative z-10">
            <View className="flex-row items-center justify-center gap-1.5">
              <Text className="text-on-surface-variant text-[12px]">
                {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}
              </Text>
              <TouchableOpacity onPress={toggleMode} disabled={isSubmitting}>
                <Text
                  className="font-semibold text-secondary text-[12px] underline"
                  style={{ textDecorationColor: '#4cd7f680' }}
                >
                  {isRegistering ? 'Masuk di sini' : 'Daftar Sekarang'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="p-3.5 rounded-xl bg-surface-container-low flex-row items-start gap-2.5 shadow-sm">
              <View className="w-7 h-7 rounded-lg bg-surface-container-high items-center justify-center shrink-0 mt-0.5">
                <MaterialIcons name="verified-user" size={16} color="#4cd7f6" />
              </View>
              <View className="flex-col flex-1 shrink">
                <Text className="text-[12px] font-semibold text-on-surface">
                  Keamanan Sesi & Isolasi Data:
                </Text>
                <Text className="text-[12px] text-on-surface-variant leading-relaxed mt-0.5">
                  Token sesi disimpan terenkripsi menggunakan Expo SecureStore dan setiap draft rakitan dilindungi kebijakan Row Level Security (RLS).
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
