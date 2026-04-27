import type { Comment } from '../../../../domain/entities/Comment';

export type CommentWithUser = Comment & {
  name: string;
  userName: string;
  profileImage: string | null;
  role: string;
  isVerified: boolean;
};

export interface IGetCommentsUseCase {
  execute(postId: string, page: number, limit: number): Promise<CommentWithUser[]>;
}
