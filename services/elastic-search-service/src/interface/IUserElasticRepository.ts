import { IndexedUser } from "../interface/indexUser";

export interface IUserElasticRepository {
  indexUser(user: IndexedUser): Promise<void>;
  updateUser(user: IndexedUser): Promise<void>;
  searchUsers(query: string): Promise<IndexedUser[]>;
}
