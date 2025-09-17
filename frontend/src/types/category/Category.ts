export interface Category {
  _id: string;
  name: string;
  count: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}