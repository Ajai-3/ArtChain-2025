import { UpdateArtPostDTO } from "../../dto/art/UpdateArtPostDTO";

export interface IUpdateArtPostUseCase {
  execute(id: string, dto: UpdateArtPostDTO): Promise<any>;
}
