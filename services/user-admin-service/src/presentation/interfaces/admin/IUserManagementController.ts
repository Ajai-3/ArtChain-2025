import { Request, Response, NextFunction } from 'express';

export interface IUserManageMentController {
  getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void>
  banOrUnbanUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
  getAllArtistRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}
