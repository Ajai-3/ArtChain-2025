import { AIGeneration } from "../entities/AIGeneration";
import { IBaseRepository } from "./IBaseRepository";

export interface IAIGenerationRepository extends IBaseRepository<AIGeneration> {
  findById(id: string): Promise<AIGeneration | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<AIGeneration[]>;
  countTodayFreeGenerations(userId: string): Promise<number>;
}
