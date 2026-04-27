import { injectable } from 'inversify';
import { AIConfigModel, AIConfigDocument } from '../models/AIConfigModel';
import { AIConfig } from '../../domain/entities/AIConfig';
import { BaseRepositoryImpl } from '../repositories/BaseRepositoryImpl';
import { IAIConfigRepository } from '../../domain/repositories/IAIConfigRepository';

@injectable()
export class AIConfigRepositoryImpl
  extends BaseRepositoryImpl<AIConfig>
  implements IAIConfigRepository
{
  constructor() {
    super(AIConfigModel);
  }

  async findByProvider(provider: string): Promise<AIConfig | null> {
    const config = await AIConfigModel.findOne({ provider }).lean<AIConfigDocument | null>();
    return config ? this.toEntity(config) : null;
  }

  async findAll(): Promise<AIConfig[]> {
    const configs = await AIConfigModel.find().lean<AIConfigDocument[]>();
    return configs.map((c) => this.toEntity(c));
  }

  async findAllEnabled(): Promise<AIConfig[]> {
    const configs = await AIConfigModel.find({ enabled: true }).lean<AIConfigDocument[]>();
    return configs.map((c) => this.toEntity(c));
  }

  private toEntity(doc: AIConfigDocument): AIConfig {
    return new AIConfig(
      doc._id.toString(),
      doc.provider,
      doc.displayName,
      doc.enabled,
      doc.isFree,
      doc.dailyFreeLimit,
      doc.artcoinCostPerImage,
      doc.defaultModel,
      doc.availableModels,
      doc.maxPromptLength,
      doc.allowedResolutions,
      doc.maxImageCount,
      doc.defaultSteps,
      doc.defaultGuidanceScale,
      doc.priority,
      doc.apiKey,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
