import { UploadFileDTO } from "../dto/UploadFileDTO";
import { UploadedFileDTO } from "../dto/UploadedFileDTO";

export interface IUploadArtImage {
  execute(data: UploadFileDTO): Promise<UploadedFileDTO>;
}
