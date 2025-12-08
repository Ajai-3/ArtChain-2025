import { inject, injectable } from "inversify";
import { IGetSignedUrlUseCase } from "../../interface/usecases/IGetSignedUrlUseCase";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IFileRepository } from "../../../domain/repositories/IFileRepository";
import { FileCategory } from "../../../types/FileCategory";

@injectable()
export class GetSignedUrlUseCase implements IGetSignedUrlUseCase {
  constructor(
    @inject(TYPES.IFileRepository) private readonly _fileRepository: IFileRepository
  ) {}

  async execute(key: string, category: FileCategory): Promise<string> {
    return this._fileRepository.getSignedUrl(key, category);
  }
}
