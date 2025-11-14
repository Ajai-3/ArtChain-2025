import { logger } from "../utils/logger";
import { TYPES } from "../Inversify/types";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { IArtElasticService } from "../interface/IArtElasticService";
import { IUserElasticService } from "../interface/IUserElasticService";
import { ELASTIC_MESSAGES } from "../constants/elasticMesages.constants";
import { IElasticSearchController } from "../interface/IElasticSearchController";

@injectable()
export class ElasticSearchController implements IElasticSearchController {
  constructor(
    @inject(TYPES.IArtElasticService)
    private readonly _artService: IArtElasticService,
    @inject(TYPES.IUserElasticService)
    private readonly _userService: IUserElasticService
  ) {}
  //# ================================================================================================================
  //# SEARCH ART AND USER
  //# ================================================================================================================
  //# GET /elastic/search?q=<query>&type=<user|art|all>
  //# Query params: q → search string, type → optional ('user', 'art', 'all')
  //# Unified search for users and arts
  //# ================================================================================================================
  search = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const q = (req.query.q as string)?.trim();
      const type = (req.query.type as string)?.toLowerCase() || "all";

      if (!q) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
      }

      let results;
      if (type === "user") {
        results = await this._userService.searchForUser(q);
      } else if (type === "art") {
        results = await this._artService.searchForArt(q);
      } else {
        const [users, arts] = await Promise.all([
          this._userService.searchForUser(q),
          this._artService.searchForArt(q),
        ]);
        results = { users, arts };
      }

      logger.info(`Unified Search [type=${type}]: ${JSON.stringify(results)}`);
      res.json(results);
    } catch (err: any) {
      logger.error("Unified search failed", err);
      next(err);
    }
  };
}
