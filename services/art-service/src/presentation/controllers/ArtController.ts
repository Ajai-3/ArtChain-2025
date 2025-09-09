import { Request, Response, NextFunction } from "express";
import { IArtController } from "../interface/IArtController";
import { ARTMESSAGES } from "../../constants/ArtMessages";
import { CreateArtPostUseCase } from "../../application/usecase/CreateArtPostUseCase";

export class ArtController implements IArtController {
  constructor(private readonly _createArtUseCase: CreateArtPostUseCase){}


  //# ================================================================================================================
//# GET ALL ART
//# ================================================================================================================
//# GET /api/v1/art
//# Query params: page (number), limit (number)
//# This controller fetches all art items with pagination support.
//# ================================================================================================================
getAllArt = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // TODO: Replace with actual DB/service call to fetch paginated art
    return res.json({
      message: ARTMESSAGES.FETCH_ALL_SUCCESS,
      page,
      limit,
      data: [] 
    });
  } catch (error) {
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
  getArtById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      // TODO: Replace with actual DB/service call
      return res.json({ message: `${ARTMESSAGES.FETCH_BY_ID_SUCCESS} ${id}` });
    } catch (error) {
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
  createArt = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const artData = req.body;
      const createdArt = await this._createArtUseCase.execute(artData);
      return res.status(201).json({ message: ARTMESSAGES.CREATE_SUCCESS , data: artData });
    } catch (error) {
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
  updateArt = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // TODO: Replace with actual DB/service call
      return res.json({ message: ARTMESSAGES.UPDATE_SUCCESS, data: updateData });
    } catch (error) {
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
  deleteArt = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;
      // TODO: Replace with actual DB/service call
      return res.json({ message: ARTMESSAGES.DELETE_SUCCESS });
    } catch (error) {
      next(error);
    }
  };
}
