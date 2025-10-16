import { injectable } from "inversify";
import { IBaseRepository } from "../../domain/repository/IBaseRepository";

@injectable()
export abstract class BaseRepositoryImpl<T> implements IBaseRepository<T> {
  protected abstract model: any;

  create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  update(where: any, data: Partial<T>): Promise<T> {
    return this.model.update({ where, data });
  }

  delete(where: any): Promise<void> {
    return this.model.delete({ where });
  }
}
