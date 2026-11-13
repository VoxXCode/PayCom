/**
 * Modul 3: Pemrograman Asynchronous & API Call - Lab Informatika UMM
 * File: src/components/ExternalProductCard.tsx
 * 
 * Menampilkan item produk yang diambil dari External API
 * dan dipetakan ke dalam TypeScript Interface `ExternalProduct`.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ExternalProduct } from '../types/hardware';

interface ExternalProductCardProps {
  product: ExternalProduct;
  onPress?: () => void;
}

export default function ExternalProductCard({ product, onPress }: ExternalProductCardProps) {
  // Konversi kurs estimasi USD ke IDR
  const priceIdr = Math.round(product.price * 16000);
  const formattedIdr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(priceIdr);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="p-3 rounded-2xl bg-surface-container border border-surface-variant/20 mb-3 flex-row gap-3 shadow-sm"
    >
      {/* Product Image */}
      <View className="w-20 h-20 rounded-xl bg-surface-container-low overflow-hidden items-center justify-center border border-surface-variant/30">
        {product.thumbnail ? (
          <Image
            source={{ uri: product.thumbnail }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <MaterialIcons name="laptop" size={32} color="#8c909f" />
        )}
      </View>

      {/* Product Details */}
      <View className="flex-1 justify-between">
        <View>
          <View className="flex-row items-center justify-between gap-1">
            <View className="px-2 py-0.5 rounded-full bg-secondary/15 border border-secondary/30">
              <Text className="text-[10px] text-secondary font-semibold uppercase">
                {product.brand || product.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="star" size={13} color="#facc15" />
              <Text className="text-[11px] font-bold text-on-surface">
                {product.rating}
              </Text>
            </View>
          </View>

          <Text className="text-[13px] font-bold text-on-surface mt-1" numberOfLines={1}>
            {product.title}
          </Text>
          <Text className="text-[11px] text-on-surface-variant mt-0.5" numberOfLines={2}>
            {product.description}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-1 border-t border-surface-variant/20 mt-1">
          <View>
            <Text className="text-[10px] text-outline">Harga Pasar (${product.price}):</Text>
            <Text className="text-[13px] font-bold text-primary">
              {formattedIdr}
            </Text>
          </View>
          <View className="px-2 py-1 rounded-lg bg-surface-container-high border border-surface-variant/30 flex-row items-center gap-1">
            <MaterialIcons name="inventory-2" size={12} color="#4cd7f6" />
            <Text className="text-[10px] text-on-surface-variant font-medium">
              Stok: {product.stock}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

