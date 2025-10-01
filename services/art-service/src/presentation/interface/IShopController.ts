import { Request, Response, NextFunction } from "express";

export interface IShopController {
     getAllShopItems(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
     getShopItemsByUser(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}