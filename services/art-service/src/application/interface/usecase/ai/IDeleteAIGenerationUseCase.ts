export interface IDeleteAIGenerationUseCase {
  execute(generationId: string, userId: string): Promise<void>;
}
