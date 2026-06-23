import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IAIGenerationRepository } from '../../../domain/repositories/IAIGenerationRepository';
import { IAIConfigRepository } from '../../../domain/repositories/IAIConfigRepository';
import { AIProviderService } from '../../../infrastructure/service/AIProviderService';
import { IWalletService } from '../../../domain/interfaces/IWalletService';
import { IGenerateAIImageUseCase } from '../../interface/usecase/ai/IGenerateAIImageUseCase';
import { GenerateAIImageDTO } from '../../interface/dto/ai/GenerateAIImageDTO';
import type { AIConfig } from '../../../domain/entities/AIConfig';
import type { AIGeneration } from '../../../domain/entities/AIGeneration';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { AI_MESSAGES } from '../../../constants/AIMessages';

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

    const configs = await this._aiConfigRepo.findAllEnabled();
    if (!configs || configs.length === 0) {
      throw new NotFoundError(AI_MESSAGES.NO_PROVIDERS_ENABLED);
    }

    let selectedConfig: AIConfig | undefined;
    if (input.provider) {
      selectedConfig = configs.find((c: AIConfig) => c.provider === input.provider);
      if (!selectedConfig) {
        throw new BadRequestError(AI_MESSAGES.PROVIDER_NOT_ENABLED.replace('xxx', input.provider));
      }
    } else {
      const sortedConfigs = configs.sort((a: AIConfig, b: AIConfig) => (a.priority || 0) - (b.priority || 0));
      selectedConfig = sortedConfigs[0];
    }

    const modelToUse = input.model || selectedConfig.defaultModel;

    const todayGenerations = await this._aiGenerationRepo.countTodayFreeGenerations(userId);
    const isFree = todayGenerations < (selectedConfig.dailyFreeLimit || 5) && !useArtcoins;

    let cost = 0;
    if (!isFree) {
      cost = (selectedConfig.artcoinCostPerImage || 0);
      console.log(`[GenerateAIImage] Paid generation. Cost: ${cost} ArtCoins`);

      if (cost > 0) {
        const description = `AI Generation Fee (${selectedConfig.provider} - ${modelToUse})`;
        const referenceId = `ai_gen_${userId}_${Date.now()}`;
        const payeeId = 'SYSTEM_TREASURY';

        const paymentSuccess = await this._walletService.processPayment(
           userId,
           payeeId,
           cost,
           description,
           referenceId,
           'AI_GENERATION'
        );

if (!paymentSuccess) {
           throw new BadRequestError(AI_MESSAGES.INSUFFICIENT_ARTCOINS);
         }
       }
    } else {
      console.log(`[GenerateAIImage] Free generation. Used today: ${todayGenerations}`);
    }

    console.log(`[GenerateAIImage] Generating image with provider: ${selectedConfig.provider}, model: ${modelToUse}`);

    if (selectedConfig.apiKey) {
      console.log(`[GenerateAIImage] Setting API key for provider: ${selectedConfig.provider}`);
      this._aiProviderService.setApiKey(selectedConfig.provider, selectedConfig.apiKey);
    }

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

    console.log('[GenerateAIImage] Image generated successfully. Saving record...');

    const generation = await this._aiGenerationRepo.create({
      id: '',
      userId,
      prompt,
      negativePrompt: negativePrompt || '',
      resolution,
      imageCount: 1,
      seed: seed || 0,
      images: generationResult.images,
      provider: selectedConfig.provider,
      aiModel: modelToUse,
      cost,
      isFree,
      status: 'completed',
      generationTime: generationResult.generationTime || 0
    } as unknown as AIGeneration);

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
