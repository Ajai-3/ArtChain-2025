import { CreateArtistRequestUseCase } from "../../../application/usecases/user/artist-request/CreateArtistRequestUseCase";
import { HasUserSubmittedRequestUseCase } from "../../../application/usecases/user/artist-request/HasUserSubmittedRequestUseCase";
import { ArtistRequestController } from "../../../presentation/controllers/user/ArtistRequestController";
import { ArtistRequestRepositoryImpl } from "../../repositories/user/ArtistRequestRepositoryImpl";
import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl";

// Repositories
const userRepo = new UserRepositoryImpl();
const artistRequestRepo = new ArtistRequestRepositoryImpl();

// Use Case
const createArtistRequestUseCase = new CreateArtistRequestUseCase(userRepo, artistRequestRepo);
const hasUserSubmittedRequestUseCase = new HasUserSubmittedRequestUseCase(userRepo, artistRequestRepo)

// Controller
export const artistRequestController = new ArtistRequestController(
  createArtistRequestUseCase,
  hasUserSubmittedRequestUseCase

);
