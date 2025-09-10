import { CommentRepositoryImpl } from '../repositories/CommentRepositoryImpl';
import { CommentController } from "../../presentation/controllers/CommentController";
import { CreateCommentUseCase } from './../../application/usecase/comment/CreateCommentUseCase';


// Repositories
const commentRepo = new CommentRepositoryImpl()

// Use Cases
const createCommentUseCase = new CreateCommentUseCase(commentRepo)

// Controller
export const commentController = new CommentController(createCommentUseCase)