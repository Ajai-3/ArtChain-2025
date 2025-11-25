import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAdminAIController } from "../interface/IAdminAIController";
import { IUpdateAIConfigUseCase } from "../../application/interface/usecase/ai/admin/IUpdateAIConfigUseCase";
import { IGetAIConfigsUseCase } from "../../application/interface/usecase/ai/admin/IGetAIConfigsUseCase";
import { IGetAIAnalyticsUseCase } from "../../application/interface/usecase/ai/admin/IGetAIAnalyticsUseCase";
import { AIProviderService } from "../../infrastructure/service/AIProviderService";
import { HttpStatus } from "art-chain-shared";

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
        message: "Analytics fetched successfully",
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
          message: "Provider is required"
        });
        return;
      }

      const result = await this._updateAIConfigUseCase.execute(provider, updates);

      res.status(HttpStatus.OK).json({
        message: "Config updated successfully",
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
        message: "Configs fetched successfully",
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
          message: "Provider is required"
        });
        return;
      }

      const isConnected = await this._aiProviderService.testProvider(provider);

      res.status(HttpStatus.OK).json({
        message: "Provider connection tested",
        data: { isConnected }
      });
    } catch (error) {
      next(error);
    }
  };
}
