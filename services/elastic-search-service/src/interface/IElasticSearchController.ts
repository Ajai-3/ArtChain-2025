import { Request, Response, NextFunction } from "express";

export interface IElasticSearchController {
  search(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
