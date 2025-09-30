export interface IGetFavoritedUsersUseCase {
execute(postId: string, page: number, limit: number): Promise<any>;
}
