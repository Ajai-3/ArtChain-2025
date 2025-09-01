import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { IFileRepository } from "../../domain/repositories/IFileRepository";

export class UploadProfileImage {
  constructor(private fileRepo: IFileRepository) {}

  async execute(data: UploadFileDTO) {
    const { fileBuffer, fileName, mimeType, userId } = data;
    const url = await this.fileRepo.upload(
      fileBuffer,
      fileName,
      mimeType,
      "profile"
    );
    return { url, userId, type: "profile" };
  }
}
