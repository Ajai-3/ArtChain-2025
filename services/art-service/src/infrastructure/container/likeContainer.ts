import { GetLikeCountUseCase } from "../../application/usecase/like/GetLikeCountUseCase";
import { LikePostUseCase } from "../../application/usecase/like/LikePostUseCase";
import { UnlikePostUseCase } from "../../application/usecase/like/UnlikePostUseCase";
import { LikeController } from "../../presentation/controllers/LikeController";
import { LikeRepositoryImpl } from "../repositories/LikeRepositoryImpl";

// Repositories
const liekRepo = new LikeRepositoryImpl();

// Use cases
const likePostUseCase = new LikePostUseCase(liekRepo);
const unlikePostUseCase = new UnlikePostUseCase(liekRepo);
const getLikeCountUseCase = new GetLikeCountUseCase(liekRepo);

// Controller
export const likeController = new LikeController(
  likePostUseCase,
  unlikePostUseCase,
  getLikeCountUseCase
);
