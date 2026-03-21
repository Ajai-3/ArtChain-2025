import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../infrastructure/Inversify/types';
import { validateWithZod } from '../../utils/validateWithZod';
import { ERROR_MESSAGES } from '../../constants/ErrorMessages';
import { IAdminArtController } from '../interface/IAdminArtController';
import { updateArtStatusSchema } from '../validators/updateArtStatus.schema';
import { PostStatus, PostType, PriceType } from '../../domain/entities/ArtPost';
import { UpdateArtStatusDTO } from '../../application/interface/dto/admin/UpdateArtStatusDTO';
import { IGetAllArtsUseCase } from '../../application/interface/usecase/admin/IGetAllArtsUseCase';
import { IGetTopArtsUseCase } from '../../application/interface/usecase/admin/IGetTopArtsUseCase';
import { IGetArtStatsUseCase } from '../../application/interface/usecase/admin/IGetArtStatsUseCase';
import { IUpdateArtStatusUseCase } from '../../application/interface/usecase/admin/IUpdateArtStatusUseCase';
import { IGetCategoryStatsUseCase } from '../../application/interface/usecase/admin/IGetCategoryStatsUseCase';

@injectable()
export class AdminArtController implements IAdminArtController {
  constructor(
    @inject(TYPES.IGetAllArtsUseCase)
    private _getAllArtsUseCase: IGetAllArtsUseCase,
    @inject(TYPES.IGetArtStatsUseCase)
    private _getArtStatsUseCase: IGetArtStatsUseCase,
    @inject(TYPES.IUpdateArtStatusUseCase)
    private _updateArtStatusUseCase: IUpdateArtStatusUseCase,
    @inject(TYPES.IGetTopArtsUseCase)
    private _getTopArtsUseCase: IGetTopArtsUseCase,
    @inject(TYPES.IGetCategoryStatsUseCase)
    private _getCategoryStatsUseCase: IGetCategoryStatsUseCase,
  ) {}

  //# ================================================================================================================
  //# GET ALL ART
  //# ================================================================================================================
  //# GET /api/v1/art/admin/art
  //# This endpoint allows admin to retrieve a paginated list of all art posts with optional filters for status, post
  //# type, price type, search keyword, and user ID. It also returns overall art statistics in the response.
  //# ================================================================================================================
  getAllArts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as PostStatus;
      const postType = req.query.postType as PostType;
      const priceType = req.query.priceType as PriceType;
      const userId = req.query.userId as string;

      const [result, stats] = await Promise.all([
        this._getAllArtsUseCase.execute(page, limit, {
          status,
          postType,
          priceType,
          search,
          userId,
        }),
        this._getArtStatsUseCase.execute(),
      ]);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result.data,
        meta: result.meta,
        stats,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET ART STATS
  //# ================================================================================================================
  //# GET /api/v1/art/stats
  //# This endpoint allows admin to retrieve overall statistics about art posts, including total count, free vs premium
  //# distribution, and AI-generated art count.
  //# ================================================================================================================
  getArtStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const stats = await this._getArtStatsUseCase.execute();
      return res.status(HttpStatus.OK).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET TOP ARTS
  //# ================================================================================================================
  //# GET /api/v1/art/stats/top
  //# This endpoint allows admin to retrieve a list of top art posts based on either likes or price. The limit of results
  //# can be specified via query parameters.
  //# ================================================================================================================
  getTopArts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const limit = Number(req.query.limit) || 5;
      const type = (req.query.type as 'likes' | 'price') || 'likes';
      const arts = await this._getTopArtsUseCase.execute(limit, type);
      return res.status(HttpStatus.OK).json({ data: arts });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET CATEGORY STATS
  //# ================================================================================================================
  //# GET /api/v1/art/stats/categories
  //# This endpoint allows admin to retrieve statistics about art posts grouped by category, including the count of posts
  //# in each category.
  //# ================================================================================================================
  getCategoryStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const stats = await this._getCategoryStatsUseCase.execute();
      return res.status(HttpStatus.OK).json({ data: stats });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# UPDATE ART STATUS
  //# ================================================================================================================
  //# PUT /api/v1/art/admin/art/:id/status
  //# This endpoint allows admin to update the status of an art post (active, archived, deleted). The art post is
  //# identified by its ID in the URL path, and the new status is provided in the request body.
  //# ================================================================================================================
  updateArtStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
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

      return res.status(HttpStatus.OK).json({
        success: true,
        data: updated,
        message: `Art status updated to ${validatedData.status}`,
      });
    } catch (error) {
      next(error);
    }
  };
}
