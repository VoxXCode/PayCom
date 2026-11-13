import { ExternalProduct, ExternalProductResponse, RigBenchmarkReport, BenchmarkStageResult } from '../types/hardware';
import { delay } from '../utils/delay';

const FALLBACK_EXTERNAL_PRODUCTS: ExternalProduct[] = [
  {
    id: 101,
    title: 'Apple MacBook Pro 14 M3 Max',
    description: '14-Core CPU, 30-Core GPU, 36GB Unified Memory, 1TB SSD Storage.',
    category: 'laptops',
    price: 1999,
    discountPercentage: 10.5,
    rating: 4.88,
    stock: 24,
    brand: 'Apple',
    thumbnail: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png'
  },
  {
    id: 102,
    title: 'ASUS ROG Zephyrus G16 OLED',
    description: 'Intel Core Ultra 9, NVIDIA RTX 4080 12GB, 32GB DDR5 RAM, 2TB PCIe 4.0 SSD.',
    category: 'laptops',
    price: 2499,
    discountPercentage: 12.0,
    rating: 4.79,
    stock: 18,
    brand: 'ASUS',
    thumbnail: 'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/thumbnail.png'
  },
  {
    id: 103,
    title: 'Lenovo Legion 7i Pro Gen 9',
    description: 'Intel i9-14900HX, RTX 4090 16GB, 32GB 5600MHz RAM, 240Hz PureSight Gaming Display.',
    category: 'laptops',
    price: 2799,
    discountPercentage: 8.5,
    rating: 4.92,
    stock: 12,
    brand: 'Lenovo',
    thumbnail: 'https://cdn.dummyjson.com/products/images/laptops/Lenovo%20Yoga%20920/thumbnail.png'
  },
  {
    id: 104,
    title: 'Dell Alienware m18 R2 Beast',
    description: 'Desktop-grade cooling with Cryo-tech, 64GB DDR5, Dual NVMe RAID 0, RTX 4090.',
    category: 'laptops',
    price: 3299,
    discountPercentage: 15.0,
    rating: 4.65,
    stock: 7,
    brand: 'Dell',
    thumbnail: 'https://cdn.dummyjson.com/products/images/laptops/Dell%20XPS%2013%209370/thumbnail.png'
  }
];

export async function fetchExternalProducts(category: string = 'laptops'): Promise<ExternalProduct[]> {
  const url = `https://dummyjson.com/products/category/${category}`;
  console.log(`[Modul 3 API Call] Fetching data dari: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data: ExternalProductResponse = await response.json();
    console.log(`[Modul 3 API Call] Berhasil memetakan ${data.products?.length || 0} item ke Interface ExternalProduct.`);
    return data.products && data.products.length > 0 ? data.products : FALLBACK_EXTERNAL_PRODUCTS;
  } catch (error: any) {
    console.warn('[Modul 3 API Call] Terjadi error/offline, menggunakan fallback data:', error.message);
    return FALLBACK_EXTERNAL_PRODUCTS;
  }
}

export function fetchHardwareWithPromise(category: string = 'laptops'): Promise<ExternalProduct[]> {
  return new Promise<ExternalProduct[]>((resolve, reject) => {
    console.log('[Modul 3 Promise] Memulai Promise eksekusi...');

    fetch(`https://dummyjson.com/products/category/${category}`)
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`Server mengembalikan status: ${response.status}`));
          return null;
        }
        return response.json();
      })
      .then((data: ExternalProductResponse | null) => {
        if (!data) return;
        if (data.products && data.products.length > 0) {
          console.log('[Modul 3 Promise] resolve() dipanggil dengan data produk.');
          resolve(data.products);
        } else {
          console.log('[Modul 3 Promise] reject() dipanggil: Data produk kosong.');
          reject(new Error('Data produk dari server tidak ditemukan.'));
        }
      })
      .catch((err) => {
        console.warn('[Modul 3 Promise] Fetch catch, fallback dengan resolve() data lokal:', err.message);
        resolve(FALLBACK_EXTERNAL_PRODUCTS);
      });
  });
}

export function validatePowerSafetyWithPromise(totalWattage: number, psuCapacity: number = 750): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    console.log(`[Modul 3 Promise] Memvalidasi daya: ${totalWattage}W / ${psuCapacity}W`);

    if (totalWattage <= 0) {
      reject(new Error('Peringatan: Belum ada komponen yang terpasang untuk diuji.'));
    } else if (totalWattage > psuCapacity) {
      reject(new Error(`OVERLOAD: Total beban ${totalWattage}W melampaui batas aman PSU (${psuCapacity}W). Risiko sistem mati mendadak!`));
    } else {
      const margin = psuCapacity - totalWattage;
      resolve(`AMAN: Beban daya ${totalWattage}W berada dalam kapasitas toleransi ${psuCapacity}W (Tersisa headroom ${margin}W).`);
    }
  });
}

export async function runBenchmarkStage(
  stageName: string,
  durationMs: number,
  baseScore: number,
  isOverloaded: boolean
): Promise<BenchmarkStageResult> {
  await delay(durationMs);

  const finalScore = isOverloaded ? Math.round(baseScore * 0.45) : Math.round(baseScore * (0.95 + Math.random() * 0.1));
  const status: 'passed' | 'warning' | 'failed' = isOverloaded ? 'failed' : finalScore > 8000 ? 'passed' : 'warning';

  return {
    stageName,
    score: finalScore,
    status,
    details: isOverloaded
      ? 'Thermal throttling terdeteksi akibat pasokan daya tidak stabil.'
      : 'Suhu operasional stabil 64°C, clock speed bertahan pada boost frekuensi.',
    timestamp: new Date().toLocaleTimeString('id-ID'),
  };
}

export function runFullBenchmarkChained(
  totalWattage: number,
  filledCount: number,
  psuCapacity: number = 750,
  onProgress?: (stageNumber: number, stageName: string) => void
): Promise<RigBenchmarkReport> {
  const stages: BenchmarkStageResult[] = [];
  const isOverload = totalWattage > psuCapacity;

  return new Promise<RigBenchmarkReport>((resolve, reject) => {
    if (filledCount === 0) {
      reject(new Error('Silakan pilih minimal 1 komponen di tab Komponen sebelum menjalankan simulasi.'));
      return;
    }

    onProgress?.(1, 'Tahap 1: Validasi Kebutuhan Daya (PSU)...');

    validatePowerSafetyWithPromise(totalWattage, psuCapacity)
      .then((powerSafetyMessage) => {
        onProgress?.(2, 'Tahap 2: Simulasi Beban Komputasi CPU (Multi-core)...');
        return runBenchmarkStage('CPU Multi-Core Stress Test', 1000, 11500, isOverload)
          .then((cpuResult) => ({ powerSafetyMessage, cpuResult }));
      })
      .then(({ powerSafetyMessage, cpuResult }) => {
        stages.push(cpuResult);
        onProgress?.(3, 'Tahap 3: Simulasi Render Grafis GPU & Ray Tracing...');
        return runBenchmarkStage('GPU Ray Tracing 4K Benchmark', 1200, 14200, isOverload)
          .then((gpuResult) => ({ powerSafetyMessage, gpuResult }));
      })
      .then(({ powerSafetyMessage, gpuResult }) => {
        stages.push(gpuResult);
        onProgress?.(4, 'Tahap 4: Pengujian Stabilitas RAM & Suhu VRM...');
        return runBenchmarkStage('Memory Bandwidth & VRM Stability', 900, 9800, isOverload)
          .then((ramResult) => ({ powerSafetyMessage, ramResult }));
      })
      .then(({ powerSafetyMessage, ramResult }) => {
        stages.push(ramResult);
        const overallScore = Math.round(
          stages.reduce((acc, curr) => acc + curr.score, 0) / stages.length
        );

        let tier: RigBenchmarkReport['tier'] = 'Entry Level';
        if (overallScore >= 12000) tier = 'Enthusiast Beast';
        else if (overallScore >= 9000) tier = 'High-End Workstation';
        else if (overallScore >= 6000) tier = 'Mid-Range Gaming';

        const report: RigBenchmarkReport = {
          overallScore,
          tier,
          stages,
          powerSafety: powerSafetyMessage,
          passed: !isOverload && overallScore > 5000,
        };

        resolve(report);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

