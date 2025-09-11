import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { Comment } from "../../domain/entities/Comment";
import { CommentModel, CommentDocument } from "../models/CommentModel";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";

export class CommentRepositoryImpl
  extends BaseRepositoryImpl<Comment>
  implements ICommentRepository
{
  constructor() {
    super(CommentModel);
  }

  async getByPostId(postId: string, page = 1, limit = 10): Promise<Comment[]> {
    return CommentModel.find({ postId })
      .sort({ createdAt: -1 }) 
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<Comment[]>();
  }
}
