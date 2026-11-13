import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View className="my-3 p-4 rounded-2xl bg-red-950/30 border border-red-500/30 gap-3">
      <View className="flex-row items-start gap-3">
        <View className="w-8 h-8 rounded-lg bg-red-900/40 items-center justify-center shrink-0 mt-0.5">
          <MaterialIcons name="error-outline" size={20} color="#f87171" />
        </View>
        <View className="flex-1">
          <Text className="text-[13px] font-bold text-red-400">Terjadi Kesalahan</Text>
          <Text className="text-[12px] text-red-200/80 mt-1 leading-relaxed">
            {message}
          </Text>
        </View>
      </View>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="self-end px-3.5 py-1.5 rounded-xl bg-red-900/50 border border-red-500/40 flex-row items-center gap-1.5"
        >
          <MaterialIcons name="refresh" size={16} color="#fca5a5" />
          <Text className="text-[12px] font-semibold text-red-200">Coba Lagi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

