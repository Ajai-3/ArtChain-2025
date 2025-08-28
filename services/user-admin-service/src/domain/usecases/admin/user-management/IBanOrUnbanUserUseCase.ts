import { SafeUser } from '../../../repositories/IBaseRepository';

export interface IBanOrUnbanUserUseCase {
  execute(userId: string): Promise<SafeUser>;
}
