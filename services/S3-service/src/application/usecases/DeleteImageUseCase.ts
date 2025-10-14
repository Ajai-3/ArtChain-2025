import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { DeleteImageRequestDTO } from "../interface/dto/DeleteImageRequestDTO";
import { IDeleteImageUseCase } from "../interface/usecases/IDeleteImageUseCase";

@injectable()
export class DeleteImageUseCase implements IDeleteImageUseCase {
  constructor(
    @inject(TYPES.IFileRepository) private readonly _fileRepo: IFileRepository
  ) {}
  async execute(request: DeleteImageRequestDTO): Promise<void> {
    const { fileUrl, category } = request;
    return await this._fileRepo.delete(fileUrl, category);
  }
}
