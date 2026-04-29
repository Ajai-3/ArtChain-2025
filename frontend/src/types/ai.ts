export interface AIGeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  createdAt: string;
}

export interface AIModelConfig {
  provider: string;
  availableModels: string[];
  defaultModel?: string;
  allowedResolutions?: string[];
  artcoinCostPerImage?: number;
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

export interface AIModelConfig {
  provider: string;
  availableModels: string[];
  defaultModel?: string;
  allowedResolutions?: string[];
  artcoinCostPerImage?: number;
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
