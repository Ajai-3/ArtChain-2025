import { inject, injectable } from "inversify";
import { FILE_CATEGORIES } from "../../types/FileCategory";
import { TYPES } from "../../infrastructure/inversify/types";
import { UploadFileDTO } from "../interface/dto/UploadFileDTO";
import { UploadedFileDTO } from "../interface/dto/UploadedFileDTO";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { IUploadImageUseCase } from "../interface/usecases/IUploadImageUseCase";
import { publishNotification } from "../../infrastructure/rabbitmq/rabbitmq";

@injectable()
export class UploadImageUseCase implements IUploadImageUseCase {
  constructor(
    @inject(TYPES.IFileRepository) private readonly _fileRepo: IFileRepository
  ) {}

  async execute(data: UploadFileDTO): Promise<UploadedFileDTO> {
    const {
      fileBuffer,
      fileName,
      mimeType,
      userId,
      previousFileUrl,
      category,
    } = data;

    if (previousFileUrl) {
      try {
        console.log("delete called");
        await this._fileRepo.delete(previousFileUrl, category);
      } catch (err) {
        console.warn("Failed to delete previous profile image:", err);
      }
    }

    console.log(previousFileUrl);

    const uploadResult = await this._fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      FILE_CATEGORIES[category as keyof typeof FILE_CATEGORIES],
      userId
    );

    if (category === "profile" || category === "banner" || category === "background") {
      await publishNotification("user.profile_update", {
        payload: {
          userId: userId,
          category,
          key: uploadResult.key,
        },
      });
    }

    return {
      url: uploadResult.publicUrl,
      userId,
      type: FILE_CATEGORIES[category as keyof typeof FILE_CATEGORIES],
      key: uploadResult.key,
    };
  }
}
