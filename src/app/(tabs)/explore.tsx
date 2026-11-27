import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBuild } from '../../context/BuildContext';
import { useAuth } from '../../context/AuthContext';
import { createSavedBuild } from '../../services/buildService';

export default function SummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const {
    slots,
    filledSlots,
    filledCount,
    totalPrice,
    totalWattage,
    capacityPercent,
    bottleneckText,
    voucherApplied,
    setVoucherApplied,
    resetSlots,
    formatRupiah
  } = useBuild();

  const [shippingOption, setShippingOption] = useState<'reguler' | 'express'>('reguler');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'transfer'>('qris');
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('2 - 3 Hari Kerja');
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);
  const [draftName, setDraftName] = useState<string>('');
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    if (filledCount === 0) {
      setEstimatedDelivery('Menunggu pemilihan komponen');
    } else if (shippingOption === 'express') {
      setEstimatedDelivery('1 Hari (Prioritas Perakitan & Tes Cepat)');
    } else {
      setEstimatedDelivery('2 - 3 Hari Kerja (Termasuk 24 Jam Stress Test)');
    }
  }, [shippingOption, filledCount]);

  const shippingFee = filledCount > 0 ? (shippingOption === 'express' ? 300000 : 150000) : 0;
  const discount = (voucherApplied && filledCount > 0 && totalPrice > 500000) ? 500000 : 0;
  const grandTotal = Math.max(0, totalPrice + shippingFee - discount);
  const totalSavings = 250000 + discount;

  const handleSelectShipping = (option: 'reguler' | 'express') => {
    setShippingOption(option);
    (router as any).setParams({ shipping: option });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Lihat konfigurasi rakitan PC saya di PayCom Studio!\nTotal: ${formatRupiah(grandTotal)} (${filledCount} Komponen, ${totalWattage}W)`,
      });
    } catch (e) {
      // Ignored
    }
  };

  const handleCheckout = () => {
    if (filledCount === 0) {
      Alert.alert(
        'Belum Ada Komponen',
        'Silakan pilih komponen terlebih dahulu di halaman Komponen sebelum checkout.',
        [
          { text: 'Pilih Komponen', onPress: () => router.push('/(tabs)') },
          { text: 'Batal', style: 'cancel' }
        ]
      );
      return;
    }
    const paymentLabel = paymentMethod === 'qris' ? 'QRIS' : paymentMethod === 'va' ? 'Virtual Account' : 'Transfer Bank';
    Alert.alert(
      '🎉 Pesanan Siap Dirakit!',
      `Rakitan PC (${filledCount} item) via ${paymentLabel} senilai ${formatRupiah(grandTotal)} sedang diproses. Estimasi tiba: ${estimatedDelivery}.`,
      [
        {
          text: 'Lihat Invoice',
          onPress: () => router.push('/invoice')
        },
        {
          text: 'Mulai Rakitan Baru',
          onPress: () => {
            resetSlots();
            router.replace('/(tabs)');
          }
        },
        { text: 'Selesai' }
      ]
    );
  };

  const handlePDF = () => {
    if (filledCount === 0) {
      Alert.alert('Rakitan Kosong', 'Pilih komponen terlebih dahulu untuk melihat invoice.');
      return;
    }
    router.push('/invoice');
  };

  const handleDraft = () => {
    if (filledCount === 0) {
      Alert.alert('Rakitan Kosong', 'Pilih komponen terlebih dahulu untuk menyimpan draft.');
      return;
    }
    setDraftName(`Rakitan PC (${filledCount} Komponen)`);
    setIsDraftModalOpen(true);
  };

  const handleConfirmSaveDraft = async () => {
    if (!user?.id) {
      Alert.alert('Belum Masuk', 'Silakan masuk ke akun PayCom untuk menyimpan draft ke cloud.');
      return;
    }

    const cleanName = draftName.trim();
    if (!cleanName) {
      Alert.alert('Nama Kosong', 'Masukkan nama draft rakitan terlebih dahulu.');
      return;
    }

    setIsSavingDraft(true);
    try {
      await createSavedBuild({
        user_id: user.id,
        build_name: cleanName,
        total_price: totalPrice,
        total_wattage: totalWattage,
        filled_count: filledCount,
        slots_json: slots,
      });
      setIsDraftModalOpen(false);
      Alert.alert(
        'Draft Tersimpan di Cloud',
        `"${cleanName}" berhasil disimpan ke database Supabase milik akunmu.`,
        [
          { text: 'Lihat di Profil', onPress: () => router.push('/(tabs)/profile') },
          { text: 'Tutup', style: 'cancel' },
        ]
      );
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan Draft', err?.message || 'Terjadi kesalahan saat menyimpan ke cloud.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleRemoveVoucher = () => {
    Alert.alert(
      'Hapus Voucher',
      'Yakin ingin menghapus voucher NEONPC2025 (-Rp 500.000)?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => setVoucherApplied(false) },
      ],
    );
  };

  return (
    <View className="flex-1 bg-[#0b0f19] relative">
      {/* Top Header matching Screen 4: Back, Title, Share, Bookmark */}
      <View 
        className="w-full z-40 bg-[#0b0f19]/95 border-b border-[#1e293b]"
        style={{ paddingTop: Math.max(insets.top, 14) }}
      >
        <View className="h-14 px-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)')}
              className="w-8 h-8 rounded-xl bg-[#151c2c] border border-[#222f46] items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={18} color="#94a3b8" />
            </TouchableOpacity>
            <Text className="text-[17px] font-extrabold text-white">
              Ringkasan Rakitan
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={handleShare}
              className="w-8 h-8 rounded-xl bg-[#151c2c] border border-[#222f46] items-center justify-center"
            >
              <MaterialIcons name="share" size={16} color="#94a3b8" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsBookmarked(!isBookmarked)}
              className="w-8 h-8 rounded-xl bg-[#151c2c] border border-[#222f46] items-center justify-center"
            >
              <Ionicons 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={16} 
                color={isBookmarked ? "#38bdf8" : "#94a3b8"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 w-full bg-[#0b0f19]"
        contentContainerStyle={{ 
          paddingTop: 14,
          paddingBottom: 150 + Math.max(insets.bottom, 16),
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Rig Preview Card matching Screen 4 in reference */}
        <View className="rounded-3xl bg-[#151c2c] border border-[#222f46] p-4 mb-4 shadow-sm relative overflow-hidden">
          {/* Header & Badges */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
              <Text className="text-[10px] font-bold text-[#38bdf8] uppercase">
                PayCom Custom Build
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="star" size={14} color="#facc15" />
              <MaterialIcons name="star" size={14} color="#facc15" />
              <MaterialIcons name="star" size={14} color="#facc15" />
              <MaterialIcons name="star" size={14} color="#facc15" />
              <MaterialIcons name="star" size={14} color="#facc15" />
              <Text className="text-[11px] font-bold text-white ml-1">4.9 (1.2k)</Text>
            </View>
          </View>

          {/* Title & Price */}
          <Text className="text-[20px] font-extrabold text-white leading-tight">
            Next-Gen Gaming & AI Rig
          </Text>
          <Text className="text-[22px] font-extrabold text-[#38bdf8] mt-1">
            {formatRupiah(totalPrice)}
          </Text>

          {/* Specifications Chips Row matching reference Screen 4 */}
          <View className="mt-4">
            <Text className="text-[12px] font-bold text-[#94a3b8] mb-2 uppercase tracking-wider">
              Specifications
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="px-3 py-2 rounded-xl bg-[#0f1422] border border-[#1e293b] flex-row items-center gap-1.5">
                <MaterialIcons name="bolt" size={14} color="#38bdf8" />
                <Text className="text-[11px] text-white font-medium">{totalWattage}W TDP</Text>
              </View>

              <View className="px-3 py-2 rounded-xl bg-[#0f1422] border border-[#1e293b] flex-row items-center gap-1.5">
                <MaterialIcons name="memory" size={14} color="#38bdf8" />
                <Text className="text-[11px] text-white font-medium">{filledCount}/5 Parts</Text>
              </View>

              <View className="px-3 py-2 rounded-xl bg-[#0f1422] border border-[#1e293b] flex-row items-center gap-1.5">
                <MaterialIcons name="speed" size={14} color="#38bdf8" />
                <Text className="text-[11px] text-white font-medium">{bottleneckText}</Text>
              </View>

              <View className="px-3 py-2 rounded-xl bg-[#0f1422] border border-[#1e293b] flex-row items-center gap-1.5">
                <MaterialIcons name="verified" size={14} color="#38bdf8" />
                <Text className="text-[11px] text-white font-medium">Garansi 1 Thn</Text>
              </View>
            </View>
          </View>

          {/* Highlights bullet points matching reference Screen 4 */}
          <View className="mt-4 pt-3 border-t border-[#1e293b]">
            <Text className="text-[12px] font-bold text-[#94a3b8] mb-1.5 uppercase tracking-wider">
              Highlights
            </Text>
            <View className="gap-1">
              <Text className="text-[11px] text-slate-300">• Ultra-quiet Cooling & Noctua NT-H2 Applied</Text>
              <Text className="text-[11px] text-slate-300">• 24 Jam Non-Stop Stress Testing Certified</Text>
              <Text className="text-[11px] text-slate-300">• Professional Cable Routing with Custom Velcro</Text>
            </View>
          </View>
        </View>

        {/* Installed Components Carousel / List */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2.5">
            <Text className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider">
              Komponen Terpasang ({filledCount})
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)')}>
              <Text className="text-[12px] font-bold text-[#38bdf8]">Ubah Part</Text>
            </TouchableOpacity>
          </View>

          {filledCount === 0 ? (
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)')}
              className="p-5 rounded-2xl border border-dashed border-[#2b3a55] bg-[#151c2c] items-center justify-center gap-2"
            >
              <MaterialIcons name="add-circle-outline" size={28} color="#38bdf8" />
              <Text className="text-[13px] text-white font-bold">Belum Ada Komponen Dipilih</Text>
              <Text className="text-[11px] text-[#94a3b8] text-center">
                Buka tab Komponen untuk mulai memilih part PC rakitan impianmu.
              </Text>
            </TouchableOpacity>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {filledSlots.map((slot) => {
                const item = slot.selectedItem!;
                return (
                  <View 
                    key={slot.id} 
                    className="w-56 p-3 rounded-2xl bg-[#151c2c] border border-[#222f46] flex-row items-center gap-3 shadow-sm"
                  >
                    <Image 
                      source={{ uri: item.image }} 
                      className="w-12 h-12 rounded-xl bg-[#0f1422] shrink-0" 
                      style={{ resizeMode: 'cover' }} 
                    />
                    <View className="flex-1">
                      <Text className="text-[10px] font-bold text-[#38bdf8] uppercase" numberOfLines={1}>
                        {slot.name}
                      </Text>
                      <Text className="text-[12px] text-white font-bold mt-0.5" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-[11px] text-[#94a3b8] font-bold mt-0.5">
                        {formatRupiah(item.price)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Shipping & Payment Section */}
        <View className="rounded-2xl bg-[#151c2c] border border-[#222f46] p-4 mb-4 gap-3">
          <View className="flex-row items-center justify-between pb-2 border-b border-[#1e293b]">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="local-shipping" size={18} color="#38bdf8" />
              <Text className="text-[14px] font-bold text-white">Pengiriman & Pembayaran</Text>
            </View>
          </View>

          {/* Shipping selection cards */}
          <View className="gap-2">
            <Text className="text-[11px] font-semibold text-[#94a3b8]">Pilih Ekspedisi:</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleSelectShipping('reguler')}
                className={`flex-1 p-3 rounded-xl border ${
                  shippingOption === 'reguler' 
                    ? 'bg-blue-600/15 border-blue-500' 
                    : 'bg-[#0f1422] border-[#1e293b]'
                }`}
              >
                <Text className={`text-[12px] font-bold ${
                  shippingOption === 'reguler' ? 'text-[#38bdf8]' : 'text-white'
                }`}>
                  Reguler (+150rb)
                </Text>
                <Text className="text-[10px] text-[#94a3b8] mt-0.5">Packing kayu + Asuransi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectShipping('express')}
                className={`flex-1 p-3 rounded-xl border ${
                  shippingOption === 'express' 
                    ? 'bg-blue-600/15 border-blue-500' 
                    : 'bg-[#0f1422] border-[#1e293b]'
                }`}
              >
                <Text className={`text-[12px] font-bold ${
                  shippingOption === 'express' ? 'text-[#38bdf8]' : 'text-white'
                }`}>
                  Express (+300rb)
                </Text>
                <Text className="text-[10px] text-[#94a3b8] mt-0.5">Rakit & kirim hari ini</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment selection chips */}
          <View className="gap-2 mt-1">
            <Text className="text-[11px] font-semibold text-[#94a3b8]">Metode Bayar:</Text>
            <View className="flex-row gap-2">
              {[
                { id: 'qris', name: 'QRIS' },
                { id: 'va', name: 'Virtual Account' },
                { id: 'transfer', name: 'Transfer' }
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setPaymentMethod(item.id as any)}
                  className={`flex-1 py-2 px-1 rounded-xl items-center border ${
                    paymentMethod === item.id 
                      ? 'bg-[#2563eb] border-[#2563eb]' 
                      : 'bg-[#0f1422] border-[#1e293b]'
                  }`}
                >
                  <Text className={`text-[11px] font-bold ${
                    paymentMethod === item.id ? 'text-white' : 'text-[#94a3b8]'
                  }`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="p-2.5 rounded-xl bg-[#0f1422] flex-row items-center gap-2 mt-1">
            <MaterialIcons name="schedule" size={16} color="#38bdf8" />
            <View className="flex-1">
              <Text className="text-[10px] text-[#64748b]">Estimasi Tiba:</Text>
              <Text className="text-[11px] text-white font-semibold">{estimatedDelivery}</Text>
            </View>
          </View>
        </View>

        {/* Pricing Breakdown Card */}
        <View className="rounded-2xl bg-[#151c2c] border border-[#222f46] p-4 mb-4 gap-2.5">
          <View className="flex-row items-center justify-between pb-2 border-b border-[#1e293b]">
            <Text className="text-[14px] font-bold text-white">Rincian Pembayaran</Text>
            <View className="px-2 py-0.5 rounded-full bg-blue-500/20">
              <Text className="text-[10px] font-bold text-[#38bdf8]">IDR / Resmi</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between py-1">
            <Text className="text-[12px] text-[#94a3b8]">Subtotal ({filledCount} Komponen)</Text>
            <Text className="text-[13px] font-bold text-white">{formatRupiah(totalPrice)}</Text>
          </View>

          <View className="flex-row items-center justify-between py-1">
            <Text className="text-[12px] text-[#94a3b8]">Perakitan & Cable Mgmt</Text>
            <Text className="text-[12px] font-bold text-[#38bdf8]">Gratis (Hemat 250rb)</Text>
          </View>

          <View className="flex-row items-center justify-between py-1">
            <Text className="text-[12px] text-[#94a3b8]">Ongkir & Asuransi</Text>
            <Text className="text-[13px] font-bold text-white">{formatRupiah(shippingFee)}</Text>
          </View>

          {voucherApplied && filledCount > 0 && totalPrice > 500000 && (
            <View className="flex-row items-center justify-between p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 my-1">
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name="confirmation-number" size={14} color="#38bdf8" />
                <Text className="text-[11px] text-[#38bdf8] font-bold">NEONPC2025</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-[12px] text-[#38bdf8] font-bold">-Rp 500.000</Text>
                <TouchableOpacity onPress={handleRemoveVoucher}>
                  <MaterialIcons name="close" size={14} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="flex-row items-center justify-between pt-2 border-t border-[#1e293b]">
            <Text className="text-[14px] font-bold text-white">Grand Total</Text>
            <Text className="text-[18px] font-extrabold text-[#38bdf8]">
              {formatRupiah(grandTotal)}
            </Text>
          </View>
        </View>

        {/* Quick action tools */}
        <View className="flex-row gap-2 mb-6">
          <TouchableOpacity 
            onPress={handlePDF}
            className="flex-1 py-3 rounded-xl bg-[#151c2c] border border-[#222f46] flex-row items-center justify-center gap-1.5"
          >
            <MaterialIcons name="receipt" size={16} color="#38bdf8" />
            <Text className="text-white text-[12px] font-bold">Lihat Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleDraft}
            className="flex-1 py-3 rounded-xl bg-[#151c2c] border border-[#222f46] flex-row items-center justify-center gap-1.5"
          >
            <MaterialIcons name="cloud-upload" size={16} color="#38bdf8" />
            <Text className="text-white text-[12px] font-bold">Simpan ke Cloud</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Draft Save Modal */}
      <Modal
        visible={isDraftModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDraftModalOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View
            className="bg-[#151c2c] rounded-t-3xl p-5 border-t border-[#2b3a55] gap-4"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          >
            <View className="flex-row items-center justify-between pb-2 border-b border-[#1e293b]">
              <Text className="text-[16px] font-bold text-white">Simpan Draft ke Cloud</Text>
              <TouchableOpacity
                onPress={() => setIsDraftModalOpen(false)}
                disabled={isSavingDraft}
                className="w-8 h-8 items-center justify-center rounded-full bg-[#1e293b]"
              >
                <MaterialIcons name="close" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              <Text className="text-[12px] text-[#94a3b8] font-semibold">Nama Rakitan</Text>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                editable={!isSavingDraft}
                placeholder="Contoh: PC Gaming 4K RTX"
                placeholderTextColor="#64748b"
                className="h-12 px-3.5 rounded-2xl bg-[#0f1422] border border-[#222f46] text-white text-[13px]"
              />
              <Text className="text-[11px] text-[#64748b]">
                {filledCount} komponen • {totalWattage}W • {formatRupiah(totalPrice)}
              </Text>
            </View>

            <View className="flex-row gap-2 pt-1">
              <TouchableOpacity
                onPress={() => setIsDraftModalOpen(false)}
                disabled={isSavingDraft}
                className="flex-1 py-3 rounded-full bg-[#1e293b] items-center justify-center"
              >
                <Text className="text-[13px] font-bold text-[#94a3b8]">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmSaveDraft}
                disabled={isSavingDraft}
                className="flex-1 py-3 rounded-full bg-[#2563eb] items-center justify-center flex-row gap-1.5 shadow-md shadow-blue-600/30"
              >
                {isSavingDraft && <ActivityIndicator size="small" color="#ffffff" />}
                <Text className="text-[13px] font-bold text-white">
                  {isSavingDraft ? 'Menyimpan...' : 'Simpan Cloud'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sticky Bottom Action Bar matching Screen 4 in reference */}
      <View 
        className="absolute left-0 right-0 z-50 bg-[#0f1422]/98 border-t border-[#1e293b] px-4 py-3 shadow-2xl"
        style={{ bottom: Math.max(insets.bottom, 12) + 54 }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] text-[#64748b] font-medium uppercase tracking-wider">
              Pricing Total
            </Text>
            <Text className="text-[18px] font-extrabold text-white">
              {formatRupiah(grandTotal > 0 ? grandTotal : totalPrice)}
            </Text>
            <Text className="text-[10px] text-[#38bdf8]">
              {filledCount} Komponen Terpilih
            </Text>
          </View>

          {/* Dual Action Buttons matching Screen 4 reference */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={handleDraft}
              className="px-3.5 py-3 rounded-full bg-[#151c2c] border border-[#222f46] flex-row items-center gap-1"
            >
              <MaterialIcons name="bookmark-border" size={16} color="#94a3b8" />
              <Text className="text-[#94a3b8] text-[12px] font-bold">Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleCheckout}
              activeOpacity={0.85}
              className="px-5 py-3 rounded-full bg-[#2563eb] flex-row items-center gap-1.5 shadow-lg shadow-blue-600/40"
            >
              <MaterialIcons name="flash-on" size={16} color="#ffffff" />
              <Text className="text-white text-[13px] font-bold">Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
