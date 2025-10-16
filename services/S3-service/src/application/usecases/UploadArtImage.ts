import { inject, injectable } from "inversify";
import { FILE_CATEGORIES } from "../../types/FileCategory";
import { TYPES } from "../../infrastructure/inversify/types";
import { UploadFileDTO } from "../interface/dto/UploadFileDTO";
import { UploadedFileDTO } from "../interface/dto/UploadedFileDTO";
import { IUploadArtImage } from "../interface/usecases/IUploadArtImage";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { FileHashService } from "../../presentation/service/FileHashService";
import { WatermarkService } from "../../presentation/service/WatermarkService";

@injectable()
export class UploadArtImage implements IUploadArtImage {
  constructor(
    @inject(TYPES.IFileRepository) private readonly _fileRepo: IFileRepository
  ) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const { fileBuffer, fileName, mimeType, userId } = data;

    const hash = FileHashService.generateHash(fileBuffer);

    // const { previewBuffer, watermarkedBuffer } =
    //   await WatermarkService.processAndSave(fileBuffer, userId, fileName);
    const { previewBuffer, watermarkedBuffer } = await WatermarkService.process(
      fileBuffer
    );

    const uploadResult = await this._fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      FILE_CATEGORIES.art,
      userId,
      previewBuffer,
      watermarkedBuffer
    );

    return {
      originalUrl: uploadResult.privateSignedUrl!,
      previewUrl: uploadResult.publicPreviewUrl!,
      watermarkedUrl: uploadResult.publicWatermarkedUrl!,
      hash,
      userId,
      type: FILE_CATEGORIES.art,
    };
  }
}
