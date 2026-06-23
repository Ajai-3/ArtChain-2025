export interface AIGeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  createdAt: string;
}

export interface AIModelConfig {
  provider: string;
  displayName?: string;
  enabled: boolean;
  isFree: boolean;
  dailyFreeLimit: number;
  artcoinCostPerImage: number;
  availableModels: string[];
  defaultModel?: string;
  priority?: number;
  allowedResolutions?: string[];
  apiKey?: string;
}

export interface AIGenerationResponse {
  id: string;
  prompt: string;
  negativePrompt?: string;
  aiModel: string;
  images: string[];
  createdAt: string;
}

export interface AIGenerationsResponse {
  generations: AIGenerationResponse[];
}

export interface AIQuotaResponse {
  remaining: number;
  limit: number;
  used: number;
}
