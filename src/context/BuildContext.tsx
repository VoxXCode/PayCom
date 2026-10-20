import React, { createContext, useContext, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export type CatalogItem = {
  id: string;
  category: string;
  name: string;
  specs: string;
  price: number;
  wattage: number;
  image: string;
  badges: string[];
};

export type BuildSlot = {
  id: string;
  category: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  selectedItem: CatalogItem | null;
};

export const CATALOG: Record<string, CatalogItem[]> = {
  CPU: [
    {
      id: 'cpu-1',
      category: 'CPU',
      name: 'AMD Ryzen 7 7800X3D',
      specs: '8-Core, 16-Thread • Up to 5.0 GHz • 96MB 3D V-Cache',
      price: 6850000,
      wattage: 120,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX-UxEtO0OK2gpJRx_8PvmFoDZ0D3tBsceXX9SXNO2Bf2h9gtIbd-i7jHsVcJGNGyxS7vykZ5E2JaHp4NrwqiSo5pipSsQ1Rj557OPAaB_HRAur9tNUlPuk7dUsSVWCiDPuOYl44VYRMNQ7yNY5onlPCsH--VIH1lFEojBVqzP0Nbml9rRAXq5EuEmqC2OzBNJ6SN7LF2LLnBPYZ00zEU35nRRrTL_H6D-QhaDV90B4oTQucH8ig',
      badges: ['Socket AM5', 'Zen 4', '120W TDP']
    },
    {
      id: 'cpu-2',
      category: 'CPU',
      name: 'Intel Core i7-14700K',
      specs: '20-Core (8P+12E), 28-Thread • Up to 5.6 GHz',
      price: 6990000,
      wattage: 253,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaAykO7w-zYz2ROy5dGp_BGCruzWVA6T0NaVbtCYhqrrgzI3vKnxV1ccPKHzyk2Y963AYU5EYdKXRQi_WmzFEaOSzEwYK7uArc2DqoWEVPX7iWa8g8wJJFPNzBPC0sGlZjWbvtEHzEB4B5UOnnQdPrrIx5BUnU1pTMIR5Ua0VJvBp7yU0IFNe_i2hWXsKQOWrKdi_r61EVH8HjB8XgrwEEm20-gXlA-H3-ZtlmBYGEdZ8l_1aCug',
      badges: ['Socket LGA1700', '14th Gen', '253W Max']
    },
    {
      id: 'cpu-3',
      category: 'CPU',
      name: 'AMD Ryzen 5 7600X',
      specs: '6-Core, 12-Thread • Up to 5.3 GHz • 38MB Cache',
      price: 3750000,
      wattage: 105,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX-UxEtO0OK2gpJRx_8PvmFoDZ0D3tBsceXX9SXNO2Bf2h9gtIbd-i7jHsVcJGNGyxS7vykZ5E2JaHp4NrwqiSo5pipSsQ1Rj557OPAaB_HRAur9tNUlPuk7dUsSVWCiDPuOYl44VYRMNQ7yNY5onlPCsH--VIH1lFEojBVqzP0Nbml9rRAXq5EuEmqC2OzBNJ6SN7LF2LLnBPYZ00zEU35nRRrTL_H6D-QhaDV90B4oTQucH8ig',
      badges: ['Socket AM5', 'Zen 4', '105W TDP']
    }
  ],
  MOBO: [
    {
      id: 'mobo-1',
      category: 'MOBO',
      name: 'ASUS ROG Strix B650-A Gaming WiFi',
      specs: 'AMD B650 Chipset • Socket AM5 • DDR5 • PCIe 5.0',
      price: 4450000,
      wattage: 30,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlMwQGUKrAkfp0lOcZa1sqqKpyiHqoGWBtZrh7O8iVr2sSMPqyFK2hvgNgu-ltzPqICur_gr1F9ee9GbYTsKtSycJjltrt9iwYskMvJ15QPygGpUdXaIXIBYf8zK08UY71DkJThHtM8bvf16lt3H3mhwzgoB_XF3arhF6MSadEJaPe5BC1652lP9kSdlgwbhX8Nm_-J76xDia7D2sPIaZQ8r_NDftcojEf5FDfQsK_BUzG7RMGYw',
      badges: ['Socket AM5', 'WiFi 6E', 'DDR5']
    },
    {
      id: 'mobo-2',
      category: 'MOBO',
      name: 'ASUS ROG Strix Z790-E WiFi II',
      specs: 'Intel Z790 Chipset • Socket LGA1700 • DDR5 • PCIe 5.0 • WiFi 7',
      price: 7420000,
      wattage: 35,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlMwQGUKrAkfp0lOcZa1sqqKpyiHqoGWBtZrh7O8iVr2sSMPqyFK2hvgNgu-ltzPqICur_gr1F9ee9GbYTsKtSycJjltrt9iwYskMvJ15QPygGpUdXaIXIBYf8zK08UY71DkJThHtM8bvf16lt3H3mhwzgoB_XF3arhF6MSadEJaPe5BC1652lP9kSdlgwbhX8Nm_-J76xDia7D2sPIaZQ8r_NDftcojEf5FDfQsK_BUzG7RMGYw',
      badges: ['Socket LGA1700', 'WiFi 7', 'DDR5 8000+']
    }
  ],
  RAM: [
    {
      id: 'ram-1',
      category: 'RAM',
      name: 'Corsair Dominator Titanium RGB',
      specs: '32GB (2x16GB) • DDR5 6000MHz CL30 • EXPO & XMP',
      price: 2850000,
      wattage: 15,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1AsmAs-DlcUcA3h3lZk0754Jis4zROVbcTzSq14ek1FURAgPw_rgGmXLNztamj7Ml9R00dXKNI6XuZLM3zvewswcVz4gJPFBuF2anqT7Vf3GCLbYqrXLLEgohmGNVqNYgyFWDerO8L7DDy6iPH4hkiVhXkHQE41PysGu4JpymSCkHrrr-N0mwhPgXeKLsZW89_m2xZHo05nlqgtNjTU9If5hTAomHBvOIehGQXvZLkVmga5SZLg',
      badges: ['32GB Kit', 'DDR5 6000', 'CL30']
    },
    {
      id: 'ram-2',
      category: 'RAM',
      name: 'G.Skill Trident Z5 RGB Black',
      specs: '32GB (2x16GB) • DDR5 6400MHz CL32',
      price: 2650000,
      wattage: 15,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb3JLdgO4R4qgAKfoz-ZQBTDO5snkg-q_v8HZlsac80kq-VgbiKweQT4yr8LTvKsgXynUePL4NkkHrq8mqeJzWqR_GxfuNMdibjaOq0vNFR__id2a_1uq-Bh2d-I6OJCDJgvMYGunwxwYuK_dlK8fT7nLqyfBujqfcOGKhXzowf6pvj0yfdGnkoPQ4LJIvIYe1snoxrZjXyhYptPR8RupVkEKF9JC7Xj79-mSWqZyXFsBPLa0hWg',
      badges: ['32GB Kit', 'DDR5 6400', 'RGB']
    }
  ],
  GPU: [
    {
      id: 'gpu-1',
      category: 'GPU',
      name: 'ASUS TUF RTX 4070 Ti Super 16GB',
      specs: '16GB GDDR6X • DLSS 3.5 • 285W TDP • Panjang 305mm',
      price: 14890000,
      wattage: 285,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPJGQUyLq40NAdCIMxxbNUK75_18wxzyl7StAVXby1MLkK7yBL1LNsCa6tQwFvVg12U0GY4cKo2NfVA69tB_FR_3dfXFi5rO7rgnvViDvy_6RVfeBh8Qn7ifOwRY35yfifJZI0lB1912Ym85WMJ64_WwRCmL4uJw9V6KbJ_pkT_It5LD8QfQHcCsXLdIq9XiPFCcOoaAqWZ0wCPde8t082IGyXLjuy8scB4TOisrxrnpmBeCBSQ',
      badges: ['PCIe 4.0 x16', '16GB VRAM', 'DLSS 3.5']
    },
    {
      id: 'gpu-2',
      category: 'GPU',
      name: 'Gigabyte RTX 4080 Super Gaming OC',
      specs: '16GB GDDR6X • DLSS 3.5 • 320W TDP • Windforce Cooling',
      price: 18750000,
      wattage: 320,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdTa7by6dYCz8wMUpQrOsGlycw1Sw4wQjpw3uSrsETBRTfrDEVKKXxfJ53ZNabewI-OJ4_9SqrNN8QO2J_-IT9G5X80Ay9aXLSs3ihg-Wp-SY4shSSa4y-2XWK6Bg9TigVlK9kcoVv8eRrSV_i0DWCZbNbElL3rUpq78K-S88iCngIfsNqzS54LQ_Sim8iZVXvTCqtSesaSlPsUB1Tf_EVzrWMLlzf_i3oXwsPqx_uJgxbgENz8g',
      badges: ['RTX 4080 Super', '4K Gaming', '320W']
    }
  ],
  SSD: [
    {
      id: 'ssd-1',
      category: 'SSD',
      name: 'Samsung 990 PRO NVMe M.2 2TB',
      specs: 'PCIe 4.0 NVMe 2.0 • Read Up to 7.450 MB/s • V-NAND TLC',
      price: 2750000,
      wattage: 10,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjEbKOZ4mJfzkXVo_lwig7O3fnoisB3zh6PKbiCy04BEBgvyH3AWMNc4tQpQ8eHn0DCn5hLXj1yZYlWp30EtU59f5fXl7k_z5Z9yayQ5Sfzj_RcMD2sQxLG0vjPnvHi0FwpvQf6RlwAE-bcYSpJVsTNK0h_DP8RLMPukcyWUOxR0ctXuNNcdDstMX9SCe267gP7-Jvqis8wlTOlA9GpwS2iSStsTox6sJbi9vA3F4Unyi-0dZrzw',
      badges: ['2TB', 'PCIe 4.0', '7450 MB/s']
    },
    {
      id: 'ssd-2',
      category: 'SSD',
      name: 'Kingston KC3000 PCIe 4.0 1TB',
      specs: 'PCIe 4.0 NVMe M.2 • Read Up to 7.000 MB/s',
      price: 1620000,
      wattage: 10,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjEbKOZ4mJfzkXVo_lwig7O3fnoisB3zh6PKbiCy04BEBgvyH3AWMNc4tQpQ8eHn0DCn5hLXj1yZYlWp30EtU59f5fXl7k_z5Z9yayQ5Sfzj_RcMD2sQxLG0vjPnvHi0FwpvQf6RlwAE-bcYSpJVsTNK0h_DP8RLMPukcyWUOxR0ctXuNNcdDstMX9SCe267gP7-Jvqis8wlTOlA9GpwS2iSStsTox6sJbi9vA3F4Unyi-0dZrzw',
      badges: ['1TB', 'PCIe 4.0', '7000 MB/s']
    }
  ]
};

export const DEFAULT_SLOTS: BuildSlot[] = [
  { id: 'slot-cpu', category: 'CPU', name: 'Processor', icon: 'memory', selectedItem: null },
  { id: 'slot-mobo', category: 'MOBO', name: 'Motherboard', icon: 'developer-board', selectedItem: null },
  { id: 'slot-ram', category: 'RAM', name: 'Memory RAM', icon: 'storage', selectedItem: null },
  { id: 'slot-gpu', category: 'GPU', name: 'Kartu Grafis', icon: 'videogame-asset', selectedItem: null },
  { id: 'slot-ssd', category: 'SSD', name: 'Penyimpanan SSD', icon: 'save', selectedItem: null }
];

export function formatRupiah(price: number): string {
  return 'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

type BuildContextType = {
  slots: BuildSlot[];
  CATALOG: Record<string, CatalogItem[]>;
  filledSlots: BuildSlot[];
  filledCount: number;
  totalPrice: number;
  totalWattage: number;
  capacityPercent: number;
  bottleneckText: string;
  voucherApplied: boolean;
  setVoucherApplied: (val: boolean) => void;
  setSlotItem: (slotId: string, item: CatalogItem) => void;
  removeSlotItem: (slotId: string) => void;
  quickFill: () => void;
  resetSlots: () => void;
  formatRupiah: (price: number) => string;
};

const BuildContext = createContext<BuildContextType | null>(null);

export function BuildProvider({ children }: { children: React.ReactNode }) {
  const [slots, setSlots] = useState<BuildSlot[]>(DEFAULT_SLOTS);
  const [voucherApplied, setVoucherApplied] = useState(true);

  const filledSlots = slots.filter(s => s.selectedItem !== null);
  const filledCount = filledSlots.length;
  const totalPrice = slots.reduce((sum, s) => sum + (s.selectedItem?.price || 0), 0);

  const totalWattage = slots.reduce((sum, s) => sum + (s.selectedItem?.wattage || 0), 0) + (filledCount > 0 ? 50 : 0);
  const capacityPercent = Math.min(Math.round((totalWattage / 750) * 100), 100);

  const hasCpu = slots.some(s => s.category === 'CPU' && s.selectedItem !== null);
  const hasGpu = slots.some(s => s.category === 'GPU' && s.selectedItem !== null);
  const bottleneckText = (hasCpu && hasGpu)
    ? '1.2% (Optimal)'
    : filledCount > 0
      ? 'Menunggu CPU & GPU'
      : 'Belum Aktif';

  const setSlotItem = (slotId: string, item: CatalogItem) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, selectedItem: item };
      }
      return slot;
    }));
  };

  const removeSlotItem = (slotId: string) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, selectedItem: null };
      }
      return slot;
    }));
  };

  const quickFill = () => {
    setSlots(prev => prev.map(slot => ({
      ...slot,
      selectedItem: CATALOG[slot.category]?.[0] || null
    })));
  };

  const resetSlots = () => {
    setSlots(DEFAULT_SLOTS);
  };

  return (
    <BuildContext.Provider
      value={{
        slots,
        CATALOG,
        filledSlots,
        filledCount,
        totalPrice,
        totalWattage,
        capacityPercent,
        bottleneckText,
        voucherApplied,
        setVoucherApplied,
        setSlotItem,
        removeSlotItem,
        quickFill,
        resetSlots,
        formatRupiah
      }}
    >
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild() {
  const context = useContext(BuildContext);
  if (!context) {
    throw new Error('useBuild must be used within a BuildProvider');
  }
  return context;
}
