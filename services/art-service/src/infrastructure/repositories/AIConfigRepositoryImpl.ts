import { injectable } from "inversify";
import { AIConfigModel } from "../models/AIConfigModel";
import { AIConfig } from "../../domain/entities/AIConfig";
import { IAIConfigRepository } from "../../domain/repositories/IAIConfigRepository";

@injectable()
export class AIConfigRepositoryImpl implements IAIConfigRepository {
  async create(data: any): Promise<AIConfig> {
    const config = new AIConfigModel(data);
    const saved = await config.save();
    return this.toEntity(saved);
  }

  async getById(id: string): Promise<AIConfig | null> {
    const config = await AIConfigModel.findById(id);
    return config ? this.toEntity(config) : null;
  }

  async getAll(page?: number, limit?: number): Promise<AIConfig[]> {
    if (page && limit) {
      const skip = (page - 1) * limit;
      const configs = await AIConfigModel.find().skip(skip).limit(limit);
      return configs.map((c: any) => this.toEntity(c));
    }
    const configs = await AIConfigModel.find();
    return configs.map((c: any) => this.toEntity(c));
  }

  async count(): Promise<number> {
    return await AIConfigModel.countDocuments();
  }

  async update(id: string, updates: Partial<AIConfig>): Promise<AIConfig> {
    const updated = await AIConfigModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!updated) throw new Error("Config not found");
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await AIConfigModel.findByIdAndDelete(id);
  }

  async findByProvider(provider: string): Promise<AIConfig | null> {
    const config = await AIConfigModel.findOne({ provider });
    return config ? this.toEntity(config) : null;
  }

  async findAll(): Promise<AIConfig[]> {
    const configs = await AIConfigModel.find();
    return configs.map((c: any) => this.toEntity(c));
  }

  async findAllEnabled(): Promise<AIConfig[]> {
    const configs = await AIConfigModel.find({ enabled: true });
    return configs.map((c: any) => this.toEntity(c));
  }

  private toEntity(doc: any): AIConfig {
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
      doc.updatedAt
    );
  }
}
