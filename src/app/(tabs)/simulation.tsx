import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { useBuild } from '../../context/BuildContext';
import { ExternalProduct, RigBenchmarkReport } from '../../types/hardware';
import {
  fetchExternalProducts,
  fetchHardwareWithPromise,
  validatePowerSafetyWithPromise,
  runFullBenchmarkChained,
} from '../../services/hardwareService';

import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ExternalProductCard from '../../components/ExternalProductCard';

export default function SimulationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    filledCount,
    totalWattage,
    totalPrice,
    bottleneckText,
    formatRupiah,
  } = useBuild();

  const [externalProducts, setExternalProducts] = useState<ExternalProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('laptops');
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkProgressText, setBenchmarkProgressText] = useState<string>('Siap menjalankan simulasi rakitan.');
  const [benchmarkReport, setBenchmarkReport] = useState<RigBenchmarkReport | null>(null);
  const [benchmarkError, setBenchmarkError] = useState<string | null>(null);

  useEffect(() => {
    loadExternalApiData(selectedCategory);
  }, [selectedCategory]);

  const loadExternalApiData = async (cat: string) => {
    setIsLoadingApi(true);
    setApiError(null);

    try {
      const products: ExternalProduct[] = await fetchExternalProducts(cat);
      setExternalProducts(products);
    } catch (err: any) {
      setApiError(err?.message || 'Gagal memuat data dari External API.');
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleReloadWithPromise = () => {
    setIsLoadingApi(true);
    setApiError(null);

    fetchHardwareWithPromise(selectedCategory)
      .then((items: ExternalProduct[]) => {
        setExternalProducts(items);
        Alert.alert('Sukses (.then)', `Berhasil mengambil ${items.length} data produk via Promise chaining .then()!`);
      })
      .catch((err: any) => {
        setApiError(err?.message || 'Error tertangkap pada .catch() Promise.');
      })
      .finally(() => {
        setIsLoadingApi(false);
      });
  };

  const handleStartBenchmark = () => {
    if (filledCount === 0) {
      Alert.alert(
        'Komponen Belum Dipilih',
        'Silakan pasang komponen di tab Komponen terlebih dahulu sebelum memulai simulasi benchmark.',
        [
          { text: 'Pilih Komponen', onPress: () => router.push('/(tabs)') },
          { text: 'Tutup', style: 'cancel' },
        ]
      );
      return;
    }

    setIsBenchmarking(true);
    setBenchmarkError(null);
    setBenchmarkReport(null);

    runFullBenchmarkChained(
      totalWattage,
      filledCount,
      750,
      (stageNumber, stageName) => {
        setBenchmarkProgressText(stageName);
      }
    )
      .then((report: RigBenchmarkReport) => {
        setBenchmarkReport(report);
        setBenchmarkProgressText('✅ Simulasi benchmark selesai!');
      })
      .catch((err: any) => {
        setBenchmarkError(err?.message || 'Simulasi pengujian dihentikan.');
        setBenchmarkProgressText('❌ Pengujian gagal.');
      })
      .finally(() => {
        setIsBenchmarking(false);
      });
  };

  const handleTestRejectCondition = () => {
    setIsBenchmarking(true);
    setBenchmarkError(null);

    validatePowerSafetyWithPromise(1100, 750)
      .then((msg) => {
        Alert.alert('Hasil .resolve()', msg);
      })
      .catch((err: any) => {
        setBenchmarkError(`[Demo .reject()] ${err.message}`);
        Alert.alert('Demonstrasi .reject()', `Fungsi reject() berhasil dipicu:\n\n${err.message}`);
      })
      .finally(() => {
        setIsBenchmarking(false);
      });
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

          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/profile')}
            className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container-low"
          >
            <MaterialIcons name="person" size={20} color="#c2c6d6" />
          </TouchableOpacity>
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
        <View className="flex-col w-full px-gutter py-4 gap-5">

          <View className="rounded-2xl p-4 bg-surface-container-high border border-surface-variant/20 shadow-md relative overflow-hidden">
            <View className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/15 rounded-full" />

            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                <View className="flex-row items-center gap-1.5">
                </View>
                <Text className="text-[17px] text-on-surface font-bold mt-1">
                  Simulasi Asynchronous & API
                </Text>
                <Text className="text-[12px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Menjalankan benchmark asynchronous bertahap dengan Promise, resolve(), reject(), .then(), serta mengambil data pasar dari External API.
                </Text>
              </View>
              <View className="w-10 h-10 rounded-xl bg-secondary/20 items-center justify-center">
                <MaterialIcons name="speed" size={22} color="#4cd7f6" />
              </View>
            </View>
          </View>

          <View className="rounded-2xl p-4 bg-surface-container-low border border-surface-variant/20">
            <View className="flex-row items-center justify-between pb-3 border-b border-surface-variant/20">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="developer-board" size={18} color="#4cd7f6" />
                <Text className="text-[14px] font-bold text-on-surface">Spesifikasi Rig Aktif</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                <Text className="text-[12px] text-secondary font-medium">Ubah Rakitan</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-2 pt-3">
              <View className="flex-1 bg-surface-container p-2.5 rounded-xl">
                <Text className="text-[10px] text-outline">Komponen</Text>
                <Text className="text-[14px] font-bold text-on-surface mt-0.5">{filledCount} / 5 Slot</Text>
              </View>
              <View className="flex-1 bg-surface-container p-2.5 rounded-xl">
                <Text className="text-[10px] text-outline">Total Daya</Text>
                <Text className="text-[14px] font-bold text-secondary mt-0.5">{totalWattage} Watt</Text>
              </View>
              <View className="flex-1 bg-surface-container p-2.5 rounded-xl">
                <Text className="text-[10px] text-outline">Estimasi Biaya</Text>
                <Text className="text-[13px] font-bold text-primary mt-0.5" numberOfLines={1}>{formatRupiah(totalPrice)}</Text>
              </View>
            </View>

            <View className="mt-4 pt-3 border-t border-surface-variant/20 gap-2.5">
              <View className="p-3 rounded-xl bg-surface-container-high border border-surface-variant/30 flex-row items-center gap-3">
                {isBenchmarking ? (
                  <ActivityIndicator size="small" color="#4cd7f6" />
                ) : (
                  <MaterialIcons name="insights" size={18} color="#adc6ff" />
                )}
                <Text className="text-[12px] text-on-surface font-medium flex-1">
                  {benchmarkProgressText}
                </Text>
              </View>

              <View className="flex-row gap-2 pt-1">
                <TouchableOpacity
                  disabled={isBenchmarking}
                  onPress={handleStartBenchmark}
                  className={`flex-1 py-3 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${
                    isBenchmarking ? 'bg-surface-container-high opacity-60' : 'bg-primary shadow-sm'
                  }`}
                >
                  <MaterialIcons name="play-arrow" size={18} color="#002e6a" />
                  <Text className="text-on-primary text-[13px] font-bold">
                    {isBenchmarking ? 'Menguji...' : 'Mulai Benchmark'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isBenchmarking}
                  onPress={handleTestRejectCondition}
                  className="px-3 py-3 rounded-xl bg-red-950/40 border border-red-500/30 flex-row items-center justify-center gap-1"
                >
                  <MaterialIcons name="warning" size={16} color="#f87171" />
                  <Text className="text-red-400 text-[12px] font-semibold">Uji .reject()</Text>
                </TouchableOpacity>
              </View>

              {benchmarkError && (
                <ErrorMessage
                  message={benchmarkError}
                  onRetry={handleStartBenchmark}
                />
              )}

              {benchmarkReport && (
                <View className="mt-2 p-4 rounded-2xl bg-secondary/10 border border-secondary/30 gap-2.5">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-[11px] text-secondary font-bold uppercase">Hasil Skor Benchmark</Text>
                      <Text className="text-[22px] font-extrabold text-on-surface mt-0.5">
                        {benchmarkReport.overallScore.toLocaleString('id-ID')} Pts
                      </Text>
                    </View>
                    <View className="px-3 py-1.5 rounded-xl bg-secondary/20 border border-secondary/40 items-end">
                      <Text className="text-[10px] text-outline">Tier Kinerja:</Text>
                      <Text className="text-[12px] font-bold text-secondary">{benchmarkReport.tier}</Text>
                    </View>
                  </View>

                  <Text className="text-[11px] text-on-surface-variant bg-surface-container-lowest/60 p-2.5 rounded-lg">
                    {benchmarkReport.powerSafety}
                  </Text>

                  <View className="gap-1.5 pt-1">
                    {benchmarkReport.stages.map((stg, idx) => (
                      <View key={idx} className="flex-row items-center justify-between py-1 border-t border-surface-variant/20">
                        <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                          <MaterialIcons
                            name={stg.status === 'passed' ? 'check-circle' : 'warning'}
                            size={14}
                            color={stg.status === 'passed' ? '#4cd7f6' : '#f87171'}
                          />
                          <Text className="text-[11px] text-on-surface font-medium" numberOfLines={1}>
                            {stg.stageName}
                          </Text>
                        </View>
                        <Text className="text-[12px] font-mono font-bold text-primary">
                          {stg.score.toLocaleString('id-ID')}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          <View className="rounded-2xl p-4 bg-surface-container-low border border-surface-variant/20 gap-3">
            <View className="flex-row items-center justify-between">
              <View>
                <View className="flex-row items-center gap-1.5">
                  <MaterialIcons name="cloud" size={16} color="#4cd7f6" />
                  <Text className="text-[14px] font-bold text-on-surface">Katalog External API</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleReloadWithPromise}
                className="px-2.5 py-1.5 rounded-xl bg-surface-container-high border border-surface-variant/30 flex-row items-center gap-1"
              >
                <MaterialIcons name="sync" size={14} color="#4cd7f6" />
                <Text className="text-[11px] text-secondary font-medium">Via .then()</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-2 pt-1">
              {[
                { label: 'Laptops', key: 'laptops' },
                { label: 'Smartphones', key: 'smartphones' },
                { label: 'Tablets', key: 'tablets' },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setSelectedCategory(cat.key)}
                  className={`flex-1 py-2 rounded-xl items-center justify-center border ${
                    selectedCategory === cat.key
                      ? 'bg-secondary/20 border-secondary'
                      : 'bg-surface-container border-surface-variant/20'
                  }`}
                >
                  <Text
                    className={`text-[12px] font-semibold ${
                      selectedCategory === cat.key ? 'text-secondary' : 'text-on-surface-variant'
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {isLoadingApi ? (
              <Loading message={`Mengambil data kategori "${selectedCategory}" dari DummyJSON API...`} />
            ) : apiError ? (
              <ErrorMessage
                message={apiError}
                onRetry={() => loadExternalApiData(selectedCategory)}
              />
            ) : (
              <View className="pt-2">
                <Text className="text-[11px] text-outline mb-2">
                  Ditemukan {externalProducts.length} produk bertipe Interface ExternalProduct:
                </Text>
                {externalProducts.map((prod) => (
                  <ExternalProductCard
                    key={prod.id}
                    product={prod}
                    onPress={() => {
                      Alert.alert(
                        prod.title,
                        `Brand: ${prod.brand || '-'}\nKategori: ${prod.category}\nHarga: $${prod.price}\nStok: ${prod.stock}\nRating: ⭐ ${prod.rating}\n\nDeskripsi:\n${prod.description}`,
                        [{ text: 'Tutup' }]
                      );
                    }}
                  />
                ))}
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

