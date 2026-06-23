import type { GetUserLikedArtsResponse } from '../../../../types/usecase-response';

export interface IGetUserLikedArtsWithUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<GetUserLikedArtsResponse>;
}
