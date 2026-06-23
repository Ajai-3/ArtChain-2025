import { FileCategory } from '../../../types/FileCategory';

export interface IGetSignedUrlUseCase {
  execute(
    key: string,
    category: FileCategory,
    fileName: string,
  ): Promise<string>;
}
