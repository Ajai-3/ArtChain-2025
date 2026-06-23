import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IUpdateArtStatusUseCase } from '../../interface/usecase/admin/IUpdateArtStatusUseCase';
import { UpdateArtStatusDTO } from '../../interface/dto/admin/UpdateArtStatusDTO';
import type { UpdateArtStatusResponse } from '../../../types/usecase-response';

@injectable()
export class UpdateArtStatusUseCase implements IUpdateArtStatusUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository) private _repository: IArtPostRepository
  ) {}

  async execute(dto: UpdateArtStatusDTO): Promise<UpdateArtStatusResponse> {
    const result = await this._repository.updateStatus(dto.id, dto.status);
    return { message: result ? 'Art status updated successfully' : 'Failed to update art status' };
  }
}
