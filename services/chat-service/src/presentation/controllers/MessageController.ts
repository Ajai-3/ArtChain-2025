import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IMessageController } from "../interface/IMessageController";
import { SendMessageDto } from "../../applications/interface/dto/SendMessageDto";
import { ListMessagesDto } from "../../applications/interface/dto/ListMessagesDto";
import { DeleteMessageDto } from "../../applications/interface/dto/DeleteMessageDto";
import { ISendMessageUseCase } from "../../applications/interface/usecase/ISendMessageUseCase";
import { IListMessagesUseCase } from "../../applications/interface/usecase/IListMessagesUseCase";
import { IDeleteMessageUseCase } from "../../applications/interface/usecase/IDeleteMessageUseCase";

@injectable()
export class MessageController implements IMessageController {
  constructor(
    @inject(TYPES.ISendMessageUseCase)
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    @inject(TYPES.IListMessagesUseCase)
    private readonly _listMessagesUseCase: IListMessagesUseCase,
    @inject(TYPES.IDeleteMessageUseCase)
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase
  ) {}

  //#========================================================================================================================
  //# SEND MESSAGE
  //#========================================================================================================================
  //# POST /api/v1/chat/message
  //# Request Body: { senderId: string, receiverId: string, content: string, conversationId: string }
  //# This endpoint allows a user to send a message to another user or any group conversation.
  //#========================================================================================================================
  sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const dto: SendMessageDto = {
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        content: req.body.content,
        conversationId: req.body.conversationId,
      };

      const message = await this._sendMessageUseCase.execute(dto);
      res.status(HttpStatus.CREATED).json(message);
    } catch (error) {
      next(error);
    }
  };

  //#========================================================================================================================
  //# LIST MESSAGES
  //#========================================================================================================================
  //# GET /api/v1/chat/message/:conversationId
  //# Query Parameters: requestUserId (string), page (number), limit (number)
  //# This endpoint allows a user to list messages in a specific conversation.
  //#========================================================================================================================
  listMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { conversationId, page, limit } = req.body;
      const requestUserId = req.headers["x-user-id"] as string;

      const dto: ListMessagesDto = {
        conversationId,
        requestUserId,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      };

      const messages = await this._listMessagesUseCase.execute(dto);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };

  //#========================================================================================================================
  //# DELETE MESSAGE
  //#========================================================================================================================
  //# DELETE /api/v1/chat/message/:messageId
  //# Request Body: { userId: string, mode: "ME" | "EVERYONE" }
  //# This endpoint allows a user to delete a message in a conversation.
  //#========================================================================================================================
  deleteMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const dto: DeleteMessageDto = {
        messageId: req.params.messageId,
        userId: req.body.userId,
        mode: req.body.mode,
      };

      const result = await this._deleteMessageUseCase.execute(dto);
      res.json({ success: result });
    } catch (error) {
      next(error);
    }
  };
}
