import { inject, injectable } from "inversify";
import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../infrastructure/utils/logger";
import { TYPES } from "../../infrastructure/Inversify/types";
import { CreatePrivateConversationDto } from "../../applications/interface/dto/CreatePrivateConversationDto";
import { IGetAllResendConversationUseCase } from "../../applications/interface/usecase/IGetAllResendConversationUseCase";
import { ICreatePrivateConversationUseCase } from "../../applications/interface/usecase/ICreatePrivateConversationUseCase";

@injectable()
export class ConversationController {
  constructor(
    @inject(TYPES.IGetAllResendConversationUseCase)
    private readonly _getAllResendConversationUseCase: IGetAllResendConversationUseCase,
    @inject(TYPES.ICreatePrivateConversationUseCase)
    private readonly _createPrivateConversationUseCase: ICreatePrivateConversationUseCase,
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

      logger.info(
        `ConversationController.createPrivateConversation: userId: ${userId}, otherUserId: ${otherUserId}`
      );

      const dto: CreatePrivateConversationDto = {
        userId,
        otherUserId,
      };

      const conversationId =
        await this._createPrivateConversationUseCase.execute(dto);

      logger.info(`Conversation created: ${conversationId}`);

      return res.status(HttpStatus.CREATED).json({
        message: "Conversation created successfully",
        data: { conversationId },
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

      logger.info(
        `ConversationController.getAllResendConversation: userId: ${userId}`
      );

      const data = await this._getAllResendConversationUseCase.execute(
        userId,
        page,
        limit,
      );

      logger.info(`Resend conversations: ${JSON.stringify(data)}`);

      return res.status(HttpStatus.OK).json({
        message: "Resend conversations retrieved successfully",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
}
