import { Request, Response, NextFunction } from "express";
import { UploadProfileImage } from "../../application/usecases/UploadProfileImage";
import { UploadArtImage } from "../../application/usecases/UploadArtImage";
import { UploadBannerImage } from "../../application/usecases/UploadBannerImage";
import { IUploadController } from "../interface/IUploadController";
import { UploadFileDTO } from "../../domain/dto/UploadFileDTO";
import { logger } from "../../infrastructure/utils/logger";
import { validateUpload } from "../validations/validateUpload";
import { HttpStatus } from "art-chain-shared";
import { UPLOAD_MESSAGES } from "../../constants/uploadMessages";
import { UploadBackGroundImage } from "../../application/usecases/UploadBackGroundImage";

export class UploadController implements IUploadController {
  constructor(
    private readonly _uploadProfileImage: UploadProfileImage,
    private readonly _uploadBannerImage: UploadBannerImage,
    private readonly _uploadArtImage: UploadArtImage,
    private readonly _uploadBackgoundImage: UploadBackGroundImage
  ) {}

  //# =============================================================================================================
  //# UPLOAD PROFILE
  //# =============================================================================================================
  //# POST /api/v1/upload/profile //# Request headers: x-user-id
  //# Request body: multipart/form-data { file }
  //# Uploads a profile picture for the current user.
  //# =============================================================================================================
  uploadProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      
      const { userId, file, previousFileUrl } = validateUpload(req, "profile");

      console.log(previousFileUrl)

      const dto: UploadFileDTO = {
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
        userId,
        previousFileUrl
      };

      const result = await this._uploadProfileImage.execute(dto);

      logger.info(
        `Profile image uploaded successfully | userId=${userId} | file=${file.originalname}`
      );

      res
        .status(HttpStatus.CREATED)
        .json({ message: UPLOAD_MESSAGES.PROFILE_UPLOAD_SUCCESS, result });
    } catch (error: any) {
      logger.error(`Upload profile error | message=${error.message}`);
      next(error);
    }
  };

  //# =============================================================================================================
  //# UPLOAD BANNER
  //# =============================================================================================================
  //# POST /api/v1/upload/banner
  //# Request headers: x-user-id
  //# Request body: multipart/form-data { file }
  //# Uploads a banner image for the current user.
  //# =============================================================================================================
  uploadBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, file } = validateUpload(req, "banner");

      const dto: UploadFileDTO = {
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
        userId,
      };

      const result = await this._uploadBannerImage.execute(dto);

      logger.info(
        `Banner image uploaded successfully | userId=${userId} | file=${file.originalname}`
      );

      res
        .status(HttpStatus.CREATED)
        .json({ message: UPLOAD_MESSAGES.BANNER_UPLOAD_SUCCESS, result });
    } catch (error: any) {
      logger.error(`Upload banner error | message=${error.message}`);
      next(error);
    }
  }

  uploadBackgroundImage  = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, file } = validateUpload(req, "backgound");

      const dto: UploadFileDTO = {
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
        userId,
      };

      const result = await this._uploadBackgoundImage.execute(dto);

      logger.info(
        `Backgound image uploaded successfully | userId=${userId} | file=${file.originalname}`
      );

      res
        .status(HttpStatus.CREATED)
        .json({ message: UPLOAD_MESSAGES.BANNER_UPLOAD_SUCCESS, result });
    } catch (error: any) {
      logger.error(`Upload Backgound error | message=${error.message}`);
      next(error);
    }
  }

  //# =============================================================================================================
  //# UPLOAD ART
  //# =============================================================================================================
  //# POST /api/v1/upload/art
  //# Request headers: x-user-id
  //# Request body: multipart/form-data { file }
  //# Uploads an artwork image for the current user.
  //# =============================================================================================================
  uploadArt = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
       const s = req.headers['x-user-id']
    console.log(s)
      const { userId, file } = validateUpload(req, "art");
      logger.info(`Art upload request recived ${userId} ${file}`)


      const dto: UploadFileDTO = {
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
        userId,
      };

      const result = await this._uploadArtImage.execute(dto);

      logger.info(`${JSON.stringify(result)}`)
      logger.info(
        `Art image uploaded successfully | userId=${userId} | file=${file.originalname}`
      );

      res
        .status(HttpStatus.CREATED)
        .json({ data: result, message: UPLOAD_MESSAGES.ART_UPLOAD_SUCCESS});
    } catch (error: any) {
      logger.error(`Upload art error | message=${error.message}`);
      next(error);
    }
  }
}
