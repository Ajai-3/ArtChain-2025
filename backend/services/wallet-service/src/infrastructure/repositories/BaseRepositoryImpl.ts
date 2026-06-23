import { injectable } from 'inversify';
import { IBaseRepository } from '../../domain/repository/IBaseRepository';

@injectable()
export abstract class BaseRepositoryImpl<T> implements IBaseRepository<T> {
  protected abstract model: {
    create(params: { data: unknown }): Promise<unknown>;
    update(params: { where: unknown; data: unknown }): Promise<unknown>;
    delete(params: { where: unknown }): Promise<unknown>;
  };

  create(data: Partial<T>): Promise<T> {
    return this.model.create({ data }) as Promise<T>;
  }

  update(where: unknown, data: Partial<T>): Promise<T> {
    return this.model.update({ where, data }) as Promise<T>;
  }

  delete(where: unknown): Promise<void> {
    return this.model.delete({ where }) as Promise<void>;
  }
}
