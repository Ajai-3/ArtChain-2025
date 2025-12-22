import { SafeUser } from '../../../../../domain/entities/User';

export interface IBanOrUnbanUserUseCase {
  execute(userId: string): Promise<SafeUser>;
}
