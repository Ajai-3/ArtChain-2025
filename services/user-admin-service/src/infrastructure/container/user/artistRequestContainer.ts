import { UserRepositoryImpl } from '../../repositories/user/UserRepositoryImpl';
import { ArtistRequestRepositoryImpl } from '../../repositories/user/ArtistRequestRepositoryImpl';

import { ArtistRequestController } from '../../../presentation/controllers/user/ArtistRequestController';

import { CreateArtistRequestUseCase } from '../../../application/usecases/user/artist-request/CreateArtistRequestUseCase';
import { CheckUserArtistRequestUseCase } from '../../../application/usecases/user/artist-request/CheckUserArtistRequestUseCase';

// Repositories
const userRepo = new UserRepositoryImpl();
const artistRequestRepo = new ArtistRequestRepositoryImpl();

// Use Case
const createArtistRequestUseCase = new CreateArtistRequestUseCase(
  userRepo,
  artistRequestRepo
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
