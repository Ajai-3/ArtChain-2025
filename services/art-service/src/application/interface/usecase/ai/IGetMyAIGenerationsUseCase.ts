export interface IGetMyAIGenerationsUseCase {
  execute(userId: string, page: number, limit: number): Promise<any>;
}
