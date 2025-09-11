import { GetArtByNameUseCase } from "./../../application/usecase/art/GetArtByNameUseCase";
import { GetAllArtUseCase } from "./../../application/usecase/art/GetAllArtUseCase";
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";

import { CreateArtPostUseCase } from "../../application/usecase/art/CreateArtPostUseCase";

import { ArtController } from "../../presentation/controllers/ArtController";
import { GetArtByIdUseCase } from "../../application/usecase/art/GetArtByIdUseCase";

// Repositories
const artRepo = new ArtPostRepositoryImpl();

// Use Cases
const getAllArtUseCase = new GetAllArtUseCase(artRepo);
const getArtByIdUseCase = new GetArtByIdUseCase(artRepo);
const createArtUseCase = new CreateArtPostUseCase(artRepo);
const getArtByNameUseCase = new GetArtByNameUseCase(artRepo);

// Controller
export const artController = new ArtController(
  createArtUseCase,
  getArtByIdUseCase,
  getAllArtUseCase,
  getArtByNameUseCase
);
