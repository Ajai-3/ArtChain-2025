import { S3FileRepository } from "../../infrastructure/repositories/S3FileRepository";
import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { UploadedFileDTO } from "../../domain/dto/UploadedFileDTO";
import { FILE_CATEGORIES } from "../../types/FileCategory";
import { WatermarkService } from "../../presentation/service/WatermarkService";
import { FileHashService } from "../../presentation/service/FileHashService";
import { IUploadArtImage } from "../../domain/usecases/IUploadArtImage";

export class UploadArtImage implements IUploadArtImage {
  constructor(private readonly _fileRepo: S3FileRepository) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const { fileBuffer, fileName, mimeType, userId } = data;

    const hash = FileHashService.generateHash(fileBuffer);


    // const { previewBuffer, watermarkedBuffer } =
    //   await WatermarkService.processAndSave(fileBuffer, userId, fileName);
const { previewBuffer, watermarkedBuffer } =
  await WatermarkService.process(fileBuffer);

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
