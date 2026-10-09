/**
 * PayCom Rig Configurator - Component Data Store
 * All PC component data, compatibility rules, and pricing logic
 */

export type ComponentStatus = 'compatible' | 'conflict' | 'incompatible' | 'empty';

export interface PCComponent {
  id: string;
  slot: number;
  slotLabel: string;
  slotCode: string;
  icon: string;
  category: string;
  name: string;
  price: number;
  status: ComponentStatus;
  socket?: string;
  tdp?: number;
  specs: string;
  tags: string[];
  conflictMessage?: string;
  image?: string;
}

export interface BuildPreset {
  id: string;
  name: string;
  label: string;
  active: boolean;
}

export const PRESETS: BuildPreset[] = [
  { id: 'gaming-4k', name: 'Gaming 4K Ultra', label: 'ACTIVE', active: true },
  { id: 'ai-deep', name: 'AI Deep Learning', label: 'RTX 4090', active: false },
  { id: 'streaming', name: 'Streaming Pro', label: 'DUAL NVENC', active: false },
];

export const COMPONENTS: PCComponent[] = [
  {
    id: 'cpu-empty',
    slot: 1,
    slotLabel: 'SLOT 01 // CPU',
    slotCode: 'Processor',
    icon: 'memory',
    category: 'Processor',
    name: 'Belum Dipilih',
    price: 0,
    status: 'empty',
    specs: 'Pilih Processor (Intel / AMD) untuk rakitan ini',
    tags: [],
  },
  {
    id: 'mobo-empty',
    slot: 2,
    slotLabel: 'SLOT 02 // MOBO',
    slotCode: 'Motherboard',
    icon: 'developer_board',
    category: 'Motherboard',
    name: 'Belum Dipilih',
    price: 0,
    status: 'empty',
    specs: 'Pilih Motherboard yang sesuai dengan soket Processor',
    tags: [],
  },
  {
    id: 'gpu-empty',
    slot: 3,
    slotLabel: 'SLOT 03 // GPU',
    slotCode: 'Kartu Grafis',
    icon: 'view_in_ar',
    category: 'Kartu Grafis',
    name: 'Belum Dipilih',
    price: 0,
    status: 'empty',
    specs: 'Pilih Kartu Grafis (NVIDIA / AMD) untuk performa visual',
    tags: [],
  },
  {
    id: 'ram-empty',
    slot: 4,
    slotLabel: 'SLOT 04 // MEMORY',
    slotCode: 'RAM',
    icon: 'reorder',
    category: 'RAM',
    name: 'Belum Dipilih',
    price: 0,
    status: 'empty',
    specs: 'Pilih RAM (DDR4 / DDR5) untuk multitasking',
    tags: [],
  },
  {
    id: 'ssd-empty',
    slot: 5,
    slotLabel: 'SLOT 05 // NVME SSD',
    slotCode: 'Storage',
    icon: 'storage',
    category: 'Storage',
    name: 'Belum Dipilih',
    price: 0,
    status: 'empty',
    specs: 'Pilih penyimpanan utama NVMe SSD yang cepat',
    tags: [],
  },
  {
    id: 'psu-empty',
    slot: 6,
    slotLabel: 'SLOT 06 // PSU',
    slotCode: 'Power Supply',
    icon: 'power',
    category: 'Power Supply',
    name: 'Belum Dipilih',
    price: 0,
    status: 'empty',
    specs: 'Pilih Power Supply dengan kapasitas Watt yang cukup',
    tags: [],
  },
  {
    id: 'cooler-empty',
    slot: 7,
    slotLabel: 'SLOT 07 // AIO COOLER',
    slotCode: 'CPU Cooler',
    icon: 'mode_fan',
    category: 'CPU Cooler',
    name: 'Belum Dipilih',
    price: 0,
    status: 'empty',
    specs: 'Pilih Pendingin CPU (Air Cooler / AIO Liquid)',
    tags: [],
  },
  {
    id: 'case-empty',
    slot: 8,
    slotLabel: 'SLOT 08 // CHASIS CASE',
    slotCode: 'Chassis Case',
    icon: 'desktop_windows',
    category: 'Chassis Case',
    name: 'Belum Dipilih',
    price: 0,
    status: 'empty',
    specs: 'Pilih Casing yang kompatibel dengan komponen Anda',
    tags: [],
  },
];

// Alternative components for swapping
export const ALTERNATIVE_MOTHERBOARDS_AM5: PCComponent[] = [
  {
    id: 'mobo-am5-1',
    slot: 2,
    slotLabel: 'SLOT 02 // MOBO',
    slotCode: 'Motherboard',
    icon: 'developer_board',
    category: 'Motherboard',
    name: 'ASUS ROG Crosshair X670E Hero WiFi',
    price: 8950000,
    status: 'compatible',
    socket: 'AM5',
    specs: 'AMD X670E Chipset • DDR5 • PCIe 5.0 • WiFi 6E • USB4',
    tags: ['AM5', 'DDR5', 'ATX'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9jLRri7TKAs7wZPAmGHrbk1w221RpAVbnBsENVBvnTgJV4kW-I0q__NC5_xHc_h669V6FAGYFCIVvUVtk0vLCC9XgVRrbywplMTS9IBg52Xy2LYxGHd6ECHU2oXt4eUn_mdlzLurmCc0lrNemFiSw-pc0a9QQpjiLTUVqUq4lPqtjSt7xETxMyoY72B6NAE5E6nxp_d7RCy0b8Hg0xY8kULoPr0uduKhVwPtks3x4GfDY9J7-6n4gQw',
  },
  {
    id: 'mobo-am5-2',
    slot: 2,
    slotLabel: 'SLOT 02 // MOBO',
    slotCode: 'Motherboard',
    icon: 'developer_board',
    category: 'Motherboard',
    name: 'MSI MEG X670E ACE WiFi',
    price: 7850000,
    status: 'compatible',
    socket: 'AM5',
    specs: 'AMD X670E Chipset • DDR5 6600+ • PCIe 5.0 x16 • WiFi 6E',
    tags: ['AM5', 'DDR5', 'E-ATX'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9jLRri7TKAs7wZPAmGHrbk1w221RpAVbnBsENVBvnTgJV4kW-I0q__NC5_xHc_h669V6FAGYFCIVvUVtk0vLCC9XgVRrbywplMTS9IBg52Xy2LYxGHd6ECHU2oXt4eUn_mdlzLurmCc0lrNemFiSw-pc0a9QQpjiLTUVqUq4lPqtjSt7xETxMyoY72B6NAE5E6nxp_d7RCy0b8Hg0xY8kULoPr0uduKhVwPtks3x4GfDY9J7-6n4gQw',
  },
  {
    id: 'mobo-am5-3',
    slot: 2,
    slotLabel: 'SLOT 02 // MOBO',
    slotCode: 'Motherboard',
    icon: 'developer_board',
    category: 'Motherboard',
    name: 'Gigabyte X670E AORUS Master',
    price: 6750000,
    status: 'compatible',
    socket: 'AM5',
    specs: 'AMD X670E Chipset • DDR5 6666+ • PCIe 5.0 • 16+2+2 VRM',
    tags: ['AM5', 'DDR5', 'ATX'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9jLRri7TKAs7wZPAmGHrbk1w221RpAVbnBsENVBvnTgJV4kW-I0q__NC5_xHc_h669V6FAGYFCIVvUVtk0vLCC9XgVRrbywplMTS9IBg52Xy2LYxGHd6ECHU2oXt4eUn_mdlzLurmCc0lrNemFiSw-pc0a9QQpjiLTUVqUq4lPqtjSt7xETxMyoY72B6NAE5E6nxp_d7RCy0b8Hg0xY8kULoPr0uduKhVwPtks3x4GfDY9J7-6n4gQw',
  },
];

export const ALTERNATIVE_PROCESSORS: PCComponent[] = [
  {
    id: 'cpu-alt-1',
    slot: 1,
    slotLabel: 'SLOT 01 // CPU',
    slotCode: 'Processor',
    icon: 'memory',
    category: 'Processor',
    name: 'AMD Ryzen 7 7800X3D 8-Core 5.0GHz',
    price: 6250000,
    status: 'compatible',
    socket: 'AM5',
    tdp: 120,
    specs: '8 Cores / 16 Threads • 3D V-Cache • PCIe 5.0',
    tags: ['AM5', '120W TDP', 'Best Gaming'],
  },
  {
    id: 'cpu-alt-2',
    slot: 1,
    slotLabel: 'SLOT 01 // CPU',
    slotCode: 'Processor',
    icon: 'memory',
    category: 'Processor',
    name: 'Intel Core i9-14900K 24-Core',
    price: 9850000,
    status: 'compatible',
    socket: 'LGA1700',
    tdp: 253,
    specs: '24 Cores / 32 Threads • Boost Up to 6.0GHz',
    tags: ['LGA1700', '253W TDP', 'Extreme Performance'],
  },
  {
    id: 'cpu-alt-3',
    slot: 1,
    slotLabel: 'SLOT 01 // CPU',
    slotCode: 'Processor',
    icon: 'memory',
    category: 'Processor',
    name: 'Intel Core i5-13600K 14-Core',
    price: 5450000,
    status: 'compatible',
    socket: 'LGA1700',
    tdp: 181,
    specs: '14 Cores / 20 Threads • Boost Up to 5.1GHz',
    tags: ['LGA1700', '181W TDP', 'Value Pick'],
  },
  {
    id: 'cpu-alt-4',
    slot: 1,
    slotLabel: 'SLOT 01 // CPU',
    slotCode: 'Processor',
    icon: 'memory',
    category: 'Processor',
    name: 'AMD Ryzen 5 7600X 6-Core 5.3GHz',
    price: 4150000,
    status: 'compatible',
    socket: 'AM5',
    tdp: 105,
    specs: '6 Cores / 12 Threads • Boost Up to 5.3GHz',
    tags: ['AM5', '105W TDP', 'Budget Entry'],
  },
];

export const ALTERNATIVE_GPUS: PCComponent[] = [
  {
    id: 'gpu-alt-1',
    slot: 3,
    slotLabel: 'SLOT 03 // GPU',
    slotCode: 'Kartu Grafis',
    icon: 'view_in_ar',
    category: 'Kartu Grafis',
    name: 'AMD Radeon RX 7900 XTX 24GB',
    price: 17500000,
    status: 'compatible',
    tdp: 355,
    specs: 'RDNA 3 Arch • 24GB GDDR6',
    tags: ['355W TDP', '24GB VRAM'],
  },
  {
    id: 'gpu-alt-2',
    slot: 3,
    slotLabel: 'SLOT 03 // GPU',
    slotCode: 'Kartu Grafis',
    icon: 'view_in_ar',
    category: 'Kartu Grafis',
    name: 'NVIDIA GeForce RTX 4070 Ti Super 16GB',
    price: 14200000,
    status: 'compatible',
    tdp: 285,
    specs: 'Ada Lovelace • DLSS 3.5 • 16GB GDDR6X',
    tags: ['285W TDP', '1440p King'],
  },
  {
    id: 'gpu-alt-3',
    slot: 3,
    slotLabel: 'SLOT 03 // GPU',
    slotCode: 'Kartu Grafis',
    icon: 'view_in_ar',
    category: 'Kartu Grafis',
    name: 'NVIDIA GeForce RTX 4060 Ti 8GB',
    price: 7200000,
    status: 'compatible',
    tdp: 160,
    specs: 'Ada Lovelace • DLSS 3 • 8GB GDDR6',
    tags: ['160W TDP', '1080p Max'],
  },
  {
    id: 'gpu-alt-4',
    slot: 3,
    slotLabel: 'SLOT 03 // GPU',
    slotCode: 'Kartu Grafis',
    icon: 'view_in_ar',
    category: 'Kartu Grafis',
    name: 'AMD Radeon RX 7800 XT 16GB',
    price: 9100000,
    status: 'compatible',
    tdp: 263,
    specs: 'RDNA 3 Arch • 16GB GDDR6',
    tags: ['263W TDP', '16GB VRAM'],
  },
];

export const ALTERNATIVE_RAMS: PCComponent[] = [
  {
    id: 'ram-alt-1',
    slot: 4,
    slotLabel: 'SLOT 04 // MEMORY',
    slotCode: 'RAM',
    icon: 'reorder',
    category: 'RAM',
    name: 'G.Skill Trident Z5 Neo RGB 64GB (2x32GB)',
    price: 4500000,
    status: 'compatible',
    specs: 'AMD EXPO • CL30',
    tags: ['DDR5 6000MHz', '64GB'],
  },
  {
    id: 'ram-alt-2',
    slot: 4,
    slotLabel: 'SLOT 04 // MEMORY',
    slotCode: 'RAM',
    icon: 'reorder',
    category: 'RAM',
    name: 'Corsair Vengeance RGB 32GB (2x16GB)',
    price: 2150000,
    status: 'compatible',
    specs: 'Intel XMP 3.0 • CL36',
    tags: ['DDR5 5600MHz', '32GB'],
  },
  {
    id: 'ram-alt-3',
    slot: 4,
    slotLabel: 'SLOT 04 // MEMORY',
    slotCode: 'RAM',
    icon: 'reorder',
    category: 'RAM',
    name: 'TeamGroup T-Force Delta RGB 16GB (2x8GB)',
    price: 1250000,
    status: 'compatible',
    specs: 'Intel XMP 2.0 • CL16',
    tags: ['DDR4 3200MHz', '16GB', 'Budget'],
  },
];

export const ALTERNATIVE_STORAGES: PCComponent[] = [
  {
    id: 'ssd-alt-1',
    slot: 5,
    slotLabel: 'SLOT 05 // NVME SSD',
    slotCode: 'Storage',
    icon: 'storage',
    category: 'Storage',
    name: 'WD Black SN850X 4TB NVMe',
    price: 5200000,
    status: 'compatible',
    specs: 'Sequential Read 7300 MB/s',
    tags: ['PCIe 4.0 x4', '4TB'],
  },
  {
    id: 'ssd-alt-2',
    slot: 5,
    slotLabel: 'SLOT 05 // NVME SSD',
    slotCode: 'Storage',
    icon: 'storage',
    category: 'Storage',
    name: 'Crucial P3 Plus 1TB NVMe',
    price: 1100000,
    status: 'compatible',
    specs: 'Sequential Read 5000 MB/s',
    tags: ['PCIe 4.0 x4', '1TB'],
  },
  {
    id: 'ssd-alt-3',
    slot: 5,
    slotLabel: 'SLOT 05 // NVME SSD',
    slotCode: 'Storage',
    icon: 'storage',
    category: 'Storage',
    name: 'Kingston NV2 500GB NVMe',
    price: 650000,
    status: 'compatible',
    specs: 'Sequential Read 3500 MB/s',
    tags: ['PCIe 4.0 x4', '500GB'],
  },
];

export const ALTERNATIVE_PSUS: PCComponent[] = [
  {
    id: 'psu-alt-1',
    slot: 6,
    slotLabel: 'SLOT 06 // PSU',
    slotCode: 'Power Supply',
    icon: 'power',
    category: 'Power Supply',
    name: 'Corsair RM1000x Shift 1000W',
    price: 3200000,
    status: 'compatible',
    specs: 'Fully Modular • Side Interface',
    tags: ['1000W', '80+ Gold'],
  },
  {
    id: 'psu-alt-2',
    slot: 6,
    slotLabel: 'SLOT 06 // PSU',
    slotCode: 'Power Supply',
    icon: 'power',
    category: 'Power Supply',
    name: 'FSP Hydro G Pro 850W ATX 3.0',
    price: 2100000,
    status: 'compatible',
    specs: 'Fully Modular • ATX 3.0 PCIe 5.0',
    tags: ['850W', '80+ Gold'],
  },
  {
    id: 'psu-alt-3',
    slot: 6,
    slotLabel: 'SLOT 06 // PSU',
    slotCode: 'Power Supply',
    icon: 'power',
    category: 'Power Supply',
    name: 'Deepcool PK650D 650W',
    price: 850000,
    status: 'compatible',
    specs: 'Non-Modular • Flat Cables',
    tags: ['650W', '80+ Bronze', 'Budget'],
  },
];

export const ALTERNATIVE_COOLERS: PCComponent[] = [
  {
    id: 'cooler-alt-1',
    slot: 7,
    slotLabel: 'SLOT 07 // AIO COOLER',
    slotCode: 'CPU Cooler',
    icon: 'mode_fan',
    category: 'CPU Cooler',
    name: 'Lian Li Galahad II Trinity Performance 360',
    price: 2850000,
    status: 'compatible',
    specs: 'Asetek 8th Gen • 3000 RPM Fans',
    tags: ['360mm Rad', 'High Perf'],
  },
  {
    id: 'cooler-alt-2',
    slot: 7,
    slotLabel: 'SLOT 07 // AIO COOLER',
    slotCode: 'CPU Cooler',
    icon: 'mode_fan',
    category: 'CPU Cooler',
    name: 'Deepcool AK620 Zero Dark',
    price: 1100000,
    status: 'compatible',
    specs: 'Dual Tower Air Cooler • 260W TDP',
    tags: ['Air Cooler', 'Dual Fan'],
  },
  {
    id: 'cooler-alt-3',
    slot: 7,
    slotLabel: 'SLOT 07 // AIO COOLER',
    slotCode: 'CPU Cooler',
    icon: 'mode_fan',
    category: 'CPU Cooler',
    name: 'Thermalright Peerless Assassin 120 SE',
    price: 650000,
    status: 'compatible',
    specs: 'Dual Tower Air Cooler • Budget King',
    tags: ['Air Cooler', 'Best Value'],
  },
];

export const CASE_OPTIONS: PCComponent[] = [
  {
    id: 'case-1',
    slot: 8,
    slotLabel: 'SLOT 08 // CHASIS CASE',
    slotCode: 'Chassis Case',
    icon: 'desktop_windows',
    category: 'Chassis Case',
    name: 'Lian Li O11 Dynamic EVO XL',
    price: 3250000,
    status: 'compatible',
    specs: 'Full Tower • GPU Clearance 460mm • Radiator 360mm Top/Side/Bottom',
    tags: ['Full Tower', 'E-ATX'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClK-Isxdv_pCvwYjsYkZUDqT-T9k1Vr_seVgqRxazxdv1TfRbvyUdyZgzQV3E4HLebvPq5-zVUOX9AQ8ZQB6cai0trk_7E0RD6JGOB8f7R7FJyLV2tVCQDUEroOR0ZIRJ2LPyHxoSfyvxdg0dq9GVZv5A3EMaM5kXt5qob8xiHBCvqz5fQV7vMkf7i13JuoJXTqUJ7BoqXYc5rkIP6uLCgtIZgG_hNerCm4cTWERc-CSJiL64lRds_tw',
  },
  {
    id: 'case-2',
    slot: 8,
    slotLabel: 'SLOT 08 // CHASIS CASE',
    slotCode: 'Chassis Case',
    icon: 'desktop_windows',
    category: 'Chassis Case',
    name: 'NZXT H9 Elite Black',
    price: 2850000,
    status: 'compatible',
    specs: 'Mid Tower • GPU Clearance 435mm • Radiator 360mm Top & Side',
    tags: ['Mid Tower', 'ATX'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClK-Isxdv_pCvwYjsYkZUDqT-T9k1Vr_seVgqRxazxdv1TfRbvyUdyZgzQV3E4HLebvPq5-zVUOX9AQ8ZQB6cai0trk_7E0RD6JGOB8f7R7FJyLV2tVCQDUEroOR0ZIRJ2LPyHxoSfyvxdg0dq9GVZv5A3EMaM5kXt5qob8xiHBCvqz5fQV7vMkf7i13JuoJXTqUJ7BoqXYc5rkIP6uLCgtIZgG_hNerCm4cTWERc-CSJiL64lRds_tw',
  },
  {
    id: 'case-3',
    slot: 8,
    slotLabel: 'SLOT 08 // CHASIS CASE',
    slotCode: 'Chassis Case',
    icon: 'desktop_windows',
    category: 'Chassis Case',
    name: 'Corsair 5000D Airflow Black',
    price: 2350000,
    status: 'compatible',
    specs: 'Mid Tower • GPU Clearance 420mm • Radiator 360mm Front & Top',
    tags: ['Mid Tower', 'ATX'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClK-Isxdv_pCvwYjsYkZUDqT-T9k1Vr_seVgqRxazxdv1TfRbvyUdyZgzQV3E4HLebvPq5-zVUOX9AQ8ZQB6cai0trk_7E0RD6JGOB8f7R7FJyLV2tVCQDUEroOR0ZIRJ2LPyHxoSfyvxdg0dq9GVZv5A3EMaM5kXt5qob8xiHBCvqz5fQV7vMkf7i13JuoJXTqUJ7BoqXYc5rkIP6uLCgtIZgG_hNerCm4cTWERc-CSJiL64lRds_tw',
  },
];

export interface SavedBuildItem {
  id: string;
  name: string;
  date: string;
  components: number;
  price: number;
  status: string;
  statusColor: string;
  icon: string;
}

export const INITIAL_SAVED_BUILDS: SavedBuildItem[] = [
  {
    id: '1',
    name: 'Gaming 4K Ultra Build',
    date: '2 Oktober 2025',
    components: 8,
    price: 48560000,
    status: 'Lengkap',
    statusColor: '#00f0ff', // primaryContainer
    icon: '🎮',
  },
  {
    id: '2',
    name: 'AI Deep Learning Rig',
    date: '28 September 2025',
    components: 7,
    price: 65200000,
    status: 'Draft',
    statusColor: '#aec6ff', // secondary
    icon: '🧠',
  },
];

export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function calculateTotals(components: PCComponent[]) {
  const componentTotal = components.reduce((sum, c) => sum + c.price, 0);
  const assemblyFee = 250000;
  const stressTestWin = 0;
  const shippingProtection = 150000;
  const promoDiscount = -1500000;
  const grandTotal = componentTotal + assemblyFee + stressTestWin + shippingProtection + promoDiscount;
  const installment = Math.round(grandTotal / 12);
  const itemCount = components.filter(c => c.status !== 'empty').length;
  const hasConflict = components.some(c => c.status === 'conflict' || c.status === 'incompatible');

  return {
    componentTotal,
    assemblyFee,
    stressTestWin,
    shippingProtection,
    promoDiscount,
    grandTotal,
    installment,
    itemCount,
    hasConflict,
  };
}
