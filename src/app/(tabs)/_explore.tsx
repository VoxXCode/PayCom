import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(true);
  const [warningRing, setWarningRing] = useState(false);
  const [voucherApplied, setVoucherApplied] = useState(true);

  const handleDismiss = () => {
    setShowWarning(false);
  };

  const handleResolve = () => {
    router.push('/(tabs)');
  };

  const handleCheckout = () => {
    if (showWarning) {
      setWarningRing(true);
      setTimeout(() => setWarningRing(false), 1200);
      Alert.alert(
        '⚠️ Konflik Belum Selesai',
        'Selesaikan ketidakcocokan Socket Processor & Motherboard sebelum melanjutkan ke pembayaran.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Selesaikan Konflik', onPress: () => router.push('/(tabs)') },
        ],
      );
    } else {
      Alert.alert('🎉 Pesanan Dikirim!', 'Rakitan PC kamu sedang diproses. Tim teknisi kami akan menghubungi kamu segera.', [{ text: 'OK' }]);
    }
  };

  const handleChat = () => {
    Alert.alert('Chat Teknisi', 'Fitur ini menghubungkan kamu langsung dengan teknisi PayCom Studio. Segera tersedia!', [{ text: 'OK' }]);
  };

  const handlePDF = () => {
    Alert.alert('Cetak Invoice', 'Invoice PDF untuk Rakitan #PC-8891 akan dikirim ke email kamu.', [{ text: 'OK' }]);
  };

  const handleDraft = () => {
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
    <View className="flex-1 bg-surface font-body-md text-on-surface">
      {/* Header */}
      <View 
        className="absolute top-0 w-full z-50 bg-surface-container-lowest/80 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="h-16 px-gutter flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-9 h-9 rounded-xl bg-surface-container-high items-center justify-center shadow-sm">
              <MaterialIcons name="memory" size={20} color="#4cd7f6" />
            </View>
            <View className="flex-col">
              <Text className="font-headline-md text-[20px] leading-tight text-on-surface font-bold tracking-tight">PayCom</Text>
              <Text className="font-label-mono-sm text-[11px] text-secondary leading-tight tracking-wider uppercase font-medium">Studio</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high/90">
              <MaterialIcons name="bolt" size={14} color="#4cd7f6" />
              <Text className="font-label-mono-sm text-[11px] text-on-surface font-bold tracking-tight">
                580W<Text className="text-outline font-normal">/750W</Text>
              </Text>
            </View>
            <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-xl bg-surface-container">
              <MaterialIcons name="notifications" size={20} color="#c2c6d6" />
            </TouchableOpacity>
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
              <MaterialIcons name="person" size={18} color="#002e6a" />
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 w-full bg-surface"
        contentContainerStyle={{ 
          paddingTop: Math.max(insets.top, 16) + 64, 
          paddingBottom: 40 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col w-full px-gutter pt-2 pb-6 space-y-4 gap-4">
          
          {/* Stepper & Top Context Bar */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-tertiary-container" />
              <Text className="font-label-mono-sm text-[11px] uppercase text-secondary tracking-widest">Rig Builder #PC-8891</Text>
            </View>
            <View className="px-2 py-0.5 rounded-full bg-surface-container-high">
              <Text className="font-label-mono-sm text-[11px] text-on-surface-variant">Langkah 4 / 4</Text>
            </View>
          </View>

          {/* Telemetry HUD Card */}
          <View className="overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-sm relative">
            <View className="flex-row items-center justify-between pb-3">
              <View className="flex-col">
                <Text className="font-headline-lg-mobile text-[22px] text-on-surface font-bold tracking-tight">Kalkulasi Rig</Text>
                <Text className="font-body-sm text-[12px] text-on-surface-variant">Konfigurasi Ultimate Workstation Gen-5</Text>
              </View>
              <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-container-highest shadow-sm">
                <MaterialIcons name="verified" size={16} color="#4cd7f6" />
                <Text className="font-label-mono-sm text-[11px] text-secondary font-bold">8 KOMPONEN</Text>
              </View>
            </View>
            
            {/* Telemetry Badges Strip */}
            <View className="flex-row gap-2 pt-1">
              <View className="flex-col p-2.5 rounded-xl bg-surface-container flex-1">
                <View className="flex-row items-center gap-1 pb-1">
                  <MaterialIcons name="bolt" size={14} color="#c2c6d6" />
                  <Text className="font-label-mono-sm text-[11px] text-outline">DAYA ESTIMASI</Text>
                </View>
                <Text className="font-label-mono-lg text-[14px] font-bold text-on-surface">580W <Text className="text-secondary text-[11px]">/ 750W</Text></Text>
                <View className="w-full h-1.5 rounded-full bg-surface-container-lowest mt-1.5 overflow-hidden">
                  <View className="h-full bg-primary rounded-full" style={{ width: '77.3%' }} />
                </View>
              </View>
              
              <View className="flex-col p-2.5 rounded-xl bg-surface-container flex-1">
                <View className="flex-row items-center gap-1 pb-1">
                  <MaterialIcons name="speed" size={14} color="#c2c6d6" />
                  <Text className="font-label-mono-sm text-[11px] text-outline">BOTTLENECK</Text>
                </View>
                <Text className="font-label-mono-lg text-[14px] font-bold text-secondary">1.2%</Text>
                <Text className="font-label-mono-sm text-[10px] text-on-surface-variant">Optimal {'<'} 5%</Text>
              </View>
              
              <View className="flex-col p-2.5 rounded-xl bg-surface-container flex-1">
                <View className="flex-row items-center gap-1 pb-1">
                  <MaterialIcons name="thermostat" size={14} color="#c2c6d6" />
                  <Text className="font-label-mono-sm text-[11px] text-outline">THERMAL</Text>
                </View>
                <Text className="font-label-mono-lg text-[14px] font-bold text-on-surface">32°C <Text className="text-outline text-[11px]">Idle</Text></Text>
                <Text className="font-label-mono-sm text-[10px] text-secondary">Dual AIO Rad</Text>
              </View>
            </View>
          </View>

          {/* Hardware Compatibility Warning Banner */}
          <View className={`overflow-hidden rounded-xl bg-surface-container-high p-4 shadow-sm relative ${warningRing ? 'border-2 border-tertiary-container' : ''} ${!showWarning ? 'opacity-50' : ''}`}>
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-container" />
            <View className="flex-row items-start gap-3 pl-1">
              <View className="w-8 h-8 rounded-xl bg-tertiary-container/20 items-center justify-center shrink-0">
                <MaterialIcons name="warning" size={20} color="#ffb3ad" />
              </View>
              <View className="flex-1 shrink">
                <View className="flex-row items-center justify-between gap-1">
                  <Text className="font-headline-md text-[15px] text-tertiary font-bold leading-tight">Konflik Socket Terdeteksi</Text>
                  <View className="px-1.5 py-0.5 rounded bg-tertiary-container">
                    <Text className="font-label-mono-sm text-[11px] text-on-tertiary-container font-bold">1 ERROR</Text>
                  </View>
                </View>
                <Text className="font-body-sm text-[12px] text-on-surface-variant mt-1 leading-snug">
                  Motherboard memakai socket <Text className="text-tertiary font-medium">AM5 (AMD)</Text> namun prosesor terpilih adalah <Text className="text-tertiary font-medium">LGA1700 (Intel)</Text>. Selesaikan konflik ini sebelum checkout.
                </Text>
                {showWarning && (
                  <View className="flex-row items-center gap-2 mt-3">
                    <TouchableOpacity className="px-3 py-1.5 rounded-lg bg-tertiary-container flex-row items-center gap-1 shadow-sm" onPress={handleResolve}>
                      <MaterialIcons name="build" size={16} color="#68000a" />
                      <Text className="text-on-tertiary font-body-sm text-[12px] font-semibold">Ganti Motherboard / CPU</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-2.5 py-1.5 rounded-lg bg-surface-container" onPress={handleDismiss}>
                      <Text className="text-on-surface-variant font-body-sm text-[12px]">Abaikan Sementara</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Quick Hardware Visual Strip */}
          <View className="flex-col gap-2 mt-2">
            <View className="flex-row items-center justify-between">
              <Text className="font-label-mono-sm text-[11px] uppercase text-outline">Komponen Utama Terpasang</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                <Text className="font-label-mono-sm text-[11px] text-secondary">Lihat Semua (8)</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-1" contentContainerStyle={{ gap: 8 }}>
              {/* Item 1 */}
              <View className="flex-row items-center gap-2 p-2 rounded-xl bg-surface-container-high w-56">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaAykO7w-zYz2ROy5dGp_BGCruzWVA6T0NaVbtCYhqrrgzI3vKnxV1ccPKHzyk2Y963AYU5EYdKXRQi_WmzFEaOSzEwYK7uArc2DqoWEVPX7iWa8g8wJJFPNzBPC0sGlZjWbvtEHzEB4B5UOnnQdPrrIx5BUnU1pTMIR5Ua0VJvBp7yU0IFNe_i2hWXsKQOWrKdi_r61EVH8HjB8XgrwEEm20-gXlA-H3-ZtlmBYGEdZ8l_1aCug' }} className="w-11 h-11 rounded-lg shrink-0" style={{ resizeMode: 'cover' }} />
                <View className="flex-1">
                  <Text className="font-label-mono-sm text-[11px] text-outline" numberOfLines={1}>PROCESSOR</Text>
                  <Text className="font-body-sm text-[12px] text-on-surface font-semibold" numberOfLines={1}>Ryzen 9 7900X</Text>
                  <Text className="font-label-mono-sm text-[11px] text-secondary">Rp 7.890.000</Text>
                </View>
              </View>
              {/* Item 2 */}
              <View className="flex-row items-center gap-2 p-2 rounded-xl bg-surface-container-high w-56">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdTa7by6dYCz8wMUpQrOsGlycw1Sw4wQjpw3uSrsETBRTfrDEVKKXxfJ53ZNabewI-OJ4_9SqrNN8QO2J_-IT9G5X80Ay9aXLSs3ihg-Wp-SY4shSSa4y-2XWK6Bg9TigVlK9kcoVv8eRrSV_i0DWCZbNbElL3rUpq78K-S88iCngIfsNqzS54LQ_Sim8iZVXvTCqtSesaSlPsUB1Tf_EVzrWMLlzf_i3oXwsPqx_uJgxbgENz8g' }} className="w-11 h-11 rounded-lg shrink-0" style={{ resizeMode: 'cover' }} />
                <View className="flex-1">
                  <Text className="font-label-mono-sm text-[11px] text-outline" numberOfLines={1}>GRAPHICS CARD</Text>
                  <Text className="font-body-sm text-[12px] text-on-surface font-semibold" numberOfLines={1}>RTX 4080 Super 16GB</Text>
                  <Text className="font-label-mono-sm text-[11px] text-secondary">Rp 18.450.000</Text>
                </View>
              </View>
              {/* Item 3 */}
              <View className="flex-row items-center gap-2 p-2 rounded-xl bg-surface-container-high w-56">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb3JLdgO4R4qgAKfoz-ZQBTDO5snkg-q_v8HZlsac80kq-VgbiKweQT4yr8LTvKsgXynUePL4NkkHrq8mqeJzWqR_GxfuNMdibjaOq0vNFR__id2a_1uq-Bh2d-I6OJCDJgvMYGunwxwYuK_dlK8fT7nLqyfBujqfcOGKhXzowf6pvj0yfdGnkoPQ4LJIvIYe1snoxrZjXyhYptPR8RupVkEKF9JC7Xj79-mSWqZyXFsBPLa0hWg' }} className="w-11 h-11 rounded-lg shrink-0" style={{ resizeMode: 'cover' }} />
                <View className="flex-1">
                  <Text className="font-label-mono-sm text-[11px] text-outline" numberOfLines={1}>MEMORY RAM</Text>
                  <Text className="font-body-sm text-[12px] text-on-surface font-semibold" numberOfLines={1}>Corsair Dominator 64GB</Text>
                  <Text className="font-label-mono-sm text-[11px] text-secondary">Rp 3.950.000</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Price Breakdown Card */}
          <View className="rounded-xl bg-surface-container p-4 shadow-sm flex-col space-y-3 mt-2 gap-3">
            <View className="flex-row items-center justify-between pb-2 border-b border-surface-variant/30">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="receipt-long" size={20} color="#4cd7f6" />
                <Text className="font-headline-md text-[17px] text-on-surface font-bold">Rincian Biaya Transparan</Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-surface-container-high">
                <Text className="font-label-mono-sm text-[11px] text-on-surface-variant">IDR / B2C</Text>
              </View>
            </View>

            {/* Line Items */}
            <View className="flex-col gap-2.5 pt-1">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="font-body-md text-[14px] text-on-surface">Subtotal Komponen</Text>
                  <View className="px-1.5 py-0.5 rounded bg-surface-container-high">
                    <Text className="font-label-mono-sm text-[11px] text-on-surface-variant">8 Item</Text>
                  </View>
                </View>
                <Text className="font-label-mono-lg text-[14px] text-on-surface font-bold">Rp 41.250.000</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-col">
                  <Text className="font-body-md text-[14px] text-on-surface">Perakitan & Cable Mgmt</Text>
                  <Text className="font-body-sm text-[12px] text-outline">Thermal paste Noctua NT-H2 applied</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="font-label-mono-sm text-[11px] line-through text-outline">Rp 250.000</Text>
                  <View className="px-2 py-0.5 rounded-full bg-secondary-container">
                    <Text className="font-label-mono-sm text-[11px] text-on-secondary-container font-bold uppercase tracking-wider">GRATIS</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-col">
                  <Text className="font-body-md text-[14px] text-on-surface">Stress Test 24 Jam Non-Stop</Text>
                  <Text className="font-body-sm text-[12px] text-outline">Cinebench R23, Furmark, MemTest86</Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-secondary-container">
                  <Text className="font-label-mono-sm text-[11px] text-on-secondary-container font-bold uppercase tracking-wider">TERMASUK</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-col">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="font-body-md text-[14px] text-on-surface">Asuransi Pengiriman Proteksi</Text>
                    <MaterialIcons name="verified-user" size={14} color="#4cd7f6" />
                  </View>
                  <Text className="font-body-sm text-[12px] text-outline">Klaim instan unit baru jika cacat logistik</Text>
                </View>
                <Text className="font-label-mono-lg text-[14px] text-on-surface font-semibold">Rp 150.000</Text>
              </View>

              <View className="flex-row items-center justify-between p-2 rounded-lg bg-surface-container-high mt-1">
                <View className="flex-row items-center gap-2">
                  <View className="w-6 h-6 rounded bg-primary-container items-center justify-center">
                    <MaterialIcons name="confirmation-number" size={14} color="#002e6a" />
                  </View>
                  <View className="flex-col">
                    <Text className="font-label-mono-sm text-[11px] text-primary font-bold">NEONPC2025</Text>
                    <Text className="font-body-sm text-[12px] text-on-surface-variant">Promo Builder Fest</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="font-label-mono-lg text-[14px] text-secondary font-bold">-Rp 500.000</Text>
                  <TouchableOpacity className="w-6 h-6 rounded items-center justify-center">
                    <MaterialIcons name="close" size={14} color="#8c909f" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-2">
                <View className="flex-row items-center gap-1.5">
                  <Text className="font-body-md text-[14px] text-on-surface">Garansi PayCom 1-to-1</Text>
                  <Text className="font-label-mono-sm text-[11px] text-secondary">365 Hari</Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-surface-container-high">
                  <Text className="font-label-mono-sm text-[11px] text-secondary font-bold uppercase tracking-wider">TERMASUK</Text>
                </View>
              </View>
            </View>

            {/* Grand Total Section Highlight */}
            <View className="mt-2 bg-surface-container-highest/60 p-4 rounded-b-xl flex-row items-center justify-between" style={{ marginHorizontal: -16, marginBottom: -16 }}>
              <View className="flex-col">
                <Text className="font-label-mono-sm text-[11px] uppercase text-outline tracking-wider">TOTAL PEMBAYARAN</Text>
                <Text className="font-body-sm text-[12px] text-on-surface-variant">PPN 11% sudah termasuk</Text>
              </View>
              <View className="flex-col items-end">
                <Text className="font-headline-lg-mobile text-[22px] text-primary font-bold tracking-tight">Rp 40.900.000</Text>
                <Text className="font-label-mono-sm text-[11px] text-secondary">Hemat Rp 750.000</Text>
              </View>
            </View>
          </View>

          {/* Trust & Protection Badges */}
          <View className="rounded-xl bg-surface-container-low p-4 shadow-sm flex-col gap-3 mt-2">
            <Text className="font-label-mono-sm text-[11px] uppercase text-outline tracking-wider">Standar Perakitan Studio PayCom</Text>
            <View className="flex-col gap-2.5">
              <View className="flex-row items-start gap-3 p-2 rounded-lg bg-surface-container">
                <View className="w-7 h-7 rounded-lg bg-secondary/15 items-center justify-center shrink-0">
                  <MaterialIcons name="verified" size={16} color="#4cd7f6" />
                </View>
                <View className="flex-1">
                  <Text className="font-body-md text-[14px] font-semibold text-on-surface leading-tight">100% Produk Original Distributor Resmi</Text>
                  <Text className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">Garansi resmi TAM, Synnex Metrodata, & Astrindo terdaftar serial number.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3 p-2 rounded-lg bg-surface-container">
                <View className="w-7 h-7 rounded-lg bg-secondary/15 items-center justify-center shrink-0">
                  <MaterialIcons name="cable" size={16} color="#4cd7f6" />
                </View>
                <View className="flex-1">
                  <Text className="font-body-md text-[14px] font-semibold text-on-surface leading-tight">Pro Cable Management & Airflow Optimal</Text>
                  <Text className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">Rute kabel tersembunyi dengan velcro kustom untuk jalur sirkulasi suhu stabil.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3 p-2 rounded-lg bg-surface-container">
                <View className="w-7 h-7 rounded-lg bg-secondary/15 items-center justify-center shrink-0">
                  <MaterialIcons name="inventory-2" size={16} color="#4cd7f6" />
                </View>
                <View className="flex-1">
                  <Text className="font-body-md text-[14px] font-semibold text-on-surface leading-tight">Free Packing Kayu Berasuransi Penuh</Text>
                  <Text className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">Ekstra bantalan airbag busa internal & peti kayu ekspedisi tahan banting antarkota.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Primary Checkout CTA & Secondary Workflow Buttons */}
          <View className="flex-col gap-2.5 pt-1 mt-2">
            <TouchableOpacity 
              onPress={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-primary-container flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="shopping-cart-checkout" size={20} color="#002e6a" />
                <Text className="text-on-primary-container font-headline-md text-[16px] font-bold">Beli Paket Rakitan</Text>
              </View>
              <View className="flex-row items-center gap-2">
                {showWarning && (
                  <View className="px-2 py-0.5 rounded-full bg-surface-container-highest flex-row items-center gap-1">
                    <MaterialIcons name="warning" size={12} color="#ffb3ad" />
                    <Text className="font-label-mono-sm text-[11px] text-tertiary">Perlu Review</Text>
                  </View>
                )}
                <MaterialIcons name="arrow-forward" size={18} color="#002e6a" />
              </View>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              <TouchableOpacity className="flex-1 py-2.5 px-3 rounded-xl bg-surface-container flex-row items-center justify-center gap-1.5" onPress={handleChat}>
                <MaterialIcons name="chat-bubble" size={18} color="#4cd7f6" />
                <Text className="text-on-surface font-body-sm text-[12px] font-medium">Chat Teknisi</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-2.5 px-3 rounded-xl bg-surface-container flex-row items-center justify-center gap-1.5" onPress={handlePDF}>
                <MaterialIcons name="picture-as-pdf" size={18} color="#adc6ff" />
                <Text className="text-on-surface font-body-sm text-[12px] font-medium">Cetak Invoice</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="w-full py-2.5 px-4 rounded-xl bg-surface-container-low flex-row items-center justify-center gap-2" onPress={handleDraft}>
              <MaterialIcons name="bookmark-border" size={18} color="#c2c6d6" />
              <Text className="text-on-surface-variant font-body-sm text-[12px]">Simpan ke Draft Rakitan Saya</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
