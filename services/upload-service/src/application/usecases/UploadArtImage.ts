import { UploadedFileDTO } from "../../domain/dto/UploadedFileDTO";
import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { FILE_CATEGORIES } from "../../types/FileCategory";

export class UploadArtImage {
  constructor(private readonly _fileRepo: IFileRepository) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const { fileBuffer, fileName, mimeType, userId } = data;
    const url = await this._fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      FILE_CATEGORIES.art,
      userId
    );
    return { url, userId, type: FILE_CATEGORIES.art };
  }
}
