/**
 * Modul 3: Pemrograman Asynchronous & API Call - Lab Informatika UMM
 * File: src/types/api.ts (Sesuai panduan halaman 20)
 * 
 * Interface generic untuk membungkus response standar dari fungsi API / Promise.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

