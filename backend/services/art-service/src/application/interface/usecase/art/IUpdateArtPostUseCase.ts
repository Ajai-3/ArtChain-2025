import { UpdateArtPostDTO } from '../../dto/art/UpdateArtPostDTO';
import type { UpdateArtPostResponse } from '../../../../types/usecase-response';

export interface IUpdateArtPostUseCase {
  execute(dto: UpdateArtPostDTO): Promise<UpdateArtPostResponse>;
}
