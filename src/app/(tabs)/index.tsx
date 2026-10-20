import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useBuild, CatalogItem } from '../../context/BuildContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeSlot = slots.find(s => s.id === activeSlotId);
  const availableItems = activeSlot ? CATALOG[activeSlot.category] || [] : [];

  const handleOpenPicker = (slotId: string) => {
    setActiveSlotId(slotId);
    setIsModalOpen(true);
  };

  const handleSelectComponent = (item: CatalogItem) => {
    if (!activeSlotId) return;
    setSlotItem(activeSlotId, item);
    setIsModalOpen(false);
  };

  const handleRemoveComponent = (slotId: string) => {
    removeSlotItem(slotId);
  };

  const handleQuickFill = () => {
    quickFill();
  };

  const handleResetAll = () => {
    resetSlots();
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
        className="flex-1 w-full relative bg-surface"
        contentContainerStyle={{ paddingTop: Math.max(insets.top, 16) + 64, paddingBottom: 32 + 64 + Math.max(insets.bottom, 16) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Validation Telemetry Strip */}
        <View className="px-gutter pt-3 pb-2">
          <View className="bg-surface-container-low rounded-xl p-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-secondary" />
                <Text className="text-[12px] text-on-surface font-semibold">PayCom v1.0</Text>
              </View>
              <TouchableOpacity 
                className="flex-row items-center gap-0.5"
                onPress={() => router.push('/(tabs)/explore')}
              >
                <Text className="text-[12px] text-secondary font-medium">Lihat Ringkasan</Text>
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
        </View>

        {/* Slot Build Toolbar */}
        <View className="px-gutter flex-row items-center justify-between pt-2 pb-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-[14px] text-on-surface font-semibold">Slot Komponen Rakitan</Text>
            <View className="px-2 py-0.5 rounded-full bg-surface-container-high">
              <Text className="text-[11px] text-secondary font-bold">{filledCount}/5 Terisi</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            {filledCount > 0 ? (
              <TouchableOpacity onPress={handleResetAll} className="px-2.5 py-1 rounded-lg bg-surface-container-low">
                <Text className="text-[11px] text-outline font-medium">Kosongkan</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleQuickFill} className="px-2.5 py-1 rounded-lg bg-surface-container-low">
                <Text className="text-[11px] text-secondary font-medium">Isi Rekomendasi</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Component Slots List */}
        <View className="px-gutter flex-col gap-3 pt-2">
          {slots.map((slot) => {
            const isFilled = slot.selectedItem !== null;

            if (!isFilled) {
              return (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => handleOpenPicker(slot.id)}
                  activeOpacity={0.7}
                  className="rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low/40 p-3.5 flex-row items-center gap-3"
                >
                  <View className="w-14 h-14 rounded-lg bg-surface-container items-center justify-center">
                    <MaterialIcons name={slot.icon} size={26} color="#8a90a6" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-[14px] font-semibold text-on-surface">{slot.name}</Text>
                      <View className="px-1.5 py-0.5 rounded bg-surface-container-highest">
                        <Text className="text-[10px] font-medium text-outline">{slot.category}</Text>
                      </View>
                    </View>
                    <Text className="text-[12px] text-outline mt-0.5">Wadah kosong • Belum dipilih</Text>
                  </View>
                  <View className="px-3.5 py-1.5 rounded-lg bg-secondary/15 border border-secondary/30 flex-row items-center gap-1">
                    <MaterialIcons name="add" size={16} color="#4cd7f6" />
                    <Text className="text-[12px] font-semibold text-secondary">Pilih</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            const item = slot.selectedItem!;
            return (
              <View key={slot.id} className="relative rounded-xl bg-surface-container p-3.5 overflow-hidden flex-row gap-3 shadow-sm">
                <View className="w-16 h-16 rounded-lg bg-surface-container-highest shrink-0 overflow-hidden relative items-center justify-center">
                  <Image 
                    source={{ uri: item.image }} 
                    className="w-full h-full" style={{ resizeMode: 'cover' }} 
                  />
                  <View className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-surface-container-lowest/90 rounded">
                    <Text className="text-[10px] font-medium text-on-surface">{item.category}</Text>
                  </View>
                </View>
                <View className="flex-col flex-1">
                  <View className="flex-row items-start justify-between gap-1">
                    <Text className="text-[11px] font-medium text-outline">{slot.name}</Text>
                    <Text className="text-[11px] font-semibold text-secondary">Terpasang</Text>
                  </View>
                  <Text className="text-[14px] leading-snug text-on-surface font-semibold mt-0.5" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-[12px] text-on-surface-variant mt-0.5" numberOfLines={1}>
                    {item.specs}
                  </Text>
                  <View className="flex-row items-center justify-between mt-2.5 pt-1">
                    <Text className="text-[14px] font-bold text-on-surface tracking-tight">
                      {formatRupiah(item.price)}
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <TouchableOpacity 
                        onPress={() => handleRemoveComponent(slot.id)}
                        className="w-8 h-8 rounded-lg bg-surface-container-high items-center justify-center"
                      >
                        <MaterialIcons name="close" size={16} color="#c2c6d6" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleOpenPicker(slot.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-primary-container flex-row items-center gap-1"
                      >
                        <MaterialIcons name="swap-horiz" size={15} color="#00285d" />
                        <Text className="text-on-primary-container text-[12px] font-semibold">Ganti</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Bottom Summary Banner */}
          {filledCount > 0 && (
            <View className="rounded-xl bg-surface-container-low p-3.5 mt-2 flex-row items-center justify-between">
              <View className="flex-col">
                <Text className="text-[11px] text-outline font-medium">Estimasi Subtotal ({filledCount} Komponen)</Text>
                <Text className="text-[16px] font-bold text-secondary mt-0.5">{formatRupiah(totalPrice)}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/explore')}
                className="px-3.5 py-2 rounded-xl bg-secondary flex-row items-center gap-1"
              >
                <Text className="text-[12px] font-bold text-on-secondary">Rincian Lengkap</Text>
                <MaterialIcons name="chevron-right" size={16} color="#003640" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Component Picker Bottom Sheet Modal */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Pressable 
          className="flex-1 bg-black/60 justify-end"
          onPress={() => setIsModalOpen(false)}
        >
          <Pressable 
            className="bg-surface-container rounded-t-3xl max-h-[75%] w-full overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Handle */}
            <View className="w-10 h-1 bg-outline-variant/40 rounded-full self-center my-2.5" />
            
            {/* Modal Header */}
            <View className="px-gutter pb-3 pt-1 border-b border-surface-variant/20 flex-row items-center justify-between">
              <View className="flex-col">
                <Text className="text-[16px] font-bold text-on-surface">
                  Pilih {activeSlot?.name}
                </Text>
                <Text className="text-[12px] text-on-surface-variant mt-0.5">
                  Daftar komponen kompatibel ({availableItems.length} pilihan)
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center"
              >
                <MaterialIcons name="close" size={18} color="#c2c6d6" />
              </TouchableOpacity>
            </View>

            {/* Modal Items List */}
            <ScrollView 
              className="px-gutter py-3"
              contentContainerStyle={{ gap: 10, paddingBottom: Math.max(insets.bottom, 20) + 16 }}
              showsVerticalScrollIndicator={false}
            >
              {availableItems.map((item) => {
                const isCurrent = activeSlot?.selectedItem?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleSelectComponent(item)}
                    activeOpacity={0.8}
                    className={`rounded-xl p-3 flex-row gap-3 bg-surface-container-low border ${isCurrent ? 'border-secondary' : 'border-surface-variant/30'}`}
                  >
                    <Image 
                      source={{ uri: item.image }} 
                      className="w-16 h-16 rounded-lg bg-surface-container-highest shrink-0" 
                      style={{ resizeMode: 'cover' }} 
                    />
                    <View className="flex-1 flex-col justify-between">
                      <View>
                        <Text className="text-[14px] font-semibold text-on-surface" numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text className="text-[11px] text-on-surface-variant mt-0.5" numberOfLines={1}>
                          {item.specs}
                        </Text>
                        <View className="flex-row flex-wrap items-center gap-1 mt-1.5">
                          {item.badges.map((badge, idx) => (
                            <View key={idx} className="px-1.5 py-0.5 rounded bg-surface-container-highest">
                              <Text className="text-[10px] text-on-surface-variant font-medium">{badge}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <View className="flex-row items-center justify-between mt-2 pt-1">
                        <Text className="text-[13px] font-bold text-secondary">
                          {formatRupiah(item.price)}
                        </Text>
                        <View className={`px-3 py-1 rounded-lg ${isCurrent ? 'bg-secondary' : 'bg-primary-container'}`}>
                          <Text className={`text-[11px] font-bold ${isCurrent ? 'text-on-secondary' : 'text-on-primary-container'}`}>
                            {isCurrent ? 'Terpilih' : 'Pilih'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
