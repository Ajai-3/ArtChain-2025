import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../infrastructure/utils/logger";
import { TYPES } from "../../infrastructure/inversify/types";
import { validateUpload } from "../validations/validateUpload";
import { UPLOAD_MESSAGES } from "../../constants/uploadMessages";
import { IUploadController } from "../interface/IUploadController";
import { mapFrontendType } from "../../infrastructure/utils/mapFrontendType";
import { UploadFileDTO } from "../../application/interface/dto/UploadFileDTO";
import { IUploadArtImage } from "../../application/interface/usecases/IUploadArtImage";
import { DeleteImageRequestDTO } from "../../application/interface/dto/DeleteImageRequestDTO";
import { IDeleteImageUseCase } from "../../application/interface/usecases/IDeleteImageUseCase";
import { IUploadImageUseCase } from "../../application/interface/usecases/IUploadImageUseCase";
import { IGetSignedUrlUseCase } from "../../application/interface/usecases/IGetSignedUrlUseCase";

@injectable()
export class UploadController implements IUploadController {
  constructor(
    @inject(TYPES.IUploadArtImage)
    private readonly _uploadArtImage: IUploadArtImage,
    @inject(TYPES.IUploadImageUseCase)
    private readonly _uploadImageUseCase: IUploadImageUseCase,
    @inject(TYPES.IDeleteImageUseCase)
    private readonly _deleteImageUseCase: IDeleteImageUseCase,
    @inject(TYPES.IGetSignedUrlUseCase)
    private readonly _getSignedUrlUseCase: IGetSignedUrlUseCase
  ) {}

  //# =============================================================================================================
  //# UPLOAD PROFILE RELATED IAMGES
  //# =============================================================================================================
  //# POST /api/v1/upload
  //# Request headers: x-user-id
  //# Request body: multipart/form-data { file }
  //# This controller will help to upload the profile related images like profile, banner, background images
  //# =============================================================================================================
  uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const fileType = mapFrontendType(req.body.type);
      const { userId, file, previousFileUrl } = validateUpload(req, fileType);

      const dto: UploadFileDTO = {
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
        userId,
        category: fileType,
        previousFileUrl,
      };

      const result = await this._uploadImageUseCase.execute(dto);

      logger.info(`${JSON.stringify(result)}`);
      logger.info(
        `Image uploaded successfully | userId=${userId} | file=${file.originalname}`
      );

      res
        .status(HttpStatus.CREATED)
        .json({ data: result, message: UPLOAD_MESSAGES.IMAGE_UPLOAD_SUCCESS });
    } catch (error: any) {
      logger.error(`Upload art error | message=${error.message}`);
      next(error);
    }
  };

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
      const { userId, file } = validateUpload(req, "art");
      logger.info(`Art upload request recived ${userId} ${file}`);

      const dto: UploadFileDTO = {
        fileBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
        category: "art",
        userId,
      };

      const result = await this._uploadArtImage.execute(dto);

      logger.info(`${JSON.stringify(result)}`);
      logger.info(
        `Art image uploaded successfully | userId=${userId} | file=${file.originalname}`
      );

      res
        .status(HttpStatus.CREATED)
        .json({ data: result, message: UPLOAD_MESSAGES.ART_UPLOAD_SUCCESS });
    } catch (error: any) {
      logger.error(`Upload art error | message=${error.message}`);
      next(error);
    }
  };

  //# =============================================================================================================
  //# DELETE IMAGE
  //# =============================================================================================================
  //# POST /api/v1/upload/delete
  //# Request body: filename
  //# This controller will help you to delete the image like profile, banner, background, art any type of images.
  //# =============================================================================================================
  deleteImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { fileUrl } = req.body;
      const fileType = mapFrontendType(req.body.type);
      const userId = req.headers["x-user-id"] as string;

      const dto: DeleteImageRequestDTO = { fileUrl, userId, category: fileType };
      await this._deleteImageUseCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json({ message: UPLOAD_MESSAGES.IMAGE_DELETED_SUCCESSFULLY });
    } catch (error) {
      logger.error(`Error deleting the image ${error}`);
      next(error);
    }
  };

  //# =============================================================================================================
  //# GET SIGNED URL
  //# =============================================================================================================
  //# GET /api/v1/upload/signed-url
  //# Request query: key, type
  //# This controller returns a signed URL for the given key.
  //# =============================================================================================================
  getSignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { key, type } = req.query;
      const fileType = mapFrontendType(type as string);

      if (!key) {
        throw new Error("Key is required");
      }

      const signedUrl = await this._getSignedUrlUseCase.execute(key as string, fileType);

      return res.status(HttpStatus.OK).json({ signedUrl });
    } catch (error) {
      logger.error(`Error getting signed URL ${error}`);
      next(error);
    }
  };
}
