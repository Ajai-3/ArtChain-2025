import { DeleteImageRequestDTO } from "../../domain/dto/DeleteImageRequestDTO";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { IDeleteImageUseCase } from "../../domain/usecases/IDeleteImageUseCase";
import { FILE_CATEGORIES } from "../../types/FileCategory";

export class DeleteImageUseCase implements IDeleteImageUseCase {
      constructor(private readonly _fileRepo: IFileRepository) {}
  async execute(request: DeleteImageRequestDTO): Promise<void> {
    const { fileUrl, category } = request;
    return await this._fileRepo.delete(fileUrl, category);
  }
}
