import type { GetFavoritedUsersResponse } from '../../../../types/usecase-response';

export interface IGetFavoritedUsersUseCase {
  execute(currentUserId: string, postId: string, page: number, limit: number): Promise<GetFavoritedUsersResponse>;
}
