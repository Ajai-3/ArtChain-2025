import { UpdateArtPostDTO } from '../../dto/art/UpdateArtPostDTO';

export interface IUpdateArtPostUseCase {
  execute(dto: UpdateArtPostDTO): Promise<any>;
}
