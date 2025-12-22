import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ICommissionController } from "../interface/ICommissionController";
import { ICreateCommissionUseCase } from "../../application/interface/usecase/commission/ICreateCommissionUseCase";
import { IGetCommissionByConversationUseCase } from "../../application/interface/usecase/commission/IGetCommissionByConversationUseCase";
import { IUpdateCommissionUseCase } from "../../application/interface/usecase/commission/IUpdateCommissionUseCase";
import { CreateCommissionDto } from "../../application/interface/dto/CreateCommissionDto";
import { HttpStatus } from "art-chain-shared";

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

  requestCommission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const requesterId = req.headers["x-user-id"] as string;
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
        message: "Commission requested successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getCommissionByConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { conversationId } = req.params;
      const result = await this._getCommissionByConversationUseCase.execute(conversationId);

      return res.status(HttpStatus.OK).json({
        message: "Commission details fetched successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  updateCommission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const userId = req.headers["x-user-id"] as string;
      const result = await this._updateCommissionUseCase.execute(id, userId, req.body);

      return res.status(HttpStatus.OK).json({
        message: "Commission updated successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
