import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { IFileRepository } from "../../domain/repositories/IFileRepository";

export class UploadBannerImage {
  constructor(private fileRepo: IFileRepository) {}

  async execute(data: UploadFileDTO) {
    const { fileBuffer, fileName, mimeType, userId } = data;
    const url = await this.fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      "banner"
    );
    return { url, userId, type: "banner" };
  }
}
