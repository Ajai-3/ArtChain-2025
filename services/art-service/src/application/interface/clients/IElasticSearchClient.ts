export interface IElasticSearchClient {
    searchArts(query: string): Promise<string[]>;
}