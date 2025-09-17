import { EditCategoryDTO } from "../../../domain/dto/category/EditCategoryDTO";
import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IEditCategoryUseCase } from "../../../domain/usecase/category/IEditCategoryUseCase";

export class EditCategoryUseCase implements IEditCategoryUseCase {
  constructor(private readonly _categoryRepo: ICategoryRepository) {}

  async execute(data: EditCategoryDTO): Promise<Category> {
    const { id, name, count, status } = data;
    const updatedCategory = await this._categoryRepo.update(id, { name, count, status });
    return updatedCategory;
  }
}
