/**
 * Modul 3: Pemrograman Asynchronous & API Call - Lab Informatika UMM
 * File: src/services/api.ts (Sesuai panduan bab 2 & bab 3)
 * 
 * Konfigurasi HTTP Client dasar untuk API Calls.
 */

import { ApiResponse } from '../types/api';

export const API_BASE_URL = 'https://dummyjson.com';

/**
 * Pre-built Async Function untuk melakukan HTTP GET request dengan generic type
 */
export async function getRequest<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: status ${response.status}`);
    }

    const data: T = await response.json();
    return {
      success: true,
      data,
      message: 'Berhasil mengambil data dari API',
    };
  } catch (error: any) {
    return {
      success: false,
      data: null as unknown as T,
      message: error?.message || 'Gagal terhubung ke External API',
    };
  }
}

