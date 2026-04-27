import { GetAllArtResponse } from '../../../../types/usecase';

export interface IGetAllArtUseCase {
  execute(
    page: number,
    limit: number,
    currentUserId: string,
    categoryId?: string,
  ): Promise<GetAllArtResponse>;
}
