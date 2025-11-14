import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/Inversify/types";
import { validateWithZod } from "../../utils/validateWithZod";
import { CATEGORY_MESSAGES } from "../../constants/categoryMessages";
import { editCategorySchema } from "../validators/editCategorySchema";
import { ICategoryController } from "../interface/ICategoryController";
import { EditCategoryDTO } from "../../application/interface/dto/category/EditCategoryDTO";
import { IGetAllCategoryUseCase } from "../../application/interface/usecase/category/IGetAllCategoryUseCase";
import { IEditCategoryUseCase } from "../../application/interface/usecase/category/IEditCategoryUseCase";
import { ICreateCategoryUseCase } from "../../application/interface/usecase/category/ICreateCategoryUseCase";

@injectable()
export class CategoryController implements ICategoryController {
  constructor(
    @inject(TYPES.IGetAllCategoryUseCase)
    private readonly _getAllCategoryUseCase: IGetAllCategoryUseCase,
    @inject(TYPES.ICreateCategoryUseCase)
    private readonly _createCategoryUseCase: ICreateCategoryUseCase,
    @inject(TYPES.IEditCategoryUseCase)
    private readonly _editCategoryUseCase: IEditCategoryUseCase
  ) {}

  //# ================================================================================================================
  //# GET CATEGORIES
  //# ================================================================================================================
  //# Endpoint: GET /api/v1/art/category
  //# Query params: page, limit, search, status filter, and count filter
  //# This controller Fetches categories with pagination and optional status filter.
  //# ================================================================================================================
  getCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const countFilter = req.query.count
        ? parseInt(req.query.count as string)
        : undefined;

      const { data, total } = await this._getAllCategoryUseCase.execute(
        page,
        limit,
        search,
        status,
        countFilter
      );

      return res
        .status(HttpStatus.OK)
        .json({ message: CATEGORY_MESSAGES.FETCH_SUCCESS, data, total });
    } catch (error) {
      logger.error("Error in getting categories", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# CREATE CATEGORY
  //# ================================================================================================================
  //# Endpoint: POST /api/v1/art/category
  //# Request body: { name }
  //# This controller Creates a new category document for artworks.
  //# ================================================================================================================
  createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name } = req.body;

      const category = await this._createCategoryUseCase.execute(name);

      return res
        .status(HttpStatus.CREATED)
        .json({ message: CATEGORY_MESSAGES.CREATE_SUCCESS, category });
    } catch (error) {
      logger.error("Error in creating category", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# EDIT CATEGORY
  //# ================================================================================================================
  //# Endpoint: PATCH /api/v1/art/category
  //# Req params: id (category id)
  //# Request body: { name, count }
  //# This controller Updates the name or details of an existing category.
  //# ================================================================================================================
  editCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const id = req.params.id;

      const result = validateWithZod(editCategorySchema, req.body);

      const dto: EditCategoryDTO = { ...result, id };
      const category = await this._editCategoryUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json({ message: CATEGORY_MESSAGES.UPDATE_SUCCESS, category });
    } catch (error) {
      logger.error("Error in editing category", error);
      next(error);
    }
  };
}
