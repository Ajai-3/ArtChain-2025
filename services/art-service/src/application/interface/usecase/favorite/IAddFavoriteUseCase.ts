export interface IAddFavoriteUseCase {
  execute(postId: string, userId: string): Promise<any>;
}
