import { ChangePasswordUserUseCase } from './../../../application/usecases/user/security/ChangePasswordUserUseCase';
import { SecurityController } from '../../../presentation/controllers/user/SecurityController';
import { UserRepositoryImpl } from '../../repositories/user/UserRepositoryImpl';

// Repositories
const userRepo = new UserRepositoryImpl();

// Use Cases
const changePasswordUserUseCase = new ChangePasswordUserUseCase(userRepo);

export const securityController = new SecurityController(
  changePasswordUserUseCase
);
