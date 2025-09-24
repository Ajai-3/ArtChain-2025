import { Like } from "../../entities/Like";

export interface ILikeUseCase {
  execute(userId: string, postId: string): Promise<Like>;
}