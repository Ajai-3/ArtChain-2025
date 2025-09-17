import { CategoryController } from "../../presentation/controllers/CategoryController";
import { CreateCategoryUseCase } from "../../application/usecase/category/CreateCategoryUseCase";
import { CategoryRepositoryImpl } from "../repositories/CategoryRepositoryImpl";
import { EditCategoryUseCase } from "../../application/usecase/category/EditCategoryUseCase";
import { GetAllCategoryUseCase } from "../../application/usecase/category/GetAllCategoryUseCase";

// Repositores
const categoryRepo = new CategoryRepositoryImpl();

// Use Cases
const getAllCategoryUseCase = new GetAllCategoryUseCase(categoryRepo);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepo);
const editCategoryUseCase = new EditCategoryUseCase(categoryRepo);

// Controller
export const categoryController = new CategoryController(
  getAllCategoryUseCase,
  createCategoryUseCase,
  editCategoryUseCase
);
