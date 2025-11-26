import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAdminArtRepository } from "../../../domain/repositories/IAdminArtRepository";
import { IUpdateArtStatusUseCase } from "../../interface/usecase/admin/IUpdateArtStatusUseCase";
import { UpdateArtStatusDTO } from "../../interface/dto/admin/UpdateArtStatusDTO";

@injectable()
export class UpdateArtStatusUseCase implements IUpdateArtStatusUseCase {
  constructor(
    @inject(TYPES.IAdminArtRepository) private _repository: IAdminArtRepository
  ) {}

  async execute(dto: UpdateArtStatusDTO) {
    return this._repository.updateStatus(dto.id, dto.status);
  }
}
