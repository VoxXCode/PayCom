/**
 * Modul 3: Pemrograman Asynchronous & API Call - Lab Informatika UMM
 * File: src/utils/delay.ts (Sesuai panduan halaman 20)
 * 
 * Custom Async Function yang memanfaatkan Promise constructor & setTimeout
 * untuk menunda eksekusi kode (asynchronous delay).
 */

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

