import { UserRepositoryImpl } from '../../repositories/user/UserRepositoryImpl';

import { UserAuthController } from '../../../presentation/controllers/user/UserAuthController';

import { LoginUserUseCase } from '../../../application/usecases/user/auth/LoginUserUseCase';
import { RegisterUserUseCase } from '../../../application/usecases/user/auth/RegisterUserUseCase';
import { GoogleAuthUserUseCase } from '../../../application/usecases/user/auth/GoogleAuthUserUseCase';
import { RefreshTokenUserUseCase } from '../../../application/usecases/user/auth/RefreshTokenUserUseCase';
import { ResetPasswordUserUseCase } from '../../../application/usecases/user/auth/ResetPasswordUserUseCase';
import { StartRegisterUserUseCase } from '../../../application/usecases/user/auth/StartRegisterUserUseCase';
import { ForgotPasswordUserUseCase } from '../../../application/usecases/user/auth/ForgotPasswordUserUseCase';
import { ChangePasswordUserUseCase } from '../../../application/usecases/user/auth/ChangePasswordUserUseCase';
import { AddUserToElasticSearchUseCase } from '../../../application/usecases/user/search/AddUserToElasticSearchUseCase';

// Repositories
const userRepo = new UserRepositoryImpl();

// Use Cases
const startRegisterUserUseCase = new StartRegisterUserUseCase(userRepo);
const registerUserUseCase = new RegisterUserUseCase(userRepo);
const loginUserUseCase = new LoginUserUseCase(userRepo);
const googleAuthUserUseCase = new GoogleAuthUserUseCase(userRepo);
const forgotPasswordUserUseCase = new ForgotPasswordUserUseCase(userRepo);
const resetPasswordUserUseCase = new ResetPasswordUserUseCase(userRepo);
const changePasswordUserUseCase = new ChangePasswordUserUseCase(userRepo);
const refreshTokenUserUseCase = new RefreshTokenUserUseCase(userRepo);
const addUserToElasticUserUseCase = new AddUserToElasticSearchUseCase();

// Controller
export const userAuthController = new UserAuthController(
  startRegisterUserUseCase,
  registerUserUseCase,
  loginUserUseCase,
  googleAuthUserUseCase,
  forgotPasswordUserUseCase,
  resetPasswordUserUseCase,
  changePasswordUserUseCase,
  refreshTokenUserUseCase,
  addUserToElasticUserUseCase
);
