import { Request, Response, NextFunction } from 'express';
import { ISecurityController } from '../../interfaces/user/ISecurityController';
import { logger } from '../../../utils/logger';
import { validateWithZod } from '../../../utils/zodValidator';
import { currentPasswordNewPasswordSchema } from '../../../application/validations/user/CurrentPasswordNewPasswordSchema';
import { ChangePasswordRequestDto } from '../../../domain/dtos/user/auth/ChangePasswordRequestDto';
import { ChangePasswordUserUseCase } from '../../../application/usecases/user/security/ChangePasswordUserUseCase';
import { HttpStatus } from 'art-chain-shared';

export class SecurityController implements ISecurityController {
  constructor(
    private readonly _changePasswordUserUseCase: ChangePasswordUserUseCase
  ) {}

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      logger.info(`Changing password for user: ${userId}`);

      const result = validateWithZod(
        currentPasswordNewPasswordSchema,
        req.body
      );
      const { currentPassword, newPassword } = result;

      const dto: ChangePasswordRequestDto = {
        userId,
        currentPassword,
        newPassword,
      };

      await this._changePasswordUserUseCase.execute(dto);

      logger.info(`${userId} user password changed`);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Password changed successfully' });
    } catch (err) {
      next(err);
    }
  };

  changeEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { newEmail } = req.body;
      logger.info(`Changing email for user: ${userId} to ${newEmail}`);

      res.status(HttpStatus.OK).json({ message: 'Email changed successfully' });
    } catch (err) {
      next(err);
    }
  };

  deactivateAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      logger.info(`Deactivating account for user: ${userId}`);

      // TODO: call service/repo here
      res
        .status(HttpStatus.OK)
        .json({ message: 'Account deactivated successfully' });
    } catch (err) {
      next(err);
    }
  };
}
