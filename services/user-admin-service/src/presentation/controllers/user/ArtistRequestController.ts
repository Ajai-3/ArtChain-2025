import { Request, Response, NextFunction } from "express";
import { CreateArtistRequestUseCase } from "../../../application/usecases/user/artist-request/CreateArtistRequestUseCase";
import { HttpStatus } from "art-chain-shared";
import { ARTIST_MESSAGES } from "../../../constants/artistMessages";
import { CreateArtistRequestDto } from "../../../domain/dtos/user/CreateArtistRequestDto";
import { validateWithZod } from "../../../utils/zodValidator";
import { createArtistRequestSchema } from "../../../application/validations/user/createArtistRequestSchema";
import { USER_MESSAGES } from "../../../constants/userMessages";

export class ArtistRequestController {
  constructor(
    private _createArtistRequestUseCase: CreateArtistRequestUseCase
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
  ): Promise<any> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: USER_MESSAGES.USER_ID_REQUIRED })
      };
      const result = validateWithZod(createArtistRequestSchema, req.body);

      const { bio, phone, country } = result;

      const dto: CreateArtistRequestDto = {userId, bio, phone, country}

      const request = await this._createArtistRequestUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        message: ARTIST_MESSAGES.REQUEST_SUBMITTED_SUCCESS,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };
}
