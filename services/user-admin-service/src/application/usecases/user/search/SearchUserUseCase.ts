import { IndexedUser } from "../../../../types/IndexedUser";
import { searchUsersByName } from "./../../../../presentation/service/elasticUser.service";

export class SearchUserUseCase {
  searchUsers = async (query: string): Promise<IndexedUser[]> => {
    const users = await searchUsersByName(query);
    console.log(`Found ${users.length} users for query "${query}" ${users}`);
    return users;
  };
}
