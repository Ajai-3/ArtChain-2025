import { GetCurrentUserUseCase } from "../../../application/usecases/user/user-intraction/GetCurrentUserUseCase";
import { GetUserWithIdUserUseCase } from "../../../application/usecases/user/user-intraction/GetUserWithIdUserUseCase";
import { SupportUserUseCase } from "../../../application/usecases/user/user-intraction/SupportUserUseCase";
import { UnSupportUserUseCase } from "../../../application/usecases/user/user-intraction/UnSupportUserUseCase";
import { UserController } from "../../../presentation/controllers/user/UserController";
import { SupporterRepositoryImpl } from "../../repositories/user/SupporterRepositoryIml";
import { UserRepositoryImpl } from "../../repositories/user/UserRepositoryImpl";


// Repositories
const userRepo = new UserRepositoryImpl();
const supporterRepo = new SupporterRepositoryImpl();

// Use Cases
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepo, supporterRepo);
const getUserWithIdUseCase = new GetUserWithIdUserUseCase(userRepo, supporterRepo);
const supportUserUseCase = new SupportUserUseCase(userRepo, supporterRepo);
const unSupportUserUseCase = new UnSupportUserUseCase(userRepo, supporterRepo);


// Controller
export const userController = new UserController(
  getCurrentUserUseCase,
  getUserWithIdUseCase,
  supportUserUseCase,
  unSupportUserUseCase,
);
