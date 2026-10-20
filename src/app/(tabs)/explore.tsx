import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBuild } from '../../context/BuildContext';

export default function SummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
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

  // Penerapan useState sesuai Modul 2
  const [shippingOption, setShippingOption] = useState<'reguler' | 'express'>('reguler');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'transfer'>('qris');
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('2 - 3 Hari Kerja');
  const [orderValidationMessage, setOrderValidationMessage] = useState<string>('');

  // Penerapan useEffect (Pola 1 - Initial Mount / Render Pertama Kali)
  useEffect(() => {
    console.log('[Modul 2] SummaryScreen dimuat untuk pertama kali.');
  }, []);

  // Penerapan useEffect (Pola 2 - Reaktif saat state shippingOption atau filledCount berubah)
  useEffect(() => {
    if (filledCount === 0) {
      setEstimatedDelivery('Menunggu pemilihan komponen');
      setOrderValidationMessage('Pilih komponen terlebih dahulu agar rakitan dapat diproses.');
    } else if (shippingOption === 'express') {
      setEstimatedDelivery('1 Hari (Prioritas Perakitan & Tes Cepat)');
      setOrderValidationMessage('Pengiriman express aktif: Unit dirakit dan dikirim hari ini.');
    } else {
      setEstimatedDelivery('2 - 3 Hari Kerja (Termasuk 24 Jam Stress Test)');
      setOrderValidationMessage('Pengiriman reguler aktif: Perakitan & pengetesan standar.');
    }
  }, [shippingOption, filledCount]);

  const shippingFee = filledCount > 0 ? (shippingOption === 'express' ? 300000 : 150000) : 0;
  const discount = (voucherApplied && filledCount > 0 && totalPrice > 500000) ? 500000 : 0;
  const grandTotal = Math.max(0, totalPrice + shippingFee - discount);
  const totalSavings = 250000 + discount;

  // Modul 2 - Penerapan router.setParams() untuk mengubah parameter URL route aktif tanpa reload (Halaman 38)
  const handleSelectShipping = (option: 'reguler' | 'express') => {
    setShippingOption(option);
    router.setParams({ shipping: option });
  };

  const handleCheckout = () => {
    if (filledCount === 0) {
      Alert.alert(
        'Belum Ada Komponen',
        'Silakan pilih komponen terlebih dahulu di halaman Komponen sebelum melanjutkan.',
        [
          // Modul 2 - Penerapan router.push() untuk navigasi ke halaman komponen
          { text: 'Pilih Komponen', onPress: () => router.push('/(tabs)') },
          { text: 'Batal', style: 'cancel' }
        ]
      );
      return;
    }
    const paymentLabel = paymentMethod === 'qris' ? 'QRIS' : paymentMethod === 'va' ? 'Virtual Account' : 'Transfer Bank';
    Alert.alert(
      '🎉 Pesanan Diproses!',
      `Rakitan PC kamu (${filledCount} item) via ${paymentLabel} senilai ${formatRupiah(grandTotal)} sedang diproses. Estimasi tiba: ${estimatedDelivery}.`,
      [
        {
          text: 'Mulai Rakitan Baru',
          onPress: () => {
            resetSlots();
            // Modul 2 - Penerapan router.replace() untuk menghapus stack setelah checkout (Halaman 33)
            router.replace('/(tabs)');
          }
        },
        { text: 'Selesai' }
      ]
    );
  };

  const handleChat = () => {
    Alert.alert('Chat Teknisi', 'Fitur ini menghubungkan kamu langsung dengan teknisi PayCom Studio. Segera tersedia!', [{ text: 'OK' }]);
  };

  const handlePDF = () => {
    if (filledCount === 0) {
      Alert.alert('Rakitan Kosong', 'Pilih komponen terlebih dahulu untuk melihat invoice.');
      return;
    }
    // Modul 2 - Navigasi membuka modal Stack.Screen (Halaman 35)
    router.push('/invoice');
  };

  const handleDraft = () => {
    if (filledCount === 0) {
      Alert.alert('Rakitan Kosong', 'Pilih komponen terlebih dahulu untuk menyimpan draft.');
      return;
    }
    Alert.alert('Draft Disimpan', 'Rakitan #PC-8891 berhasil disimpan ke draft akunmu.', [{ text: 'OK' }]);
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
    <View className="flex-1 bg-surface relative">
      {/* Header */}
      <View 
        className="absolute top-0 w-full z-50 bg-surface-container-lowest/80 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="h-16 px-gutter flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1">
              <Text className="text-[20px] tracking-tight text-on-surface font-bold">
                <Text className="text-secondary">Pay</Text>Com
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity className="h-10 px-3 flex-row items-center gap-1.5 rounded-xl bg-surface-container-low">
              <MaterialIcons name="language" size={16} color="#c2c6d6" />
              <Text className="text-[12px] text-on-surface-variant font-medium">EN</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container-low">
              <MaterialIcons name="help-outline" size={20} color="#c2c6d6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 w-full bg-surface"
        contentContainerStyle={{ 
          paddingTop: Math.max(insets.top, 16) + 64, 
          paddingBottom: 160 + Math.max(insets.bottom, 16) + 64 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col w-full px-gutter pt-2 pb-6 space-y-4 gap-4">
          
          {/* Status Validation Telemetry Strip (Kalkulasi Rig) */}
          <View className="bg-surface-container-low rounded-xl p-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-secondary" />
                <Text className="text-[12px] text-on-surface font-semibold">PayCom v1.0</Text>
              </View>
              <TouchableOpacity 
                className="flex-row items-center gap-0.5"
                onPress={() => router.push('/(tabs)')}
              >
                <Text className="text-[12px] text-secondary font-medium">Lihat Komponen</Text>
                <MaterialIcons name="chevron-right" size={14} color="#4cd7f6" />
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-2 pt-1">
              <View className="flex-1 flex-row items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg">
                <MaterialIcons name="bolt" size={18} color="#4cd7f6" />
                <View className="flex-col flex-1">
                  <Text className="text-[11px] text-on-surface-variant leading-none">
                    Daya {totalWattage}W/750W
                  </Text>
                  <Text className="text-[12px] text-secondary font-medium leading-tight mt-0.5" numberOfLines={1}>
                    {filledCount > 0 ? `${capacityPercent}% Kapasitas (Aman)` : '0% Kapasitas'}
                  </Text>
                </View>
              </View>
              <View className="flex-1 flex-row items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg">
                <MaterialIcons name="speed" size={18} color="#adc6ff" />
                <View className="flex-col flex-1">
                  <Text className="text-[11px] text-on-surface-variant leading-none">Bottleneck Indeks</Text>
                  <Text className="text-[12px] text-primary font-medium leading-tight mt-0.5">
                    {bottleneckText}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Hardware Visual Strip */}
          <View className="flex-col gap-2 mt-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-[12px] text-outline font-medium">
                Komponen Utama Terpasang ({filledCount} Item)
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                <Text className="text-[12px] text-secondary font-semibold">
                  {filledCount > 0 ? 'Ubah Komponen' : '+ Pilih Komponen'}
                </Text>
              </TouchableOpacity>
            </View>

            {filledCount === 0 ? (
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)')}
                className="p-4 rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low/50 items-center justify-center gap-2"
              >
                <MaterialIcons name="add-circle-outline" size={28} color="#4cd7f6" />
                <Text className="text-[13px] text-on-surface font-semibold">Belum Ada Komponen Dipilih</Text>
                <Text className="text-[12px] text-outline text-center">
                  Buka halaman Komponen untuk mulai memilih part rakitan PC impianmu.
                </Text>
              </TouchableOpacity>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-1" contentContainerStyle={{ gap: 8 }}>
                {filledSlots.map((slot) => {
                  const item = slot.selectedItem!;
                  return (
                    <View key={slot.id} className="flex-row items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-high w-60 shadow-sm">
                      <Image 
                        source={{ uri: item.image }} 
                        className="w-12 h-12 rounded-lg shrink-0 bg-surface-container-highest" 
                        style={{ resizeMode: 'cover' }} 
                      />
                      <View className="flex-1">
                        <Text className="text-[11px] text-outline font-medium" numberOfLines={1}>{slot.name}</Text>
                        <Text className="text-[12px] text-on-surface font-semibold" numberOfLines={1}>{item.name}</Text>
                        <Text className="text-[12px] text-secondary font-semibold">{formatRupiah(item.price)}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Opsi Pengiriman & Pembayaran (Penerapan useState & useEffect) */}
          <View className="rounded-xl bg-surface-container p-4 shadow-sm flex-col gap-3 mt-1">
            <View className="flex-row items-center justify-between pb-1 border-b border-surface-variant/30">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="local-shipping" size={20} color="#4cd7f6" />
                <Text className="text-[16px] text-on-surface font-bold">Opsi Pengiriman & Pembayaran</Text>
              </View>
            </View>

            {/* Pilihan Metode Pengiriman */}
            <View className="flex-col gap-1.5">
              <Text className="text-[12px] text-outline font-medium">Metode Pengiriman:</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleSelectShipping('reguler')}
                  className={`flex-1 p-2.5 rounded-xl border ${shippingOption === 'reguler' ? 'bg-secondary/15 border-secondary' : 'bg-surface-container-low border-surface-variant/30'}`}
                >
                  <Text className={`text-[13px] font-semibold ${shippingOption === 'reguler' ? 'text-secondary' : 'text-on-surface'}`}>
                    Reguler (+Rp 150rb)
                  </Text>
                  <Text className="text-[11px] text-on-surface-variant mt-0.5">Packing kayu + Asuransi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSelectShipping('express')}
                  className={`flex-1 p-2.5 rounded-xl border ${shippingOption === 'express' ? 'bg-secondary/15 border-secondary' : 'bg-surface-container-low border-surface-variant/30'}`}
                >
                  <Text className={`text-[13px] font-semibold ${shippingOption === 'express' ? 'text-secondary' : 'text-on-surface'}`}>
                    Express (+Rp 300rb)
                  </Text>
                  <Text className="text-[11px] text-on-surface-variant mt-0.5">Selesai rakit hari ini</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Pilihan Metode Pembayaran */}
            <View className="flex-col gap-1.5 mt-1">
              <Text className="text-[12px] text-outline font-medium">Metode Pembayaran:</Text>
              <View className="flex-row gap-2">
                {[
                  { id: 'qris', name: 'QRIS Instan' },
                  { id: 'va', name: 'Virtual Account' },
                  { id: 'transfer', name: 'Transfer Bank' }
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setPaymentMethod(item.id as any)}
                    className={`flex-1 py-2 px-1.5 rounded-lg items-center border ${paymentMethod === item.id ? 'bg-primary-container border-primary' : 'bg-surface-container-low border-surface-variant/30'}`}
                  >
                    <Text className={`text-[11px] font-semibold ${paymentMethod === item.id ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Estimasi Pengiriman Reaktif (dari useEffect) */}
            <View className="p-2.5 rounded-lg bg-surface-container-low flex-row items-center gap-2 mt-1">
              <MaterialIcons name="schedule" size={16} color="#4cd7f6" />
              <View className="flex-1">
                <Text className="text-[11px] text-outline font-medium">Estimasi Waktu Tiba:</Text>
                <Text className="text-[12px] text-secondary font-semibold">{estimatedDelivery}</Text>
              </View>
            </View>
          </View>

          {/* Price Breakdown Card */}
          <View className="rounded-xl bg-surface-container p-4 shadow-sm flex-col space-y-3 mt-2 gap-3">
            <View className="flex-row items-center justify-between pb-2 border-b border-surface-variant/30">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="receipt-long" size={20} color="#4cd7f6" />
                <Text className="text-[17px] text-on-surface font-bold">Rincian Biaya Transparan</Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-surface-container-high">
                <Text className="text-[11px] text-on-surface-variant font-medium">IDR / B2C</Text>
              </View>
            </View>

            {/* Line Items */}
            <View className="flex-col gap-2.5 pt-1">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-[14px] text-on-surface">Subtotal Komponen</Text>
                  <View className="px-2 py-0.5 rounded bg-surface-container-high">
                    <Text className="text-[11px] text-on-surface-variant font-medium">{filledCount} Item</Text>
                  </View>
                </View>
                <Text className="text-[14px] text-on-surface font-bold">{formatRupiah(totalPrice)}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-col">
                  <Text className="text-[14px] text-on-surface">Perakitan & Cable Mgmt</Text>
                  <Text className="text-[12px] text-outline">Thermal paste Noctua NT-H2 applied</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-[12px] line-through text-outline">Rp 250.000</Text>
                  <View className="px-2 py-0.5 rounded-full bg-secondary-container">
                    <Text className="text-[11px] text-on-secondary-container font-bold">Gratis</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-col">
                  <Text className="text-[14px] text-on-surface">Stress Test 24 Jam Non-Stop</Text>
                  <Text className="text-[12px] text-outline">Cinebench R23, Furmark, MemTest86</Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-secondary-container">
                  <Text className="text-[11px] text-on-secondary-container font-bold">Termasuk</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-col">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-[14px] text-on-surface">Asuransi Pengiriman Proteksi</Text>
                    <MaterialIcons name="verified-user" size={14} color="#4cd7f6" />
                  </View>
                  <Text className="text-[12px] text-outline">Klaim instan unit baru jika cacat logistik</Text>
                </View>
                <Text className="text-[14px] text-on-surface font-semibold">{formatRupiah(shippingFee)}</Text>
              </View>

              {voucherApplied && filledCount > 0 && totalPrice > 500000 && (
                <View className="flex-row items-center justify-between p-2.5 rounded-lg bg-surface-container-high mt-1">
                  <View className="flex-row items-center gap-2">
                    <View className="w-6 h-6 rounded bg-primary-container items-center justify-center">
                      <MaterialIcons name="confirmation-number" size={14} color="#002e6a" />
                    </View>
                    <View className="flex-col">
                      <Text className="text-[12px] text-primary font-bold">NEONPC2025</Text>
                      <Text className="text-[12px] text-on-surface-variant">Promo Builder Fest</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[14px] text-secondary font-bold">-Rp 500.000</Text>
                    <TouchableOpacity onPress={handleRemoveVoucher} className="w-6 h-6 rounded items-center justify-center">
                      <MaterialIcons name="close" size={14} color="#8c909f" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View className="flex-row items-center justify-between pt-2">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[14px] text-on-surface">Garansi PayCom 1-to-1</Text>
                  <Text className="text-[12px] text-secondary font-semibold">365 Hari</Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-surface-container-high">
                  <Text className="text-[11px] text-secondary font-bold">Termasuk</Text>
                </View>
              </View>
            </View>

            {/* Grand Total Section Highlight */}
            <View className="mt-2 bg-surface-container-highest/60 p-4 rounded-b-xl flex-row items-center justify-between" style={{ marginHorizontal: -16, marginBottom: -16 }}>
              <View className="flex-col">
                <Text className="text-[12px] text-outline font-medium">Total Pembayaran</Text>
                <Text className="text-[12px] text-on-surface-variant">PPN 11% sudah termasuk</Text>
              </View>
              <View className="flex-col items-end">
                <Text className="text-[22px] text-primary font-bold tracking-tight">
                  {formatRupiah(grandTotal)}
                </Text>
                {totalSavings > 0 && filledCount > 0 && (
                  <Text className="text-[12px] text-secondary font-semibold">
                    Hemat {formatRupiah(totalSavings)}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Trust & Protection Badges */}
          <View className="rounded-xl bg-surface-container-low p-4 shadow-sm flex-col gap-3 mt-2">
            <Text className="text-[12px] text-outline font-semibold">Standar Perakitan Studio PayCom</Text>
            <View className="flex-col gap-2.5">
              <View className="flex-row items-start gap-3 p-2.5 rounded-lg bg-surface-container">
                <View className="w-7 h-7 rounded-lg bg-secondary/15 items-center justify-center shrink-0">
                  <MaterialIcons name="verified" size={16} color="#4cd7f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-on-surface leading-tight">100% Produk Original Distributor Resmi</Text>
                  <Text className="text-[12px] text-on-surface-variant mt-0.5">Garansi resmi TAM, Synnex Metrodata, & Astrindo terdaftar serial number.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3 p-2.5 rounded-lg bg-surface-container">
                <View className="w-7 h-7 rounded-lg bg-secondary/15 items-center justify-center shrink-0">
                  <MaterialIcons name="cable" size={16} color="#4cd7f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-on-surface leading-tight">Pro Cable Management & Airflow Optimal</Text>
                  <Text className="text-[12px] text-on-surface-variant mt-0.5">Rute kabel tersembunyi dengan velcro kustom untuk jalur sirkulasi suhu stabil.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3 p-2.5 rounded-lg bg-surface-container">
                <View className="w-7 h-7 rounded-lg bg-secondary/15 items-center justify-center shrink-0">
                  <MaterialIcons name="inventory-2" size={16} color="#4cd7f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-on-surface leading-tight">Free Packing Kayu Berasuransi Penuh</Text>
                  <Text className="text-[12px] text-on-surface-variant mt-0.5">Ekstra bantalan airbag busa internal & peti kayu ekspedisi tahan banting antarkota.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Secondary Workflow Buttons */}
          <View className="flex-col gap-2.5 pt-1 mt-2">
            <View className="flex-row gap-2">
              <TouchableOpacity className="flex-1 py-3 px-3 rounded-xl bg-surface-container flex-row items-center justify-center gap-1.5" onPress={handleChat}>
                <MaterialIcons name="chat-bubble" size={18} color="#4cd7f6" />
                <Text className="text-on-surface text-[12px] font-medium">Chat Teknisi</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-3 px-3 rounded-xl bg-surface-container flex-row items-center justify-center gap-1.5" onPress={handlePDF}>
                <MaterialIcons name="picture-as-pdf" size={18} color="#adc6ff" />
                <Text className="text-on-surface text-[12px] font-medium">Cetak Invoice</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="w-full py-3 px-4 rounded-xl bg-surface-container-low flex-row items-center justify-center gap-2" onPress={handleDraft}>
              <MaterialIcons name="bookmark-border" size={18} color="#c2c6d6" />
              <Text className="text-on-surface-variant text-[12px]">Simpan ke Draft Rakitan Saya</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Checkout Bar: Total Estimasi Rakitan */}
      <View 
        className="absolute left-4 right-4 z-40 bg-surface-container-lowest/95 rounded-2xl p-3.5 flex-col gap-2.5 shadow-md"
        style={{ bottom: Math.max(insets.bottom, 16) + 64 + 16 }}
      >
        <View className="flex-row items-center justify-between px-1">
          <View>
            <Text className="text-[12px] text-on-surface-variant">Total Estimasi Rakitan</Text>
            <View className="flex-row items-baseline gap-1.5 mt-0.5">
              <Text className="text-[20px] text-on-surface font-bold tracking-tight">
                {formatRupiah(grandTotal > 0 ? grandTotal : totalPrice)}
              </Text>
              <Text className="text-[12px] text-outline font-medium">({filledCount} Item)</Text>
            </View>
          </View>
          <TouchableOpacity 
            className="flex-row items-center gap-0.5"
            onPress={() => router.push('/(tabs)')}
          >
            <Text className="text-[12px] text-secondary font-medium">Ubah Part</Text>
            <MaterialIcons name="chevron-right" size={16} color="#4cd7f6" />
          </TouchableOpacity>
        </View>
        
        {/* Main Action */}
        <View className="flex-row gap-2">
          <TouchableOpacity 
            className="flex-2 flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-surface-container-high"
            style={{ flex: 2 }}
            onPress={handleCheckout}
          >
            <MaterialIcons name="build-circle" size={18} color="#4cd7f6" />
            <Text className="text-on-surface text-[14px] font-semibold" numberOfLines={1}>Selesaikan</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl bg-primary-container"
            style={{ flex: 3 }}
            onPress={handleCheckout}
          >
            <MaterialIcons name="shopping-cart-checkout" size={20} color="#002e6a" />
            <Text className="text-on-primary text-[15px] font-bold" numberOfLines={1}>Beli Rakitan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
