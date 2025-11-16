import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { CreatePrivateConversationDto } from "../../applications/interface/dto/CreatePrivateConversationDto";
import { ICreatePrivateConversationUseCase } from "../../applications/interface/usecase/ICreatePrivateConversationUseCase";
import { TYPES } from "../../infrastructure/Inversify/types";

@injectable()
export class ConversationController {
  constructor(@inject(TYPES.ICreatePrivateConversationUseCase) private readonly _createPrivateConversationUseCase: ICreatePrivateConversationUseCase) {}

  //#========================================================================================================================
  //# CREATE PRIVATE CONVERSATION
  //#========================================================================================================================
  //# GET /api/v1/chat/private-conversation
  //# Request Body: { otherUserId }
  //# x-user-id
  //# This endpoint allows a user create a one-on-one chat conversation
  //#========================================================================================================================
  createPrivateConversation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { otherUserId } = req.body;
      const userId = req.headers["x-user-id"] as string;

      const dto: CreatePrivateConversationDto = {
        userId,
        otherUserId,
      };

      const conversationId = await this._createPrivateConversationUseCase.execute(dto);
      
    } catch (error) {
      next(error);
    }
  }
}