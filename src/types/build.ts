import { BuildSlot } from '../context/BuildContext';

export interface SavedBuild {
  id: string;
  user_id: string;
  build_name: string;
  total_price: number;
  total_wattage: number;
  filled_count: number;
  slots_json: BuildSlot[];
  created_at: string;
}

export interface CreateSavedBuildInput {
  user_id: string;
  build_name: string;
  total_price: number;
  total_wattage: number;
  filled_count: number;
  slots_json: BuildSlot[];
}
