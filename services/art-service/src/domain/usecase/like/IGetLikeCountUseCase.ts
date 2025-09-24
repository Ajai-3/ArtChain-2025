export interface IGetLikeCountUseCase {
  execute(postId: string): Promise<number>;
}