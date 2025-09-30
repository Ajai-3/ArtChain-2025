export interface IRemoveFavoriteUseCase {
  execute(postId: string, userId: string): Promise<{ message: string }>;
}
