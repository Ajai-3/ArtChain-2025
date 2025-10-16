import { UploadFileDTO } from "../dto/UploadFileDTO";
import { UploadedFileDTO } from "../dto/UploadedFileDTO";

export interface IUploadImageUseCase {
  execute(data: UploadFileDTO): Promise<UploadedFileDTO>;
}
