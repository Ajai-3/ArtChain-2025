import { injectable } from "inversify";
import { CategoryModel } from "../models/CategoryModel";
import { Category } from "../../domain/entities/Category";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";

@injectable()
export class CategoryRepositoryImpl
  extends BaseRepositoryImpl<Category>
  implements ICategoryRepository
{
  constructor() {
    super(CategoryModel);
  }

  async findById(id: string): Promise<Category | null> {
    return await CategoryModel.findById(id).lean<Category | null>();
  }

  async findByName(name: string): Promise<any> {
    const category = await CategoryModel.findOne({ name });
    return category;
  }
  async getCategoriesByIds(ids: string[]): Promise<Category[]> {
    return await CategoryModel.find({ _id: { $in: ids } }).lean();
  }

  async getAllCategory(
    page: number,
    limit: number,
    search?: string,
    status?: string,
    countFilter?: number
  ): Promise<{ 
    data: Category[]; 
    total: number;
    stats: {
      total: number;
      active: number;
      inactive: number;
      lowUsage: number;
    };
  }> {
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

    const [total, categories, active, inactive, lowUsage] = await Promise.all([
      CategoryModel.countDocuments(query),
      CategoryModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      CategoryModel.countDocuments({ status: 'active' }),
      CategoryModel.countDocuments({ status: 'inactive' }),
      CategoryModel.countDocuments({ count: { $lt: 20 } })
    ]);

    return {
      data: categories,
      total,
      stats: {
        total,
        active,
        inactive,
        lowUsage
      }
    };
  }
}
