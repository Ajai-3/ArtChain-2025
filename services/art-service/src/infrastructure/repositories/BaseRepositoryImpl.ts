import mongoose from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";

export class BaseRepositoryImpl<T> implements IBaseRepository<T> {
  private model: mongoose.Model<any>;

  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  async create(entity: T): Promise<T> {
    const created = await this.model.create(entity);
    return created.toObject() as T;
  }

  async getById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).lean();
    return doc as T | null;
  }

  async getAll(page = 1, limit = 10): Promise<T[]> {
    const docs = await this.model
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return docs as T[];
  }

  async update(id: string, entity: Partial<T>): Promise<T> {
    const updated = await this.model
      .findOneAndUpdate({ id }, entity, { new: true })
      .lean();
    if (!updated) throw new Error("Document not found");
    return updated as T;
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ id });
  }
}
