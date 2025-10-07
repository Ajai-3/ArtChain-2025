import { HttpStatus } from "art-chain-shared";
import { injectable, inject } from "inversify";
import { logger } from "../../../utils/logger";
import { Request, Response, NextFunction } from "express";
import { validateWithZod } from "../../../utils/zodValidator";
import { TYPES } from "../../../infrastructure/inversify/types";
import { ISecurityController } from "../../interfaces/user/ISecurityController";
import { publishNotification } from "../../../infrastructure/messaging/rabbitmq";
import { ChangePasswordRequestDto } from "../../../application/interface/dtos/user/security/ChangePasswordRequestDto";
import { IChangeEmailUserUseCase } from "../../../application/interface/usecases/user/security/IChangeEmailUserUseCase";
import { currentPasswordNewPasswordSchema } from "../../../application/validations/user/CurrentPasswordNewPasswordSchema";
import { IChangePasswordUserUseCase } from "../../../application/interface/usecases/user/security/IChangePasswordUserUseCase";
import { IVerifyEmailTokenUserUseCase } from "../../../application/interface/usecases/user/security/IVerifyEmailTokenUserUseCase";

@injectable()
export class SecurityController implements ISecurityController {
  constructor(
    @inject(TYPES.IChangePasswordUserUseCase)
    private readonly _changePasswordUserUseCase: IChangePasswordUserUseCase,
    @inject(TYPES.IChangeEmailUserUseCase)
    private readonly _changeEmailUserUseCase: IChangeEmailUserUseCase,
    @inject(TYPES.IVerifyEmailTokenUserUseCase)
    private readonly _verifyEmailTokenUserUseCase: IVerifyEmailTokenUserUseCase
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
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
        .json({ message: "Password changed successfully" });
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { newEmail } = req.body;
      logger.info(`Changing email for user: ${userId} to ${newEmail}`);

      const { user, token } = await this._changeEmailUserUseCase.execute({
        userId,
        newEmail,
      });

      logger.debug(`token ${token}`);

      await publishNotification("email.email_change_verification", {
        type: "EMAIL_CHANGE_VERIFICATION",
        email: user.email,
        payload: {
          name: user.name,
          token,
        },
      });

      res.status(HttpStatus.OK).json({
        data: token,
        message: "Change email token sended successfully",
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { token } = req.body;

      if (!token) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Token is required" });
        return;
      }

      logger.info(`Verifying email token for user: ${userId}`);

      const user = await this._verifyEmailTokenUserUseCase.execute({
        userId,
        token,
      });

      logger.debug(`Email token verified for user: ${user.id}`);

      res.status(HttpStatus.OK).json({
        data: user,
        message: "Email Updated successfully",
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      logger.info(`Deactivating account for user: ${userId}`);

      // TODO: call service/repo here
      res
        .status(HttpStatus.OK)
        .json({ message: "Account deactivated successfully" });
    } catch (err) {
      next(err);
    }
  };
}
