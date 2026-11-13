/**
 * Modul 3: Pemrograman Asynchronous & API Call - Lab Informatika UMM
 * File: src/components/Loading.tsx (Sesuai panduan halaman 21)
 * 
 * Reusable component untuk menampilkan status loading / fetching data asynchronous.
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Memuat data dari External API...' }: LoadingProps) {
  return (
    <View className="py-8 px-4 items-center justify-center gap-3">
      <View className="w-14 h-14 rounded-2xl bg-surface-container-high border border-surface-variant/30 items-center justify-center shadow-md">
        <ActivityIndicator size="large" color="#4cd7f6" />
      </View>
      <Text className="text-[13px] text-on-surface-variant text-center font-medium">
        {message}
      </Text>
    </View>
  );
}

