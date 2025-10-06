import { Request, Response, NextFunction } from "express";
import { ISecurityController } from "../../interfaces/user/ISecurityController";
import { logger } from "../../../utils/logger";
import { validateWithZod } from "../../../utils/zodValidator";
import { currentPasswordNewPasswordSchema } from "../../../application/validations/user/CurrentPasswordNewPasswordSchema";
import { ChangePasswordRequestDto } from "../../../application/interface/dtos/user/security/ChangePasswordRequestDto";
import { ChangePasswordUserUseCase } from "../../../application/usecases/user/security/ChangePasswordUserUseCase";
import { HttpStatus } from "art-chain-shared";
import { ChangeEmailUserUseCase } from "../../../application/usecases/user/security/ChangeEmailUserUseCase";
import { publishNotification } from "../../../infrastructure/messaging/rabbitmq";
import { VerifyEmailTokenUserUseCase } from "../../../application/usecases/user/security/VerifyEmailTokenUserUseCase";

export class SecurityController implements ISecurityController {
  constructor(
    private readonly _changePasswordUserUseCase: ChangePasswordUserUseCase,
    private readonly _changeEmailUserUseCase: ChangeEmailUserUseCase,
    private readonly _verifyEmailTokenUserUseCase: VerifyEmailTokenUserUseCase
  ) {}

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

  emailVerifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { token } = req.body;

      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Token is required" });
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
