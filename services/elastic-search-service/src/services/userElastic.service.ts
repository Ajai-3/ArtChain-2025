import { TYPES } from "../Inversify/types";
import { inject, injectable } from "inversify";
import { mapCdnUrl } from "../utils/mapCdnUrl";
import { IndexedUser } from "../interface/indexUser";
import { IUserElasticService } from "../interface/IUserElasticService";
import { IUserElasticRepository } from "../interface/IUserElasticRepository";

@injectable()
export class UserElasticService implements IUserElasticService {
  constructor(
    @inject(TYPES.IUserElasticRepository)
    private readonly _repo: IUserElasticRepository
  ) {}

  async addUser(user: IndexedUser) {
    await this._repo.indexUser(user);
  }

  async updateUser(user: IndexedUser) {
    await this._repo.updateUser(user);
  }

  async searchForUser(query: string): Promise<IndexedUser[]> {
    const results = await this._repo.searchUsers(query);

    return results.map((user) => ({
      ...user,
      profileImage: mapCdnUrl(user.profileImage),
    }));
  }

  async adminSearch(query: string): Promise<string[]> {
    const results = await this._repo.searchUsers(query);
    return results.map((user) => user.id);
  }
}
