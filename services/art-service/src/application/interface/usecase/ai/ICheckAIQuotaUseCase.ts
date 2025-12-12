export interface ICheckAIQuotaUseCase {
  execute(userId: string): Promise<any>;
}
