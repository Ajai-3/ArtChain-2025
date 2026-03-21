import { HttpStatus } from 'art-chain-shared';
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../infrastructure/Inversify/types';
import { COMMISSION_MESSAGES } from '../../constants/CommissionMessage';
import { ICommissionController } from '../interface/ICommissionController';
import { CreateCommissionDto } from '../../application/interface/dto/CreateCommissionDto';
import { ICreateCommissionUseCase } from '../../application/interface/usecase/commission/ICreateCommissionUseCase';
import { IUpdateCommissionUseCase } from '../../application/interface/usecase/commission/IUpdateCommissionUseCase';
import { IGetCommissionByConversationUseCase } from '../../application/interface/usecase/commission/IGetCommissionByConversationUseCase';

@injectable()
export class CommissionController implements ICommissionController {
  constructor(
    @inject(TYPES.ICreateCommissionUseCase)
    private readonly _createCommissionUseCase: ICreateCommissionUseCase,
    @inject(TYPES.IGetCommissionByConversationUseCase)
    private readonly _getCommissionByConversationUseCase: IGetCommissionByConversationUseCase,
    @inject(TYPES.IUpdateCommissionUseCase)
    private readonly _updateCommissionUseCase: IUpdateCommissionUseCase
  ) {}

  //# ================================================================================================================
  //# REQUEST COMMISSION
  //# ================================================================================================================
  //# POST /api/v1/art/commissions
  //# Request headers: x-user-id
  //# Request body: { artistId, title, description, referenceImages?, budget, deadline }
  //# This controller allows a user to request a commission from an artist.
  //# ================================================================================================================
  requestCommission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const requesterId = req.headers['x-user-id'] as string;
      const { artistId, title, description, referenceImages, budget, deadline } = req.body;

      const dto: CreateCommissionDto = {
        requesterId,
        artistId,
        title,
        description,
        referenceImages,
        budget,
        deadline
      };

      const result = await this._createCommissionUseCase.execute(dto);

      return res.status(HttpStatus.CREATED).json({
        message: COMMISSION_MESSAGES.REQUEST_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET COMMISSION BY CONVERSATION
  //# ================================================================================================================
  //# GET /api/v1/art/commissions/conversation/:conversationId
  //# This controller fetches the commission details associated with a specific conversation.
  //# ================================================================================================================
  getCommissionByConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { conversationId } = req.params;
      const result = await this._getCommissionByConversationUseCase.execute(conversationId);

      return res.status(HttpStatus.OK).json({
        message: COMMISSION_MESSAGES.COMMISSION_FETCH_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# UPDATE COMMISSION
  //# ================================================================================================================
  //# PATCH /api/v1/art/commissions/:id
  //# Request headers: x-user-id
  //# Request body: Partial<CreateCommissionDto>
  //# This controller allows the requester or artist to update commission details such as title, description, reference images, budget, or deadline. Only certain fields can be updated based on the commission's current status.
  //# ================================================================================================================
  updateCommission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const userId = req.headers['x-user-id'] as string;
      const result = await this._updateCommissionUseCase.execute(id, userId, req.body);

      return res.status(HttpStatus.OK).json({
        message: COMMISSION_MESSAGES.UPDATE_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
