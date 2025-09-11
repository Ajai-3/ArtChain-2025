import { CommentRepositoryImpl } from '../repositories/CommentRepositoryImpl';
import { CommentController } from "../../presentation/controllers/CommentController";
import { CreateCommentUseCase } from './../../application/usecase/comment/CreateCommentUseCase';
import { GetCommentsUseCase } from '../../application/usecase/comment/GetCommentsUseCase';


// Repositories
const commentRepo = new CommentRepositoryImpl()

// Use Cases
const createCommentUseCase = new CreateCommentUseCase(commentRepo)
const getCommentsUseCase = new GetCommentsUseCase(commentRepo)

// Controller
export const commentController = new CommentController(createCommentUseCase, getCommentsUseCase)