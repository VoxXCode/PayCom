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
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
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
    <View className="flex-1 bg-[#0b0f19] relative">
      <StatusBar style="light" />

      {/* Top Header */}
      <View
        className="w-full z-40 bg-[#0b0f19]/95 border-b border-[#1e293b]"
        style={{ paddingTop: Math.max(insets.top, 14) }}
      >
        <View className="h-14 px-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 items-center justify-center">
              <MaterialIcons name="person" size={18} color="#38bdf8" />
            </View>
            <Text className="text-[17px] font-extrabold text-white">
              Profil Pengguna
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleOpenEdit}
              className="h-8 px-3 rounded-xl bg-[#151c2c] border border-[#222f46] flex-row items-center gap-1"
            >
              <MaterialIcons name="edit" size={14} color="#38bdf8" />
              <Text className="text-[11px] font-bold text-[#38bdf8]">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="w-8 h-8 rounded-xl bg-red-950/40 border border-red-500/30 items-center justify-center"
            >
              <MaterialIcons name="logout" size={16} color="#f87171" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 w-full bg-[#0b0f19]"
        contentContainerStyle={{
          paddingTop: 14,
          paddingBottom: 40 + 64 + Math.max(insets.bottom, 16),
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadCloudBuilds(true)}
            tintColor="#38bdf8"
            colors={['#38bdf8']}
          />
        }
      >
        {/* User Card matching reference */}
        <View className="rounded-3xl bg-[#151c2c] border border-[#222f46] p-5 mb-4 shadow-sm relative overflow-hidden">
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#0284c7] items-center justify-center shadow-lg shadow-blue-600/30">
              <Text className="text-[24px] font-extrabold text-white">
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-[17px] font-extrabold text-white leading-tight">
                  {userName}
                </Text>
                <View className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
                  <Text className="text-[9px] font-bold text-[#38bdf8] uppercase">Pro Builder</Text>
                </View>
              </View>
              <Text className="text-[12px] text-[#94a3b8] mt-1">{userEmail}</Text>
              <Text className="text-[11px] text-[#64748b] mt-0.5">NIM: {userNim}</Text>
            </View>
          </View>

          <View className="mt-4 pt-3 border-t border-[#1e293b]">
            <Text className="text-[12px] text-slate-300 italic leading-relaxed">
              "{userBio}"
            </Text>
          </View>
        </View>

        {/* Active Rig Quick Stats */}
        <View className="rounded-2xl bg-[#151c2c] border border-[#222f46] p-4 mb-4 gap-3">
          <View className="flex-row items-center justify-between pb-2 border-b border-[#1e293b]">
            <Text className="text-[13px] font-bold text-white uppercase tracking-wider">
              Status Rig Aktif
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)')}>
              <Text className="text-[12px] font-bold text-[#38bdf8]">Buka Studio</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1 bg-[#0f1422] p-2.5 rounded-xl border border-[#1e293b]">
              <Text className="text-[10px] text-[#64748b]">Slot Terpasang</Text>
              <Text className="text-[13px] font-bold text-white mt-0.5">{filledCount} / 5</Text>
            </View>
            <View className="flex-1 bg-[#0f1422] p-2.5 rounded-xl border border-[#1e293b]">
              <Text className="text-[10px] text-[#64748b]">Total Daya</Text>
              <Text className="text-[13px] font-bold text-[#38bdf8] mt-0.5">{totalWattage}W</Text>
            </View>
            <View className="flex-1 bg-[#0f1422] p-2.5 rounded-xl border border-[#1e293b]">
              <Text className="text-[10px] text-[#64748b]">Estimasi Biaya</Text>
              <Text className="text-[12px] font-bold text-white mt-0.5" numberOfLines={1}>
                {formatRupiah(totalPrice)}
              </Text>
            </View>
          </View>
        </View>

        {/* Saved Builds Cloud List */}
        <View className="rounded-2xl bg-[#151c2c] border border-[#222f46] p-4 mb-4 gap-3">
          <View className="flex-row items-center justify-between pb-2 border-b border-[#1e293b]">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="cloud-done" size={18} color="#38bdf8" />
              <Text className="text-[14px] font-bold text-white">Draft Rakitan di Cloud</Text>
            </View>
            <TouchableOpacity
              onPress={() => loadCloudBuilds(true)}
              className="w-7 h-7 rounded-lg bg-[#0f1422] items-center justify-center"
            >
              <MaterialIcons name="refresh" size={16} color="#38bdf8" />
            </TouchableOpacity>
          </View>

          {isLoadingBuilds ? (
            <View className="py-6 items-center justify-center">
              <ActivityIndicator size="small" color="#38bdf8" />
              <Text className="text-[11px] text-[#94a3b8] mt-2">Memuat draft rakitan...</Text>
            </View>
          ) : buildsError ? (
            <ErrorMessage message={buildsError} onRetry={() => loadCloudBuilds()} />
          ) : savedBuilds.length === 0 ? (
            <View className="py-6 items-center justify-center">
              <MaterialIcons name="cloud-queue" size={32} color="#64748b" />
              <Text className="text-[12px] text-[#94a3b8] mt-2">Belum ada draft tersimpan.</Text>
            </View>
          ) : (
            <View className="gap-2.5">
              {savedBuilds.map((b) => (
                <View
                  key={b.id}
                  className="p-3 rounded-xl bg-[#0f1422] border border-[#1e293b] flex-row items-center justify-between"
                >
                  <View className="flex-1 pr-2">
                    <Text className="text-[13px] font-bold text-white" numberOfLines={1}>
                      {b.build_name}
                    </Text>
                    <Text className="text-[11px] text-[#94a3b8] mt-0.5">
                      {b.filled_count} item • {b.total_wattage}W • {formatRupiah(b.total_price)}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5">
                    <TouchableOpacity
                      onPress={() => handleLoadSavedBuild(b)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#2563eb]"
                    >
                      <Text className="text-[11px] font-bold text-white">Muat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteSavedBuild(b)}
                      className="w-7 h-7 rounded-lg bg-red-950/40 items-center justify-center"
                    >
                      <MaterialIcons name="delete-outline" size={16} color="#f87171" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Preferences & Settings */}
        <View className="rounded-2xl bg-[#151c2c] border border-[#222f46] p-4 mb-4 gap-3">
          <Text className="text-[13px] font-bold text-white uppercase tracking-wider pb-2 border-b border-[#1e293b]">
            Pengaturan Aplikasi
          </Text>

          <View className="flex-row items-center justify-between py-1">
            <View>
              <Text className="text-[13px] font-semibold text-white">Sinkronisasi Cloud</Text>
              <Text className="text-[11px] text-[#64748b]">Simpan otomatis rakitan ke Supabase</Text>
            </View>
            <Switch
              value={cloudSync}
              onValueChange={setCloudSync}
              thumbColor={cloudSync ? '#38bdf8' : '#64748b'}
              trackColor={{ false: '#1e293b', true: '#0284c7' }}
            />
          </View>

          <View className="flex-row items-center justify-between py-1 border-t border-[#1e293b]">
            <View>
              <Text className="text-[13px] font-semibold text-white">Peringatan Bottleneck</Text>
              <Text className="text-[11px] text-[#64748b]">Notifikasi jika hardware tidak seimbang</Text>
            </View>
            <Switch
              value={bottleneckAlert}
              onValueChange={setBottleneckAlert}
              thumbColor={bottleneckAlert ? '#38bdf8' : '#64748b'}
              trackColor={{ false: '#1e293b', true: '#0284c7' }}
            />
          </View>

          <View className="flex-row items-center justify-between py-1 border-t border-[#1e293b]">
            <View>
              <Text className="text-[13px] font-semibold text-white">Notifikasi Promo & Diskon</Text>
              <Text className="text-[11px] text-[#64748b]">Kabar voucher komponen terbaru</Text>
            </View>
            <Switch
              value={promoNotification}
              onValueChange={setPromoNotification}
              thumbColor={promoNotification ? '#38bdf8' : '#64748b'}
              trackColor={{ false: '#1e293b', true: '#0284c7' }}
            />
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
        <View className="flex-1 justify-end bg-black/70">
          <View
            className="bg-[#151c2c] rounded-t-3xl p-5 border-t border-[#2b3a55] gap-4"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          >
            <View className="flex-row items-center justify-between pb-2 border-b border-[#1e293b]">
              <Text className="text-[16px] font-bold text-white">Edit Profil</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                className="w-8 h-8 items-center justify-center rounded-full bg-[#1e293b]"
              >
                <MaterialIcons name="close" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              <View>
                <Text className="text-[12px] font-semibold text-[#94a3b8] mb-1">Nama Lengkap</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  className="h-12 px-3.5 rounded-2xl bg-[#0f1422] border border-[#222f46] text-white text-[13px]"
                />
              </View>

              <View>
                <Text className="text-[12px] font-semibold text-[#94a3b8] mb-1">NIM / ID</Text>
                <TextInput
                  value={editNim}
                  onChangeText={setEditNim}
                  className="h-12 px-3.5 rounded-2xl bg-[#0f1422] border border-[#222f46] text-white text-[13px]"
                />
              </View>

              <View>
                <Text className="text-[12px] font-semibold text-[#94a3b8] mb-1">Bio / Status</Text>
                <TextInput
                  value={editBio}
                  onChangeText={setEditBio}
                  multiline
                  className="h-20 px-3.5 py-2.5 rounded-2xl bg-[#0f1422] border border-[#222f46] text-white text-[13px]"
                />
              </View>
            </View>

            <View className="flex-row gap-2 pt-2">
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                disabled={isSavingProfile}
                className="flex-1 py-3 rounded-full bg-[#1e293b] items-center justify-center"
              >
                <Text className="text-[13px] font-bold text-[#94a3b8]">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={isSavingProfile}
                className="flex-1 py-3 rounded-full bg-[#2563eb] items-center justify-center flex-row gap-1.5 shadow-md shadow-blue-600/30"
              >
                {isSavingProfile && <ActivityIndicator size="small" color="#ffffff" />}
                <Text className="text-[13px] font-bold text-white">
                  {isSavingProfile ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={isLogoutModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsLogoutModalOpen(false)}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <View className="w-full max-w-[340px] bg-[#151c2c] rounded-3xl p-5 border border-[#222f46] gap-4">
            <View className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-500/30 items-center justify-center self-center">
              <MaterialIcons name="logout" size={24} color="#f87171" />
            </View>

            <View className="items-center">
              <Text className="text-[17px] font-bold text-white text-center">Keluar dari Akun?</Text>
              <Text className="text-[12px] text-[#94a3b8] text-center mt-1">
                Sesi akun akan diakhiri. Kamu dapat masuk kembali kapan saja.
              </Text>
            </View>

            <View className="flex-row gap-2 pt-2">
              <TouchableOpacity
                onPress={() => setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="flex-1 py-3 rounded-full bg-[#1e293b] items-center justify-center"
              >
                <Text className="text-[13px] font-bold text-[#94a3b8]">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 py-3 rounded-full bg-red-600 items-center justify-center flex-row gap-1.5"
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
