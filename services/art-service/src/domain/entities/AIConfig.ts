export class AIConfig {
  constructor(
    public readonly id: string,
    public readonly provider: string,
    public readonly displayName: string,
    public readonly enabled: boolean,
    public readonly isFree: boolean,
    public readonly dailyFreeLimit: number,
    public readonly artcoinCostPerImage: number,
    public readonly defaultModel: string,
    public readonly availableModels: string[],
    public readonly maxPromptLength: number,
    public readonly allowedResolutions: string[],
    public readonly maxImageCount: number,
    public readonly defaultSteps: number,
    public readonly defaultGuidanceScale: number,
    public readonly priority: number,
    public readonly apiKey?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
