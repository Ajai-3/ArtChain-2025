import { GetAllArtUseCase } from './../../application/usecase/art/GetAllArtUseCase';
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";

import { CreateArtPostUseCase } from "../../application/usecase/art/CreateArtPostUseCase";

import { ArtController } from "../../presentation/controllers/ArtController";
import { GetArtByIdUseCase } from "../../application/usecase/art/GetArtByIdUseCase";

// Repositories
const artRepo = new ArtPostRepositoryImpl();

// Use Cases
const createArtUseCase = new CreateArtPostUseCase(artRepo);
const getArtByIdUseCase = new GetArtByIdUseCase(artRepo)
const getAllArtUseCase = new GetAllArtUseCase(artRepo)

// Controller
export const artController = new ArtController(createArtUseCase, getArtByIdUseCase, getAllArtUseCase);
