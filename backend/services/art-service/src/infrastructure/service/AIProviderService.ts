import { injectable } from 'inversify';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

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

// Pollinations.ai Provider (Free, no API key needed)
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

    // Updated valid models as per current Pollinations AI API
    const validModels = ['flux', 'zimage', 'gptimage', 'klein', 'qwen-image', 'grok-imagine'];
    const modelToUse = validModels.includes(modelName) ? modelName : 'flux';

    // Build URL with optional key in query params for better compatibility
    let url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${modelToUse}&width=${width}&height=${height}&seed=${seedValue}&nologo=true`;
    
    if (this.apiKey) {
      url += `&key=${this.apiKey}`;
    }

    try {
      if (this.apiKey) {
        console.log(`[Pollinations] Generating image with model ${modelToUse} using API key (starts with: ${this.apiKey.substring(0, 5)}...): ${url}`);
      } else {
        console.log(`[Pollinations] Generating image with model ${modelToUse} (no API key): ${url}`);
      }
      
      // Try to download the image to save as base64 with a longer timeout
      const headers: any = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000, // 60 seconds
        headers
      });

      const contentType = response.headers['content-type'] || 'image/png';
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const dataUri = `data:${contentType};base64,${base64Image}`;

      images.push(dataUri);
      console.log(`[Pollinations] Successfully downloaded image as ${contentType}`);
    } catch (error) {
      console.warn(
        '[Pollinations] Download failed, falling back to URL:',
        error instanceof Error ? error.message : error,
      );
      // Fallback: Save the URL if download fails (but ensure it's a direct image URL)
      images.push(url);
    }

    return {
      images,
      generationTime: 0,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      await axios.get(
        'https://image.pollinations.ai/prompt/test?width=64&height=64',
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Puter.js Provider (requires API key)
class PuterProvider implements IAIProvider {
  constructor(private apiKey?: string) {}

  async generateImage(params: AIGenerationParams): Promise<AIGenerationResult> {
    // TODO: Implement Puter.js API integration
    throw new Error(
      'Puter.js provider not yet implemented. Please configure API key and implementation.',
    );
  }

  async testConnection(): Promise<boolean> {
    return false;
  }
}

// Gemini Provider (requires API key)
class GeminiProvider implements IAIProvider {
  private client: GoogleGenAI | null = null;

  constructor(private apiKey?: string) {
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    }
  }

  async generateImage(params: AIGenerationParams): Promise<AIGenerationResult> {
    if (!this.client) {
      throw new Error('Gemini API key not configured');
    }

    const { prompt, model } = params;
    // Gemini 1.5 Flash is fast and supports image generation in some contexts, 
    // but usually text-to-image is Imagen. 
    // For now, let's use a placeholder approach if Imagen 3 isn't directly available in this SDK version
    const modelToUse = model || 'gemini-1.5-flash';
    const images: string[] = [];

    try {
      // If the model is an Imagen model, it would work differently.
      // For standard Gemini, we might be trying to generate an image using Tools or specific prompt formats.
      // BUT if we want true text-to-image, we should recommend Pollinations or use Vertex AI.
      // Let's assume the user might have access to a model that can return images.
      
      const result = await this.client.models.generateContent({
        model: modelToUse,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      // result should have response, and response has candidates
      const response = (result as any).response || result;
      
      // Look for inlineData in the parts (some models might return this)
      const candidates = response.candidates || [];
      const parts = candidates[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          images.push(`data:${mimeType};base64,${imageData}`);
        }
      }

      if (images.length === 0) {
        // Fallback: If no image in parts, maybe it gave a URL? 
        // Or it just failed to generate an actual image.
        throw new Error('Gemini did not return an image in the expected format. Standard Gemini API is primarily for text/multimodal input, not text-to-image generation.');
      }

      return {
        images,
        generationTime: 0,
      };
    } catch (error) {
      console.error('Gemini generation error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Test',
      });
      return true;
    } catch {
      return false;
    }
  }
}

@injectable()
export class AIProviderService {
  private providers: Map<string, IAIProvider> = new Map();

  constructor() {
    // Initialize providers
    // Pollinations can use an API key from env if available for its Pro tier
    const pollinationsKey = process.env.POLLINATIONS_API_KEY;
    this.providers.set('pollinations', new PollinationsProvider(pollinationsKey));
    this.providers.set('puter', new PuterProvider());

    // Initialize Gemini with env var if available
    const geminiKey = process.env.GEMINI_API_KEY;
    this.providers.set('gemini', new GeminiProvider(geminiKey));
  }

  async generateImage(
    provider: string,
    params: AIGenerationParams,
  ): Promise<AIGenerationResult> {
    const providerInstance = this.providers.get(provider);

    if (!providerInstance) {
      throw new Error(`Provider '${provider}' not found`);
    }

    return await providerInstance.generateImage(params);
  }

  async testProvider(provider: string): Promise<boolean> {
    const providerInstance = this.providers.get(provider);

    if (!providerInstance) {
      throw new Error(`Provider '${provider}' not found`);
    }

    return await providerInstance.testConnection();
  }

  setApiKey(provider: string, apiKey: string) {
    if (!apiKey) return; // Don't override with empty keys
    
    // Update provider with API key
    if (provider === 'puter') {
      this.providers.set('puter', new PuterProvider(apiKey));
    } else if (provider === 'gemini') {
      this.providers.set('gemini', new GeminiProvider(apiKey));
    } else if (provider === 'pollinations') {
      console.log(`[AIProviderService] Manually updating Pollinations API key`);
      this.providers.set('pollinations', new PollinationsProvider(apiKey));
    }
  }
}
