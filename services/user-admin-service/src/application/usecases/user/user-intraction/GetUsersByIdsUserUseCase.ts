import { inject, injectable } from 'inversify';
import { ArtUser } from '../../../../types/ArtUser';
import { mapCdnUrl } from '../../../../utils/mapCdnUrl';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { IGetUsersByIdsUserUseCase } from '../../../interface/usecases/user/user-intraction/IGetUsersByIdsUserUseCase';

@injectable()
export class GetUsersByIdsUserUseCase implements IGetUsersByIdsUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository
  ) {}

  async execute(ids: string[]): Promise<ArtUser[]> {
     const users = await this._userRepo.findManyByIdsBatch(ids);

    return users.map(user => ({
      ...user,
      profileImage: mapCdnUrl(user.profileImage) ?? null,
    }));
  }
}
