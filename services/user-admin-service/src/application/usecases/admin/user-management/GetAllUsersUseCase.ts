import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { GetAllUsersQueryDTO } from "../../../../domain/dtos/admin/GetAllUsersQueryDTO";
import { IGetAllUsersUseCase } from "../../../../domain/usecases/admin/user-management/IGetAllUsersUseCase";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(query: GetAllUsersQueryDTO): Promise<any> {
    const { page = 1, limit = 10, userIds } = query;

    if (userIds && userIds.length > 0) {
      return this._userRepo.findManyByIds(userIds, page, limit);
    }

    return this._userRepo.findAllUsers({ page, limit });
  }
}
