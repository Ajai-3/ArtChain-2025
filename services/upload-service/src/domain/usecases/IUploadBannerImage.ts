import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { UploadedFileDTO } from "../../domain/dto/UploadedFileDTO";

export interface IUploadBannerImage {
  execute(data: UploadFileDTO): Promise<UploadedFileDTO>;
}
