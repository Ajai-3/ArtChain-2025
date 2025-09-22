export class GetCategoryUseCase {}
import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IGetAllCategoryUseCase } from "../../../domain/usecase/category/IGetAllCategoryUseCase";

export class GetAllCategoryUseCase implements IGetAllCategoryUseCase {
  constructor(private readonly _categoryRepo: ICategoryRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    countFilter?: number
  ): Promise<{ data: Category[]; total: number }> {
    const { data, total } = await this._categoryRepo.getAllCategory(
      page,
      limit,
      search,
      status,
      countFilter
    );
    return { data, total };
  }
}
