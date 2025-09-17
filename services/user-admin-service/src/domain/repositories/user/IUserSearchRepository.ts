export interface IUserSearchRepository {
  searchUserIds(query: string): Promise<string[]>;
}
