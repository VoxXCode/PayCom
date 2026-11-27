import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ExternalProduct } from '../types/hardware';

interface ExternalProductCardProps {
  product: ExternalProduct;
  onPress?: () => void;
  isGrid?: boolean;
}

export default function ExternalProductCard({ product, onPress, isGrid = false }: ExternalProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const priceIdr = Math.round(product.price * 16000);
  const formattedIdr = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(priceIdr);

  if (isGrid) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="w-[48%] rounded-2xl bg-[#151c2c] border border-[#222f46] p-3 mb-3 justify-between shadow-sm relative"
      >
        {/* Favorite Heart Button top right */}
        <TouchableOpacity 
          onPress={() => setIsFavorite(!isFavorite)}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-[#1e293b]/80 items-center justify-center"
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={14} 
            color={isFavorite ? "#f43f5e" : "#94a3b8"} 
          />
        </TouchableOpacity>

        {/* Thumbnail centered */}
        <View className="w-full h-28 rounded-xl bg-[#0f1422] overflow-hidden items-center justify-center border border-[#1e293b] mb-2.5">
          {product.thumbnail ? (
            <Image
              source={{ uri: product.thumbnail }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <MaterialIcons name="devices" size={32} color="#64748b" />
          )}
        </View>

        {/* Details */}
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wide">
              {product.brand || product.category}
            </Text>
            <Text className="text-[12px] font-bold text-white mt-0.5 leading-snug" numberOfLines={2}>
              {product.title}
            </Text>
          </View>

          <View className="mt-2 pt-2 border-t border-[#1e293b] flex-row items-center justify-between">
            <View>
              <Text className="text-[12px] font-extrabold text-white">
                {formattedIdr}
              </Text>
            </View>
            <View className="flex-row items-center gap-0.5 bg-[#1e293b] px-1.5 py-0.5 rounded">
              <MaterialIcons name="star" size={11} color="#facc15" />
              <Text className="text-[10px] font-bold text-white">
                {product.rating}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="p-3.5 rounded-2xl bg-[#151c2c] border border-[#222f46] mb-3 flex-row gap-3.5 shadow-sm relative"
    >
      <View className="w-20 h-20 rounded-2xl bg-[#0f1422] overflow-hidden items-center justify-center border border-[#1e293b] shrink-0">
        {product.thumbnail ? (
          <Image
            source={{ uri: product.thumbnail }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <MaterialIcons name="laptop" size={32} color="#64748b" />
        )}
      </View>

      <View className="flex-1 justify-between">
        <View>
          <View className="flex-row items-center justify-between gap-1">
            <View className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30">
              <Text className="text-[10px] text-[#38bdf8] font-bold uppercase">
                {product.brand || product.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="star" size={13} color="#facc15" />
              <Text className="text-[11px] font-bold text-white">
                {product.rating}
              </Text>
            </View>
          </View>

          <Text className="text-[13px] font-bold text-white mt-1" numberOfLines={1}>
            {product.title}
          </Text>
          <Text className="text-[11px] text-[#94a3b8] mt-0.5" numberOfLines={1}>
            {product.description}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-2 border-t border-[#1e293b] mt-1.5">
          <View>
            <Text className="text-[10px] text-[#64748b]">Harga Pasar (${product.price}):</Text>
            <Text className="text-[13px] font-extrabold text-[#38bdf8]">
              {formattedIdr}
            </Text>
          </View>
          <View className="px-2.5 py-1 rounded-lg bg-[#1e293b] flex-row items-center gap-1">
            <MaterialIcons name="inventory-2" size={12} color="#38bdf8" />
            <Text className="text-[10px] text-[#94a3b8] font-medium">
              Stok: {product.stock}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
