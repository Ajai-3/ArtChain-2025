import { injectable } from 'inversify';
import { AIGenerationModel, AIGenerationDocument } from '../models/AIGenerationModel';
import { AIGeneration } from '../../domain/entities/AIGeneration';
import { BaseRepositoryImpl } from '../repositories/BaseRepositoryImpl';
import { IAIGenerationRepository } from '../../domain/repositories/IAIGenerationRepository';

@injectable()
export class AIGenerationRepositoryImpl
  extends BaseRepositoryImpl<AIGeneration>
  implements IAIGenerationRepository
{
  constructor() {
    super(AIGenerationModel);
  }

  async findById(id: string): Promise<AIGeneration | null> {
    const generation = await AIGenerationModel.findById(id).lean<AIGenerationDocument | null>();
    return generation ? this.toEntity(generation) : null;
  }

  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<AIGeneration[]> {
    const skip = (page - 1) * limit;
    const generations = await AIGenerationModel.find({
      userId,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<AIGenerationDocument[]>();
    return generations.map((g) => this.toEntity(g));
  }

  async countTodayFreeGenerations(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await AIGenerationModel.countDocuments({
      userId,
      isFree: true,
      createdAt: { $gte: startOfDay },
    });
  }

  private toEntity(doc: AIGenerationDocument): AIGeneration {
    return new AIGeneration(
      doc._id.toString(),
      doc.userId,
      doc.prompt,
      doc.resolution,
      doc.imageCount,
      doc.images,
      doc.provider,
      doc.aiModel,
      doc.cost,
      doc.isFree,
      doc.status,
      doc.negativePrompt,
      doc.seed,
      doc.generationTime,
      doc.createdAt,
      doc.updatedAt,
      doc.isDeleted,
    );
  }
}
