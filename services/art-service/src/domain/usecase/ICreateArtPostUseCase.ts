import { CreateArtPostDTO } from "../../domain/dto/CreateArtPostDTO";

export interface ICreateArtPostUseCase {
  execute(dto: CreateArtPostDTO): Promise<any>;
}
