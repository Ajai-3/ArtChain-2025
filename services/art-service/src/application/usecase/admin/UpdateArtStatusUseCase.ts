import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IUpdateArtStatusUseCase } from "../../interface/usecase/admin/IUpdateArtStatusUseCase";
import { UpdateArtStatusDTO } from "../../interface/dto/admin/UpdateArtStatusDTO";

@injectable()
export class UpdateArtStatusUseCase implements IUpdateArtStatusUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository) private _repository: IArtPostRepository
  ) {}

  async execute(dto: UpdateArtStatusDTO) {
    return this._repository.updateStatus(dto.id, dto.status);
  }
}
