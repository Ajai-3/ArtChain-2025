import { PlatformConfig } from "../entities/PlatformConfig";

export interface IPlatformConfigRepository {
  getConfig(): Promise<PlatformConfig>;
  updateConfig(config: Partial<PlatformConfig>): Promise<PlatformConfig>;
}
