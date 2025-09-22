import { Category } from "../../../domain/entities/Category";
import { EditCategoryDTO } from "../../dto/category/EditCategoryDTO";

export interface IEditCategoryUseCase {
  execute(data: EditCategoryDTO): Promise<Category>;
}
