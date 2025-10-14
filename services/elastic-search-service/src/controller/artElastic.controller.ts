import { logger } from "../utils/logger";
import { TYPES } from "../invectify/types";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { IArtElasticService } from "../interface/IArtElasticService";
import { ELASTIC_MESSAGES } from "../constants/elasticMesages.constants";
import { IArtElasticController } from "../interface/IArtElasticController";

@injectable()
export class ArtElasticController implements IArtElasticController {
  constructor(
    @inject(TYPES.IArtElasticService)
    private readonly _artService: IArtElasticService
  ) {}

  //# ================================================================================================================
  //# INDEX ART
  //# ================================================================================================================
  //# POST /elastic/arts
  //# Request body: IndexedArtDto
  //# Adds a new art document in Elasticsearch (after upload or update).
  //# ================================================================================================================
  indexArt = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this._artService.addArt(req.body);
      logger.info(ELASTIC_MESSAGES.ART_INDEX_SUCCESS);
      res
        .status(HttpStatus.CREATED)
        .json({ message: ELASTIC_MESSAGES.ART_INDEX_SUCCESS });
    } catch (err: any) {
      logger.error(ELASTIC_MESSAGES.ART_INDEX_FAILURE, err);
      next(err);
    }
  };

  //# ================================================================================================================
  //# UPDATE ART
  //# ================================================================================================================
  //# PUT /elastic/arts
  //# Request body: IndexedArtDto
  //# Updates an existing art document in Elasticsearch.
  //# ================================================================================================================
  updateArt = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this._artService.updateArt(req.body);
      logger.info(ELASTIC_MESSAGES.ART_INDEX_UPDATED_SUCCESS);
      res
        .status(HttpStatus.OK)
        .json({ message: ELASTIC_MESSAGES.ART_INDEX_UPDATED_SUCCESS });
    } catch (err: any) {
      logger.error(ELASTIC_MESSAGES.ART_INDEX_UPDATED_FAILURE, err);
      next(err);
    }
  };

  //# ================================================================================================================
  //# SEARCH ARTS
  //# ================================================================================================================
  //# GET /elastic/arts/search?q=<query>
  //# Query params: { q: string }
  //# Allows clients to search arts in Elasticsearch.
  //# Returns: Array of art objects.
  //# ================================================================================================================
  searchArts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const q = (req.query.q as string)?.trim();
      if (!q) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
        return;
      }
      const results = await this._artService.searchForArt(q);
      logger.info(
        `${ELASTIC_MESSAGES.SEARCH_SUCCESS}: ${JSON.stringify(results)}`
      );
      res.json(results);
    } catch (err: any) {
      logger.error(ELASTIC_MESSAGES.SEARCH_FAILURE, err);
      next(err);
    }
  };

  //# ================================================================================================================
  //# ADMIN SEARCH ARTS
  //# ================================================================================================================
  //# GET /elastic/arts/admin/search?q=<query>
  //# Query params: { q: string }
  //# Admin-only: Searches arts in Elasticsearch and returns { artIds: string[] }
  //# ================================================================================================================
  adminSearchArts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const q = (req.query.q as string)?.trim();
      if (!q) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
        return;
      }
      const ids = await this._artService.adminSearch(q);
      logger.info(
        `${ELASTIC_MESSAGES.ADMIN_SEARCH_SUCCESS}: ${JSON.stringify(ids)}`
      );
      res.json({ artIds: ids });
    } catch (err: any) {
      logger.error(ELASTIC_MESSAGES.ADMIN_SEARCH_FAILURE, err);
      next(err);
    }
  };
}
