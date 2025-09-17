import { Category } from "../../domain/entities/Category";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { CategorytModel } from "../models/CategoryModel";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";

export class CategoryRepositoryImpl
  extends BaseRepositoryImpl<Category>
  implements ICategoryRepository
{
  constructor() {
    super(CategorytModel);
  }

  async findByName(name: string): Promise<any> {
    const category = await CategorytModel.findOne({ name });
    return category;
  }

  async getAllCategory(
    page: number,
    limit: number,
    search?: string,
    status?: string,
    countFilter?: number
  ): Promise<{ data: Category[]; total: number }> {
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (countFilter !== undefined) {
      query.count = { $gte: countFilter };
    }

    if (status) {
      query.status = status;
    }

    const total = await CategorytModel.countDocuments(query);

    const categories = await CategorytModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return {
      data: categories,
      total,
    };
  }
}
