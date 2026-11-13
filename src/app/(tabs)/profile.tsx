import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useBuild } from '../../context/BuildContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    filledCount,
    totalPrice,
    totalWattage,
    bottleneckText,
    voucherApplied,
    resetSlots,
    formatRupiah,
  } = useBuild();

  // State Profil Pengguna
  const [userName, setUserName] = useState<string>('Praktikan UMM Mobile');
  const [userEmail, setUserEmail] = useState<string>('praktikan@paycom.id');
  const [userNim, setUserNim] = useState<string>('202210370311234');
  const [userBio, setUserBio] = useState<string>('PC Enthusiast & Custom Rig Builder');

  // State Form Edit Profil Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(userName);
  const [editEmail, setEditEmail] = useState<string>(userEmail);
  const [editNim, setEditNim] = useState<string>(userNim);
  const [editBio, setEditBio] = useState<string>(userBio);

  // State Pengaturan Preferensi
  const [cloudSync, setCloudSync] = useState<boolean>(true);
  const [bottleneckAlert, setBottleneckAlert] = useState<boolean>(true);
  const [promoNotification, setPromoNotification] = useState<boolean>(false);

  useEffect(() => {
    console.log('[PayCom] ProfileScreen berhasil dimuat.');
  }, []);

  const handleOpenEdit = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setEditNim(userNim);
    setEditBio(userBio);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Peringatan', 'Nama lengkap tidak boleh kosong.');
      return;
    }
    setUserName(editName.trim());
    setUserEmail(editEmail.trim());
    setUserNim(editNim.trim());
    setUserBio(editBio.trim());
    setIsEditModalOpen(false);
    Alert.alert('Sukses', 'Profil berhasil diperbarui!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah kamu yakin ingin keluar dari sesi akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sesi Berakhir', 'Kamu telah keluar dari akun.', [
              {
                text: 'Ke Halaman Login',
                onPress: () => router.push('/login'),
              },
              {
                text: 'Mode Tamu',
                onPress: () => router.push('/(tabs)'),
              },
            ]);
          },
        },
      ]
    );
  };

  const handleResetBuild = () => {
    Alert.alert(
      'Reset Rakitan',
      'Semua komponen yang telah dipilih akan dikosongkan. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Kosongkan',
          style: 'destructive',
          onPress: () => {
            resetSlots();
            Alert.alert('Sukses', 'Rakitan berhasil direset.');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-surface relative">
      <StatusBar style="light" />

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
            <View className="px-2 py-0.5 rounded bg-surface-container-low border border-surface-variant/30">
              <Text className="text-[11px] text-secondary font-medium">Profil</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity 
              onPress={handleOpenEdit}
              className="h-10 px-3 flex-row items-center gap-1.5 rounded-xl bg-surface-container-low"
            >
              <MaterialIcons name="edit" size={16} color="#4cd7f6" />
              <Text className="text-[12px] text-secondary font-medium">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/login')}
              className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container-low"
            >
              <MaterialIcons name="login" size={18} color="#c2c6d6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 w-full bg-surface"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 64,
          paddingBottom: 32 + 64 + Math.max(insets.bottom, 16),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col w-full px-gutter py-4 gap-4">
          
          {/* 1. Profile Hero Card */}
          <View className="rounded-2xl p-5 bg-surface-container-high border border-surface-variant/20 shadow-md relative overflow-hidden">
            {/* Ambient Background Glow */}
            <View className="absolute -top-10 -right-10 w-36 h-36 bg-secondary/15 rounded-full" />
            <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full" />

            <View className="flex-row items-center gap-4 relative z-10">
              {/* Avatar */}
              <View className="w-18 h-18 rounded-2xl bg-secondary/20 border-2 border-secondary/60 items-center justify-center relative shadow-sm">
                <MaterialIcons name="person" size={38} color="#4cd7f6" />
                <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface-container-high" />
              </View>

              {/* Identity Info */}
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-[18px] text-on-surface font-bold" numberOfLines={1}>
                    {userName}
                  </Text>
                </View>
                <Text className="text-[12px] text-on-surface-variant mt-0.5" numberOfLines={1}>
                  {userEmail}
                </Text>
                <View className="flex-row items-center gap-2 mt-2">
                  <View className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
                    <Text className="text-[10px] text-primary font-semibold">Pro Builder</Text>
                  </View>
                  <View className="px-2 py-0.5 rounded-full bg-secondary/20 border border-secondary/30">
                    <Text className="text-[10px] text-secondary font-semibold">NIM: {userNim}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Bio */}
            <View className="mt-4 pt-3 border-t border-surface-variant/30 relative z-10">
              <Text className="text-[12px] text-on-surface-variant italic">
                "{userBio}"
              </Text>
            </View>
          </View>

          {/* 2. Live Rig Status Telemetry */}
          <View className="rounded-2xl p-4 bg-surface-container-low border border-surface-variant/20">
            <View className="flex-row items-center justify-between pb-3 border-b border-surface-variant/20">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="memory" size={18} color="#4cd7f6" />
                <Text className="text-[14px] font-bold text-on-surface">Status Rakitan Aktif</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)')}
                className="flex-row items-center gap-0.5"
              >
                <Text className="text-[12px] text-secondary font-semibold">Ubah Komponen</Text>
                <MaterialIcons name="chevron-right" size={14} color="#4cd7f6" />
              </TouchableOpacity>
            </View>

            <View className="grid grid-cols-2 gap-2.5 pt-3">
              <View className="flex-row gap-2.5">
                <View className="flex-1 bg-surface-container p-3 rounded-xl">
                  <Text className="text-[11px] text-outline">Komponen Terpasang</Text>
                  <Text className="text-[16px] font-bold text-on-surface mt-1">{filledCount} / 5 Slot</Text>
                  <Text className="text-[10px] text-secondary mt-0.5">
                    {filledCount === 5 ? 'Lengkap & Siap Pakai' : 'Belum Lengkap'}
                  </Text>
                </View>

                <View className="flex-1 bg-surface-container p-3 rounded-xl">
                  <Text className="text-[11px] text-outline">Estimasi Daya</Text>
                  <Text className="text-[16px] font-bold text-secondary mt-1">{totalWattage} W</Text>
                  <Text className="text-[10px] text-outline mt-0.5">PSU Rec: 750W</Text>
                </View>
              </View>

              <View className="flex-row gap-2.5 mt-2.5">
                <View className="flex-1 bg-surface-container p-3 rounded-xl">
                  <Text className="text-[11px] text-outline">Total Estimasi Harga</Text>
                  <Text className="text-[14px] font-bold text-primary mt-1" numberOfLines={1}>
                    {formatRupiah(totalPrice)}
                  </Text>
                  <Text className="text-[10px] text-outline mt-0.5">
                    {voucherApplied ? 'Voucher Rp 500rb Aktif' : 'Tanpa Voucher'}
                  </Text>
                </View>

                <View className="flex-1 bg-surface-container p-3 rounded-xl">
                  <Text className="text-[11px] text-outline">Bottleneck</Text>
                  <Text className="text-[13px] font-semibold text-on-surface mt-1" numberOfLines={1}>
                    {bottleneckText}
                  </Text>
                  <Text className="text-[10px] text-outline mt-0.5">Keseimbangan CPU/GPU</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions for Rig */}
            <View className="flex-row gap-2 pt-3 mt-1">
              <TouchableOpacity 
                onPress={() => router.push('/invoice')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-secondary/15 flex-row items-center justify-center gap-1.5"
              >
                <MaterialIcons name="receipt-long" size={16} color="#4cd7f6" />
                <Text className="text-secondary text-[12px] font-semibold">Buka Invoice</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleResetBuild}
                className="py-2.5 px-3 rounded-xl bg-surface-container-high flex-row items-center justify-center gap-1.5"
              >
                <MaterialIcons name="refresh" size={16} color="#c2c6d6" />
                <Text className="text-on-surface-variant text-[12px] font-semibold">Reset Rakit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Account Preferences */}
          <View className="rounded-2xl p-4 bg-surface-container-low border border-surface-variant/20 gap-3">
            <Text className="text-[14px] font-bold text-on-surface">Pengaturan & Preferensi</Text>
            
            {/* Toggle 1: Cloud Sync */}
            <View className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                <View className="w-8 h-8 rounded-lg bg-surface-container items-center justify-center">
                  <MaterialIcons name="cloud-sync" size={18} color="#4cd7f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-on-surface">Auto-Sync Cloud</Text>
                  <Text className="text-[11px] text-outline">Simpan konfigurasi rakitan otomatis</Text>
                </View>
              </View>
              <Switch 
                value={cloudSync}
                onValueChange={setCloudSync}
                thumbColor={cloudSync ? "#4cd7f6" : "#8c909f"}
                trackColor={{ false: "#2e2e36", true: "#004d60" }}
              />
            </View>

            {/* Toggle 2: Bottleneck Alert */}
            <View className="flex-row items-center justify-between py-1 border-t border-surface-variant/20">
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                <View className="w-8 h-8 rounded-lg bg-surface-container items-center justify-center">
                  <MaterialIcons name="warning-amber" size={18} color="#adc6ff" />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-on-surface">Peringatan Bottleneck</Text>
                  <Text className="text-[11px] text-outline">Notifikasi saat CPU & GPU tidak seimbang</Text>
                </View>
              </View>
              <Switch 
                value={bottleneckAlert}
                onValueChange={setBottleneckAlert}
                thumbColor={bottleneckAlert ? "#adc6ff" : "#8c909f"}
                trackColor={{ false: "#2e2e36", true: "#002e6a" }}
              />
            </View>

            {/* Toggle 3: Promo & Diskon */}
            <View className="flex-row items-center justify-between py-1 border-t border-surface-variant/20">
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                <View className="w-8 h-8 rounded-lg bg-surface-container items-center justify-center">
                  <MaterialIcons name="local-offer" size={18} color="#fca5a5" />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-on-surface">Notifikasi Promo Diskon</Text>
                  <Text className="text-[11px] text-outline">Dapatkan update harga promo komponen</Text>
                </View>
              </View>
              <Switch 
                value={promoNotification}
                onValueChange={setPromoNotification}
                thumbColor={promoNotification ? "#f87171" : "#8c909f"}
                trackColor={{ false: "#2e2e36", true: "#5a1b1b" }}
              />
            </View>
          </View>

          {/* 4. Action Menu */}
          <View className="rounded-2xl p-4 bg-surface-container-low border border-surface-variant/20 gap-2">
            <Text className="text-[14px] font-bold text-on-surface mb-1">Aksi Akun</Text>

            <TouchableOpacity 
              onPress={() => router.push('/login')}
              className="py-3 px-3 rounded-xl bg-surface-container flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="switch-account" size={20} color="#4cd7f6" />
                <Text className="text-[13px] font-medium text-on-surface">Masuk ke Akun Lain</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color="#8c909f" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Alert.alert('Bantuan PayCom', 'Pusat bantuan & dokumentasi praktikum dapat diakses di Lab Pemrograman Mobile UMM.', [{ text: 'OK' }])}
              className="py-3 px-3 rounded-xl bg-surface-container flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="help-center" size={20} color="#adc6ff" />
                <Text className="text-[13px] font-medium text-on-surface">Pusat Bantuan & Panduan</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color="#8c909f" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogout}
              className="py-3 px-3 rounded-xl bg-red-950/30 border border-red-500/20 flex-row items-center justify-between mt-1"
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="logout" size={20} color="#f87171" />
                <Text className="text-[13px] font-semibold text-red-400">Keluar dari Akun</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color="#f87171" />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-surface-container-high rounded-t-3xl p-5 border-t border-surface-variant/30 gap-4" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            <View className="flex-row items-center justify-between pb-2 border-b border-surface-variant/20">
              <Text className="text-[16px] font-bold text-on-surface">Edit Profil Builder</Text>
              <TouchableOpacity 
                onPress={() => setIsEditModalOpen(false)}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container"
              >
                <MaterialIcons name="close" size={18} color="#c2c6d6" />
              </TouchableOpacity>
            </View>

            <View className="flex-col gap-3">
              <View>
                <Text className="text-[11px] text-outline font-medium mb-1">Nama Lengkap</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Masukkan nama"
                  placeholderTextColor="#8c909f"
                  className="h-11 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-[13px]"
                />
              </View>

              <View>
                <Text className="text-[11px] text-outline font-medium mb-1">Email</Text>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="builder@paycom.id"
                  placeholderTextColor="#8c909f"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="h-11 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-[13px]"
                />
              </View>

              <View>
                <Text className="text-[11px] text-outline font-medium mb-1">NIM / ID Praktikan</Text>
                <TextInput
                  value={editNim}
                  onChangeText={setEditNim}
                  placeholder="202210370311xxx"
                  placeholderTextColor="#8c909f"
                  className="h-11 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-[13px]"
                />
              </View>

              <View>
                <Text className="text-[11px] text-outline font-medium mb-1">Bio / Slogan</Text>
                <TextInput
                  value={editBio}
                  onChangeText={setEditBio}
                  placeholder="Bio builder..."
                  placeholderTextColor="#8c909f"
                  className="h-11 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-[13px]"
                />
              </View>
            </View>

            <View className="flex-row gap-2 pt-2">
              <TouchableOpacity 
                onPress={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-surface-container items-center justify-center"
              >
                <Text className="text-[13px] font-semibold text-on-surface-variant">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSaveProfile}
                className="flex-1 py-3 rounded-xl bg-primary items-center justify-center"
              >
                <Text className="text-[13px] font-bold text-on-primary">Simpan Profil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

