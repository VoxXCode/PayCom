import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useBuild, CatalogItem } from '../../context/BuildContext';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const {
    slots,
    CATALOG,
    filledCount,
    totalPrice,
    totalWattage,
    capacityPercent,
    bottleneckText,
    setSlotItem,
    removeSlotItem,
    quickFill,
    resetSlots,
    formatRupiah
  } = useBuild();

  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalSearch, setModalSearch] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const displayName = 
    (user?.user_metadata?.full_name as string) ||
    user?.email?.split('@')[0] || 
    'Alex';

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeSlot = slots.find(s => s.id === activeSlotId);
  const availableItems = activeSlot ? CATALOG[activeSlot.category] || [] : [];

  const filteredModalItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
    item.specs.toLowerCase().includes(modalSearch.toLowerCase()) ||
    item.badges.some(b => b.toLowerCase().includes(modalSearch.toLowerCase()))
  );

  const handleOpenPicker = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    setActiveSlotId(slotId);
    setModalSearch('');
    setIsModalOpen(true);
    if (slot) {
      (router as any).setParams({ slot: slot.category });
    }
  };

  const handleClosePicker = () => {
    setIsModalOpen(false);
    (router as any).setParams({ slot: '' });
  };

  const handleSelectComponent = (item: CatalogItem) => {
    if (!activeSlotId) return;
    setSlotItem(activeSlotId, item);
    handleClosePicker();
  };

  const handleRemoveComponent = (slotId: string) => {
    removeSlotItem(slotId);
  };

  const handleQuickFill = () => {
    quickFill();
  };

  return (
    <View className="flex-1 bg-[#0b0f19] relative">
      <StatusBar style="light" />
      
      {/* Top Header Bar matching reference */}
      <View
        className="w-full z-40 bg-[#0b0f19]/95 border-b border-[#1e293b]/60"
        style={{ paddingTop: Math.max(insets.top, 14) }}
      >
        <View className="h-14 px-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 items-center justify-center">
              <MaterialIcons name="memory" size={18} color="#38bdf8" />
            </View>
            <View className="flex-row items-center">
              <Text className="text-[17px] font-extrabold tracking-tight text-white">
                PAY<Text className="text-[#38bdf8]">COM</Text>
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/profile')}
              className="w-9 h-9 items-center justify-center rounded-xl bg-[#151c2c] border border-[#222f46] relative"
            >
              <MaterialIcons name="notifications-none" size={20} color="#94a3b8" />
              <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#38bdf8]" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/profile')}
              className="w-9 h-9 items-center justify-center rounded-xl bg-[#151c2c] border border-[#222f46]"
            >
              <MaterialIcons name="person-outline" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar matching reference */}
        <View className="px-4 pb-3">
          <View className="h-11 px-3.5 rounded-2xl bg-[#151c2c] border border-[#222f46] flex-row items-center gap-2.5">
            <MaterialIcons name="search" size={20} color="#64748b" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search components, brands, specs..."
              placeholderTextColor="#64748b"
              className="flex-1 h-full text-white text-[13px]"
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color="#94a3b8" />
              </TouchableOpacity>
            ) : (
              <MaterialIcons name="tune" size={18} color="#64748b" />
            )}
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 w-full bg-[#0b0f19]"
        contentContainerStyle={{ 
          paddingBottom: 40 + 64 + Math.max(insets.bottom, 16),
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Collections Banner matching reference */}
        <View className="px-4 mb-5">
          <View className="text-left mb-2">
            <Text className="text-[13px] font-bold text-[#94a3b8] uppercase tracking-wider">
              Featured Collections
            </Text>
          </View>

          <View className="rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#151c2c] to-[#0f172a] border border-[#2b3a55] p-5 relative overflow-hidden shadow-xl shadow-blue-900/20">
            {/* Ambient visual orbs */}
            <View 
              pointerEvents="none" 
              className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-blue-600/20 blur-2xl" 
            />
            <View 
              pointerEvents="none" 
              className="absolute right-12 bottom-0 w-28 h-28 rounded-full bg-sky-400/20 blur-xl" 
            />

            <View className="w-2/3 z-10">
              <View className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 self-start mb-2">
                <Text className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wider">
                  Build Series 2026
                </Text>
              </View>
              <Text className="text-[20px] font-extrabold text-white leading-tight">
                Cyberpunk & AI Rig Edition
              </Text>
              <Text className="text-[12px] text-[#94a3b8] mt-1.5 leading-relaxed">
                Rakit PC impian dengan komponen terkurasi dan performa maksimal.
              </Text>
              
              <TouchableOpacity
                onPress={handleQuickFill}
                activeOpacity={0.85}
                className="mt-4 px-4 py-2.5 rounded-full bg-[#2563eb] self-start flex-row items-center gap-1.5 shadow-md shadow-blue-600/40"
              >
                <Text className="text-white text-[12px] font-bold">Rakit Otomatis</Text>
                <MaterialIcons name="arrow-forward" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Hardware badge illustration right side */}
            <View className="absolute right-3 top-4 items-center justify-center opacity-90">
              <View className="w-24 h-24 rounded-2xl bg-blue-950/40 border border-blue-500/20 items-center justify-center">
                <MaterialIcons name="developer-board" size={54} color="#38bdf8" />
              </View>
            </View>

            {/* Pagination dots matching reference */}
            <View className="flex-row items-center justify-center gap-1.5 mt-5">
              <View className="w-5 h-1.5 rounded-full bg-[#38bdf8]" />
              <View className="w-1.5 h-1.5 rounded-full bg-[#334155]" />
              <View className="w-1.5 h-1.5 rounded-full bg-[#334155]" />
            </View>
          </View>
        </View>

        {/* Telemetry / Live Rig Status Box */}
        <View className="px-4 mb-5">
          <View className="rounded-2xl bg-[#151c2c] border border-[#222f46] p-3.5">
            <View className="flex-row items-center justify-between pb-2.5 border-b border-[#1e293b]">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse" />
                <Text className="text-[13px] font-bold text-white">Status Rakitan</Text>
                <View className="px-2 py-0.5 rounded-full bg-blue-500/20">
                  <Text className="text-[10px] font-bold text-[#38bdf8]">{filledCount}/5 Terpasang</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/explore')}
                className="flex-row items-center gap-0.5"
              >
                <Text className="text-[12px] font-semibold text-[#38bdf8]">Detail</Text>
                <MaterialIcons name="chevron-right" size={16} color="#38bdf8" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-2.5 pt-3">
              <View className="flex-1 bg-[#0f1422] p-2.5 rounded-xl border border-[#1e293b]">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <MaterialIcons name="bolt" size={16} color="#38bdf8" />
                  <Text className="text-[11px] font-medium text-[#94a3b8]">Konsumsi Daya</Text>
                </View>
                <Text className="text-[13px] font-bold text-white">
                  {totalWattage}W <Text className="text-[10px] text-[#64748b]">/ 750W</Text>
                </Text>
                <Text className="text-[10px] text-[#38bdf8] font-semibold mt-0.5">
                  {filledCount > 0 ? `${capacityPercent}% Kapasitas (Aman)` : 'Belum ada'}
                </Text>
              </View>

              <View className="flex-1 bg-[#0f1422] p-2.5 rounded-xl border border-[#1e293b]">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <MaterialIcons name="speed" size={16} color="#38bdf8" />
                  <Text className="text-[11px] font-medium text-[#94a3b8]">Indeks Kinerja</Text>
                </View>
                <Text className="text-[13px] font-bold text-white" numberOfLines={1}>
                  {bottleneckText}
                </Text>
                <Text className="text-[10px] text-[#94a3b8] font-medium mt-0.5">
                  Kompatibilitas OK
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Header: "Personalized for Alex" matching reference */}
        <View className="px-4 flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-[17px] font-extrabold text-white">
              Personalized for {displayName}
            </Text>
            <Text className="text-[11px] text-[#94a3b8] mt-0.5">
              Slot Komponen Terkurasi
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {filledCount > 0 ? (
              <TouchableOpacity 
                onPress={resetSlots}
                className="px-3 py-1.5 rounded-xl bg-[#1e293b] border border-[#334155]"
              >
                <Text className="text-[11px] font-semibold text-slate-300">Reset</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={handleQuickFill}
                className="px-3 py-1.5 rounded-xl bg-[#2563eb]/20 border border-blue-500/40"
              >
                <Text className="text-[11px] font-bold text-[#38bdf8]">Auto Fill</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Product Cards for Component Slots matching reference */}
        <View className="px-4 gap-3">
          {slots.map((slot) => {
            const isFilled = slot.selectedItem !== null;
            const isFav = favorites[slot.id];

            if (!isFilled) {
              return (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => handleOpenPicker(slot.id)}
                  activeOpacity={0.8}
                  className="rounded-2xl bg-[#151c2c] border border-dashed border-[#2b3a55] p-4 flex-row items-center gap-3.5"
                >
                  <View className="w-16 h-16 rounded-2xl bg-[#0f1422] border border-[#1e293b] items-center justify-center">
                    <MaterialIcons name={slot.icon} size={28} color="#64748b" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-[14px] font-bold text-white">{slot.name}</Text>
                      <View className="px-2 py-0.5 rounded-full bg-[#1e293b]">
                        <Text className="text-[10px] font-medium text-[#94a3b8]">{slot.category}</Text>
                      </View>
                    </View>
                    <Text className="text-[12px] text-[#64748b] mt-1">Belum dipilih • Klik untuk mencari</Text>
                  </View>
                  <View className="px-3 py-2 rounded-full bg-[#2563eb] flex-row items-center gap-1 shadow-md shadow-blue-600/30">
                    <MaterialIcons name="add" size={16} color="#ffffff" />
                    <Text className="text-[11px] font-bold text-white">Pilih</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            const item = slot.selectedItem!;
            return (
              <View 
                key={slot.id} 
                className="rounded-2xl bg-[#151c2c] border border-[#222f46] p-4 relative overflow-hidden shadow-sm"
              >
                {/* Top Row: Category tag & Heart icon */}
                <View className="flex-row items-center justify-between mb-2.5">
                  <View className="flex-row items-center gap-2">
                    <View className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30">
                      <Text className="text-[10px] font-bold text-[#38bdf8] uppercase">
                        {slot.name}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="star" size={13} color="#facc15" />
                      <Text className="text-[11px] font-bold text-white">4.9</Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    onPress={() => toggleFavorite(slot.id)}
                    className="w-8 h-8 rounded-full bg-[#1e293b] items-center justify-center"
                  >
                    <Ionicons 
                      name={isFav ? "heart" : "heart-outline"} 
                      size={16} 
                      color={isFav ? "#f43f5e" : "#94a3b8"} 
                    />
                  </TouchableOpacity>
                </View>

                {/* Main Content: Thumbnail & Details */}
                <View className="flex-row gap-3.5">
                  <View className="w-20 h-20 rounded-2xl bg-[#0f1422] border border-[#1e293b] overflow-hidden items-center justify-center shrink-0">
                    <Image 
                      source={{ uri: item.image }} 
                      className="w-full h-full" 
                      style={{ resizeMode: 'cover' }} 
                    />
                  </View>

                  <View className="flex-1 justify-between">
                    <View>
                      <Text className="text-[14px] font-bold text-white leading-snug" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-[11px] text-[#94a3b8] mt-1" numberOfLines={2}>
                        {item.specs}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1 mt-1.5 flex-wrap">
                      {item.badges.slice(0, 2).map((b, i) => (
                        <View key={i} className="px-1.5 py-0.5 rounded bg-[#1e293b]">
                          <Text className="text-[9px] font-medium text-[#94a3b8]">{b}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Bottom Bar: Price & Action Buttons */}
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-[#1e293b]">
                  <View>
                    <Text className="text-[10px] text-[#64748b]">Harga</Text>
                    <Text className="text-[15px] font-extrabold text-[#38bdf8]">
                      {formatRupiah(item.price)}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity 
                      onPress={() => handleRemoveComponent(slot.id)}
                      className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] items-center justify-center"
                    >
                      <MaterialIcons name="delete-outline" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      onPress={() => handleOpenPicker(slot.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#2563eb] flex-row items-center gap-1.5 shadow-md shadow-blue-600/30"
                    >
                      <MaterialIcons name="swap-horiz" size={16} color="#ffffff" />
                      <Text className="text-white text-[12px] font-bold">Ganti</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Floating Subtotal Summary Bar matching reference */}
        {filledCount > 0 && (
          <View className="px-4 mt-5">
            <View className="rounded-2xl bg-gradient-to-r from-[#151c2c] to-[#1e293b] border border-blue-500/30 p-4 flex-row items-center justify-between shadow-lg shadow-blue-900/30">
              <View>
                <Text className="text-[11px] text-[#94a3b8] font-medium">
                  Total Estimasi ({filledCount} Komponen)
                </Text>
                <Text className="text-[18px] font-extrabold text-white mt-0.5">
                  {formatRupiah(totalPrice)}
                </Text>
              </View>

              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/explore')}
                activeOpacity={0.85}
                className="px-4 py-2.5 rounded-full bg-[#2563eb] flex-row items-center gap-1.5 shadow-md shadow-blue-600/40"
              >
                <Text className="text-white text-[13px] font-bold">Checkout</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Component Picker Modal matching Screen 3 Collections */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClosePicker}
      >
        <Pressable 
          className="flex-1 bg-black/70 justify-end"
          onPress={handleClosePicker}
        >
          <Pressable 
            className="bg-[#151c2c] rounded-t-3xl max-h-[80%] w-full overflow-hidden border-t border-[#2b3a55]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <View className="w-12 h-1.5 bg-[#334155] rounded-full self-center my-3" />
            
            {/* Modal Header */}
            <View className="px-4 pb-3 border-b border-[#1e293b] flex-row items-center justify-between">
              <View>
                <Text className="text-[17px] font-bold text-white">
                  Pilih {activeSlot?.name}
                </Text>
                <Text className="text-[12px] text-[#94a3b8] mt-0.5">
                  {availableItems.length} opsi komponen kompatibel
                </Text>
              </View>
              <TouchableOpacity 
                onPress={handleClosePicker}
                className="w-8 h-8 rounded-full bg-[#1e293b] items-center justify-center"
              >
                <MaterialIcons name="close" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Modal Search Input */}
            <View className="px-4 pt-3 pb-1">
              <View className="h-10 px-3 rounded-xl bg-[#0f1422] border border-[#222f46] flex-row items-center gap-2">
                <MaterialIcons name="search" size={18} color="#64748b" />
                <TextInput
                  value={modalSearch}
                  onChangeText={setModalSearch}
                  placeholder={`Cari dalam kategori ${activeSlot?.category}...`}
                  placeholderTextColor="#64748b"
                  className="flex-1 h-full text-white text-[12px]"
                />
                {modalSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setModalSearch('')}>
                    <MaterialIcons name="close" size={16} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Component List */}
            <ScrollView 
              className="px-4 py-3"
              contentContainerStyle={{ gap: 10, paddingBottom: Math.max(insets.bottom, 20) + 16 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredModalItems.length === 0 ? (
                <View className="py-8 items-center justify-center">
                  <MaterialIcons name="search-off" size={36} color="#64748b" />
                  <Text className="text-[13px] text-[#94a3b8] mt-2">Tidak ada komponen ditemukan</Text>
                </View>
              ) : (
                filteredModalItems.map((item) => {
                  const isCurrent = activeSlot?.selectedItem?.id === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleSelectComponent(item)}
                      activeOpacity={0.8}
                      className={`rounded-2xl p-3.5 flex-row gap-3.5 bg-[#0f1422] border ${
                        isCurrent 
                          ? 'border-blue-500 bg-blue-950/20' 
                          : 'border-[#1e293b]'
                      }`}
                    >
                      <Image 
                        source={{ uri: item.image }} 
                        className="w-16 h-16 rounded-xl bg-[#151c2c] shrink-0" 
                        style={{ resizeMode: 'cover' }} 
                      />
                      <View className="flex-1 justify-between">
                        <View>
                          <Text className="text-[13px] font-bold text-white" numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text className="text-[11px] text-[#94a3b8] mt-0.5" numberOfLines={1}>
                            {item.specs}
                          </Text>
                          <View className="flex-row flex-wrap items-center gap-1 mt-1.5">
                            {item.badges.map((badge, idx) => (
                              <View key={idx} className="px-1.5 py-0.5 rounded bg-[#1e293b]">
                                <Text className="text-[9px] text-[#94a3b8] font-medium">{badge}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                        <View className="flex-row items-center justify-between mt-2 pt-1 border-t border-[#1e293b]/60">
                          <Text className="text-[13px] font-extrabold text-[#38bdf8]">
                            {formatRupiah(item.price)}
                          </Text>
                          <View className={`px-3 py-1 rounded-full ${
                            isCurrent ? 'bg-[#2563eb]' : 'bg-[#1e293b]'
                          }`}>
                            <Text className={`text-[11px] font-bold ${
                              isCurrent ? 'text-white' : 'text-[#38bdf8]'
                            }`}>
                              {isCurrent ? 'Terpasang' : 'Pilih'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
