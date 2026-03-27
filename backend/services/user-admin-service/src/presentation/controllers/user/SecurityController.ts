import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { validateWithZod } from '../../../utils/zodValidator';
import { TYPES } from '../../../infrastructure/inversify/types';
import { ILogger } from '../../../application/interface/ILogger';
import { ISecurityController } from '../../interfaces/user/ISecurityController';
import { ChangePasswordRequestDto } from '../../../application/interface/dtos/user/security/ChangePasswordRequestDto';
import { IChangeEmailUserUseCase } from '../../../application/interface/usecases/user/security/IChangeEmailUserUseCase';
import { currentPasswordNewPasswordSchema } from '../../../application/validations/user/CurrentPasswordNewPasswordSchema';
import { IChangePasswordUserUseCase } from '../../../application/interface/usecases/user/security/IChangePasswordUserUseCase';
import { IVerifyEmailTokenUserUseCase } from '../../../application/interface/usecases/user/security/IVerifyEmailTokenUserUseCase';
import { USER_MESSAGES } from '../../../constants/userMessages';

@injectable()
export class SecurityController implements ISecurityController {
  constructor(
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.IChangeEmailUserUseCase)
    private readonly _changeEmailUserUseCase: IChangeEmailUserUseCase,
    @inject(TYPES.IChangePasswordUserUseCase)
    private readonly _changePasswordUserUseCase: IChangePasswordUserUseCase,
    @inject(TYPES.IVerifyEmailTokenUserUseCase)
    private readonly _verifyEmailTokenUserUseCase: IVerifyEmailTokenUserUseCase,
  ) {}

  //# ================================================================================================================
  //# CHANGE PASSWORD
  //# ================================================================================================================
  //# POST /api/v1/user/change-password
  //# Request body: { currentPassword: string, newPassword: string }
  //# This controller changes the password for the authenticated user.
  //# ================================================================================================================
  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      this._logger.info(`Changing password for user: ${userId}`);

      const dto: ChangePasswordRequestDto = {
        ...validateWithZod(currentPasswordNewPasswordSchema, req.body),
        userId,
      };
      await this._changePasswordUserUseCase.execute(dto);

      this._logger.info(`${userId} user password changed`);
      return res
        .status(HttpStatus.OK)
        .json({ message: USER_MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY });
    } catch (err) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# CHANGE EMAIL
  //# ================================================================================================================
  //# POST /api/v1/user/change-email
  //# Request body: { newEmail: string }
  //# This controller initiates an email change for the authenticated user and sends verification token.
  //# ================================================================================================================
  changeEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { newEmail } = req.body;
      this._logger.info(`Changing email for user: ${userId} to ${newEmail}`);

      const token = await this._changeEmailUserUseCase.execute({
        userId,
        newEmail,
      });

      this._logger.debug(`token ${token}`);

      return res.status(HttpStatus.OK).json({
        data: token,
        message: USER_MESSAGES.CHANGE_EMAIL_TOKEN_SENDED_SUCCESSFULLY,
      });
    } catch (err) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# VERIFY EMAIL TOKEN
  //# ================================================================================================================
  //# POST /api/v1/user/verify-email-token
  //# Request body: { token: string }
  //# This controller verifies the email token and updates the user's email if valid.
  //# ================================================================================================================
  emailVerifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { token } = req.body;

      this._logger.info(`Verifying email token for user: ${userId}`);

      const user = await this._verifyEmailTokenUserUseCase.execute({
        userId,
        token,
      });

      this._logger.debug(`Email token verified for user: ${user.id}`);

      res.status(HttpStatus.OK).json({
        data: user,
        message: USER_MESSAGES.EMAIL_UPDATED_SUCCESSFULLY,
      });
    } catch (err) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# DEACTIVATE ACCOUNT
  //# ================================================================================================================
  //# POST /api/v1/user/deactivate
  //# Request headers: { x-user-id: string }
  //# This controller deactivates the authenticated user's account.
  //# ================================================================================================================
  deactivateAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      this._logger.info(`Deactivating account for user: ${userId}`);

      // TODO: call service/repo here
      res
        .status(HttpStatus.OK)
        .json({ message: USER_MESSAGES.ACCOUNT_DEACTIVATED_SUCCESSFULLY });
    } catch (err) {
      next(err);
    }
  };
}
