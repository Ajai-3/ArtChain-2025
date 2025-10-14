import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { UploadedFileDTO } from "../../domain/dto/UploadedFileDTO";

export interface IUploadProfileImage {
  execute(data: UploadFileDTO): Promise<UploadedFileDTO>;
}
