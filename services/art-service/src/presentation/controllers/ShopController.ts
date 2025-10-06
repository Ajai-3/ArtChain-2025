import { Request, Response, NextFunction } from "express";
import { IShopController } from "../interface/IShopController";
import { GetShopArtsByUserUseCase } from "../../application/usecase/art/GetShopArtsByUserUseCase";
import { GetAllShopArtsUseCase } from "../../application/usecase/art/GetAllShopArtsUseCase";
import { logger } from "../../utils/logger";

export class ShopController implements IShopController {
  constructor(
    private readonly _getAllShopArtsUseCase: GetAllShopArtsUseCase,
    private readonly _getShopArtsByUserUseCase: GetShopArtsByUserUseCase
  ) {}

  //# ================================================================================================================
  //# GET ALL SHOP ITEMS
  //# ================================================================================================================
  //# GET /api/v1/art/shop
  //# Query Params: page, limit, filters (category, priceOrder, titleOrder, minPrice, maxPrice)
  //# Returns a paginated list of all shop items with optional filters.
  //# ================================================================================================================
  getAllShopItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const {
        page = 1,
        limit = 10,
        priceOrder,
        titleOrder,
        minPrice,
        maxPrice,
      } = req.query;

      let category: string[] | undefined;

      if (req.query["category[]"]) {
        category = Array.isArray(req.query["category[]"])
          ? (req.query["category[]"] as string[])
          : [req.query["category[]"] as string];
      } else if (req.query.category) {
        category = Array.isArray(req.query.category)
          ? (req.query.category as string[])
          : [req.query.category as string];
      }

      const filters = {
        category,
        priceOrder: priceOrder as "asc" | "desc" | undefined,
        titleOrder: titleOrder as "asc" | "desc" | undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      };

      logger.info("Fetching all shop items", { page, limit, filters });

      const arts = await this._getAllShopArtsUseCase.execute(
        Number(page),
        Number(limit),
        filters
      );

      return res.status(200).json({
        success: true,
        data: arts,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      logger.error("Error in getAllShopItems", { error });
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET SHOP ITEMS BY USER
  //# ================================================================================================================
  //# GET /api/v1/art/shop/:userId
  //# Query Params: page, limit
  //# Returns a paginated list of shop items uploaded by a specific user.
  //# ================================================================================================================
  getShopItemsByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      logger.info("Fetching shop items by user", { userId, page, limit });

      const arts = await this._getShopArtsByUserUseCase.execute(
        userId,
        Number(page),
        Number(limit)
      );

      return res.status(200).json({
        success: true,
        data: arts,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      logger.error("Error in getShopItemsByUser", {
        error,
        userId: req.params.userId,
      });
      next(error);
    }
  };
}
