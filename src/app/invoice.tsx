import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBuild } from '../context/BuildContext';

export default function InvoiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    filledSlots,
    filledCount,
    totalPrice,
    totalWattage,
    voucherApplied,
    formatRupiah
  } = useBuild();

  const shippingFee = filledCount > 0 ? 150000 : 0;
  const discount = (voucherApplied && filledCount > 0 && totalPrice > 500000) ? 500000 : 0;
  const grandTotal = Math.max(0, totalPrice + shippingFee - discount);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/explore');
    }
  };

  return (
    <View className="flex-1 bg-[#0b0f19] relative" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="h-14 px-4 flex-row items-center justify-between border-b border-[#1e293b]">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity 
            onPress={handleClose}
            className="h-8 px-2.5 rounded-xl bg-[#151c2c] border border-[#222f46] items-center justify-center flex-row gap-1"
          >
            <MaterialIcons name="arrow-back" size={16} color="#94a3b8" />
            <Text className="text-[12px] font-bold text-white">Kembali</Text>
          </TouchableOpacity>
          <Text className="text-[15px] font-extrabold text-white ml-1">Invoice #PC-8891</Text>
        </View>
        <View className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
          <Text className="text-[10px] font-bold text-[#38bdf8] uppercase">Resmi</Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Card */}
        <View className="p-4 rounded-3xl bg-[#151c2c] border border-[#222f46] gap-3 shadow-md">
          <View className="flex-row items-center justify-between pb-3 border-b border-[#1e293b]">
            <View>
              <Text className="text-[18px] font-extrabold text-white">
                PAY<Text className="text-[#38bdf8]">COM</Text> Studio
              </Text>
              <Text className="text-[11px] text-[#94a3b8] mt-0.5">Laboratorium Perakitan PC Resmi</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] text-[#64748b]">Tanggal:</Text>
              <Text className="text-[12px] font-bold text-white">20 Oktober 2026</Text>
            </View>
          </View>

          <View className="flex-row justify-between py-1">
            <View>
              <Text className="text-[10px] text-[#64748b]">Penerima:</Text>
              <Text className="text-[13px] font-bold text-white">Builder PayCom</Text>
              <Text className="text-[11px] text-[#94a3b8]">Malang, Jawa Timur</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] text-[#64748b]">Estimasi Daya:</Text>
              <Text className="text-[13px] font-bold text-[#38bdf8]">{totalWattage} Watt</Text>
              <Text className="text-[11px] text-[#94a3b8]">{filledCount} Komponen Terpasang</Text>
            </View>
          </View>
        </View>

        {/* Components breakdown */}
        <View className="mt-4 rounded-3xl bg-[#151c2c] border border-[#222f46] p-4 gap-3 shadow-md">
          <Text className="text-[14px] font-bold text-white pb-2 border-b border-[#1e293b]">
            Daftar Komponen ({filledCount} Item)
          </Text>

          {filledCount === 0 ? (
            <Text className="text-[12px] text-[#64748b] py-2">Belum ada komponen yang dipilih.</Text>
          ) : (
            filledSlots.map((slot) => {
              const item = slot.selectedItem!;
              return (
                <View key={slot.id} className="flex-row items-center gap-3 py-2 border-b border-[#1e293b]">
                  <Image 
                    source={{ uri: item.image }} 
                    className="w-12 h-12 rounded-xl bg-[#0f1422] shrink-0" 
                    style={{ resizeMode: 'cover' }} 
                  />
                  <View className="flex-1">
                    <Text className="text-[10px] text-[#38bdf8] font-bold uppercase">{slot.name} ({slot.category})</Text>
                    <Text className="text-[12px] text-white font-bold" numberOfLines={1}>{item.name}</Text>
                  </View>
                  <Text className="text-[12px] font-bold text-white">{formatRupiah(item.price)}</Text>
                </View>
              );
            })
          )}

          <View className="gap-2 pt-2">
            <View className="flex-row justify-between">
              <Text className="text-[12px] text-[#94a3b8]">Subtotal Komponen</Text>
              <Text className="text-[12px] font-bold text-white">{formatRupiah(totalPrice)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[12px] text-[#94a3b8]">Jasa Perakitan & Cable Mgmt</Text>
              <Text className="text-[12px] font-bold text-[#38bdf8]">Gratis</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[12px] text-[#94a3b8]">Stress Test 24 Jam Non-Stop</Text>
              <Text className="text-[12px] font-bold text-[#38bdf8]">Termasuk</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[12px] text-[#94a3b8]">Asuransi Pengiriman & Packing Kayu</Text>
              <Text className="text-[12px] font-bold text-white">{formatRupiah(shippingFee)}</Text>
            </View>
            {discount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-[12px] text-[#38bdf8]">Voucher Promo (NEONPC2025)</Text>
                <Text className="text-[12px] font-bold text-[#38bdf8]">-Rp 500.000</Text>
              </View>
            )}

            <View className="flex-row justify-between pt-3 border-t border-[#1e293b] items-center">
              <Text className="text-[14px] font-bold text-white">Total Pembayaran</Text>
              <Text className="text-[18px] font-extrabold text-[#38bdf8]">{formatRupiah(grandTotal)}</Text>
            </View>
          </View>
        </View>

        <View className="mt-5">
          <TouchableOpacity 
            onPress={handleClose}
            className="w-full py-3.5 rounded-full bg-[#2563eb] items-center justify-center flex-row gap-2 shadow-lg shadow-blue-600/30"
          >
            <MaterialIcons name="check" size={18} color="#ffffff" />
            <Text className="text-[14px] font-bold text-white">Selesai & Kembali</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
