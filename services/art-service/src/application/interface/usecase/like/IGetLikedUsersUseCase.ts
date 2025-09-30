export interface IGetLikedUsersUseCase {
  execute(postId: string, page: number, limit: number): Promise<any>;
}
