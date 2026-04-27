import type { UnlikePostResponse } from '../../../../types/usecase-response';

export interface IUnlikePostUseCase {
  execute(postId: string, userId: string): Promise<UnlikePostResponse>;
}
