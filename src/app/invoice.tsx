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
    // Modul 2 - Penerapan router.canGoBack() & router.back()
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/explore');
    }
  };

  return (
    <View className="flex-1 bg-surface relative" style={{ paddingTop: insets.top }}>
      {/* Modal Navigation Header */}
      <View className="h-16 px-gutter flex-row items-center justify-between border-b border-surface-variant/30">
        <View className="flex-row items-center gap-2">
          {/* Tombol Back di Invoice */}
          <TouchableOpacity 
            onPress={handleClose}
            className="h-10 px-3 rounded-xl bg-surface-container-high items-center justify-center flex-row gap-1.5"
          >
            <MaterialIcons name="arrow-back" size={18} color="#c2c6d6" />
            <Text className="text-[13px] font-semibold text-on-surface">Kembali</Text>
          </TouchableOpacity>
          <Text className="text-[16px] font-bold text-on-surface">Invoice #PC-8891</Text>
        </View>
        <View className="px-2.5 py-1 rounded-full bg-secondary-container">
          <Text className="text-[11px] font-bold text-on-secondary-container">Resmi</Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-gutter py-4"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Summary Card */}
        <View className="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/20 gap-3">
          <View className="flex-row items-center justify-between pb-3 border-b border-surface-variant/30">
            <View>
              <Text className="text-[20px] font-bold text-on-surface">
                <Text className="text-secondary">Pay</Text>Com Studio
              </Text>
              <Text className="text-[11px] text-outline mt-0.5">Laboratorium Perakitan PC Resmi</Text>
            </View>
            <View className="items-end">
              <Text className="text-[11px] text-outline">Tanggal:</Text>
              <Text className="text-[12px] font-semibold text-on-surface">20 Oktober 2026</Text>
            </View>
          </View>

          {/* Customer & Rig Info */}
          <View className="flex-row justify-between py-1">
            <View>
              <Text className="text-[11px] text-outline">Penerima:</Text>
              <Text className="text-[13px] font-semibold text-on-surface">Praktikan UMM Mobile</Text>
              <Text className="text-[11px] text-on-surface-variant">Malang, Jawa Timur</Text>
            </View>
            <View className="items-end">
              <Text className="text-[11px] text-outline">Estimasi Daya:</Text>
              <Text className="text-[13px] font-semibold text-secondary">{totalWattage} Watt</Text>
              <Text className="text-[11px] text-on-surface-variant">{filledCount} Komponen Terpasang</Text>
            </View>
          </View>
        </View>

        {/* Itemized Table */}
        <View className="mt-4 rounded-2xl bg-surface-container p-4 gap-3">
          <Text className="text-[14px] font-bold text-on-surface pb-1 border-b border-surface-variant/20">
            Daftar Komponen ({filledCount} Item)
          </Text>

          {filledCount === 0 ? (
            <Text className="text-[12px] text-outline py-2">Belum ada komponen yang dipilih.</Text>
          ) : (
            filledSlots.map((slot, index) => {
              const item = slot.selectedItem!;
              return (
                <View key={slot.id} className="flex-row items-center gap-3 py-2 border-b border-surface-variant/15">
                  <Image 
                    source={{ uri: item.image }} 
                    className="w-10 h-10 rounded-lg bg-surface-container-highest shrink-0" 
                    style={{ resizeMode: 'cover' }} 
                  />
                  <View className="flex-1">
                    <Text className="text-[10px] text-outline font-medium">{slot.name} ({slot.category})</Text>
                    <Text className="text-[12px] text-on-surface font-semibold" numberOfLines={1}>{item.name}</Text>
                  </View>
                  <Text className="text-[12px] font-bold text-secondary">{formatRupiah(item.price)}</Text>
                </View>
              );
            })
          )}

          {/* Pricing Totals */}
          <View className="gap-2 pt-2">
            <View className="flex-row justify-between">
              <Text className="text-[12px] text-on-surface-variant">Subtotal Komponen</Text>
              <Text className="text-[12px] font-semibold text-on-surface">{formatRupiah(totalPrice)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[12px] text-on-surface-variant">Jasa Perakitan & Cable Mgmt</Text>
              <Text className="text-[12px] font-semibold text-secondary">Gratis</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[12px] text-on-surface-variant">Stress Test 24 Jam Non-Stop</Text>
              <Text className="text-[12px] font-semibold text-secondary">Termasuk</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[12px] text-on-surface-variant">Asuransi Pengiriman & Packing Kayu</Text>
              <Text className="text-[12px] font-semibold text-on-surface">{formatRupiah(shippingFee)}</Text>
            </View>
            {discount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-[12px] text-primary">Voucher Promo (NEONPC2025)</Text>
                <Text className="text-[12px] font-semibold text-primary">-Rp 500.000</Text>
              </View>
            )}

            <View className="flex-row justify-between pt-3 border-t border-surface-variant/30 items-center">
              <Text className="text-[14px] font-bold text-on-surface">Total Pembayaran</Text>
              <Text className="text-[18px] font-bold text-primary">{formatRupiah(grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-5 gap-2.5">
          <TouchableOpacity 
            onPress={handleClose}
            className="w-full py-3.5 rounded-xl bg-primary-container items-center justify-center flex-row gap-2"
          >
            <MaterialIcons name="check" size={18} color="#002e6a" />
            <Text className="text-[14px] font-bold text-on-primary">Tutup & Kembali</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
