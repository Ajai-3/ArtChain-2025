import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { UploadedFileDTO } from "../../domain/dto/UploadedFileDTO";

export interface IUploadArtImage {
  execute(data: UploadFileDTO): Promise<UploadedFileDTO>;
}
