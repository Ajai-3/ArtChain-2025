import { ConflictError } from "art-chain-shared";
import { EditCategoryDTO } from "../../../domain/dto/category/EditCategoryDTO";
import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IEditCategoryUseCase } from "../../../domain/usecase/category/IEditCategoryUseCase";
import { CATEGORY_MESSAGES } from "../../../constants/categoryMessages";

export class EditCategoryUseCase implements IEditCategoryUseCase {
  constructor(private readonly _categoryRepo: ICategoryRepository) {}

  async execute(data: EditCategoryDTO): Promise<Category> {
    const { id, name, count, status } = data;
    console.log(data);

    if (name) {
      const category = await this._categoryRepo.findByName(name);

      if (category) {
        throw new ConflictError(CATEGORY_MESSAGES.DUPLICATE_NAME);
      }
    }
    const updatedCategory = await this._categoryRepo.update(id, {
      name,
      count,
      status,
    });
    return updatedCategory;
  }
}
