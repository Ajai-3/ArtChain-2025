import { Request, Response, NextFunction } from "express";
import { ICategoryController } from "../interface/ICategoryController";
import { logger } from "../../utils/logger";

export class CategoryController implements ICategoryController {
    
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
    } catch (error) {
        logger.error("Error in getting categories", error)
        next(error)
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
    } catch (error) {
        logger.error("Error in creating category", error)
        next(error)
    }
  };

  //# ================================================================================================================
  //# EDIT CATEGORY
  //# ================================================================================================================
  //# Endpoint: PATCH /api/v1/art/category
  //# Request body: { name }
  //# This controller Updates the name or details of an existing category.
  //# ================================================================================================================
  editCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
    } catch (error) {
        logger.error("Error in editing category", error)
        next(error)
    }
  };

  //# ================================================================================================================
  //# TOGGLE CATEGORY STATUS
  //# ================================================================================================================
  //# Endpoint: PATCH /api/v1/art/category-toggle
  //# Request body: { status }
  //# This controller Toggles the status of a category between active and inactive.
  //# ================================================================================================================
  toggleCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
    } catch (error) {
        logger.error("Error chaging the status of the category", error)
        next(error)
    }
  };
}
