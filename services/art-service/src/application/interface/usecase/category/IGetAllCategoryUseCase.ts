import { Category } from "../../../../domain/entities/Category";
export interface IGetAllCategoryUseCase {
  execute(
    page: number,
    limit: number,
    search?: string,
    status?: string,
    countFilter?: number
  ): Promise<{ data: Category[]; total: number }>;
}