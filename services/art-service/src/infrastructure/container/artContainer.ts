import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";

import { CreateArtPostUseCase } from "../../application/usecase/CreateArtPostUseCase";

import { ArtController } from "../../presentation/controllers/ArtController";

// Repositories
const artRepo = new ArtPostRepositoryImpl();

// Use Cases
const createArtUseCase = new CreateArtPostUseCase(artRepo);

// Controller
export const artController = new ArtController(createArtUseCase);
