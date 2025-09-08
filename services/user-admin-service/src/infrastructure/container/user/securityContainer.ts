import { ChangeEmailUserUseCase } from "./../../../application/usecases/user/security/ChangeEmailUserUseCase";
import { ChangePasswordUserUseCase } from "./../../../application/usecases/user/security/ChangePasswordUserUseCase";
import { SecurityController } from "../../../presentation/controllers/user/SecurityController";
import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl";
import { VerifyEmailTokenUserUseCase } from "../../../application/usecases/user/security/VerifyEmailTokenUserUseCase";

// Repositories
const userRepo = new UserRepositoryImpl();

// Use Cases
const changePasswordUserUseCase = new ChangePasswordUserUseCase(userRepo);
const changeEmailUserUseCase = new ChangeEmailUserUseCase(userRepo);
const verifyEmailTokenUserUseCase = new VerifyEmailTokenUserUseCase(userRepo)

export const securityController = new SecurityController(
  changePasswordUserUseCase,
  changeEmailUserUseCase,
  verifyEmailTokenUserUseCase

);
