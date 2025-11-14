export interface IGetFavoritedUsersUseCase {
execute(currentUserId: string, postId: string, page: number, limit: number): Promise<any>;
}
