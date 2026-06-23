import { injectable } from 'inversify';
import { IBaseRepository } from '../../domain/repositories/IBaseRepository';
import { PrismaModelDelegate } from '../../types/repository.types';

@injectable()
export abstract class BaseRepositoryImpl<T, S = T> implements IBaseRepository<
  T,
  S
> {
  protected abstract model: PrismaModelDelegate;

  protected toSafe(entity: unknown): S {
    return entity as unknown as S;
  }

  async create(data: Partial<T>): Promise<S> {
    const res = await this.model.create({
      data: data as Record<string, unknown>,
    });
    return this.toSafe(res as T);
  }

  async update(id: string, data: Partial<T>): Promise<S | null> {
    const res = await this.model.update({
      where: { id },
      data: data as Record<string, unknown>,
    });
    return res ? this.toSafe(res as T) : null;
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
    return res ? this.toSafe(res as T) : null;
  }

  async findAll(): Promise<S[]> {
    const res = await this.model.findMany({});
    return res.map((item: Record<string, unknown>) => this.toSafe(item));
  }
}
