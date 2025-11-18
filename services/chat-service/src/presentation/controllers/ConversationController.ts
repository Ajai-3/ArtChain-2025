import { inject, injectable } from "inversify";
import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../infrastructure/utils/logger";
import { TYPES } from "../../infrastructure/Inversify/types";
import { validateWithZod } from "../../infrastructure/utils/zodValidater";
import { createPrivateConversationSchema } from "../validators/createPrivateConversationSchema";
import { CreatePrivateConversationDto } from "../../applications/interface/dto/CreatePrivateConversationDto";
import { IGetAllResendConversationUseCase } from "../../applications/interface/usecase/IGetAllResendConversationUseCase";
import { ICreatePrivateConversationUseCase } from "../../applications/interface/usecase/ICreatePrivateConversationUseCase";

@injectable()
export class ConversationController {
  constructor(
    @inject(TYPES.IGetAllResendConversationUseCase)
    private readonly _getAllResendConversationUseCase: IGetAllResendConversationUseCase,
    @inject(TYPES.ICreatePrivateConversationUseCase)
    private readonly _createPrivateConversationUseCase: ICreatePrivateConversationUseCase
  ) {}

  //#========================================================================================================================
  //# CREATE PRIVATE CONVERSATION
  //#========================================================================================================================
  //# GET /api/v1/chat/private-conversation
  //# Request Body: { otherUserId }
  //# x-user-id
  //# This endpoint allows a user create a one-on-one chat conversation
  //#========================================================================================================================
  createPrivateConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { otherUserId } = req.body;
      const userId = req.headers["x-user-id"] as string;

      const validatedData = validateWithZod(createPrivateConversationSchema, {
        userId,
        otherUserId,
      });

      logger.info(
        `ConversationController.createPrivateConversation: userId: ${userId}, otherUserId: ${otherUserId}`
      );

      const dto: CreatePrivateConversationDto = {
        userId: validatedData.userId,
        otherUserId: validatedData.otherUserId,
      };

      const { isNewConvo, conversation } =
        await this._createPrivateConversationUseCase.execute(dto);

      logger.info(`Conversation created: ${conversation}`);

      return res.status(HttpStatus.CREATED).json({
        message: "Conversation created successfully",
        data: { conversation, isNewConvo },
      });
    } catch (error) {
      next(error);
    }
  };

  //#========================================================================================================================
  //# GET ALL RESEND CONVERSATION
  //#========================================================================================================================
  //# GET /api/v1/chat/resend-conversation
  //# Request Header: x-user-id
  //# This endpoint allows a user get all resend conversation
  //#========================================================================================================================
  getResendConversations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const limit = Number(req.query.limit) || 10;
      const page = Number(req.query.page) || 1;

      const userId = req.headers["x-user-id"] as string;

      console.log(userId);

      logger.info(
        `ConversationController.getAllResendConversation: userId: ${userId}`
      );

      const data = await this._getAllResendConversationUseCase.execute(
        userId,
        page,
        limit
      );

      return res.status(HttpStatus.OK).json({
        message: "Resend conversations retrieved successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
}
