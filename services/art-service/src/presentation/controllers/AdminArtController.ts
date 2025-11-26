import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAdminArtController } from "../interface/IAdminArtController";
import { IGetAllArtsUseCase } from "../../application/interface/usecase/admin/IGetAllArtsUseCase";
import { IGetArtStatsUseCase } from "../../application/interface/usecase/admin/IGetArtStatsUseCase";
import { IUpdateArtStatusUseCase } from "../../application/interface/usecase/admin/IUpdateArtStatusUseCase";
import { PostStatus, PostType, PriceType } from "../../domain/entities/ArtPost";
import { HttpStatus } from "art-chain-shared";
import { updateArtStatusSchema } from "../validators/updateArtStatus.schema";
import { validateWithZod } from "../../utils/validateWithZod";
import { UpdateArtStatusDTO } from "../../application/interface/dto/admin/UpdateArtStatusDTO";
import { ERROR_MESSAGES } from "../../constants/ErrorMessages";

@injectable()
export class AdminArtController implements IAdminArtController {
  constructor(
    @inject(TYPES.IGetAllArtsUseCase) private _getAllArtsUseCase: IGetAllArtsUseCase,
    @inject(TYPES.IGetArtStatsUseCase) private _getArtStatsUseCase: IGetArtStatsUseCase,
    @inject(TYPES.IUpdateArtStatusUseCase) private _updateArtStatusUseCase: IUpdateArtStatusUseCase
  ) {}

  getAllArts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as PostStatus;
      const postType = req.query.postType as PostType;
      const priceType = req.query.priceType as PriceType;
      const userId = req.query.userId as string;

      const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

      const result = await this._getAllArtsUseCase.execute(
        page,
        limit,
        { status, postType, priceType, search, userId },
        token
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  getArtStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this._getArtStatsUseCase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };

  updateArtStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = validateWithZod(updateArtStatusSchema, req.body);

      const dto: UpdateArtStatusDTO = { id, status: validatedData.status };
      const updated = await this._updateArtStatusUseCase.execute(dto);

      if (!updated) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.ART_NOT_FOUND,
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: updated,
        message: `Art status updated to ${validatedData.status}`,
      });
    } catch (error) {
      next(error);
    }
  };
}
