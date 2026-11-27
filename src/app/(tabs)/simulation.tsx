import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
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
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkProgressText, setBenchmarkProgressText] = useState<string>('Siap menjalankan simulasi rakitan.');
  const [benchmarkReport, setBenchmarkReport] = useState<RigBenchmarkReport | null>(null);
  const [benchmarkError, setBenchmarkError] = useState<string | null>(null);
  const [showBenchmarkSuite, setShowBenchmarkSuite] = useState<boolean>(true);

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

  const categories = [
    { label: 'All', key: 'laptops' },
    { label: 'Laptops', key: 'laptops' },
    { label: 'Smartphones', key: 'smartphones' },
    { label: 'Tablets', key: 'tablets' },
  ];

  const sortedProducts = [...externalProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <View className="flex-1 bg-[#0b0f19] relative">
      <StatusBar style="light" />

      {/* Top Header matching Screen 3 "Electronics Collection" */}
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
              Hardware Collection
            </Text>
          </View>

          {/* Sort Dropdown & View Mode */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={() => {
                const nextSort = sortOption === 'default' ? 'price-asc' : sortOption === 'price-asc' ? 'price-desc' : sortOption === 'price-desc' ? 'rating' : 'default';
                setSortOption(nextSort);
              }}
              className="h-8 px-2.5 rounded-xl bg-[#151c2c] border border-[#222f46] flex-row items-center gap-1"
            >
              <Text className="text-[11px] font-semibold text-[#94a3b8]">
                {sortOption === 'default' ? 'Sort' : sortOption === 'price-asc' ? 'Harga ↑' : sortOption === 'price-desc' ? 'Harga ↓' : 'Rating ★'}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color="#94a3b8" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsGridView(!isGridView)}
              className="w-8 h-8 rounded-xl bg-[#151c2c] border border-[#222f46] items-center justify-center"
            >
              <MaterialIcons name={isGridView ? "view-list" : "grid-view"} size={16} color="#38bdf8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Pills horizontally scrollable matching reference */}
        <View className="pb-3 pt-1">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {categories.map((cat, idx) => {
              const isActive = selectedCategory === cat.key && (idx === 0 ? selectedCategory === 'laptops' : true);
              return (
                <TouchableOpacity
                  key={`${cat.key}-${idx}`}
                  onPress={() => setSelectedCategory(cat.key)}
                  activeOpacity={0.8}
                  className={`px-4 py-2 rounded-full border ${
                    isActive 
                      ? 'bg-[#2563eb] border-[#2563eb]' 
                      : 'bg-[#151c2c] border-[#222f46]'
                  }`}
                >
                  <Text className={`text-[12px] font-bold ${
                    isActive ? 'text-white' : 'text-[#94a3b8]'
                  }`}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
      >
        {/* Benchmark Simulation Telemetry Card */}
        <View className="rounded-2xl bg-[#151c2c] border border-[#222f46] p-4 mb-5 shadow-sm">
          <TouchableOpacity 
            onPress={() => setShowBenchmarkSuite(!showBenchmarkSuite)}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 items-center justify-center">
                <MaterialIcons name="speed" size={18} color="#38bdf8" />
              </View>
              <View>
                <Text className="text-[14px] font-bold text-white">Simulasi Benchmark Rig</Text>
                <Text className="text-[11px] text-[#94a3b8]">Uji beban performa & tegangan daya</Text>
              </View>
            </View>
            <MaterialIcons 
              name={showBenchmarkSuite ? "expand-less" : "expand-more"} 
              size={22} 
              color="#94a3b8" 
            />
          </TouchableOpacity>

          {showBenchmarkSuite && (
            <View className="mt-4 pt-3 border-t border-[#1e293b] gap-3">
              {/* Telemetry Stats */}
              <View className="flex-row gap-2">
                <View className="flex-1 bg-[#0f1422] p-2.5 rounded-xl border border-[#1e293b]">
                  <Text className="text-[10px] text-[#64748b]">Slot Rig</Text>
                  <Text className="text-[13px] font-bold text-white mt-0.5">{filledCount}/5 Terpasang</Text>
                </View>
                <View className="flex-1 bg-[#0f1422] p-2.5 rounded-xl border border-[#1e293b]">
                  <Text className="text-[10px] text-[#64748b]">Daya Sistem</Text>
                  <Text className="text-[13px] font-bold text-[#38bdf8] mt-0.5">{totalWattage} Watt</Text>
                </View>
                <View className="flex-1 bg-[#0f1422] p-2.5 rounded-xl border border-[#1e293b]">
                  <Text className="text-[10px] text-[#64748b]">Bottleneck</Text>
                  <Text className="text-[12px] font-bold text-white mt-0.5" numberOfLines={1}>{bottleneckText}</Text>
                </View>
              </View>

              {/* Status bar */}
              <View className="p-3 rounded-xl bg-[#0f1422] border border-[#1e293b] flex-row items-center gap-2.5">
                {isBenchmarking ? (
                  <ActivityIndicator size="small" color="#38bdf8" />
                ) : (
                  <MaterialIcons name="insights" size={18} color="#38bdf8" />
                )}
                <Text className="text-[11px] text-white font-medium flex-1">
                  {benchmarkProgressText}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  disabled={isBenchmarking}
                  onPress={handleStartBenchmark}
                  activeOpacity={0.85}
                  className={`flex-1 py-3 px-3 rounded-xl flex-row items-center justify-center gap-1.5 bg-[#2563eb] shadow-md shadow-blue-600/30 ${
                    isBenchmarking ? 'opacity-60' : 'active:bg-blue-700'
                  }`}
                >
                  <MaterialIcons name="play-arrow" size={18} color="#ffffff" />
                  <Text className="text-white text-[12px] font-bold">
                    {isBenchmarking ? 'Menjalankan...' : 'Mulai Benchmark'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isBenchmarking}
                  onPress={handleTestRejectCondition}
                  className="px-3 py-3 rounded-xl bg-red-950/40 border border-red-500/30 flex-row items-center justify-center gap-1"
                >
                  <MaterialIcons name="warning" size={16} color="#f87171" />
                  <Text className="text-red-400 text-[11px] font-bold">Demo .reject()</Text>
                </TouchableOpacity>
              </View>

              {benchmarkError && (
                <ErrorMessage
                  message={benchmarkError}
                  onRetry={handleStartBenchmark}
                />
              )}

              {benchmarkReport && (
                <View className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 gap-2">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-[10px] text-[#38bdf8] font-bold uppercase">Skor Benchmark Rig</Text>
                      <Text className="text-[20px] font-extrabold text-white mt-0.5">
                        {benchmarkReport.overallScore.toLocaleString('id-ID')} Pts
                      </Text>
                    </View>
                    <View className="px-3 py-1 rounded-xl bg-blue-500/20 border border-blue-400/30 items-end">
                      <Text className="text-[9px] text-[#94a3b8]">Tier Kinerja</Text>
                      <Text className="text-[12px] font-bold text-[#38bdf8]">{benchmarkReport.tier}</Text>
                    </View>
                  </View>

                  <Text className="text-[11px] text-slate-300 bg-[#0f1422] p-2 rounded-lg">
                    {benchmarkReport.powerSafety}
                  </Text>

                  <View className="gap-1 pt-1">
                    {benchmarkReport.stages.map((stg, idx) => (
                      <View key={idx} className="flex-row items-center justify-between py-1 border-t border-[#1e293b]">
                        <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                          <MaterialIcons
                            name={stg.status === 'passed' ? 'check-circle' : 'warning'}
                            size={14}
                            color={stg.status === 'passed' ? '#38bdf8' : '#f87171'}
                          />
                          <Text className="text-[11px] text-white" numberOfLines={1}>
                            {stg.stageName}
                          </Text>
                        </View>
                        <Text className="text-[11px] font-mono font-bold text-[#38bdf8]">
                          {stg.score.toLocaleString('id-ID')}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Section Header: Hardware Catalog */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-[16px] font-extrabold text-white">
              Koleksi Hardware ({sortedProducts.length})
            </Text>
            <Text className="text-[11px] text-[#94a3b8]">
              Data live dari DummyJSON External API
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleReloadWithPromise}
            className="px-2.5 py-1.5 rounded-xl bg-[#151c2c] border border-[#222f46] flex-row items-center gap-1"
          >
            <MaterialIcons name="sync" size={14} color="#38bdf8" />
            <Text className="text-[11px] text-[#38bdf8] font-bold">Refresh .then()</Text>
          </TouchableOpacity>
        </View>

        {/* Products Display (Grid matching Screen 3 or List) */}
        {isLoadingApi ? (
          <Loading message={`Mengambil data katalog "${selectedCategory}"...`} />
        ) : apiError ? (
          <ErrorMessage
            message={apiError}
            onRetry={() => loadExternalApiData(selectedCategory)}
          />
        ) : isGridView ? (
          <View className="flex-row flex-wrap justify-between">
            {sortedProducts.map((prod) => (
              <ExternalProductCard
                key={prod.id}
                product={prod}
                isGrid={true}
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
        ) : (
          <View>
            {sortedProducts.map((prod) => (
              <ExternalProductCard
                key={prod.id}
                product={prod}
                isGrid={false}
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
      </ScrollView>
    </View>
  );
}
