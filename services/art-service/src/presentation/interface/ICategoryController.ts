import { Request, Response, NextFunction } from "express";

export interface ICategoryController {
  getCategory: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  createCategory: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  editCategory: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
