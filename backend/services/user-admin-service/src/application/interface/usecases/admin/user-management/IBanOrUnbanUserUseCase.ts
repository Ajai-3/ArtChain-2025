import { SafeUser } from '../../../../../domain/entities/User';

export interface IBanOrUnbanUserUseCase {
  execute(userId: string): Promise<{ action: string; user: SafeUser }>;
}
