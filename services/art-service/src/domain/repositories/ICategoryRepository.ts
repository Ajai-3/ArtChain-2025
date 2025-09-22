import { Category } from "../entities/Category";
import { IBaseRepository } from "./IBaseRepository";

export interface ICategoryRepository extends IBaseRepository<Category> {
    findByName(name: string): Promise<any>,
   getAllCategory( page: number,
    limit: number,
    search?: string,
    status?: string, 
    countFilter?: number): Promise<{data: Category[], total: number}>
}