import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "art-chain-shared";
import { UserElasticService } from "../services/userElastic.service";
import { ELASTIC_MESSAGES } from "../constants/elasticMesages.constants";
import { IUserElasticController } from "../interface/IUserElasticController";
import { logger } from "../utils/logger";

const service = new UserElasticService();

export class UserElasticController implements IUserElasticController {
  //# ================================================================================================================
  //# POST /elastic/users → INDEX USER
  //# Request body: IndexedUserDto
  //# Adds a new user document in Elasticsearch (after registration or profile update).
  //# ================================================================================================================
  indexUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await service.addUser(req.body);
      logger.info("Index created");
      res.status(HttpStatus.CREATED).json({ message: ELASTIC_MESSAGES.INDEX_SUCCESS });
    } catch (err: any) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# PUT /elastic/users → UPDATE USER
  //# Request body: IndexedUserDto
  //# Updates existing user document in Elasticsearch.
  //# ================================================================================================================
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await service.updateUser(req.body);
      logger.info(`User index updated ${JSON.stringify(user)}`);
      res.status(HttpStatus.CREATED).json({ message: ELASTIC_MESSAGES.INDEX_UPDATED_SUCCESS });
    } catch (err: any) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# GET /elastic/users/search?q=<query> → SEARCH USERS
  //# Query params: { q: string }
  //# Allows client-side search for users in Elasticsearch.
  //# Returns: Array of matched users { id, username, name, email, createdAt }.
  //# ================================================================================================================
  searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = (req.query.q as string)?.trim();
      if (!q) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
        return;
      }
      const results = await service.searchForUser(q);
      logger.info(`Search result: ${JSON.stringify(results)}`);
      res.json(results);
    } catch (err: any) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# GET /elastic/users/admin/search?q=<query> → ADMIN SEARCH USERS
  //# Query params: { q: string }
  //# Admin-only search: returns { userIds: string[] } to fetch fresh data from DB.
  //# ================================================================================================================
  adminSearchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = (req.query.q as string)?.trim();
      if (!q) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
        return;
      }
      const ids = await service.adminSearch(q);
      logger.info(`Admin Search result: ${JSON.stringify(ids)}`);
      res.json({ userIds: ids });
    } catch (err: any) {
      next(err);
    }
  };
}
