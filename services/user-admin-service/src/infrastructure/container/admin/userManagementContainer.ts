import { UserRepositoryImpl } from '../../repositories/user/UserRepositoryImpl';
import { UserManageMentController } from '../../../presentation/controllers/admin/UserManagementController';
import { GetAllUsersUseCase } from '../../../application/usecases/admin/user-management/GetAllUsersUseCase';
import { BanOrUnbanUserUseCase } from '../../../application/usecases/admin/user-management/BanOrUnbanUserUseCase';
import { GetAllArtistRequestsUseCase } from '../../../application/usecases/admin/user-management/GetAllArtistRequests';
import { ArtistRequestRepositoryImpl } from '../../repositories/user/ArtistRequestRepositoryImpl';

// Repositories
const userRepo = new UserRepositoryImpl();
const artRepo = new ArtistRequestRepositoryImpl()

// Use Cases
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);
const banOrUnbanUserUseCase = new BanOrUnbanUserUseCase(userRepo);
const getAllArtistRequestsUseCase = new GetAllArtistRequestsUseCase(artRepo)

// Controller
export const userManageMentController = new UserManageMentController(
  getAllUsersUseCase,
  banOrUnbanUserUseCase,
  getAllArtistRequestsUseCase
);
