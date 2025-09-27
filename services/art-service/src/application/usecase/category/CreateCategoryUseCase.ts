import { CATEGORY_MESSAGES } from "./../../../constants/categoryMessages";
import { ConflictError } from "art-chain-shared";
import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { ICreateCategoryUseCase } from "../../interface/usecase/category/ICreateCategoryUseCase";

export class CreateCategoryUseCase implements ICreateCategoryUseCase {
  constructor(private readonly _categoryRepo: ICategoryRepository) {}

  async execute(name: string): Promise<Category> {
    const isCategory = await this._categoryRepo.findByName(name);

    if (isCategory) {
      throw new ConflictError(CATEGORY_MESSAGES.DUPLICATE_NAME);
    }

    const category = new Category(name, 0);

    const created = await this._categoryRepo.create(category);
    return created;
  }
}
