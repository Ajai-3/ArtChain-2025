import { SafeUser } from "../../../../../domain/repositories/IBaseRepository";

export interface IBanOrUnbanUserUseCase {
  execute(userId: string): Promise<SafeUser>;
}
