import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { GetAllUsersQueryDTO } from "../../../interface/dtos/admin/GetAllUsersQueryDTO";
import { IGetAllUsersUseCase } from "../../../interface/usecases/admin/user-management/IGetAllUsersUseCase";
import { IUserSearchRepository } from "../../../../domain/repositories/user/IUserSearchRepository";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private _userRepo: IUserRepository, private readonly _searchRepo: IUserSearchRepository) {}

  async execute(query: GetAllUsersQueryDTO): Promise<any> {
    const { page = 1, limit = 10, search, role, status, plan } = query;

   let userIds: string[] | undefined;
    if (search) {
      userIds = await this._searchRepo.searchUserIds(search);
    }

    if (userIds && userIds.length > 0) {
      return this._userRepo.findManyByIds(userIds, page, limit, {
        role,
        status,
        plan,
      });
    }

    return this._userRepo.findAllUsers({ page, limit, role, status, plan });
  }
}
