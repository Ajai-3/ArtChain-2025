import { FileCategory } from "../../types/FileCategory";

export interface UploadedFileDTO {
  url: string;
  userId: string;
  type: FileCategory;
}