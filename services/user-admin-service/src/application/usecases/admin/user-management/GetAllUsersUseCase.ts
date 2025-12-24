import { inject, injectable } from "inversify";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { GetAllUsersQueryDto } from "../../../interface/dtos/admin/GetAllUsersQueryDto";
import { IElasticSearchService } from "../../../interface/http/IElasticSearchService";
import { IGetAllUsersUseCase } from "../../../interface/usecases/admin/user-management/IGetAllUsersUseCase";
import { mapCdnUrl } from "../../../../utils/mapCdnUrl";

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IElasticSearchService)
    private readonly _elasticSearchService: IElasticSearchService
  ) {}

  async execute(query: GetAllUsersQueryDto): Promise<any> {
    const { page = 1, limit = 10, search, role, status, plan } = query;

    let userIds: string[] | undefined;
    if (search) {
      userIds = await this._elasticSearchService.searchUserIds(search);
    }

    if (userIds && userIds.length > 0) {
      const users = await this._userRepo.findManyByIds(userIds, page, limit, {
        role,
        status,
        plan,
      });

      return {
        ...users,
        data: users.data.map((user: any) => ({
          ...user,
          profileImage: mapCdnUrl(user.profileImage) ?? null,
          bannerImage: mapCdnUrl(user.bannerImage) ?? null,
          backgroundImage: mapCdnUrl(user.backgroundImage) ?? null,
        })),
      };
    }

    const users = await this._userRepo.findAllUsers({
      page,
      limit,
      role,
      status,
      plan,
    });

    return {
      ...users,
      data: users.data.map((user: any) => ({
        ...user,
        profileImage: mapCdnUrl(user.profileImage) ?? null,
        bannerImage: mapCdnUrl(user.bannerImage) ?? null,
        backgroundImage: mapCdnUrl(user.backgroundImage) ?? null,
      })),
    };
  }
}
