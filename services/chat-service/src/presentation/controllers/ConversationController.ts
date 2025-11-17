import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { CreatePrivateConversationDto } from "../../applications/interface/dto/CreatePrivateConversationDto";
import { ICreatePrivateConversationUseCase } from "../../applications/interface/usecase/ICreatePrivateConversationUseCase";
import { TYPES } from "../../infrastructure/Inversify/types";
import { HttpStatus } from "art-chain-shared";
import { logger } from "../../infrastructure/utils/logger";

@injectable()
export class ConversationController {
  constructor(
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

      return res
        .status(HttpStatus.CREATED)
        .json({
          message: "Conversation created successfully",
          data: { conversationId },
        });
    } catch (error) {
      next(error);
    }
  };
}
