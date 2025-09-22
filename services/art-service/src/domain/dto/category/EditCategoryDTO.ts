export interface EditCategoryDTO {
  id: string;
  name?: string;
  count?: number;
  status?: "active" | "inactive";
}
