import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { GetAllUsersQueryDTO } from '../../../../domain/dtos/admin/GetAllUsersQueryDTO';
import { searchUsersByName } from '../../../../presentation/service/elasticUser.service';
import { IGetAllUsersUseCase } from '../../../../domain/usecases/admin/user-management/IGetAllUsersUseCase';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(query: GetAllUsersQueryDTO): Promise<any> {
    const { search, page = 1, limit = 10 } = query;

    console.log(query);

    if (search) {
      const indexedResults = await searchUsersByName(search);
      const userIds = indexedResults.map((user) => user.id);

      return this._userRepo.findManyByIds(userIds, page, limit);
    } else {
      return this._userRepo.findAllUsers({ page, limit });
    }
  }
}
