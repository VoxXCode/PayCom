export interface ExternalProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  weight?: number;
  thumbnail: string;
  images?: string[];
}

export interface ExternalProductResponse {
  products: ExternalProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface BenchmarkStageResult {
  stageName: string;
  score: number;
  status: 'passed' | 'warning' | 'failed';
  details: string;
  timestamp: string;
}

export interface RigBenchmarkReport {
  overallScore: number;
  tier: 'Entry Level' | 'Mid-Range Gaming' | 'High-End Workstation' | 'Enthusiast Beast';
  stages: BenchmarkStageResult[];
  powerSafety: string;
  passed: boolean;
}

