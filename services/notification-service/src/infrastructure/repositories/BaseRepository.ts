import { injectable, unmanaged } from "inversify";
import { Model, Document } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";

@injectable()
export abstract class BaseRepository<T, TDoc extends Document> implements IBaseRepository<T> {
  protected _model: Model<TDoc>;

  constructor(@unmanaged() model: Model<TDoc>) {
    this._model = model;
  }

  async create(item: T | any): Promise<T> {
    const createdItem = await this._model.create(item);
    return this.toDomain(createdItem);
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    const updatedItem = await this._model.findByIdAndUpdate(
      id,
      item as any,
      { new: true }
    ).exec();
    return updatedItem ? this.toDomain(updatedItem) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this._model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findById(id: string): Promise<T | null> {
    const item = await this._model.findById(id);
    return item ? this.toDomain(item) : null;
  }

  protected abstract toDomain(doc: TDoc): T;
}
