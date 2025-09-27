import { Like } from "../../../../domain/entities/Like";

export interface ILikeUseCase {
  execute(userId: string, postId: string): Promise<Like>;
}