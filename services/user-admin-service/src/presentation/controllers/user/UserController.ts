
import { Request, Response, NextFunction } from 'express';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user/UserRepositoryImpl';

export class UserController {
      private userRepo: UserRepositoryImpl;
    
      constructor() {
        this.userRepo = new UserRepositoryImpl();
      }

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