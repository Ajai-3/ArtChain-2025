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
}
