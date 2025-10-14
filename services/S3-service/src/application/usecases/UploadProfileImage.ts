import { UploadedFileDTO } from "../../domain/dto/UploadedFileDTO";
import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { IUploadProfileImage } from "../../domain/usecases/IUploadProfileImage";
import { FILE_CATEGORIES } from "../../types/FileCategory";

export class UploadProfileImage implements IUploadProfileImage {
  constructor(private readonly _fileRepo: IFileRepository) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const { fileBuffer, fileName, mimeType, userId, previousFileUrl } = data;

    if (previousFileUrl) {
      try {
        console.log("delete called")
        await this._fileRepo.delete(previousFileUrl, FILE_CATEGORIES.profile);
      } catch (err) {
        console.warn("Failed to delete previous profile image:", err);
      }
    }

    console.log(previousFileUrl)

    const uploadResult = await this._fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      FILE_CATEGORIES.profile,
      userId
    );
    return {
      url: uploadResult.publicUrl,
      userId,
      type: FILE_CATEGORIES.profile,
    };
  }
}
