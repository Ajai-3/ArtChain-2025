export interface IGetWonAuctionsUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<unknown[]>;
}