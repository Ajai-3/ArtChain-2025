export interface IGetUserFavoritedArtsUseCase {
  execute(
    userId: string,
    currentUserId: string,
    page?: number,
    limit?: number
  ): Promise<any[]>;
}
