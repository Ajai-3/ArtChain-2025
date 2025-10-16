import { injectable } from "inversify";
import { CommentModel } from "../models/CommentModel";
import { Comment } from "../../domain/entities/Comment";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";

@injectable()
export class CommentRepositoryImpl
  extends BaseRepositoryImpl<Comment>
  implements ICommentRepository
{
  constructor() {
    super(CommentModel);
  }

  async countByPostId(postId: string): Promise<number> {
    return await CommentModel.countDocuments({ postId });
  }

  async getByPostId(postId: string, page = 1, limit = 10): Promise<Comment[]> {
    return CommentModel.find({ postId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<Comment[]>();
  }
}
