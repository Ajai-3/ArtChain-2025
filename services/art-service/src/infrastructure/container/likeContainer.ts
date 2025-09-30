import { GetLikedUsersUseCase } from './../../application/usecase/like/GetLikedUsersUseCase';
import { UserService } from './../service/UserService';
import { GetLikeCountUseCase } from "../../application/usecase/like/GetLikeCountUseCase";
import { LikePostUseCase } from "../../application/usecase/like/LikePostUseCase";
import { UnlikePostUseCase } from "../../application/usecase/like/UnlikePostUseCase";
import { LikeController } from "../../presentation/controllers/LikeController";
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";
import { LikeRepositoryImpl } from "../repositories/LikeRepositoryImpl";

// Repositories
const likeRepo = new LikeRepositoryImpl();
const artRepo = new ArtPostRepositoryImpl();

// Use cases
const likePostUseCase = new LikePostUseCase(artRepo, likeRepo);
const unlikePostUseCase = new UnlikePostUseCase(likeRepo);
const getLikeCountUseCase = new GetLikeCountUseCase(likeRepo);
const getLikedUsersUseCase = new GetLikedUsersUseCase(likeRepo)

// Controller
export const likeController = new LikeController(
  likePostUseCase,
  unlikePostUseCase,
  getLikeCountUseCase,
  getLikedUsersUseCase
);
