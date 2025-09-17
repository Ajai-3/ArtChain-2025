import { UserElasticRepository } from "../repositories/userElastic.repository";
import { IndexedUser } from "../interface/indexUser";
import { IUserElasticService } from "../interface/IUserElasticService";

const repo = new UserElasticRepository();

export class UserElasticService implements IUserElasticService {
  async addUser(user: IndexedUser) {
    await repo.indexUser(user);
  }

  async updateUser(user: IndexedUser) {
    await repo.updateUser(user);
  }

  async searchForUser(query: string): Promise<IndexedUser[]> {
    return await repo.searchUsers(query);
  }

  async adminSearch(query: string): Promise<string[]> {
    const results = await repo.searchUsers(query);
    // admin needs fresh data, so only return IDs
    return results.map((user) => user.id);
  }
}
