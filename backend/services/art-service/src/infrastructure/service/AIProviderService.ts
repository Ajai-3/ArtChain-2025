import { injectable } from 'inversify';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import { SERVICE_MESSAGES } from '../../constants/ServiceMessages';

interface AIGenerationParams {
  prompt: string;
  negativePrompt?: string;
  resolution: string;
  seed?: number;
  model?: string;
}

interface AIGenerationResult {
  images: string[];
  generationTime?: number;
}

interface IAIProvider {
  generateImage(params: AIGenerationParams): Promise<AIGenerationResult>;
  testConnection(): Promise<boolean>;
}

@injectable()
class PollinationsProvider implements IAIProvider {
  constructor(private apiKey?: string) {}

  async generateImage(params: AIGenerationParams): Promise<AIGenerationResult> {
    const { prompt, seed, model, resolution } = params;
    const images: string[] = [];

    const modelName = model || 'flux';
    const seedValue = seed || Math.floor(Math.random() * 1000000);
    const [width, height] = resolution.split('x').map(Number);
    const encodedPrompt = encodeURIComponent(prompt);

    const validModels = ['flux', 'zimage', 'gptimage', 'klein', 'qwen-image', 'grok-imagine'];
    const modelToUse = validModels.includes(modelName) ? modelName : 'flux';

    let url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${modelToUse}&width=${width}&height=${height}&seed=${seedValue}&nologo=true`;
    
    if (this.apiKey) {
      url += `&key=${this.apiKey}`;
    }

    try {
      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        headers
      });

      const contentType = response.headers['content-type'] || 'image/png';
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const dataUri = `data:${contentType};base64,${base64Image}`;

      images.push(dataUri);
    } catch (error) {
      images.push(url);
    }

    return {
      images,
      generationTime: 0,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      await axios.get('https://image.pollinations.ai/prompt/test?width=64&height=64');
      return true;
    } catch (error) {
      return false;
    }
  }
}

class PuterProvider implements IAIProvider {
  constructor(private apiKey?: string) {}

  async generateImage(params: AIGenerationParams): Promise<AIGenerationResult> {
    throw new Error(SERVICE_MESSAGES.AI_PUTER_NOT_IMPLEMENTED);
  }

  async testConnection(): Promise<boolean> {
    return false;
  }
}

class GeminiProvider implements IAIProvider {
  private client: GoogleGenAI | null = null;

  constructor(private apiKey?: string) {
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    }
  }

  async generateImage(params: AIGenerationParams): Promise<AIGenerationResult> {
    if (!this.client) {
      throw new Error(SERVICE_MESSAGES.AI_GEMINI_NOT_CONFIGURED);
    }

    const { prompt, model } = params;
    const modelToUse = model || 'gemini-1.5-flash';
    const images: string[] = [];

    try {
      const result = await this.client.models.generateContent({
        model: modelToUse,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      type GeminiPart = { inlineData?: { data: string; mimeType?: string } };
      type GeminiCandidate = { content?: { parts?: GeminiPart[] } };
      type GeminiResponse = { response?: { candidates?: GeminiCandidate[] }; candidates?: GeminiCandidate[] };

      const response = (result as GeminiResponse).response ?? (result as GeminiResponse);
      const candidates = response.candidates || [];
      const parts = candidates[0]?.content?.parts || [];

      for (const part of parts) {
        if (part.inlineData) {
          const { data, mimeType } = part.inlineData;
          images.push(`data:${mimeType};base64,${data}`);
        }
      }

      return { images, generationTime: 0 };
    } catch (error) {
      throw new Error(SERVICE_MESSAGES.AI_GENERATION_ERROR);
    }
  }

  async testConnection(): Promise<boolean> {
    return false;
  }
}

@injectable()
export class AIProviderService {
  private providers: Map<string, IAIProvider> = new Map();

  constructor() {
    const googleKey = process.env.GOOGLE_API_KEY;
    const puterKey = process.env.PUTER_API_KEY;
    const pollinationsKey = process.env.POLLINATIONS_API_KEY;

    this.providers.set('pollinations', new PollinationsProvider(pollinationsKey));

    if (googleKey) {
      this.providers.set('gemini', new GeminiProvider(googleKey));
    }

    if (puterKey) {
      this.providers.set('puter', new PuterProvider(puterKey));
    }
  }

  setApiKey(provider: string, apiKey: string) {
    if (!apiKey) return;
    
    if (provider === 'puter') {
      this.providers.set('puter', new PuterProvider(apiKey));
    } else if (provider === 'gemini') {
      this.providers.set('gemini', new GeminiProvider(apiKey));
    } else if (provider === 'pollinations') {
      this.providers.set('pollinations', new PollinationsProvider(apiKey));
    }
  }

  async generateImage(
    provider: string,
    params: AIGenerationParams,
  ): Promise<AIGenerationResult> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(SERVICE_MESSAGES.AI_PROVIDER_NOT_FOUND);
    }

    return providerInstance.generateImage(params);
  }

  async testConnection(provider: string): Promise<boolean> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(SERVICE_MESSAGES.AI_PROVIDER_NOT_FOUND);
    }

    return providerInstance.testConnection();
  }

  async testProvider(provider: string): Promise<boolean> {
    return this.testConnection(provider);
  }
}