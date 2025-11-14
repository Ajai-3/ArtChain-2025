import { FileCategory } from "../../../types/FileCategory";

export interface DeleteImageRequestDTO {
  fileUrl: string;
  userId: string;
  category: FileCategory;
}
