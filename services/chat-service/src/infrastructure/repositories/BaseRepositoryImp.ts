import { Model } from "mongoose";
import { injectable } from "inversify";
import { IBaseRepository } from "../../domain/repositories/IBaseRepositories";

@injectable()
export abstract class BaseRepositoryImp<T, D> implements IBaseRepository<T> {
  protected model: Model<D>;

  constructor(model: Model<D>) {
    this.model = model;
  }

  protected mapDbToDomain(dbObj: any): T {
    if (!dbObj) return null as any;

    const obj = dbObj.toObject ? dbObj.toObject({ versionKey: false }) : dbObj;

    return {
      ...obj,
      id: obj.id ?? obj._id?.toString(),
    } as T;
  }

  protected mapDbArrayToDomain(docs: any[]): T[] {
    return docs.map((doc) => this.mapDbToDomain(doc)!).filter(Boolean);
  }

  async create(item: T): Promise<T> {
    const dbItem = await this.model.create(item);
    return this.mapDbToDomain(dbItem);
  }

  async findAll(): Promise<T[]> {
    const dbItems = await this.model.find();
    return this.mapDbArrayToDomain(dbItems);
  }

  async findById(id: string): Promise<T | null> {
    const dbItem = await this.model.findById(id);
    return this.mapDbToDomain(dbItem);
  }
  async update(id: string, item: Partial<T>): Promise<T> {
    const dbItem = await this.model.findByIdAndUpdate(id, item as any, {
      new: true,
    });
    return this.mapDbToDomain(dbItem);
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
