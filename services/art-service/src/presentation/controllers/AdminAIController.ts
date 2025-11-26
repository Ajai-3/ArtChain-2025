import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAdminAIController } from "../interface/IAdminAIController";
import { IUpdateAIConfigUseCase } from "../../application/interface/usecase/ai/admin/IUpdateAIConfigUseCase";
import { IGetAIConfigsUseCase } from "../../application/interface/usecase/ai/admin/IGetAIConfigsUseCase";
import { IGetAIAnalyticsUseCase } from "../../application/interface/usecase/ai/admin/IGetAIAnalyticsUseCase";
import { AIProviderService } from "../../infrastructure/service/AIProviderService";
import { HttpStatus } from "art-chain-shared";
import { AI_MESSAGES } from "../../constants/AIMessages";
import { ERROR_MESSAGES } from "../../constants/ErrorMessages";

@injectable()
export class AdminAIController implements IAdminAIController {
  constructor(
    @inject(TYPES.IUpdateAIConfigUseCase) private readonly _updateAIConfigUseCase: IUpdateAIConfigUseCase,
    @inject(TYPES.IGetAIConfigsUseCase) private readonly _getAIConfigsUseCase: IGetAIConfigsUseCase,
    @inject(TYPES.IGetAIAnalyticsUseCase) private readonly _getAIAnalyticsUseCase: IGetAIAnalyticsUseCase,
    @inject(TYPES.AIProviderService) private readonly _aiProviderService: AIProviderService
  ) {}

  getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._getAIAnalyticsUseCase.execute();
      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.ANALYTICS_FETCHED_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  updateConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { provider, ...updates } = req.body;
      
      if (!provider) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: ERROR_MESSAGES.PROVIDER_REQUIRED
        });
        return;
      }

      const result = await this._updateAIConfigUseCase.execute(provider, updates);

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.CONFIG_UPDATED_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getConfigs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._getAIConfigsUseCase.execute();

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.ALL_CONFIGS_FETCHED_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  testProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { provider } = req.body;
      
      if (!provider) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: ERROR_MESSAGES.PROVIDER_REQUIRED
        });
        return;
      }

      const isConnected = await this._aiProviderService.testProvider(provider);

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.PROVIDER_TESTED_SUCCESS,
        data: { isConnected }
      });
    } catch (error) {
      next(error);
    }
  };
}
