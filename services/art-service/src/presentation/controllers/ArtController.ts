import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { ARTMESSAGES } from "../../constants/ArtMessages";
import { IArtController } from "../interface/IArtController";
import { validateWithZod } from "../../utils/validateWithZod";
import { createArtPostSchema } from "../validators/artPost.schema";
import { CreateArtPostDTO } from "../../domain/dto/CreateArtPostDTO";
import { CreateArtPostUseCase } from "../../application/usecase/CreateArtPostUseCase";

export class ArtController implements IArtController {
  constructor(private readonly _createArtUseCase: CreateArtPostUseCase) {}

  //# ================================================================================================================
  //# GET ALL ART
  //# ================================================================================================================
  //# GET /api/v1/art
  //# Query params: page (number), limit (number)
  //# This controller fetches all art items with pagination support.
  //# ================================================================================================================
  getAllArt = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      logger.info(`Fetching all art with pagination: page=${page}, limit=${limit}`);

      // TODO: Replace with actual DB/service call to fetch paginated art
      return res.status(HttpStatus.OK).json({
        message: ARTMESSAGES.FETCH_ALL_SUCCESS,
        page,
        limit,
        data: [],
      });
    } catch (error) {
      logger.error("Error in getAllArt", error);
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
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      logger.info(`Fetching art by id=${id}`);

      // TODO: Replace with actual DB/service call
      return res
        .status(HttpStatus.OK)
        .json({ message: `${ARTMESSAGES.FETCH_BY_ID_SUCCESS} ${id}` });
    } catch (error) {
      logger.error("Error in getArtById", error);
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
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        logger.error("Missing x-user-id header in createArt");
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Missing x-user-id header" });
      }

      const validatedData = validateWithZod(createArtPostSchema, req.body);

      const dto: CreateArtPostDTO = { ...validatedData, userId };
      const createdArt = await this._createArtUseCase.execute(dto);

      logger.info(`Art created successfully by userId=${userId}, title=${dto.title}`);

      return res
        .status(HttpStatus.CREATED)
        .json({ message: ARTMESSAGES.CREATE_SUCCESS, data: createdArt });
    } catch (error) {
      logger.error("Error in createArt", error);
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
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      logger.info(`Updating art id=${id} with data=${JSON.stringify(updateData)}`);

      // TODO: Replace with actual DB/service call
      return res.status(HttpStatus.OK).json({
        message: ARTMESSAGES.UPDATE_SUCCESS,
        data: updateData,
      });
    } catch (error) {
      logger.error("Error in updateArt", error);
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
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      logger.info(`Deleting art id=${id}`);

      // TODO: Replace with actual DB/service call
      return res.status(HttpStatus.OK).json({ message: ARTMESSAGES.DELETE_SUCCESS });
    } catch (error) {
      logger.error("Error in deleteArt", error);
      next(error);
    }
  };
}
