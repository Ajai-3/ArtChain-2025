import { CountArtWorkUseCase } from "./../../application/usecase/art/CountArtWorkUseCase";
import { GetArtByNameUseCase } from "./../../application/usecase/art/GetArtByNameUseCase";
import { GetAllArtUseCase } from "./../../application/usecase/art/GetAllArtUseCase";
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";

import { CreateArtPostUseCase } from "../../application/usecase/art/CreateArtPostUseCase";

import { ArtController } from "../../presentation/controllers/ArtController";
import { GetArtByIdUseCase } from "../../application/usecase/art/GetArtByIdUseCase";
import { CategoryRepositoryImpl } from "../repositories/CategoryRepositoryImpl";
import { ArtToElasticSearchUseCase } from "../../application/usecase/art/ArtToElasticSearchUseCase";
import { LikeRepositoryImpl } from "../repositories/LikeRepositoryImpl";
import { CommentRepositoryImpl } from "../repositories/CommentRepositoryImpl";
import { GetAllArtWithUserNameUseCase } from "../../application/usecase/art/GetAllArtWithUserNameUseCase";

// Repositories
const likeRepo = new LikeRepositoryImpl()
const artRepo = new ArtPostRepositoryImpl();
const commentRepo = new CommentRepositoryImpl();
const categoryRepo = new CategoryRepositoryImpl();

// Use Cases
const getArtByIdUseCase = new GetArtByIdUseCase(artRepo);
const countArtWorkUseCase = new CountArtWorkUseCase(artRepo);
const getAllArtUseCase = new GetAllArtUseCase(artRepo, likeRepo, commentRepo);
const getArtByNameUseCase = new GetArtByNameUseCase(artRepo, likeRepo, commentRepo);
const artToElasticSearchUseCase = new ArtToElasticSearchUseCase();
const createArtUseCase = new CreateArtPostUseCase(artRepo, categoryRepo);
const getAllArtWithUserNameUseCase = new GetAllArtWithUserNameUseCase(artRepo, likeRepo, commentRepo)

// Controller
export const artController = new ArtController(
  createArtUseCase,
  getArtByIdUseCase,
  getAllArtUseCase,
  getArtByNameUseCase,
  artToElasticSearchUseCase,
  countArtWorkUseCase,
  getAllArtWithUserNameUseCase
);
