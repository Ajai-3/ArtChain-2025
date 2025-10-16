export interface IArtToElasticSearchUseCase {
  execute(art: any): Promise<any>;
}
