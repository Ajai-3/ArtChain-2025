export interface IGetUserLikedArtsWithUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<any>;
}
