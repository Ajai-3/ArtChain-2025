export interface GenerateAIImageDTO {
  userId: string;
  prompt: string;
  negativePrompt?: string;
  resolution: string;
  seed?: number;
  provider?: string;
  model?: string;
  useArtcoins?: boolean;
}
