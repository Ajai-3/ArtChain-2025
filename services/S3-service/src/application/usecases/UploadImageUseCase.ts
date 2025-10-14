import { UploadedFileDTO } from "../../domain/dto/UploadedFileDTO";
import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { FILE_CATEGORIES } from "../../types/FileCategory";

export class UploadImageUseCase {
constructor(private readonly _fileRepo: IFileRepository) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const { fileBuffer, fileName, mimeType, userId, previousFileUrl, category } = data;

    if (previousFileUrl) {
      try {
        console.log("delete called")
        await this._fileRepo.delete(previousFileUrl, category);
      } catch (err) {
        console.warn("Failed to delete previous profile image:", err);
      }
    }

    console.log(previousFileUrl)

    const uploadResult = await this._fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      FILE_CATEGORIES[category],
      userId
    );
    return {
      url: uploadResult.publicUrl,
      userId,
      type: FILE_CATEGORIES[category],
    };
  }
}