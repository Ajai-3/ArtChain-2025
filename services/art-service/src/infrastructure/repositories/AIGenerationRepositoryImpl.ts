import { injectable } from "inversify";
import { AIGenerationModel } from "../models/AIGenerationModel";
import { AIGeneration } from "../../domain/entities/AIGeneration";
import { IAIGenerationRepository } from "../../domain/repositories/IAIGenerationRepository";

@injectable()
export class AIGenerationRepositoryImpl implements IAIGenerationRepository {
  async create(data: any): Promise<AIGeneration> {
    const generation = new AIGenerationModel(data);
    const saved = await generation.save();
    return this.toEntity(saved);
  }

  async getById(id: string): Promise<AIGeneration | null> {
    const generation = await AIGenerationModel.findById(id);
    return generation ? this.toEntity(generation) : null;
  }

  async getAll(page: number = 1, limit: number = 20): Promise<AIGeneration[]> {
    const skip = (page - 1) * limit;
    const generations = await AIGenerationModel.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return generations.map((g: any) => this.toEntity(g));
  }

  async count(): Promise<number> {
    return await AIGenerationModel.countDocuments();
  }

  async update(id: string, updates: Partial<AIGeneration>): Promise<AIGeneration> {
    const updated = await AIGenerationModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!updated) throw new Error("Generation not found");
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await AIGenerationModel.findByIdAndUpdate(id, { isDeleted: true });
  }

  async findById(id: string): Promise<AIGeneration | null> {
    return this.getById(id);
  }

  async findByUserId(userId: string, page: number = 1, limit: number = 20): Promise<AIGeneration[]> {
    const skip = (page - 1) * limit;
    const generations = await AIGenerationModel.find({ userId, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return generations.map((g: any) => this.toEntity(g));
  }

  async countTodayFreeGenerations(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await AIGenerationModel.countDocuments({
      userId,
      isFree: true,
      createdAt: { $gte: startOfDay }
    });
  }

  private toEntity(doc: any): AIGeneration {
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
      doc.isDeleted
    );
  }
}
