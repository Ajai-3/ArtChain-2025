export interface IElasticSearchService {
    searchUserIds(query: string): Promise<string[]>;
}