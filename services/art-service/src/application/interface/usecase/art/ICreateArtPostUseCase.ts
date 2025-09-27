import { CreateArtPostDTO } from "../../dto/art/CreateArtPostDTO";

export interface ICreateArtPostUseCase {
  execute(dto: CreateArtPostDTO): Promise<any>;
}
