export interface IGetFavoriteCountUseCase {
execute(postId: string): Promise<number>;
}
