import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';


type ComponentItem = {
  id: string;
  category: string;
  name: string;
  specs: string;
  price: number;
  image: string;
  badges: string[];
};


const INITIAL_COMPONENTS: ComponentItem[] = [
  {
    id: 'cpu-1',
    category: 'CPU',
    name: 'AMD Ryzen 7 7800X3D',
    specs: '8-Core, 16-Thread • Up to 5.0 GHz • 96MB 3D V-Cache',
    price: 6850000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX-UxEtO0OK2gpJRx_8PvmFoDZ0D3tBsceXX9SXNO2Bf2h9gtIbd-i7jHsVcJGNGyxS7vykZ5E2JaHp4NrwqiSo5pipSsQ1Rj557OPAaB_HRAur9tNUlPuk7dUsSVWCiDPuOYl44VYRMNQ7yNY5onlPCsH--VIH1lFEojBVqzP0Nbml9rRAXq5EuEmqC2OzBNJ6SN7LF2LLnBPYZ00zEU35nRRrTL_H6D-QhaDV90B4oTQucH8ig',
    badges: ['Socket AM5', 'Zen 4']
  },
  {
    id: 'mobo-1',
    category: 'MOBO',
    name: 'ASUS ROG Strix Z790-E WiFi II',
    specs: 'Intel Z790 Chipset • DDR5 • PCIe 5.0 • WiFi 7',
    price: 7420000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlMwQGUKrAkfp0lOcZa1sqqKpyiHqoGWBtZrh7O8iVr2sSMPqyFK2hvgNgu-ltzPqICur_gr1F9ee9GbYTsKtSycJjltrt9iwYskMvJ15QPygGpUdXaIXIBYf8zK08UY71DkJThHtM8bvf16lt3H3mhwzgoB_XF3arhF6MSadEJaPe5BC1652lP9kSdlgwbhX8Nm_-J76xDia7D2sPIaZQ8r_NDftcojEf5FDfQsK_BUzG7RMGYw',
    badges: ['Socket LGA1700', 'DDR5 Max 8000+']
  },
  {
    id: 'gpu-1',
    category: 'GPU',
    name: 'ASUS TUF RTX 4070 Ti Super 16GB',
    specs: '16GB GDDR6X • DLSS 3.5 • Panjang 305mm',
    price: 14890000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPJGQUyLq40NAdCIMxxbNUK75_18wxzyl7StAVXby1MLkK7yBL1LNsCa6tQwFvVg12U0GY4cKo2NfVA69tB_FR_3dfXFi5rO7rgnvViDvy_6RVfeBh8Qn7ifOwRY35yfifJZI0lB1912Ym85WMJ64_WwRCmL4uJw9V6KbJ_pkT_It5LD8QfQHcCsXLdIq9XiPFCcOoaAqWZ0wCPde8t082IGyXLjuy8scB4TOisrxrnpmBeCBSQ',
    badges: ['PCIe 4.0 x16', '3.15 Slot']
  },
  {
    id: 'ram-1',
    category: 'RAM',
    name: 'Corsair Dominator Titanium RGB',
    specs: '32GB (2x16GB) • DDR5 6000MHz CL30',
    price: 2850000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1AsmAs-DlcUcA3h3lZk0754Jis4zROVbcTzSq14ek1FURAgPw_rgGmXLNztamj7Ml9R00dXKNI6XuZLM3zvewswcVz4gJPFBuF2anqT7Vf3GCLbYqrXLLEgohmGNVqNYgyFWDerO8L7DDy6iPH4hkiVhXkHQE41PysGu4JpymSCkHrrr-N0mwhPgXeKLsZW89_m2xZHo05nlqgtNjTU9If5hTAomHBvOIehGQXvZLkVmga5SZLg',
    badges: []
  },
  {
    id: 'ssd-1',
    category: 'SSD',
    name: 'Samsung 990 PRO NVMe M.2 2TB',
    specs: 'PCIe 4.0 NVMe 2.0 • V-NAND TLC',
    price: 2750000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjEbKOZ4mJfzkXVo_lwig7O3fnoisB3zh6PKbiCy04BEBgvyH3AWMNc4tQpQ8eHn0DCn5hLXj1yZYlWp30EtU59f5fXl7k_z5Z9yayQ5Sfzj_RcMD2sQxLG0vjPnvHi0FwpvQf6RlwAE-bcYSpJVsTNK0h_DP8RLMPukcyWUOxR0ctXuNNcdDstMX9SCe267gP7-Jvqis8wlTOlA9GpwS2iSStsTox6sJbi9vA3F4Unyi-0dZrzw',
    badges: []
  }
];

function formatRupiah(price: number): string {
  return 'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState('Semua');

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
              <Text className="font-headline-md text-[20px] tracking-tight text-on-surface font-bold">
                <Text className="text-secondary">Pay</Text>Com
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity className="h-11 px-2 flex-row items-center gap-1 rounded-xl">
              <MaterialIcons name="language" size={16} color="#c2c6d6" />
              <Text className="font-label-mono-sm text-[11px] uppercase text-on-surface-variant font-medium">EN</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-xl">
              <MaterialIcons name="help-outline" size={20} color="#c2c6d6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 w-full relative bg-surface"
        contentContainerStyle={{ paddingTop: Math.max(insets.top, 16) + 64, paddingBottom: 160 + Math.max(insets.bottom, 16) + 64 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Validation Telemetry Strip */}
        <View className="px-gutter pt-3 pb-2">
          <View className="bg-surface-container-low rounded-xl p-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-secondary" />
                <Text className="font-label-mono-sm text-[11px] uppercase text-on-surface tracking-wider font-semibold">PayCom v1.0</Text>
              </View>
            </View>
            <View className="flex-row gap-2 pt-1">
              <View className="flex-1 flex-row items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg">
                <MaterialIcons name="bolt" size={18} color="#4cd7f6" />
                <View className="flex-col flex-1">
                  <Text className="font-label-mono-sm text-[11px] text-on-surface-variant leading-none">Daya 580W/750W</Text>
                  <Text className="font-body-sm text-[12px] text-secondary font-medium leading-tight" numberOfLines={1}>77% Kapasitas (Aman)</Text>
                </View>
              </View>
              <View className="flex-1 flex-row items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg">
                <MaterialIcons name="speed" size={18} color="#adc6ff" />
                <View className="flex-col flex-1">
                  <Text className="font-label-mono-sm text-[11px] text-on-surface-variant leading-none">Bottleneck Indeks</Text>
                  <Text className="font-body-sm text-[12px] text-primary font-medium leading-tight">1.2% (Optimal)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Component Cards List */}
        <View className="px-gutter flex-col gap-3 pt-1">
          {INITIAL_COMPONENTS.map((item, index) => (
            <View key={item.id} className="relative rounded-xl bg-surface-container p-3.5 overflow-hidden flex-row gap-3">
              <View className="w-16 h-16 rounded-lg bg-surface-container-highest shrink-0 overflow-hidden relative items-center justify-center ml-1.5">
                <Image 
                  source={{ uri: item.image }} 
                  className="w-full h-full" style={{ resizeMode: 'cover' }} 
                />
                <View className="absolute bottom-1 right-1 px-1 bg-surface-container-lowest/90 rounded">
                  <Text className="font-label-mono-sm text-[9px] text-on-surface">{item.category}</Text>
                </View>
              </View>
              <View className="flex-col flex-1">
                <View className="flex-row items-start justify-between gap-1">
                  <View className="flex-row items-center gap-1">
                  </View>
                  <Text className="font-label-mono-sm text-[11px] font-semibold text-secondary">Baru</Text>
                </View>
                <Text className="font-headline-md text-[18px] leading-tight text-on-surface font-semibold mt-0.5" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="font-body-sm text-[12px] text-on-surface-variant">
                  {item.specs}
                </Text>
                <View className="flex-row flex-wrap items-center gap-1.5 mt-2">
                  {item.badges.map((badge, idx) => (
                    <View key={idx} className="px-2 py-0.5 rounded bg-surface-container-highest">
                      <Text className="font-label-mono-sm text-[11px] text-on-surface-variant">{badge}</Text>
                    </View>
                  ))}
                </View>
                <View className="flex-row items-center justify-between mt-3 pt-2">
                  <Text className="font-label-mono-lg text-[14px] font-bold text-on-surface tracking-tight">
                    {formatRupiah(item.price)}
                  </Text>
                  <View className="flex-row items-center gap-1.5">
                    <TouchableOpacity className="px-3 py-1 rounded-lg bg-primary-container flex-row items-center gap-1">
                      <MaterialIcons name="swap-horiz" size={16} color="#00285d" />
                      <Text className="text-on-primary-container font-body-sm text-[12px] font-semibold">Ganti</Text>
                      
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </View>
            </View>
          ))}
          
          {/* Mini Telemetry Diagnostics summary */}
          <View className="rounded-xl bg-surface-container-low p-3.5 gap-2 mt-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-headline-md text-[16px] text-on-surface">Komponen Lainnya (3 Item)</Text>
              <TouchableOpacity className="flex-row items-center gap-0.5">
                <Text className="font-label-mono-sm text-[11px] text-secondary">Lihat Semua</Text>
                <MaterialIcons name="chevron-right" size={14} color="#4cd7f6" />
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-2 pt-1">
              <View className="flex-1 bg-surface-container p-2 rounded-lg items-center">
                <Text className="font-label-mono-sm text-[11px] text-outline">PSU 850W</Text>
                <Text className="font-body-sm text-[12px] text-on-surface font-medium" numberOfLines={1}>Corsair RM850x</Text>
              </View>
              <View className="flex-1 bg-surface-container p-2 rounded-lg items-center">
                <Text className="font-label-mono-sm text-[11px] text-outline">AIO Cooler</Text>
                <Text className="font-body-sm text-[12px] text-on-surface font-medium" numberOfLines={1}>Kraken 360 RGB</Text>
              </View>
              <View className="flex-1 bg-surface-container p-2 rounded-lg items-center">
                <Text className="font-label-mono-sm text-[11px] text-outline">Chassis Case</Text>
                <Text className="font-body-sm text-[12px] text-on-surface font-medium" numberOfLines={1}>NZXT H9 Flow</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Checkout Bar */}
      <View 
        className="absolute left-4 right-4 z-40 bg-surface-container-lowest/95 rounded-2xl p-3.5 flex-col gap-2.5 shadow-md"
        style={{ bottom: Math.max(insets.bottom, 16) + 64 + 16 }}
      >
        <View className="flex-row items-center justify-between px-1">
          <View>
            <Text className="font-body-sm text-[12px] text-on-surface-variant">Total Estimasi Rakitan</Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="font-headline-lg-mobile text-[22px] text-on-surface font-bold tracking-tight">{formatRupiah(34760000)}</Text>
              <Text className="font-label-mono-sm text-[11px] text-outline">(5 Item)</Text>
            </View>
          </View>
        </View>
        
        {/* Main Action */}
        <View className="flex-row gap-2">
          <TouchableOpacity 
            className="flex-2 flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-surface-container-high"
            style={{ flex: 2 }}
          >
            <MaterialIcons name="build-circle" size={18} color="#4cd7f6" />
            <Text className="text-on-surface font-body-md text-[14px] font-semibold" numberOfLines={1}>Selesaikan</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl bg-primary-container"
            style={{ flex: 3 }}
            onPress={() => Alert.alert('Sukses', 'Lanjut ke pembayaran.')}
          >
            <MaterialIcons name="shopping-cart-checkout" size={20} color="#002e6a" />
            <Text className="text-on-primary font-headline-md text-[16px] font-bold" numberOfLines={1}>Beli Rakitan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
