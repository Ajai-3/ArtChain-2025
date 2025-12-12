import { FileCategory } from "../../../types/FileCategory";

export interface IGetSignedUrlUseCase {
  execute(key: string, category: FileCategory): Promise<string>;
}
