import { AIConfig } from "../entities/AIConfig";
import { IBaseRepository } from "./IBaseRepository";

export interface IAIConfigRepository extends IBaseRepository<AIConfig> {
  findByProvider(provider: string): Promise<AIConfig | null>;
  findAll(): Promise<AIConfig[]>;
  findAllEnabled(): Promise<AIConfig[]>;
}
