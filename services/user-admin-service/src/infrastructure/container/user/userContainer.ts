import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl";

import { UserController } from "../../../presentation/controllers/user/UserController";

import { SupporterRepositoryImpl } from "../../repositories/user/SupporterRepositoryIml";
import { SupportUserUseCase } from "../../../application/usecases/user/user-intraction/SupportUserUseCase";
import { UnSupportUserUseCase } from "../../../application/usecases/user/user-intraction/UnSupportUserUseCase";
import { GetCurrentUserUseCase } from "../../../application/usecases/user/user-intraction/GetCurrentUserUseCase";
import { GetUserWithIdUserUseCase } from "../../../application/usecases/user/user-intraction/GetUserWithIdUserUseCase";


// Repositories
const userRepo = new UserRepositoryImpl();
const supporterRepo = new SupporterRepositoryImpl();

// Use Cases
const supportUserUseCase = new SupportUserUseCase(userRepo, supporterRepo);
const unSupportUserUseCase = new UnSupportUserUseCase(userRepo, supporterRepo);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepo, supporterRepo);
const getUserWithIdUseCase = new GetUserWithIdUserUseCase(userRepo, supporterRepo);


// Controller
export const userController = new UserController(
  getCurrentUserUseCase,
  getUserWithIdUseCase,
  supportUserUseCase,
  unSupportUserUseCase,
);
