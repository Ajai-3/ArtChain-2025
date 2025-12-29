import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { IAdminPlatformConfigController } from "../interface/IAdminPlatformConfigController";
import { IGetPlatformConfigUseCase } from "../../application/interface/usecase/admin/IGetPlatformConfigUseCase";
import { IUpdatePlatformConfigUseCase } from "../../application/interface/usecase/admin/IUpdatePlatformConfigUseCase";
import { TYPES } from "../../infrastructure/Inversify/types";
import { platformConfigSchema } from "../validators/PlatformConfigSchema";
import { UpdatePlatformConfigDTO } from "../../application/interface/dto/admin/UpdatePlatformConfigDTO";
import { validateWithZod } from "../../utils/validateWithZod";
import { HttpStatus } from "art-chain-shared";
import { PLATFORM_CONFIG_MESSAGES } from "../../constants/PlatformConfigMessages";

@injectable()
export class AdminPlatformConfigController implements IAdminPlatformConfigController {
  constructor(
    @inject(TYPES.IGetPlatformConfigUseCase)
    private readonly _getPlatformConfigUseCase: IGetPlatformConfigUseCase,
    @inject(TYPES.IUpdatePlatformConfigUseCase)
    private readonly _updatePlatformConfigUseCase: IUpdatePlatformConfigUseCase
  ) {}

  //# ================================================================================================================
  //# GET PLATFORM CONFIG
  //# ================================================================================================================
  //# GET /api/v1/art/admin/platform-config
  //# Request headers: x-admin-id
  //# This controller fetches the global platform configuration.
  //# ================================================================================================================
  getConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const config = await this._getPlatformConfigUseCase.execute();

      console.log("haii")
      res.status(HttpStatus.OK).json({ 
          message: PLATFORM_CONFIG_MESSAGES.FETCH_SUCCESS, 
          data: config 
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# UPDATE PLATFORM CONFIG
  //# ================================================================================================================
  //# PATCH /api/v1/art/admin/platform-config
  //# Request body: { commissionPercentage }
  //# This controller updates the global platform configuration.
  //# ================================================================================================================
  updateConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parseResult = validateWithZod(platformConfigSchema, req.body);
      
      const dto: UpdatePlatformConfigDTO = { ...parseResult };

      const config = await this._updatePlatformConfigUseCase.execute(dto);
      res.status(HttpStatus.OK).json({ 
          message: PLATFORM_CONFIG_MESSAGES.UPDATE_SUCCESS, 
          data: config 
      });
    } catch (error) {
      next(error);
    }
  };
}
