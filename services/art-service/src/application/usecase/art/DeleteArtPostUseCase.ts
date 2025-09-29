import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IDeleteArtPostUseCase } from "../../interface/usecase/art/IDeleteArtPostUseCase";



export class DeleteArtPostUseCase implements IDeleteArtPostUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}

  async execute(id: string): Promise<void> {
    await this._artRepo.delete(id);
  }
}
