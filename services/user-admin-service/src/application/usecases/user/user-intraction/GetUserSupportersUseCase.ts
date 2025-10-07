import { inject, injectable } from 'inversify';
import { UserPreview } from '../../../../types/UserPreview';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../../../domain/repositories/user/ISupporterRepository';
import { IGetUserSupportersUseCase } from '../../../interface/usecases/user/user-intraction/IGetUserSupportersUseCase';

@injectable()
export class GetUserSupportersUseCase implements IGetUserSupportersUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(userId: string, page = 1, limit = 10): Promise<UserPreview[]> {
    return this._supporterRepo.getSupporters(userId, page, limit);
  }
}
