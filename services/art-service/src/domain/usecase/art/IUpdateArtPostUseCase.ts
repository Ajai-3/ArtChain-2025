import { UpdateArtPostDTO } from "../../domain/dto/UpdateArtPostDTO";

export interface IUpdateArtPostUseCase {
  execute(id: string, dto: UpdateArtPostDTO): Promise<any>;
}
