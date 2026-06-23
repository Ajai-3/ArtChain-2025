import { inject, injectable } from 'inversify';
import { FILE_CATEGORIES } from '../../types/FileCategory';
import { TYPES } from '../../infrastructure/inversify/types';
import { UploadFileDTO } from '../interface/dto/UploadFileDTO';
import { UploadedFileDTO } from '../interface/dto/UploadedFileDTO';
import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { IUploadCommissionImageUseCase } from '../interface/usecases/IUploadCommissionImageUseCase';

@injectable()
export class UploadCommissionImageUseCase implements IUploadCommissionImageUseCase {
  constructor(
    @inject(TYPES.IFileRepository) private readonly _fileRepo: IFileRepository,
  ) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const { fileBuffer, fileName, mimeType, userId, category } = data;

    const uploadResult = await this._fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      FILE_CATEGORIES[category as keyof typeof FILE_CATEGORIES],
      userId,
    );

    return {
      url: uploadResult.publicUrl,
      userId,
      type: FILE_CATEGORIES[category as keyof typeof FILE_CATEGORIES],
      key: uploadResult.key,
    };
  }
}
