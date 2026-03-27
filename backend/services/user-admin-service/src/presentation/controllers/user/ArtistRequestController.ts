import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { logger } from '../../../utils/logger';
import { Request, Response, NextFunction } from 'express';
import { validateWithZod } from '../../../utils/zodValidator';
import { USER_MESSAGES } from '../../../constants/userMessages';
import { TYPES } from '../../../infrastructure/inversify/types';
import { ILogger } from '../../../application/interface/ILogger';
import { ARTIST_MESSAGES } from '../../../constants/artistMessages';
import { IArtistRequestController } from '../../interfaces/user/IArtistRequestController';
import { createArtistRequestSchema } from '../../../application/validations/user/createArtistRequestSchema';
import { CreateArtistRequestDto } from '../../../application/interface/dtos/user/artist-request/CreateArtistRequestDto';
import { ICreateArtistRequestUseCase } from '../../../application/interface/usecases/user/artist-request/ICreateArtistRequestUseCase';
import { ICheckUserArtistRequestUseCase } from '../../../application/interface/usecases/user/artist-request/ICheckUserArtistRequestUseCase';

@injectable()
export class ArtistRequestController implements IArtistRequestController {
  constructor(
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.ICreateArtistRequestUseCase)
    private _createArtistRequestUseCase: ICreateArtistRequestUseCase,
    @inject(TYPES.ICheckUserArtistRequestUseCase)
    private _checkUserArtistRequestUseCase: ICheckUserArtistRequestUseCase,
  ) {}

  //# ================================================================================================================
  //# CREATE ARTIST REQUEST
  //# ================================================================================================================
  //# POST /api/v1/user/artist-request
  //# Request headers: x-user-id
  //# Request body: { bio?, phone?, country? }
  //# This controller allows the current user to submit a request to become an artist.
  //# Optional fields (bio, phone, country) will be stored in the user profile if provided.
  //# ================================================================================================================
  createArtistRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const userId = req.headers['x-user-id'] as string;

      const dto: CreateArtistRequestDto = {
        ...validateWithZod(createArtistRequestSchema, { ...req.body, userId }),
      };

      const request = await this._createArtistRequestUseCase.execute(dto);

      this._logger.info(
        `Artist request submitted successfully for user: ${userId}`,
      );

      return res.status(HttpStatus.OK).json({
        message: ARTIST_MESSAGES.REQUEST_SUBMITTED_SUCCESS,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# CREATE ARTIST REQUEST
  //# ================================================================================================================
  //# GET /api/v1/user/artist-request/status
  //# Request headers: x-user-id
  //# Request body: { bio?, phone?, country? }
  //# This controller allows the current user to submit a request to become an artist.
  //# Optional fields (bio, phone, country) will be stored in the user profile if provided.
  //# ================================================================================================================
  hasUserSubmittedRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const userId = req.headers['x-user-id'] as string;

      const { alreadySubmitted, latestRequest } =
        await this._checkUserArtistRequestUseCase.execute(userId);

      this._logger.info(
        `Artist request status fetched successfully for user: ${userId}`,
      );

      return res.status(HttpStatus.OK).json({
        message: ARTIST_MESSAGES.REQUEST_FETCH_SUCCESS,
        data: {
          alreadySubmitted,
          latestRequest,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
