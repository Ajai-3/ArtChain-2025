import { injectable } from 'inversify';
import { IBaseRepository } from '../../domain/repositories/IBaseRepository';

@injectable()
export abstract class BaseRepositoryImpl<T, S = T> implements IBaseRepository<T, S> {
  protected abstract model: any;

  protected toSafe(entity: T): S {
    return entity as unknown as S;
  }

  async create(data: Partial<T>): Promise<S> {
    const res = await this.model.create({ data });
    return this.toSafe(res);
  }

  async update(id: string, data: Partial<T>): Promise<S | null> {
    const res = await this.model.update({ where: { id }, data });
    return res ? this.toSafe(res) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findById(id: string): Promise<S | null> {
    const res = await this.model.findUnique({ where: { id } });
    return res ? this.toSafe(res) : null;
  }

  async findAll(): Promise<S[]> {
    const res = await this.model.findMany();
    return res.map((item: T) => this.toSafe(item));
  }
}