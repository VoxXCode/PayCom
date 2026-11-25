import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CreateSavedBuildInput, SavedBuild } from '../types/build';

export async function fetchSavedBuilds(): Promise<SavedBuild[]> {
  if (!isSupabaseConfigured) {
    throw new Error('Konfigurasi Supabase di file .env belum diisi.');
  }

  const { data, error } = await supabase
    .from('saved_builds')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as SavedBuild[]) ?? [];
}

export async function createSavedBuild(input: CreateSavedBuildInput): Promise<SavedBuild> {
  if (!isSupabaseConfigured) {
    throw new Error('Konfigurasi Supabase di file .env belum diisi.');
  }

  const { data, error } = await supabase
    .from('saved_builds')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SavedBuild;
}

export async function deleteSavedBuild(buildId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Konfigurasi Supabase di file .env belum diisi.');
  }

  const { error } = await supabase
    .from('saved_builds')
    .delete()
    .eq('id', buildId);

  if (error) {
    throw new Error(error.message);
  }
}
