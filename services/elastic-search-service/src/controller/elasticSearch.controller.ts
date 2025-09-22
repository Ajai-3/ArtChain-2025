import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "art-chain-shared";
import { UserElasticService } from "../services/userElastic.service";
import { ArtElasticService } from "../services/artElastic.service";
import { ELASTIC_MESSAGES } from "../constants/elasticMesages.constants";
import { logger } from "../utils/logger";

const userService = new UserElasticService();
const artService = new ArtElasticService();

export class ElasticSearchController {
  //# ================================================================================================================
  //# GET /elastic/search?q=<query>&type=<user|art|all>
  //# Query params: q → search string, type → optional ('user', 'art', 'all')
  //# Unified search for users and arts
  //# ================================================================================================================
  search = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const q = (req.query.q as string)?.trim();
      const type = (req.query.type as string)?.toLowerCase() || "all";

      if (!q) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: ELASTIC_MESSAGES.QUERY_REQUIRED });
      }

      let results;
      if (type === "user") {
        results = await userService.searchForUser(q);
      } else if (type === "art") {
        results = await artService.searchForArt(q);
      } else {
        const [users, arts] = await Promise.all([
          userService.searchForUser(q),
          artService.searchForArt(q),
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
