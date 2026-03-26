import { injectable, inject } from 'inversify';
import { HttpStatus } from 'art-chain-shared';
import { AI_MESSAGES } from '../../constants/AIMessages';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../infrastructure/Inversify/types';
import { ERROR_MESSAGES } from '../../constants/ErrorMessages';
import { IAdminAIController } from '../interface/IAdminAIController';
import { AIProviderService } from '../../infrastructure/service/AIProviderService';
import { IGetAIConfigsUseCase } from '../../application/interface/usecase/ai/admin/IGetAIConfigsUseCase';
import { IUpdateAIConfigUseCase } from '../../application/interface/usecase/ai/admin/IUpdateAIConfigUseCase';
import { IGetAIAnalyticsUseCase } from '../../application/interface/usecase/ai/admin/IGetAIAnalyticsUseCase';

@injectable()
export class AdminAIController implements IAdminAIController {
  constructor(
    @inject(TYPES.IUpdateAIConfigUseCase)
    private readonly _updateAIConfigUseCase: IUpdateAIConfigUseCase,
    @inject(TYPES.IGetAIConfigsUseCase)
    private readonly _getAIConfigsUseCase: IGetAIConfigsUseCase,
    @inject(TYPES.IGetAIAnalyticsUseCase)
    private readonly _getAIAnalyticsUseCase: IGetAIAnalyticsUseCase,
    @inject(TYPES.AIProviderService)
    private readonly _aiProviderService: AIProviderService,
  ) {}

  //# ================================================================================================================
  //# GET ANALYTICS
  //# ================================================================================================================
  //# GET /api/v1/admin/ai/analytics
  //# This endpoint allows admin to fetch AI-related analytics such as total generations and active models.
  //# =================================================================================================================
  getAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this._getAIAnalyticsUseCase.execute();
      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.ANALYTICS_FETCHED_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# UPDATE AI CONFIG
  //# ================================================================================================================
  //# PUT /api/v1/admin/ai/config
  //# This endpoint allows admin to update AI provider configurations such as API keys and enabled status.
  //# ================================================================================================================
  updateConfig = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { provider, ...updates } = req.body;

      if (!provider) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: ERROR_MESSAGES.PROVIDER_REQUIRED,
        });
        return;
      }

      const result = await this._updateAIConfigUseCase.execute(
        provider,
        updates,
      );

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.CONFIG_UPDATED_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET AI CONFIGS
  //# ================================================================================================================
  //# GET /api/v1/admin/ai/configs
  //# This endpoint allows admin to fetch all AI provider configurations.
  //# ================================================================================================================
  getConfigs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this._getAIConfigsUseCase.execute();

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.ALL_CONFIGS_FETCHED_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# TEST AI PROVIDER
  //# ================================================================================================================
  //# POST /api/v1/admin/ai/test
  //# This endpoint allows admin to test the connectivity of an AI provider.
  //# ================================================================================================================
  testProvider = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { provider } = req.body;

      if (!provider) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: ERROR_MESSAGES.PROVIDER_REQUIRED,
        });
        return;
      }

      const isConnected = await this._aiProviderService.testProvider(provider);

      res.status(HttpStatus.OK).json({
        message: AI_MESSAGES.PROVIDER_TESTED_SUCCESS,
        data: { isConnected },
      });
    } catch (error) {
      next(error);
    }
  };
}
