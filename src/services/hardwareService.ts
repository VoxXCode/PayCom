/**
 * Modul 3: Pemrograman Asynchronous & API Call - Lab Informatika UMM
 * File: src/services/hardwareService.ts
 * 
 * Mengimplementasikan seluruh kriteria penilaian Tugas Pekan Demo Modul 3:
 * 1. Mengambil data dari External API dan memasukkannya ke dalam Object menggunakan Interface. (10%)
 * 2. Menggunakan Custom & Pre-built Async Function. (10%)
 * 3. Menggunakan fungsi .then(), .resolve(), dan .reject(). (10%)
 */

import { ExternalProduct, ExternalProductResponse, RigBenchmarkReport, BenchmarkStageResult } from '../types/hardware';
import { delay } from '../utils/delay';

// Fallback data jika koneksi internet terputus atau API down saat sesi demo lab
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

// ============================================================================
// 1. KRITERIA 1 & 2: Mengambil data External API & Custom/Pre-built Async Func
// ============================================================================

/**
 * Custom Async Function yang memanggil pre-built async function `fetch()`
 * untuk mengambil data produk eksternal dan memasukkannya ke dalam Object
 * bertipe Interface `ExternalProductResponse` dan `ExternalProduct[]`.
 */
export async function fetchExternalProducts(category: string = 'laptops'): Promise<ExternalProduct[]> {
  const url = `https://dummyjson.com/products/category/${category}`;
  console.log(`[Modul 3 API Call] Fetching data dari: ${url}`);

  try {
    // Pre-built Async Function: fetch() & await
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // Memasukkan hasil parsing JSON ke dalam Object bertipe Interface ExternalProductResponse
    const data: ExternalProductResponse = await response.json();
    console.log(`[Modul 3 API Call] Berhasil memetakan ${data.products?.length || 0} item ke Interface ExternalProduct.`);
    return data.products && data.products.length > 0 ? data.products : FALLBACK_EXTERNAL_PRODUCTS;
  } catch (error: any) {
    console.warn('[Modul 3 API Call] Terjadi error/offline, menggunakan fallback data:', error.message);
    // Mengembalikan data fallback ber-interface agar aplikasi tetap interaktif saat demo lab
    return FALLBACK_EXTERNAL_PRODUCTS;
  }
}

// ============================================================================
// 2. KRITERIA 3: Menggunakan .resolve(), .reject(), dan .then()
// ============================================================================

/**
 * Menggunakan Promise constructor secara eksplisit dengan resolve() dan reject().
 * Sesuai materi Bab 1.3 (Halaman 9-12):
 * new Promise<T>((resolve, reject) => { ... })
 */
export function fetchHardwareWithPromise(category: string = 'laptops'): Promise<ExternalProduct[]> {
  return new Promise<ExternalProduct[]>((resolve, reject) => {
    console.log('[Modul 3 Promise] Memulai Promise eksekusi...');

    // Simulasi atau eksekusi HTTP request menggunakan .then() chain
    fetch(`https://dummyjson.com/products/category/${category}`)
      // Penggunaan fungsi .then() (Halaman 13-14)
      .then((response) => {
        if (!response.ok) {
          // Pemanggilan .reject() jika status HTTP bukan 200 OK
          reject(new Error(`Server mengembalikan status: ${response.status}`));
          return null;
        }
        return response.json();
      })
      .then((data: ExternalProductResponse | null) => {
        if (!data) return;
        if (data.products && data.products.length > 0) {
          // Pemanggilan .resolve() saat operasi berhasil
          console.log('[Modul 3 Promise] resolve() dipanggil dengan data produk.');
          resolve(data.products);
        } else {
          // Pemanggilan .reject() jika struktur data tidak valid
          console.log('[Modul 3 Promise] reject() dipanggil: Data produk kosong.');
          reject(new Error('Data produk dari server tidak ditemukan.'));
        }
      })
      .catch((err) => {
        console.warn('[Modul 3 Promise] Fetch catch, fallback dengan resolve() data lokal:', err.message);
        // Fallback agar tetap resolve jika offline di ruang kelas lab
        resolve(FALLBACK_EXTERNAL_PRODUCTS);
      });
  });
}

/**
 * Fungsi Validasi Daya PSU yang memanfaatkan .resolve() dan .reject() secara langsung.
 * Jika beban daya melebihi PSU -> reject() dipanggil.
 * Jika beban daya aman -> resolve() dipanggil.
 */
export function validatePowerSafetyWithPromise(totalWattage: number, psuCapacity: number = 750): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    console.log(`[Modul 3 Promise] Memvalidasi daya: ${totalWattage}W / ${psuCapacity}W`);

    if (totalWattage <= 0) {
      // Reject jika belum ada komponen dipilih
      reject(new Error('Peringatan: Belum ada komponen yang terpasang untuk diuji.'));
    } else if (totalWattage > psuCapacity) {
      // Reject jika beban melebihi kapasitas PSU
      reject(new Error(`OVERLOAD: Total beban ${totalWattage}W melampaui batas aman PSU (${psuCapacity}W). Risiko sistem mati mendadak!`));
    } else {
      // Resolve jika daya dalam batas aman
      const margin = psuCapacity - totalWattage;
      resolve(`AMAN: Beban daya ${totalWattage}W berada dalam kapasitas toleransi ${psuCapacity}W (Tersisa headroom ${margin}W).`);
    }
  });
}

// ============================================================================
// 3. PIPELINE SIMULASI BENCHMARK (Custom Async Function & Chained .then())
// ============================================================================

/**
 * Custom Async Function untuk menjalankan 1 tahap benchmark secara bertahap
 */
export async function runBenchmarkStage(
  stageName: string,
  durationMs: number,
  baseScore: number,
  isOverloaded: boolean
): Promise<BenchmarkStageResult> {
  // Memanfaatkan Custom Async Function delay() dari src/utils/delay.ts
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

/**
 * Menjalankan pipeline pengujian multi-tahap menggunakan .then() berantai (chaining).
 * Sesuai materi Bab 1.4 Halaman 13-14.
 */
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
      // Demonstrasi reject() saat tidak ada komponen
      reject(new Error('Silakan pilih minimal 1 komponen di tab Komponen sebelum menjalankan simulasi.'));
      return;
    }

    onProgress?.(1, 'Tahap 1: Validasi Kebutuhan Daya (PSU)...');

    // Tahap 1: Validasi Daya dengan .then()
    validatePowerSafetyWithPromise(totalWattage, psuCapacity)
      .then((powerSafetyMessage) => {
        onProgress?.(2, 'Tahap 2: Simulasi Beban Komputasi CPU (Multi-core)...');
        return runBenchmarkStage('CPU Multi-Core Stress Test', 1000, 11500, isOverload)
          .then((cpuResult) => ({ powerSafetyMessage, cpuResult }));
      })
      // Tahap 2: GPU 3D Graphics Test
      .then(({ powerSafetyMessage, cpuResult }) => {
        stages.push(cpuResult);
        onProgress?.(3, 'Tahap 3: Simulasi Render Grafis GPU & Ray Tracing...');
        return runBenchmarkStage('GPU Ray Tracing 4K Benchmark', 1200, 14200, isOverload)
          .then((gpuResult) => ({ powerSafetyMessage, gpuResult }));
      })
      // Tahap 3: Memory & Thermal Stability Test
      .then(({ powerSafetyMessage, gpuResult }) => {
        stages.push(gpuResult);
        onProgress?.(4, 'Tahap 4: Pengujian Stabilitas RAM & Suhu VRM...');
        return runBenchmarkStage('Memory Bandwidth & VRM Stability', 900, 9800, isOverload)
          .then((ramResult) => ({ powerSafetyMessage, ramResult }));
      })
      // Tahap Akhir: Menghitung Skor Keseluruhan & Menghasilkan Laporan
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

        // Memanggil resolve() di ujung rantai .then()
        resolve(report);
      })
      // Menangkap error jika reject() dipanggil di tengah rantai
      .catch((err) => {
        reject(err);
      });
  });
}

