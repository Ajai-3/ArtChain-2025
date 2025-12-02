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
import { ICreateGroupConversationUseCase } from "../../applications/interface/usecase/ICreateGroupConversationUseCase";
import { createGroupConversationSchema } from "../validators/createGroupConversationSchema";
import { CreateGroupConversationDto } from "../../applications/interface/dto/CreateGroupConversationDto";
import { IGetGroupMembersUseCase } from "../../applications/interface/usecase/IGetGroupMembersUseCase";
import { IRemoveGroupMemberUseCase } from "../../applications/interface/usecase/IRemoveGroupMemberUseCase";
import { IAddGroupAdminUseCase } from "../../applications/interface/usecase/IAddGroupAdminUseCase";
import { IRemoveGroupAdminUseCase } from "../../applications/interface/usecase/IRemoveGroupAdminUseCase";
import { IAddGroupMemberUseCase } from "../../applications/interface/usecase/IAddGroupMemberUseCase";
import { SUCCESS_MESSAGES } from "../../constants/messages";
import { ROUTES } from "../../constants/routes";

@injectable()
export class ConversationController {
  constructor(
    @inject(TYPES.IGetAllResendConversationUseCase)
    private readonly _getAllResendConversationUseCase: IGetAllResendConversationUseCase,
    @inject(TYPES.ICreatePrivateConversationUseCase)
    private readonly _createPrivateConversationUseCase: ICreatePrivateConversationUseCase,
    @inject(TYPES.ICreateGroupConversationUseCase)
    private readonly _createGroupConversationUseCase: ICreateGroupConversationUseCase,
    @inject(TYPES.IGetGroupMembersUseCase)
    private readonly _getGroupMembersUseCase: IGetGroupMembersUseCase,
    @inject(TYPES.IRemoveGroupMemberUseCase)
    private readonly _removeGroupMemberUseCase: IRemoveGroupMemberUseCase,
    @inject(TYPES.IAddGroupAdminUseCase)
    private readonly _addGroupAdminUseCase: IAddGroupAdminUseCase,
    @inject(TYPES.IRemoveGroupAdminUseCase)
    private readonly _removeGroupAdminUseCase: IRemoveGroupAdminUseCase,
    @inject(TYPES.IAddGroupMemberUseCase)
    private readonly _addGroupMemberUseCase: IAddGroupMemberUseCase
  ) {}

  //#========================================================================================================================
  //# CREATE PRIVATE CONVERSATION
  //#========================================================================================================================
  //# POST ROUTES.API_V1_CHAT + ROUTES.CHAT.CONVERSATION_PRIVATE
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
        message: SUCCESS_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
        data: { conversation, isNewConvo },
      });
    } catch (error) {
      next(error);
    }
  };

  //#========================================================================================================================
  //# CREATE GROUP CONVERSATION
  //#========================================================================================================================
  //# POST ROUTES.API_V1_CHAT + ROUTES.CHAT.CONVERSATION_GROUP
  //# Request Body: { name, memberIds }
  //# x-user-id
  //# This endpoint allows a user create a group chat conversation
  //#========================================================================================================================
  createGroupConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, memberIds } = req.body;
      const userId = req.headers["x-user-id"] as string;

      const validatedData = validateWithZod(createGroupConversationSchema, {
        userId,
        name,
        memberIds,
      });

      logger.info(
        `ConversationController.createGroupConversation: userId: ${userId}, name: ${name}, members: ${memberIds.length}`
      );

      const dto: CreateGroupConversationDto = {
        userId: validatedData.userId,
        name: validatedData.name,
        memberIds: validatedData.memberIds,
      };

      const conversation = await this._createGroupConversationUseCase.execute(dto);

      return res.status(HttpStatus.CREATED).json({
        message: SUCCESS_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  };

  //#========================================================================================================================
  //# GET ALL RESEND CONVERSATION
  //#========================================================================================================================
  //# GET ROUTES.API_V1_CHAT + ROUTES.CHAT.CONVERSATION_RECENT
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
        message: SUCCESS_MESSAGES.RESEND_CONVERSATIONS_RETRIEVED_SUCCESSFULLY,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };


  getGroupMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { conversationId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await this._getGroupMembersUseCase.execute({
        conversationId,
        page,
        limit,
      });

      return res.status(HttpStatus.OK).json({
        message: "Members fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  removeGroupMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { conversationId, userId } = req.params;
      const requesterId = req.headers["x-user-id"] as string;

      await this._removeGroupMemberUseCase.execute({
        conversationId,
        requesterId,
        targetUserId: userId,
      });

      return res.status(HttpStatus.OK).json({
        message: "Member removed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  addGroupAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { conversationId, userId } = req.params;
      const requesterId = req.headers["x-user-id"] as string;

      await this._addGroupAdminUseCase.execute({
        conversationId,
        requesterId,
        targetUserId: userId,
      });

      return res.status(HttpStatus.OK).json({
        message: "Admin added successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  removeGroupAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { conversationId, userId } = req.params;
      const requesterId = req.headers["x-user-id"] as string;

      await this._removeGroupAdminUseCase.execute({
        conversationId,
        requesterId,
        targetUserId: userId,
      });

      return res.status(HttpStatus.OK).json({
        message: "Admin removed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  addGroupMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { conversationId, userId } = req.params;
      const requesterId = req.headers["x-user-id"] as string;

      await this._addGroupMemberUseCase.execute({
        conversationId,
        requesterId,
        targetUserId: userId,
      });

      return res.status(HttpStatus.OK).json({
        message: "Member added successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
