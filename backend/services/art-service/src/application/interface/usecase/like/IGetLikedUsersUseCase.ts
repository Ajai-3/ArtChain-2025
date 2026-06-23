import type { GetLikedUsersResponse } from '../../../../types/usecase-response';

export interface IGetLikedUsersUseCase {
  execute(currentUserId: string, postId: string, page: number, limit: number): Promise<GetLikedUsersResponse>;
}
