import { UserRepositoryImpl } from '../../repositories/user/UserRepositoryImpl';

import { UserController } from '../../../presentation/controllers/user/UserController';

import { SupporterRepositoryImpl } from '../../repositories/user/SupporterRepositoryIml';
import { SupportUserUseCase } from '../../../application/usecases/user/user-intraction/SupportUserUseCase';
import { UnSupportUserUseCase } from '../../../application/usecases/user/user-intraction/UnSupportUserUseCase';
import { GetCurrentUserUseCase } from '../../../application/usecases/user/user-intraction/GetCurrentUserUseCase';
import { GetUserWithIdUserUseCase } from '../../../application/usecases/user/user-intraction/GetUserWithIdUserUseCase';
import { GetUserSupportersUseCase } from '../../../application/usecases/user/user-intraction/GetUserSupportersUseCase';
import { GetUserSupportingUseCase } from '../../../application/usecases/user/user-intraction/GetUserSupportingUseCase';
import { GetUsersByIdsUserUseCase } from '../../../application/usecases/user/user-intraction/GetUsersByIdsUserUseCase';
import { UpdateProfileUserUseCase } from '../../../application/usecases/user/profile/UpdateProfileUserUseCase';


// Repositories
const userRepo = new UserRepositoryImpl();
const supporterRepo = new SupporterRepositoryImpl();

// Use Cases
const supportUserUseCase = new SupportUserUseCase(userRepo, supporterRepo);
const unSupportUserUseCase = new UnSupportUserUseCase(userRepo, supporterRepo);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepo, supporterRepo);
const getUserWithIdUseCase = new GetUserWithIdUserUseCase(userRepo, supporterRepo);
const getUserSupportersUseCase = new GetUserSupportersUseCase(userRepo, supporterRepo)
const getUserSupportingUseCase = new GetUserSupportingUseCase(userRepo, supporterRepo)
const  getUsersByIdsUserUseCase = new GetUsersByIdsUserUseCase(userRepo)

const updateProfileUserUseCase = new UpdateProfileUserUseCase(userRepo)


// Controller
export const userController = new UserController(
  getCurrentUserUseCase,
  getUserWithIdUseCase,
  supportUserUseCase,
  unSupportUserUseCase,
  getUserSupportersUseCase,
  getUserSupportingUseCase,
  getUsersByIdsUserUseCase,
  updateProfileUserUseCase
);
