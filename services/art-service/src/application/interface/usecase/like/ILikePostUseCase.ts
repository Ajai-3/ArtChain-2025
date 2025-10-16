import { Like } from "../../../../domain/entities/Like";

export interface ILikePostUseCase {
  execute(userId: string, postId: string): Promise<Like>;
}