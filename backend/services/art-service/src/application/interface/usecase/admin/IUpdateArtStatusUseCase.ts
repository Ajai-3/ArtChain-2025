import { UpdateArtStatusDTO } from '../../dto/admin/UpdateArtStatusDTO';
import type { UpdateArtStatusResponse } from '../../../../types/usecase-response';

export interface IUpdateArtStatusUseCase {
  execute(dto: UpdateArtStatusDTO): Promise<UpdateArtStatusResponse>;
}
