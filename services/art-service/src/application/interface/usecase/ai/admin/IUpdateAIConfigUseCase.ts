export interface IUpdateAIConfigUseCase {
  execute(provider: string, updates: any): Promise<any>;
}
