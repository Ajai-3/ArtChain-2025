export interface ICheckOngoingCommissionUseCase {
  execute(requesterId: string, artistId: string): Promise<{ hasOngoing: boolean }>;
}
