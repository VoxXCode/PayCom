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
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (isSubmitting) return;

    const cleanEmail = email.trim();
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Konfigurasi Supabase belum diisi. Lengkapi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env.'
      );
      return;
    }

    if (!cleanEmail || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to connect to authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      Alert.alert('Forgot Password', 'Please enter your email address first.');
      return;
    }
    if (!isSupabaseConfigured) {
      Alert.alert('Supabase Not Configured', 'Please configure your .env file first.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
    if (error) {
      Alert.alert('Reset Password Failed', error.message);
      return;
    }
    Alert.alert('Check Your Email', `Password reset link sent to ${cleanEmail}.`);
  };

  const handleSocialPress = (provider: string) => {
    Alert.alert(
      `${provider} Sign In`,
      `${provider} OAuth is not enabled yet. Please sign in using Email and Password.`
    );
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1 w-full bg-surface"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: Math.max(insets.top, 24) + 16,
          paddingBottom: Math.max(insets.bottom, 24) + 16,
          paddingHorizontal: 28,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[400px] self-center">
          <View className="items-center mb-9">
            <Text className="text-[28px] font-bold text-on-surface tracking-tight text-center">
              Sign In
            </Text>
            <Text className="text-[13px] text-outline text-center mt-2">
              Hi! Welcome back, you've been missed
            </Text>
          </View>

          {!isSupabaseConfigured && (
            <View className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex-row items-start gap-2">
              <MaterialIcons name="warning-amber" size={16} color="#fbbf24" />
              <Text className="flex-1 text-[11px] text-amber-200/90 leading-relaxed">
                Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di file .env.
              </Text>
            </View>
          )}

          {errorMessage && (
            <View className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex-row items-start gap-2">
              <MaterialIcons name="error-outline" size={16} color="#f87171" />
              <Text className="flex-1 text-[12px] text-red-200 leading-relaxed">
                {errorMessage}
              </Text>
            </View>
          )}

          <View className="gap-4">
            <View>
              <Text className="text-[13px] font-medium text-on-surface-variant mb-1.5">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                editable={!isSubmitting}
                placeholder="example@gmail.com"
                placeholderTextColor="#8c909f"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                className="h-12 px-4 rounded-xl bg-surface-container-high text-on-surface text-[14px]"
              />
            </View>

            <View>
              <Text className="text-[13px] font-medium text-on-surface-variant mb-1.5">
                Password
              </Text>
              <View className="h-12 pl-4 pr-2 rounded-xl bg-surface-container-high flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  editable={!isSubmitting}
                  placeholder="••••••••••••••"
                  placeholderTextColor="#8c909f"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  className="flex-1 h-full text-on-surface text-[14px]"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  className="w-10 h-10 items-center justify-center"
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#c2c6d6"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={isSubmitting}
                className="self-end mt-2"
              >
                <Text className="text-[12px] font-medium text-on-surface-variant underline">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignIn}
            disabled={isSubmitting}
            className={`w-full h-[52px] rounded-full mt-7 flex-row items-center justify-center gap-2 shadow-sm ${
              isSubmitting ? 'bg-primary/60' : 'bg-primary active:opacity-85'
            }`}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#002e6a" />
                <Text className="text-on-primary text-[15px] font-bold">Signing In...</Text>
              </>
            ) : (
              <Text className="text-on-primary text-[15px] font-bold">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-7">
            <View className="flex-1 h-[1px] bg-surface-variant" />
            <Text className="px-3 text-[12px] text-outline">Or sign in with</Text>
            <View className="flex-1 h-[1px] bg-surface-variant" />
          </View>

          <View className="flex-row items-center justify-center gap-4">
            <TouchableOpacity
              onPress={() => handleSocialPress('Apple')}
              disabled={isSubmitting}
              className="w-14 h-14 rounded-full border border-surface-variant bg-surface-container-low items-center justify-center"
            >
              <FontAwesome name="apple" size={22} color="#dfe2f1" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSocialPress('Google')}
              disabled={isSubmitting}
              className="w-14 h-14 rounded-full border border-surface-variant bg-surface-container-low items-center justify-center"
            >
              <FontAwesome name="google" size={20} color="#dfe2f1" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSocialPress('Facebook')}
              disabled={isSubmitting}
              className="w-14 h-14 rounded-full border border-surface-variant bg-surface-container-low items-center justify-center"
            >
              <FontAwesome name="facebook" size={20} color="#dfe2f1" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-center gap-1 mt-8">
            <Text className="text-[13px] text-outline">Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                setErrorMessage(null);
                router.push('/register');
              }}
              disabled={isSubmitting}
            >
              <Text className="text-[13px] font-semibold text-secondary underline">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
