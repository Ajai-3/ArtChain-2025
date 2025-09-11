import { CreateArtPostDTO } from "../../dto/CreateArtPostDTO";


export interface ICreateArtPostUseCase {
  execute(dto: CreateArtPostDTO): Promise<any>;
}
