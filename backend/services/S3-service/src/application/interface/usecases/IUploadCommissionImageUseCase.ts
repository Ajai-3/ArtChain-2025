import { UploadedFileDTO } from '../dto/UploadedFileDTO';
import { UploadFileDTO } from '../dto/UploadFileDTO';

export interface IUploadCommissionImageUseCase {
  execute(data: UploadFileDTO): Promise<UploadedFileDTO>;
}