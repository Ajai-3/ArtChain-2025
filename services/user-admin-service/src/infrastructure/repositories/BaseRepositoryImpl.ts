import { injectable } from 'inversify';
import { SafeUser } from '../../domain/repositories/IBaseRepository';
@injectable()
export abstract class BaseRepositoryImpl {
  protected abstract model: any;

  protected toSafeUser(user: any): SafeUser {
    const { password, ...safe } = user;
    return safe;
  }

  async create(data: any): Promise<SafeUser> {
    const { id, ...dataWithoutId } = data;
    const user = await this.model.create({ data: dataWithoutId });
    return this.toSafeUser(user);
  }

  async update(id: string, data: any): Promise<SafeUser | null> {
    const updated = await this.model.update({ where: { id }, data });
    return updated ? this.toSafeUser(updated) : null;
  }
}