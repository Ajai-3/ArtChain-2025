import { logger } from '../../utils/logger';
import { HttpStatus } from 'art-chain-shared';
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { ART_MESSAGES } from '../../constants/ArtMessages';
import { IArtController } from '../interface/IArtController';
import { TYPES } from '../../infrastructure/Inversify/types';
import { validateWithZod } from '../../utils/validateWithZod';
import { createArtPostSchema } from '../validators/artPost.schema';
import { publishNotification } from '../../infrastructure/messaging/rabbitmq';
import { CreateArtPostDTO } from '../../application/interface/dto/art/CreateArtPostDTO';
import { IBuyArtUseCase } from '../../application/interface/usecase/art/IBuyArtUseCase';
import { IGetAllArtUseCase } from '../../application/interface/usecase/art/IGetAllArtUseCase';
import { IGetArtByIdUseCase } from '../../application/interface/usecase/art/IGetArtByIdUseCase';
import { IDownloadArtUseCase } from '../../application/interface/usecase/art/IDownloadArtUseCase';
import { IGetArtByNameUseCase } from '../../application/interface/usecase/art/IGetArtByNameUseCase';
import { ICountArtWorkUseCase } from '../../application/interface/usecase/art/ICountArtWorkUseCase';
import { IDeleteArtPostUseCase } from '../../application/interface/usecase/art/IDeleteArtPostUseCase';
import { IUpdateArtPostUseCase } from '../../application/interface/usecase/art/IUpdateArtPostUseCase';
import { ICreateArtPostUseCase } from '../../application/interface/usecase/art/ICreateArtPostUseCase';
import { IGetSalesAnalyticsUseCase } from '../../application/interface/usecase/art/IGetSalesAnalyticsUseCase';
import { ISaledArtworkOfuserUseCase } from '../../application/interface/usecase/art/ISaledArtworkOfuserUseCase';
import { IArtToElasticSearchUseCase } from '../../application/interface/usecase/art/IArtToElasticSearchUseCase';
import { IGetAllArtWithUserIdUseCase } from '../../application/interface/usecase/art/IGetAllArtWithUserIdUseCase';
import { IGetPurchasedArtWorksUseCase } from '../../application/interface/usecase/art/IGetPurchasedArtWorksUseCase';
import { IGetPurchaseAnalyticsUseCase } from '../../application/interface/usecase/art/IGetPurchaseAnalyticsUseCase';
import { IDeleteUserArtPostUseCase } from '../../application/interface/usecase/art/IDeleteUserArtPostUseCase';

@injectable()
export class ArtController implements IArtController {
  constructor(
    @inject(TYPES.ICreateArtPostUseCase)
    private readonly _createArtUseCase: ICreateArtPostUseCase,
    @inject(TYPES.IGetArtByIdUseCase)
    private readonly _getArtByIdUseCase: IGetArtByIdUseCase,
    @inject(TYPES.IGetAllArtUseCase)
    private readonly _getAllArtUseCase: IGetAllArtUseCase,
    @inject(TYPES.IGetArtByNameUseCase)
    private readonly _getArtByNameUseCase: IGetArtByNameUseCase,
    @inject(TYPES.IArtToElasticSearchUseCase)
    private readonly _artToElasticSearchUseCase: IArtToElasticSearchUseCase,
    @inject(TYPES.ICountArtWorkUseCase)
    private readonly _countArtWorkUseCase: ICountArtWorkUseCase,
    @inject(TYPES.IGetAllArtWithUserIdUseCase)
    private readonly _getAllArtWithUserIdUseCase: IGetAllArtWithUserIdUseCase,
    @inject(TYPES.IBuyArtUseCase)
    private readonly _buyArtUseCase: IBuyArtUseCase,
    @inject(TYPES.IDownloadArtUseCase)
    private readonly _downloadArtUseCase: IDownloadArtUseCase,
    @inject(TYPES.ISaledArtworkOfuserUseCase)
    private readonly _saledArtworkOfuserUseCase: ISaledArtworkOfuserUseCase,
    @inject(TYPES.IGetPurchasedArtWorksUseCase)
    private readonly _getPurchasedArtWorksUseCase: IGetPurchasedArtWorksUseCase,
    @inject(TYPES.IGetSalesAnalyticsUseCase)
    private readonly _getSalesAnalyticsUseCase: IGetSalesAnalyticsUseCase,
    @inject(TYPES.IGetPurchaseAnalyticsUseCase)
    private readonly _getPurchaseAnalyticsUseCase: IGetPurchaseAnalyticsUseCase,
    @inject(TYPES.IDeleteUserArtPostUseCase)
    private readonly _deleteUserArtUseCase: IDeleteUserArtPostUseCase,
    @inject(TYPES.IUpdateArtPostUseCase)
    private readonly _updateArtUseCase: IUpdateArtPostUseCase,
  ) {}

  //# ================================================================================================================
  //# GET ART WITH ART NAME
  //# ================================================================================================================
  //# GET /api/v1/art/:artname
  //# Path params: artname
  //# This controller fetches the art with the unique art name
  //# ================================================================================================================
  getArtByArtName = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { artname } = req.params;
      const currentUserId = req.headers['x-user-id'] as string;

      const data = await this._getArtByNameUseCase.execute(
        artname,
        currentUserId,
      );

      logger.info(`${data.art.artName} fetched succefully.`);

      return res
        .status(HttpStatus.OK)
        .json({ message: ART_MESSAGES.ART_FETCH_WITH_ART_NAME_SUCESS, data });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET ALL ART
  //# ================================================================================================================
  //# GET /api/v1/art
  //# Query params: page (number), limit (number)
  //# This controller fetches all art items with pagination support.
  //# ================================================================================================================
  getAllArt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.headers['x-user-id'] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categoryId = req.query.categoryId as string | undefined;

      const result = await this._getAllArtUseCase.execute(
        page,
        limit,
        currentUserId,
        categoryId,
      );

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.ART_FETCH_SUCESSFULL,
        page,
        limit,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET RECOMENTED ART
  //# ================================================================================================================
  //# GET /api/v1/art/recommended
  //# Query params: page (number), limit (number)
  //# This controller fetches recommended art items with pagination support.
  //# ================================================================================================================
  getRecommendedArt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const currentUserId = req.headers['x-user-id'] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const categoryId = req.query.categoryId as string | undefined;

      const result = await this._getAllArtUseCase.execute(
        page,
        limit,
        currentUserId,
        categoryId,
      );

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.ART_FETCH_SUCESSFULL,
        page,
        limit,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET ART OF USER
  //# ================================================================================================================
  //# GET /api/v1/art/user/:userId
  //# Path params: userId
  //# This controller fetches all art items with pagination support.
  //# ================================================================================================================
  getArtWithUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const userId = req.params.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 15;
      const currentUserId = req.headers['x-user-id'] as string;

      logger.info(
        `Fetching art for user ID: ${userId}, page=${page}, limit=${limit}`,
      );

      const arts = await this._getAllArtWithUserIdUseCase.execute(
        page,
        limit,
        userId,
        currentUserId,
      );

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.FETCH_ALL_SUCCESS,
        page,
        limit,
        data: arts,
      });
    } catch (error) {
      logger.error('Error in getArtWithUser', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET ART BY ID
  //# ================================================================================================================
  //# GET /api/v1/art/:id
  //# Request params: id
  //# This controller fetches a single art item by its ID.
  //# ================================================================================================================
  getArtById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      logger.info(`Fetching art by id=${id}`);

      const { art, user } = await this._getArtByIdUseCase.execute(id);

      return res.status(HttpStatus.OK).json({
        message: `${ART_MESSAGES.FETCH_BY_ID_SUCCESS} ${id}`,
        user,
        art,
      });
    } catch (error) {
      logger.error('Error in getArtById', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# CREATE NEW ART
  //# ================================================================================================================
  //# POST /api/v1/art
  //# Request body: art details
  //# This controller creates a new art item.
  //# ================================================================================================================
  createArt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const userId = req.headers['x-user-id'] as string;

      const validatedData = validateWithZod(createArtPostSchema, req.body);

      const dto: CreateArtPostDTO = { ...validatedData, userId };
      const createdArt = await this._createArtUseCase.execute(dto);

      const art = await this._artToElasticSearchUseCase.execute(createdArt);

      await publishNotification('art.created', art);

      logger.info(
        `Art created successfully by userId=${userId}, title=${JSON.stringify(
          createdArt,
        )}`,
      );

      return res
        .status(HttpStatus.CREATED)
        .json({ message: ART_MESSAGES.CREATE_SUCCESS, data: createdArt });
    } catch (error) {
      logger.error('Error in createArt', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# UPDATE ART
  //# ================================================================================================================
  //# PATCH /api/v1/art/:id
  //# Request params: id
  //# Request body: fields to update
  //# This controller updates an existing art item.
  //# ================================================================================================================
  updateArt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.headers['x-user-id'] as string;

      logger.info(
        `Updating art id=${id} with data=${JSON.stringify(updateData)}`,
      );

      await this._updateArtUseCase.execute({ id, userId, ...updateData });

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.UPDATE_SUCCESS,
        data: updateData,
      });
    } catch (error) {
      logger.error('Error in updateArt', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# COUNT ART
  //# ================================================================================================================
  //# GET /api/v1/art/count/:userId
  //# Request params: userId
  //# This controller help you to count the artwork of the user.
  //# ================================================================================================================
  countArtwork = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { userId } = req.params;

      const artworksCount = await this._countArtWorkUseCase.execute(userId);

      logger.info(
        `ArtController: User ${userId} has ${artworksCount} artworks`,
      );
      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.ART_COUNTED,
        artworksCount,
      });
    } catch (error) {
      logger.error('Error in countArtwork', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# DELETE ART
  //# ================================================================================================================
  //# DELETE /api/v1/art/:id
  //# Request params: id
  //# This controller deletes an art item by ID.
  //# ================================================================================================================
  deleteArt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const userId = req.headers['x-user-id'] as string;

      logger.info(`Deleting art id=${id}`);

      await this._deleteUserArtUseCase.execute(id, userId);

      return res
        .status(HttpStatus.OK)
        .json({ message: ART_MESSAGES.DELETE_SUCCESS });
    } catch (error) {
      logger.error('Error in deleteArt', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# BUY ART
  //# ================================================================================================================
  //# POST /api/v1/art/buy/:id
  //# Request params: id
  //# This controller handles art purchase.
  //# ================================================================================================================
  buyArt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const currentUserId = req.headers['x-user-id'] as string;

      logger.info(`User ${currentUserId} buying art ${id}`);

      await this._buyArtUseCase.execute(id, currentUserId);

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.BUY_SUCCESS,
      });
    } catch (error) {
      logger.error('Error in buyArt', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# DOWNLOAD ART
  //# ================================================================================================================
  //# GET /api/v1/art/download/:id
  //# Request params: id
  //# This controller handles art download.
  //# ================================================================================================================
  downloadArt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const category = req.query.type as string;
      const userId = req.headers['x-user-id'] as string;

      logger.info(`User ${userId} downloading art ${id}`);

      const signedUrl = await this._downloadArtUseCase.execute(
        id,
        userId,
        category,
      );

      logger.info(`✅ [DownloadArt] Signed URL: ${signedUrl}`);

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.DOWNLOAD_SUCCESS,
        data: {
          downloadUrl: signedUrl,
        },
      });
    } catch (error) {
      logger.error('Error in downloadArt', error);
      next(error);
    }
  };

  //# ===============================================================================================================
  //# SALED ART WORKS
  //# ================================================================================================================
  //# GET /api/v1/art/saled
  //# Query params: page (number), limit (number)
  //# This controller fetches the art works sold by the user.
  //# ================================================================================================================
  saledArtWorks = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 15;
      const userId = req.headers['x-user-id'] as string;

      const arts = await this._saledArtworkOfuserUseCase.execute(
        userId,
        page,
        limit,
      );

      logger.info(
        `✅ [SaledArtWorks] Fetched ${arts.length} saled arts for userId=${userId}`,
      );

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.SALED_ARTWORKS_FETCH_SUCCESS,
        data: arts,
      });
    } catch (error) {
      logger.error('Error in saledArtWorks', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# SALES ANALYTICS
  //# ================================================================================================================
  //# GET /api/v1/art/sales-analytics
  //# Query params: range (string: today, 7d, 30d, all)
  //# This controller fetches sales analytics for the user.
  //# ================================================================================================================
  salesAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const range = (req.query.range as string) || '7d';
      const userId = req.headers['x-user-id'] as string;

      const analytics = await this._getSalesAnalyticsUseCase.execute(
        userId,
        range,
      );

      logger.info(
        `✅ [SalesAnalytics] Fetched sales analytics for userId=${userId} with range=${range}`,
      );

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.SALES_ANALYTICS_FETCH_SUCCESS,
        data: analytics,
      });
    } catch (error) {
      logger.error('Error in salesAnalytics', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# PURCHASED ART WORKS
  //# ================================================================================================================
  //# GET /api/v1/art/purchased
  //# Query params: page (number), limit (number)
  //# This controller fetches the art works purchased by the user.
  //# ================================================================================================================
  purchasedArtWorks = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 15;
      const userId = req.headers['x-user-id'] as string;

      const arts = await this._getPurchasedArtWorksUseCase.execute(
        userId,
        page,
        limit,
      );

      logger.info(
        `✅ [PurchasedArtWorks] Fetched ${arts.length} purchased arts for userId=${userId}`,
      );

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.PURCHASED_ARTWORKS_FETCH_SUCCESS,
        data: arts,
      });
    } catch (error) {
      logger.error('Error in purchasedArtWorks', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# PURCHASE ANALYTICS
  //# ================================================================================================================
  //# GET /api/v1/art/purchase-analytics
  //# Query params: range (string: today, 7d, 30d, all)
  //# This controller fetches purchase analytics for the user.
  //# ================================================================================================================
  purchaseAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const range = (req.query.range as string) || '7d';
      const userId = req.headers['x-user-id'] as string;

      const analytics = await this._getPurchaseAnalyticsUseCase.execute(
        userId,
        range,
      );

      logger.info(
        `✅ [PurchaseAnalytics] Fetched purchase analytics for userId=${userId} with range=${range}`,
      );

      return res.status(HttpStatus.OK).json({
        message: ART_MESSAGES.PURCHASE_ANALYTICS_FETCH_SUCCESS,
        data: analytics,
      });
    } catch (error) {
      logger.error('Error in purchaseAnalytics', error);
      next(error);
    }
  };
}
