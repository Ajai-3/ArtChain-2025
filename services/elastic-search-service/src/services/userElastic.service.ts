import { TYPES } from "../invectify/types";
import { inject, injectable } from "inversify";
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
    return await this._repo.searchUsers(query);
  }

  async adminSearch(query: string): Promise<string[]> {
    const results = await this._repo.searchUsers(query);
    // admin needs fresh data, so only return IDs
    return results.map((user) => user.id);
  }
}
