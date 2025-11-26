import { UpdateArtStatusDTO } from "../../dto/admin/UpdateArtStatusDTO";

export interface IUpdateArtStatusUseCase {
  execute(dto: UpdateArtStatusDTO): Promise<any>;
}
