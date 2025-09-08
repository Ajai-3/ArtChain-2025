import { FILE_CATEGORIES } from './../../types/FileCategory';
import { UploadFileDTO } from '../../domain/dto/UploadFileDTO';
import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { UploadedFileDTO } from '../../domain/dto/UploadedFileDTO';
import { IUploadBannerImage } from '../../domain/usecases/IUploadBannerImage';

export class UploadBannerImage implements IUploadBannerImage {
  constructor(private readonly _fileRepo: IFileRepository) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const { fileBuffer, fileName, mimeType, userId } = data;
    const uploadResult = await this._fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      FILE_CATEGORIES.banner,
      userId
    );
    return { url: uploadResult.publicUrl, userId, type: FILE_CATEGORIES.banner };
  }
}
