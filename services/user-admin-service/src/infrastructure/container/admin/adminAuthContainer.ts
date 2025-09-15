import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl";

import { LoginAdminUseCase } from "../../../application/usecases/admin/auth/LoginAdminUseCase";
import { AdminAuthController } from "../../../presentation/controllers/admin/AdminAuthController";
import { RefreshTokenUseCase } from "../../../application/usecases/admin/auth/RefreshTokenUseCase";

// Repositories
const userRepo = new UserRepositoryImpl();

// Use Cases
const loginAdminUseCase = new LoginAdminUseCase(userRepo);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepo);

// Controller
export const adminAuthController = new AdminAuthController(
  loginAdminUseCase,
  refreshTokenUseCase
);
