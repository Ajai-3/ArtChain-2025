import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "art-chain-shared";
import { UserElasticService } from "../services/userElastic.service";
import { ELASTIC_MESSAGES } from "../constants/elasticMesages.constants";
import { IUserElasticController } from "../interface/IUserElasticController";

const service = new UserElasticService();

export class UserElasticController implements IUserElasticController {
  //# ================================================================================================================
  //# START INDEX USER
  //# ================================================================================================================
  //# POST /elastic/users
  //# Request body: IndexedUserDto
  //# This endpoint indexes (adds/updates) a user document in Elasticsearch.
  //# Used typically after user registration or profile update.
  //# ================================================================================================================
  async indexUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await service.addUser(req.body);
      res.status(HttpStatus.CREATED).json({ message: ELASTIC_MESSAGES.INDEX_SUCCESS });
    } catch (err: any) {
      next(err)
    }
  }

  //# ================================================================================================================
  //# START USER SEARCH
  //# ================================================================================================================
  //# GET /elastic/users/search?q=<query>
  //# Query params: { q: string }
  //# This endpoint allows client (user side) to search users in Elasticsearch.
  //# Returns: Array of matched user objects with { id, username, name, email, createdAt }.
  //# ================================================================================================================
  async searchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string)?.trim();
      if (!q) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
        return;
      }
      const results = await service.searchForUser(q);
      res.json(results);
    } catch (err: any) {
      next(err)
    }
  }

  //# ================================================================================================================
  //# START ADMIN SEARCH USERS
  //# ================================================================================================================
  //# GET /elastic/users/admin/search?q=<query>
  //# Query params: { q: string }
  //# This endpoint allows admin side to search users in Elasticsearch.
  //# Returns: { userIds: string[] } → Admin uses these IDs to fetch fresh data from the DB.
  //# ================================================================================================================
  async adminSearchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string)?.trim();
      if (!q) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
        return;
      }
      const ids = await service.adminSearch(q);
      res.json({ userIds: ids });
    } catch (err: any) {
      next(err)
    }
  }
}
