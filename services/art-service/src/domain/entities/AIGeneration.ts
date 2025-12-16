export type AIGenerationStatus = "pending" | "processing" | "completed" | "failed";

export class AIGeneration {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly prompt: string,
    public readonly resolution: string,
    public readonly imageCount: number,
    public readonly images: string[],
    public readonly provider: string,
    public readonly aiModel: string,
    public readonly cost: number,
    public readonly isFree: boolean,
    public readonly status: AIGenerationStatus,
    public readonly negativePrompt?: string,
    public readonly seed?: number,
    public readonly generationTime?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly isDeleted: boolean = false
  ) {}
}
