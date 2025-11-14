import { logger } from "../utils/logger";
import { TYPES } from "../Inversify/types";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { IUserElasticService } from "../interface/IUserElasticService";
import { ELASTIC_MESSAGES } from "../constants/elasticMesages.constants";
import { IUserElasticController } from "../interface/IUserElasticController";

@injectable()
export class UserElasticController implements IUserElasticController {
  constructor(
    @inject(TYPES.IUserElasticService)
    private readonly _userService: IUserElasticService
  ) {}

  //# ================================================================================================================
  //# INDEX USER
  //# ================================================================================================================
  //# POST /elastic/users
  //# Request body: IndexedUserDto
  //# Adds a new user document in Elasticsearch (after registration or profile update).
  //# ================================================================================================================
  indexUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this._userService.addUser(req.body);
      logger.info("Index created");
      res
        .status(HttpStatus.CREATED)
        .json({ message: ELASTIC_MESSAGES.INDEX_SUCCESS });
    } catch (err: any) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# UPDATE USER
  //# ================================================================================================================
  //# PUT /elastic/users
  //# Request body: IndexedUserDto
  //# Updates existing user document in Elasticsearch.
  //# ================================================================================================================
  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this._userService.updateUser(req.body);
      logger.info(`User index updated ${JSON.stringify(user)}`);
      res
        .status(HttpStatus.CREATED)
        .json({ message: ELASTIC_MESSAGES.INDEX_UPDATED_SUCCESS });
    } catch (err: any) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# SEARCH USERS
  //# ================================================================================================================
  //# GET /elastic/users/search?q=<query>
  //# Query params: { q: string }
  //# Allows client-side search for users in Elasticsearch.
  //# Returns: Array of matched users { id, username, name, email, createdAt }.
  //# ================================================================================================================
  searchUsers = async (
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
      const results = await this._userService.searchForUser(q);
      logger.info(`Search result: ${JSON.stringify(results)}`);
      res.json(results);
    } catch (err: any) {
      next(err);
    }
  };

  //# ================================================================================================================
  //# ADMIN SEARCH USERS
  //# ================================================================================================================
  //# GET /elastic/users/admin/search?q=<query>
  //# Query params: { q: string }
  //# Admin-only search: returns { userIds: string[] } to fetch fresh data from DB.
  //# ================================================================================================================
  adminSearchUsers = async (
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
      const ids = await this._userService.adminSearch(q);
      logger.info(`Admin Search result: ${JSON.stringify(ids)}`);
      res.json({ userIds: ids });
    } catch (err: any) {
      next(err);
    }
  };
}
