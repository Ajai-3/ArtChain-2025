import { injectable } from "inversify";
import { IPlatformConfigRepository } from "../../domain/repositories/IPlatformConfigRepository";
import { PlatformConfig } from "../../domain/entities/PlatformConfig";
import { PlatformConfigModel, PlatformConfigDocument } from "../models/PlatformConfigModel";

@injectable()
export class PlatformConfigRepositoryImpl implements IPlatformConfigRepository {
  async getConfig(): Promise<PlatformConfig> {
    const config = await PlatformConfigModel.findOne();
    if (!config) {
      // Create default if not exists
      const newConfig = await PlatformConfigModel.create({});
      return this.toEntity(newConfig);
    }
    return this.toEntity(config);
  }

  async updateConfig(data: Partial<PlatformConfig>): Promise<PlatformConfig> {
    const config = await PlatformConfigModel.findOne();
    if (!config) {
       const newConfig = await PlatformConfigModel.create(data);
       return this.toEntity(newConfig);
    }
    
    // Only update fields that are present in data
    if (data.auctionCommissionPercentage !== undefined) config.auctionCommissionPercentage = data.auctionCommissionPercentage;
    if (data.artSaleCommissionPercentage !== undefined) config.artSaleCommissionPercentage = data.artSaleCommissionPercentage;
    if (data.welcomeBonus !== undefined) config.welcomeBonus = data.welcomeBonus;
    if (data.referralBonus !== undefined) config.referralBonus = data.referralBonus;
    if (data.artCoinRate !== undefined) config.artCoinRate = data.artCoinRate;

    const updated = await config.save();
    return this.toEntity(updated);
  }

  private toEntity(doc: PlatformConfigDocument): PlatformConfig {
    return new PlatformConfig(
      doc.auctionCommissionPercentage,
      doc.artSaleCommissionPercentage,
      doc.welcomeBonus,
      doc.referralBonus,
      doc.artCoinRate,
      doc.updatedAt,
      doc._id?.toString()
    );
  }
}
