import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAIController } from "../interface/IAIController";
import { IGenerateAIImageUseCase } from "../../application/interface/usecase/ai/IGenerateAIImageUseCase";
import { IGetMyAIGenerationsUseCase } from "../../application/interface/usecase/ai/IGetMyAIGenerationsUseCase";
import { ICheckAIQuotaUseCase } from "../../application/interface/usecase/ai/ICheckAIQuotaUseCase";
import { IGetEnabledAIConfigsUseCase } from "../../application/interface/usecase/ai/IGetEnabledAIConfigsUseCase";
import { IDeleteAIGenerationUseCase } from "../../application/interface/usecase/ai/IDeleteAIGenerationUseCase";
import { HttpStatus } from "art-chain-shared";
import { validateWithZod } from "../../utils/validateWithZod";
import { generateAIImageSchema } from "../validators/ai.schema";
import { GenerateAIImageDTO } from "../../application/interface/dto/ai/GenerateAIImageDTO";
import { AI_MESSAGES } from "../../constants/AIMessages";
import { ERROR_MESSAGES } from "../../constants/ErrorMessages";

@injectable()
export class AIController implements IAIController {
  constructor(
    @inject(TYPES.IGenerateAIImageUseCase) private readonly _generateAIImageUseCase: IGenerateAIImageUseCase,
    @inject(TYPES.IGetMyAIGenerationsUseCase) private readonly _getMyAIGenerationsUseCase: IGetMyAIGenerationsUseCase,
    @inject(TYPES.ICheckAIQuotaUseCase) private readonly _checkAIQuotaUseCase: ICheckAIQuotaUseCase,
    @inject(TYPES.IGetEnabledAIConfigsUseCase) private readonly _getEnabledAIConfigsUseCase: IGetEnabledAIConfigsUseCase,
    @inject(TYPES.IDeleteAIGenerationUseCase) private readonly _deleteAIGenerationUseCase: IDeleteAIGenerationUseCase
  ) {}

  generateImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.UNAUTHORIZED_MISSING_HEADER
        });
        return;
      }

      const validatedData = validateWithZod(generateAIImageSchema, req.body);

      const dto: GenerateAIImageDTO = {
        ...validatedData,
        userId
      };

      const result = await this._generateAIImageUseCase.execute(dto);

      res.status(HttpStatus.CREATED).json({
        message: AI_MESSAGES.IMAGE_GENERATED_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getMyGenerations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.UNAUTHORIZED_MISSING_HEADER
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this._getMyAIGenerationsUseCase.execute(userId, page, limit);

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.GENERATIONS_FETCHED_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  checkQuota = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.UNAUTHORIZED_MISSING_HEADER
        });
        return;
      }

      const result = await this._checkAIQuotaUseCase.execute(userId);

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.QUOTA_CHECKED_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getEnabledConfigs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._getEnabledAIConfigsUseCase.execute();

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.CONFIGS_FETCHED_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  deleteGeneration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers["x-user-id"] as string;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.UNAUTHORIZED_MISSING_HEADER
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Generation ID is required"
        });
        return;
      }

      await this._deleteAIGenerationUseCase.execute(id, userId);

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.GENERATION_DELETED_SUCCESS
      });
    } catch (error) {
      next(error);
    }
  };
}
