import { FILE_CATEGORIES } from './../../types/FileCategory';
import { UploadFileDTO } from '../../domain/dto/UploadFileDTO';
import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { UploadedFileDTO } from '../../domain/dto/UploadedFileDTO';

export class UploadBannerImage {
  constructor(private readonly _fileRepo: IFileRepository) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const { fileBuffer, fileName, mimeType, userId } = data;
    const url = await this._fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      FILE_CATEGORIES.banner,
      userId
    );
    return { url, userId, type: FILE_CATEGORIES.banner };
  }
}
