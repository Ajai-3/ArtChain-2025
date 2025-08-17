import { User } from '../../domain/entities/User';
import { SafeUser } from '../../domain/repositories/IBaseRepository';

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

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.model.findUnique({ where: { id } });
    return user ? this.toSafeUser(user) : null;
  }

  async findByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.model.findUnique({ where: { email } });
    return user ? this.toSafeUser(user) : null;
  }

  async findByUsername(username: string): Promise<SafeUser | null> {
    const user = await this.model.findUnique({ where: { username } });
    return user ? this.toSafeUser(user) : null;
  }

  async findByUsernameRaw(username: string): Promise<User | null> {
    return this.model.findUnique({ where: { username } });
  }

  async findByEmailRaw(email: string): Promise<User | null> {
    return this.model.findUnique({ where: { email } });
  }

  async findByIdRaw(id: string): Promise<User | null> {
    return this.model.findUnique({ where: { id } });
  }

  async update(id: string, data: any): Promise<SafeUser | null> {
    const updated = await this.model.update({ where: { id }, data });
    return updated ? this.toSafeUser(updated) : null;
  }
}