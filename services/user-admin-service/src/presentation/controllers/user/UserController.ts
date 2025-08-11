
import { Request, Response, NextFunction } from 'express';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user/UserRepositoryImpl';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class UserController {
  constructor(private readonly userRepo: IUserRepository) {}

      getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            
        } catch (error) {
            next(error);
        }
      };

      getUserProfileWithId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            
        } catch (error) {
            next(error);
        }
      };

}