import { CreateArtPostDTO } from '../../dto/art/CreateArtPostDTO';
import type { CreateArtPostResponse } from '../../../../types/usecase-response';

export interface ICreateArtPostUseCase {
  execute(dto: CreateArtPostDTO): Promise<CreateArtPostResponse>;
}
