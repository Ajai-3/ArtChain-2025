export interface IGetAllArtWithUserIdUseCase {
  execute(
    page: number,
    limit: number,
    userId: string,
    currentUserId: string
  ): Promise<any[]>;
}
