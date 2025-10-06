import { logger } from "../../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { validateWithZod } from "../../../utils/zodValidator";
import { USER_MESSAGES } from "../../../constants/userMessages";
import { ARTIST_MESSAGES } from "../../../constants/artistMessages";

import { IArtistRequestController } from "../../interfaces/user/IArtistRequestController";
import { createArtistRequestSchema } from "../../../application/validations/user/createArtistRequestSchema";
import { CreateArtistRequestDto } from "../../../application/interface/dtos/user/artist-request/CreateArtistRequestDto";
import { ICreateArtistRequestUseCase } from "../../../application/interface/usecases/user/artist-request/ICreateArtistRequestUseCase";
import { ICheckUserArtistRequestUseCase } from "../../../application/interface/usecases/user/artist-request/ICheckUserArtistRequestUseCase";

export class ArtistRequestController implements IArtistRequestController {
  constructor(
    private readonly _createArtistRequestUseCase: ICreateArtistRequestUseCase,
    private readonly _checkUserArtistRequestUseCase: ICheckUserArtistRequestUseCase
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
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: USER_MESSAGES.USER_ID_REQUIRED });
      }
      const result = validateWithZod(createArtistRequestSchema, req.body);

      const { bio, phone, country } = result;

      const dto: CreateArtistRequestDto = { userId, bio, phone, country };

      const request = await this._createArtistRequestUseCase.execute(dto);

      logger.info(`Artist request submitted successfully for user: ${userId}`);

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
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: USER_MESSAGES.USER_ID_REQUIRED });
      }

      const { alreadySubmitted, latestRequest } =
        await this._checkUserArtistRequestUseCase.execute(userId);

      logger.info(
        `Artist request status fetched successfully for user: ${userId}`
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
