import { FileCategory } from "../../types/FileCategory";

export interface DeleteImageRequestDTO {
  fileUrl: string;
  category: FileCategory;
}
