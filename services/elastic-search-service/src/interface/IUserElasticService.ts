import { IndexedUser } from "./indexUser";

export interface IUserElasticService {
  addUser(user: IndexedUser): Promise<void>;
  updateUser(user: IndexedUser): Promise<void>;
  searchForUser(query: string): Promise<IndexedUser[]>;
  adminSearch(query: string): Promise<string[]>;
}
