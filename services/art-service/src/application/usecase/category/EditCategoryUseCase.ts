import { inject, injectable } from "inversify";
import { ConflictError } from "art-chain-shared";
import { Category } from "../../../domain/entities/Category";
import { TYPES } from "../../../infrastructure/invectify/types";
import { CATEGORY_MESSAGES } from "../../../constants/categoryMessages";
import { EditCategoryDTO } from "../../interface/dto/category/EditCategoryDTO";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IEditCategoryUseCase } from "../../interface/usecase/category/IEditCategoryUseCase";

@injectable()
export class EditCategoryUseCase implements IEditCategoryUseCase {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private readonly _categoryRepo: ICategoryRepository
  ) {}

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
