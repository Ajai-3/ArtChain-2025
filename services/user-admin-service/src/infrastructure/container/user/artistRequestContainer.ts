import { ArtService } from "../../http/ArtService";
import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl";
import { SupporterRepositoryImpl } from "../../repositories/user/SupporterRepositoryIml";
import { ArtistRequestRepositoryImpl } from "../../repositories/user/ArtistRequestRepositoryImpl";
import { ArtistRequestController } from "../../../presentation/controllers/user/ArtistRequestController";
import { CreateArtistRequestUseCase } from "../../../application/usecases/user/artist-request/CreateArtistRequestUseCase";
import { CheckUserArtistRequestUseCase } from "../../../application/usecases/user/artist-request/CheckUserArtistRequestUseCase";

// Repositories
const artService = new ArtService();
const userRepo = new UserRepositoryImpl();
const supporterRepo = new SupporterRepositoryImpl();
const artistRequestRepo = new ArtistRequestRepositoryImpl();

// Use Case
const createArtistRequestUseCase = new CreateArtistRequestUseCase(
  userRepo,
  artistRequestRepo,
  supporterRepo,
  artService
);
const checkUserArtistRequestUseCase = new CheckUserArtistRequestUseCase(
  userRepo,
  artistRequestRepo
);

// Controller
export const artistRequestController = new ArtistRequestController(
  createArtistRequestUseCase,
  checkUserArtistRequestUseCase
);
