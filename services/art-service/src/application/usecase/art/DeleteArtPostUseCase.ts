import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/invectify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IDeleteArtPostUseCase } from "../../interface/usecase/art/IDeleteArtPostUseCase";

@injectable()
export class DeleteArtPostUseCase implements IDeleteArtPostUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this._artRepo.delete(id);
  }
}
