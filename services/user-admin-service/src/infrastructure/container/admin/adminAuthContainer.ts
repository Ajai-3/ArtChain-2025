import { UserRepositoryImpl } from '../../repositories/user/UserRepositoryImpl';

import { LoginAdminUseCase } from '../../../application/usecases/admin/LoginAdminUseCase';
import { AdminAuthController } from '../../../presentation/controllers/admin/AdminAuthController';

// Repositories
const userRepo = new UserRepositoryImpl();

// Use Cases
const loginAdminUseCase = new LoginAdminUseCase(userRepo);

// Controller
export const adminAuthController = new AdminAuthController(loginAdminUseCase);
