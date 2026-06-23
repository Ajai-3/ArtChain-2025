import { Model, Document } from 'mongoose';
import { injectable } from 'inversify';
import { IBaseRepository } from '../../domain/repositories/IBaseRepositories';

@injectable()
export abstract class BaseRepositoryImp<T, D extends Document> implements IBaseRepository<T> {
  protected model: Model<D>;

  constructor(model: Model<D>) {
    this.model = model;
  }
  protected mapDbToDomain(dbObj: unknown): T {
    if (!dbObj) return null as T;
    const obj = typeof dbObj === 'object' && dbObj !== null && 'toObject' in dbObj 
      ? (dbObj as { toObject: (options?: unknown) => Record<string, unknown> }).toObject({ versionKey: false }) 
      : dbObj as Record<string, unknown>;

    const { _id, ...rest } = obj;
    return {
      ...rest,
      id: obj.id ?? _id?.toString(),
    } as T;
  }
  protected mapDbArrayToDomain(docs: unknown[]): T[] {
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
    const dbItem = await this.model.findByIdAndUpdate(id, item as unknown as Record<string, unknown>, {
      new: true,
    });
    return this.mapDbToDomain(dbItem);
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
