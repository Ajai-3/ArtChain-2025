import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl";
import { UserManageMentController } from "../../../presentation/controllers/admin/UserManagementController";
import { GetAllUsersUseCase } from "../../../application/usecases/admin/user-management/GetAllUsersUseCase";
import { BanOrUnbanUserUseCase } from "../../../application/usecases/admin/user-management/BanOrUnbanUserUseCase";
import { GetAllArtistRequestsUseCase } from "../../../application/usecases/admin/user-management/GetAllArtistRequests";
import { ArtistRequestRepositoryImpl } from "../../repositories/user/ArtistRequestRepositoryImpl";
import { ElasticUserSearchRepositoryImpl } from "../../repositories/user/ElasticUserSearchRepositoryImpl";
import { ApproveArtistRequestUseCase } from "../../../application/usecases/admin/user-management/ApproveArtistRequestUseCase";
import { RejectArtistRequestUseCase } from "../../../application/usecases/admin/user-management/RejectArtistRequestUseCase";
import { SupporterRepositoryImpl } from "../../repositories/user/SupporterRepositoryIml";
import { ArtService } from "../../http/ArtService";

// Repositories
const artService = new ArtService();
const userRepo = new UserRepositoryImpl();
const artRepo = new ArtistRequestRepositoryImpl();
const supporterRepo = new SupporterRepositoryImpl();
const searchRepo = new ElasticUserSearchRepositoryImpl();

// Use Cases
const banOrUnbanUserUseCase = new BanOrUnbanUserUseCase(userRepo);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo, searchRepo);
const getAllArtistRequestsUseCase = new GetAllArtistRequestsUseCase(artRepo);
const rejectArtistRequestUseCase = new RejectArtistRequestUseCase(
  userRepo,
  artRepo
);
const approveArtistRequestUseCase = new ApproveArtistRequestUseCase(
  userRepo,
  supporterRepo,
  artRepo,
  artService
);
// Controller
export const userManageMentController = new UserManageMentController(
  getAllUsersUseCase,
  banOrUnbanUserUseCase,
  getAllArtistRequestsUseCase,
  approveArtistRequestUseCase,
  rejectArtistRequestUseCase
);
