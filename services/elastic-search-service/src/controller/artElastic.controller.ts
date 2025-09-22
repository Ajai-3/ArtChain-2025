import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "art-chain-shared";
import { ArtElasticService } from "../services/artElastic.service";
import { ELASTIC_MESSAGES } from "../constants/elasticMesages.constants";
import { logger } from "../utils/logger";
import { IArtElasticController } from "../interface/IArtElasticController";

const service = new ArtElasticService();

export class ArtElasticController implements IArtElasticController {
  //# ================================================================================================================
  //# POST /elastic/arts → INDEX ART
  //# Request body: IndexedArtDto
  //# Adds a new art document in Elasticsearch (after upload or update).
  //# ================================================================================================================
  indexArt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await service.addArt(req.body);
      logger.info(ELASTIC_MESSAGES.ART_INDEX_SUCCESS);
      res.status(HttpStatus.CREATED).json({ message: ELASTIC_MESSAGES.ART_INDEX_SUCCESS });
    } catch (err: any) {
      logger.error(ELASTIC_MESSAGES.ART_INDEX_FAILURE, err);
      next(err);
    }
  };

  //# ================================================================================================================
  //# PUT /elastic/arts → UPDATE ART
  //# Request body: IndexedArtDto
  //# Updates an existing art document in Elasticsearch.
  //# ================================================================================================================
  updateArt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await service.updateArt(req.body);
      logger.info(ELASTIC_MESSAGES.ART_INDEX_UPDATED_SUCCESS);
      res.status(HttpStatus.OK).json({ message: ELASTIC_MESSAGES.ART_INDEX_UPDATED_SUCCESS });
    } catch (err: any) {
      logger.error(ELASTIC_MESSAGES.ART_INDEX_UPDATED_FAILURE, err);
      next(err);
    }
  };

  //# ================================================================================================================
  //# GET /elastic/arts/search?q=<query> → SEARCH ARTS
  //# Query params: { q: string }
  //# Allows clients to search arts in Elasticsearch.
  //# Returns: Array of art objects.
  //# ================================================================================================================
  searchArts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = (req.query.q as string)?.trim();
      if (!q) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
        return;
      }
      const results = await service.searchForArt(q);
      logger.info(`${ELASTIC_MESSAGES.SEARCH_SUCCESS}: ${JSON.stringify(results)}`);
      res.json(results);
    } catch (err: any) {
      logger.error(ELASTIC_MESSAGES.SEARCH_FAILURE, err);
      next(err);
    }
  };

  //# ================================================================================================================
  //# GET /elastic/arts/admin/search?q=<query> → ADMIN SEARCH ARTS
  //# Query params: { q: string }
  //# Admin-only: Searches arts in Elasticsearch and returns { artIds: string[] }
  //# ================================================================================================================
  adminSearchArts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = (req.query.q as string)?.trim();
      if (!q) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
        return;
      }
      const ids = await service.adminSearch(q);
      logger.info(`${ELASTIC_MESSAGES.ADMIN_SEARCH_SUCCESS}: ${JSON.stringify(ids)}`);
      res.json({ artIds: ids });
    } catch (err: any) {
      logger.error(ELASTIC_MESSAGES.ADMIN_SEARCH_FAILURE, err);
      next(err);
    }
  };
}
