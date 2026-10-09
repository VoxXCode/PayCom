import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ─── Data ──────────────────────────────────────────────────────────────────

type ComponentStatus = 'conflict' | 'ok';
type Category = 'Semua' | 'Processor' | 'Motherboard' | 'RAM' | 'VGA / GPU' | 'Storage NVMe' | 'Power Supply' | 'Cooling' | 'Casing';

interface RigComponent {
  id: string;
  category: Category;
  label: string;
  name: string;
  spec: string;
  tags: string[];
  price: number;
  tdp?: string;
  status: ComponentStatus;
  imageUri: string;
  conflictNote?: string;
}

const INITIAL_COMPONENTS: RigComponent[] = [
  {
    id: 'cpu',
    category: 'Processor',
    label: 'CPU',
    name: 'AMD Ryzen 7 7800X3D',
    spec: '8-Core, 16-Thread • Up to 5.0 GHz • 96MB 3D V-Cache',
    tags: ['Socket AM5', 'Zen 4'],
    price: 6850000,
    tdp: '120W',
    status: 'conflict',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX-UxEtO0OK2gpJRx_8PvmFoDZ0D3tBsceXX9SXNO2Bf2h9gtIbd-i7jHsVcJGNGyxS7vykZ5E2JaHp4NrwqiSo5pipSsQ1Rj557OPAaB_HRAur9tNUlPuk7dUsSVWCiDPuOYl44VYRMNQ7yNY5onlPCsH--VIH1lFEojBVqzP0Nbml9rRAXq5EuEmqC2OzBNJ6SN7LF2LLnBPYZ00zEU35nRRrTL_H6D-QhaDV90B4oTQucH8ig',
    conflictNote: 'Socket AM5 tidak cocok dengan Motherboard LGA1700',
  },
  {
    id: 'mobo',
    category: 'Motherboard',
    label: 'MOBO',
    name: 'ASUS ROG Strix Z790-E WiFi II',
    spec: 'Intel Z790 Chipset • DDR5 • PCIe 5.0 • WiFi 7',
    tags: ['Socket LGA1700', 'DDR5 Max 8000+'],
    price: 7420000,
    status: 'conflict',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlMwQGUKrAkfp0lOcZa1sqqKpyiHqoGWBtZrh7O8iVr2sSMPqyFK2hvgNgu-ltzPqICur_gr1F9ee9GbYTsKtSycJjltrt9iwYskMvJ15QPygGpUdXaIXIBYf8zK08UY71DkJThHtM8bvf16lt3H3mhwzgoB_XF3arhF6MSadEJaPe5BC1652lP9kSdlgwbhX8Nm_-J76xDia7D2sPIaZQ8r_NDftcojEf5FDfQsK_BUzG7RMGYw',
    conflictNote: 'Socket LGA1700 tidak cocok dengan CPU AM5',
  },
  {
    id: 'gpu',
    category: 'VGA / GPU',
    label: 'GPU',
    name: 'ASUS TUF RTX 4070 Ti Super 16GB',
    spec: '16GB GDDR6X • DLSS 3.5 • Panjang 305mm (Fit Casing)',
    tags: ['PCIe 4.0 x16', '3.15 Slot'],
    price: 14890000,
    tdp: '285W',
    status: 'ok',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPJGQUyLq40NAdCIMxxbNUK75_18wxzyl7StAVXby1MLkK7yBL1LNsCa6tQwFvVg12U0GY4cKo2NfVA69tB_FR_3dfXFi5rO7rgnvViDvy_6RVfeBh8Qn7ifOwRY35yfifJZI0lB1912Ym85WMJ64_WwRCmL4uJw9V6KbJ_pkT_It5LD8QfQHcCsXLdIq9XiPFCcOoaAqWZ0wCPde8t082IGyXLjuy8scB4TOisrxrnpmBeCBSQ',
  },
  {
    id: 'ram',
    category: 'RAM',
    label: 'RAM',
    name: 'Corsair Dominator Titanium RGB',
    spec: '32GB (2x16GB) • DDR5 6000MHz CL30 • Intel XMP & AMD EXPO',
    tags: ['DDR5', '2x16GB Kit'],
    price: 2850000,
    status: 'ok',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1AsmAs-DlcUcA3h3lZk0754Jis4zROVbcTzSq14ek1FURAgPw_rgGmXLNztamj7Ml9R00dXKNI6XuZLM3zvewswcVz4gJPFBuF2anqT7Vf3GCLbYqrXLLEgohmGNVqNYgyFWDerO8L7DDy6iPH4hkiVhXkHQE41PysGu4JpymSCkHrrr-N0mwhPgXeKLsZW89_m2xZHo05nlqgtNjTU9If5hTAomHBvOIehGQXvZLkVmga5SZLg',
  },
  {
    id: 'ssd',
    category: 'Storage NVMe',
    label: 'SSD',
    name: 'Samsung 990 PRO NVMe M.2 2TB',
    spec: 'PCIe 4.0 NVMe 2.0 • V-NAND TLC • 1200 TBW Garansi 5 Thn',
    tags: ['M.2_1 Slot', '7450 MB/s'],
    price: 2750000,
    status: 'ok',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjEbKOZ4mJfzkXVo_lwig7O3fnoisB3zh6PKbiCy04BEBgvyH3AWMNc4tQpQ8eHn0DCn5hLXj1yZYlWp30EtU59f5fXl7k_z5Z9yayQ5Sfzj_RcMD2sQxLG0vjPnvHi0FwpvQf6RlwAE-bcYSpJVsTNK0h_DP8RLMPukcyWUOxR0ctXuNNcdDstMX9SCe267gP7-Jvqis8wlTOlA9GpwS2iSStsTox6sJbi9vA3F4Unyi-0dZrzw',
  },
  {
    id: 'psu',
    category: 'Power Supply',
    label: 'PSU',
    name: 'Corsair RM850x',
    spec: '850W 80+ Gold • Fully Modular • Zero RPM Mode • 10 Yr Warranty',
    tags: ['ATX 3.0', '850W'],
    price: 2200000,
    status: 'ok',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaAykO7w-zYz2ROy5dGp_BGCruzWVA6T0NaVbtCYhqrrgzI3vKnxV1ccPKHzyk2Y963AYU5EYdKXRQi_WmzFEaOSzEwYK7uArc2DqoWEVPX7iWa8g8wJJFPNzBPC0sGlZjWbvtEHzEB4B5UOnnQdPrrIx5BUnU1pTMIR5Ua0VJvBp7yU0IFNe_i2hWXsKQOWrKdi_r61EVH8HjB8XgrwEEm20-gXlA-H3-ZtlmBYGEdZ8l_1aCug',
  },
  {
    id: 'cooler',
    category: 'Cooling',
    label: 'AIO',
    name: 'NZXT Kraken 360 RGB',
    spec: '360mm Radiator • 3x120mm Fan • LCD Display Cap • 6 Yr Warranty',
    tags: ['360mm AIO', 'Socket AM5'],
    price: 2390000,
    status: 'ok',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb3JLdgO4R4qgAKfoz-ZQBTDO5snkg-q_v8HZlsac80kq-VgbiKweQT4yr8LTvKsgXynUePL4NkkHrq8mqeJzWqR_GxfuNMdibjaOq0vNFR__id2a_1uq-Bh2d-I6OJCDJgvMYGunwxwYuK_dlK8fT7nLqyfBujqfcOGKhXzowf6pvj0yfdGnkoPQ4LJIvIYe1snoxrZjXyhYptPR8RupVkEKF9JC7Xj79-mSWqZyXFsBPLa0hWg',
  },
  {
    id: 'case',
    category: 'Casing',
    label: 'CASE',
    name: 'NZXT H9 Flow',
    spec: 'Full Tower • Dual Chamber • 4-Side Tempered Glass • E-ATX Ready',
    tags: ['Full Tower', 'E-ATX'],
    price: 1950000,
    status: 'ok',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdTa7by6dYCz8wMUpQrOsGlycw1Sw4wQjpw3uSrsETBRTfrDEVKKXxfJ53ZNabewI-OJ4_9SqrNN8QO2J_-IT9G5X80Ay9aXLSs3ihg-Wp-SY4shSSa4y-2XWK6Bg9TigVlK9kcoVv8eRrSV_i0DWCZbNbElL3rUpq78K-S88iCngIfsNqzS54LQ_Sim8iZVXvTCqtSesaSlPsUB1Tf_EVzrWMLlzf_i3oXwsPqx_uJgxbgENz8g',
  },
];

const CATEGORIES: Category[] = [
  'Semua', 'Processor', 'Motherboard', 'RAM', 'VGA / GPU',
  'Storage NVMe', 'Power Supply', 'Cooling', 'Casing',
];

const fmt = (n: number) =>
  'Rp ' + n.toLocaleString('id-ID');

// ─── Component ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [components, setComponents] = useState<RigComponent[]>(INITIAL_COMPONENTS);
  const [activeCategory, setActiveCategory] = useState<Category>('Semua');
  const [conflictResolved, setConflictResolved] = useState(false);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [swapTarget, setSwapTarget] = useState<RigComponent | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const bannerShake = useRef(new Animated.Value(0)).current;

  // ── Derived ─────────────────────────────────────────────────────────────

  const hasConflict = components.some(c => c.status === 'conflict') && !conflictResolved;
  const totalPrice = components.reduce((s, c) => s + c.price, 0);

  const visibleComponents = activeCategory === 'Semua'
    ? components
    : components.filter(c => c.category === activeCategory);

  const conflictCount = components.filter(c => c.status === 'conflict').length;

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleDelete = (id: string) => {
    Alert.alert(
      'Hapus Komponen',
      'Yakin ingin menghapus komponen ini dari rakitan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => setComponents(prev => prev.filter(c => c.id !== id)),
        },
      ],
    );
  };

  const handleOpenSwap = (comp: RigComponent) => {
    setSwapTarget(comp);
    setSwapModalVisible(true);
  };

  const handleFixCPU = () => {
    setComponents(prev =>
      prev.map(c =>
        c.id === 'cpu'
          ? {
              ...c,
              name: 'Intel Core i9-14900K',
              spec: '24-Core (8P+16E) • Up to 6.0 GHz • 36MB Cache',
              tags: ['Socket LGA1700', 'Raptor Lake'],
              tdp: '125W',
              conflictNote: undefined,
              status: 'ok',
            }
          : c.id === 'mobo'
          ? { ...c, status: 'ok', conflictNote: undefined }
          : c,
      ),
    );
    setConflictResolved(true);
    setSwapModalVisible(false);
  };

  const handleFixMobo = () => {
    setComponents(prev =>
      prev.map(c =>
        c.id === 'mobo'
          ? {
              ...c,
              name: 'ASUS ROG Crosshair X670E Hero',
              spec: 'AMD X670E Chipset • DDR5 • PCIe 5.0 • WiFi 6E',
              tags: ['Socket AM5', 'DDR5 Max 6400+'],
              conflictNote: undefined,
              status: 'ok',
            }
          : c.id === 'cpu'
          ? { ...c, status: 'ok', conflictNote: undefined }
          : c,
      ),
    );
    setConflictResolved(true);
    setSwapModalVisible(false);
  };

  const shakeBanner = () => {
    Animated.sequence([
      Animated.timing(bannerShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(bannerShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(bannerShake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(bannerShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleCheckout = () => {
    if (hasConflict) {
      shakeBanner();
      Alert.alert(
        '⚠️ Ada Konflik',
        'Selesaikan ketidakcocokan Socket Processor & Motherboard sebelum melanjutkan.',
        [{ text: 'OK' }],
      );
    } else {
      router.push('/(tabs)/explore');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View className="flex-1 bg-surface">
      {/* ── Header ── */}
      <View
        className="absolute top-0 w-full z-50 bg-surface-container-lowest/80 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="h-16 px-gutter flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-9 h-9 rounded-xl bg-surface-container-high items-center justify-center">
              <MaterialIcons name="memory" size={20} color="#4cd7f6" />
            </View>
            <View>
              <Text className="text-[20px] leading-tight text-on-surface font-bold tracking-tight">PayCom</Text>
              <Text className="text-[11px] text-secondary leading-tight tracking-wider uppercase font-medium">Studio</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high">
              <MaterialIcons name="bolt" size={14} color="#4cd7f6" />
              <Text className="text-[11px] text-on-surface font-bold">
                {components.reduce((s,c)=> s + (c.id==='gpu'?285:c.id==='cpu'?120:0),0)}W
                <Text className="text-outline font-normal">/750W</Text>
              </Text>
            </View>
            <TouchableOpacity
              className="w-11 h-11 items-center justify-center rounded-xl bg-surface-container"
              onPress={() => Alert.alert('Notifikasi', 'Tidak ada notifikasi baru.')}
            >
              <MaterialIcons name="notifications" size={20} color="#c2c6d6" />
            </TouchableOpacity>
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
              <MaterialIcons name="person" size={18} color="#002e6a" />
            </View>
          </View>
        </View>
      </View>

      {/* ── Main ScrollView ── */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-surface"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16) + 64,
          paddingBottom: 160,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Telemetry Strip */}
        <View className="px-gutter pt-3 pb-2">
          <View className="bg-surface-container-low rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-secondary" />
                <Text className="text-[11px] uppercase text-on-surface tracking-wider font-semibold">Rig v3.8 • Live Validation</Text>
              </View>
              <View className="px-2 py-0.5 rounded bg-surface-container-highest">
                <Text className="text-[11px] text-secondary">ATX Format</Text>
              </View>
            </View>
            <View className="flex-row gap-2 pt-1">
              <View className="flex-1 flex-row items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg">
                <MaterialIcons name="bolt" size={18} color="#4cd7f6" />
                <View>
                  <Text className="text-[11px] text-on-surface-variant">Daya estimasi</Text>
                  <Text className="text-[12px] text-secondary font-medium" numberOfLines={1}>
                    {Math.round((components.reduce((s,c)=>s+c.price,0)/components[0]?.price)*10+400)}W / 750W Aman
                  </Text>
                </View>
              </View>
              <View className="flex-1 flex-row items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg">
                <MaterialIcons name="speed" size={18} color="#adc6ff" />
                <View>
                  <Text className="text-[11px] text-on-surface-variant">Bottleneck Indeks</Text>
                  <Text className="text-[12px] text-primary font-medium">{hasConflict ? 'N/A (Konflik)' : '1.2% (Optimal)'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Conflict Banner */}
        {hasConflict && (
          <Animated.View style={{ transform: [{ translateX: bannerShake }] }} className="px-gutter py-2">
            <View className="rounded-xl bg-error-container p-4 overflow-hidden">
              <View className="flex-row items-start gap-3">
                <View className="w-9 h-9 rounded-lg items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(255,218,214,0.15)' }}>
                  <MaterialIcons name="warning" size={22} color="#ffb3ad" />
                </View>
                <View className="flex-col flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[18px] leading-tight text-on-error-container font-bold">Konflik Soket Terdeteksi</Text>
                    <View className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,218,214,0.2)' }}>
                      <Text className="text-[11px] text-on-error-container font-semibold uppercase">Fatal</Text>
                    </View>
                  </View>
                  <Text className="text-[12px] text-on-error-container mt-1 leading-snug">
                    CPU <Text className="font-semibold underline">Socket AM5</Text> tidak kompatibel secara fisik dengan Motherboard <Text className="font-semibold underline">LGA1700</Text>.
                  </Text>
                  <View className="mt-3 flex-col gap-2">
                    <TouchableOpacity
                      className="flex-row items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-tertiary"
                      onPress={handleFixMobo}
                    >
                      <MaterialIcons name="sync-alt" size={16} color="#68000a" />
                      <Text className="text-on-tertiary text-[12px] font-semibold">Ganti Motherboard ke AM5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-highest"
                      onPress={handleFixCPU}
                    >
                      <MaterialIcons name="swap-horiz" size={16} color="#dfe2f1" />
                      <Text className="text-on-surface text-[12px] font-medium">Ganti CPU ke Intel LGA1700</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Conflict Resolved Banner */}
        {conflictResolved && (
          <View className="px-gutter py-2">
            <View className="rounded-xl p-3 flex-row items-center gap-3" style={{ backgroundColor: '#1a2e1a' }}>
              <MaterialIcons name="check-circle" size={22} color="#4cd7f6" />
              <View>
                <Text className="text-[14px] text-secondary font-bold">Konflik Berhasil Diselesaikan!</Text>
                <Text className="text-[12px] text-on-surface-variant">Semua komponen kini kompatibel satu sama lain.</Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Chips */}
        <View className="py-2.5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              const catConflict = cat !== 'Semua' && components.some(c => c.category === cat && c.status === 'conflict');
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full flex-row items-center gap-1.5 ${isActive ? 'bg-secondary-container' : 'bg-surface-container-high'}`}
                >
                  {catConflict && <View className="h-2 w-2 rounded-full bg-error" />}
                  <Text className={`text-[11px] font-semibold ${isActive ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}>{cat}</Text>
                  {cat === 'Semua' && (
                    <View className={`w-4 h-4 rounded-full items-center justify-center ${isActive ? 'bg-on-secondary-container' : 'bg-surface-container-highest'}`}>
                      <Text className={`text-[10px] font-bold ${isActive ? 'text-secondary-container' : 'text-on-surface'}`}>{components.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Component Cards */}
        <View className="px-gutter flex-col gap-3 pt-1">
          {visibleComponents.length === 0 && (
            <View className="items-center justify-center py-10">
              <MaterialIcons name="inbox" size={40} color="#424754" />
              <Text className="text-[14px] text-outline mt-2">Tidak ada komponen di kategori ini.</Text>
            </View>
          )}
          {visibleComponents.map(comp => (
            <ComponentCard
              key={comp.id}
              comp={comp}
              onDelete={() => handleDelete(comp.id)}
              onSwap={() => handleOpenSwap(comp)}
              onFixMobo={handleFixMobo}
              onFixCPU={handleFixCPU}
            />
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View
        className="absolute left-4 right-4 z-40 bg-surface-container-lowest rounded-2xl p-3.5 flex-col gap-2.5"
        style={{ bottom: Math.max(insets.bottom, 16) + 64 }}
      >
        <View className="flex-row items-center justify-between px-1">
          <View>
            <Text className="text-[12px] text-on-surface-variant">Total Estimasi Rakitan</Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-[22px] text-on-surface font-bold tracking-tight">{fmt(totalPrice)}</Text>
              <Text className="text-[11px] text-outline">({components.length} Item)</Text>
            </View>
          </View>
          {hasConflict ? (
            <View className="flex-col items-end">
              <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(147,0,10,0.4)' }}>
                <MaterialIcons name="warning" size={13} color="#ffb4ab" />
                <Text className="text-[11px] text-error font-semibold">{conflictCount} Konflik Fatal</Text>
              </View>
              <Text className="text-[12px] text-outline mt-0.5">Soket Tidak Cocok</Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(76,215,246,0.15)' }}>
              <MaterialIcons name="check-circle" size={13} color="#4cd7f6" />
              <Text className="text-[11px] text-secondary font-semibold">Siap Checkout</Text>
            </View>
          )}
        </View>
        <View className="flex-row gap-2">
          {hasConflict && (
            <TouchableOpacity
              className="flex-row items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-surface-container-high"
              style={{ flex: 2 }}
              onPress={shakeBanner}
            >
              <MaterialIcons name="build-circle" size={18} color="#ffb4ab" />
              <Text className="text-on-surface text-[14px] font-semibold" numberOfLines={1}>Selesaikan</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl bg-primary-container"
            style={{ flex: hasConflict ? 3 : 1 }}
            onPress={handleCheckout}
          >
            <MaterialIcons name="shopping-cart-checkout" size={20} color="#002e6a" />
            <Text className="text-on-primary text-[16px] font-bold" numberOfLines={1}>
              {hasConflict ? 'Beli Rakitan' : 'Checkout Sekarang'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Swap / Ganti Modal */}
      <Modal
        visible={swapModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSwapModalVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View className="bg-surface-container rounded-t-2xl p-5 gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] text-on-surface font-bold">Ganti {swapTarget?.label}</Text>
              <TouchableOpacity onPress={() => setSwapModalVisible(false)}>
                <MaterialIcons name="close" size={22} color="#c2c6d6" />
              </TouchableOpacity>
            </View>
            {swapTarget?.status === 'conflict' && (
              <View className="rounded-xl bg-error-container/40 p-3">
                <Text className="text-[12px] text-error font-semibold">⚠️ {swapTarget.conflictNote}</Text>
              </View>
            )}
            <Text className="text-[13px] text-on-surface-variant">Pilih solusi untuk komponen ini:</Text>
            {swapTarget?.id === 'cpu' && (
              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 rounded-xl bg-surface-container-high"
                onPress={handleFixCPU}
              >
                <MaterialIcons name="swap-horiz" size={20} color="#adc6ff" />
                <View className="flex-1">
                  <Text className="text-[14px] text-on-surface font-semibold">Intel Core i9-14900K</Text>
                  <Text className="text-[12px] text-on-surface-variant">Socket LGA1700 • 24-Core • 6.0 GHz Max</Text>
                </View>
                <Text className="text-[13px] text-secondary font-bold">Rp 7.200.000</Text>
              </TouchableOpacity>
            )}
            {swapTarget?.id === 'mobo' && (
              <TouchableOpacity
                className="flex-row items-center gap-3 p-3 rounded-xl bg-surface-container-high"
                onPress={handleFixMobo}
              >
                <MaterialIcons name="swap-horiz" size={20} color="#adc6ff" />
                <View className="flex-1">
                  <Text className="text-[14px] text-on-surface font-semibold">ASUS ROG Crosshair X670E Hero</Text>
                  <Text className="text-[12px] text-on-surface-variant">Socket AM5 • AMD X670E • DDR5 • PCIe 5.0</Text>
                </View>
                <Text className="text-[13px] text-secondary font-bold">Rp 8.150.000</Text>
              </TouchableOpacity>
            )}
            {swapTarget?.status === 'ok' && (
              <View className="items-center py-4">
                <MaterialIcons name="check-circle" size={36} color="#4cd7f6" />
                <Text className="text-[14px] text-secondary mt-2 font-semibold">Komponen ini sudah kompatibel</Text>
                <Text className="text-[12px] text-on-surface-variant mt-1">Tidak ada konflik terdeteksi.</Text>
              </View>
            )}
            <TouchableOpacity
              className="w-full py-3 rounded-xl bg-surface-container-high items-center"
              onPress={() => setSwapModalVisible(false)}
            >
              <Text className="text-[14px] text-on-surface-variant font-medium">Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── ComponentCard ──────────────────────────────────────────────────────────

interface CardProps {
  comp: RigComponent;
  onDelete: () => void;
  onSwap: () => void;
  onFixMobo: () => void;
  onFixCPU: () => void;
}

function ComponentCard({ comp, onDelete, onSwap, onFixMobo, onFixCPU }: CardProps) {
  const isConflict = comp.status === 'conflict';
  const borderColor = isConflict ? '#ffb4ab' : '#4cd7f6';

  return (
    <View className="rounded-xl bg-surface-container p-3.5 overflow-hidden flex-row gap-3">
      <View className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: borderColor }} />
      <View className="w-16 h-16 rounded-lg bg-surface-container-highest shrink-0 overflow-hidden relative items-center justify-center ml-1.5">
        <Image source={{ uri: comp.imageUri }} className="w-full h-full" style={{ resizeMode: 'cover' }} />
        <View className="absolute bottom-1 right-1 px-1 rounded" style={{ backgroundColor: 'rgba(10,14,24,0.9)' }}>
          <Text className="text-[9px] text-on-surface">{comp.label}</Text>
        </View>
      </View>
      <View className="flex-col flex-1">
        <View className="flex-row items-start justify-between gap-1">
          <View className="flex-row items-center gap-1">
            <MaterialIcons name={isConflict ? 'error' : 'check-circle'} size={13} color={borderColor} />
            <Text className={`text-[11px] uppercase font-semibold tracking-wide ${isConflict ? 'text-error' : 'text-secondary'}`}>
              {isConflict ? comp.id === 'cpu' ? 'Konflik Soket' : 'Mismatch Socket' : 'Kompatibel'}
            </Text>
          </View>
          {comp.tdp && (
            <Text className="text-[11px] font-semibold text-secondary">{comp.tdp}</Text>
          )}
        </View>
        <Text className="text-[18px] leading-tight text-on-surface font-semibold mt-0.5" numberOfLines={1}>{comp.name}</Text>
        <Text className="text-[12px] text-on-surface-variant" numberOfLines={2}>{comp.spec}</Text>
        <View className="flex-row flex-wrap items-center gap-1.5 mt-2">
          {comp.tags.map(tag => (
            <View key={tag} className={`px-2 py-0.5 rounded ${isConflict ? 'bg-error-container' : 'bg-surface-container-highest'}`}>
              <Text className={`text-[11px] font-semibold ${isConflict ? 'text-on-error-container' : 'text-on-surface-variant'}`}>{tag}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row items-center justify-between mt-3 pt-2">
          <Text className="text-[14px] font-bold text-on-surface tracking-tight">{'Rp ' + comp.price.toLocaleString('id-ID')}</Text>
          <View className="flex-row items-center gap-1.5">
            <TouchableOpacity
              className="px-2.5 py-1 rounded-lg bg-surface-container-highest flex-row items-center gap-1"
              onPress={onDelete}
            >
              <MaterialIcons name="delete" size={15} color="#ffb4ab" />
              <Text className="text-error text-[12px] font-medium">Hapus</Text>
            </TouchableOpacity>
            {isConflict && comp.id === 'cpu' && (
              <TouchableOpacity
                className="px-3 py-1 rounded-lg bg-tertiary flex-row items-center gap-1"
                onPress={onFixCPU}
              >
                <MaterialIcons name="auto-fix-high" size={15} color="#68000a" />
                <Text className="text-on-tertiary text-[12px] font-bold">Fix Intel</Text>
              </TouchableOpacity>
            )}
            {isConflict && comp.id === 'mobo' && (
              <TouchableOpacity
                className="px-3 py-1 rounded-lg bg-tertiary flex-row items-center gap-1"
                onPress={onFixMobo}
              >
                <MaterialIcons name="auto-fix-high" size={15} color="#68000a" />
                <Text className="text-on-tertiary text-[12px] font-bold">Pilih AM5</Text>
              </TouchableOpacity>
            )}
            {!isConflict && (
              <TouchableOpacity
                className="px-3 py-1 rounded-lg bg-primary-container flex-row items-center gap-1"
                onPress={onSwap}
              >
                <MaterialIcons name="swap-horiz" size={15} color="#00285d" />
                <Text className="text-on-primary-container text-[12px] font-semibold">Ganti</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
