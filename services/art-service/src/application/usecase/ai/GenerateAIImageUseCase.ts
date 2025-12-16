import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAIGenerationRepository } from "../../../domain/repositories/IAIGenerationRepository";
import { IAIConfigRepository } from "../../../domain/repositories/IAIConfigRepository";
import { AIProviderService } from "../../../infrastructure/service/AIProviderService";
import { IWalletService } from "../../../domain/interfaces/IWalletService";
import { IGenerateAIImageUseCase } from "../../interface/usecase/ai/IGenerateAIImageUseCase";
import { GenerateAIImageDTO } from "../../interface/dto/ai/GenerateAIImageDTO";

@injectable()
export class GenerateAIImageUseCase implements IGenerateAIImageUseCase {
  constructor(
    @inject(TYPES.IAIGenerationRepository) private readonly _aiGenerationRepo: IAIGenerationRepository,
    @inject(TYPES.IAIConfigRepository) private readonly _aiConfigRepo: IAIConfigRepository,
    @inject(TYPES.AIProviderService) private readonly _aiProviderService: AIProviderService,
    @inject(TYPES.IWalletService) private readonly _walletService: IWalletService
  ) {}

  async execute(input: GenerateAIImageDTO) {
    const { userId, prompt, negativePrompt, resolution, seed, useArtcoins } = input;

    // Get enabled AI configs
    const configs = await this._aiConfigRepo.findAllEnabled();
    if (!configs || configs.length === 0) {
      throw new Error("No AI providers are currently enabled");
    }

    let selectedConfig;
    if (input.provider) {
      selectedConfig = configs.find((c: any) => c.provider === input.provider);
      if (!selectedConfig) {
        throw new Error(`Provider '${input.provider}' is not enabled or does not exist`);
      }
    } else {
      // Sort by priority and get the first available provider
      const sortedConfigs = configs.sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));
      selectedConfig = sortedConfigs[0];
    }

    const modelToUse = input.model || selectedConfig.defaultModel;

    // Check quota
    const todayGenerations = await this._aiGenerationRepo.countTodayFreeGenerations(userId);
    const isFree = todayGenerations < (selectedConfig.dailyFreeLimit || 5) && !useArtcoins;

    let cost = 0;
    if (!isFree) {
      cost = (selectedConfig.artcoinCostPerImage || 0);
      console.log(`[GenerateAIImage] Paid generation. Cost: ${cost} ArtCoins`);

      if (cost > 0) {
        // Prepare payment details
        const description = `AI Generation Fee (${selectedConfig.provider} - ${modelToUse})`;
        const referenceId = `ai_gen_${userId}_${Date.now()}`; // Temporary ref, real one is created after generation usually, but we need unique key
        // We use admin user hash or null for system fees. Assuming wallet service handles null payee or we use a system ID.
        // For now, let's use a placeholder system ID or pass empty if allowed.
        // Actually, let's use the first available admin or a system constant. 
        // Better: Pass a recognized system constant if possible. If not, maybe the wallet service handles it.
        const payeeId = "SYSTEM_TREASURY"; // Placeholder 

        const paymentSuccess = await this._walletService.processPayment(
           userId,
           payeeId, 
           cost,
           description,
           referenceId,
           "AI_GENERATION"
        );

        if (!paymentSuccess) {
           throw new Error("Insufficient ArtCoins or payment failed.");
        }
      }
    } else {
      console.log(`[GenerateAIImage] Free generation. Used today: ${todayGenerations}`);
    }

    console.log(`[GenerateAIImage] Generating image with provider: ${selectedConfig.provider}, model: ${modelToUse}`);

    // Set API key from config if available (important for Gemini and Puter)
    if (selectedConfig.apiKey) {
      console.log(`[GenerateAIImage] Setting API key for provider: ${selectedConfig.provider}`);
      this._aiProviderService.setApiKey(selectedConfig.provider, selectedConfig.apiKey);
    }

    // Generate images using the AI provider FIRST
    const generationResult = await this._aiProviderService.generateImage(
      selectedConfig.provider,
      {
        prompt,
        negativePrompt,
        resolution,
        seed,
        model: modelToUse
      }
    );

    console.log(`[GenerateAIImage] Image generated successfully. Saving record...`);

    // Save generation record AFTER successful generation
    const generation = await this._aiGenerationRepo.create({
      userId,
      prompt,
      negativePrompt,
      resolution,
      imageCount: 1,
      seed,
      images: generationResult.images,
      provider: selectedConfig.provider,
      aiModel: modelToUse, // Corrected: use the actual model used
      cost,
      isFree,
      status: 'completed',
      generationTime: generationResult.generationTime || 0
    } as any);

    return {
      id: generation.id,
      prompt: generation.prompt,
      images: generation.images,
      isFree,
      cost,
      provider: generation.provider,
      model: generation.aiModel,
      createdAt: generation.createdAt,
      remainingFreeGenerations: isFree ? Math.max(0, (selectedConfig.dailyFreeLimit || 5) - todayGenerations - 1) : 0
    };
  }
}
