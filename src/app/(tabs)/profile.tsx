import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useBuild } from '../../context/BuildContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { SavedBuild } from '../../types/build';
import { deleteSavedBuild, fetchSavedBuilds } from '../../services/buildService';
import ErrorMessage from '../../components/ErrorMessage';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { user, signOut } = useAuth();
  const {
    filledCount,
    totalPrice,
    totalWattage,
    bottleneckText,
    voucherApplied,
    resetSlots,
    loadSlots,
    formatRupiah,
  } = useBuild();

  const initialName =
    (user?.user_metadata?.full_name as string) ||
    user?.email?.split('@')[0] ||
    'Builder PayCom';
  const initialEmail = user?.email || '-';
  const initialNim = (user?.user_metadata?.nim as string) || '-';
  const initialBio =
    (user?.user_metadata?.bio as string) || 'PC Enthusiast & Custom Rig Builder';

  const [userName, setUserName] = useState<string>(initialName);
  const [userEmail, setUserEmail] = useState<string>(initialEmail);
  const [userNim, setUserNim] = useState<string>(initialNim);
  const [userBio, setUserBio] = useState<string>(initialBio);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(userName);
  const [editNim, setEditNim] = useState<string>(userNim);
  const [editBio, setEditBio] = useState<string>(userBio);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  const [cloudSync, setCloudSync] = useState<boolean>(true);
  const [bottleneckAlert, setBottleneckAlert] = useState<boolean>(true);
  const [promoNotification, setPromoNotification] = useState<boolean>(false);

  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [isLoadingBuilds, setIsLoadingBuilds] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [buildsError, setBuildsError] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    setUserName(
      (user?.user_metadata?.full_name as string) ||
        user?.email?.split('@')[0] ||
        'Builder PayCom'
    );
    setUserEmail(user?.email || '-');
    setUserNim((user?.user_metadata?.nim as string) || '-');
    setUserBio(
      (user?.user_metadata?.bio as string) || 'PC Enthusiast & Custom Rig Builder'
    );
  }, [user]);

  const loadCloudBuilds = useCallback(async (isPullRefresh = false) => {
    if (isPullRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingBuilds(true);
    }
    setBuildsError(null);

    try {
      const data = await fetchSavedBuilds();
      setSavedBuilds(data);
    } catch (err: any) {
      setBuildsError(err?.message || 'Gagal memuat daftar draft rakitan dari cloud.');
    } finally {
      setIsLoadingBuilds(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadCloudBuilds();
    } else {
      setSavedBuilds([]);
      setIsLoadingBuilds(false);
    }
  }, [user?.id, loadCloudBuilds]);

  const handleOpenEdit = () => {
    setEditName(userName);
    setEditNim(userNim);
    setEditBio(userBio);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    const cleanName = editName.trim();
    if (!cleanName) {
      Alert.alert('Peringatan', 'Nama lengkap tidak boleh kosong.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: cleanName,
          nim: editNim.trim() || '-',
          bio: editBio.trim() || 'PC Enthusiast & Custom Rig Builder',
        },
      });

      if (error) {
        Alert.alert('Gagal Menyimpan', error.message);
        return;
      }

      setUserName(cleanName);
      setUserNim(editNim.trim() || '-');
      setUserBio(editBio.trim() || 'PC Enthusiast & Custom Rig Builder');
      setIsEditModalOpen(false);
      Alert.alert('Sukses', 'Profil berhasil diperbarui di Supabase!');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Gagal memperbarui profil.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
      setIsLogoutModalOpen(false);
      router.replace('/login');
    } catch (err: any) {
      Alert.alert('Error Keluar', err?.message || 'Gagal keluar dari sesi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLoadSavedBuild = (build: SavedBuild) => {
    if (!Array.isArray(build.slots_json) || build.slots_json.length === 0) {
      Alert.alert('Data Kosong', 'Konfigurasi komponen pada draft ini tidak valid.');
      return;
    }
    loadSlots(build.slots_json);
    Alert.alert('Draft Dimuat', `"${build.build_name}" berhasil dimuat ke perakit aktif.`, [
      { text: 'Lihat Rakitan', onPress: () => router.push('/(tabs)') },
    ]);
  };

  const handleDeleteSavedBuild = (build: SavedBuild) => {
    Alert.alert(
      'Hapus Draft Cloud',
      `Yakin ingin menghapus "${build.build_name}" dari cloud?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const previousBuilds = savedBuilds;
            setSavedBuilds((prev) => prev.filter((item) => item.id !== build.id));

            try {
              await deleteSavedBuild(build.id);
            } catch (err: any) {
              setSavedBuilds(previousBuilds);
              Alert.alert('Gagal Menghapus', err?.message || 'Operasi cloud gagal.');
            }
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
          <View className="flex-row items-center gap-1.5">
            <TouchableOpacity
              onPress={handleOpenEdit}
              className="h-10 px-3 flex-row items-center gap-1.5 rounded-xl bg-surface-container-low"
            >
              <MaterialIcons name="edit" size={16} color="#4cd7f6" />
              <Text className="text-[12px] text-secondary font-medium">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              disabled={isLoggingOut}
              className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container-low"
            >
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#f87171" />
              ) : (
                <MaterialIcons name="logout" size={18} color="#f87171" />
              )}
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadCloudBuilds(true)}
            tintColor="#4cd7f6"
          />
        }
      >
        <View className="flex-col w-full px-gutter py-4 gap-4">
          <View className="rounded-2xl p-5 bg-surface-container-high border border-surface-variant/20 shadow-md relative overflow-hidden">
            <View className="absolute -top-10 -right-10 w-36 h-36 bg-secondary/15 rounded-full" />
            <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full" />

            <View className="flex-row items-center gap-4 relative z-10">
              <View className="w-18 h-18 rounded-2xl bg-secondary/20 border-2 border-secondary/60 items-center justify-center relative shadow-sm">
                <MaterialIcons name="person" size={38} color="#4cd7f6" />
                <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface-container-high" />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-[18px] text-on-surface font-bold" numberOfLines={1}>
                    {userName}
                  </Text>
                </View>
                <Text className="text-[12px] text-on-surface-variant mt-0.5" numberOfLines={1}>
                  {userEmail}
                </Text>
                <View className="flex-row flex-wrap items-center gap-1.5 mt-2">
                  <View className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
                    <Text className="text-[10px] text-primary font-semibold">Authenticated</Text>
                  </View>
                  {userNim !== '-' && (
                    <View className="px-2 py-0.5 rounded-full bg-secondary/20 border border-secondary/30">
                      <Text className="text-[10px] text-secondary font-semibold">NIM: {userNim}</Text>
                    </View>
                  )}
                </View>
                {user?.id && (
                  <Text className="text-[10px] text-outline mt-1.5 font-mono" numberOfLines={1}>
                    UID: {user.id}
                  </Text>
                )}
              </View>
            </View>

            <View className="mt-4 pt-3 border-t border-surface-variant/30 relative z-10">
              <Text className="text-[12px] text-on-surface-variant italic">
                "{userBio}"
              </Text>
            </View>
          </View>

          <View className="rounded-2xl p-4 bg-surface-container-low border border-surface-variant/20 gap-3">
            <View className="flex-row items-center justify-between pb-2 border-b border-surface-variant/20">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="cloud-done" size={18} color="#4cd7f6" />
                <View>
                  <Text className="text-[14px] font-bold text-on-surface">
                    Draft Rakitan Cloud
                  </Text>
                  <Text className="text-[10px] text-outline">
                    Terisolasi per akun via Supabase RLS
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => loadCloudBuilds(true)}
                className="px-2.5 py-1 rounded-lg bg-surface-container flex-row items-center gap-1"
              >
                <MaterialIcons name="refresh" size={14} color="#4cd7f6" />
                <Text className="text-[11px] text-secondary font-semibold">Segarkan</Text>
              </TouchableOpacity>
            </View>

            {isLoadingBuilds ? (
              <View className="py-6 items-center justify-center gap-2">
                <ActivityIndicator size="small" color="#4cd7f6" />
                <Text className="text-[12px] text-on-surface-variant">
                  Mengambil draft rakitan dari cloud...
                </Text>
              </View>
            ) : buildsError ? (
              <ErrorMessage message={buildsError} onRetry={() => loadCloudBuilds()} />
            ) : savedBuilds.length === 0 ? (
              <View className="py-5 px-3 rounded-xl bg-surface-container/60 items-center gap-1.5">
                <MaterialIcons name="cloud-off" size={24} color="#8c909f" />
                <Text className="text-[12px] font-semibold text-on-surface">
                  Belum Ada Draft Tersimpan
                </Text>
                <Text className="text-[11px] text-outline text-center">
                  Pilih komponen lalu simpan lewat halaman Ringkasan untuk menyimpannya ke akun ini.
                </Text>
              </View>
            ) : (
              <View className="gap-2.5">
                {savedBuilds.map((build) => (
                  <View
                    key={build.id}
                    className="p-3 rounded-xl bg-surface-container border border-surface-variant/20 gap-2"
                  >
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="flex-1">
                        <Text className="text-[13px] font-bold text-on-surface" numberOfLines={1}>
                          {build.build_name}
                        </Text>
                        <Text className="text-[11px] text-outline mt-0.5">
                          {build.filled_count} Komponen • {build.total_wattage}W
                        </Text>
                      </View>
                      <Text className="text-[12px] font-bold text-secondary">
                        {formatRupiah(build.total_price)}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-end gap-2 pt-1 border-t border-surface-variant/15">
                      <TouchableOpacity
                        onPress={() => handleDeleteSavedBuild(build)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/30 border border-red-500/20 flex-row items-center gap-1"
                      >
                        <MaterialIcons name="delete-outline" size={14} color="#f87171" />
                        <Text className="text-[11px] font-semibold text-red-400">Hapus</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleLoadSavedBuild(build)}
                        className="px-3 py-1.5 rounded-lg bg-secondary/15 border border-secondary/30 flex-row items-center gap-1"
                      >
                        <MaterialIcons name="download" size={14} color="#4cd7f6" />
                        <Text className="text-[11px] font-semibold text-secondary">Muat Rakitan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

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

          <View className="rounded-2xl p-4 bg-surface-container-low border border-surface-variant/20 gap-3">
            <Text className="text-[14px] font-bold text-on-surface">Pengaturan & Preferensi</Text>

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
                thumbColor={cloudSync ? '#4cd7f6' : '#8c909f'}
                trackColor={{ false: '#2e2e36', true: '#004d60' }}
              />
            </View>

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
                thumbColor={bottleneckAlert ? '#adc6ff' : '#8c909f'}
                trackColor={{ false: '#2e2e36', true: '#002e6a' }}
              />
            </View>

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
                thumbColor={promoNotification ? '#f87171' : '#8c909f'}
                trackColor={{ false: '#2e2e36', true: '#5a1b1b' }}
              />
            </View>
          </View>

          <View className="rounded-2xl p-4 bg-surface-container-low border border-surface-variant/20 gap-2">
            <Text className="text-[14px] font-bold text-on-surface mb-1">Aksi Akun</Text>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Bantuan PayCom',
                  'Pusat bantuan & dokumentasi praktikum dapat diakses di Lab Pemrograman Mobile UMM.',
                  [{ text: 'OK' }]
                )
              }
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
              disabled={isLoggingOut}
              className="py-3 px-3 rounded-xl bg-red-950/30 border border-red-500/20 flex-row items-center justify-between mt-1"
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="logout" size={20} color="#f87171" />
                <Text className="text-[13px] font-semibold text-red-400">
                  {isLoggingOut ? 'Mengeluarkan sesi...' : 'Keluar dari Akun'}
                </Text>
              </View>
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#f87171" />
              ) : (
                <MaterialIcons name="chevron-right" size={18} color="#f87171" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View
            className="bg-surface-container-high rounded-t-3xl p-5 border-t border-surface-variant/30 gap-4"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          >
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
                  editable={!isSavingProfile}
                  placeholder="Masukkan nama"
                  placeholderTextColor="#8c909f"
                  className="h-11 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-[13px]"
                />
              </View>

              <View>
                <Text className="text-[11px] text-outline font-medium mb-1">NIM / ID Praktikan</Text>
                <TextInput
                  value={editNim}
                  onChangeText={setEditNim}
                  editable={!isSavingProfile}
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
                  editable={!isSavingProfile}
                  placeholder="Bio builder..."
                  placeholderTextColor="#8c909f"
                  className="h-11 px-3 rounded-xl bg-surface-container-lowest text-on-surface text-[13px]"
                />
              </View>
            </View>

            <View className="flex-row gap-2 pt-2">
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                disabled={isSavingProfile}
                className="flex-1 py-3 rounded-xl bg-surface-container items-center justify-center"
              >
                <Text className="text-[13px] font-semibold text-on-surface-variant">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={isSavingProfile}
                className="flex-1 py-3 rounded-xl bg-primary items-center justify-center flex-row gap-1.5"
              >
                {isSavingProfile && <ActivityIndicator size="small" color="#002e6a" />}
                <Text className="text-[13px] font-bold text-on-primary">
                  {isSavingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isLogoutModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => !isLoggingOut && setIsLogoutModalOpen(false)}
      >
        <View className="flex-1 justify-center items-center px-6 bg-black/70">
          <View className="w-full max-w-[360px] bg-surface-container-high rounded-2xl p-5 border border-surface-variant/30 gap-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-red-950/50 border border-red-500/30 items-center justify-center">
                <MaterialIcons name="logout" size={20} color="#f87171" />
              </View>
              <View className="flex-1">
                <Text className="text-[16px] font-bold text-on-surface">Konfirmasi Keluar</Text>
                <Text className="text-[12px] text-on-surface-variant mt-0.5">
                  Sesi akan diakhiri dan token dihapus dari perangkat.
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2.5 pt-1">
              <TouchableOpacity
                onPress={() => setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="flex-1 py-3 rounded-xl bg-surface-container items-center justify-center"
              >
                <Text className="text-[13px] font-semibold text-on-surface-variant">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 py-3 rounded-xl bg-red-500/90 items-center justify-center flex-row gap-1.5"
              >
                {isLoggingOut && <ActivityIndicator size="small" color="#ffffff" />}
                <Text className="text-[13px] font-bold text-white">
                  {isLoggingOut ? 'Keluar...' : 'Ya, Keluar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
