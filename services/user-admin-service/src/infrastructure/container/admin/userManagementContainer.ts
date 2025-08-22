import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl";
import { UserManageMentController } from "../../../presentation/controllers/admin/UserManagementController";
import { GetAllUsersUseCase } from "../../../application/usecases/admin/user-management/GetAllUsersUseCase";
import { BanOrUnbanUserUseCase } from "../../../application/usecases/admin/user-management/BanOrUnbanUserUseCase";

// Repositories
const userRepo = new UserRepositoryImpl();

// Use Cases
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);
const banOrUnbanUserUseCase = new BanOrUnbanUserUseCase(userRepo);

// Controller
export const userManageMentController = new UserManageMentController(
  getAllUsersUseCase,
  banOrUnbanUserUseCase
);
